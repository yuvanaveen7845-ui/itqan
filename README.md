# Textile E-Commerce Platform

A production-level textile e-commerce website built with React.js, Next.js, Express.js, Supabase PostgreSQL, and Razorpay payment integration.

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: React Icons

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: Supabase PostgreSQL
- **Authentication**: JWT
- **Payment Gateway**: Razorpay
- **Email Service**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting

### Database
- PostgreSQL with Supabase
- 14 main tables with proper relationships
- Optimized indexes for performance

## 📋 Features

### Public Pages
1. **Home Page** - Hero banner, featured products, categories, newsletter
2. **Product Listing** - Grid layout, filters, search, sorting
3. **Product Details** - Images, descriptions, reviews, add to cart
4. **Search Page** - Advanced search with suggestions

### Customer Features
5. **Authentication** - Register, login, password reset
6. **Dashboard** - Profile, orders, wishlist, addresses
7. **Shopping Cart** - Add/remove items, quantity management
8. **Checkout** - Address selection, payment options
9. **Order Confirmation** - Order summary, tracking
10. **Order Tracking** - Real-time status updates
11. **Wishlist** - Save favorite products

### Admin Features
12. **Dashboard** - Sales, revenue, customer stats
13. **Product Management** - CRUD operations
14. **Inventory Management** - Stock tracking, alerts
15. **Order Management** - View, update status, refunds
16. **Customer Management** - View profiles, history
17. **Review Moderation** - Approve/reject reviews

### Super Admin Features
- Create admin accounts
- Assign roles and permissions
- Platform analytics
- Payment gateway configuration
- Email configuration
- System logs monitoring

### Email Automation
- Welcome email after registration
- Order confirmation
- Payment receipt
- Shipping notification
- Delivery confirmation
- Refund confirmation
- Password reset
- Low stock alerts
- Large order notifications

### Payment System
- Razorpay integration
- Multiple payment methods (UPI, Card, Net Banking, COD)
- Secure payment verification
- Transaction logging
- Refund management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Razorpay account
- Gmail account (for email)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd textile-ecommerce
```

2. **Install dependencies**
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

3. **Setup environment variables**

Backend (.env):
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=rzp_test_S5nRTleVBjqKri
RAZORPAY_KEY_SECRET=5j5F48AszGO0oRdKClZlQFs9
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@textilestore.com
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Frontend (.env.local):
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_S5nRTleVBjqKri
```

4. **Setup Database**
- Create a Supabase project
- Run the SQL schema from `DATABASE_SCHEMA.sql` in Supabase SQL editor
- Enable Row Level Security (RLS) for production

5. **Start development servers**
```bash
npm run dev
```

This will start:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## 📁 Project Structure

```
textile-ecommerce/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   ├── email.ts
│   │   │   └── payment.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── validation.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── products.ts
│   │   │   ├── orders.ts
│   │   │   └── admin.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx (Home)
│   │   │   ├── products/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── admin/
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── lib/
│   │   │   └── api.ts
│   │   └── store/
│   │       ├── auth.ts
│   │       └── cart.ts
│   ├── package.json
│   └── tsconfig.json
├── DATABASE_SCHEMA.sql
├── package.json
└── README.md
```

## 🔐 Security Features

- JWT authentication with expiration
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- Secure API validation with Joi
- Payment signature verification
- Rate limiting on API endpoints
- CORS configuration
- Helmet for HTTP headers security
- Environment variable protection

## 💳 Payment Integration

### Razorpay Setup
1. Create Razorpay account
2. Get API keys from dashboard
3. Add keys to environment variables
4. Payment flow:
   - Customer checkout → Create Razorpay order
   - Customer completes payment
   - Verify payment signature
   - Store order in database
   - Send confirmation email

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-factor authentication
2. Generate app password
3. Use app password in SMTP_PASS
4. Email templates are pre-configured

## 🗄️ Database Schema

### Main Tables
- **users** - User accounts with roles
- **products** - Product catalog
- **product_images** - Product images
- **categories** - Product categories
- **inventory** - Stock management
- **orders** - Customer orders
- **order_items** - Order line items
- **payments** - Payment records
- **reviews** - Product reviews
- **wishlist** - Saved products
- **cart** - Shopping cart
- **addresses** - Delivery addresses
- **coupons** - Discount codes
- **notifications** - User notifications
- **analytics** - Event tracking

## 🧪 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create order
- `POST /api/orders/verify-payment` - Verify payment
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PATCH /api/orders/:id/status` - Update order status (admin)

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/orders` - All orders
- `GET /api/admin/customers` - All customers
- `GET /api/admin/inventory` - Inventory status
- `POST /api/admin/create-admin` - Create admin (super admin)

## 🚢 Deployment

### Backend (Vercel/Railway)
```bash
npm run build
npm start
```

### Frontend (Vercel)
```bash
npm run build
npm start
```

### Database
- Use Supabase managed PostgreSQL
- Enable backups
- Configure RLS policies

## 📊 Advanced Features (Enterprise)

- AI product recommendations
- Abandoned cart email reminders
- Real-time notifications
- Push notifications
- Live chat support
- Multi-currency support
- Multi-language support
- Progressive Web App (PWA)

## 🤝 Contributing

1. Create feature branch
2. Commit changes
3. Push to branch
4. Create Pull Request

## 📝 License

MIT License - feel free to use this project

## 📞 Support

For issues and questions, please create an issue in the repository.

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] AI-powered recommendations
- [ ] Subscription management
- [ ] Vendor management system
- [ ] Multi-warehouse support
- [ ] Advanced inventory forecasting
- [ ] Customer loyalty program

---

**Built with ❤️ for textile e-commerce**
