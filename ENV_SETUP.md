# Environment Setup Guide

## 🔑 Getting All Required Keys and Credentials

### 1. Supabase Setup

#### Step 1: Create Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub or email
4. Verify email

#### Step 2: Create Project
1. Click "New Project"
2. Enter project name: `textile-ecommerce`
3. Create a strong password
4. Select region closest to you
5. Click "Create new project"
6. Wait for initialization (2-3 minutes)

#### Step 3: Get Credentials
1. Go to Settings → API
2. Copy these values:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_KEY`

#### Step 4: Import Database Schema
1. Go to SQL Editor
2. Click "New Query"
3. Copy entire content from `DATABASE_SCHEMA.sql`
4. Paste into editor
5. Click "Run"
6. Wait for completion

---

### 2. Razorpay Setup

#### Step 1: Create Account
1. Go to [razorpay.com](https://razorpay.com)
2. Click "Sign Up"
3. Enter email and password
4. Verify email

#### Step 2: Complete KYC
1. Go to Settings → Account
2. Fill in business details
3. Upload required documents
4. Wait for verification (usually instant)

#### Step 3: Get API Keys
1. Go to Settings → API Keys
2. You'll see two keys:
   - **Key ID** → `RAZORPAY_KEY_ID`
   - **Key Secret** → `RAZORPAY_KEY_SECRET`
3. Copy both values

#### Step 4: Enable Test Mode
1. Make sure you're in Test Mode (toggle at top)
2. Use test keys for development

#### Test Card Details
- Card Number: `4111111111111111`
- Expiry: Any future date (e.g., 12/25)
- CVV: Any 3 digits (e.g., 123)

---

### 3. Gmail Setup (for Email)

#### Step 1: Enable 2-Factor Authentication
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click "Security" in left menu
3. Scroll to "2-Step Verification"
4. Click "Get Started"
5. Follow the steps to enable 2FA

#### Step 2: Generate App Password
1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Windows Computer"
3. Click "Generate"
4. Copy the 16-character password
5. This is your `SMTP_PASS`

#### Step 3: Note Your Email
- Your Gmail address is `SMTP_USER`
- Example: `your.email@gmail.com`

---

## 📝 Backend Environment Variables

### Create `.env` file in `backend/` directory

```bash
cd backend
cp .env.example .env
```

### Edit `backend/.env`

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_S5nRTleVBjqKri
RAZORPAY_KEY_SECRET=5j5F48AszGO0oRdKClZlQFs9

# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
SMTP_FROM=noreply@textilestore.com

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Important Notes
- `JWT_SECRET`: Generate a random string (use `openssl rand -base64 32`)
- `SMTP_PASS`: Use the 16-character app password from Gmail
- `RAZORPAY_KEY_*`: Use test keys for development
- Never commit `.env` file to git

---

## 📝 Frontend Environment Variables

### Create `.env.local` file in `frontend/` directory

```bash
cd frontend
cp .env.local.example .env.local
```

### Edit `frontend/.env.local`

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_S5nRTleVBjqKri
```

### Important Notes
- `NEXT_PUBLIC_*` variables are exposed to browser
- Never put secrets in frontend env vars
- Use test Razorpay key for development

---

## 🔐 Generating JWT Secret

### Option 1: Using OpenSSL (Linux/Mac)
```bash
openssl rand -base64 32
```

### Option 2: Using Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Option 3: Using Python
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## ✅ Verification Checklist

### Backend
- [ ] `backend/.env` file created
- [ ] All Supabase values filled
- [ ] JWT_SECRET is random string
- [ ] Razorpay keys added
- [ ] Gmail credentials configured
- [ ] PORT is 5000
- [ ] FRONTEND_URL is correct

### Frontend
- [ ] `frontend/.env.local` file created
- [ ] API_URL points to backend
- [ ] Razorpay key is test key
- [ ] No secrets in frontend env

