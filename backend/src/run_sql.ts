import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';

const connectionString = 'postgresql://postgres:ssmenswear@123@db.hdssfxtoveybsatydbyt.supabase.co:5432/postgres';

async function runSeed() {
    const client = new Client({
        connectionString,
    });

    try {
        console.log('Connecting to database...');
        await client.connect();

        console.log('Reading seed SQL...');
        const sqlPath = path.resolve(__dirname, '../../seed_admins.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing SQL...');
        await client.query(sql);

        console.log('Success! Admin users seeded.');
    } catch (err) {
        console.error('Error executing seed:', err);
    } finally {
        await client.end();
    }
}

runSeed();
