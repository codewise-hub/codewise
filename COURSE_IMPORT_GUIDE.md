# CodewiseHub Course Import Tool Guide

## Overview

The Course Import Tool is a powerful utility that allows you to populate your CodewiseHub database with educational content. It reads course material from a JSON file and imports it into your PostgreSQL database.

## Quick Start

1. **Run the import tool:**
   ```bash
   tsx tools/import-course-material.ts
   ```

2. **Or with a custom JSON file:**
   ```bash
   tsx tools/import-course-material.ts path/to/your-courses.json
   ```

## What Gets Imported

The tool imports three types of educational content:

### 📚 Courses
- Course metadata (title, description, age group, difficulty)
- Course categories (programming, web-development, robotics)
- Estimated learning hours and images

### 📖 Lessons
- Interactive lesson content for each course
- Lesson types (interactive, video, quiz, project)
- Step-by-step learning materials with code examples

### 🤖 Robotics Activities
- Hands-on challenges and puzzles
- Age-appropriate difficulty levels
- Point-based reward system

## Sample Course Material

The included `course-material.json` contains:

### For Ages 6-11 (Visual Learners)
- **Blockly Adventures for Kids** - Visual block programming
  - Meet Your Robot Friend
  - Making Patterns  
  - Robot Dance Party
  - Smart Robot Decisions

### For Ages 12-17 (Text-Based Coding)
- **JavaScript Fundamentals** - Real programming basics
  - Your First Program
  - Variables and Data
  - Making Decisions
  - Loops and Repetition
  - Functions - Your Programming Tools

- **Web Development Basics** - Building websites
  - HTML - The Structure of Web Pages
  - CSS - Making It Beautiful
  - JavaScript - Making It Interactive

- **Micro:bit Adventures** - Hardware programming
  - LED Matrix Fun
  - Button Controls
  - Motion Sensor Magic

### Robotics Challenges
- Light Maze Challenge (Ages 6-11, Easy)
- Musical Robot Orchestra (Ages 6-11, Medium)
- Color Sorting Robot (Ages 12-17, Medium)
- Smart Home Assistant (Ages 12-17, Hard)

## JSON File Structure

### Course Format
```json
{
  "courses": [
    {
      "title": "Course Name",
      "description": "Course description",
      "ageGroup": "6-11" | "12-17",
      "difficulty": "beginner" | "intermediate" | "advanced",
      "category": "programming" | "web-development" | "robotics",
      "imageUrl": "https://example.com/image.jpg",
      "estimatedHours": 10,
      "isActive": true,
      "lessons": [
        {
          "title": "Lesson Name",
          "description": "Lesson description",
          "content": "{\"type\":\"interactive\",\"code\":\"...\"}",
          "orderIndex": 1,
          "type": "interactive" | "video" | "quiz" | "project",
          "estimatedMinutes": 30,
          "isRequired": true
        }
      ]
    }
  ]
}
```

### Robotics Activity Format
```json
{
  "roboticsActivities": [
    {
      "title": "Activity Name",
      "description": "Activity description",
      "type": "maze" | "challenge" | "puzzle",
      "difficulty": "easy" | "medium" | "hard",
      "ageGroup": "6-11" | "12-17",
      "instructions": "{\"goal\":\"...\",\"tools\":[...]}",
      "solution": "{\"code\":\"...\"}",
      "estimatedMinutes": 20,
      "points": 100,
      "imageUrl": "https://example.com/image.jpg",
      "isActive": true
    }
  ]
}
```

## Import Process

When you run the import tool:

1. **Validation** - Checks database connection
2. **Data Clearing** - Removes existing course material (with confirmation)
3. **Course Import** - Creates courses and their lessons
4. **Activity Import** - Adds robotics activities
5. **Summary Report** - Shows what was imported

## API Endpoints

After importing, you can access the data via these endpoints:

### Courses
- `GET /api/courses` - All courses
- `GET /api/courses?ageGroup=6-11` - Courses for specific age group
- `POST /api/courses` - Create new course

### Lessons
- `GET /api/courses/:courseId/lessons` - Lessons for a course
- `POST /api/lessons` - Create new lesson

### Robotics Activities
- `GET /api/robotics-activities` - All activities
- `GET /api/robotics-activities?ageGroup=12-17` - Activities for specific age group
- `POST /api/robotics-activities` - Create new activity

## Viewing Imported Content

After importing, you can view all content through:

1. **Admin Panel** - Navigate to `/admin` in your application
2. **API Testing** - Use curl commands to test endpoints
3. **Database Direct** - Query PostgreSQL directly

## Tips for Custom Content

### Creating Effective Lessons
- Use JSON format for rich content in the `content` field
- Include clear learning objectives
- Provide interactive elements when possible
- Set appropriate time estimates

### Designing Robotics Activities
- Make instructions clear and age-appropriate
- Include hints for younger learners
- Provide complete solutions for reference
- Use engaging themes and stories

### Course Organization
- Order lessons logically with `orderIndex`
- Group related concepts together
- Balance theory with hands-on practice
- Include project-based learning

## Troubleshooting

### Common Issues

**File not found error:**
```bash
# Make sure the JSON file exists
ls course-material.json
```

**JSON syntax error:**
```bash
# Validate your JSON
cat course-material.json | jq .
```

**Database connection error:**
```bash
# Check environment variables
echo $DATABASE_URL
```

### Database Recovery

If something goes wrong, you can:
1. Re-run the import tool (it clears existing data first)
2. Manually clear tables via SQL
3. Restore from a database backup

## Security Notes

- The tool requires database access via `DATABASE_URL`
- Always backup your database before importing
- Review JSON content for security issues
- Test with a small dataset first

## Next Steps

After importing course material:

1. **Test the API endpoints** to ensure data is accessible
2. **Update user interfaces** to display the new content
3. **Create learning paths** that guide students through courses
4. **Add progress tracking** to monitor student advancement
5. **Implement assessment tools** to measure learning outcomes

The imported content provides a solid foundation for your educational platform. You can now focus on building engaging user experiences around this rich course material.