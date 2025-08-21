-- CodewiseHub Enhanced Database Schema
-- Multi-role system with packages, schools, and parent-child relationships

-- Drop existing tables if they exist (be careful in production)
-- DROP TABLE IF EXISTS parent_child_relations CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS schools CASCADE;
-- DROP TABLE IF EXISTS packages CASCADE;

-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  duration TEXT NOT NULL, -- 'monthly', 'yearly'
  features TEXT, -- JSON array of features
  max_students INTEGER, -- for school packages
  package_type TEXT NOT NULL, -- 'individual', 'school'
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
  admin_user_id VARCHAR, -- references users.id
  package_id VARCHAR REFERENCES packages(id),
  subscription_status TEXT DEFAULT 'active', -- 'active', 'suspended', 'cancelled'
  subscription_start TIMESTAMP,
  subscription_end TIMESTAMP,
  max_students INTEGER DEFAULT 100,
  current_students INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create enhanced users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL, -- 'student', 'teacher', 'parent', 'school_admin'
  age_group TEXT, -- '6-11', '12-17' for students
  
  -- Package and subscription info
  package_id VARCHAR REFERENCES packages(id),
  subscription_status TEXT DEFAULT 'pending', -- 'pending', 'active', 'expired', 'cancelled'
  subscription_start TIMESTAMP,
  subscription_end TIMESTAMP,
  
  -- School association
  school_id VARCHAR REFERENCES schools(id),
  
  -- Parent-child relationship
  parent_user_id VARCHAR, -- references users.id for parent linking
  
  -- Additional info
  grade TEXT, -- for students
  subjects TEXT, -- JSON array for teachers
  firebase_uid TEXT UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create parent-child relationships table (many-to-many)
CREATE TABLE IF NOT EXISTS parent_child_relations (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_user_id VARCHAR REFERENCES users(id) NOT NULL,
  child_user_id VARCHAR REFERENCES users(id) NOT NULL,
  relationship_type TEXT DEFAULT 'parent', -- 'parent', 'guardian'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint for school admin
ALTER TABLE schools 
ADD CONSTRAINT fk_school_admin 
FOREIGN KEY (admin_user_id) REFERENCES users(id);

-- Create courses table (updated)
CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  age_group TEXT NOT NULL,
  difficulty TEXT, -- 'beginner', 'intermediate', 'advanced'
  category TEXT, -- 'programming', 'robotics', 'web-development'
  image_url TEXT,
  estimated_hours INTEGER DEFAULT 10,
  teacher_id VARCHAR REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id VARCHAR REFERENCES courses(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT, -- JSON string for rich content
  order_index INTEGER NOT NULL,
  type TEXT, -- 'video', 'interactive', 'quiz', 'project'
  estimated_minutes INTEGER DEFAULT 30,
  video_url TEXT,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create robotics_activities table
CREATE TABLE IF NOT EXISTS robotics_activities (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT, -- 'puzzle', 'maze', 'challenge'
  difficulty TEXT, -- 'easy', 'medium', 'hard'
  age_group TEXT NOT NULL,
  instructions TEXT, -- JSON string
  solution TEXT, -- JSON string
  estimated_minutes INTEGER DEFAULT 15,
  points INTEGER DEFAULT 100,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id),
  course_id VARCHAR REFERENCES courses(id),
  lessons_completed INTEGER DEFAULT 0,
  projects_completed INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  code TEXT,
  project_type TEXT, -- 'blockly', 'javascript', 'microbit'
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id),
  badge_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default packages
INSERT INTO packages (name, description, price, duration, features, package_type) VALUES
('Free Explorer', 'Perfect for getting started', 0.00, 'monthly', '["5 Coding Lessons", "Basic Projects", "Community Support", "Progress Tracking"]', 'individual'),
('Basic Coder', 'For serious young coders', 49.00, 'monthly', '["Unlimited Lessons", "Advanced Projects", "AI Tutor Access", "Certificates", "Parent Reports"]', 'individual'),
('Premium Pro', 'Complete learning experience', 99.00, 'monthly', '["Everything in Basic", "1-on-1 Mentoring", "Advanced Robotics", "Portfolio Building", "Priority Support"]', 'individual'),
('School Basic', 'For small schools', 199.00, 'monthly', '["Up to 50 students", "Teacher Dashboard", "Progress Analytics", "Curriculum Planning"]', 'school'),
('School Premium', 'For large institutions', 499.00, 'monthly', '["Up to 500 students", "Advanced Analytics", "Custom Courses", "Priority Support", "API Access"]', 'school');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_school_id ON users(school_id);
CREATE INDEX IF NOT EXISTS idx_users_package_id ON users(package_id);
CREATE INDEX IF NOT EXISTS idx_parent_child_parent ON parent_child_relations(parent_user_id);
CREATE INDEX IF NOT EXISTS idx_parent_child_child ON parent_child_relations(child_user_id);
CREATE INDEX IF NOT EXISTS idx_courses_age_group ON courses(age_group);
CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons(course_id);

-- Verify tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;