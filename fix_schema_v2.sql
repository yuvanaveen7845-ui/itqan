-- Add missing columns to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price DECIMAL(10, 2);

-- Fix cart table name mismatch
-- Check if 'cart' exists and 'cart_items' does not, then rename
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'cart') AND 
       NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'cart_items') THEN
        ALTER TABLE cart RENAME TO cart_items;
    END IF;
END $$;

-- Ensure cart_items has necessary columns if it was just created or renamed
-- (DATABASE_SCHEMA.sql already has user_id, product_id, quantity)
