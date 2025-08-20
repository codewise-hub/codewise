# Enhanced CodewiseHub Multi-Role System

## Overview
CodewiseHub now features a comprehensive multi-role educational platform with subscription packages, parent-child account linking, and school administration capabilities.

## System Architecture

### User Roles
1. **Student** (ages 6-17)
   - Choose subscription packages during registration
   - Access age-appropriate learning content
   - Track progress and achievements

2. **Parent**
   - Link to existing student accounts
   - Monitor child's learning progress
   - Receive progress reports

3. **Teacher** (Individual or School-based)
   - Create and manage courses
   - Monitor student progress
   - Access teaching tools and analytics

4. **School Administrator**
   - Manage school's coding program
   - Create teacher and student accounts
   - Control school subscription and billing

### Subscription Packages

#### Individual Packages
- **Free Explorer** ($0/month): Basic features for getting started
- **Basic Coder** ($49/month): Full access with AI tutor
- **Premium Pro** ($99/month): Complete experience with mentoring

#### School Packages
- **School Basic** ($199/month): Up to 50 students
- **School Premium** ($499/month): Up to 500 students with advanced features

### Database Schema

#### Core Tables
- **packages**: Subscription plans with features and pricing
- **schools**: Educational institutions with admin management
- **users**: Enhanced user table with role-based fields
- **parent_child_relations**: Many-to-many relationship table

#### Key Features
- Package-based access control
- Hierarchical user management
- School administration dashboard
- Parent-child account linking
- Multi-role subscription system

### Authentication Flow

#### Student Registration
1. Choose "Student" role
2. Select age group (6-11 or 12-17)
3. Choose subscription package
4. Complete registration

#### Parent Registration
1. Choose "Parent" role
2. Complete basic registration
3. Search for child's account by email
4. Link accounts for monitoring

#### School Admin Registration
1. Choose "School Administrator" role
2. Select school package
3. Create school profile
4. Gain access to management dashboard

### API Endpoints

#### Package Management
- `GET /api/packages?type=individual` - Get individual packages
- `GET /api/packages?type=school` - Get school packages
- `POST /api/users/select-package` - Select user package

#### School Management
- `POST /api/schools` - Create school
- `GET /api/schools/:id/users` - Get school users
- `POST /api/schools/create-user` - Create school user account

#### Parent-Child Relationships
- `GET /api/users/search-student?email=` - Search for student
- `POST /api/parent-child-relations` - Link parent to child
- `GET /api/parent-child-relations/children/:parentId` - Get children

### Frontend Components

#### Authentication Components
- **RoleSelection**: Choose user role during registration
- **PackageSelection**: Select subscription package
- **ParentChildLinking**: Link parent to student accounts

#### Dashboard Components
- **SchoolAdminDashboard**: Complete school management interface
- Role-specific dashboards for each user type

### Database Setup Commands

```bash
# Initialize enhanced database
node tools/initialize-enhanced-database.js

# Run diagnostics
node tools/diagnose-database-issues.js

# Push schema changes
npm run db:push
```

### Deployment Notes
- Neon PostgreSQL database required
- Environment variables: DATABASE_URL must be set
- All tables created with relationships and indexes
- Sample data included for packages

### Testing Checklist
- [ ] Package selection during registration
- [ ] Parent-child account linking
- [ ] School admin dashboard functionality
- [ ] User role-based access control
- [ ] Subscription package features
- [ ] Database relationships working
- [ ] API endpoints responding correctly

## Next Steps
1. Test complete registration flow for each role
2. Verify package selection and billing integration
3. Test parent-child linking functionality
4. Validate school administration features
5. Deploy to production with Vercel