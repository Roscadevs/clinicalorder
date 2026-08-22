-- =====================================================================================
-- MIGRACIÓN FLYWAY V2: Tablas de Auditoría Inmutable para Historia Clínica y Evoluciones
-- Base de datos: Supabase PostgreSQL 15+
-- =====================================================================================

-- 1. Tabla de Auditoría para Cambios en la Ficha Médica Base
CREATE TABLE historia_clinica_audit (
    id BIGSERIAL PRIMARY KEY, -- Identificador único del evento de auditoría
    historia_clinica_id BIGINT NOT NULL REFERENCES historia_clinica(id) ON DELETE CASCADE, -- Historia modificada
    modified_by_user_id BIGINT NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT, -- Médica responsable
    modified_section VARCHAR(100) NOT NULL, -- Sección alterada (ej. 'ANTECEDENTES', 'ALERGIAS', 'EXAMEN')
    previous_values JSONB NOT NULL, -- Snapshot JSON de los valores antes de la modificación
    new_values JSONB NOT NULL, -- Snapshot JSON de los valores posteriores a la modificación
    modified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW() -- Marca temporal inmutable del evento
);

-- Índices de búsqueda para auditoría médica
CREATE INDEX idx_hc_audit_record ON historia_clinica_audit(historia_clinica_id);
CREATE INDEX idx_hc_audit_user ON historia_clinica_audit(modified_by_user_id);
CREATE INDEX idx_hc_audit_date ON historia_clinica_audit(modified_at);

-- 2. Tabla de Auditoría para Cambios en las Notas de Evolución de Sesión
CREATE TABLE entrada_hc_audit (
    id BIGSERIAL PRIMARY KEY, -- Identificador único del evento de auditoría
    entrada_hc_id BIGINT NOT NULL REFERENCES entrada_hc(id) ON DELETE CASCADE, -- Nota modificada
    modified_by_user_id BIGINT NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT, -- Médica responsable
    previous_content TEXT NOT NULL, -- Contenido textual exacto previo a la edición
    new_content TEXT NOT NULL, -- Nuevo contenido textual registrado
    modified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW() -- Marca temporal inmutable del evento
);

-- Índices de búsqueda para auditoría de notas clínicas
CREATE INDEX idx_entrada_audit_entry ON entrada_hc_audit(entrada_hc_id);
CREATE INDEX idx_entrada_audit_user ON entrada_hc_audit(modified_by_user_id);
CREATE INDEX idx_entrada_audit_date ON entrada_hc_audit(modified_at);
