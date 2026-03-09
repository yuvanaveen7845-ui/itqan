# Deployment Guide

## Prerequisites
- Vercel account (for frontend)
- Railway/Render account (for backend)
- Supabase account (database)
- Razorpay account (payments)
- Gmail account (email)

## Backend Deployment (Railway)

### 1. Prepare Backend
```bash
cd backend
npm run build
```

### 2. Create Railway Project
- Go to railway.app
- Create new project
- Connect GitHub repository
- Select backend folder

### 3. Set Environment Variables
In Railway dashboard, add:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@textilestore.com
NODE_ENV=production
FRONTEND_URL=your_frontend_url
```

### 4. Deploy
- Railway auto-deploys on push
- Monitor logs in dashboard

## Frontend Deployment (Vercel)

### 1. Prepare Frontend
```bash
cd frontend
npm run build
```

### 2. Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### 3. Set Environment Variables
In Vercel dashboard:
```
NEXT_PUBLIC_API_URL=your_backend_url
NEXT_PUBLIC_RAZORPAY_KEY=your_razorpay_key
```

### 4. Configure Domain
- Add custom domain in Vercel settings
- Update DNS records

## Database Setup (Supabase)

### 1. Create Project
- Go to supabase.com
- Create new project
- Wait for initialization

### 2. Run Schema
- Go to SQL Editor
- Create new query
- Paste content from DATABASE_SCHEMA.sql
- Execute

### 3. Enable RLS (Row Level Security)
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ... for all tables

-- Create policies
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);
```

### 4. Setup Backups
- Go to Settings > Backups
- Enable daily backups
- Set retention period

## Email Configuration (Gmail)

### 1. Enable 2FA
- Go to myaccount.google.com
- Enable 2-factor authentication

### 2. Generate App Password
- Go to myaccount.google.com/apppasswords
- Select Mail and Windows Computer
- Generate password
- Use this in SMTP_PASS

## Payment Gateway (Razorpay)

### 1. Create Account
- Go to razorpay.com
- Sign up and verify

### 2. Get API Keys
- Go to Settings > API Keys
- Copy Key ID and Key Secret
- Add to environment variables

### 3. Setup Webhooks
- Go to Settings > Webhooks
- Add webhook URL: `your_backend_url/api/webhooks/razorpay`
- Subscribe to: payment.authorized, payment.failed

## SSL Certificate

### Vercel
- Automatic SSL with custom domain

### Railway
- Automatic SSL with railway.app domain
- Custom domain SSL auto-configured

## Monitoring

### Backend Logs
- Railway: Dashboard > Logs
- Check for errors and performance

### Frontend Analytics
- Vercel: Analytics tab
- Monitor page performance

### Database
- Supabase: Logs tab
- Monitor query performance

## Scaling

### Database
- Upgrade Supabase plan for more connections
- Add read replicas for high traffic

### Backend
- Railway: Increase CPU/RAM
- Add load balancer if needed

### Frontend
- Vercel: Auto-scales with traffic
- Enable Edge Caching

## Security Checklist

- [ ] Change all default passwords
- [ ] Enable HTTPS everywhere
- [ ] Setup firewall rules
- [ ] Enable database backups
- [ ] Setup monitoring alerts
- [ ] Enable rate limiting
- [ ] Setup CORS properly
- [ ] Rotate API keys regularly
- [ ] Enable audit logging
- [ ] Setup DDoS protection

## Troubleshooting

### Backend won't start
- Check environment variables
- Verify database connection
- Check logs for errors

### Frontend not connecting
- Verify API URL in .env
- Check CORS settings
- Verify backend is running

### Payment not working
- Verify Razorpay keys
- Check webhook configuration
- Review payment logs

### Email not sending
- Verify SMTP credentials
- Check Gmail app password
- Review email logs

## Rollback

### Backend
```bash
# Railway: Select previous deployment
# Or redeploy from git
git revert <commit-hash>
git push
```

### Frontend
```bash
# Vercel: Select previous deployment
# Or redeploy
vercel --prod
```

## Performance Optimization

### Frontend
- Enable image optimization
- Setup CDN caching
- Minify CSS/JS
- Enable gzip compression

### Backend
- Add database indexes
- Implement caching
- Setup rate limiting
- Monitor query performance

### Database
- Optimize queries
- Add appropriate indexes
- Archive old data
- Monitor connections

## Maintenance

### Weekly
- Check error logs
- Monitor performance metrics
- Review security alerts

### Monthly
- Update dependencies
- Review and optimize queries
- Backup verification
- Security audit

### Quarterly
- Performance review
- Capacity planning
- Security assessment
- Disaster recovery test

---

For more help, refer to official documentation:
- Vercel: vercel.com/docs
- Railway: railway.app/docs
- Supabase: supabase.com/docs
- Razorpay: razorpay.com/docs
