import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import { pgTable, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { sql } from 'drizzle-orm';
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

// Helper function to parse cookies from header
function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  
  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.trim().split('=');
    if (name && rest.length) {
      cookies[name] = rest.join('=');
    }
  });
  
  return cookies;
}

// Get user by session token
async function getUserBySessionToken(sessionToken: string) {
  try {
    const decoded = jwt.verify(sessionToken, JWT_SECRET) as { userId: string };
    
    const [session] = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.sessionToken, sessionToken))
      .limit(1);

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);

    return user || null;
  } catch (error) {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Handle both req.cookies (if available) and manual parsing
    let sessionToken = req.cookies?.sessionToken;
    
    if (!sessionToken) {
      const cookies = parseCookies(req.headers.cookie as string);
      sessionToken = cookies.sessionToken;
    }
    
    if (!sessionToken) {
      return res.status(401).json({ error: 'No session token' });
    }

    const user = await getUserBySessionToken(sessionToken);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

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
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}