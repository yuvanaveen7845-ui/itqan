# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Prerequisites
- Node.js 18+
- Supabase account
- Razorpay account
- Gmail account

### Step 1: Clone & Install (1 min)
```bash
git clone <repo-url>
cd textile-ecommerce
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### Step 2: Setup Environment (2 min)

**Backend (.env)**
```bash
cd backend
cp .env.example .env
# Edit .env with your credentials
```

**Frontend (.env.local)**
```bash
cd ../frontend
cp .env.local.example .env.local
# Edit .env.local with your keys
```

### Step 3: Database Setup (1 min)
1. Go to Supabase dashboard
2. SQL Editor → New Query
3. Copy content from `DATABASE_SCHEMA.sql`
4. Execute

### Step 4: Start Development (1 min)
```bash
# From root directory
npm run dev
```

This starts:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## 🧪 Quick Test

### Test Backend
```bash
curl http://localhost:5000/health
# Should return: {"status":"ok"}
```

### Test Frontend
- Open http://localhost:3000
- Should see home page

### Test Registration
1. Go to Register
2. Create account
3. Check email for welcome message

### Test Shopping
1. Go to Products
2. Add item to cart
3. Go to Checkout
4. Use test card: 4111111111111111

## 📝 Environment Variables

### Backend (.env)
```
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
JWT_SECRET=random_string
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY=your_key
```

## 🔑 Get Your Keys

### Supabase
1. supabase.com → Sign up
2. Create project
3. Settings → API → Copy URL & Key

### Razorpay
1. razorpay.com → Sign up
2. Settings → API Keys
3. Copy Key ID & Secret

### Gmail
1. myaccount.google.com
2. Enable 2FA
3. myaccount.google.com/apppasswords
4. Generate app password

## 📂 Project Structure
```
textile-ecommerce/
├── backend/          # Express API
├── frontend/         # Next.js app
├── DATABASE_SCHEMA.sql
├── README.md
├── SETUP_GUIDE.md
├── DEPLOYMENT.md
└── package.json
```

## 🛠️ Common Commands

### Development
```bash
npm run dev              # Start both
npm run dev:backend     # Backend only
npm run dev:frontend    # Frontend only
```

### Build
```bash
npm run build           # Build both
npm run build:backend   # Backend only
npm run build:frontend  # Frontend only
```

### Production
```bash
npm start              # Start backend
cd frontend && npm start  # Start frontend
```

## 🐛 Troubleshooting

### Port in use?
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Database error?
- Check SUPABASE_URL and SUPABASE_KEY
- Verify database schema is imported
- Check internet connection

### Email not working?
- Verify SMTP credentials
- Check Gmail app password
- Enable "Less secure app access"

### Payment not working?
- Use test card: 4111111111111111
- Check Razorpay keys
- Verify test mode is enabled

## 📚 Documentation

- [Complete Setup Guide](./SETUP_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Features List](./FEATURES.md)
- [Full README](./README.md)

## 🎯 Next Steps

1. ✅ Get running locally
2. ✅ Test all features
3. ✅ Customize branding
4. ✅ Add more products
5. ✅ Deploy to production

## 🆘 Need Help?

1. Check logs: `npm run dev` output
2. Check browser console: F12
3. Review error messages
4. Check documentation
5. Create GitHub issue

## 🚀 Deploy

### Frontend (Vercel)
```bash
vercel
```

### Backend (Railway)
- Connect GitHub
- Set environment variables
- Auto-deploys on push

## 💡 Pro Tips

- Use test Razorpay keys for development
- Check email spam folder
- Monitor logs for errors
- Test on mobile devices
- Use browser DevTools

## 📞 Support

- GitHub Issues
- Documentation
- Community Forums
- Email Support

---

**You're ready to go! Happy coding! 🎉**

For detailed setup, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)
