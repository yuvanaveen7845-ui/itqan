import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/database';
import { verifyToken, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// Dashboard stats
router.get('/dashboard', verifyToken, requireRole(['admin', 'super_admin']), async (req: AuthRequest, res) => {
  try {
    // Check if using placeholder credentials
    if (process.env.SUPABASE_URL?.includes('placeholder')) {
      const salesData = [
        { date: '2026-03-03', revenue: 4000, orders: 12 },
        { date: '2026-03-04', revenue: 3000, orders: 8 },
        { date: '2026-03-05', revenue: 5000, orders: 15 },
        { date: '2026-03-06', revenue: 8000, orders: 20 },
        { date: '2026-03-07', revenue: 6000, orders: 18 },
        { date: '2026-03-08', revenue: 9000, orders: 25 },
        { date: '2026-03-09', revenue: 15000, orders: 40 },
      ];

      return res.json({
        totalRevenue: 50000,
        totalOrders: 150,
        totalCustomers: 500,
        totalProducts: 200,
        salesData,
        recentOrders: [
          {
            id: 'ord-9823',
            user_id: 'user-1',
            total_amount: 1299.99,
            status: 'confirmed',
            created_at: new Date().toISOString(),
          },
          {
            id: 'ord-9824',
            user_id: 'user-2',
            total_amount: 899.50,
            status: 'pending',
            created_at: new Date().toISOString(),
          },
          {
            id: 'ord-9825',
            user_id: 'user-3',
            total_amount: 2499.00,
            status: 'shipped',
            created_at: new Date().toISOString(),
          },
        ],
      });
    }

    const { data: orders } = await supabase
      .from('orders')
      .select('total_amount, created_at')
      .eq('status', 'confirmed');

    const { data: customers } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'customer');

    const { data: products } = await supabase
      .from('products')
      .select('id');

    const totalRevenue = orders?.reduce((sum: number, o: any) => sum + Number(o.total_amount), 0) || 0;
    const totalOrders = orders?.length || 0;
    const totalCustomers = customers?.length || 0;
    const totalProducts = products?.length || 0;

    // Generate salesData for the last 7 days
    const salesDataMap = new Map();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      salesDataMap.set(dateStr, { date: dateStr, revenue: 0, orders: 0 });
    }

    if (orders) {
      orders.forEach((o: any) => {
        const dateStr = new Date(o.created_at).toISOString().split('T')[0];
        if (salesDataMap.has(dateStr)) {
          const existing = salesDataMap.get(dateStr);
          existing.revenue += Number(o.total_amount);
          existing.orders += 1;
        }
      });
    }

    const salesData = Array.from(salesDataMap.values());

    res.json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      salesData,
      recentOrders: (orders || []).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get all orders (admin)
router.get('/orders', verifyToken, requireRole(['admin', 'super_admin']), async (req: AuthRequest, res) => {
  try {
    if (process.env.SUPABASE_URL?.includes('placeholder')) {
      return res.json([
        {
          id: 'order-1',
          user_id: 'user-1',
          total_amount: 599.98,
          status: 'confirmed',
          created_at: new Date().toISOString(),
        },
      ]);
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get all customers (admin)
router.get('/customers', verifyToken, requireRole(['admin', 'super_admin']), async (req: AuthRequest, res) => {
  try {
    if (process.env.SUPABASE_URL?.includes('placeholder')) {
      return res.json([
        {
          id: 'user-1',
          email: 'customer@example.com',
          name: 'John Doe',
          created_at: new Date().toISOString(),
        },
      ]);
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, created_at')
      .eq('role', 'customer');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get inventory (admin)
router.get('/inventory', verifyToken, requireRole(['admin', 'super_admin']), async (req: AuthRequest, res) => {
  try {
    if (process.env.SUPABASE_URL?.includes('placeholder')) {
      return res.json([
        {
          id: '1',
          name: 'Oud Wood Intense',
          description: 'A luxurious woody fragrance featuring premium notes designed for elegance.',
          price: 299.99,
          original_price: 333.32,
          discount: 10,
          fabric_type: 'Woody',
          color: 'Amber',
          stock: 50,
          image_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
          images: [],
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Midnight Rose',
          description: 'A captivating floral blend perfect for evenings.',
          price: 499.99,
          original_price: null,
          discount: 0,
          fabric_type: 'Floral',
          color: 'Pink',
          stock: 30,
          image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800',
          images: [],
          created_at: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Ocean Pearl',
          description: 'Fresh and invigorating citrus notes for daily wear.',
          price: 199.99,
          original_price: null,
          discount: 0,
          fabric_type: 'Fresh',
          color: 'Blue',
          stock: 40,
          image_url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&q=80&w=800',
          images: [],
          created_at: new Date().toISOString(),
        },
      ]);
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// Create admin account (super admin only)
router.post('/create-admin', verifyToken, requireRole(['super_admin']), async (req: AuthRequest, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const targetRole = role === 'super_admin' ? 'super_admin' : 'admin';
    const hashedPassword = await bcrypt.hash(password, 10);

    if (process.env.SUPABASE_URL?.includes('placeholder')) {
      return res.status(201).json({
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        email,
        name,
        role: targetRole,
      });
    }

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          password: hashedPassword,
          name,
          role: targetRole,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Create Admin Error:', error);
    res.status(500).json({ error: 'Failed to create admin' });
  }
});

// Mock global settings (per-session/per-process for demo)
let systemSettings = {
  maintenanceMode: false,
  apiRateLimit: 'Standard',
  lastBackup: new Date().toISOString()
};

// Get system settings
router.get('/settings', verifyToken, requireRole(['admin', 'super_admin']), async (req: AuthRequest, res) => {
  res.json(systemSettings);
});

// Update system settings (Super Admin only)
router.post('/settings', verifyToken, requireRole(['super_admin']), async (req: AuthRequest, res) => {
  try {
    const { maintenanceMode } = req.body;
    if (typeof maintenanceMode === 'boolean') {
      systemSettings.maintenanceMode = maintenanceMode;
    }
    res.json({ message: 'Settings updated successfully', settings: systemSettings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
