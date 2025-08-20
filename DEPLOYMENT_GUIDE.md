# CodewiseHub Deployment Guide

## Files to Upload to GitHub

### New Files Created
1. `course-material.json` - Educational content database
2. `tools/import-course-material.ts` - Course import utility
3. `client/src/components/AdminCourseManager.tsx` - Admin panel component
4. `client/src/pages/AdminPage.tsx` - Admin page wrapper
5. `COURSE_IMPORT_GUIDE.md` - Import tool documentation
6. `DEPLOYMENT_GUIDE.md` - This deployment guide

### Modified Files
1. `server/storage.ts` - Added course management methods
2. `server/routes.ts` - Added API endpoints for courses
3. `client/src/App.tsx` - Added admin routing
4. `client/src/components/Navigation.tsx` - Added admin panel access
5. `shared/schema.ts` - (unchanged but verify it's uploaded)
6. `replit.md` - Updated with recent changes

## Deployment Steps

### 1. Upload to GitHub
```bash
# Add all new and modified files
git add course-material.json
git add tools/import-course-material.ts
git add client/src/components/AdminCourseManager.tsx
git add client/src/pages/AdminPage.tsx
git add server/storage.ts
git add server/routes.ts
git add client/src/App.tsx
git add client/src/components/Navigation.tsx
git add COURSE_IMPORT_GUIDE.md
git add DEPLOYMENT_GUIDE.md
git add replit.md

# Commit changes
git commit -m "Add course management system with admin panel and import tool"

# Push to GitHub
git push origin main
```

### 2. Vercel Auto-Deployment
- Vercel will automatically detect changes and start building
- Build process uses the existing `vercel-build` script
- No additional configuration needed

### 3. Import Course Material to Production
After successful deployment, import the course material:

**Option A: Manual API Calls**
```bash
# Get your production URL (replace with your actual domain)
VERCEL_URL="https://your-app.vercel.app"

# Import courses via API (you'll need to implement batch import endpoint)
curl -X POST "$VERCEL_URL/api/import-courses" \
  -H "Content-Type: application/json" \
  -d @course-material.json
```

**Option B: Database Direct Import**
Use your database provider's interface to run the import script directly.

## Production Database Setup

Ensure your Vercel environment variables are set:
- `DATABASE_URL` - Your production PostgreSQL connection string
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` - Individual DB components

## Verification Steps

After deployment:
1. Visit your Vercel app URL
2. Click "Admin" in the navigation
3. Verify courses and activities are displayed
4. Test API endpoints:
   - `GET /api/courses`
   - `GET /api/robotics-activities`
   - `GET /api/courses?ageGroup=6-11`

## Troubleshooting

**Build Fails:**
- Check Vercel build logs for TypeScript errors
- Ensure all imports are correct

**Database Connection Issues:**
- Verify `DATABASE_URL` is set in Vercel environment
- Check database provider connectivity

**Missing Course Data:**
- Run the import process for production database
- Verify course-material.json was uploaded correctly