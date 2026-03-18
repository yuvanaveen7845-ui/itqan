import { Router } from 'express';
import { supabase } from '../config/database';
import { verifyToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Get user wishlist
router.get('/', verifyToken, async (req: AuthRequest, res) => {
    try {
        const userId = req.user?.id;

        if (process.env.SUPABASE_URL?.includes('placeholder')) {
            return res.json([]);
        }

        const { data, error } = await supabase
            .from('wishlist')
            .select('*, products(*)')
            .eq('user_id', userId);

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
});

// Add to wishlist
router.post('/', verifyToken, async (req: AuthRequest, res) => {
    try {
        const { product_id } = req.body;
        const userId = req.user?.id;

        if (process.env.SUPABASE_URL?.includes('placeholder')) {
            return res.status(201).json({ message: 'Added to wishlist (mock)' });
        }

        // Check if already in wishlist to prevent 500 on duplicate constraint violation
        const { data: existing } = await supabase
            .from('wishlist')
            .select('id')
            .eq('user_id', userId)
            .eq('product_id', product_id)
            .single();

        if (existing) {
            return res.status(200).json(existing);
        }

        const { data, error } = await supabase
            .from('wishlist')
            .insert([{ user_id: userId, product_id }])
            .select()
            .single();

        if (error) {
            console.error('Wishlist Insert Error:', error);
            throw error;
        }
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add to wishlist' });
    }
});

// Remove from wishlist
router.delete('/:productId', verifyToken, async (req: AuthRequest, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user?.id;

        if (process.env.SUPABASE_URL?.includes('placeholder')) {
            return res.json({ message: 'Removed from wishlist (mock)' });
        }

        const { error } = await supabase
            .from('wishlist')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);

        if (error) throw error;
        res.json({ message: 'Removed from wishlist' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove from wishlist' });
    }
});

export default router;
