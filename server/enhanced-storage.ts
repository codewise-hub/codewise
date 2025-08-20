import { 
  users, 
  schools, 
  packages, 
  parentChildRelations,
  courses,
  lessons,
  roboticsActivities,
  userProgress,
  projects,
  achievements,
  type User, 
  type School, 
  type Package, 
  type ParentChildRelation,
  type Course,
  type Lesson,
  type RoboticsActivity,
  type UserProgress,
  type Project,
  type Achievement,
  type InsertUser, 
  type InsertSchool, 
  type InsertPackage, 
  type InsertParentChildRelation,
  type InsertCourse,
  type InsertLesson,
  type InsertRoboticsActivity,
  type InsertProgress,
  type InsertProject,
  type InsertAchievement,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Enhanced storage interface for multi-role system
export interface IEnhancedStorage {
  // Package operations
  getPackages(packageType?: string): Promise<Package[]>;
  getPackageById(id: string): Promise<Package | undefined>;
  createPackage(packageData: InsertPackage): Promise<Package>;

  // School operations
  createSchool(school: InsertSchool): Promise<School>;
  getSchoolById(id: string): Promise<School | undefined>;
  getSchoolUsers(schoolId: string): Promise<User[]>;
  updateSchoolStudentCount(schoolId: string): Promise<void>;

  // Enhanced user operations
  createUser(user: InsertUser): Promise<User>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUserPackage(userId: string, packageId: string): Promise<User>;
  searchStudentByEmail(email: string): Promise<User | undefined>;
  getSchoolStudents(schoolId: string): Promise<User[]>;
  getSchoolTeachers(schoolId: string): Promise<User[]>;

  // Parent-child relationship operations
  createParentChildRelation(relation: InsertParentChildRelation): Promise<ParentChildRelation>;
  getParentChildren(parentUserId: string): Promise<User[]>;
  getChildParents(childUserId: string): Promise<User[]>;

  // Existing course operations (enhanced)
  getCourses(ageGroup?: string, schoolId?: string): Promise<Course[]>;
  getCourseById(id: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  
  getLessonsByCourse(courseId: string): Promise<Lesson[]>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  
  getRoboticsActivities(ageGroup?: string): Promise<RoboticsActivity[]>;
  createRoboticsActivity(activity: InsertRoboticsActivity): Promise<RoboticsActivity>;

  // Progress and achievement operations
  getUserProgress(userId: string): Promise<UserProgress[]>;
  updateUserProgress(progress: InsertProgress): Promise<UserProgress>;
  
  getUserProjects(userId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  
  getUserAchievements(userId: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
}

export class EnhancedDatabaseStorage implements IEnhancedStorage {
  // Package operations
  async getPackages(packageType?: string): Promise<Package[]> {
    const query = db.select().from(packages);
    if (packageType) {
      return await query.where(eq(packages.packageType, packageType));
    }
    return await query;
  }

  async getPackageById(id: string): Promise<Package | undefined> {
    const [pkg] = await db.select().from(packages).where(eq(packages.id, id));
    return pkg;
  }

  async createPackage(packageData: InsertPackage): Promise<Package> {
    const [created] = await db.insert(packages).values(packageData).returning();
    return created;
  }

  // School operations
  async createSchool(school: InsertSchool): Promise<School> {
    const [created] = await db.insert(schools).values(school).returning();
    return created;
  }

  async getSchoolById(id: string): Promise<School | undefined> {
    const [school] = await db.select().from(schools).where(eq(schools.id, id));
    return school;
  }

  async getSchoolUsers(schoolId: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.schoolId, schoolId));
  }

  async updateSchoolStudentCount(schoolId: string): Promise<void> {
    const students = await db.select().from(users).where(
      and(eq(users.schoolId, schoolId), eq(users.role, 'student'))
    );
    
    await db.update(schools)
      .set({ currentStudents: students.length })
      .where(eq(schools.id, schoolId));
  }

  // Enhanced user operations
  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    
    // Update school student count if this is a school student
    if (created.schoolId && created.role === 'student') {
      await this.updateSchoolStudentCount(created.schoolId);
    }
    
    return created;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async updateUserPackage(userId: string, packageId: string): Promise<User> {
    const [updated] = await db.update(users)
      .set({ 
        packageId, 
        subscriptionStatus: 'active',
        subscriptionStart: new Date(),
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }

  async searchStudentByEmail(email: string): Promise<User | undefined> {
    const [student] = await db.select().from(users).where(
      and(eq(users.email, email), eq(users.role, 'student'))
    );
    return student;
  }

  async getSchoolStudents(schoolId: string): Promise<User[]> {
    return await db.select().from(users).where(
      and(eq(users.schoolId, schoolId), eq(users.role, 'student'))
    );
  }

  async getSchoolTeachers(schoolId: string): Promise<User[]> {
    return await db.select().from(users).where(
      and(eq(users.schoolId, schoolId), eq(users.role, 'teacher'))
    );
  }

  // Parent-child relationship operations
  async createParentChildRelation(relation: InsertParentChildRelation): Promise<ParentChildRelation> {
    const [created] = await db.insert(parentChildRelations).values(relation).returning();
    return created;
  }

  async getParentChildren(parentUserId: string): Promise<User[]> {
    const relations = await db.select()
      .from(parentChildRelations)
      .leftJoin(users, eq(parentChildRelations.childUserId, users.id))
      .where(eq(parentChildRelations.parentUserId, parentUserId));
    
    return relations.map(r => r.users!).filter(Boolean);
  }

  async getChildParents(childUserId: string): Promise<User[]> {
    const relations = await db.select()
      .from(parentChildRelations)
      .leftJoin(users, eq(parentChildRelations.parentUserId, users.id))
      .where(eq(parentChildRelations.childUserId, childUserId));
    
    return relations.map(r => r.users!).filter(Boolean);
  }

  // Course operations
  async getCourses(ageGroup?: string, schoolId?: string): Promise<Course[]> {
    let query = db.select().from(courses);
    
    if (ageGroup) {
      query = query.where(eq(courses.ageGroup, ageGroup));
    }
    
    // For school-specific courses, filter by teacher's school
    if (schoolId) {
      const schoolCourses = await db.select()
        .from(courses)
        .leftJoin(users, eq(courses.teacherId, users.id))
        .where(eq(users.schoolId, schoolId));
      return schoolCourses.map(row => row.courses);
    }
    
    return await query;
  }

  async getCourseById(id: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [created] = await db.insert(courses).values(course).returning();
    return created;
  }

  async getLessonsByCourse(courseId: string): Promise<Lesson[]> {
    return await db.select().from(lessons)
      .where(eq(lessons.courseId, courseId))
      .orderBy(lessons.orderIndex);
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [created] = await db.insert(lessons).values(lesson).returning();
    return created;
  }

  async getRoboticsActivities(ageGroup?: string): Promise<RoboticsActivity[]> {
    const query = db.select().from(roboticsActivities);
    if (ageGroup) {
      return await query.where(eq(roboticsActivities.ageGroup, ageGroup));
    }
    return await query;
  }

  async createRoboticsActivity(activity: InsertRoboticsActivity): Promise<RoboticsActivity> {
    const [created] = await db.insert(roboticsActivities).values(activity).returning();
    return created;
  }

  // Progress and achievement operations
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async updateUserProgress(progress: InsertProgress): Promise<UserProgress> {
    const [updated] = await db.insert(userProgress)
      .values(progress)
      .onConflictDoUpdate({
        target: [userProgress.userId, userProgress.courseId],
        set: {
          lessonsCompleted: progress.lessonsCompleted,
          projectsCompleted: progress.projectsCompleted,
          totalScore: progress.totalScore,
          level: progress.level,
          updatedAt: new Date()
        }
      })
      .returning();
    return updated;
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    return await db.select().from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.createdAt));
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [created] = await db.insert(projects).values(project).returning();
    return created;
  }

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    return await db.select().from(achievements)
      .where(eq(achievements.userId, userId))
      .orderBy(desc(achievements.earnedAt));
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const [created] = await db.insert(achievements).values(achievement).returning();
    return created;
  }
}

export const enhancedStorage = new EnhancedDatabaseStorage();