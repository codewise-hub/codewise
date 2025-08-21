import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'SQL query is required' });
  }

  // Basic security check - only allow SELECT, SHOW, DESCRIBE statements
  const trimmedQuery = query.trim().toUpperCase();
  if (!trimmedQuery.startsWith('SELECT') && 
      !trimmedQuery.startsWith('SHOW') && 
      !trimmedQuery.startsWith('DESCRIBE') &&
      !trimmedQuery.startsWith('EXPLAIN')) {
    return res.status(403).json({ 
      error: 'Only SELECT, SHOW, DESCRIBE, and EXPLAIN statements are allowed for security reasons' 
    });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(query);
    client.release();
    
    return res.status(200).json({
      rows: result.rows,
      rowCount: result.rowCount,
      fields: result.fields?.map(field => ({
        name: field.name,
        dataTypeID: field.dataTypeID
      }))
    });
  } catch (error) {
    console.error('Error executing SQL query:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to execute query' 
    });
  }
}