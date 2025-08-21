# Three Ways to Import Course Material on Vercel

## Option 1: Automated Script (Recommended)

I've created `tools/deploy-to-production.ts` that automatically imports after deployment:

```bash
# After your Vercel deployment is complete
node tools/deploy-to-production.js https://your-app.vercel.app
```

This script will:
- Connect to your production API
- Import all 4 courses with their lessons
- Import all 4 robotics activities  
- Verify the import was successful

## Option 2: Vercel Function Endpoint

I created `/api/import-courses.ts` which becomes a Vercel API endpoint:

**Upload this file to GitHub:** `api/import-courses.ts`

Then visit: `https://your-app.vercel.app/api/import-courses` 

Or use curl:
```bash
curl -X POST https://your-app.vercel.app/api/import-courses \
  -H "Content-Type: application/json" \
  -d @course-material.json
```

## Option 3: Admin Panel Manual Import (Future Enhancement)

Add an "Import Courses" button to your admin panel:

1. Upload `course-material.json` via the admin interface
2. Click "Import" button to process the file
3. View imported courses immediately

## Recommended Approach

**For immediate deployment:** Use Option 1 (the automated script)

**Steps:**
1. Upload all files to GitHub (including the new `api/import-courses.ts`)
2. Wait for Vercel to deploy (2-3 minutes)
3. Run: `tsx tools/deploy-to-production.ts https://your-app.vercel.app`
4. Visit your app and click "Admin" to see the imported courses

## Files to Add to GitHub

Add this new file:
```bash
git add api/import-courses.ts
git commit -m "Add Vercel API endpoint for course imports"
git push origin main
```

This gives you both automated deployment (Option 1) and a backup Vercel function (Option 2) for importing course material.