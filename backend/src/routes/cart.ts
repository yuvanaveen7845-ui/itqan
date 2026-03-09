import { Router } from 'express';
import { supabase } from '../config/database';
import { verifyToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Get user cart
router.get('/', verifyToken, async (req: AuthRequest, res) => {
    try {
        const userId = req.user?.id;

        if (process.env.SUPABASE_URL?.includes('placeholder')) {
            return res.json([]);
        }

        const { data, error } = await supabase
            .from('cart_items')
            .select('*, products(*)')
            .eq('user_id', userId);

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
});

// Sync cart (Bulk update)
router.post('/sync', verifyToken, async (req: AuthRequest, res) => {
    try {
        const { items } = req.body; // Array of { product_id, quantity }
        const userId = req.user?.id;

        if (process.env.SUPABASE_URL?.includes('placeholder')) {
            return res.json({ message: 'Cart synced (mock)' });
        }

        // Clear existing cart and insert new items
        await supabase.from('cart_items').delete().eq('user_id', userId);

        if (items.length > 0) {
            const cartItems = items.map((item: any) => ({
                user_id: userId,
                product_id: item.product_id,
                quantity: item.quantity,
            }));
            const { error } = await supabase.from('cart_items').insert(cartItems);
            if (error) throw error;
        }

        res.json({ message: 'Cart synced' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to sync cart' });
    }
});

// Update item quantity
router.patch('/:productId', verifyToken, async (req: AuthRequest, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const userId = req.user?.id;

        if (process.env.SUPABASE_URL?.includes('placeholder')) {
            return res.json({ message: 'Updated quantity (mock)' });
        }

        const { error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('user_id', userId)
            .eq('product_id', productId);

        if (error) throw error;
        res.json({ message: 'Quantity updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update quantity' });
    }
});

// Remove item
router.delete('/:productId', verifyToken, async (req: AuthRequest, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user?.id;

        if (process.env.SUPABASE_URL?.includes('placeholder')) {
            return res.json({ message: 'Removed from cart (mock)' });
        }

        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);

        if (error) throw error;
        res.json({ message: 'Removed from cart' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove from cart' });
    }
});

export default router;
