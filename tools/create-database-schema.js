#!/usr/bin/env node

/**
 * Database Schema Creator
 * Creates all required tables without needing drizzle-kit
 */

async function createDatabaseSchema(databaseUrl) {
  console.log('Creating Database Schema');
  console.log('======================');
  
  if (!databaseUrl) {
    console.error('Error: No DATABASE_URL provided');
    console.log('Usage: node tools/create-database-schema.js "your_database_url"');
    process.exit(1);
  }
  
  try {
    // Import Neon dependencies
    const { Pool, neonConfig } = await import('@neondatabase/serverless');
    const ws = await import('ws');
    
    // Configure WebSocket for Neon
    neonConfig.webSocketConstructor = ws.default;
    
    console.log('Connecting to database...');
    const pool = new Pool({ connectionString: databaseUrl });
    
    // SQL statements to create all tables
    const createTables = [
      {
        name: 'users',
        sql: `
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL DEFAULT 'student',
            age_group VARCHAR(20),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `
      },
      {
        name: 'courses',
        sql: `
          CREATE TABLE IF NOT EXISTS courses (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            age_group VARCHAR(20) NOT NULL,
            difficulty VARCHAR(20) NOT NULL,
            duration_minutes INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `
      },
      {
        name: 'lessons',
        sql: `
          CREATE TABLE IF NOT EXISTS lessons (
            id SERIAL PRIMARY KEY,
            course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            content TEXT,
            order_index INTEGER NOT NULL,
            duration_minutes INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `
      },
      {
        name: 'robotics_activities',
        sql: `
          CREATE TABLE IF NOT EXISTS robotics_activities (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            age_group VARCHAR(20) NOT NULL,
            difficulty VARCHAR(20) NOT NULL,
            instructions TEXT,
            code_template TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `
      }
    ];
    
    // Create each table
    for (const table of createTables) {
      console.log(`Creating table: ${table.name}`);
      await pool.query(table.sql);
      console.log(`✅ Table ${table.name} created successfully`);
    }
    
    console.log('\n✨ All database tables created successfully!');
    
    // Verify tables exist
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('\n📋 Tables in database:');
    result.rows.forEach(row => {
      console.log(`   • ${row.table_name}`);
    });
    
    await pool.end();
    console.log('\n🎉 Database setup complete! Ready for course import.');
    
  } catch (error) {
    console.error('❌ Database schema creation failed:', error.message);
    
    if (error.message.includes('password authentication failed')) {
      console.log('💡 Check your username and password in the DATABASE_URL');
    } else if (error.message.includes('could not connect to server')) {
      console.log('💡 Check if the database server is running and accessible');
    }
    
    process.exit(1);
  }
}

async function main() {
  const databaseUrl = process.argv[2] || process.env.DATABASE_URL;
  await createDatabaseSchema(databaseUrl);
}

main().catch(console.error);