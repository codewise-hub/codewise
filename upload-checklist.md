# GitHub Upload Checklist for CodewiseHub

## Required Files for Upload

### ✅ New Files to Add
- [ ] `course-material.json` - Course and activity content
- [ ] `tools/import-course-material.ts` - Development import tool
- [ ] `tools/deploy-to-production.ts` - Production deployment script
- [ ] `client/src/components/AdminCourseManager.tsx` - Admin panel UI
- [ ] `client/src/pages/AdminPage.tsx` - Admin page wrapper
- [ ] `server/routes-import.ts` - Batch import API endpoints
- [ ] `COURSE_IMPORT_GUIDE.md` - Import documentation
- [ ] `DEPLOYMENT_GUIDE.md` - Deployment instructions
- [ ] `upload-checklist.md` - This checklist

### ✅ Modified Files to Update
- [ ] `server/storage.ts` - Added course management methods
- [ ] `server/routes.ts` - Added API endpoints and import routes
- [ ] `client/src/App.tsx` - Added admin panel routing
- [ ] `client/src/components/Navigation.tsx` - Added admin access button
- [ ] `replit.md` - Updated project documentation

### ✅ Verify These Files Exist (should already be uploaded)
- [ ] `shared/schema.ts` - Database schema definitions
- [ ] `server/db.ts` - Database connection setup
- [ ] `drizzle.config.ts` - Drizzle ORM configuration
- [ ] `package.json` - Dependencies and scripts
- [ ] `vercel.json` - Vercel deployment configuration

## Git Commands

```bash
# Add all new files
git add course-material.json
git add tools/import-course-material.ts
git add tools/deploy-to-production.ts
git add client/src/components/AdminCourseManager.tsx
git add client/src/pages/AdminPage.tsx
git add server/routes-import.ts
git add COURSE_IMPORT_GUIDE.md
git add DEPLOYMENT_GUIDE.md
git add upload-checklist.md

# Add modified files
git add server/storage.ts
git add server/routes.ts
git add client/src/App.tsx
git add client/src/components/Navigation.tsx
git add replit.md

# Commit everything
git commit -m "Add complete course management system with admin panel

- Added comprehensive course material database (4 courses, 15 lessons, 4 robotics activities)
- Implemented admin panel for course content management
- Created import tools for development and production deployment
- Added API endpoints for courses, lessons, and robotics activities
- Updated navigation to include admin panel access
- Added batch import functionality for production deployment"

# Push to GitHub
git push origin main
```

## Post-Upload Steps

1. **Wait for Vercel auto-deployment** (usually 2-3 minutes)
2. **Check Vercel dashboard** for successful build
3. **Import course material to production**:
   ```bash
   tsx tools/deploy-to-production.ts https://your-app.vercel.app
   ```
4. **Verify deployment** by visiting your app and clicking "Admin"

## Quick Verification

After upload and deployment, test these URLs:
- `https://your-app.vercel.app` - Main application
- `https://your-app.vercel.app/api/courses` - API endpoint
- Admin panel via "Admin" button in navigation

## Troubleshooting

**Build fails?** Check Vercel logs for TypeScript errors
**No courses showing?** Run the production import script
**API errors?** Verify DATABASE_URL is set in Vercel environment

Ready to upload to GitHub! ✨