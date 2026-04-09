-- Seed admin user: admin@gs.com / admin123
-- BCrypt hash of "admin123" with 10 rounds
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, created_at, updated_at)
SELECT 'admin@gs.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin', 'GS', 'ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@gs.com');

-- Seed buildings
INSERT INTO buildings (name, address, phone, email, is_active, created_at, updated_at)
SELECT 'Edificio Aventino', 'Av. Javier Prado 1234, San Isidro', '01-555-0101', 'aventino@gs.com', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM buildings WHERE name = 'Edificio Aventino');

INSERT INTO buildings (name, address, phone, email, is_active, created_at, updated_at)
SELECT 'Edificio Roma', 'Calle Los Olivos 567, Miraflores', '01-555-0202', 'roma@gs.com', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM buildings WHERE name = 'Edificio Roma');

-- Seed utilities for Edificio Aventino (building_id = 1)
INSERT INTO utilities (name, account_number, building_id, created_at)
SELECT 'Agua', 'AGU-2024-001', b.id, CURRENT_TIMESTAMP
FROM buildings b WHERE b.name = 'Edificio Aventino'
AND NOT EXISTS (SELECT 1 FROM utilities u WHERE u.account_number = 'AGU-2024-001');

INSERT INTO utilities (name, account_number, building_id, created_at)
SELECT 'Luz', 'LUZ-2024-001', b.id, CURRENT_TIMESTAMP
FROM buildings b WHERE b.name = 'Edificio Aventino'
AND NOT EXISTS (SELECT 1 FROM utilities u WHERE u.account_number = 'LUZ-2024-001');

INSERT INTO utilities (name, account_number, building_id, created_at)
SELECT 'Ascensor', 'ASC-2024-001', b.id, CURRENT_TIMESTAMP
FROM buildings b WHERE b.name = 'Edificio Aventino'
AND NOT EXISTS (SELECT 1 FROM utilities u WHERE u.account_number = 'ASC-2024-001');
