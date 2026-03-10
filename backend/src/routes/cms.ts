import { Router } from 'express';
import { supabase } from '../config/database';
import { verifyToken, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// --- SITE SETTINGS ---

// Get site settings
router.get('/settings', async (req, res) => {
    try {
        const { data, error } = await supabase.from('site_settings').select('*');
        if (error) throw error;

        const settings = data.reduce((acc: any, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch site settings' });
    }
});

// Update site settings (Super Admin only)
router.post('/settings', verifyToken, requireRole(['super_admin']), async (req: AuthRequest, res) => {
    try {
        const { key, value } = req.body;
        const { data, error } = await supabase
            .from('site_settings')
            .upsert({ key, value, updated_at: new Date().toISOString() })
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update site settings' });
    }
});

// --- HERO BANNERS ---

// Get all active banners
router.get('/banners', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('hero_banners')
            .select('*')
            .eq('is_active', true)
            .order('order_index', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch banners' });
    }
});

// Admin: Get all banners (including inactive)
router.get('/banners/all', verifyToken, requireRole(['admin', 'super_admin']), async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('hero_banners')
            .select('*')
            .order('order_index', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch all banners' });
    }
});

// Admin: Create/Update banner
router.post('/banners', verifyToken, requireRole(['admin', 'super_admin']), async (req, res) => {
    try {
        const banner = req.body;
        const { data, error } = await supabase
            .from('hero_banners')
            .upsert(banner)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save banner' });
    }
});

// Admin: Delete banner
router.delete('/banners/:id', verifyToken, requireRole(['admin', 'super_admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from('hero_banners').delete().eq('id', id);
        if (error) throw error;
        res.json({ message: 'Banner deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete banner' });
    }
});

// --- CONTENT PAGES ---

// Get page by slug
router.get('/pages/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const { data, error } = await supabase
            .from('content_pages')
            .select('*')
            .eq('slug', slug)
            .eq('is_published', true)
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(404).json({ error: 'Page not found' });
    }
});

// Admin: Get all pages
router.get('/pages', verifyToken, requireRole(['admin', 'super_admin']), async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('content_pages')
            .select('id, slug, title, is_published, updated_at');

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pages' });
    }
});

// Admin: Create/Update page
router.post('/pages', verifyToken, requireRole(['admin', 'super_admin']), async (req, res) => {
    try {
        const page = req.body;
        const { data, error } = await supabase
            .from('content_pages')
            .upsert({ ...page, updated_at: new Date().toISOString() })
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save page' });
    }
});

export default router;
