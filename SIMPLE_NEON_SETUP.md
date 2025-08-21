# Quick Neon Database Setup for Enhanced Multi-Role System

## Step 1: Access Neon SQL Editor
1. Go to https://console.neon.tech/
2. Log in to your account
3. Select your CodewiseHub project
4. Click "SQL Editor" in the left sidebar

## Step 2: Create Enhanced Tables
Copy and paste this SQL into the Neon SQL Editor:

```sql
-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  duration TEXT NOT NULL,
  features TEXT,
  max_students INTEGER,
  package_type TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create schools table  
CREATE TABLE IF NOT EXISTS schools (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  admin_user_id VARCHAR,
  package_id VARCHAR REFERENCES packages(id),
  subscription_status TEXT DEFAULT 'active',
  subscription_start TIMESTAMP,
  subscription_end TIMESTAMP,
  max_students INTEGER DEFAULT 100,
  current_students INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create parent_child_relations table
CREATE TABLE IF NOT EXISTS parent_child_relations (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_user_id VARCHAR REFERENCES users(id) NOT NULL,
  child_user_id VARCHAR REFERENCES users(id) NOT NULL,
  relationship_type TEXT DEFAULT 'parent',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add new columns to existing users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS package_id VARCHAR REFERENCES packages(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'pending';
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_start TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_end TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS school_id VARCHAR REFERENCES schools(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS parent_user_id VARCHAR;
ALTER TABLE users ADD COLUMN IF NOT EXISTS grade TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subjects TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Insert sample packages
INSERT INTO packages (name, description, price, duration, features, package_type) VALUES
('Free Explorer', 'Perfect for getting started', 0.00, 'monthly', '["5 Coding Lessons", "Basic Projects", "Community Support", "Progress Tracking"]', 'individual'),
('Basic Coder', 'For serious young coders', 49.00, 'monthly', '["Unlimited Lessons", "Advanced Projects", "AI Tutor Access", "Certificates", "Parent Reports"]', 'individual'),
('Premium Pro', 'Complete learning experience', 99.00, 'monthly', '["Everything in Basic", "1-on-1 Mentoring", "Advanced Robotics", "Portfolio Building", "Priority Support"]', 'individual'),
('School Basic', 'For small schools', 199.00, 'monthly', '["Up to 50 students", "Teacher Dashboard", "Progress Analytics", "Curriculum Planning"]', 'school'),
('School Premium', 'For large institutions', 499.00, 'monthly', '["Up to 500 students", "Advanced Analytics", "Custom Courses", "Priority Support", "API Access"]', 'school')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_school_id ON users(school_id);
CREATE INDEX IF NOT EXISTS idx_users_package_id ON users(package_id);
CREATE INDEX IF NOT EXISTS idx_parent_child_parent ON parent_child_relations(parent_user_id);
CREATE INDEX IF NOT EXISTS idx_parent_child_child ON parent_child_relations(child_user_id);

-- Verify setup
SELECT 'Setup Complete' as status;
```

## Step 3: Click "Run" Button
After pasting the SQL, click the "Run" button in the Neon SQL Editor.

## Step 4: Verify Tables Created
Run this query to verify everything worked:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('packages', 'schools', 'parent_child_relations', 'users')
ORDER BY table_name;
```

You should see all 4 tables listed.

## Step 5: Test the Application
After running the SQL, your enhanced multi-role system will be ready:

1. Package selection during registration
2. Parent-child account linking
3. School administration dashboard
4. Multi-role user system

## Troubleshooting
If you get any errors:
1. Make sure you're connected to the correct database
2. Check that existing tables (users, courses, etc.) are present
3. Try running the commands one section at a time
4. Contact support if persistent issues occur

## What This Enables
- **Students**: Can choose subscription packages during registration
- **Parents**: Can link to existing student accounts for monitoring
- **Teachers**: Can work independently or as part of a school
- **School Admins**: Can manage entire school coding programs with bulk user creation