const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY);

async function verifySchema() {
    console.log('--- Order Schema Verification ---');

    // Try a dry run insert with all columns
    const { error } = await supabase
        .from('orders')
        .insert([{
            user_id: '00000000-0000-0000-0000-000000000000', // Mock UUID
            total_amount: 0,
            display_id: 'VERIFY',
            coupon_id: null,
            discount_amount: 0
        }])
        .select();

    if (error && error.code === '42703') {
        console.error('✗ MISSING COLUMNS DETECTED!');
        console.error('Error details:', error.message);
        console.log('\nSuggested Fix: Run the migration to add display_id, coupon_id, and discount_amount to the orders table.');
    } else if (error && error.code === '23503') {
        console.log('✓ Columns exist (Foreign key violation confirmed they were parsed).');
    } else if (error) {
        console.log('Received error:', error.code, error.message);
    } else {
        console.log('✓ Insert successful (Columns exist).');
    }
}

verifySchema();
