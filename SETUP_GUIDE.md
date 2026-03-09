# Complete Setup Guide

## Step 1: Prerequisites Installation

### Install Node.js
- Download from nodejs.org (v18 or higher)
- Verify: `node --version` and `npm --version`

### Install Git
- Download from git-scm.com
- Verify: `git --version`

## Step 2: Create Accounts

### Supabase
1. Go to supabase.com
2. Sign up with GitHub
3. Create new project
4. Wait for initialization
5. Copy Project URL and API Key

### Razorpay
1. Go to razorpay.com
2. Sign up
3. Verify email and phone
4. Go to Settings > API Keys
5. Copy Key ID and Key Secret

### Gmail (for email)
1. Go to myaccount.google.com
2. Enable 2-factor authentication
3. Go to myaccount.google.com/apppasswords
4. Select Mail and Windows Computer
5. Generate and copy app password

## Step 3: Clone Repository

```bash
git clone <repository-url>
cd textile-ecommerce
```

## Step 4: Backend Setup

### Install Dependencies
```bash
cd backend
npm install
```

### Create .env File
```bash
cp .env.example .env
```

### Edit .env with Your Values
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=generate_a_random_string_here
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@textilestore.com
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Setup Database
1. Go to Supabase dashboard
2. Go to SQL Editor
3. Create new query
4. Copy content from DATABASE_SCHEMA.sql
5. Paste and execute

### Test Backend
```bash
npm run dev
```
Should see: `✓ Server running on port 5000`

## Step 5: Frontend Setup

### Install Dependencies
```bash
cd ../frontend
npm install
```

### Create .env.local File
```bash
cp .env.local.example .env.local
```

### Edit .env.local
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY=your_razorpay_key_id
```

### Test Frontend
```bash
npm run dev
```
Should see: `✓ Ready in X.XXs`

## Step 6: Verify Everything Works

### Test Backend API
```bash
curl http://localhost:5000/health
```
Should return: `{"status":"ok"}`

### Test Frontend
- Open http://localhost:3000
- Should see home page with products

### Test Authentication
1. Go to Register page
2. Create account
3. Should receive welcome email
4. Login with credentials

### Test Product Browsing
1. Go to Products page
2. Should see products from database
3. Try filters and search

### Test Shopping Cart
1. Add product to cart
2. Go to cart page
3. Verify items and total

### Test Checkout (Demo)
1. Go to checkout
2. Fill address
3. Click "Proceed to Payment"
4. Use Razorpay test card: 4111111111111111

## Step 7: Admin Setup

### Create Admin Account
1. Go to Supabase dashboard
2. Go to SQL Editor
3. Run:
```sql
INSERT INTO users (email, password, name, role)
VALUES (
  'admin@textilestore.com',
  '$2a$10$...', -- bcrypt hash of password
  'Admin User',
  'admin'
);
```

### Login as Admin
1. Go to login page
2. Use admin@textilestore.com
3. Go to /admin
4. Should see dashboard

### Add Products
1. Go to Admin > Product Management
2. Click "Add Product"
3. Fill form and submit
4. Should appear on products page

## Step 8: Email Testing

### Test Email Sending
1. Register new account
2. Check email inbox
3. Should receive welcome email

### Troubleshoot Email
- Check SMTP credentials
- Verify Gmail app password
- Check spam folder
- Review backend logs

## Step 9: Payment Testing

### Razorpay Test Mode
- Use test keys (already provided)
- Test card: 4111111111111111
- Any future date for expiry
- Any 3-digit CVV

### Test Payment Flow
1. Add product to cart
2. Go to checkout
3. Fill address
4. Click "Proceed to Payment"
5. Use test card
6. Should see success message

## Step 10: Production Checklist

Before deploying to production:

- [ ] Change all default passwords
- [ ] Update JWT_SECRET to random string
- [ ] Setup production database backups
- [ ] Enable HTTPS
- [ ] Setup monitoring and alerts
- [ ] Configure rate limiting
- [ ] Setup error logging
- [ ] Test all payment scenarios
- [ ] Test email notifications
- [ ] Security audit
- [ ] Performance testing
- [ ] Load testing

## Common Issues & Solutions

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Database Connection Failed
- Verify SUPABASE_URL and SUPABASE_KEY
- Check internet connection
- Verify database is running

### Email Not Sending
- Verify SMTP credentials
- Check Gmail app password
- Enable "Less secure app access"
- Check spam folder

### Payment Not Working
- Verify Razorpay keys
- Check test mode is enabled
- Verify webhook URL
- Check browser console for errors

### Frontend Not Connecting to Backend
- Verify NEXT_PUBLIC_API_URL
- Check backend is running
- Check CORS settings
- Verify firewall rules

## Next Steps

1. Customize branding and colors
2. Add more products
3. Setup email templates
4. Configure payment methods
5. Setup analytics
6. Deploy to production
7. Setup monitoring
8. Configure backups

## Support

For issues:
1. Check logs: `npm run dev` output
2. Check browser console (F12)
3. Check Supabase dashboard
4. Review error messages carefully
5. Search documentation

## Resources

- Next.js: nextjs.org/docs
- Express: expressjs.com
- Supabase: supabase.com/docs
- Razorpay: razorpay.com/docs
- Tailwind: tailwindcss.com/docs

---

**You're all set! Happy coding! 🚀**
