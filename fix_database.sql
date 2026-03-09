-- Run this in your Supabase SQL Editor to update the products table
-- This adds the necessary columns for the new features (offers, multi-images, tracking)

-- 1. Add missing columns safely
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS original_price DECIMAL,
ADD COLUMN IF NOT EXISTS discount INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id);

-- 2. Update existing rows if necessary (optional)
-- UPDATE products SET images = ARRAY[image_url] WHERE images = '{}' AND image_url IS NOT NULL;

-- 3. Verify columns
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'products';
