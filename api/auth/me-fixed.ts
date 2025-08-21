import { VercelRequest, VercelResponse } from '@vercel/node';
import { getUserBySessionToken } from '../_lib/auth';

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