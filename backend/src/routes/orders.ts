import { Router } from 'express';
import { supabase } from '../config/database';
import { verifyToken, requireRole, AuthRequest } from '../middleware/auth';
import { createRazorpayOrder, verifyPaymentSignature } from '../config/payment';
import { sendEmail, emailTemplates } from '../config/email';

const router = Router();

// Create order
router.post('/', verifyToken, async (req: AuthRequest, res) => {
  try {
    const { items, address_id, address } = req.body;
    const userId = req.user?.id;

    let finalAddressId = address_id;

    // Create address if object provided
    if (address && !finalAddressId) {
      const { data: newAddress, error: addrError } = await supabase
        .from('addresses')
        .insert([
          {
            user_id: userId,
            address_line1: address.address,
            city: address.city,
            state: address.state,
            zipcode: address.zipcode,
          },
        ])
        .select()
        .single();

      if (addrError) throw addrError;
      finalAddressId = newAddress.id;
    } else if (finalAddressId === 'temp-address') {
      // Fallback for placeholder
      finalAddressId = null;
    }

    // Check if using placeholder credentials
    if (process.env.SUPABASE_URL?.includes('placeholder')) {
      const mockOrder = {
        id: 'order-' + Math.random().toString(36).substr(2, 9),
        user_id: userId,
        address_id: finalAddressId,
        total_amount: 599.98,
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      let razorpayOrder;
      try {
        razorpayOrder = await createRazorpayOrder(599.98, mockOrder.id);
      } catch (e) {
        razorpayOrder = { id: `mock_order_${mockOrder.id}`, amount: 599.98, currency: 'INR' };
      }

      return res.status(201).json({
        order: mockOrder,
        razorpayOrder,
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      });
    }

    // Calculate total
    let total = 0;
    for (const item of items) {
      const { data: product } = await supabase
        .from('products')
        .select('price')
        .eq('id', item.product_id)
        .single();
      if (product) total += product.price * item.quantity;
    }

    // Generate Display ID (e.g., ORD-20260310-A1B2)
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    const displayId = `ORD-${dateStr}-${randomChars}`;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId,
          address_id: finalAddressId,
          total_amount: total,
          status: 'pending',
          display_id: displayId,
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // Add order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
    }));

    await supabase.from('order_items').insert(orderItems);

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(total, order.id);

    res.status(201).json({
      order,
      razorpayOrder,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
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
      .select()
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
        'Order Confirmation',
        emailTemplates.orderConfirmation(orderId, order.total_amount)
      );
    }

    res.json({ message: 'Payment verified', order });
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
      .select('*')
      .eq('order_id', req.params.id);

    res.json({ ...order, items });
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

    const { status } = req.body;
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

export default router;
