#!/usr/bin/env node

/**
 * Production Deployment Script for CodewiseHub
 * Node.js version (no TypeScript compilation needed)
 */

import { readFileSync } from 'fs';
import { join } from 'path';

async function importCourseData(productionUrl, apiKey) {
  console.log('🚀 Production Course Import Script');
  console.log('==================================');
  
  const filePath = join(process.cwd(), 'course-material.json');
  
  try {
    // Read course material
    const fileContent = readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    console.log(`📂 Loaded course material:`);
    console.log(`   • ${data.courses?.length || 0} courses`);
    console.log(`   • ${data.roboticsActivities?.length || 0} robotics activities`);
    
    // Import via batch endpoint
    const response = await fetch(`${productionUrl}/api/import-courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'Authorization': `Bearer ${apiKey}` })
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('✅ Production import completed successfully!');
    console.log(`   • Imported: ${result.results?.coursesImported || 0} courses`);
    console.log(`   • Imported: ${result.results?.lessonsImported || 0} lessons`);
    console.log(`   • Imported: ${result.results?.activitiesImported || 0} activities`);
    console.log(`   Visit: ${productionUrl}/admin to view imported content`);
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    console.error('💡 Make sure your Vercel app is deployed and accessible');
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const productionUrl = args[0];
  const apiKey = args[1];
  
  if (!productionUrl) {
    console.error('❌ Usage: node tools/deploy-to-production.js <PRODUCTION_URL> [API_KEY]');
    console.error('   Example: node tools/deploy-to-production.js https://your-app.vercel.app');
    process.exit(1);
  }
  
  const cleanUrl = productionUrl.replace(/\/$/, ''); // Remove trailing slash
  console.log(`🎯 Target: ${cleanUrl}`);
  
  // Test server connectivity
  try {
    const testResponse = await fetch(`${cleanUrl}/api/courses`);
    console.log(`🔗 Server connectivity: ${testResponse.ok ? 'OK' : 'Needs database setup'}`);
  } catch (error) {
    console.error('❌ Cannot connect to production server');
    console.error('   Make sure your Vercel deployment is complete');
    process.exit(1);
  }
  
  await importCourseData(cleanUrl, apiKey);
}

main().catch((error) => {
  console.error('❌ Deployment failed:', error);
  process.exit(1);
});