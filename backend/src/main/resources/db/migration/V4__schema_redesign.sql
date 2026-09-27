-- =====================================================================================
-- MIGRACION FLYWAY V4: Rediseno del Esquema Relacional
-- Base de datos: Supabase PostgreSQL 15+
-- ENTORNO: Greenfield — V4 descarta y recrea todas las tablas del esquema.
-- Las migraciones V1, V2 y V3 son INMUTABLES y no se modifican.
-- =====================================================================================

-- ─────────────────────────────────────────────────────────────────────────────────────
-- PASO 1: DROP en orden seguro respetando dependencias de FK (hojas primero)
-- ─────────────────────────────────────────────────────────────────────────────────────

DROP TABLE IF EXISTS entrada_hc_audit         CASCADE;
DROP TABLE IF EXISTS imagen_hc                CASCADE;
DROP TABLE IF EXISTS entrada_hc               CASCADE;
DROP TABLE IF EXISTS historia_clinica_audit   CASCADE;
DROP TABLE IF EXISTS habito                   CASCADE;
DROP TABLE IF EXISTS antecedente_patologico   CASCADE;
DROP TABLE IF EXISTS alergia                  CASCADE;
DROP TABLE IF EXISTS historia_clinica         CASCADE;
DROP TABLE IF EXISTS transaccion_pago         CASCADE;
DROP TABLE IF EXISTS cita                     CASCADE;
DROP TABLE IF EXISTS bloqueo_calendario       CASCADE;
DROP TABLE IF EXISTS servicio                 CASCADE;
DROP TABLE IF EXISTS paciente                 CASCADE;
DROP TABLE IF EXISTS password_reset_token     CASCADE;
DROP TABLE IF EXISTS usuario                  CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────────────
-- PASO 2: Recreacion de tablas con el esquema actualizado
-- ─────────────────────────────────────────────────────────────────────────────────────

