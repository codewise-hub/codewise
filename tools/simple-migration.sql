-- Simple migration to add enhanced features to existing database
-- This works with the current schema and adds new tables

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
  package_id VARCHAR,
  subscription_status TEXT DEFAULT 'active',
  subscription_start TIMESTAMP,
  subscription_end TIMESTAMP,
  max_students INTEGER DEFAULT 100,
  current_students INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add new columns to existing users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS package_id VARCHAR;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'pending';
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_start TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_end TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS school_id VARCHAR;
ALTER TABLE users ADD COLUMN IF NOT EXISTS parent_user_id VARCHAR;
ALTER TABLE users ADD COLUMN IF NOT EXISTS grade TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subjects TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create parent_child_relations table
CREATE TABLE IF NOT EXISTS parent_child_relations (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_user_id VARCHAR NOT NULL,
  child_user_id VARCHAR NOT NULL,
  relationship_type TEXT DEFAULT 'parent',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraints
ALTER TABLE schools ADD CONSTRAINT IF NOT EXISTS fk_schools_package 
  FOREIGN KEY (package_id) REFERENCES packages(id);

ALTER TABLE users ADD CONSTRAINT IF NOT EXISTS fk_users_package 
  FOREIGN KEY (package_id) REFERENCES packages(id);

ALTER TABLE users ADD CONSTRAINT IF NOT EXISTS fk_users_school 
  FOREIGN KEY (school_id) REFERENCES schools(id);

ALTER TABLE parent_child_relations ADD CONSTRAINT IF NOT EXISTS fk_parent_child_parent 
  FOREIGN KEY (parent_user_id) REFERENCES users(id);

ALTER TABLE parent_child_relations ADD CONSTRAINT IF NOT EXISTS fk_parent_child_child 
  FOREIGN KEY (child_user_id) REFERENCES users(id);

-- Insert default packages
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

-- Verify tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('packages', 'schools', 'parent_child_relations')
ORDER BY table_name;