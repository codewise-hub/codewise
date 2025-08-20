# 🚀 Complete CodewiseHub Deployment Guide

## Overview
This guide will walk you through deploying your CodewiseHub platform to Vercel with Neon PostgreSQL database in about 10-15 minutes.

## Prerequisites
- GitHub account
- Vercel account (free tier works)
- Neon account (free tier works)

## Part 1: Download Files from Replit

### Required Files (Download from Replit):
1. **`client/src/components/SimplePackageSelector.tsx`**
2. **`client/src/components/AuthModal.tsx`** 
3. **`vercel.json`**

### Optional API Files (for enhanced features):
4. **`api/packages/index.ts`**
5. **`api/auth/signup.ts`**
6. **`api/auth/signin.ts`**
7. **`api/index.ts`**

## Part 2: Setup Neon Database

### Step 1: Create Neon Account
1. Go to https://neon.tech
2. Sign up for free account
3. Create new project: "CodewiseHub"

### Step 2: Get Database Connection
1. In Neon dashboard, go to "Connection Details"
2. Copy the connection string (starts with `postgresql://`)
3. Save this - you'll need it for Vercel

### Step 3: Create Tables (Run in Neon SQL Editor)
```sql
-- Users table
CREATE TABLE users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE,
  password_hash VARCHAR,
  name VARCHAR,
  role VARCHAR,
  age_group VARCHAR,
  school_id VARCHAR,
  package_id VARCHAR,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Packages table  
CREATE TABLE packages (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR,
  description TEXT,
  price DECIMAL(10,2),
  currency VARCHAR DEFAULT 'ZAR',
  duration VARCHAR DEFAULT 'monthly',
  features TEXT,
  max_students INTEGER,
  package_type VARCHAR,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert packages
INSERT INTO packages (id, name, description, price, currency, features, package_type, max_students) VALUES
('basic-explorer', 'Basic Explorer', 'Perfect for young coders starting their journey', 349.00, 'ZAR', '["Visual Block Programming", "Basic Coding Concepts", "5 Projects", "Progress Tracking"]', 'individual', NULL),
('pro-coder', 'Pro Coder', 'Advanced learning with text-based programming', 699.00, 'ZAR', '["Text-Based Programming", "Advanced Projects", "AI/Prompt Engineering", "Unlimited Projects"]', 'individual', NULL),
('family-plan', 'Family Plan', 'Multiple children learning together', 999.00, 'ZAR', '["Up to 4 Children", "All Features", "Parent Dashboard", "Progress Reports"]', 'individual', NULL),
('school-basic', 'School Basic', 'Essential package for small schools', 6999.00, 'ZAR', '["Up to 30 Students", "Teacher Dashboard", "Classroom Management", "Analytics"]', 'school', 30),
('school-premium', 'School Premium', 'Complete solution for larger schools', 17499.00, 'ZAR', '["Up to 100 Students", "Advanced Analytics", "Custom Curriculum", "Priority Support"]', 'school', 100);
```

## Part 3: Setup GitHub Repository

### Step 1: Create Repository
1. Go to GitHub and create new repository: "codewise-hub"
2. Initialize with README

### Step 2: Upload Files
1. Create folder structure in GitHub:
   ```
   /client/src/components/
   /api/
   /api/auth/
   /api/packages/
   ```

2. Upload downloaded files to exact paths:
   - `SimplePackageSelector.tsx` → `/client/src/components/`
   - `AuthModal.tsx` → `/client/src/components/`
   - `vercel.json` → root directory
   - API files → respective `/api/` folders

3. Commit all changes

## Part 4: Deploy to Vercel

### Step 1: Connect GitHub
1. Go to https://vercel.com
2. Sign up/login with GitHub
3. Click "Add New Project"
4. Import your "codewise-hub" repository

### Step 2: Configure Environment Variables
In Vercel project settings → Environment Variables, add:

```
DATABASE_URL = your_neon_connection_string_here
JWT_SECRET = your_random_secure_string_here  
NODE_ENV = production
```

### Step 3: Deploy Settings
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

### Step 4: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for build
3. Get your live URL: `https://your-project.vercel.app`

## Part 5: Test Your Deployment

### Test Signup Flow:
1. Go to your Vercel URL
2. Click "Sign Up"
3. Select "School Administrator"
4. **You should see dropdown with**:
   - School Basic - R6999/month
   - School Premium - R17499/month
5. Select "Student" 
6. **You should see dropdown with**:
   - Basic Explorer - R349/month
   - Pro Coder - R699/month
   - Family Plan - R999/month

## Troubleshooting

### If packages don't show:
1. Check Vercel function logs
2. Verify DATABASE_URL is correct
3. Ensure all files uploaded to correct paths

### If signup fails:
1. Check JWT_SECRET is set
2. Verify database connection
3. Check Neon database has tables created

## Success Indicators
- ✅ Package dropdowns show with ZAR pricing
- ✅ Signup creates users in Neon database
- ✅ Login works correctly
- ✅ Dashboard loads after authentication

Your CodewiseHub is now live and fully functional!