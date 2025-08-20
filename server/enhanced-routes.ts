import type { Express } from "express";
import { enhancedStorage } from "./enhanced-storage";
import { 
  insertPackageSchema,
  insertSchoolSchema,
  insertUserSchema,
  insertParentChildRelationSchema,
  insertCourseSchema,
  insertLessonSchema,
  insertRoboticsActivitySchema,
} from "@shared/schema";

export function registerEnhancedRoutes(app: Express): void {
  
  // Package routes
  app.get("/api/packages", async (req, res) => {
    try {
      const { type } = req.query;
      const packages = await enhancedStorage.getPackages(type as string);
      res.json(packages);
    } catch (error) {
      console.error("Error fetching packages:", error);
      res.status(500).json({ error: "Failed to fetch packages" });
    }
  });

  app.post("/api/packages", async (req, res) => {
    try {
      const validatedPackage = insertPackageSchema.parse(req.body);
      const newPackage = await enhancedStorage.createPackage(validatedPackage);
      res.json(newPackage);
    } catch (error) {
      console.error("Error creating package:", error);
      res.status(400).json({ error: "Invalid package data" });
    }
  });

  // School routes
  app.post("/api/schools", async (req, res) => {
    try {
      const validatedSchool = insertSchoolSchema.parse(req.body);
      const school = await enhancedStorage.createSchool(validatedSchool);
      res.json(school);
    } catch (error) {
      console.error("Error creating school:", error);
      res.status(400).json({ error: "Invalid school data" });
    }
  });

  app.get("/api/schools/:id", async (req, res) => {
    try {
      const school = await enhancedStorage.getSchoolById(req.params.id);
      if (!school) {
        return res.status(404).json({ error: "School not found" });
      }
      res.json(school);
    } catch (error) {
      console.error("Error fetching school:", error);
      res.status(500).json({ error: "Failed to fetch school" });
    }
  });

  app.get("/api/schools/:id/users", async (req, res) => {
    try {
      const users = await enhancedStorage.getSchoolUsers(req.params.id);
      res.json(users);
    } catch (error) {
      console.error("Error fetching school users:", error);
      res.status(500).json({ error: "Failed to fetch school users" });
    }
  });

  // Enhanced user routes
  app.post("/api/users", async (req, res) => {
    try {
      const validatedUser = insertUserSchema.parse(req.body);
      const user = await enhancedStorage.createUser(validatedUser);
      res.json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  app.post("/api/users/select-package", async (req, res) => {
    try {
      const { userId, packageId } = req.body;
      
      if (!userId || !packageId) {
        return res.status(400).json({ error: "Missing userId or packageId" });
      }

      const user = await enhancedStorage.updateUserPackage(userId, packageId);
      res.json(user);
    } catch (error) {
      console.error("Error selecting package:", error);
      res.status(500).json({ error: "Failed to select package" });
    }
  });

  app.get("/api/users/search-student", async (req, res) => {
    try {
      const { email } = req.query;
      
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: "Email parameter required" });
      }

      const student = await enhancedStorage.searchStudentByEmail(email);
      
      if (student) {
        res.json({ user: student });
      } else {
        res.json({ user: null });
      }
    } catch (error) {
      console.error("Error searching for student:", error);
      res.status(500).json({ error: "Failed to search for student" });
    }
  });

  // School admin routes
  app.post("/api/schools/create-user", async (req, res) => {
    try {
      const { schoolId, ...userData } = req.body;
      
      const validatedUser = insertUserSchema.parse({
        ...userData,
        schoolId,
        subscriptionStatus: 'active', // School users get active status
      });
      
      const user = await enhancedStorage.createUser(validatedUser);
      res.json(user);
    } catch (error) {
      console.error("Error creating school user:", error);
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  // Parent-child relationship routes
  app.post("/api/parent-child-relations", async (req, res) => {
    try {
      const validatedRelation = insertParentChildRelationSchema.parse(req.body);
      const relation = await enhancedStorage.createParentChildRelation(validatedRelation);
      res.json(relation);
    } catch (error) {
      console.error("Error creating parent-child relation:", error);
      res.status(400).json({ error: "Invalid relation data" });
    }
  });

  app.get("/api/parent-child-relations/children/:parentId", async (req, res) => {
    try {
      const children = await enhancedStorage.getParentChildren(req.params.parentId);
      res.json(children);
    } catch (error) {
      console.error("Error fetching children:", error);
      res.status(500).json({ error: "Failed to fetch children" });
    }
  });

  app.get("/api/parent-child-relations/parents/:childId", async (req, res) => {
    try {
      const parents = await enhancedStorage.getChildParents(req.params.childId);
      res.json(parents);
    } catch (error) {
      console.error("Error fetching parents:", error);
      res.status(500).json({ error: "Failed to fetch parents" });
    }
  });

  // Enhanced course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const { ageGroup, schoolId } = req.query;
      const courses = await enhancedStorage.getCourses(
        ageGroup as string, 
        schoolId as string
      );
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  app.post("/api/courses", async (req, res) => {
    try {
      const validatedCourse = insertCourseSchema.parse(req.body);
      const course = await enhancedStorage.createCourse(validatedCourse);
      res.json(course);
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(400).json({ error: "Invalid course data" });
    }
  });

  app.get("/api/courses/:id/lessons", async (req, res) => {
    try {
      const lessons = await enhancedStorage.getLessonsByCourse(req.params.id);
      res.json(lessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      res.status(500).json({ error: "Failed to fetch lessons" });
    }
  });

  app.post("/api/lessons", async (req, res) => {
    try {
      const validatedLesson = insertLessonSchema.parse(req.body);
      const lesson = await enhancedStorage.createLesson(validatedLesson);
      res.json(lesson);
    } catch (error) {
      console.error("Error creating lesson:", error);
      res.status(400).json({ error: "Invalid lesson data" });
    }
  });

  app.get("/api/robotics-activities", async (req, res) => {
    try {
      const { ageGroup } = req.query;
      const activities = await enhancedStorage.getRoboticsActivities(ageGroup as string);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching robotics activities:", error);
      res.status(500).json({ error: "Failed to fetch robotics activities" });
    }
  });

  app.post("/api/robotics-activities", async (req, res) => {
    try {
      const validatedActivity = insertRoboticsActivitySchema.parse(req.body);
      const activity = await enhancedStorage.createRoboticsActivity(validatedActivity);
      res.json(activity);
    } catch (error) {
      console.error("Error creating robotics activity:", error);
      res.status(400).json({ error: "Invalid robotics activity data" });
    }
  });

  // User progress and achievement routes
  app.get("/api/users/:id/progress", async (req, res) => {
    try {
      const progress = await enhancedStorage.getUserProgress(req.params.id);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ error: "Failed to fetch user progress" });
    }
  });

  app.get("/api/users/:id/projects", async (req, res) => {
    try {
      const projects = await enhancedStorage.getUserProjects(req.params.id);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching user projects:", error);
      res.status(500).json({ error: "Failed to fetch user projects" });
    }
  });

  app.get("/api/users/:id/achievements", async (req, res) => {
    try {
      const achievements = await enhancedStorage.getUserAchievements(req.params.id);
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ error: "Failed to fetch user achievements" });
    }
  });
}