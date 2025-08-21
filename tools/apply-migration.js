#!/usr/bin/env node

/**
 * Apply Simple Migration Script
 * Safely adds enhanced features to existing database
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import fs from 'fs';

neonConfig.webSocketConstructor = ws;

async function applyMigration() {
  console.log('🔧 Applying Enhanced Features Migration');
  console.log('====================================\n');

  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.log('❌ DATABASE_URL environment variable not found');
    process.exit(1);
  }

  try {
    console.log('📡 Connecting to database...');
    const pool = new Pool({ connectionString: databaseUrl });
    
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful\n');

    // Read migration SQL
    const migrationSql = fs.readFileSync('tools/simple-migration.sql', 'utf8');
    
    console.log('🏗️  Applying migration...');
    await pool.query(migrationSql);
    console.log('✅ Migration applied successfully\n');

    // Verify new tables
    const tablesResult = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('packages', 'schools', 'parent_child_relations')
      ORDER BY table_name
    `);
    
    console.log('📊 New tables created:');
    tablesResult.rows.forEach(row => {
      console.log(`   ✅ ${row.table_name}`);
    });

    // Check packages
    const packagesResult = await pool.query('SELECT COUNT(*) as count FROM packages');
    console.log(`\n💰 Packages loaded: ${packagesResult.rows[0].count}`);

    await pool.end();
    console.log('\n🎉 Migration Complete! Enhanced features are now available.');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (error.message.includes('already exists')) {
      console.log('💡 Some tables may already exist - this is normal.');
    }
  }
}

applyMigration().catch(console.error);