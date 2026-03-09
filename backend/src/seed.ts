import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load env vars
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    console.error('Real Supabase credentials required for seeding.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SEED_USERS = [
    {
        email: 'kit28.24bad188@gmail.com',
        password: 'yuva2503',
        name: 'Yuvaraj A',
        role: 'super_admin'
    },
    {
        email: 'kit28.24bad133@gmail.com',
        password: 'sam2076',
        name: 'Sam Joel M',
        role: 'super_admin' // User asked to add both as superadmin
    }
];

async function seed() {
    console.log('Seeding users...');

    for (const user of SEED_USERS) {
        try {
            // Check if exists
            const { data: existing } = await supabase
                .from('users')
                .select('id')
                .eq('email', user.email)
                .single();

            if (existing) {
                console.log(`User ${user.email} already exists. Skipping.`);
                continue;
            }

            const hashedPassword = await bcrypt.hash(user.password, 10);

            const { error } = await supabase
                .from('users')
                .insert([{
                    email: user.email,
                    password: hashedPassword,
                    name: user.name,
                    role: user.role
                }]);

            if (error) {
                console.error(`Error seeding ${user.email}:`, error.message);
            } else {
                console.log(`Successfully seeded: ${user.name} (${user.email}) as ${user.role}`);
            }
        } catch (err: any) {
            console.error(`Error processing ${user.email}:`, err.message);
        }
    }

    console.log('Done.');
}

seed();
