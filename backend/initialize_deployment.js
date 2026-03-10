const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Default connection string from internal config if ENV is missing
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:ssmenswear@123@db.hdssfxtoveybsatydbyt.supabase.co:5432/postgres';

async function initialize() {
    console.log('--- 🚀 Imperial Scent Platform Initializer ---');

    const client = new Client({ connectionString });

    try {
        console.log('1. Connecting to PostgreSQL...');
        await client.connect();
        console.log('   ✓ Connected successfully.');

        // Step 2: Run Schema
        console.log('2. Applying Database Schema...');
        const schemaPath = path.resolve(__dirname, '../DATABASE_SCHEMA.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schemaSql);
        console.log('   ✓ Schema initialized.');

        // Step 3: Seed Admins
        console.log('3. Seeding Admin Accounts...');
        const seedPath = path.resolve(__dirname, '../seed_admins.sql');
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        await client.query(seedSql);
        console.log('   ✓ Admins seeded.');

        console.log('\n--- 🎉 Initialization Complete! ---');
        console.log('Your platform is now ready for production.');
        console.log('Super Admin 1: kit28.24bad188@gmail.com / yuva2503');
        console.log('Super Admin 2: kit28.24bad133@gmail.com / sam2076');

    } catch (err) {
        console.error('\n✗ Initialization Failed!');
        console.error('Error Details:', err.message);
        if (err.code === '28P01') {
            console.log('Hint: Check your database password and connection string.');
        }
    } finally {
        await client.end();
    }
}

initialize();
