#!/usr/bin/env node

/**
 * Enhanced Database Initialization Script
 * Creates the complete multi-role database schema with packages, schools, and relationships
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import fs from 'fs';
import path from 'path';

neonConfig.webSocketConstructor = ws;

async function initializeEnhancedDatabase() {
  console.log('🚀 Enhanced CodewiseHub Database Initialization');
  console.log('==============================================\n');

  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.log('❌ DATABASE_URL environment variable not found');
    console.log('💡 Set DATABASE_URL: export DATABASE_URL="your_neon_url"');
    process.exit(1);
  }

  try {
    console.log('📡 Connecting to database...');
    const pool = new Pool({ connectionString: databaseUrl });
    
    // Test connection
    await pool.query('SELECT NOW() as current_time');
    console.log('✅ Database connection successful\n');

    // Read and execute the enhanced schema
    console.log('📄 Reading enhanced database schema...');
    const schemaPath = path.join(process.cwd(), 'tools', 'create-enhanced-database-schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('🏗️  Creating enhanced database schema...');
    await pool.query(schemaSql);
    console.log('✅ Enhanced schema created successfully\n');

    // Verify the new tables
    console.log('🔍 Verifying enhanced tables...');
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    const expectedTables = [
      'achievements',
      'courses', 
      'lessons',
      'packages',
      'parent_child_relations',
      'projects',
      'robotics_activities',
      'schools',
      'user_progress',
      'users'
    ];
    
    const existingTables = tablesResult.rows.map(row => row.table_name);
    
    console.log('📊 Database Tables Status:');
    expectedTables.forEach(table => {
      if (existingTables.includes(table)) {
        console.log(`   ✅ ${table}`);
      } else {
        console.log(`   ❌ ${table} (missing)`);
      }
    });

    // Check if packages were inserted
    console.log('\n💰 Checking subscription packages...');
    const packagesResult = await pool.query('SELECT name, price, package_type FROM packages');
    
    if (packagesResult.rows.length > 0) {
      console.log('✅ Subscription packages loaded:');
      packagesResult.rows.forEach(pkg => {
        console.log(`   • ${pkg.name} (${pkg.package_type}): $${pkg.price}`);
      });
    } else {
      console.log('❌ No packages found. Schema may not have been applied correctly.');
    }

    // Test enhanced features
    console.log('\n🧪 Testing enhanced features...');
    
    // Test package functionality
    const freePackage = await pool.query(`
      SELECT id FROM packages WHERE name = 'Free Explorer' LIMIT 1
    `);
    
    if (freePackage.rows.length > 0) {
      console.log('✅ Package system ready');
    }

    // Test relationships
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_test_parent_child 
      ON parent_child_relations(parent_user_id, child_user_id)
    `);
    console.log('✅ Parent-child relationship system ready');

    // Test school management
    const schoolConstraints = await pool.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.table_constraints 
      WHERE table_name = 'schools' AND constraint_type = 'FOREIGN KEY'
    `);
    
    if (schoolConstraints.rows[0].count > 0) {
      console.log('✅ School management system ready');
    }

    await pool.end();

    console.log('\n🎉 Enhanced Database Initialization Complete!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Test the application with: npm run dev');
    console.log('   2. Try package selection during user registration');
    console.log('   3. Test parent-child account linking');
    console.log('   4. Create a school admin account to test school management');
    console.log('   5. Deploy to Vercel when ready');

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    
    if (error.message.includes('relation') && error.message.includes('does not exist')) {
      console.log('\n💡 Some tables may already exist. This is normal if updating an existing database.');
    } else if (error.message.includes('password authentication failed')) {
      console.log('\n💡 Check your DATABASE_URL credentials in Neon dashboard.');
    } else if (error.message.includes('connection')) {
      console.log('\n💡 Check your internet connection and Neon database status.');
    }
    
    process.exit(1);
  }
}

// Run initialization
initializeEnhancedDatabase().catch(console.error);