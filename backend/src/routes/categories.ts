import { Router } from 'express';
import { supabase } from '../config/database';
import { verifyToken, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all categories
router.get('/', async (req, res) => {
    try {
        if (process.env.SUPABASE_URL?.includes('placeholder')) {
            return res.json([
                { id: 'cat-1', name: 'Perfumes', description: 'Premium fragrances', parent_id: null },
                { id: 'cat-2', name: 'Oud', description: 'Pure Agarwood', parent_id: 'cat-1' },
            ]);
        }

        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Create category (admin)
router.post('/', verifyToken, requireRole(['admin', 'super_admin']), async (req: AuthRequest, res) => {
    try {
        if (process.env.SUPABASE_URL?.includes('placeholder')) {
            return res.status(201).json({ id: 'cat-' + Math.random(), ...req.body });
        }

        const { data, error } = await supabase
            .from('categories')
            .insert([req.body])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create category' });
    }
});

// Update category (admin)
router.put('/:id', verifyToken, requireRole(['admin', 'super_admin']), async (req: AuthRequest, res) => {
    try {
        if (process.env.SUPABASE_URL?.includes('placeholder')) {
            return res.json({ id: req.params.id, ...req.body });
        }

        const { data, error } = await supabase
            .from('categories')
            .update(req.body)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update category' });
    }
});

// Delete category (admin)
router.delete('/:id', verifyToken, requireRole(['admin', 'super_admin']), async (req: AuthRequest, res) => {
    try {
        if (process.env.SUPABASE_URL?.includes('placeholder')) {
            return res.json({ message: 'Category deleted' });
        }

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

export default router;
