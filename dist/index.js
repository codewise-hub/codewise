var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import cookieParser from "cookie-parser";

// server/authRoutes.ts
import { Router } from "express";
import { z } from "zod";
import { eq as eq2 } from "drizzle-orm";

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  achievements: () => achievements,
  courses: () => courses,
  insertAchievementSchema: () => insertAchievementSchema,
  insertCourseSchema: () => insertCourseSchema,
  insertLessonSchema: () => insertLessonSchema,
  insertPackageSchema: () => insertPackageSchema,
  insertParentChildRelationSchema: () => insertParentChildRelationSchema,
  insertProgressSchema: () => insertProgressSchema,
  insertProjectSchema: () => insertProjectSchema,
  insertRoboticsActivitySchema: () => insertRoboticsActivitySchema,
  insertSchoolSchema: () => insertSchoolSchema,
  insertUserSchema: () => insertUserSchema,
  insertUserSessionSchema: () => insertUserSessionSchema,
  lessons: () => lessons,
  packages: () => packages,
  packagesRelations: () => packagesRelations,
  parentChildRelations: () => parentChildRelations,
  parentChildRelationsRelations: () => parentChildRelationsRelations,
  projects: () => projects,
  roboticsActivities: () => roboticsActivities,
  schools: () => schools,
  schoolsRelations: () => schoolsRelations,
  userProgress: () => userProgress,
  userSessions: () => userSessions,
  users: () => users,
  usersRelations: () => usersRelations
});
import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var packages = pgTable("packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),
  duration: text("duration").notNull(),
  // 'monthly', 'yearly'
  features: text("features"),
  // JSON array of features
  maxStudents: integer("max_students"),
  // for school packages
  packageType: text("package_type").notNull(),
  // 'individual', 'school'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var schools = pgTable("schools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  adminUserId: varchar("admin_user_id"),
  // references users.id
  packageId: varchar("package_id").references(() => packages.id),
  subscriptionStatus: text("subscription_status").default("active"),
  // 'active', 'suspended', 'cancelled'
  subscriptionStart: timestamp("subscription_start"),
  subscriptionEnd: timestamp("subscription_end"),
  maxStudents: integer("max_students").default(100),
  currentStudents: integer("current_students").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  name: text("name").notNull(),
  role: text("role").notNull(),
  // 'student', 'teacher', 'parent', 'school_admin'
  ageGroup: text("age_group"),
  // '6-11', '12-17' for students
  // Package and subscription info
  packageId: varchar("package_id").references(() => packages.id),
  subscriptionStatus: text("subscription_status").default("pending"),
  // 'pending', 'active', 'expired', 'cancelled'
  subscriptionStart: timestamp("subscription_start"),
  subscriptionEnd: timestamp("subscription_end"),
  // School association
  schoolId: varchar("school_id").references(() => schools.id),
  // Parent-child relationship
  parentUserId: varchar("parent_user_id"),
  // references users.id for parent linking
  // Additional info
  grade: text("grade"),
  // for students
  subjects: text("subjects"),
  // JSON array for teachers
  lastLoginAt: timestamp("last_login_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var userSessions = pgTable("user_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  sessionToken: text("session_token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow()
});
var parentChildRelations = pgTable("parent_child_relations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  parentUserId: varchar("parent_user_id").references(() => users.id).notNull(),
  childUserId: varchar("child_user_id").references(() => users.id).notNull(),
  relationshipType: text("relationship_type").default("parent"),
  // 'parent', 'guardian'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  ageGroup: text("age_group").notNull(),
  difficulty: text("difficulty"),
  // 'beginner', 'intermediate', 'advanced'
  category: text("category"),
  // 'programming', 'robotics', 'web-development'
  imageUrl: text("image_url"),
  estimatedHours: integer("estimated_hours").default(10),
  teacherId: varchar("teacher_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var lessons = pgTable("lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").references(() => courses.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  // JSON string for rich content
  orderIndex: integer("order_index").notNull(),
  type: text("type"),
  // 'video', 'interactive', 'quiz', 'project'
  estimatedMinutes: integer("estimated_minutes").default(30),
  videoUrl: text("video_url"),
  isRequired: boolean("is_required").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var roboticsActivities = pgTable("robotics_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type"),
  // 'puzzle', 'maze', 'challenge'
  difficulty: text("difficulty"),
  // 'easy', 'medium', 'hard'
  ageGroup: text("age_group").notNull(),
  instructions: text("instructions"),
  // JSON string
  solution: text("solution"),
  // JSON string
  estimatedMinutes: integer("estimated_minutes").default(15),
  points: integer("points").default(100),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  courseId: varchar("course_id").references(() => courses.id),
  lessonsCompleted: integer("lessons_completed").default(0),
  projectsCompleted: integer("projects_completed").default(0),
  totalScore: integer("total_score").default(0),
  level: integer("level").default(1),
  updatedAt: timestamp("updated_at").defaultNow()
});
var projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  code: text("code"),
  projectType: text("project_type"),
  // 'blockly', 'javascript', 'microbit'
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  badgeType: text("badge_type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  earnedAt: timestamp("earned_at").defaultNow()
});
var usersRelations = relations(users, ({ one, many }) => ({
  package: one(packages, {
    fields: [users.packageId],
    references: [packages.id]
  }),
  school: one(schools, {
    fields: [users.schoolId],
    references: [schools.id]
  }),
  parentRelations: many(parentChildRelations, {
    relationName: "parentRelations"
  }),
  childRelations: many(parentChildRelations, {
    relationName: "childRelations"
  }),
  courses: many(courses),
  progress: many(userProgress),
  projects: many(projects),
  achievements: many(achievements)
}));
var schoolsRelations = relations(schools, ({ one, many }) => ({
  package: one(packages, {
    fields: [schools.packageId],
    references: [packages.id]
  }),
  users: many(users)
}));
var packagesRelations = relations(packages, ({ many }) => ({
  users: many(users),
  schools: many(schools)
}));
var parentChildRelationsRelations = relations(parentChildRelations, ({ one }) => ({
  parent: one(users, {
    fields: [parentChildRelations.parentUserId],
    references: [users.id],
    relationName: "parentRelations"
  }),
  child: one(users, {
    fields: [parentChildRelations.childUserId],
    references: [users.id],
    relationName: "childRelations"
  })
}));
var insertPackageSchema = createInsertSchema(packages).omit({
  id: true,
  createdAt: true
});
var insertSchoolSchema = createInsertSchema(schools).omit({
  id: true,
  createdAt: true
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true
});
var insertUserSessionSchema = createInsertSchema(userSessions).omit({
  id: true,
  createdAt: true
});
var insertParentChildRelationSchema = createInsertSchema(parentChildRelations).omit({
  id: true,
  createdAt: true
});
var insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true
});
var insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true
});
var insertRoboticsActivitySchema = createInsertSchema(roboticsActivities).omit({
  id: true,
  createdAt: true
});
var insertProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  updatedAt: true
});
var insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true
});
var insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  earnedAt: true
});

