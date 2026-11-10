-- =====================================================================================
-- MIGRACION FLYWAY V4: Asegurar estado ATTENDED en constraint cita_status_check
-- Base de datos: PostgreSQL 15+
-- =====================================================================================

ALTER TABLE cita DROP CONSTRAINT IF EXISTS cita_status_check;
ALTER TABLE cita ADD CONSTRAINT cita_status_check CHECK (status IN (
    'PENDING_PAYMENT', 'CONFIRMED', 'ATTENDED', 'CANCELED',
    'COMPLETED', 'PAYMENT_FAILED', 'NO_SHOW'
));
