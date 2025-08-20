import { Router } from 'express';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from './db';
import { users } from '../shared/schema';
import { 
  createUser, 
  signInUser, 
  signOutUser, 
  requireAuth,
  type AuthenticatedRequest 
} from './auth';

const router = Router();

// Sign up schema
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

// Sign in schema
const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Sign up route
router.post('/signup', async (req, res) => {
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
    
    // Sign in user immediately after signup
    const signInResult = await signInUser(
      data.email, 
      data.password,
      req.get('User-Agent'),
      req.ip
    );

    if (!signInResult) {
      return res.status(500).json({ error: 'Failed to sign in after signup' });
    }

    // Set session cookie
    res.cookie('sessionToken', signInResult.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user without password hash
    const { passwordHash, ...userWithoutPassword } = signInResult.user;
    res.json({ user: userWithoutPassword, sessionToken: signInResult.sessionToken });
  } catch (error) {
    console.error('Signup error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign in route
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = signInSchema.parse(req.body);
    
    const result = await signInUser(
      email, 
      password,
      req.get('User-Agent'),
      req.ip
    );

    if (!result) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Set session cookie
    res.cookie('sessionToken', result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user without password hash
    const { passwordHash, ...userWithoutPassword } = result.user;
    res.json({ user: userWithoutPassword, sessionToken: result.sessionToken });
  } catch (error) {
    console.error('Signin error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign out route
router.post('/signout', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const sessionToken = req.cookies?.sessionToken || req.headers.authorization?.replace('Bearer ', '');
    
    if (sessionToken) {
      await signOutUser(sessionToken);
    }

    res.clearCookie('sessionToken');
    res.json({ message: 'Signed out successfully' });
  } catch (error) {
    console.error('Signout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user route
router.get('/me', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Return user without password hash
    const { passwordHash, ...userWithoutPassword } = req.user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;