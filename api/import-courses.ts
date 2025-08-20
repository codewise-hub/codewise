import { readFileSync } from 'fs';
import { join } from 'path';

// Vercel serverless function types
interface VercelRequest {
  method?: string;
  body?: any;
  query?: any;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (data: any) => void;
}

// This creates a Vercel API endpoint at /api/import-courses
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Read course material from uploaded JSON or file system
    let courseData;
    if (req.body && Object.keys(req.body).length > 0) {
      courseData = req.body;
    } else {
      // Fallback to reading from file system
      const coursePath = join(process.cwd(), 'course-material.json');
      courseData = JSON.parse(readFileSync(coursePath, 'utf8'));
    }
    
    // Call the existing API endpoints instead of direct database access
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5000';
    
    const importResults = {
      coursesImported: 0,
      lessonsImported: 0,
      activitiesImported: 0
    };
    
    // Import courses with lessons via existing API
    if (courseData.courses) {
      for (const courseItem of courseData.courses) {
        const { lessons: courseLessons, ...course } = courseItem;
        
        // Import course via API
        const courseResponse = await fetch(`${baseUrl}/api/courses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(course)
        });
        
        if (!courseResponse.ok) continue;
        
        const insertedCourse = await courseResponse.json();
        importResults.coursesImported++;
        
        // Import lessons via API
        if (courseLessons && courseLessons.length > 0) {
          for (const lesson of courseLessons) {
            const lessonResponse = await fetch(`${baseUrl}/api/lessons`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...lesson,
                courseId: insertedCourse.id
              })
            });
            
            if (lessonResponse.ok) {
              importResults.lessonsImported++;
            }
          }
        }
      }
    }
    
    // Import robotics activities via API
    if (courseData.roboticsActivities) {
      for (const activity of courseData.roboticsActivities) {
        const activityResponse = await fetch(`${baseUrl}/api/robotics-activities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(activity)
        });
        
        if (activityResponse.ok) {
          importResults.activitiesImported++;
        }
      }
    }
    
    res.json({
      success: true,
      message: 'Course material imported successfully',
      results: importResults
    });
    
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({
      error: 'Failed to import course material',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}