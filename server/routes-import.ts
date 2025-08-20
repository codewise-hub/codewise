import type { Express } from "express";
import { storage } from "./storage";
import { 
  insertCourseSchema, 
  insertLessonSchema, 
  insertRoboticsActivitySchema 
} from "@shared/schema";

/**
 * Batch import endpoint for course material
 * This endpoint allows importing multiple courses, lessons, and activities at once
 */
export function registerImportRoutes(app: Express): void {
  
  // Batch import endpoint for course material
  app.post("/api/import-courses", async (req, res) => {
    try {
      const { courses = [], roboticsActivities = [] } = req.body;
      
      console.log(`📚 Importing ${courses.length} courses and ${roboticsActivities.length} activities`);
      
      const importedCourses = [];
      const importedActivities = [];
      
      // Import courses with their lessons
      for (const courseData of courses) {
        const { lessons, ...course } = courseData;
        
        // Validate and create course
        const validatedCourse = insertCourseSchema.parse(course);
        const createdCourse = await storage.createCourse(validatedCourse);
        importedCourses.push(createdCourse);
        
        // Import lessons for this course
        if (lessons && lessons.length > 0) {
          for (const lessonData of lessons) {
            const lessonWithCourseId = {
              ...lessonData,
              courseId: createdCourse.id
            };
            
            const validatedLesson = insertLessonSchema.parse(lessonWithCourseId);
            await storage.createLesson(validatedLesson);
          }
        }
      }
      
      // Import robotics activities
      for (const activityData of roboticsActivities) {
        const validatedActivity = insertRoboticsActivitySchema.parse(activityData);
        const createdActivity = await storage.createRoboticsActivity(validatedActivity);
        importedActivities.push(createdActivity);
      }
      
      res.json({
        success: true,
        imported: {
          courses: importedCourses.length,
          activities: importedActivities.length
        },
        message: `Successfully imported ${importedCourses.length} courses and ${importedActivities.length} activities`
      });
      
    } catch (error) {
      console.error('Import error:', error);
      res.status(400).json({ 
        error: "Failed to import course material",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Clear all course data (use with caution)
  app.delete("/api/clear-courses", async (req, res) => {
    try {
      // This would require additional methods in storage interface
      // For now, return a message about manual clearing
      res.json({
        message: "Course clearing must be done through database administration",
        instructions: "Use your database provider's interface to clear course data"
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear course data" });
    }
  });
}