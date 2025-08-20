#!/usr/bin/env node

/**
 * Vercel Status Checker
 * Tests if your Vercel deployment is working correctly
 */

async function checkVercelStatus(baseUrl) {
  console.log('🔍 Checking Vercel Deployment Status');
  console.log('====================================');
  console.log(`Target: ${baseUrl}\n`);
  
  const tests = [
    { name: 'Main Page', url: '/' },
    { name: 'API Health', url: '/api/courses' },
    { name: 'API Import', url: '/api/import-courses' },
    { name: 'Admin Page', url: '/admin' }
  ];
  
  for (const test of tests) {
    try {
      const response = await fetch(`${baseUrl}${test.url}`);
      const status = response.status;
      
      if (status === 200) {
        console.log(`✅ ${test.name}: Working (${status})`);
      } else if (status === 404) {
        console.log(`⚠️  ${test.name}: Not found (${status})`);
      } else if (status === 500) {
        console.log(`❌ ${test.name}: Server error (${status})`);
        
        // Try to get more details for 500 errors
        try {
          const text = await response.text();
          if (text.includes('FUNCTION_INVOCATION_FAILED')) {
            console.log(`   → Serverless function crashed`);
          } else if (text.includes('DATABASE')) {
            console.log(`   → Database connection issue`);
          }
        } catch (e) {
          // Ignore errors getting error details
        }
      } else {
        console.log(`⚠️  ${test.name}: Unexpected status (${status})`);
      }
      
    } catch (error) {
      console.log(`❌ ${test.name}: Connection failed`);
      console.log(`   → ${error.message}`);
    }
  }
  
  console.log('\n📋 Diagnosis:');
  
  // Try to diagnose the main issue
  try {
    const healthCheck = await fetch(`${baseUrl}/api/courses`);
    
    if (healthCheck.status === 500) {
      console.log('🔧 API endpoints are crashing - likely database issues');
      console.log('   1. Check DATABASE_URL in Vercel environment variables');
      console.log('   2. Run: npm run db:push to create database schema');
      console.log('   3. Verify your database provider is accessible');
    } else if (healthCheck.status === 404) {
      console.log('🔧 API routes not found - deployment issue');
      console.log('   1. Check if all files were uploaded to GitHub');
      console.log('   2. Verify Vercel build completed successfully');
    } else if (healthCheck.ok) {
      console.log('✨ API is working! Ready for course import');
    }
    
  } catch (error) {
    console.log('🔧 Cannot connect to server');
    console.log('   1. Check if Vercel deployment completed');
    console.log('   2. Verify the URL is correct');
  }
}

async function main() {
  const baseUrl = process.argv[2];
  
  if (!baseUrl) {
    console.error('❌ Usage: node tools/check-vercel-status.js <URL>');
    console.error('   Example: node tools/check-vercel-status.js https://codewise-hub.vercel.app');
    process.exit(1);
  }
  
  await checkVercelStatus(baseUrl.replace(/\/$/, ''));
}

main().catch(console.error);