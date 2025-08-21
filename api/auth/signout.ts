import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Clear the session cookie
    res.setHeader('Set-Cookie', [
      'sessionToken=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    ]);

    res.status(200).json({ message: 'Signed out successfully' });
  } catch (error) {
    console.error('Signout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}