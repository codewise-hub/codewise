import { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../server/db';
import { packages } from '../shared/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const allPackages = await db
      .select()
      .from(packages)
      .where(eq(packages.isActive, true));

    res.status(200).json(allPackages);
  } catch (error) {
    console.error('Packages fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}