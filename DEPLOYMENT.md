# Deployment Guide

This document outlines the steps and environment variables required to deploy the **Itqan Perfume E-commerce** platform.

## 🚀 Backend (Railway)

We use Railway for the backend because it handles monorepos and database connectivity with ease.

### Configuration
- **Root Directory**: `backend`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Port**: `5000`

### Required Environment Variables
| Variable | Description |
| :--- | :--- |
| `SUPABASE_URL` | Your Supabase Project URL |
| `SUPABASE_KEY` | Your Supabase API Key |
| `JWT_SECRET` | Your secure JWT secret string |
| `JWT_EXPIRE` | `7d` |
| `RAZORPAY_KEY_ID` | Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay Secret |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | your-email@gmail.com |
| `SMTP_PASS` | Gmail App Password |
| `SMTP_FROM` | your-email@gmail.com |
| `FRONTEND_URL` | e.g., `https://itqan.vercel.app` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `NODE_ENV` | `production` |

---

## 🎨 Frontend (Vercel)

We use Vercel for the frontend because it has native Next.js support and handles large build files better than Cloudflare.

### Configuration
- **Root Directory**: `frontend`
- **Framework Preset**: `Next.js`

### Required Environment Variables
| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Your Railway Backend URL (e.g., `https://itqan.up.railway.app/api`) |
| `NEXT_PUBLIC_RAZORPAY_KEY` | Your Razorpay API Key |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Your Google OAuth Client ID |

---

## 🛠️ Post-Deployment Steps
1. **CORS Fix**: The backend is configured to reflect the origin. Ensure `FRONTEND_URL` is set in Railway without a trailing slash.
2. **Google OAuth**: Add your Vercel URL to "Authorized JavaScript Origins" in the Google Cloud Console.
3. **Database**: Run `DATABASE_SCHEMA.sql` in your Supabase SQL editor.

