// Imperial Stability Deploy: Phase 13
import { Router } from 'express';
import { supabase } from '../config/database';
import { verifyToken, requireRole, AuthRequest } from '../middleware/auth';
import { createRazorpayOrder, verifyPaymentSignature } from '../config/payment';
import { sendEmail, emailTemplates } from '../config/email';
import axios from 'axios';

const OPAL_AUTOMATION_URL = 'https://opal.google/app/1VyMrnma3KQcM91M0CPdrlbZXf2ZGdu_e';

const router = Router();

// Estimate delivery
router.post('/estimate-delivery', async (req, res) => {
  try {
    const { pincode } = req.body;

    // Validate Indian Pincode
    if (!pincode || !/^\d{6}$/.test(pincode)) {
      return res.status(400).json({ error: 'Please enter a valid 6-digit pincode' });
    }

    // Coimbatore Warehouse mock logic (pincode starts with 64)
    let minDays = 0;
    let maxDays = 0;
    let zone = '';
    let shippingCost = 0;

    const prefix2 = pincode.substring(0, 2);
    const prefix1 = pincode.substring(0, 1);

    if (prefix2 === '64') {
      zone = 'Zone A (Coimbatore Region)';
      minDays = 1;
      maxDays = 2;
      shippingCost = 150;
    } else if (prefix1 === '6') {
      zone = 'Zone B (Tamil Nadu & Kerala)';
      minDays = 2;
      maxDays = 3;
      shippingCost = 150;
    } else if (['4', '5', '7'].includes(prefix1)) {
      zone = 'Zone C (Neighboring States)';
      minDays = 3;
      maxDays = 5;
      shippingCost = 150;
    } else {
      zone = 'Zone D (Rest of India)';
      minDays = 5;
      maxDays = 7;
      shippingCost = 200;
    }

    // Add 1 day warehouse processing time
    minDays += 1;
    maxDays += 1;

    res.json({
      pincode,
      zone,
      minDays,
      maxDays,
      shippingCost,
      message: `Delivery in ${minDays}-${maxDays} days for ₹${shippingCost}`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to estimate delivery' });
  }
});

// Create order
router.post('/', verifyToken, async (req: AuthRequest, res) => {
  try {
    const { items, address_id, address, couponCode } = req.body;
    const userId = req.user?.id || null;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    let finalAddressId = address_id;

    // Create address if object provided
    if (address && !finalAddressId) {
      console.log('--- Order Creation: Creating new address record ---');
      const { data: newAddress, error: addrError } = await supabase
        .from('addresses')
        .insert([
          {
            user_id: userId,
            address_line1: address.address || 'Not Provided',
            city: address.city || 'Not Provided',
            state: address.state || 'Not Provided',
            zipcode: address.zipcode || '000000',
          },
        ])
        .select()
        .single();

      if (addrError) {
        console.error('✗ Supabase Address Insert Error:', addrError);
        return res.status(500).json({ error: 'Failed to create shipping record', details: addrError.message });
      }
      finalAddressId = newAddress.id;
      console.log('✓ Address created:', finalAddressId);
    } else if (finalAddressId === 'temp-address') {
      finalAddressId = null;
    }

    console.log('--- Order Creation: Calculating subtotals ---');

    // Calculate subtotal and store prices
    let subtotal = 0;
    const itemPrices: Record<string, number> = {};
    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('price')
        .eq('id', item.product_id)
        .single();
      if (product) {
        subtotal += product.price * item.quantity;
        itemPrices[item.product_id] = product.price;
      }
    }

    // Coupon validation logic
    let discountAmount = 0;
    let couponId = null;
    if (couponCode) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (coupon) {
        if (coupon.discount_type === 'percentage') {
          discountAmount = (subtotal * coupon.discount_value) / 100;
          if (coupon.max_discount_amount) discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
        } else {
          discountAmount = coupon.discount_value;
        }
        discountAmount = Math.min(discountAmount, subtotal);
        couponId = coupon.id;
      } else if (couponCode) {
        console.warn(`⚠️  Invalid or inactive coupon code attempted: ${couponCode}`);
      }
    }

    // Calculate shipping
    let shippingCost = 200; // Default
    const targetZip = address?.zipcode || '000000';
    if (targetZip.startsWith('64')) shippingCost = 50;
    else if (targetZip.startsWith('6')) shippingCost = 100;

    const total = subtotal + shippingCost - discountAmount;

    // Generate Display ID
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    const displayId = `ORD-${dateStr}-${randomChars}`;

    // Create order record
    console.log('--- Order Creation: Inserting order record ---');
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId,
          address_id: finalAddressId,
          total_amount: total,
          status: 'pending',
          display_id: displayId,
          coupon_id: couponId,
          discount_amount: discountAmount
        },
      ])
      .select()
      .single();

    if (orderError) {
      console.error('✗ Supabase Order Insert Error:', JSON.stringify(orderError, null, 2));
      return res.status(500).json({
        error: 'Failed to create order record',
        details: orderError.message,
        hint: orderError.hint,
        code: orderError.code
      });
    }

    // Add order items with prices
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: itemPrices[item.product_id] || 0
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) {
      console.error('✗ Supabase Order Items Insert Error:', itemsError);
      throw itemsError;
    }

    // Create Razorpay order
    try {
      const razorpayOrder = await createRazorpayOrder(total, order.id);
      res.status(201).json({
        order,
        razorpayOrder,
        key: process.env.RAZORPAY_KEY_ID,
      });
    } catch (rzpError: any) {
      console.error('✗ Razorpay Order Creation Error:', rzpError);
      res.status(500).json({
        error: 'Payment gateway initialization failed',
        details: rzpError.message
      });
    }
  } catch (error: any) {
    console.error('Order creation general failure:', error);
    res.status(500).json({
      error: 'Internal Server Error during checkout',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Verify payment
router.post('/verify-payment', verifyToken, async (req: AuthRequest, res) => {
  try {
    const { orderId, razorpayOrderId, paymentId, signature } = req.body;

    // Check if using placeholder credentials
    if (process.env.SUPABASE_URL?.includes('placeholder')) {
      return res.json({
        message: 'Payment verified (mock)',
        order: { id: orderId, status: 'confirmed', payment_id: paymentId },
      });
    }

    const isValid = verifyPaymentSignature(razorpayOrderId, paymentId, signature);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Update order status
    const { data: order, error } = await supabase
      .from('orders')
      .update({ status: 'confirmed', payment_id: paymentId })
      .eq('id', orderId)
      .select(`
        *,
        users (email, name),
        order_items (
          quantity,
          price,
          product_id,
          products (name, description)
        )
      `)
      .single();

    if (error) throw error;

    // Store payment
    await supabase.from('payments').insert([
      {
        order_id: orderId,
        payment_id: paymentId,
        amount: order.total_amount,
        status: 'completed',
      },
    ]);

    // Send confirmation email
    const { data: user } = await supabase
      .from('users')
      .select('email')
      .eq('id', req.user?.id)
      .single();

    if (user) {
      await sendEmail(
        user.email,
        'Order Confirmation - Itqan Perfumes',
        emailTemplates.orderConfirmation(orderId, order.total_amount),
        process.env.SMTP_FROM || 'itqanperfumes@gmail.com'
      );
    }

    // --- DECREMENT STOCK FOR EACH ITEM ---
    if (order.order_items) {
      console.log('Starting stock deduction process for order:', orderId);
      for (const item of order.order_items) {
        // Fetch current stock
        const { data: currentProduct, error: fetchErr } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.product_id)
          .single();

        if (!fetchErr && currentProduct && currentProduct.stock >= item.quantity) {
          const newStock = currentProduct.stock - item.quantity;
          await supabase
            .from('products')
            .update({ stock: newStock })
            .eq('id', item.product_id);
          console.log(`Decremented stock for product ${item.product_id} to ${newStock}`);
        } else {
          console.error(`Insufficient stock or fetch error for product ${item.product_id}`);
        }
      }
    }

    // --- TRIGGER OPAL AUTOMATION ---
    const { data: address } = await supabase
      .from('addresses')
      .select('*')
      .eq('id', order.address_id)
      .maybeSingle();

    const automationData = {
      customer_email: order.users?.email || user?.email,
      order_id: order.id,
      total_amount: order.total_amount,
      shipping_address: address ?
        `${address.address_line1}, ${address.city}, ${address.state} - ${address.zipcode}` :
        'Not provided',
      order_details: order.order_items?.map((item: any) => ({
        name: item.products?.name,
        quantity: item.quantity,
        price: item.price,
        description: item.products?.description
      }))
    };

    console.log('Triggering Opal Automation with data:', JSON.stringify(automationData, null, 2));

    await axios.post(OPAL_AUTOMATION_URL, automationData).catch(err => {
      console.error('✗ Opal automation trigger failed:', err.message);
    });

    // --- TRIGGER ADDITIONAL WEBHOOK ---
    const WEBHOOK_URL = 'https://workflow-praveen.xyz/webhook-test/5c4ddd6d-fa9f-4bdf-acf6-6b0e286ea903';
    await axios.post(WEBHOOK_URL, {
      message: "Payment Success",
      user: order.users?.email || user?.email,
      orderId: order.id,
      source: "Backend (Post-Payment)"
    }).catch(err => {
      console.error('✗ External webhook trigger failed:', err.message);
    });

    res.json({ message: 'Payment verified successfully and automations triggered', order });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// Get user orders
router.get('/', verifyToken, async (req: AuthRequest, res) => {
  try {
    if (process.env.SUPABASE_URL?.includes('placeholder')) {
      return res.json([
        {
          id: 'order-1',
          user_id: req.user?.id,
          total_amount: 599.98,
          status: 'confirmed',
          created_at: new Date().toISOString(),
        },
      ]);
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', req.user?.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order details
router.get('/:id', verifyToken, async (req: AuthRequest, res) => {
  try {
    if (process.env.SUPABASE_URL?.includes('placeholder')) {
      return res.json({
        id: req.params.id,
        user_id: req.user?.id,
        total_amount: 599.98,
        status: 'confirmed',
        items: [
          {
            id: 'item-1',
            product_id: '1',
            quantity: 2,
            price: 299.99,
          },
        ],
        created_at: new Date().toISOString(),
      });
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    const { data: items } = await supabase
      .from('order_items')
      .select('*, products(name, description, image_url)')
      .eq('order_id', req.params.id);

    let address = null;
    if (order.address_id) {
      const { data: addrData } = await supabase
        .from('addresses')
        .select('*')
        .eq('id', order.address_id)
        .single();
      address = addrData;
    }

    const { data: userData } = await supabase
      .from('users')
      .select('name, email')
      .eq('id', order.user_id)
      .single();

    const { data: history } = await supabase
      .from('order_status_history')
      .select('*, users(name)')
      .eq('order_id', req.params.id)
      .order('created_at', { ascending: false });

    res.json({ ...order, items, address, user: userData, history });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status (admin only)
router.patch('/:id/status', verifyToken, requireRole(['admin', 'super_admin']), async (req: AuthRequest, res) => {
  try {
    if (process.env.SUPABASE_URL?.includes('placeholder')) {
      return res.json({ id: req.params.id, status: req.body.status });
    }

    const { status, comment } = req.body;
    const userId = req.user?.id;

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    // Log status change
    await supabase.from('order_status_history').insert([
      {
        order_id: req.params.id,
        status,
        comment: comment || `Status updated to ${status}`,
        changed_by: userId,
      },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

export default router;
