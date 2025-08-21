import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // For now, we'll just return mock data since the actual implementation would require
    // authentication middleware and proper database queries
    const client = await pool.connect();
    
    const result = await client.query(`
      SELECT id, email, name, role, "ageGroup", "createdAt"
      FROM users 
      ORDER BY "createdAt" DESC
    `);
    
    client.release();
    
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
}