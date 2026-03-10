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

const app = express();
const PORT = process.env.PORT || 5000;

// Manual CORS and Logger Middleware
app.use((req, res, next) => {
  const origin = req.get('origin') || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, origin');

  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${origin}`);

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

// Root test route
app.get('/', (req, res) => {
  res.json({
    message: 'Itqan Backend API is running!',
    environment: process.env.NODE_ENV,
    database: process.env.SUPABASE_URL ? 'Configured' : 'Missing'
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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Initialize and start
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
