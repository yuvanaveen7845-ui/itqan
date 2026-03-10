import { Router } from 'express';
import { supabase } from '../config/database';
import { verifyToken, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all coupons (admin)
router.get('/', verifyToken, requireRole(['admin', 'super_admin']), async (req: AuthRequest, res) => {
    try {
        if (process.env.SUPABASE_URL?.includes('placeholder')) {
            return res.json([
                { id: 'c1', code: 'WELCOME10', discount_type: 'percentage', discount_value: 10, is_active: true },
            ]);
        }

        const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch coupons' });
    }
});

// Create coupon (admin)
router.post('/', verifyToken, requireRole(['admin', 'super_admin']), async (req: AuthRequest, res) => {
    try {
        if (process.env.SUPABASE_URL?.includes('placeholder')) {
            return res.status(201).json({ id: 'c-' + Math.random(), ...req.body });
        }

        const { data, error } = await supabase
            .from('coupons')
            .insert([req.body])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create coupon' });
    }
});

// Validate coupon
router.post('/validate', async (req, res) => {
    try {
        const { code, amount } = req.body;

        if (process.env.SUPABASE_URL?.includes('placeholder')) {
            if (code === 'WELCOME10') {
                return res.json({
                    valid: true,
                    discount_type: 'percentage',
                    discount_value: 10,
                    discount_amount: amount * 0.1
                });
            }
            return res.status(400).json({ valid: false, error: 'Invalid coupon' });
        }

        const { data: coupon, error } = await supabase
            .from('coupons')
            .select('*')
            .eq('code', code.toUpperCase())
            .eq('is_active', true)
            .single();

        if (error || !coupon) {
            return res.status(400).json({ valid: false, error: 'Invalid or expired coupon' });
        }

        // Date validation
        const now = new Date();
        if (coupon.start_date && new Date(coupon.start_date) > now) {
            return res.status(400).json({ valid: false, error: 'Coupon not yet active' });
        }
        if (coupon.end_date && new Date(coupon.end_date) < now) {
            return res.status(400).json({ valid: false, error: 'Coupon expired' });
        }

        // Usage limit validation
        if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
            return res.status(400).json({ valid: false, error: 'Coupon usage limit reached' });
        }

        // Min order amount validation
        if (coupon.min_order_amount && amount < coupon.min_order_amount) {
            return res.status(400).json({ valid: false, error: `Minimum order of ₹${coupon.min_order_amount} required` });
        }

        let discountAmount = 0;
        if (coupon.discount_type === 'percentage') {
            discountAmount = (amount * coupon.discount_value) / 100;
            if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
                discountAmount = coupon.max_discount_amount;
            }
        } else {
            discountAmount = coupon.discount_value;
        }

        res.json({
            valid: true,
            code: coupon.code,
            discount_type: coupon.discount_type,
            discount_value: coupon.discount_value,
            discount_amount: Math.min(discountAmount, amount)
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to validate coupon' });
    }
});

// Delete coupon
router.delete('/:id', verifyToken, requireRole(['admin', 'super_admin']), async (req: AuthRequest, res) => {
    try {
        if (process.env.SUPABASE_URL?.includes('placeholder')) {
            return res.json({ message: 'Deleted' });
        }

        const { error } = await supabase
            .from('coupons')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Coupon deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete coupon' });
    }
});

export default router;
