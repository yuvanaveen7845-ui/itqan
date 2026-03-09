# Deployment Guide

This document outlines the steps and environment variables required to deploy the **Itqan Textile E-commerce** platform.

## 🚀 Backend (Render)

Deploy the backend service to [Render.com](https://render.com).

### Configuration
- **Runtime**: Node.js
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start` (runs `node dist/server.js`)
- **Root Directory**: `backend`

### Required Environment Variables
| Variable | Description | Example |
| :--- | :--- | :--- |
| `SUPABASE_URL` | Your Supabase Project URL | `https://xxxx.supabase.co` |
| `SUPABASE_KEY` | Your Supabase Anon/Service Key | `eyJhbGci...` |
| `JWT_SECRET` | Secret key for JWT signing | `some_random_string` |
| `JWT_EXPIRE` | JWT expiry duration | `7d` |
| `RAZORPAY_KEY_ID` | Razorpay API Key | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay API Secret | `...` |
| `RAZORPAY_WEBHOOK_SECRET` | Secret for verifying Razorpay webhooks | `...` |
| `SMTP_HOST` | Email SMTP host | `smtp.gmail.com` |
| `SMTP_PORT` | Email SMTP port | `587` |
| `SMTP_USER` | Email username | `user@gmail.com` |
| `SMTP_PASS`| Email app password | `...` |
| `SMTP_FROM` | Sender email address | `noreply@yourdomain.com` |
| `FRONTEND_URL` | URL of your deployed frontend | `https://itqan.pages.dev` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `...` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Listening port (Render sets this) | `10000` |

---

## 🎨 Frontend (Cloudflare Pages)

Deploy the frontend to [Cloudflare Pages](https://pages.cloudflare.com).

### Configuration
- **Framework Preset**: `Next.js`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Root Directory**: `frontend`

> [!NOTE]
> Cloudflare Pages supports Next.js via the `@cloudflare/next-on-pages` adapter. Ensure you have configured the project to use it if you require SSR/Server Actions. For a simple static export, use `next export`.

### Required Environment Variables
| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | The URL of your deployed Render backend (e.g., `https://itqan-api.onrender.com/api`) |
| `NEXT_PUBLIC_RAZORPAY_KEY` | Your Razorpay API Key |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Your Google OAuth Client ID |

---

## 🛠️ Post-Deployment Steps
1. **Update Razorpay Webhook**: Set the webhook URL in Razorpay Dashboard to `https://your-backend.onrender.com/api/webhooks/razorpay`.
2. **Update Google OAuth**: Add your frontend and backend URLs to the "Authorized Redirect URIs" and "Authorized JavaScript Origins" in the Google Cloud Console.
3. **Database Schema**: Ensure you have run [`DATABASE_SCHEMA.sql`](file:///C:/e-commerce%20textile/DATABASE_SCHEMA.sql) in your Supabase SQL Editor.
