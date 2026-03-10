const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
    const tables = ['users', 'products', 'orders', 'order_items', 'order_status_history', 'payments', 'coupons'];
    console.log('--- START ORDER DIAGNOSTICS ---');
    for (const table of tables) {
        const { error, status, count } = await supabase.from(table).select('*', { count: 'exact', head: true });
        if (error) {
            console.log(`RESULT:${table}:ERROR:${error.message}:${status}`);
        } else {
            console.log(`RESULT:${table}:OK:${status}:COUNT:${count}`);
        }
    }
    console.log('--- END ORDER DIAGNOSTICS ---');
}

diagnose();
