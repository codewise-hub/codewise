import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Return hardcoded packages with correct ZAR pricing
    const packages = [
      {
        id: 'basic-explorer',
        name: 'Basic Explorer',
        description: 'Perfect for young coders starting their journey with visual programming and basic concepts',
        price: '349.00',
        currency: 'ZAR',
        duration: 'monthly',
        features: '["Visual Block Programming", "Basic Coding Concepts", "5 Interactive Projects", "Progress Tracking", "Email Support"]',
        maxStudents: null,
        packageType: 'individual',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'pro-coder',
        name: 'Pro Coder',
        description: 'Advanced learning path with text-based programming and real-world projects',
        price: '699.00',
        currency: 'ZAR',
        duration: 'monthly',
        features: '["Text-Based Programming", "Advanced Projects", "AI/Prompt Engineering", "Unlimited Projects", "Priority Support", "Certificate Program"]',
        maxStudents: null,
        packageType: 'individual',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'family-plan',
        name: 'Family Plan',
        description: 'Multiple children learning together with parental oversight and reporting',
        price: '999.00',
        currency: 'ZAR',
        duration: 'monthly',
        features: '["Up to 4 Children", "All Features Included", "Parent Dashboard", "Progress Reports", "Family Projects", "Priority Support"]',
        maxStudents: null,
        packageType: 'individual',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'school-basic',
        name: 'School Basic',
        description: 'Essential package for small schools and classrooms',
        price: '6999.00',
        currency: 'ZAR',
        duration: 'monthly',
        features: '["Up to 30 Students", "Teacher Dashboard", "Classroom Management", "Assignment Tools", "Progress Analytics", "Email Support"]',
        maxStudents: 30,
        packageType: 'school',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'school-premium',
        name: 'School Premium',
        description: 'Complete solution for larger schools with advanced features',
        price: '17499.00',
        currency: 'ZAR',
        duration: 'monthly',
        features: '["Up to 100 Students", "Advanced Analytics", "Custom Curriculum", "Teacher Training", "Priority Support", "Custom Branding"]',
        maxStudents: 100,
        packageType: 'school',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];

    res.status(200).json(packages);
  } catch (error) {
    console.error('Packages API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}