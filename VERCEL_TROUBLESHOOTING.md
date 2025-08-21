# Vercel Deployment Troubleshooting

## Current Issue: API Endpoints Returning 500 Errors

Your Vercel app is deployed successfully (main page loads), but API endpoints are crashing. Here's how to fix it:

## Step 1: Check Vercel Environment Variables

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Click on your "codewise-hub" project
3. Go to **Settings** → **Environment Variables**
4. Ensure these are set:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NODE_ENV` - Set to "production"

## Step 2: Check Database Schema

Your production database needs the tables created. Run these commands:

### Option A: Use Drizzle Push (Recommended)
```bash
# In your local project directory
npm run db:push
```

### Option B: Manual Database Setup
If you have access to your database directly, create the tables using your database provider's interface.

## Step 3: Simpler Import Method

Instead of using the failing API, let's import directly through your database:

### Check Database Connection
```bash
# Test your DATABASE_URL locally first
node -e "
const { Pool } = require('@neondatabase/serverless');
const pool = new Pool({ connectionString: 'YOUR_DATABASE_URL' });
pool.query('SELECT NOW()').then(() => console.log('✅ Database connected')).catch(console.error);
"
```

## Step 4: Alternative Import Methods

### Method 1: Direct Database Import (Most Reliable)
If you have access to your database provider's interface:
1. Copy the content from `course-material.json`
2. Use your database provider's import/SQL interface
3. Run insert statements directly

### Method 2: Fix Vercel Build
Check Vercel build logs:
1. Go to your Vercel dashboard
2. Click on your project
3. Go to **Functions** tab
4. Check for any build errors

### Method 3: Local Database Connection
```bash
# Connect to production database locally and import
DATABASE_URL="your_production_url" npm run db:push
DATABASE_URL="your_production_url" tsx tools/import-course-material.ts
```

## Common Issues & Solutions

**Database Not Found:**
- Check if your database provider (Neon, Supabase, etc.) is running
- Verify DATABASE_URL format: `postgresql://user:pass@host:port/dbname`

**Tables Don't Exist:**
- Run `npm run db:push` to create schema
- Check if Drizzle config points to correct database

**Environment Variables Missing:**
- Set DATABASE_URL in Vercel dashboard
- Redeploy after adding environment variables

## Next Steps

1. Check your Vercel environment variables first
2. Run `npm run db:push` to ensure database schema exists
3. Try the import again once API endpoints are working

Let me know which specific error you're seeing and I can help debug further!