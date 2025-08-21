import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cookieParser from 'cookie-parser';
import { registerRoutes } from '../server/routes';

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS for Vercel
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Register all API routes
registerRoutes(app);

// Export for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}