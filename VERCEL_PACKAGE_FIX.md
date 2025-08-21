# Vercel Package Selection Fix

## Root Cause
The package selection issue on Vercel is caused by:
1. TypeScript compilation errors in PackageSelector component
2. API endpoint not being accessible on Vercel
3. CORS configuration for Vercel deployment

## Complete Fix

### 1. Updated Files to Download

**Required Files (Download from Replit and replace in GitHub):**

1. **`client/src/components/PackageSelector.tsx`** - Fixed TypeScript errors
2. **`api/index.ts`** - Vercel API handler with CORS
3. **`api/auth/signup.ts`** - Vercel signup endpoint
4. **`api/auth/signin.ts`** - Vercel signin endpoint  
5. **`api/packages.ts`** - Vercel packages endpoint
6. **`vercel.json`** - Vercel configuration

### 2. Create vercel.json Configuration

Create this file in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/**/*",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/public"
      }
    },
    {
      "src": "api/**/*.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/client/$1"
    }
  ],
  "functions": {
    "api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  }
}
```

### 3. Vercel Environment Variables

Add these in Vercel Dashboard → Project → Settings → Environment Variables:

```
DATABASE_URL=your_neon_database_connection_string
JWT_SECRET=your_secure_random_string  
NODE_ENV=production
```

### 4. Package.json Scripts

Make sure your package.json has:

```json
{
  "scripts": {
    "vercel-build": "vite build --config vite.config.vercel.ts && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
  }
}
```

## Expected Result

After applying these fixes:
- ✅ School Administrator signup shows 2 packages: School Basic (R6,999) and School Premium (R17,499)
- ✅ Student signup shows 3 packages: Basic Explorer (R349), Pro Coder (R699), Family Plan (R999)
- ✅ Sign in/Sign up works properly on Vercel
- ✅ Pricing displays in South African Rand

## Testing Instructions

1. Deploy to Vercel
2. Go to your Vercel app URL
3. Click "Sign Up"
4. Select "School Administrator" 
5. You should see 2 school packages with ZAR pricing
6. Select "Student" to see 3 individual packages

## If Still Not Working

If packages still don't show:
1. Check Vercel Function logs in Vercel Dashboard
2. Verify DATABASE_URL is correctly set in Vercel environment variables
3. Ensure all 6 files were uploaded correctly to GitHub

Your CodewiseHub will be fully functional on Vercel after these fixes!