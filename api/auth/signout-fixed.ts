import { VercelRequest, VercelResponse } from '@vercel/node';
import { eq } from 'drizzle-orm';
import { db } from '../_lib/db';
import { userSessions } from '../../shared/schema';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Handle both req.cookies (if available) and manual parsing
    let sessionToken = req.cookies?.sessionToken;
    
    if (!sessionToken) {
      const cookies = parseCookies(req.headers.cookie as string);
      sessionToken = cookies.sessionToken;
    }
    
    if (sessionToken) {
      // Delete session from database
      await db
        .delete(userSessions)
        .where(eq(userSessions.sessionToken, sessionToken));
    }

    // Clear session cookie
    res.setHeader('Set-Cookie', [
      'sessionToken=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
    ]);

    res.status(200).json({ message: 'Successfully signed out' });
  } catch (error) {
    console.error('Signout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}