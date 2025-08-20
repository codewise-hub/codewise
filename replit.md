# CodewiseHub Learning Platform

## Overview

CodewiseHub is a comprehensive coding education platform designed for multiple user types including students (ages 6-17), teachers, and parents. The platform features age-appropriate learning paths with visual block-based programming for younger students (6-11) and text-based coding for teens (12-17). It includes interactive coding labs, progress tracking, project management, and specialized tools like a Micro:bit simulator for hands-on learning experiences.

## Recent Updates (August 2025)

✅ **Course Material System Complete** - Created comprehensive course database with 4 courses, 15 lessons, and 4 robotics activities
✅ **Database Integration** - Set up PostgreSQL with Drizzle ORM for persistent course storage
✅ **Import Tool** - Built automated course material import system with JSON-based content management
✅ **Admin Panel** - Added course management interface with filtering by age groups
✅ **API Endpoints** - Implemented REST API for courses, lessons, and robotics activities
✅ **Vercel Deployment** - Successfully deployed application to production
✅ **Production Import System** - Created multiple import methods including Node.js script and API endpoints
✅ **Windows Compatibility** - Fixed tsx dependency issues with vanilla Node.js import script
✅ **Neon Database Integration** - Created comprehensive setup guide and testing tools for Neon-Vercel integration

**Latest Changes (August 2025):**
✅ **Admin Separation Complete** - Removed admin functionality from main student application
✅ **Dedicated CMS Application** - Created standalone admin-cms.html for content management
✅ **Student Learning Materials** - Added comprehensive StudentLearningMaterials component with courses, lessons, and study materials
✅ **Enhanced Student Dashboard** - Integrated learning materials directly into student experience
✅ **Multi-Role Authentication** - Complete signup flow for all user types including school administrators
✅ **Course Explanation Modals** - Added detailed course information with YouTube video tutorials
✅ **Prompt Engineering Education** - Added AI/prompt engineering course and video tutorial for teen coders
✅ **Age-Appropriate Content** - Fixed duplicate videos and ensured content matches age groups (6-11 vs 12-17)
✅ **Video Content Optimization** - Shortened prompt engineering video to under 2 minutes for better engagement
✅ **Authentication Migration Complete** - Migrated from Firebase to Neon PostgreSQL database with bcrypt password hashing and JWT sessions
✅ **Subscription Package System** - Implemented comprehensive 5-tier subscription system with package selection during student/school admin signup
✅ **Package Selection UI** - Created PackageSelector component with pricing display and feature lists for subscription tiers
✅ **Build Error Resolution** - Fixed import path issues for Vercel deployment compatibility
✅ **Rollup Build Fix** - Resolved Rollup variable tracing error in vite.config.vercel.ts for successful Vercel deployments
✅ **Frontend Debugging** - Added console logging and debugging info to PackageSelector and AuthModal components
✅ **Deployment Ready** - Build process now completes successfully with all assets generated correctly
✅ **Simple Package Selector** - Created dropdown-based package selection with hardcoded ZAR pricing for reliable Vercel deployment
✅ **Vercel Package Fix** - Resolved package display issues with SimplePackageSelector component showing R349-R17499 pricing

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type safety and modern development patterns
- **Vite** as the build tool for fast development and optimized production builds
- **Tailwind CSS** with shadcn/ui components for consistent, responsive design
- **Component Architecture**: Modular React components with clear separation of concerns
  - Page components for different dashboards (Student, Teacher, Parent)
  - Shared UI components using Radix UI primitives
  - Custom components for specialized features (CodingLab, MicrobitSimulator)

### State Management
- **React Context** for authentication state management
- **TanStack Query** for server state management and caching
- Local state management using React hooks for component-specific state

### Authentication & User Management
- **Neon PostgreSQL Database** with bcrypt password hashing for secure authentication
- **JWT Session Management** with httpOnly cookies for security
- **Express.js API Routes** for signup, signin, signout, and user management
- Multi-role support with different user types (student, teacher, parent, school_admin)
- Age-group specific features and content delivery

### Backend Architecture
- **Express.js** server with TypeScript for API endpoints
- **Modular route registration** system for scalable API organization
- **Memory storage** implementation with interface for future database integration
- **Middleware** for request logging, error handling, and JSON parsing

### Database Design
- **Drizzle ORM** with PostgreSQL schema definitions
- **Neon Database** as the PostgreSQL provider
- **Schema structure** includes:
  - Users table with role-based fields
  - Courses and user progress tracking
  - Projects and achievements system
  - Flexible design for multi-tenant usage

### Development & Build System
- **ESM modules** throughout the application for modern JavaScript
- **TypeScript** configuration with path aliases for clean imports
- **Vite development server** with HMR and error overlay
- **Production build** process combining frontend Vite build and backend esbuild compilation

### Specialized Features
- **Blockly integration** for visual programming (younger students)
- **Monaco Editor** for text-based coding (older students)
- **Micro:bit simulator** with LED matrix and button interactions
- **Chart.js** for progress visualization and analytics

## External Dependencies

### Core Framework Dependencies
- **React ecosystem**: React 18, React DOM, TypeScript support
- **Vite**: Build tool with plugins for React and development enhancements
- **Express.js**: Backend server framework with TypeScript support

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Radix UI**: Comprehensive component library for accessible UI primitives
- **Lucide React**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built component system built on Radix UI

### Database & ORM
- **Drizzle ORM**: TypeScript ORM for database schema and queries
- **Neon Database**: Serverless PostgreSQL database provider
- **Drizzle-kit**: CLI tools for database migrations and schema management

### Authentication & Backend Services
- **Firebase**: Authentication, Firestore database, and file storage
- **TanStack Query**: Server state management and data fetching
- **React Hook Form**: Form handling with validation

### Educational & Development Tools
- **Blockly**: Google's visual programming editor for block-based coding
- **Monaco Editor**: VS Code's editor for text-based programming
- **Chart.js**: Data visualization for progress tracking and analytics

### Development & Build Tools
- **TypeScript**: Static typing for both frontend and backend
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Autoprefixer for browser compatibility
- **Replit plugins**: Development environment integration and error handling