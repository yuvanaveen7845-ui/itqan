import { Router } from 'express';
import { supabase } from '../config/database';
import { verifyToken, requireRole, AuthRequest } from '../middleware/auth';
import { validate, schemas } from '../middleware/validation';

const router = Router();

// Get all products with filters
router.get('/', async (req, res) => {
  try {
    // Check if using placeholder credentials
    if (process.env.SUPABASE_URL?.includes('placeholder')) {
      // Return mock products for development
      const mockProducts = [
        {
          id: '1',
          name: 'Premium Cotton Fabric',
          description: 'High quality cotton fabric',
          price: 299.99,
          fabric_type: 'Cotton',
          color: 'White',
          stock: 50,
          image_url: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80&w=800',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Silk Blend Fabric',
          description: 'Luxurious silk blend',
          price: 499.99,
          fabric_type: 'Silk',
          color: 'Blue',
          stock: 30,
          image_url: 'https://images.unsplash.com/photo-1595180120153-f72cb9a25b16?auto=format&fit=crop&q=80&w=800',
          created_at: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Linen Fabric',
          description: 'Natural linen fabric',
          price: 199.99,
          fabric_type: 'Linen',
          color: 'Beige',
          stock: 40,
          image_url: 'https://images.unsplash.com/photo-1606502287413-eb8006bf3888?auto=format&fit=crop&q=80&w=800',
          created_at: new Date().toISOString(),
        },
        {
          id: '4',
          name: 'Rose Essence Perfume',
          description: 'Premium natural rose perfume',
          price: 999.99,
          fabric_type: 'Perfume',
          color: 'Pink',
          stock: 15,
          image_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
          created_at: new Date().toISOString(),
        },
      ];
      return res.json({ products: mockProducts, total: mockProducts.length, page: 1, limit: 20 });
    }

    const { fabric_type, color, price_min, price_max, search, page = 1, limit = 20 } = req.query;
    let query = supabase.from('products').select('*');

    if (fabric_type) query = query.eq('fabric_type', fabric_type);
    if (color) query = query.eq('color', color);
    if (price_min) query = query.gte('price', price_min);
    if (price_max) query = query.lte('price', price_max);
    if (search) query = query.ilike('name', `%${search}%`);

    const offset = (Number(page) - 1) * Number(limit);
    const { data, error, count } = await query
      .range(offset, offset + Number(limit) - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ products: data, total: count, page, limit });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    // Check if using placeholder credentials
    if (process.env.SUPABASE_URL?.includes('placeholder')) {
      const mockProduct = {
        id: req.params.id,
        name: 'Premium Cotton Fabric',
        description: 'High quality cotton fabric perfect for any occasion',
        price: 299.99,
        fabric_type: 'Cotton',
        color: 'White',
        size: '1 meter',
        pattern: 'Plain',
        stock: 50,
        discount: 10,
        original_price: 333.32,
        image_url: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80&w=800',
        images: [
          'https://images.unsplash.com/photo-1574634534894-89d7576c8259?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1584184924103-e310d9dc85fc?auto=format&fit=crop&q=80&w=800'
        ],
        created_at: new Date().toISOString(),
      };
      return res.json(mockProduct);
    }

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Create product (admin only)
router.post('/', verifyToken, requireRole(['admin', 'super_admin']), validate(schemas.product), async (req: AuthRequest, res) => {
  try {
    if (process.env.SUPABASE_URL?.includes('placeholder')) {
      return res.status(201).json({ id: 'dev-' + Math.random().toString(36).substr(2, 9), ...req.body });
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{ ...req.body, created_by: req.user?.id }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    console.error('Create Product Error:', error);
    res.status(500).json({
      error: 'Database error: Failed to create product',
      details: error.message || error
    });
  }
});

// Update product (admin only)
router.put('/:id', verifyToken, requireRole(['admin', 'super_admin']), async (req: AuthRequest, res) => {
  try {
    if (process.env.SUPABASE_URL?.includes('placeholder')) {
      return res.json({ id: req.params.id, ...req.body });
    }

    const { data, error } = await supabase
      .from('products')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (admin only)
router.delete('/:id', verifyToken, requireRole(['admin', 'super_admin']), async (req: AuthRequest, res) => {
  try {
    if (process.env.SUPABASE_URL?.includes('placeholder')) {
      return res.json({ message: 'Product deleted' });
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
