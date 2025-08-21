# Database Connection Troubleshooting Guide

## Common Database Connection Errors

### 1. "password authentication failed"
**Cause**: Wrong username/password in DATABASE_URL
**Fix**: 
- Check your Neon dashboard for correct credentials
- Regenerate password if needed
- Ensure URL format: `postgresql://username:password@host/database`

### 2. "could not connect to server"
**Cause**: Database server not accessible
**Fix**:
- Check Neon dashboard - is your database running?
- Verify region settings match your connection
- Try connecting from Neon SQL Editor first

### 3. "database does not exist"
**Cause**: Database name in URL is wrong
**Fix**:
- Check database name in Neon dashboard
- Update DATABASE_URL with correct database name

### 4. "relation does not exist"
**Cause**: Database tables haven't been created
**Fix**:
- Run the SQL commands in Neon SQL Editor to create tables
- Verify tables exist before importing data

### 5. "SSL connection required"
**Cause**: Missing SSL configuration
**Fix**:
- Add `?sslmode=require` to end of DATABASE_URL
- Example: `postgresql://user:pass@host/db?sslmode=require`

## Step-by-Step Fix Process

### Step 1: Run Diagnostics
```bash
# Test with your DATABASE_URL
node tools/diagnose-database-issues.js "your_database_url_here"

# Or test environment variable
DATABASE_URL="your_url" node tools/diagnose-database-issues.js
```

### Step 2: Fix Common Issues
Based on diagnostic results:

**If DATABASE_URL is invalid:**
1. Go to Neon dashboard
2. Copy the correct connection string
3. Update your environment/Vercel settings

**If tables are missing:**
1. Go to Neon SQL Editor
2. Run the table creation SQL from `tools/simple-database-setup.sql`
3. Verify tables were created

**If connection fails:**
1. Test connection directly in Neon dashboard
2. Check if database is running
3. Verify credentials are correct

### Step 3: Test Vercel Integration
```bash
# After fixing local issues, test production
node tools/verify-production-setup.js https://codewise-hub.vercel.app
```

### Step 4: Update Vercel Environment
If local tests work but Vercel fails:
1. Go to Vercel dashboard → Settings → Environment Variables
2. Update DATABASE_URL with working connection string
3. Redeploy application

## Quick Fixes

### Reset Neon Password
1. Go to Neon dashboard
2. Settings → Reset password
3. Update DATABASE_URL everywhere with new password

### Recreate Database
1. Create new Neon project
2. Run table creation SQL
3. Update DATABASE_URL in Vercel
4. Redeploy

### Test Connection Format
Valid format: `postgresql://username:password@hostname:port/database?sslmode=require`

Example: `postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-1.aws.neon.tech/neondb?sslmode=require`