import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from "ws";

neonConfig.webSocketConstructor = ws;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        age_group TEXT,
        package_id VARCHAR,
        subscription_status TEXT DEFAULT 'pending',
        school_id VARCHAR,
        parent_user_id VARCHAR,
        grade TEXT,
        subjects TEXT,
        last_login_at TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create user_sessions table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR NOT NULL,
        session_token TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        user_agent TEXT,
        ip_address TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Check if tables exist and have data
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    const sessionsCount = await pool.query('SELECT COUNT(*) FROM user_sessions');
    
    res.status(200).json({ 
      message: 'Tables created successfully',
      usersCount: usersCount.rows[0].count,
      sessionsCount: sessionsCount.rows[0].count
    });
  } catch (error) {
    console.error('Setup tables error:', error);
    res.status(500).json({ 
      error: 'Failed to setup tables', 
      details: error.message
    });
  }
}