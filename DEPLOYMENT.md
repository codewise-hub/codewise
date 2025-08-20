# Vercel Deployment Guide for CodewiseHub

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **Environment Variables**: You'll need your Firebase and Database credentials

## Step 1: Prepare Your Code

### 1.1 Update package.json Scripts
Add this script to your `package.json` (manually):
```json
{
  "scripts": {
    "vercel-build": "npm run build"
  }
}
```

### 1.2 Files Already Created
I've created the following files for Vercel deployment:
- `vercel.json` - Vercel configuration
- `.vercelignore` - Files to ignore during deployment
- `api/index.ts` - Serverless API endpoint
```

### 1.3 Environment Variables Needed
Set these in Vercel dashboard:
```
DATABASE_URL=your_neon_database_url
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
ANTHROPIC_API_KEY=your_anthropic_api_key (optional, for AI features)
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Connect your GitHub repository
4. Select your CodewiseHub repository
5. Configure build settings:
   - **Framework Preset**: Other
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Follow the prompts:
# Set up and deploy? Yes
# Which scope? (select your account)
# Link to existing project? No
# Project name: codewise-hub
# In which directory is your code? ./
# Want to override settings? Yes
# Build Command: npm run vercel-build
# Output Directory: dist/public
# Development Command: npm run dev
```

## Step 3: Configure Environment Variables

### In Vercel Dashboard:
1. Go to your project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables"
4. Add each variable:

**Database Configuration:**
```
DATABASE_URL: your_postgresql_connection_string
```

**Firebase Configuration:**
```
VITE_FIREBASE_API_KEY: your_api_key
VITE_FIREBASE_PROJECT_ID: your_project_id
VITE_FIREBASE_APP_ID: your_app_id
```

**Optional AI Features:**
```
ANTHROPIC_API_KEY: your_anthropic_key
```

## Step 4: Database Setup

### Option A: Neon Database (Recommended)
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add it as `DATABASE_URL` in Vercel

### Option B: Vercel Postgres
1. In your Vercel project dashboard
2. Go to "Storage" tab
3. Create a new Postgres database
4. The `DATABASE_URL` will be automatically added

## Step 5: Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing
3. Enable Authentication with Google provider
4. Add your Vercel domain to authorized domains:
   - `your-app-name.vercel.app`
5. Get configuration values from Project Settings

## Step 6: Custom Domain (Optional)

1. In Vercel dashboard, go to "Domains" tab
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update Firebase authorized domains

## Troubleshooting

### Build Errors
- Ensure all dependencies are in `dependencies`, not `devDependencies`
- Check that TypeScript compiles without errors
- Verify all environment variables are set

### Runtime Errors
- Check Vercel Function logs in the dashboard
- Ensure database connection is working
- Verify Firebase configuration

### Performance Optimization
- Enable Vercel Analytics
- Use Vercel Speed Insights
- Monitor function execution times

## Project Structure for Vercel

```
your-project/
├── vercel.json          # Vercel configuration
├── .vercelignore       # Files to ignore during deployment
├── server/             # Backend API routes
│   └── index.ts       # Main server file
├── client/            # Frontend React app
│   └── src/
├── shared/            # Shared types and schemas
├── dist/              # Build output
│   └── public/        # Static files
└── package.json       # Dependencies and scripts
```

## Success Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created and connected
- [ ] Environment variables configured
- [ ] Database connected and accessible
- [ ] Firebase authentication working
- [ ] Build completes successfully
- [ ] App loads and functions correctly
- [ ] Custom domain configured (if needed)

Your CodewiseHub platform will be live at: `https://your-project-name.vercel.app`