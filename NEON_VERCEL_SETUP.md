# Neon Database + Vercel Integration Guide

## Step 1: Create New Neon Database

1. **Go to Neon Console**: https://console.neon.tech/
2. **Sign up/Login** with your GitHub account (recommended for Vercel integration)
3. **Create New Project**:
   - Click "Create Project"
   - Project name: `codewise-hub`
   - Region: Choose closest to your users (US East recommended for Vercel)
   - PostgreSQL version: 15 (latest)
4. **Note down these details** (you'll need them):
   - Database URL (starts with `postgresql://`)
   - Database name
   - Username  
   - Password

## Step 2: Connect Neon to Vercel

### Method A: Automatic Integration (Recommended)
1. In Neon Console, go to your project dashboard
2. Click **"Integrations"** tab
3. Find **"Vercel"** and click **"Add Integration"**
4. Follow the prompts to connect your GitHub account
5. Select your `codewise-hub` repository
6. Neon will automatically add DATABASE_URL to your Vercel environment

### Method B: Manual Setup
1. Copy your DATABASE_URL from Neon dashboard
2. Go to Vercel dashboard: https://vercel.com/dashboard
3. Click your `codewise-hub` project
4. Go to **Settings** → **Environment Variables**
5. Add new variable:
   - Name: `DATABASE_URL`
   - Value: Your Neon database URL
   - Environments: Production, Preview, Development

## Step 3: Create Database Schema

### Option A: Using Node.js Script (Windows Compatible)
```bash
# Use our custom schema creator (works without drizzle-kit)
node tools/create-database-schema.js "your_neon_database_url_here"
```

### Option B: Using npm (if drizzle-kit is available)
```bash
# Set your new DATABASE_URL temporarily  
export DATABASE_URL="your_neon_database_url_here"

# Push schema to create tables
npm run db:push
```

### Alternative: Using Neon SQL Editor
1. Go to Neon Console → your project
2. Click **"SQL Editor"**
3. Run these commands to create tables:

```sql
-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'student',
  age_group VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create courses table
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  age_group VARCHAR(20) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  duration_minutes INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create lessons table
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  order_index INTEGER NOT NULL,
  duration_minutes INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create robotics_activities table
CREATE TABLE robotics_activities (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  age_group VARCHAR(20) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  instructions TEXT,
  code_template TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Step 4: Redeploy Vercel

After setting up the database connection:
1. Go to Vercel dashboard
2. Click your project
3. Go to **Deployments** tab
4. Click **"Redeploy"** on the latest deployment

Or trigger a new deployment:
```bash
git commit --allow-empty -m "Trigger redeploy with new database"
git push origin main
```

## Step 5: Test Connection

Run the status checker:
```bash
node tools/check-vercel-status.js https://codewise-hub.vercel.app
```

If API endpoints return 200 status, you're ready to import courses!

## Step 6: Import Course Material

Once the database is connected and schema is created:
```bash
node tools/deploy-to-production.js https://codewise-hub.vercel.app
```

## Environment Variables Summary

Your Vercel project should have these environment variables:
- `DATABASE_URL` - Your full Neon PostgreSQL connection string
- `NODE_ENV` - Set to "production"

## Troubleshooting

**Connection fails?**
- Check if DATABASE_URL is set correctly in Vercel
- Verify Neon database is running (check Neon dashboard)
- Ensure you selected the right region in Neon

**Tables don't exist?**
- Run the SQL commands in Neon SQL Editor
- Or use `npm run db:push` locally with DATABASE_URL set

**Still getting 500 errors?**
- Check Vercel function logs in dashboard
- Verify all environment variables are set
- Try redeploying after database setup