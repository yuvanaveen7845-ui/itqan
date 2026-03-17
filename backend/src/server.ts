// Triggered redeployment - 2026-03-10
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { initializeDatabase } from './config/database';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import adminRoutes from './routes/admin';
import wishlistRoutes from './routes/wishlist';
import cartRoutes from './routes/cart';
import webhookRoutes from './routes/webhooks';
import categoryRoutes from './routes/categories';
import couponRoutes from './routes/coupons';
import cmsRoutes from './routes/cms';

const app = express();
const PORT = process.env.PORT || 5000;

// Manual CORS and Logger Middleware (First in chain)
app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, Accept, Origin');

  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${origin}`);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));
app.use(express.json());

// Root test route - No CORS issues here when accessed via browser
app.get('/', (req, res) => {
  res.json({
    message: 'Itqan Backend API is running!',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/cms', cmsRoutes);

// Static file serving for uploads
import path from 'path';
app.use('/uploads', express.static(path.join(__dirname, '../../public/uploads')));

// Image Upload Routes
import uploadRoutes from './routes/upload';
app.use('/api/admin/upload', uploadRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Global Error Handler (Ensures CORS headers even on crash)
app.use((err: any, req: any, res: any, next: any) => {
  console.error('SERVER ERROR:', err);
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Initialize and start
const startServer = async () => {
  try {
    console.log('--- EXECUTING DEPLOYMENT DEBUG STARTUP ---');
    console.log(`TIME: ${new Date().toISOString()}`);
    console.log(`PORT: ${PORT}`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

    // Start listening immediately so Railway/Load Balancer sees us as healthy
    const server = app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`✓ [PROCESS UP] Server is listening on 0.0.0.0:${PORT}`);
      console.log(`✓ Health Check: /health`);
    });

    // Try to init DB in background
    console.log('Attempting Database Connection...');
    initializeDatabase()
      .then(() => console.log('✓ Database initialization finished'))
      .catch((err) => console.error('✗ Database initialization failed:', err));

  } catch (error) {
    console.error('✗ FAIL: Unexpected error during startServer:', error);
    process.exit(1);
  }
};

startServer();