// server/db.ts
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/auth.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq, and, sql as sql2 } from "drizzle-orm";
var JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
var SESSION_DURATION = 7 * 24 * 60 * 60 * 1e3;
async function hashPassword(password) {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
function generateSessionToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}
async function createUserSession(userId, userAgent, ipAddress) {
  const sessionToken = generateSessionToken(userId);
  const expiresAt = new Date(Date.now() + SESSION_DURATION);
  await db.insert(userSessions).values({
    userId,
    sessionToken,
    expiresAt,
    userAgent,
    ipAddress
  });
  return sessionToken;
}
async function getUserBySessionToken(sessionToken) {
  try {
    const decoded = jwt.verify(sessionToken, JWT_SECRET);
    const session = await db.select().from(userSessions).where(
      and(
        eq(userSessions.sessionToken, sessionToken),
        sql2`${userSessions.expiresAt} > NOW()`
      )
    ).limit(1);
    if (session.length === 0) {
      return null;
    }
    const user = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1);
    return user[0] || null;
  } catch (error) {
    return null;
  }
}
async function revokeSession(sessionToken) {
  await db.delete(userSessions).where(eq(userSessions.sessionToken, sessionToken));
}
async function requireAuth(req, res, next) {
  try {
    const sessionToken = req.cookies?.sessionToken || req.headers.authorization?.replace("Bearer ", "");
    if (!sessionToken) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }
    const user = await getUserBySessionToken(sessionToken);
    if (!user) {
      res.status(401).json({ error: "Invalid or expired session" });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
}
async function createUser(userData) {
  const { password, ...userDetails } = userData;
  const passwordHash = await hashPassword(password);
  const newUser = await db.insert(users).values({
    ...userDetails,
    passwordHash
  }).returning();
  return newUser[0];
}
async function signInUser(email, password, userAgent, ipAddress) {
  const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (userResult.length === 0) {
    return null;
  }
  const user = userResult[0];
  if (!user.passwordHash || !await verifyPassword(password, user.passwordHash)) {
    return null;
  }
  await db.update(users).set({ lastLoginAt: /* @__PURE__ */ new Date() }).where(eq(users.id, user.id));
  const sessionToken = await createUserSession(user.id, userAgent, ipAddress);
  return { user, sessionToken };
}
async function signOutUser(sessionToken) {
  await revokeSession(sessionToken);
}

// server/authRoutes.ts
var router = Router();
var signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(["student", "teacher", "parent", "school_admin"]),
  ageGroup: z.enum(["6-11", "12-17"]).optional(),
  childName: z.string().optional(),
  schoolName: z.string().optional(),
  packageId: z.string().optional()
});
var signInSchema = z.object({
  email: z.string().email(),
  password: z.string()
});
router.post("/signup", async (req, res) => {
  try {
    const data = signUpSchema.parse(req.body);
    const existingUser = await db.select().from(users).where(eq2(users.email, data.email)).limit(1);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }
    const user = await createUser(data);
    const signInResult = await signInUser(
      data.email,
      data.password,
      req.get("User-Agent"),
      req.ip
    );
    if (!signInResult) {
      return res.status(500).json({ error: "Failed to sign in after signup" });
    }
    res.cookie("sessionToken", signInResult.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1e3
      // 7 days
    });
    const { passwordHash, ...userWithoutPassword } = signInResult.user;
    res.json({ user: userWithoutPassword, sessionToken: signInResult.sessionToken });
  } catch (error) {
    console.error("Signup error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = signInSchema.parse(req.body);
    const result = await signInUser(
      email,
      password,
      req.get("User-Agent"),
      req.ip
    );
    if (!result) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.cookie("sessionToken", result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1e3
      // 7 days
    });
    const { passwordHash, ...userWithoutPassword } = result.user;
    res.json({ user: userWithoutPassword, sessionToken: result.sessionToken });
  } catch (error) {
    console.error("Signin error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/signout", requireAuth, async (req, res) => {
  try {
    const sessionToken = req.cookies?.sessionToken || req.headers.authorization?.replace("Bearer ", "");
    if (sessionToken) {
      await signOutUser(sessionToken);
    }
    res.clearCookie("sessionToken");
    res.json({ message: "Signed out successfully" });
  } catch (error) {
    console.error("Signout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/me", requireAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not found" });
    }
    const { passwordHash, ...userWithoutPassword } = req.user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
var authRoutes_default = router;

// server/packageRoutes.ts
import { Router as Router2 } from "express";
import { eq as eq3, and as and2 } from "drizzle-orm";
var router2 = Router2();
router2.get("/packages", async (req, res) => {
  try {
    const packageType = req.query.type;
    let availablePackages;
    if (packageType) {
      availablePackages = await db.select().from(packages).where(and2(
        eq3(packages.isActive, true),
        eq3(packages.packageType, packageType)
      ));
    } else {
      availablePackages = await db.select().from(packages).where(eq3(packages.isActive, true));
    }
    res.json(availablePackages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ error: "Failed to fetch packages" });
  }
});
router2.get("/packages/:id", async (req, res) => {
  try {
    const [packageData] = await db.select().from(packages).where(eq3(packages.id, req.params.id)).limit(1);
    if (!packageData) {
      return res.status(404).json({ error: "Package not found" });
    }
    res.json(packageData);
  } catch (error) {
    console.error("Error fetching package:", error);
    res.status(500).json({ error: "Failed to fetch package" });
  }
});
var packageRoutes_default = router2;

// server/storage.ts
import { eq as eq4 } from "drizzle-orm";
var DatabaseStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq4(users.id, id));
    return user || void 0;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq4(users.email, email));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  // Course management
  async createCourse(course) {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }
  async getAllCourses() {
    return await db.select().from(courses);
  }
  async getCoursesByAgeGroup(ageGroup) {
    return await db.select().from(courses).where(eq4(courses.ageGroup, ageGroup));
  }
  // Lesson management
  async createLesson(lesson) {
    const [newLesson] = await db.insert(lessons).values(lesson).returning();
    return newLesson;
  }
  async getLessonsByCourse(courseId) {
    return await db.select().from(lessons).where(eq4(lessons.courseId, courseId));
  }
  // Robotics activities
  async createRoboticsActivity(activity) {
    const [newActivity] = await db.insert(roboticsActivities).values(activity).returning();
    return newActivity;
  }
  async getAllRoboticsActivities() {
    return await db.select().from(roboticsActivities);
  }
  async getRoboticsActivitiesByAgeGroup(ageGroup) {
    return await db.select().from(roboticsActivities).where(eq4(roboticsActivities.ageGroup, ageGroup));
  }
};
var storage = new DatabaseStorage();