### Database
- [ ] Supabase project created
- [ ] Database schema imported
- [ ] Tables visible in Supabase
- [ ] Can connect from backend

### Email
- [ ] Gmail 2FA enabled
- [ ] App password generated
- [ ] SMTP credentials correct
- [ ] Can send test email

### Payment
- [ ] Razorpay account created
- [ ] Test keys obtained
- [ ] Test mode enabled
- [ ] Test card ready

---

## 🧪 Testing Configuration

### Test Backend Connection
```bash
cd backend
npm run dev
```

Should see:
```
✓ Database connected successfully
✓ Server running on port 5000
```

### Test Frontend Connection
```bash
cd frontend
npm run dev
```

Should see:
```
✓ Ready in X.XXs
```

### Test API
```bash
curl http://localhost:5000/health
```

Should return:
```json
{"status":"ok"}
```

### Test Email
1. Register new account
2. Check email inbox
3. Should receive welcome email

### Test Payment
1. Add product to cart
2. Go to checkout
3. Use test card: 4111111111111111
4. Should complete successfully

---

## 🚨 Troubleshooting

### "Cannot connect to database"
- Verify SUPABASE_URL is correct
- Verify SUPABASE_KEY is correct
- Check internet connection
- Verify database schema is imported

### "Email not sending"
- Verify SMTP_USER is correct
- Verify SMTP_PASS is app password (not regular password)
- Check Gmail 2FA is enabled
- Verify SMTP_HOST is smtp.gmail.com

### "Payment not working"
- Verify RAZORPAY_KEY_ID is test key
- Verify RAZORPAY_KEY_SECRET is correct
- Check test mode is enabled
- Use correct test card

### "Port already in use"
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 🔄 Updating Environment Variables

### During Development
1. Edit `.env` or `.env.local`
2. Restart development server
3. Changes take effect immediately

### For Production
1. Update environment variables in deployment platform
2. Redeploy application
3. Verify changes took effect

---

## 🔐 Security Best Practices

1. **Never commit `.env` files**
   - Add to `.gitignore`
   - Use `.env.example` for reference

2. **Rotate secrets regularly**
   - Change JWT_SECRET monthly
   - Regenerate API keys quarterly

3. **Use strong passwords**
   - JWT_SECRET: 32+ characters
   - Database password: 16+ characters

4. **Limit key permissions**
   - Razorpay: Only payment permissions
   - Supabase: Only needed tables

5. **Monitor key usage**
   - Check Razorpay transaction logs
   - Review Supabase access logs

---

## 📋 Environment Variables Summary

| Variable | Source | Example |
|----------|--------|---------|
| SUPABASE_URL | Supabase Settings | https://xxx.supabase.co |
| SUPABASE_KEY | Supabase Settings | eyJhbGc... |
| JWT_SECRET | Generate | random_string_32_chars |
| RAZORPAY_KEY_ID | Razorpay Settings | rzp_test_xxx |
| RAZORPAY_KEY_SECRET | Razorpay Settings | secret_key_xxx |
| SMTP_USER | Gmail | your.email@gmail.com |
| SMTP_PASS | Gmail App Password | xxxx xxxx xxxx xxxx |
| SMTP_FROM | Your choice | noreply@textilestore.com |
| NEXT_PUBLIC_API_URL | Your backend | http://localhost:5000/api |
| NEXT_PUBLIC_RAZORPAY_KEY | Razorpay Settings | rzp_test_xxx |

---

## 🎯 Next Steps

1. ✅ Create all accounts
2. ✅ Get all credentials
3. ✅ Create `.env` files
4. ✅ Fill in all values
5. ✅ Verify configuration
6. ✅ Start development servers
7. ✅ Test all features

---

**All set! Your environment is configured and ready to go! 🚀**

For issues, see [SETUP_GUIDE.md](./SETUP_GUIDE.md) or [QUICKSTART.md](./QUICKSTART.md)
