import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from "ws";

neonConfig.webSocketConstructor = ws;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({ error: 'DATABASE_URL not configured' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'JWT_SECRET not configured' });
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const result = await pool.query('SELECT NOW() as current_time');
    
    res.status(200).json({ 
      message: 'Database connection successful',
      currentTime: result.rows[0].current_time,
      hasJWT: !!process.env.JWT_SECRET,
      hasDB: !!process.env.DATABASE_URL
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      error: 'Database connection failed', 
      details: error.message,
      hasJWT: !!process.env.JWT_SECRET,
      hasDB: !!process.env.DATABASE_URL
    });
  }
}