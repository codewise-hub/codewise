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

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Sign in user function
async function signInUser(
  email: string, 
  password: string,
  userAgent?: string,
  ipAddress?: string
) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user || !user.isActive) {
    return null;
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash || '');
  if (!isValidPassword) {
    return null;
  }

  // Update last login
  await db
    .update(users)
    .set({ lastLoginAt: new Date() })
    .where(eq(users.id, user.id));

  // Create session token
  const sessionToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  
  await db
    .insert(userSessions)
    .values({
      userId: user.id,
      sessionToken,
      userAgent,
      ipAddress,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

  return { user, sessionToken };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = signInSchema.parse(req.body);
    
    const result = await signInUser(
      email, 
      password,
      req.headers['user-agent'],
      req.headers['x-forwarded-for'] as string || req.connection?.remoteAddress
    );

    if (!result) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { user, sessionToken } = result;

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
    console.error('Signin error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input data', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}