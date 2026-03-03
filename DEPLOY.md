# Deployment Instructions

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `budget-ai-app`
3. Description: "AI-powered family budget manager - better than YNAB"
4. Public repository
5. DO NOT initialize with README (we already have one)
6. Click "Create repository"

## Step 2: Push Code to GitHub

From the `/workspace/group/budget-ai-app` directory, run:

```bash
git remote add origin https://github.com/Abramovich77/budget-ai-app.git
git branch -M main
git push -u origin main
```

## Step 3: Configure GitHub Pages

1. Go to repository Settings
2. Click "Pages" in left sidebar
3. Source: "Deploy from a branch"
4. Branch: Select `main` and `/root`
5. Click "Save"

## Step 4: Update GitHub Actions for Automatic Deployment

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Next.js app
        run: npm run build
        env:
          NODE_ENV: production

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Step 5: Set Up Environment Variables (for API)

Since GitHub Pages only serves static files, you'll need to:

**Option A: Use Vercel (Recommended)**
1. Go to https://vercel.com
2. Import GitHub repository
3. Add environment variables:
   - `DATABASE_URL`
   - `ANTHROPIC_API_KEY`
   - `NEXTAUTH_SECRET`
4. Deploy

**Option B: Use Backend Separately**
1. Deploy API routes to AWS Lambda/Cloudflare Workers
2. Update `next.config.ts` to point to external API

## Step 6: Database Setup

If using local PostgreSQL:

```bash
# Update .env file
DATABASE_URL="postgresql://user:password@localhost:5432/budget_ai"

# Push schema to database
npm run db:push

# (Optional) Open Prisma Studio
npm run db:studio
```

## Your App URLs

- **GitHub Pages**: https://abramovich77.github.io/budget-ai-app/
- **Vercel** (if deployed): https://budget-ai-app.vercel.app/

## Notes

- GitHub Pages has 100GB/month bandwidth limit (soft)
- For production, consider Vercel (better performance, serverless functions)
- Static export means no server-side API routes on GitHub Pages