-- 1. Tabla de Usuarios del Sistema
--    Cambios respecto a V1:
--    - Eliminados: failed_login_attempts, locked_until
--    - CHECK de rol actualizado: ADMIN | DOCTORA | SECRETARIA
CREATE TABLE usuario (
    id                 BIGSERIAL PRIMARY KEY,
    username           VARCHAR(50)  NOT NULL UNIQUE,
    password_hash      VARCHAR(255) NOT NULL,
    email              VARCHAR(100) NOT NULL UNIQUE,
    full_name          VARCHAR(100) NOT NULL,
    role               VARCHAR(20)  NOT NULL CHECK (role IN ('ADMIN', 'DOCTORA', 'SECRETARIA')),
    active             BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 2. Tabla de Tokens de Recuperacion de Contrasena
--    Cambios respecto a V1:
--    - used BOOLEAN reemplazado por used_at TIMESTAMP WITH TIME ZONE NULL
CREATE TABLE password_reset_token (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    token       VARCHAR(255) NOT NULL UNIQUE,
    used_at     TIMESTAMP WITH TIME ZONE NULL,               -- NULL = no utilizado; valor = marca temporal de uso
    expires_at  TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 3. Tabla de Pacientes
--    Cambios respecto a V1:
--    - Eliminado: profession
--    - birth_date ahora NOT NULL
CREATE TABLE paciente (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    dni         VARCHAR(8)   NOT NULL UNIQUE CHECK (dni ~ '^[0-9]{7,8}$'),
    phone       VARCHAR(20)  NOT NULL UNIQUE,
    email       VARCHAR(100) NOT NULL UNIQUE,
    birth_date  DATE         NOT NULL,                        -- Obligatorio; no puede ser fecha futura (validado en app)
    active      BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_paciente_dni   ON paciente(dni);
CREATE INDEX idx_paciente_email ON paciente(email);
CREATE INDEX idx_paciente_name  ON paciente(name);

-- 4. Tabla de Servicios Dermatologicos y Esteticos
--    Cambios respecto a V1:
--    - deposit_percentage: NUMERIC(5,2) → INT NOT NULL CHECK BETWEEN 1 AND 100
--    - duration_minutes: CHECK actualizado: BETWEEN 10 AND 480 (antes 15-240)
--    - follow_up_interval_days: ahora NOT NULL DEFAULT 0 (0 = sin seguimiento)
CREATE TABLE servicio (
    id                      BIGSERIAL PRIMARY KEY,
    name                    VARCHAR(100)     NOT NULL UNIQUE,
    description             VARCHAR(500)     NULL,
    duration_minutes        INT              NOT NULL CHECK (duration_minutes BETWEEN 10 AND 480),
    base_price              NUMERIC(12, 2)   NOT NULL CHECK (base_price > 0),
    deposit_percentage      INT              NOT NULL CHECK (deposit_percentage BETWEEN 1 AND 100),
    follow_up_interval_days INT              NOT NULL DEFAULT 0 CHECK (follow_up_interval_days >= 0),
    active                  BOOLEAN          NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 5. Tabla de Citas (Turnos)
--    Cambios respecto a V1:
--    - Eliminados: temporary_hold_deadline, reschedule_count, original_start_time, version
--    - follow_up_to_id: agregado UNIQUE (1 cita origen → 1 seguimiento maximo)
--    - status CHECK actualizado: CANCELED (antes CANCELLED)
CREATE TABLE cita (
    id                  BIGSERIAL PRIMARY KEY,
    paciente_id         BIGINT           NOT NULL REFERENCES paciente(id) ON DELETE RESTRICT,
    servicio_id         BIGINT           NOT NULL REFERENCES servicio(id) ON DELETE RESTRICT,
    created_by_user_id  BIGINT           NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT,
    start_time          TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time            TIMESTAMP WITH TIME ZONE NOT NULL CHECK (end_time > start_time),
    status              VARCHAR(30)      NOT NULL CHECK (status IN (
                            'PENDING_PAYMENT', 'CONFIRMED', 'CANCELED',
                            'COMPLETED', 'PAYMENT_FAILED', 'NO_SHOW')),
    agreed_price        NUMERIC(12, 2)   NOT NULL CHECK (agreed_price >= 0),
    follow_up_to_id     BIGINT           NULL UNIQUE REFERENCES cita(id) ON DELETE SET NULL,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cita_range    ON cita(start_time, end_time);
CREATE INDEX idx_cita_status   ON cita(status);
CREATE INDEX idx_cita_paciente ON cita(paciente_id);

-- 6. Tabla de Transacciones de Pago
--    Cambios respecto a V1:
--    - payment_type reemplazado por payment_method (canal: MERCADOPAGO | CASH | BANK_TRANSFER)
--    - Nueva columna payment_concept (concepto: DEPOSIT | BALANCE | FULL)
--    - payment_date ahora NULL (se establece al aprobarse el pago)
CREATE TABLE transaccion_pago (
    id                    BIGSERIAL PRIMARY KEY,
    cita_id               BIGINT         NOT NULL REFERENCES cita(id) ON DELETE RESTRICT,
    mp_preference_id      VARCHAR(100)   NULL,
    mp_payment_id         VARCHAR(100)   NULL UNIQUE,
    payment_method        VARCHAR(20)    NOT NULL CHECK (payment_method IN ('MERCADOPAGO', 'CASH', 'BANK_TRANSFER')),
    payment_concept       VARCHAR(20)    NOT NULL CHECK (payment_concept IN ('DEPOSIT', 'BALANCE', 'FULL')),
    amount                NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    status                VARCHAR(20)    NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'REFUNDED')),
    registered_by_user_id BIGINT         NULL REFERENCES usuario(id) ON DELETE RESTRICT,
    payment_date          TIMESTAMP WITH TIME ZONE NULL,
    created_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transaccion_cita          ON transaccion_pago(cita_id);
CREATE INDEX idx_transaccion_preference_id ON transaccion_pago(mp_preference_id);

-- 7. Tabla de Bloqueos de Calendario
--    Cambios respecto a V1:
--    - reason: ahora NULL (motivo opcional)
CREATE TABLE bloqueo_calendario (
    id                  BIGSERIAL PRIMARY KEY,
    created_by_user_id  BIGINT         NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT,
    start_time          TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time            TIMESTAMP WITH TIME ZONE NOT NULL CHECK (end_time > start_time),
    reason              VARCHAR(255)   NULL,                  -- Motivo opcional
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 8. Tabla de Historia Clinica Base (1:1 con Paciente)
--    Cambios respecto a V1:
--    - Eliminados: todas las columnas booleanas de patologias, alergias y habitos
--    - Eliminados: other_pathological, other_allergies, treatment_plan
--    - fitzpatrick_phototype: VARCHAR → INT NOT NULL CHECK BETWEEN 1 AND 6
--    - physical_examination: TEXT → BYTEA (cifrado AES-256-GCM)
--    - Retenidos: gynecological_history, surgical_history, current_medications,
--                 previous_aesthetic_treatments como TEXT libre
CREATE TABLE historia_clinica (
    id                          BIGSERIAL PRIMARY KEY,
    paciente_id                 BIGINT   NOT NULL UNIQUE REFERENCES paciente(id) ON DELETE RESTRICT,
    created_by_user_id          BIGINT   NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT,
    fitzpatrick_phototype       INT      NOT NULL CHECK (fitzpatrick_phototype BETWEEN 1 AND 6),
    physical_examination        BYTEA    NULL,                -- Cifrado AES-256-GCM; NULL si no completado
    informed_consent_signed     BOOLEAN  NOT NULL DEFAULT FALSE,
    gynecological_history       TEXT     NULL,
    surgical_history            TEXT     NULL,
    current_medications         TEXT     NULL,
    previous_aesthetic_treatments TEXT   NULL,
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 9. Tabla de Alergias (Entidad Debil de Historia Clinica)
--    NUEVA tabla — reemplaza las columnas booleanas allergy_* de historia_clinica
--    Clave primaria compuesta: (historia_clinica_id, tipo)
CREATE TABLE alergia (
    historia_clinica_id  BIGINT       NOT NULL REFERENCES historia_clinica(id) ON DELETE RESTRICT,
    tipo                 VARCHAR(100) NOT NULL,
    observaciones        VARCHAR(500) NULL,
    created_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (historia_clinica_id, tipo)
);

-- 10. Tabla de Antecedentes Patologicos (Entidad Debil de Historia Clinica)
--     NUEVA tabla — reemplaza las columnas booleanas has_* de historia_clinica
--     Clave primaria compuesta: (historia_clinica_id, tipo)
CREATE TABLE antecedente_patologico (
    historia_clinica_id  BIGINT       NOT NULL REFERENCES historia_clinica(id) ON DELETE RESTRICT,
    tipo                 VARCHAR(100) NOT NULL,
    observaciones        VARCHAR(500) NULL,
    created_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (historia_clinica_id, tipo)
);

-- 11. Tabla de Habitos (Entidad Debil de Historia Clinica)
--     NUEVA tabla — reemplaza las columnas booleanas habit_* de historia_clinica
--     Clave primaria compuesta: (historia_clinica_id, tipo)
CREATE TABLE habito (
    historia_clinica_id  BIGINT       NOT NULL REFERENCES historia_clinica(id) ON DELETE RESTRICT,
    tipo                 VARCHAR(100) NOT NULL,
    observaciones        VARCHAR(500) NULL,
    created_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (historia_clinica_id, tipo)
);

-- 12. Tabla de Entradas de Evolucion Clinica (Notas por Sesion)
--     Cambios respecto a V1:
--     - historia_clinica_id ELIMINADO (se navega via cita → paciente → historia_clinica)
--     - paciente_id NUEVO FK directo al paciente (relacion es_sujeto_de)
--     - content: TEXT → BYTEA NOT NULL (cifrado AES-256-GCM)
CREATE TABLE entrada_hc (
    id              BIGSERIAL PRIMARY KEY,
    paciente_id     BIGINT  NOT NULL REFERENCES paciente(id) ON DELETE RESTRICT,
    cita_id         BIGINT  NOT NULL REFERENCES cita(id) ON DELETE RESTRICT,
    author_user_id  BIGINT  NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT,
    content         BYTEA   NOT NULL,                        -- Cifrado AES-256-GCM
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_entrada_hc_paciente ON entrada_hc(paciente_id);
CREATE INDEX idx_entrada_hc_cita     ON entrada_hc(cita_id);

-- 13. Tabla de Metadatos de Fotografias Medicas
--     Cambios respecto a V1:
--     - historia_clinica_id → entrada_hc_id (imagen asociada a entrada clinica, no a HC general)
--     - file_path: VARCHAR(255) → VARCHAR(500)
--     - description: VARCHAR(255) → VARCHAR(500)
CREATE TABLE imagen_hc (
    id                 BIGSERIAL PRIMARY KEY,
    entrada_hc_id      BIGINT       NOT NULL REFERENCES entrada_hc(id) ON DELETE CASCADE,
    file_path          VARCHAR(500) NOT NULL UNIQUE,
    original_filename  VARCHAR(255) NOT NULL,
    content_type       VARCHAR(50)  NOT NULL CHECK (content_type IN ('image/jpeg', 'image/png')),
    file_size          BIGINT       NOT NULL CHECK (file_size <= 10485760),  -- max 10 MB en bytes
    description        VARCHAR(500) NULL,
    uploaded_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_imagen_hc_entrada ON imagen_hc(entrada_hc_id);

-- 14. Tabla de Auditoria de Historia Clinica (inmutable)
--     Sin cambios estructurales respecto a V2; recreada por el DROP CASCADE de V4
CREATE TABLE historia_clinica_audit (
    id                  BIGSERIAL PRIMARY KEY,
    historia_clinica_id BIGINT        NOT NULL REFERENCES historia_clinica(id) ON DELETE CASCADE,
    modified_by_user_id BIGINT        NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT,
    modified_section    VARCHAR(100)  NOT NULL,
    previous_values     JSONB         NOT NULL,
    new_values          JSONB         NOT NULL,
    modified_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hc_audit_record ON historia_clinica_audit(historia_clinica_id);
CREATE INDEX idx_hc_audit_user   ON historia_clinica_audit(modified_by_user_id);
CREATE INDEX idx_hc_audit_date   ON historia_clinica_audit(modified_at);

-- 15. Tabla de Auditoria de Entradas Clinicas (inmutable)
--     Cambios respecto a V2:
--     - previous_content: TEXT → BYTEA (cifrado AES-256-GCM)
--     - new_content:      TEXT → BYTEA (cifrado AES-256-GCM)
CREATE TABLE entrada_hc_audit (
    id                  BIGSERIAL PRIMARY KEY,
    entrada_hc_id       BIGINT  NOT NULL REFERENCES entrada_hc(id) ON DELETE CASCADE,
    modified_by_user_id BIGINT  NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT,
    previous_content    BYTEA   NOT NULL,                    -- Cifrado AES-256-GCM
    new_content         BYTEA   NOT NULL,                    -- Cifrado AES-256-GCM
    modified_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_entrada_audit_entry ON entrada_hc_audit(entrada_hc_id);
CREATE INDEX idx_entrada_audit_user  ON entrada_hc_audit(modified_by_user_id);
CREATE INDEX idx_entrada_audit_date  ON entrada_hc_audit(modified_at);
