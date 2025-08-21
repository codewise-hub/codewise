import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ 
    message: 'API is working!', 
    method: req.method,
    timestamp: new Date().toISOString()
  });
}