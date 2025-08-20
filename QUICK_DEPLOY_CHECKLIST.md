# ⚡ Quick Deploy Checklist - 10 Minutes

## 🎯 Goal: Get CodewiseHub live on Vercel in 10 minutes

### ☑️ Step 1: Neon Database (3 minutes)
- [ ] Sign up at neon.tech
- [ ] Create project "CodewiseHub" 
- [ ] Copy connection string
- [ ] Run SQL from deployment guide to create tables

### ☑️ Step 2: GitHub Upload (2 minutes)  
- [ ] Download 2 files from Replit:
  - `client/src/components/SimplePackageSelector.tsx`
  - `client/src/components/AuthModal.tsx`
- [ ] Upload to GitHub repository (same paths)
- [ ] Upload `vercel.json` to root

### ☑️ Step 3: Vercel Deploy (3 minutes)
- [ ] Connect GitHub repo to Vercel
- [ ] Add environment variables:
  - `DATABASE_URL` = neon connection string
  - `JWT_SECRET` = any random secure string
  - `NODE_ENV` = production
- [ ] Deploy

### ☑️ Step 4: Test (2 minutes)
- [ ] Go to Vercel URL
- [ ] Try School Admin signup → see R6999, R17499 packages
- [ ] Try Student signup → see R349, R699, R999 packages

## 🎉 Done!
Your CodewiseHub is live with working package selection!

**Deployment URL**: `https://your-project.vercel.app`