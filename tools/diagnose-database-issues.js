#!/usr/bin/env node

/**
 * Database Connection Diagnostic Tool
 * Helps identify specific database connection issues
 */

async function diagnoseDatabaseIssues() {
  console.log('Database Connection Diagnostics');
  console.log('==============================\n');

  // Check 1: Environment Variable
  console.log('1. Checking DATABASE_URL environment variable...');
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.log('   ❌ DATABASE_URL not found in environment');
    console.log('   💡 Set DATABASE_URL: export DATABASE_URL="your_neon_url"');
    return;
  }
  
  // Parse the database URL to check format
  try {
    const url = new URL(databaseUrl);
    console.log('   ✅ DATABASE_URL found');
    console.log(`   Host: ${url.hostname}`);
    console.log(`   Database: ${url.pathname.substring(1)}`);
    console.log(`   User: ${url.username}`);
    console.log(`   SSL: ${url.searchParams.get('sslmode') || 'not specified'}`);
  } catch (error) {
    console.log('   ❌ DATABASE_URL format invalid');
    console.log(`   Error: ${error.message}`);
    return;
  }

  // Check 2: Package availability
  console.log('\n2. Checking required packages...');
  try {
    await import('@neondatabase/serverless');
    console.log('   ✅ @neondatabase/serverless available');
  } catch (error) {
    console.log('   ❌ @neondatabase/serverless not available');
    console.log('   💡 Run: npm install @neondatabase/serverless');
    return;
  }

  try {
    await import('ws');
    console.log('   ✅ ws package available');
  } catch (error) {
    console.log('   ❌ ws package not available');
    console.log('   💡 Run: npm install ws');
    return;
  }

  // Check 3: Connection test
  console.log('\n3. Testing database connection...');
  try {
    const { Pool, neonConfig } = await import('@neondatabase/serverless');
    const ws = await import('ws');
    
    neonConfig.webSocketConstructor = ws.default;
    const pool = new Pool({ connectionString: databaseUrl });
    
    console.log('   Attempting connection...');
    const result = await pool.query('SELECT NOW() as current_time');
    console.log('   ✅ Database connection successful');
    console.log(`   Server time: ${result.rows[0].current_time}`);
    
    await pool.end();
  } catch (error) {
    console.log('   ❌ Database connection failed');
    console.log(`   Error: ${error.message}`);
    
    // Provide specific error guidance
    if (error.message.includes('password authentication failed')) {
      console.log('   💡 Username or password incorrect in DATABASE_URL');
    } else if (error.message.includes('could not connect')) {
      console.log('   💡 Database server unreachable - check Neon dashboard');
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.log('   💡 Database name incorrect in URL');
    } else if (error.message.includes('SSL')) {
      console.log('   💡 Try adding ?sslmode=require to your DATABASE_URL');
    }
    return;
  }

  // Check 4: Table existence
  console.log('\n4. Checking database schema...');
  try {
    const { Pool, neonConfig } = await import('@neondatabase/serverless');
    const ws = await import('ws');
    
    neonConfig.webSocketConstructor = ws.default;
    const pool = new Pool({ connectionString: databaseUrl });
    
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'courses', 'lessons', 'robotics_activities')
      ORDER BY table_name
    `);
    
    const requiredTables = ['courses', 'lessons', 'robotics_activities', 'users'];
    const existingTables = tables.rows.map(row => row.table_name);
    
    console.log('   Required tables:');
    requiredTables.forEach(table => {
      if (existingTables.includes(table)) {
        console.log(`   ✅ ${table}`);
      } else {
        console.log(`   ❌ ${table} (missing)`);
      }
    });
    
    if (existingTables.length === 0) {
      console.log('\n   💡 No tables found. Create them using:');
      console.log('      - Neon SQL Editor with the provided SQL commands');
      console.log('      - Or run the schema creation script');
    }
    
    await pool.end();
  } catch (error) {
    console.log('   ❌ Could not check database schema');
    console.log(`   Error: ${error.message}`);
  }

  console.log('\n📋 Next Steps:');
  console.log('   1. If connection failed, fix the DATABASE_URL');
  console.log('   2. If tables are missing, create them in Neon SQL Editor');
  console.log('   3. If everything looks good, test your Vercel deployment');
}

// Get DATABASE_URL from command line or environment
const databaseUrl = process.argv[2] || process.env.DATABASE_URL;

if (databaseUrl && databaseUrl !== process.env.DATABASE_URL) {
  process.env.DATABASE_URL = databaseUrl;
  console.log(`Using provided DATABASE_URL: ${databaseUrl.substring(0, 50)}...`);
}

diagnoseDatabaseIssues().catch(console.error);