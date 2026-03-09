import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';

const connectionString = 'postgresql://postgres:ssmenswear@123@db.hdssfxtoveybsatydbyt.supabase.co:5432/postgres';

async function runSchema() {
    const client = new Client({
        connectionString,
    });

    try {
        console.log('Connecting to database...');
        await client.connect();

        console.log('Reading schema SQL...');
        const sqlPath = path.resolve('../DATABASE_SCHEMA.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing Schema SQL...');
        await client.query(sql);

        console.log('Success! Database schema initialized.');
    } catch (err) {
        console.error('Error executing schema:', err);
    } finally {
        await client.end();
    }
}

runSchema();
