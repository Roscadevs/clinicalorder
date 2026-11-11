-- =====================================================================================
-- MIGRACION FLYWAY V7: Registro y Auditoría de Conexiones de Usuarios (Login Audit)
-- Base de datos: PostgreSQL 15+ (Supabase / contenedor local)
-- =====================================================================================

CREATE TABLE IF NOT EXISTS registro_conexion (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NULL REFERENCES usuario(id) ON DELETE SET NULL,
    username        VARCHAR(50) NOT NULL,
    exitoso         BOOLEAN NOT NULL,
    ip_address      VARCHAR(45) NULL,
    user_agent      VARCHAR(500) NULL,
    fecha_conexion  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_registro_conexion_fecha ON registro_conexion(fecha_conexion);
CREATE INDEX IF NOT EXISTS idx_registro_conexion_username ON registro_conexion(username);
CREATE INDEX IF NOT EXISTS idx_registro_conexion_user_id ON registro_conexion(user_id);
