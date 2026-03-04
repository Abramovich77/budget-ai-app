# Budget AI - Deployment Guide

## Quick Deploy to Vercel (Recommended)

### Method 1: Using the Deployment Script (Easiest)

We've created a deployment script for you. Just run:

```bash
cd /workspace/group/budget-ai-app
./deploy-vercel.sh
```

This script will:
1. Install Vercel CLI (if not already installed)
2. Open your browser to log in to Vercel
3. Deploy your app to production
4. Give you a live URL

### Method 2: Manual Deployment

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel (opens browser)
vercel login

# Navigate to project
cd /workspace/group/budget-ai-app

# Deploy to production
vercel --prod
```

---

## What Happens During Deployment?

Vercel will:
1. ✅ Detect Next.js automatically
2. ✅ Build your app (`npm run build`)
3. ✅ Deploy to their global CDN
4. ✅ Give you a URL like: `https://budget-ai-app-xyz.vercel.app`
5. ✅ Auto-deploy on every git push to main

---

## Environment Variables

If your app needs environment variables, add them in Vercel dashboard:

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Environment Variables"
3. Add these if needed:
   - `DATABASE_URL` - Your database connection string
   - `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
   - `NEXTAUTH_URL` - Your deployment URL
   - `ANTHROPIC_API_KEY` - Your Claude API key (for AI features)

---

## After Deployment

Your app will be live at:
- Production: `https://budget-ai-app-[random].vercel.app`
- Preview: Every PR gets its own preview URL
- Auto-deploys: Push to main = automatic deployment

### Custom Domain (Optional)

1. Go to project settings in Vercel
2. Click "Domains"
3. Add your custom domain (e.g., `budget.yourdomain.com`)
4. Follow DNS instructions

---

## Troubleshooting

### Build Fails?
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

### Database Connection Issues?
- Add `DATABASE_URL` environment variable
- Ensure database allows connections from Vercel's IP ranges

### API Routes Not Working?
- Vercel automatically handles Next.js API routes
- They become serverless functions
- Check function logs in Vercel dashboard

---

## Free Tier Limits

Vercel's free tier includes:
- ✅ 100 GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless Functions

This is more than enough for most personal projects!

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Issues? Check: https://github.com/vercel/vercel/discussions
