import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Subscription packages
export const packages = pgTable("packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),
  duration: text("duration").notNull(), // 'monthly', 'yearly'
  features: text("features"), // JSON array of features
  maxStudents: integer("max_students"), // for school packages
  packageType: text("package_type").notNull(), // 'individual', 'school'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schools table
export const schools = pgTable("schools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  adminUserId: varchar("admin_user_id"), // references users.id
  packageId: varchar("package_id").references(() => packages.id),
  subscriptionStatus: text("subscription_status").default("active"), // 'active', 'suspended', 'cancelled'
  subscriptionStart: timestamp("subscription_start"),
  subscriptionEnd: timestamp("subscription_end"),
  maxStudents: integer("max_students").default(100),
  currentStudents: integer("current_students").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Enhanced users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  name: text("name").notNull(),
  role: text("role").notNull(), // 'student', 'teacher', 'parent', 'school_admin'
  ageGroup: text("age_group"), // '6-11', '12-17' for students
  
  // Package and subscription info
  packageId: varchar("package_id").references(() => packages.id),
  subscriptionStatus: text("subscription_status").default("pending"), // 'pending', 'active', 'expired', 'cancelled'
  subscriptionStart: timestamp("subscription_start"),
  subscriptionEnd: timestamp("subscription_end"),
  
  // School association
  schoolId: varchar("school_id").references(() => schools.id),
  
  // Parent-child relationship
  parentUserId: varchar("parent_user_id"), // references users.id for parent linking
  
  // Additional info
  grade: text("grade"), // for students
  subjects: text("subjects"), // JSON array for teachers
  lastLoginAt: timestamp("last_login_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User sessions table for authentication
export const userSessions = pgTable("user_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  sessionToken: text("session_token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Parent-child relationships table (many-to-many)
export const parentChildRelations = pgTable("parent_child_relations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  parentUserId: varchar("parent_user_id").references(() => users.id).notNull(),
  childUserId: varchar("child_user_id").references(() => users.id).notNull(),
  relationshipType: text("relationship_type").default("parent"), // 'parent', 'guardian'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  ageGroup: text("age_group").notNull(),
  difficulty: text("difficulty"), // 'beginner', 'intermediate', 'advanced'
  category: text("category"), // 'programming', 'robotics', 'web-development'
  imageUrl: text("image_url"),
  estimatedHours: integer("estimated_hours").default(10),
  teacherId: varchar("teacher_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").references(() => courses.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"), // JSON string for rich content
  orderIndex: integer("order_index").notNull(),
  type: text("type"), // 'video', 'interactive', 'quiz', 'project'
  estimatedMinutes: integer("estimated_minutes").default(30),
  videoUrl: text("video_url"),
  isRequired: boolean("is_required").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const roboticsActivities = pgTable("robotics_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type"), // 'puzzle', 'maze', 'challenge'
  difficulty: text("difficulty"), // 'easy', 'medium', 'hard'
  ageGroup: text("age_group").notNull(),
  instructions: text("instructions"), // JSON string
  solution: text("solution"), // JSON string
  estimatedMinutes: integer("estimated_minutes").default(15),
  points: integer("points").default(100),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  courseId: varchar("course_id").references(() => courses.id),
  lessonsCompleted: integer("lessons_completed").default(0),
  projectsCompleted: integer("projects_completed").default(0),
  totalScore: integer("total_score").default(0),
  level: integer("level").default(1),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  code: text("code"),
  projectType: text("project_type"), // 'blockly', 'javascript', 'microbit'
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  badgeType: text("badge_type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  earnedAt: timestamp("earned_at").defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ one, many }) => ({
  package: one(packages, {
    fields: [users.packageId],
    references: [packages.id],
  }),
  school: one(schools, {
    fields: [users.schoolId],
    references: [schools.id],
  }),
  parentRelations: many(parentChildRelations, {
    relationName: "parentRelations",
  }),
  childRelations: many(parentChildRelations, {
    relationName: "childRelations",
  }),
  courses: many(courses),
  progress: many(userProgress),
  projects: many(projects),
  achievements: many(achievements),
}));

export const schoolsRelations = relations(schools, ({ one, many }) => ({
  package: one(packages, {
    fields: [schools.packageId],
    references: [packages.id],
  }),
  users: many(users),
}));

export const packagesRelations = relations(packages, ({ many }) => ({
  users: many(users),
  schools: many(schools),
}));

export const parentChildRelationsRelations = relations(parentChildRelations, ({ one }) => ({
  parent: one(users, {
    fields: [parentChildRelations.parentUserId],
    references: [users.id],
    relationName: "parentRelations",
  }),
  child: one(users, {
    fields: [parentChildRelations.childUserId],
    references: [users.id],
    relationName: "childRelations",
  }),
}));

// Insert schemas
export const insertPackageSchema = createInsertSchema(packages).omit({
  id: true,
  createdAt: true,
});

export const insertSchoolSchema = createInsertSchema(schools).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
});

export const insertUserSessionSchema = createInsertSchema(userSessions).omit({
  id: true,
  createdAt: true,
});

export const insertParentChildRelationSchema = createInsertSchema(parentChildRelations).omit({
  id: true,
  createdAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
});

export const insertRoboticsActivitySchema = createInsertSchema(roboticsActivities).omit({
  id: true,
  createdAt: true,
});

export const insertProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  earnedAt: true,
});

// Types
export type Package = typeof packages.$inferSelect;
export type School = typeof schools.$inferSelect;
export type User = typeof users.$inferSelect;
export type UserSession = typeof userSessions.$inferSelect;
export type ParentChildRelation = typeof parentChildRelations.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type RoboticsActivity = typeof roboticsActivities.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;

export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type InsertSchool = z.infer<typeof insertSchoolSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;
export type InsertParentChildRelation = z.infer<typeof insertParentChildRelationSchema>;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type InsertRoboticsActivity = z.infer<typeof insertRoboticsActivitySchema>;
export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
