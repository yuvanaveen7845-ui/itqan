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

    const totalRevenue = orders?.reduce((sum: number, o: any) => sum + o.total_amount, 0) || 0;
    const totalOrders = orders?.length || 0;
    const totalCustomers = customers?.length || 0;
    const totalProducts = products?.length || 0;

    res.json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      salesData: [], // Default empty or fetch actual sales trend
      recentOrders: orders?.slice(0, 10) || [],
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
          name: 'Premium Cotton Fabric',
          description: 'High quality cotton fabric',
          price: 299.99,
          original_price: 333.32,
          discount: 10,
          fabric_type: 'Cotton',
          color: 'White',
          stock: 50,
          image_url: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80&w=800',
          images: [],
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Silk Blend Fabric',
          description: 'Luxurious silk blend',
          price: 499.99,
          original_price: null,
          discount: 0,
          fabric_type: 'Silk',
          color: 'Blue',
          stock: 30,
          image_url: 'https://images.unsplash.com/photo-1595180120153-f72cb9a25b16?auto=format&fit=crop&q=80&w=800',
          images: [],
          created_at: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Linen Fabric',
          description: 'Natural linen fabric',
          price: 199.99,
          original_price: null,
          discount: 0,
          fabric_type: 'Linen',
          color: 'Beige',
          stock: 40,
          image_url: 'https://images.unsplash.com/photo-1606502287413-eb8006bf3888?auto=format&fit=crop&q=80&w=800',
          images: [],
          created_at: new Date().toISOString(),
        },
        {
          id: '4',
          name: 'Rose Essence Perfume',
          description: 'Premium natural rose perfume',
          price: 999.99,
          original_price: null,
          discount: 0,
          fabric_type: 'Perfume',
          color: 'Pink',
          stock: 15,
          image_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
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
