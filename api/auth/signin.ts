import { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { signInUser } from '../../server/auth';

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

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
        lastLoginAt: user.lastLoginAt,
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