import { Router } from 'express';
import crypto from 'crypto';
import { supabase } from '../config/database';
import axios from 'axios';

const router = Router();

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'your_webhook_secret';
const OPAL_AUTOMATION_URL = 'https://opal.google/app/1VyMrnma3KQcM91M0CPdrlbZXf2ZGdu_e';

router.post('/razorpay', async (req: any, res) => {
    const signature = req.headers['x-razorpay-signature'];

    // Verify webhook signature
    const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
        .update(JSON.stringify(req.body))
        .digest('hex');

    if (signature !== expectedSignature) {
        console.error('✗ Invalid Razorpay webhook signature');
        return res.status(400).send('Invalid signature');
    }

    const { event, payload } = req.body;

    if (event === 'payment.captured') {
        const payment = payload.payment.entity;
        const orderId = payment.notes.orderId;

        try {
            console.log(`Processing captured payment for order: ${orderId}`);

            // Fetch full order details from Supabase
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .select(`
          *,
          users (email, name),
          order_items (
            quantity,
            price,
            products (name, description)
          )
        `)
                .eq('id', orderId)
                .single();

            if (orderError || !order) {
                throw new Error(orderError?.message || 'Order not found');
            }

            // Fetch address details
            const { data: address, error: addrError } = await supabase
                .from('addresses')
                .select('*')
                .eq('id', order.address_id)
                .single();

            if (addrError) {
                console.warn('Address not found for order notification');
            }

            // --- DECREMENT STOCK FOR EACH ITEM ---
            console.log('Starting stock deduction process...');
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
            // -------------------------------------

            // Format data for Opal automation
            const automationData = {
                customer_email: order.users.email,
                order_id: order.id,
                total_amount: order.total_amount,
                shipping_address: address ?
                    `${address.address_line1}, ${address.city}, ${address.state} - ${address.zipcode}` :
                    'Not provided',
                order_details: order.order_items.map((item: any) => ({
                    name: item.products.name,
                    quantity: item.quantity,
                    price: item.price,
                    description: item.products.description
                }))
            };

            console.log('Triggering Opal Automation with data:', JSON.stringify(automationData, null, 2));

            // Internal call to Opal Automation (Assuming it's a POST endpoint)
            await axios.post(OPAL_AUTOMATION_URL, automationData).catch(err => {
                console.error('✗ Opal automation trigger failed:', err.message);
                // We don't throw here to ensure we respond 200 to Razorpay
            });

            console.log('✓ Razorpay webhook processed successfully');
        } catch (error: any) {
            console.error('✗ Error processing Razorpay webhook:', error.message);
        }
    }

    res.json({ status: 'ok' });
});

// Mock Webhook to test Opal Automation manually
router.post('/mock-payment', async (req: any, res) => {
    const { order_id } = req.body;

    if (!order_id) {
        return res.status(400).json({ error: 'order_id is required' });
    }

    try {
        console.log(`[MOCK] Processing mock payment for order: ${order_id}`);

        // Fetch full order details from Supabase
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select(`
                *,
                users (email, name),
                order_items (
                    quantity,
                    price,
                    products (name, description)
                )
            `)
            .eq('id', order_id)
            .single();

        if (orderError || !order) {
            throw new Error(orderError?.message || 'Order not found');
        }

        // Fetch address details
        const { data: address, error: addrError } = await supabase
            .from('addresses')
            .select('*')
            .eq('id', order.address_id)
            .single();

        // Format data for Opal automation
        const automationData = {
            customer_email: order.users.email,
            order_id: order.id,
            total_amount: order.total_amount,
            shipping_address: address ?
                `${address.address_line1}, ${address.city}, ${address.state} - ${address.zipcode}` :
                'Not provided',
            order_details: order.order_items.map((item: any) => ({
                name: item.products.name,
                quantity: item.quantity,
                price: item.price,
                description: item.products.description
            }))
        };

        console.log('[MOCK] Triggering Opal Automation with data:', JSON.stringify(automationData, null, 2));

        // Internal call to Opal Automation
        await axios.post(OPAL_AUTOMATION_URL, automationData).catch(err => {
            console.error('✗ [MOCK] Opal automation trigger failed:', err.message);
        });

        res.json({ status: 'ok', message: 'Mock payment processed and Opal automation triggered.' });
    } catch (error: any) {
        console.error('✗ [MOCK] Error processing mock payment webhook:', error.message);
        res.status(500).json({ error: error.message });
    }
});

export default router;
