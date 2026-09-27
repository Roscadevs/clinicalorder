-- =====================================================================================
-- MIGRACION FLYWAY V6: Alineación con el Diccionario de Datos (especificación final)
-- Base de datos: Supabase PostgreSQL 15+
-- Las migraciones V1-V5 son INMUTABLES y no se modifican.
--
-- Cambios:
--   1. transaccion_pago.payment_method  → payment_type   (renombrado de columna)
--   2. historia_clinica: 4 campos de texto libre TEXT → VARCHAR con longitudes acotadas
--   3. historia_clinica_audit.modified_at → updated_at   (renombrado de columna, HCA-updated_at)
-- =====================================================================================

-- ─────────────────────────────────────────────────────────────────────────────────────
-- 1. transaccion_pago: renombrar payment_method → payment_type
--    El nombre del CHECK constraint se mantiene consistente re-creándolo.
-- ─────────────────────────────────────────────────────────────────────────────────────

ALTER TABLE transaccion_pago RENAME COLUMN payment_method TO payment_type;

-- Recrea el CHECK constraint bajo el nuevo nombre de columna
ALTER TABLE transaccion_pago DROP CONSTRAINT IF EXISTS transaccion_pago_payment_method_check;
ALTER TABLE transaccion_pago
    ADD CONSTRAINT transaccion_pago_payment_type_check
    CHECK (payment_type IN ('MERCADOPAGO', 'CASH', 'BANK_TRANSFER'));

-- ─────────────────────────────────────────────────────────────────────────────────────
-- 2. historia_clinica: acotar longitudes de los campos de texto libre según especificación
--    - gynecological_history        → VARCHAR(500)
--    - surgical_history             → VARCHAR(1000)
--    - current_medications          → VARCHAR(1000)
--    - previous_aesthetic_treatments→ VARCHAR(1000)
-- ─────────────────────────────────────────────────────────────────────────────────────

ALTER TABLE historia_clinica
    ALTER COLUMN gynecological_history TYPE VARCHAR(500);

ALTER TABLE historia_clinica
    ALTER COLUMN surgical_history TYPE VARCHAR(1000);

ALTER TABLE historia_clinica
    ALTER COLUMN current_medications TYPE VARCHAR(1000);

ALTER TABLE historia_clinica
    ALTER COLUMN previous_aesthetic_treatments TYPE VARCHAR(1000);

-- ─────────────────────────────────────────────────────────────────────────────────────
-- 3. historia_clinica_audit: renombrar modified_at → updated_at (columna HCA-updated_at)
--    Se recrea el índice de fecha para que apunte a la nueva columna.
--    NOTA: entrada_hc_audit.modified_at NO se modifica (columna EA-modificado_en de la spec).
-- ─────────────────────────────────────────────────────────────────────────────────────

DROP INDEX IF EXISTS idx_hc_audit_date;

ALTER TABLE historia_clinica_audit RENAME COLUMN modified_at TO updated_at;

CREATE INDEX idx_hc_audit_date ON historia_clinica_audit(updated_at);
