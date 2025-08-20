// api/server.ts - Vercel serverless function entry point
import { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { registerRoutes } from "../server/routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize routes
let routesInitialized = false;
let routePromise: Promise<void> | null = null;

async function initializeRoutes() {
  if (routesInitialized) return;
  if (routePromise) return routePromise;
  
  routePromise = (async () => {
    await registerRoutes(app);
    routesInitialized = true;
  })();
  
  return routePromise;
}

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    await initializeRoutes();
    app(req as any, res as any);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};