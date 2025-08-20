import { Router } from 'express';
import { db } from './db';
import { packages } from '../shared/schema';
import { eq, and } from 'drizzle-orm';

const router = Router();

// Get all available packages
router.get('/packages', async (req, res) => {
  try {
    const packageType = req.query.type as string;
    
    let availablePackages;
    
    if (packageType) {
      availablePackages = await db
        .select()
        .from(packages)
        .where(and(
          eq(packages.isActive, true),
          eq(packages.packageType, packageType)
        ));
    } else {
      availablePackages = await db
        .select()
        .from(packages)
        .where(eq(packages.isActive, true));
    }
    
    res.json(availablePackages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

// Get package by ID
router.get('/packages/:id', async (req, res) => {
  try {
    const [packageData] = await db
      .select()
      .from(packages)
      .where(eq(packages.id, req.params.id))
      .limit(1);

    if (!packageData) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.json(packageData);
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({ error: 'Failed to fetch package' });
  }
});

export default router;