# Simple Import Guide for Vercel

## The Easiest Way: Use Your Existing Import Route

Your Express server already has a `/api/import-courses` endpoint that works perfectly. Here's how to use it:

## Step 1: Upload Files to GitHub
```bash
git add .
git commit -m "Add course management system"
git push origin main
```

## Step 2: Wait for Vercel Deployment (2-3 minutes)

## Step 3: Import via Simple API Call

**Windows PowerShell:**
```powershell
$courseData = Get-Content "course-material.json" -Raw
Invoke-RestMethod -Uri "https://your-app.vercel.app/api/import-courses" -Method POST -ContentType "application/json" -Body $courseData
```

**Windows Command Prompt (if curl is available):**
```cmd
curl -X POST "https://your-app.vercel.app/api/import-courses" -H "Content-Type: application/json" -d @course-material.json
```

**Mac/Linux Terminal:**
```bash
curl -X POST "https://your-app.vercel.app/api/import-courses" -H "Content-Type: application/json" -d @course-material.json
```

**Node.js (if you have course-material.json locally):**
```bash
node tools/deploy-to-production.js https://your-app.vercel.app
```

## Alternative: Browser Method

1. Go to: `https://your-app.vercel.app/admin`
2. The import endpoint is already built into your Express server
3. Your courses should load automatically once the database is set up

## What This Does

- Imports all 4 courses (Blockly Adventures, JavaScript Fundamentals, Web Development Basics, Micro:bit Adventures)
- Imports all 15 lessons across the courses
- Imports all 4 robotics activities
- Sets up the complete course database for your production app

## Files to Upload

Make sure these are in your GitHub repository:
- `course-material.json` (the course database)
- `server/routes-import.ts` (import API endpoints) 
- `tools/deploy-to-production.js` (Node.js import script)

The Express server route at `/api/import-courses` is much more reliable than Vercel serverless functions for this type of batch operation.