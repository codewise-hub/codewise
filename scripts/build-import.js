#!/usr/bin/env node

/**
 * Build-time course import for Vercel deployment
 * This script runs during the build process to populate the production database
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function importCourseData() {
  console.log('🚀 Build-time course import starting...');
  
  // Check if we're in production build
  if (process.env.NODE_ENV !== 'production') {
    console.log('⚠️ Skipping import - not in production build');
    return;
  }
  
  // Check if DATABASE_URL is available
  if (!process.env.DATABASE_URL) {
    console.log('⚠️ DATABASE_URL not found, skipping course import');
    return;
  }
  
  try {
    // Dynamically import the database modules
    const { Pool, neonConfig } = await import('@neondatabase/serverless');
    const { drizzle } = await import('drizzle-orm/neon-serverless');
    const ws = await import('ws');
    
    // Set up database connection
    neonConfig.webSocketConstructor = ws.default;
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle({ client: pool });
    
    // Read course material
    const coursePath = join(__dirname, '../course-material.json');
    const courseData = JSON.parse(readFileSync(coursePath, 'utf8'));
    
    console.log(`📚 Found ${courseData.courses?.length || 0} courses to import`);
    console.log(`🤖 Found ${courseData.roboticsActivities?.length || 0} activities to import`);
    
    // Import via API call to our own server (after it's deployed)
    const serverUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5000';
    
    const response = await fetch(`${serverUrl}/api/import-courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Build-time import successful:', result.message);
    } else {
      console.log('⚠️ Build-time import failed, will need manual import');
    }
    
  } catch (error) {
    console.log('⚠️ Build-time import error:', error.message);
    console.log('📝 Course material can be imported manually after deployment');
  }
}

importCourseData();