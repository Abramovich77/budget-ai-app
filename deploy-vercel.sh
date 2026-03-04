#!/bin/bash

# Budget AI - Vercel Deployment Script
# This script will deploy your app to Vercel

echo "🚀 Budget AI - Vercel Deployment"
echo "================================"
echo ""

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🔐 Logging in to Vercel..."
echo "   A browser window will open for authentication"
vercel login

echo ""
echo "🏗️  Deploying to production..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Your app is now live on Vercel! 🎉"
