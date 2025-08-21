import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import { pgTable, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { sql } from 'drizzle-orm';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ws from "ws";

neonConfig.webSocketConstructor = ws;

// Schema definitions (inline)
const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  name: text("name").notNull(),
  role: text("role").notNull(),
  ageGroup: text("age_group"),
  packageId: varchar("package_id"),
  subscriptionStatus: text("subscription_status").default("pending"),
  schoolId: varchar("school_id"),
  parentUserId: varchar("parent_user_id"),
  grade: text("grade"),
  subjects: text("subjects"),
  lastLoginAt: timestamp("last_login_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

const userSessions = pgTable("user_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  sessionToken: text("session_token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Database setup
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema: { users, userSessions } });

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(['student', 'teacher', 'parent', 'school_admin']),
  ageGroup: z.enum(['6-11', '12-17']).optional(),
  childName: z.string().optional(),
  schoolName: z.string().optional(),
  packageId: z.string().optional(),
});

// Create user function
async function createUser(userData: {
  email: string;
  password: string;
  name: string;
  role: string;
  ageGroup?: string;
  childName?: string;
  schoolName?: string;
  packageId?: string;
}) {
  const hashedPassword = await bcrypt.hash(userData.password, 12);
  
  const [newUser] = await db
    .insert(users)
    .values({
      email: userData.email,
      name: userData.name,
      passwordHash: hashedPassword,
      role: userData.role,
      ageGroup: userData.ageGroup,
      packageId: userData.packageId,
      subscriptionStatus: 'pending',
      isActive: true,
    })
    .returning();

  return newUser;
}

// Create session function
async function createUserSession(
  userId: string,
  userAgent?: string,
  ipAddress?: string
) {
  const sessionToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  
  await db
    .insert(userSessions)
    .values({
      userId,
      sessionToken,
      userAgent,
      ipAddress,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

  return sessionToken;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = signUpSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const user = await createUser(data);
    
    // Create session
    const sessionToken = await createUserSession(
      user.id,
      req.headers['user-agent'],
      req.headers['x-forwarded-for'] as string || req.connection?.remoteAddress
    );

    // Set session cookie
    res.setHeader('Set-Cookie', [
      `sessionToken=${sessionToken}; Max-Age=604800; Path=/; HttpOnly; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
    ]);

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        ageGroup: user.ageGroup,
        packageId: user.packageId,
        subscriptionStatus: user.subscriptionStatus,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      sessionToken
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input data', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}