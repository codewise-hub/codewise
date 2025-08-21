import { 
  type User, 
  type InsertUser, 
  type Course, 
  type InsertCourse,
  type Lesson,
  type InsertLesson,
  type RoboticsActivity,
  type InsertRoboticsActivity
} from "../shared/schema";
import { db } from "./db";
import { users, courses, lessons, roboticsActivities } from "../shared/schema";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Course management
  createCourse(course: InsertCourse): Promise<Course>;
  getAllCourses(): Promise<Course[]>;
  getCoursesByAgeGroup(ageGroup: string): Promise<Course[]>;
  
  // Lesson management
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  getLessonsByCourse(courseId: string): Promise<Lesson[]>;
  
  // Robotics activities
  createRoboticsActivity(activity: InsertRoboticsActivity): Promise<RoboticsActivity>;
  getAllRoboticsActivities(): Promise<RoboticsActivity[]>;
  getRoboticsActivitiesByAgeGroup(ageGroup: string): Promise<RoboticsActivity[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Course management
  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db
      .insert(courses)
      .values(course)
      .returning();
    return newCourse;
  }

  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses);
  }

  async getCoursesByAgeGroup(ageGroup: string): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.ageGroup, ageGroup));
  }

  // Lesson management
  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [newLesson] = await db
      .insert(lessons)
      .values(lesson)
      .returning();
    return newLesson;
  }

  async getLessonsByCourse(courseId: string): Promise<Lesson[]> {
    return await db.select().from(lessons).where(eq(lessons.courseId, courseId));
  }

  // Robotics activities
  async createRoboticsActivity(activity: InsertRoboticsActivity): Promise<RoboticsActivity> {
    const [newActivity] = await db
      .insert(roboticsActivities)
      .values(activity)
      .returning();
    return newActivity;
  }

  async getAllRoboticsActivities(): Promise<RoboticsActivity[]> {
    return await db.select().from(roboticsActivities);
  }

  async getRoboticsActivitiesByAgeGroup(ageGroup: string): Promise<RoboticsActivity[]> {
    return await db.select().from(roboticsActivities).where(eq(roboticsActivities.ageGroup, ageGroup));
  }
}

export const storage = new DatabaseStorage();
