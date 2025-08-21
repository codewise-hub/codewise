import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from './db';
import { users, packages, userSessions } from '../../shared/schema';
import type { User } from '../../shared/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Create a new user
export async function createUser(userData: {
  email: string;
  password: string;
  name: string;
  role: string;
  ageGroup?: string;
  childName?: string;
  schoolName?: string;
  packageId?: string;
}): Promise<User> {
  const hashedPassword = await bcrypt.hash(userData.password, 12);
  
  const [newUser] = await db
    .insert(users)
    .values({
      email: userData.email,
      name: userData.name,
      passwordHash: hashedPassword,
      role: userData.role as any,
      ageGroup: userData.ageGroup as any,
      packageId: userData.packageId,
      subscriptionStatus: 'pending',
      isActive: true,
    })
    .returning();

  return newUser;
}

// Authenticate user and create session
export async function signInUser(
  email: string, 
  password: string,
  userAgent?: string,
  ipAddress?: string
): Promise<{ user: User; sessionToken: string } | null> {
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
  const sessionToken = await createUserSession(user.id, userAgent, ipAddress);

  return { user, sessionToken };
}

// Create user session
export async function createUserSession(
  userId: string,
  userAgent?: string,
  ipAddress?: string
): Promise<string> {
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

// Get user by session token
export async function getUserBySessionToken(sessionToken: string): Promise<User | null> {
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