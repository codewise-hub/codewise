import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from 'drizzle-orm';
import ws from "ws";

neonConfig.webSocketConstructor = ws;

// Schema definitions (inline)
const userSessions = pgTable("user_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  sessionToken: text("session_token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Database setup
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema: { userSessions } });

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