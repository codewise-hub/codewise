#!/usr/bin/env node

/**
 * Database Connection Tester
 * Tests if your DATABASE_URL works correctly
 */

async function testDatabaseConnection(databaseUrl) {
  console.log('🔍 Testing Database Connection');
  console.log('==============================');
  
  if (!databaseUrl) {
    console.error('❌ No DATABASE_URL provided');
    console.log('Usage: node tools/test-database-connection.js "postgresql://user:pass@host:port/db"');
    process.exit(1);
  }
  
  try {
    // Import Neon dependencies
    const { Pool, neonConfig } = await import('@neondatabase/serverless');
    const ws = await import('ws');
    
    // Configure WebSocket for Neon
    neonConfig.webSocketConstructor = ws.default;
    
    console.log('📡 Connecting to database...');
    const pool = new Pool({ connectionString: databaseUrl });
    
    // Test basic connection
    const result = await pool.query('SELECT NOW() as current_time, version() as postgres_version');
    console.log('✅ Database connection successful!');
    console.log(`   Time: ${result.rows[0].current_time}`);
    console.log(`   Version: ${result.rows[0].postgres_version.split(' ')[0]} ${result.rows[0].postgres_version.split(' ')[1]}`);
    
    // Test if tables exist
    console.log('\\n🔍 Checking database schema...');
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'courses', 'lessons', 'robotics_activities')
      ORDER BY table_name
    `);
    
    const requiredTables = ['users', 'courses', 'lessons', 'robotics_activities'];
    const existingTables = tables.rows.map(row => row.table_name);
    
    console.log('📋 Required tables:');
    for (const tableName of requiredTables) {
      if (existingTables.includes(tableName)) {
        console.log(`   ✅ ${tableName}`);
      } else {
        console.log(`   ❌ ${tableName} (missing)`);
      }
    }
    
    // If tables are missing, show how to create them
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));
    if (missingTables.length > 0) {
      console.log('\\n🔧 To create missing tables:');
      console.log('   1. Run: npm run db:push');
      console.log('   2. Or use the SQL commands in NEON_VERCEL_SETUP.md');
    } else {
      console.log('\\n✨ All tables exist! Database is ready for course import.');
      
      // Test sample query
      try {
        const courseCount = await pool.query('SELECT COUNT(*) as count FROM courses');
        console.log(`📚 Current courses in database: ${courseCount.rows[0].count}`);
      } catch (error) {
        console.log('⚠️  Could not count courses (table might be empty)');
      }
    }
    
    await pool.end();
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    if (error.message.includes('password authentication failed')) {
      console.log('💡 Check your username and password in the DATABASE_URL');
    } else if (error.message.includes('could not connect to server')) {
      console.log('💡 Check if the database server is running and accessible');
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.log('💡 The database name in your URL might be incorrect');
    }
    
    process.exit(1);
  }
}

async function main() {
  const databaseUrl = process.argv[2] || process.env.DATABASE_URL;
  await testDatabaseConnection(databaseUrl);
}

main().catch(console.error);