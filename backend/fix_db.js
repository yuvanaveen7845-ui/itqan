const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixProducts() {
    console.log("Fetching existing products...");
    const { data: products, error } = await supabase.from('products').select('*');

    if (error) {
        console.error("Error fetching products:", error);
        process.exit(1);
    }

    // Define some sensible perfume names to rotate through
    const perfumeNames = [
        "Oud Wood Intense", "Midnight Rose", "Amber Horizon", "Sandalwood Whisper",
        "Bergamot Bliss", "Vanilla Musk", "Royal Saffron", "Ocean Pearl"
    ];
    const families = ["Woody", "Floral", "Oriental", "Fresh", "Citrus", "Spicy"];

    for (let i = 0; i < products.length; i++) {
        const p = products[i];

        // Only update if it contains textile/clothing words or is using old template name
        const isTextile = p.name.match(/shirt|suit|fabric|menswear|trouser/i) || p.fabric_type.match(/cotton|silk|linen/i);

        // If we want to replace absolutely everything to ensure it's perfume based:
        const newName = perfumeNames[i % perfumeNames.length];
        const newFamily = families[i % families.length];

        console.log(`Updating product ${p.id}: ${p.name} -> ${newName}`);

        const { error: updateError } = await supabase.from('products').update({
            name: newName,
            description: `A luxurious ${newFamily.toLowerCase()} fragrance featuring premium notes designed for elegance and long-lasting sillage.`,
            fabric_type: newFamily,
            pattern: 'Extract', // Re-purpose for fragrance concentration
            size: '100ml'
        }).eq('id', p.id);

        if (updateError) {
            console.error(`Failed to update ${p.id}:`, updateError);
        }
    }
    console.log("Database successfully seeded with Perfume products!");
}

fixProducts();
