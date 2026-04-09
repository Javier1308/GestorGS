-- ============================================================
-- GestorGS - Schema PostgreSQL para Supabase
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password_hash   TEXT NOT NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    role            VARCHAR(20)  NOT NULL CHECK (role IN ('ADMIN','STAFF','TECHNICIAN','OWNER')),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role  ON users(role);

-- 2. BUILDINGS
CREATE TABLE IF NOT EXISTS buildings (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(150) NOT NULL,
    address    VARCHAR(300) NOT NULL,
    phone      VARCHAR(50),
    email      VARCHAR(150),
    is_active  BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_buildings_name   ON buildings(name);
CREATE INDEX IF NOT EXISTS idx_buildings_active ON buildings(is_active);

-- 3. UTILITIES
CREATE TABLE IF NOT EXISTS utilities (
    id             BIGSERIAL PRIMARY KEY,
    building_id    BIGINT NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    name           VARCHAR(100) NOT NULL,
    account_number VARCHAR(100) NOT NULL,
    created_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_utilities_building ON utilities(building_id);
CREATE INDEX IF NOT EXISTS idx_utilities_account  ON utilities(account_number);

-- 4. UTILITY_PAYMENTS
CREATE TABLE IF NOT EXISTS utility_payments (
    id             BIGSERIAL PRIMARY KEY,
    utility_id     BIGINT NOT NULL REFERENCES utilities(id) ON DELETE CASCADE,
    month          VARCHAR(7)  NOT NULL,           -- formato YYYY-MM
    amount         NUMERIC(12,2) NOT NULL,
    due_date       DATE NOT NULL,
    paid_date      DATE,
    status         VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE'
                   CHECK (status IN ('PENDIENTE','PAGADO','VENCIDO','PARCIAL')),
    receipt_number VARCHAR(100),
    payment_method VARCHAR(50),
    notes          TEXT,
    created_at     TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_utility  ON utility_payments(utility_id);
CREATE INDEX IF NOT EXISTS idx_payments_status   ON utility_payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_month    ON utility_payments(month);
CREATE INDEX IF NOT EXISTS idx_payments_due_date ON utility_payments(due_date);

-- 5. WORK_ORDERS
CREATE TABLE IF NOT EXISTS work_orders (
    id           BIGSERIAL PRIMARY KEY,
    title        VARCHAR(200) NOT NULL,
    description  TEXT,
    building_id  BIGINT NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    status       VARCHAR(20) NOT NULL DEFAULT 'ABIERTA'
                 CHECK (status IN ('ABIERTA','EN_PROGRESO','COMPLETADA','CERRADA')),
    assigned_to  BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_by   BIGINT NOT NULL REFERENCES users(id),
    priority     VARCHAR(10) NOT NULL DEFAULT 'MEDIA'
                 CHECK (priority IN ('BAJA','MEDIA','ALTA','URGENTE')),
    created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_workorders_building ON work_orders(building_id);
CREATE INDEX IF NOT EXISTS idx_workorders_status   ON work_orders(status);
CREATE INDEX IF NOT EXISTS idx_workorders_assigned ON work_orders(assigned_to);
CREATE INDEX IF NOT EXISTS idx_workorders_priority ON work_orders(priority);

-- 6. WORK_ORDER_COMMENTS
CREATE TABLE IF NOT EXISTS work_order_comments (
    id            BIGSERIAL PRIMARY KEY,
    work_order_id BIGINT NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    user_id       BIGINT NOT NULL REFERENCES users(id),
    content       TEXT NOT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_workorder ON work_order_comments(work_order_id);
CREATE INDEX IF NOT EXISTS idx_comments_user      ON work_order_comments(user_id);

-- 7. ACTIVITY_LOG
CREATE TABLE IF NOT EXISTS activity_log (
    id          BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id   BIGINT NOT NULL,
    user_id     BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action      VARCHAR(50) NOT NULL,
    old_value   TEXT,
    new_value   TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_entity  ON activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_user    ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_log(created_at);

-- 8. IN_APP_NOTIFICATIONS
CREATE TABLE IF NOT EXISTS in_app_notifications (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title      VARCHAR(200) NOT NULL,
    message    TEXT NOT NULL,
    is_read    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user    ON in_app_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read    ON in_app_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON in_app_notifications(created_at);

-- ============================================================
-- SEED: Admin inicial  (password: admin123)
-- BCrypt hash de "admin123" con 10 rondas
-- ============================================================
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active)
SELECT 'admin@gs.com',
       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
       'Admin', 'GS', 'ADMIN', TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@gs.com');

-- ============================================================
-- SEED: Edificios de ejemplo
-- ============================================================
INSERT INTO buildings (name, address, phone, email, is_active)
SELECT 'Edificio Aventino', 'Av. Javier Prado 1234, San Isidro', '01-555-0101', 'aventino@gs.com', TRUE
WHERE NOT EXISTS (SELECT 1 FROM buildings WHERE name = 'Edificio Aventino');

INSERT INTO buildings (name, address, phone, email, is_active)
SELECT 'Edificio Roma', 'Calle Los Olivos 567, Miraflores', '01-555-0202', 'roma@gs.com', TRUE
WHERE NOT EXISTS (SELECT 1 FROM buildings WHERE name = 'Edificio Roma');

-- SEED: Utilities para Edificio Aventino
INSERT INTO utilities (name, account_number, building_id)
SELECT 'Agua', 'AGU-2024-001', b.id
FROM buildings b WHERE b.name = 'Edificio Aventino'
AND NOT EXISTS (SELECT 1 FROM utilities WHERE account_number = 'AGU-2024-001');

INSERT INTO utilities (name, account_number, building_id)
SELECT 'Luz', 'LUZ-2024-001', b.id
FROM buildings b WHERE b.name = 'Edificio Aventino'
AND NOT EXISTS (SELECT 1 FROM utilities WHERE account_number = 'LUZ-2024-001');

INSERT INTO utilities (name, account_number, building_id)
SELECT 'Ascensor', 'ASC-2024-001', b.id
FROM buildings b WHERE b.name = 'Edificio Aventino'
AND NOT EXISTS (SELECT 1 FROM utilities WHERE account_number = 'ASC-2024-001');
