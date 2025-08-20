import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { eq, and, gt, sql } from 'drizzle-orm';
import { db } from './db';
import { users, userSessions, type User, type InsertUser, type InsertUserSession } from '../shared/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface AuthenticatedRequest extends Request {
  user?: User;
  session?: any;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate session token
export function generateSessionToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

// Create user session
export async function createUserSession(
  userId: string, 
  userAgent?: string, 
  ipAddress?: string
): Promise<string> {
  const sessionToken = generateSessionToken(userId);
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  await db.insert(userSessions).values({
    userId,
    sessionToken,
    expiresAt,
    userAgent,
    ipAddress,
  });

  return sessionToken;
}

// Get user by session token
export async function getUserBySessionToken(sessionToken: string): Promise<User | null> {
  try {
    const decoded = jwt.verify(sessionToken, JWT_SECRET) as { userId: string };
    
    // Check if session exists and is valid
    const session = await db
      .select()
      .from(userSessions)
      .where(
        and(
          eq(userSessions.sessionToken, sessionToken),
          sql`${userSessions.expiresAt} > NOW()`
        )
      )
      .limit(1);

    if (session.length === 0) {
      return null;
    }

    // Get user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);

    return user[0] || null;
  } catch (error) {
    return null;
  }
}

// Revoke session
export async function revokeSession(sessionToken: string): Promise<void> {
  await db.delete(userSessions).where(eq(userSessions.sessionToken, sessionToken));
}

// Clean expired sessions
export async function cleanExpiredSessions(): Promise<void> {
  await db.delete(userSessions).where(sql`${userSessions.expiresAt} < NOW()`);
}

// Authentication middleware
export async function requireAuth(
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> {
  try {
    const sessionToken = req.cookies?.sessionToken || req.headers.authorization?.replace('Bearer ', '');
    
    if (!sessionToken) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const user = await getUserBySessionToken(sessionToken);
    
    if (!user) {
      res.status(401).json({ error: 'Invalid or expired session' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
}

// Create new user
export async function createUser(userData: InsertUser & { password: string }): Promise<User> {
  const { password, ...userDetails } = userData;
  const passwordHash = await hashPassword(password);

  const newUser = await db
    .insert(users)
    .values({
      ...userDetails,
      passwordHash,
    })
    .returning();

  return newUser[0];
}

// Sign in user
export async function signInUser(
  email: string, 
  password: string,
  userAgent?: string,
  ipAddress?: string
): Promise<{ user: User; sessionToken: string } | null> {
  // Find user by email
  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (userResult.length === 0) {
    return null;
  }

  const user = userResult[0];

  // Verify password
  if (!user.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
    return null;
  }

  // Update last login
  await db
    .update(users)
    .set({ lastLoginAt: new Date() })
    .where(eq(users.id, user.id));

  // Create session
  const sessionToken = await createUserSession(user.id, userAgent, ipAddress);

  return { user, sessionToken };
}

// Sign out user
export async function signOutUser(sessionToken: string): Promise<void> {
  await revokeSession(sessionToken);
}