import type { Express } from "express";
import { createServer, type Server } from "http";
import cookieParser from 'cookie-parser';
import authRoutes from './authRoutes';
import packageRoutes from './packageRoutes';
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertCourseSchema, 
  insertLessonSchema, 
  insertRoboticsActivitySchema 
} from "../shared/schema";
import { registerImportRoutes } from "./routes-import";
import { registerEnhancedRoutes } from "./enhanced-routes";

export async function registerRoutes(app: Express): Promise<Server> {
  // Add middleware
  app.use(cookieParser());
  
  // Auth routes
  app.use('/api/auth', authRoutes);
  
  // Package routes
  app.use('/api', packageRoutes);
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const { ageGroup } = req.query;
      let courses;
      
      if (ageGroup && typeof ageGroup === 'string') {
        courses = await storage.getCoursesByAgeGroup(ageGroup);
      } else {
        courses = await storage.getAllCourses();
      }
      
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/courses", async (req, res) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      res.status(400).json({ error: "Invalid course data" });
    }
  });

  // Lesson routes
  app.get("/api/courses/:courseId/lessons", async (req, res) => {
    try {
      const lessons = await storage.getLessonsByCourse(req.params.courseId);
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/lessons", async (req, res) => {
    try {
      const lessonData = insertLessonSchema.parse(req.body);
      const lesson = await storage.createLesson(lessonData);
      res.status(201).json(lesson);
    } catch (error) {
      res.status(400).json({ error: "Invalid lesson data" });
    }
  });

  // Robotics activities routes
  app.get("/api/robotics-activities", async (req, res) => {
    try {
      const { ageGroup } = req.query;
      let activities;
      
      if (ageGroup && typeof ageGroup === 'string') {
        activities = await storage.getRoboticsActivitiesByAgeGroup(ageGroup);
      } else {
        activities = await storage.getAllRoboticsActivities();
      }
      
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/robotics-activities", async (req, res) => {
    try {
      const activityData = insertRoboticsActivitySchema.parse(req.body);
      const activity = await storage.createRoboticsActivity(activityData);
      res.status(201).json(activity);
    } catch (error) {
      res.status(400).json({ error: "Invalid robotics activity data" });
    }
  });

  // Register import routes for production deployment
  registerImportRoutes(app);
  
  // Register enhanced routes for multi-role system
  registerEnhancedRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
