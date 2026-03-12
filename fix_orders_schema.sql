-- ============================================================
-- fix_orders_schema.sql
-- Run this in your Supabase SQL Editor to fix the orders table
-- All statements use IF NOT EXISTS / DO $$ blocks so they are safe to re-run
-- ============================================================

-- 1. Add missing columns to orders table
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS display_id VARCHAR(100),
  ADD COLUMN IF NOT EXISTS coupon_id UUID,
  ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10, 2) DEFAULT 0;

-- 2. Add 'staff' to users role check if missing
-- (Some older schemas only have customer/admin/super_admin)
DO $$
BEGIN
  -- Drop old constraint and recreate with 'staff' included
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'users_role_check' AND table_name = 'users'
  ) THEN
    ALTER TABLE users DROP CONSTRAINT users_role_check;
  END IF;
  -- Add updated constraint
  ALTER TABLE users ADD CONSTRAINT users_role_check
    CHECK (role IN ('customer', 'staff', 'admin', 'super_admin'));
EXCEPTION WHEN others THEN
  NULL; -- Ignore if already correct
END $$;

-- 3. Ensure order_status_history table exists
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  comment TEXT,
  changed_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Ensure coupons table exists (needed for coupon_id FK lookups)
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL,
  min_order_amount DECIMAL(10, 2) DEFAULT 0,
  max_discount_amount DECIMAL(10, 2),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Ensure audit_logs table exists
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50),
  target_id VARCHAR(100),
  old_value JSONB,
  new_value JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Add missing password column to users (for email/password auth)
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- 7. Verify: show orders table columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;
