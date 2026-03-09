-- Enable pgcrypto for bcrypt hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Seed Yuvaraj A
INSERT INTO users (email, password, name, role)
VALUES (
    'kit28.24bad188@gmail.com',
    crypt('yuva2503', gen_salt('bf')),
    'Yuvaraj A',
    'super_admin'
)
ON CONFLICT (email) DO UPDATE 
SET password = EXCLUDED.password, 
    role = EXCLUDED.role;

-- Seed Sam Joel M
INSERT INTO users (email, password, name, role)
VALUES (
    'kit28.24bad133@gmail.com',
    crypt('sam2076', gen_salt('bf')),
    'Sam Joel M',
    'super_admin'
)
ON CONFLICT (email) DO UPDATE 
SET password = EXCLUDED.password, 
    role = EXCLUDED.role;
