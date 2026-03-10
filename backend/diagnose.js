const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
    console.log('--- START DATA INSPECTION ---');
    try {
        const { data, error } = await supabase.from('site_settings').select('*');
        if (error) {
            console.log('ERROR:site_settings:', error.message);
        } else {
            console.log('DATA:site_settings:', JSON.stringify(data));
        }
    } catch (err) {
        console.log('EXCEPTION:site_settings:', err.message);
    }
    console.log('--- END DATA INSPECTION ---');
}

diagnose();