// server/routes-import.ts
function registerImportRoutes(app2) {
  app2.post("/api/import-courses", async (req, res) => {
    try {
      const { courses: courses2 = [], roboticsActivities: roboticsActivities2 = [] } = req.body;
      console.log(`\u{1F4DA} Importing ${courses2.length} courses and ${roboticsActivities2.length} activities`);
      const importedCourses = [];
      const importedActivities = [];
      for (const courseData of courses2) {
        const { lessons: lessons2, ...course } = courseData;
        const validatedCourse = insertCourseSchema.parse(course);
        const createdCourse = await storage.createCourse(validatedCourse);
        importedCourses.push(createdCourse);
        if (lessons2 && lessons2.length > 0) {
          for (const lessonData of lessons2) {
            const lessonWithCourseId = {
              ...lessonData,
              courseId: createdCourse.id
            };
            const validatedLesson = insertLessonSchema.parse(lessonWithCourseId);
            await storage.createLesson(validatedLesson);
          }
        }
      }
      for (const activityData of roboticsActivities2) {
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
      console.error("Import error:", error);
      res.status(400).json({
        error: "Failed to import course material",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.delete("/api/clear-courses", async (req, res) => {
    try {
      res.json({
        message: "Course clearing must be done through database administration",
        instructions: "Use your database provider's interface to clear course data"
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear course data" });
    }
  });
}

// server/enhanced-storage.ts
import { eq as eq5, and as and3, desc } from "drizzle-orm";
var EnhancedDatabaseStorage = class {
  // Package operations
  async getPackages(packageType) {
    const query = db.select().from(packages);
    if (packageType) {
      return await query.where(eq5(packages.packageType, packageType));
    }
    return await query;
  }
  async getPackageById(id) {
    const [pkg] = await db.select().from(packages).where(eq5(packages.id, id));
    return pkg;
  }
  async createPackage(packageData) {
    const [created] = await db.insert(packages).values(packageData).returning();
    return created;
  }
  // School operations
  async createSchool(school) {
    const [created] = await db.insert(schools).values(school).returning();
    return created;
  }
  async getSchoolById(id) {
    const [school] = await db.select().from(schools).where(eq5(schools.id, id));
    return school;
  }
  async getSchoolUsers(schoolId) {
    return await db.select().from(users).where(eq5(users.schoolId, schoolId));
  }
  async updateSchoolStudentCount(schoolId) {
    const students = await db.select().from(users).where(
      and3(eq5(users.schoolId, schoolId), eq5(users.role, "student"))
    );
    await db.update(schools).set({ currentStudents: students.length }).where(eq5(schools.id, schoolId));
  }
  // Enhanced user operations
  async createUser(user) {
    const [created] = await db.insert(users).values(user).returning();
    if (created.schoolId && created.role === "student") {
      await this.updateSchoolStudentCount(created.schoolId);
    }
    return created;
  }
  async getUserById(id) {
    const [user] = await db.select().from(users).where(eq5(users.id, id));
    return user;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq5(users.email, email));
    return user;
  }
  async updateUserPackage(userId, packageId) {
    const [updated] = await db.update(users).set({
      packageId,
      subscriptionStatus: "active",
      subscriptionStart: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq5(users.id, userId)).returning();
    return updated;
  }
  async searchStudentByEmail(email) {
    const [student] = await db.select().from(users).where(
      and3(eq5(users.email, email), eq5(users.role, "student"))
    );
    return student;
  }
  async getSchoolStudents(schoolId) {
    return await db.select().from(users).where(
      and3(eq5(users.schoolId, schoolId), eq5(users.role, "student"))
    );
  }
  async getSchoolTeachers(schoolId) {
    return await db.select().from(users).where(
      and3(eq5(users.schoolId, schoolId), eq5(users.role, "teacher"))
    );
  }
  // Parent-child relationship operations
  async createParentChildRelation(relation) {
    const [created] = await db.insert(parentChildRelations).values(relation).returning();
    return created;
  }
  async getParentChildren(parentUserId) {
    const relations2 = await db.select().from(parentChildRelations).leftJoin(users, eq5(parentChildRelations.childUserId, users.id)).where(eq5(parentChildRelations.parentUserId, parentUserId));
    return relations2.map((r) => r.users).filter(Boolean);
  }
  async getChildParents(childUserId) {
    const relations2 = await db.select().from(parentChildRelations).leftJoin(users, eq5(parentChildRelations.parentUserId, users.id)).where(eq5(parentChildRelations.childUserId, childUserId));
    return relations2.map((r) => r.users).filter(Boolean);
  }
  // Course operations
  async getCourses(ageGroup, schoolId) {
    let query = db.select().from(courses);
    if (ageGroup) {
      query = query.where(eq5(courses.ageGroup, ageGroup));
    }
    if (schoolId) {
      const schoolCourses = await db.select().from(courses).leftJoin(users, eq5(courses.teacherId, users.id)).where(eq5(users.schoolId, schoolId));
      return schoolCourses.map((row) => row.courses);
    }
    return await query;
  }
  async getCourseById(id) {
    const [course] = await db.select().from(courses).where(eq5(courses.id, id));
    return course;
  }
  async createCourse(course) {
    const [created] = await db.insert(courses).values(course).returning();
    return created;
  }
  async getLessonsByCourse(courseId) {
    return await db.select().from(lessons).where(eq5(lessons.courseId, courseId)).orderBy(lessons.orderIndex);
  }
  async createLesson(lesson) {
    const [created] = await db.insert(lessons).values(lesson).returning();
    return created;
  }
  async getRoboticsActivities(ageGroup) {
    const query = db.select().from(roboticsActivities);
    if (ageGroup) {
      return await query.where(eq5(roboticsActivities.ageGroup, ageGroup));
    }
    return await query;
  }
  async createRoboticsActivity(activity) {
    const [created] = await db.insert(roboticsActivities).values(activity).returning();
    return created;
  }
  // Progress and achievement operations
  async getUserProgress(userId) {
    return await db.select().from(userProgress).where(eq5(userProgress.userId, userId));
  }
  async updateUserProgress(progress) {
    const [updated] = await db.insert(userProgress).values(progress).onConflictDoUpdate({
      target: [userProgress.userId, userProgress.courseId],
      set: {
        lessonsCompleted: progress.lessonsCompleted,
        projectsCompleted: progress.projectsCompleted,
        totalScore: progress.totalScore,
        level: progress.level,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return updated;
  }
  async getUserProjects(userId) {
    return await db.select().from(projects).where(eq5(projects.userId, userId)).orderBy(desc(projects.createdAt));
  }
  async createProject(project) {
    const [created] = await db.insert(projects).values(project).returning();
    return created;
  }
  async getUserAchievements(userId) {
    return await db.select().from(achievements).where(eq5(achievements.userId, userId)).orderBy(desc(achievements.earnedAt));
  }
  async createAchievement(achievement) {
    const [created] = await db.insert(achievements).values(achievement).returning();
    return created;
  }
};
var enhancedStorage = new EnhancedDatabaseStorage();

// server/enhanced-routes.ts
function registerEnhancedRoutes(app2) {
  app2.get("/api/packages", async (req, res) => {
    try {
      const { type } = req.query;
      const packages2 = await enhancedStorage.getPackages(type);
      res.json(packages2);
    } catch (error) {
      console.error("Error fetching packages:", error);
      res.status(500).json({ error: "Failed to fetch packages" });
    }
  });
  app2.post("/api/packages", async (req, res) => {
    try {
      const validatedPackage = insertPackageSchema.parse(req.body);
      const newPackage = await enhancedStorage.createPackage(validatedPackage);
      res.json(newPackage);
    } catch (error) {
      console.error("Error creating package:", error);
      res.status(400).json({ error: "Invalid package data" });
    }
  });
  app2.post("/api/schools", async (req, res) => {
    try {
      const validatedSchool = insertSchoolSchema.parse(req.body);
      const school = await enhancedStorage.createSchool(validatedSchool);
      res.json(school);
    } catch (error) {
      console.error("Error creating school:", error);
      res.status(400).json({ error: "Invalid school data" });
    }
  });
  app2.get("/api/schools/:id", async (req, res) => {
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
  app2.get("/api/schools/:id/users", async (req, res) => {
    try {
      const users2 = await enhancedStorage.getSchoolUsers(req.params.id);
      res.json(users2);
    } catch (error) {
      console.error("Error fetching school users:", error);
      res.status(500).json({ error: "Failed to fetch school users" });
    }
  });
  app2.post("/api/users", async (req, res) => {
    try {
      const validatedUser = insertUserSchema.parse(req.body);
      const user = await enhancedStorage.createUser(validatedUser);
      res.json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(400).json({ error: "Invalid user data" });
    }
  });
  app2.post("/api/users/select-package", async (req, res) => {
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
  app2.get("/api/users/search-student", async (req, res) => {
    try {
      const { email } = req.query;
      if (!email || typeof email !== "string") {
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
  app2.post("/api/schools/create-user", async (req, res) => {
    try {
      const { schoolId, ...userData } = req.body;
      const validatedUser = insertUserSchema.parse({
        ...userData,
        schoolId,
        subscriptionStatus: "active"
        // School users get active status
      });
      const user = await enhancedStorage.createUser(validatedUser);
      res.json(user);
    } catch (error) {
      console.error("Error creating school user:", error);
      res.status(400).json({ error: "Invalid user data" });
    }
  });
  app2.post("/api/parent-child-relations", async (req, res) => {
    try {
      const validatedRelation = insertParentChildRelationSchema.parse(req.body);
      const relation = await enhancedStorage.createParentChildRelation(validatedRelation);
      res.json(relation);
    } catch (error) {
      console.error("Error creating parent-child relation:", error);
      res.status(400).json({ error: "Invalid relation data" });
    }
  });
  app2.get("/api/parent-child-relations/children/:parentId", async (req, res) => {
    try {
      const children = await enhancedStorage.getParentChildren(req.params.parentId);
      res.json(children);
    } catch (error) {
      console.error("Error fetching children:", error);
      res.status(500).json({ error: "Failed to fetch children" });
    }
  });
  app2.get("/api/parent-child-relations/parents/:childId", async (req, res) => {
    try {
      const parents = await enhancedStorage.getChildParents(req.params.childId);
      res.json(parents);
    } catch (error) {
      console.error("Error fetching parents:", error);
      res.status(500).json({ error: "Failed to fetch parents" });
    }
  });
  app2.get("/api/courses", async (req, res) => {
    try {
      const { ageGroup, schoolId } = req.query;
      const courses2 = await enhancedStorage.getCourses(
        ageGroup,
        schoolId
      );
      res.json(courses2);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });
  app2.post("/api/courses", async (req, res) => {
    try {
      const validatedCourse = insertCourseSchema.parse(req.body);
      const course = await enhancedStorage.createCourse(validatedCourse);
      res.json(course);
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(400).json({ error: "Invalid course data" });
    }
  });
  app2.get("/api/courses/:id/lessons", async (req, res) => {
    try {
      const lessons2 = await enhancedStorage.getLessonsByCourse(req.params.id);
      res.json(lessons2);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      res.status(500).json({ error: "Failed to fetch lessons" });
    }
  });
  app2.post("/api/lessons", async (req, res) => {
    try {
      const validatedLesson = insertLessonSchema.parse(req.body);
      const lesson = await enhancedStorage.createLesson(validatedLesson);
      res.json(lesson);
    } catch (error) {
      console.error("Error creating lesson:", error);
      res.status(400).json({ error: "Invalid lesson data" });
    }
  });
  app2.get("/api/robotics-activities", async (req, res) => {
    try {
      const { ageGroup } = req.query;
      const activities = await enhancedStorage.getRoboticsActivities(ageGroup);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching robotics activities:", error);
      res.status(500).json({ error: "Failed to fetch robotics activities" });
    }
  });
  app2.post("/api/robotics-activities", async (req, res) => {
    try {
      const validatedActivity = insertRoboticsActivitySchema.parse(req.body);
      const activity = await enhancedStorage.createRoboticsActivity(validatedActivity);
      res.json(activity);
    } catch (error) {
      console.error("Error creating robotics activity:", error);
      res.status(400).json({ error: "Invalid robotics activity data" });
    }
  });
  app2.get("/api/users/:id/progress", async (req, res) => {
    try {
      const progress = await enhancedStorage.getUserProgress(req.params.id);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ error: "Failed to fetch user progress" });
    }
  });
  app2.get("/api/users/:id/projects", async (req, res) => {
    try {
      const projects2 = await enhancedStorage.getUserProjects(req.params.id);
      res.json(projects2);
    } catch (error) {
      console.error("Error fetching user projects:", error);
      res.status(500).json({ error: "Failed to fetch user projects" });
    }
  });
  app2.get("/api/users/:id/achievements", async (req, res) => {
    try {
      const achievements2 = await enhancedStorage.getUserAchievements(req.params.id);
      res.json(achievements2);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ error: "Failed to fetch user achievements" });
    }
  });
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.use(cookieParser());
  app2.use("/api/auth", authRoutes_default);
  app2.use("/api", packageRoutes_default);
  app2.get("/api/users/:id", async (req, res) => {
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
  app2.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });
  app2.get("/api/courses", async (req, res) => {
    try {
      const { ageGroup } = req.query;
      let courses2;
      if (ageGroup && typeof ageGroup === "string") {
        courses2 = await storage.getCoursesByAgeGroup(ageGroup);
      } else {
        courses2 = await storage.getAllCourses();
      }
      res.json(courses2);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.post("/api/courses", async (req, res) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      res.status(400).json({ error: "Invalid course data" });
    }
  });
  app2.get("/api/courses/:courseId/lessons", async (req, res) => {
    try {
      const lessons2 = await storage.getLessonsByCourse(req.params.courseId);
      res.json(lessons2);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.post("/api/lessons", async (req, res) => {
    try {
      const lessonData = insertLessonSchema.parse(req.body);
      const lesson = await storage.createLesson(lessonData);
      res.status(201).json(lesson);
    } catch (error) {
      res.status(400).json({ error: "Invalid lesson data" });
    }
  });
  app2.get("/api/robotics-activities", async (req, res) => {
    try {
      const { ageGroup } = req.query;
      let activities;
      if (ageGroup && typeof ageGroup === "string") {
        activities = await storage.getRoboticsActivitiesByAgeGroup(ageGroup);
      } else {
        activities = await storage.getAllRoboticsActivities();
      }
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.post("/api/robotics-activities", async (req, res) => {
    try {
      const activityData = insertRoboticsActivitySchema.parse(req.body);
      const activity = await storage.createRoboticsActivity(activityData);
      res.status(201).json(activity);
    } catch (error) {
      res.status(400).json({ error: "Invalid robotics activity data" });
    }
  });
  registerImportRoutes(app2);
  registerEnhancedRoutes(app2);
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
