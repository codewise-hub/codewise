#!/usr/bin/env tsx

/**
 * Production Deployment Script for CodewiseHub
 * 
 * This script helps deploy course material to production after Vercel deployment.
 * It can import course material via API calls to the production server.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

interface DeploymentConfig {
  productionUrl: string;
  apiKey?: string;
}

async function importCourseData(config: DeploymentConfig): Promise<void> {
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
    
    // Import courses
    if (data.courses && data.courses.length > 0) {
      console.log('\\n📚 Importing courses...');
      
      for (const courseData of data.courses) {
        const { lessons, ...course } = courseData;
        
        // Import course
        const courseResponse = await fetch(`${config.productionUrl}/api/courses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` })
          },
          body: JSON.stringify(course)
        });
        
        if (!courseResponse.ok) {
          throw new Error(`Failed to import course: ${courseData.title}`);
        }
        
        const createdCourse = await courseResponse.json();
        console.log(`   ✓ Course: ${courseData.title}`);
        
        // Import lessons for this course
        if (lessons && lessons.length > 0) {
          for (const lesson of lessons) {
            const lessonData = {
              ...lesson,
              courseId: createdCourse.id
            };
            
            const lessonResponse = await fetch(`${config.productionUrl}/api/lessons`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` })
              },
              body: JSON.stringify(lessonData)
            });
            
            if (!lessonResponse.ok) {
              throw new Error(`Failed to import lesson: ${lesson.title}`);
            }
            
            console.log(`     • Lesson: ${lesson.title}`);
          }
        }
      }
    }
    
    // Import robotics activities
    if (data.roboticsActivities && data.roboticsActivities.length > 0) {
      console.log('\\n🤖 Importing robotics activities...');
      
      for (const activity of data.roboticsActivities) {
        const response = await fetch(`${config.productionUrl}/api/robotics-activities`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` })
          },
          body: JSON.stringify(activity)
        });
        
        if (!response.ok) {
          throw new Error(`Failed to import activity: ${activity.title}`);
        }
        
        console.log(`   ✓ Activity: ${activity.title}`);
      }
    }
    
    console.log('\\n🎉 Production import completed successfully!');
    console.log(`   Visit: ${config.productionUrl}/admin to view imported content`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

async function verifyDeployment(config: DeploymentConfig): Promise<void> {
  console.log('\\n🔍 Verifying deployment...');
  
  try {
    // Test API endpoints
    const endpoints = [
      '/api/courses',
      '/api/robotics-activities'
    ];
    
    for (const endpoint of endpoints) {
      const response = await fetch(`${config.productionUrl}${endpoint}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✓ ${endpoint}: ${Array.isArray(data) ? data.length : 'OK'} items`);
      } else {
        console.log(`   ❌ ${endpoint}: Failed (${response.status})`);
      }
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const productionUrl = args[0];
  const apiKey = args[1];
  
  if (!productionUrl) {
    console.error('❌ Usage: tsx tools/deploy-to-production.ts <PRODUCTION_URL> [API_KEY]');
    console.error('   Example: tsx tools/deploy-to-production.ts https://your-app.vercel.app');
    process.exit(1);
  }
  
  const config: DeploymentConfig = {
    productionUrl: productionUrl.replace(/\/$/, ''), // Remove trailing slash
    apiKey
  };
  
  console.log(`🎯 Target: ${config.productionUrl}`);
  
  // Verify the server is accessible
  try {
    const response = await fetch(`${config.productionUrl}/api/courses`);
    if (!response.ok && response.status !== 404) {
      throw new Error(`Server not accessible: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Cannot connect to production server:', error);
    process.exit(1);
  }
  
  // Import course data
  await importCourseData(config);
  
  // Verify deployment
  await verifyDeployment(config);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\\n🛑 Deployment cancelled by user');
  process.exit(0);
});

// Run the deployment
main().catch((error) => {
  console.error('❌ Deployment failed:', error);
  process.exit(1);
});