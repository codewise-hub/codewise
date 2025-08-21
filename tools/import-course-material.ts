#!/usr/bin/env tsx

/**
 * Course Material Import Tool for CodewiseHub
 * 
 * This tool imports course material from a JSON file into the database.
 * Usage: npm run import-courses [path-to-json-file]
 * 
 * If no path is provided, it will use the default course-material.json file.
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { db } from '../server/db';
import { courses, lessons, roboticsActivities } from '../shared/schema';
import type { InsertCourse, InsertLesson, InsertRoboticsActivity } from '../shared/schema';

interface CourseData {
  title: string;
  description: string;
  ageGroup: string;
  difficulty?: string;
  category?: string;
  imageUrl?: string;
  estimatedHours?: number;
  isActive?: boolean;
  lessons: LessonData[];
}

interface LessonData {
  title: string;
  description?: string;
  content?: string;
  orderIndex: number;
  type?: string;
  estimatedMinutes?: number;
  videoUrl?: string;
  isRequired?: boolean;
}

interface RoboticsActivityData {
  title: string;
  description: string;
  type?: string;
  difficulty?: string;
  ageGroup: string;
  instructions?: string;
  solution?: string;
  estimatedMinutes?: number;
  points?: number;
  imageUrl?: string;
  isActive?: boolean;
}

interface ImportData {
  courses: CourseData[];
  roboticsActivities: RoboticsActivityData[];
}

async function importCourses(coursesData: CourseData[]): Promise<void> {
  console.log(`📚 Importing ${coursesData.length} courses...`);
  
  for (const courseData of coursesData) {
    try {
      console.log(`   • Creating course: ${courseData.title}`);
      
      // Extract lessons before creating course
      const lessonsData = courseData.lessons;
      const { lessons: _, ...courseWithoutLessons } = courseData;
      
      // Create course
      const [course] = await db
        .insert(courses)
        .values(courseWithoutLessons as InsertCourse)
        .returning();
      
      console.log(`   ✓ Course created with ID: ${course.id}`);
      
      // Create lessons for this course
      if (lessonsData && lessonsData.length > 0) {
        console.log(`     📖 Creating ${lessonsData.length} lessons...`);
        
        for (const lessonData of lessonsData) {
          const lessonToInsert: InsertLesson = {
            ...lessonData,
            courseId: course.id
          };
          
          await db.insert(lessons).values(lessonToInsert);
          console.log(`     ✓ Lesson: ${lessonData.title}`);
        }
      }
      
      console.log(`   ✅ Course "${courseData.title}" imported successfully`);
    } catch (error) {
      console.error(`   ❌ Error importing course "${courseData.title}":`, error);
    }
  }
}

async function importRoboticsActivities(activitiesData: RoboticsActivityData[]): Promise<void> {
  console.log(`🤖 Importing ${activitiesData.length} robotics activities...`);
  
  for (const activityData of activitiesData) {
    try {
      console.log(`   • Creating activity: ${activityData.title}`);
      
      await db
        .insert(roboticsActivities)
        .values(activityData as InsertRoboticsActivity);
      
      console.log(`   ✓ Activity: ${activityData.title}`);
    } catch (error) {
      console.error(`   ❌ Error importing activity "${activityData.title}":`, error);
    }
  }
}

async function clearExistingData(): Promise<void> {
  console.log('🧹 Clearing existing course data...');
  
  try {
    // Delete in order (lessons first due to foreign key constraints)
    await db.delete(lessons);
    console.log('   ✓ Lessons cleared');
    
    await db.delete(courses);
    console.log('   ✓ Courses cleared');
    
    await db.delete(roboticsActivities);
    console.log('   ✓ Robotics activities cleared');
    
    console.log('✅ Existing data cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing existing data:', error);
    throw error;
  }
}

async function validateDatabase(): Promise<void> {
  console.log('🔍 Validating database connection...');
  
  try {
    // Test database connection
    const result = await db.select().from(courses).limit(1);
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

async function showImportSummary(): Promise<void> {
  console.log('\n📊 Import Summary:');
  
  try {
    const courseCount = await db.select().from(courses);
    const lessonCount = await db.select().from(lessons);
    const activityCount = await db.select().from(roboticsActivities);
    
    console.log(`   • Courses: ${courseCount.length}`);
    console.log(`   • Lessons: ${lessonCount.length}`);
    console.log(`   • Robotics Activities: ${activityCount.length}`);
    
    console.log('\n📚 Courses by Age Group:');
    const coursesByAge = courseCount.reduce((acc, course) => {
      acc[course.ageGroup] = (acc[course.ageGroup] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    Object.entries(coursesByAge).forEach(([ageGroup, count]) => {
      console.log(`   • ${ageGroup}: ${count} courses`);
    });
    
  } catch (error) {
    console.error('❌ Error generating summary:', error);
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const filePath = args[0] || join(process.cwd(), 'course-material.json');
  
  console.log('🚀 CodewiseHub Course Material Import Tool');
  console.log('==========================================');
  console.log(`📂 Reading from: ${filePath}`);
  
  try {
    // Read and parse the JSON file
    const fileContent = readFileSync(filePath, 'utf8');
    const data: ImportData = JSON.parse(fileContent);
    
    console.log(`✅ JSON file parsed successfully`);
    console.log(`   • Found ${data.courses?.length || 0} courses`);
    console.log(`   • Found ${data.roboticsActivities?.length || 0} robotics activities`);
    
    // Validate database connection
    await validateDatabase();
    
    // Ask user if they want to clear existing data
    console.log('\n⚠️  This will replace all existing course material.');
    console.log('   Continue? (Press Ctrl+C to cancel)');
    
    // Clear existing data
    await clearExistingData();
    
    // Import courses
    if (data.courses && data.courses.length > 0) {
      await importCourses(data.courses);
    }
    
    // Import robotics activities
    if (data.roboticsActivities && data.roboticsActivities.length > 0) {
      await importRoboticsActivities(data.roboticsActivities);
    }
    
    // Show summary
    await showImportSummary();
    
    console.log('\n🎉 Import completed successfully!');
    console.log('   Your CodewiseHub platform is now ready with course material.');
    
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('❌ Invalid JSON file:', error.message);
    } else if (error.code === 'ENOENT') {
      console.error('❌ File not found:', filePath);
      console.log('💡 Make sure the course-material.json file exists or provide a valid path.');
    } else {
      console.error('❌ Import failed:', error);
    }
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Import cancelled by user');
  process.exit(0);
});

// Run the import
main().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});