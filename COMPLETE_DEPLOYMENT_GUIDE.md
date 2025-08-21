# Complete Deployment Guide for CodewiseHub

## Prerequisites ✅ COMPLETED
- [x] Build issues fixed (Rollup error resolved)
- [x] Authentication system working
- [x] Database schema ready
- [x] All 5 subscription packages configured
- [x] Frontend debugging added

## Step 1: Vercel Deployment

### 1.1 Upload Fixed Files to GitHub
Download and replace these files in your GitHub repo:
- `vite.config.vercel.ts`
- `client/src/components/PackageSelector.tsx` 
- `client/src/components/AuthModal.tsx`

### 1.2 Vercel Dashboard Setup
1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Import your CodewiseHub project
4. Vercel will auto-detect the build settings

### 1.3 Environment Variables in Vercel
Set these in Vercel Dashboard → Settings → Environment Variables:

```env
DATABASE_URL=your_neon_database_url_here
JWT_SECRET=your_secure_random_string_here
NODE_ENV=production
```

### 1.4 Vercel Build Configuration
Vercel should auto-detect:
- Build Command: `npm run vercel-build`
- Output Directory: `dist/public`
- Install Command: `npm install`

## Step 2: Neon Database Setup

### 2.1 Get Database URL
1. Log into your Neon dashboard
2. Go to your database project
3. Copy the connection string
4. Add it to Vercel environment variables

### 2.2 Database Schema
Your database should already have:
- Users table with authentication
- Subscription packages (5 packages)
- User sessions table
- Course materials and lessons

### 2.3 Verify Database Connection
After deployment, test these endpoints:
- `GET /api/packages` - Should return 5 subscription packages
- `POST /api/auth/signup` - Should create new users
- `POST /api/auth/signin` - Should authenticate users

## Step 3: Post-Deployment Testing

### 3.1 Test User Flows
1. **Student Signup**: Should show individual packages (3 options)
2. **School Admin Signup**: Should show school packages (2 options)
3. **Teacher/Parent Signup**: Should not require package selection
4. **Sign In**: Should work with existing accounts

### 3.2 Verify Package Selection
- Console logs will show package fetching (added debugging)
- Role indicator shows package type mapping
- All 5 packages should be available based on user role

### 3.3 Check Authentication
- JWT tokens should be set as HTTP-only cookies
- Session persistence across page refreshes
- Proper role-based access control

## Step 4: Domain and SSL

### 4.1 Custom Domain (Optional)
- Add your custom domain in Vercel dashboard
- Vercel automatically handles SSL certificates
- DNS configuration instructions provided by Vercel

## Troubleshooting

### Build Fails
- Check environment variables are set
- Verify all files were uploaded correctly
- Check Vercel build logs for specific errors

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check Neon database is running
- Ensure connection string includes all parameters

### Package Loading Issues
- Check browser console for debugging logs
- Verify API endpoints are responding
- Test `/api/packages` endpoint directly

## Environment Variables Reference

```env
# Required for Production
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
JWT_SECRET=your-super-secure-random-string-at-least-32-characters
NODE_ENV=production

# Neon Database Components (auto-included in DATABASE_URL)
PGHOST=your-neon-hostname
PGDATABASE=your-database-name
PGUSER=your-username
PGPASSWORD=your-password
PGPORT=5432
```

## Success Indicators

✅ Vercel build completes without errors
✅ Frontend loads without console errors  
✅ Package selection works during signup
✅ Authentication flow functions properly
✅ Database queries execute successfully
✅ All user roles can access appropriate features

## Support

Your CodewiseHub platform is fully configured and ready for production deployment. The authentication system, subscription packages, and learning materials are all integrated and functional.