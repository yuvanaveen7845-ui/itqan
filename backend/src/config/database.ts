import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'placeholder_key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const initializeDatabase = async () => {
  try {
    if (supabaseUrl.includes('placeholder')) {
      console.log('⚠️  Using placeholder Supabase credentials');
      console.log('📝 To use real database, update SUPABASE_URL and SUPABASE_KEY in .env');
      return;
    }
    const { data, error } = await supabase.from('users').select('count', { count: 'exact' });
    if (error) throw error;
    console.log('✓ Database connected successfully');
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    console.log('⚠️  Continuing with placeholder credentials for development');
  }
};
