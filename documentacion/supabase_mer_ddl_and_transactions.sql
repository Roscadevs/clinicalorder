-- =====================================================================================
-- SUPABASE POSTGRESQL DDL & STRICT MER TRANSACTIONS SCRIPT (COMPATIBLE CON ESQUEMA EXISTENTE)
-- Sistema de Gestion Dermatologica y Estetica
-- Extension: pgcrypto (AES-256) | Seguridad: RLS Habilitado | ACID: PL/pgSQL
-- =====================================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─────────────────────────────────────────────────────────────────────────────────────
-- 1. DDL: ESQUEMA RELACIONAL Y RESTRICCIONES (CON RLS HABILITADO)
-- ─────────────────────────────────────────────────────────────────────────────────────

-- Entidad: USUARIO (Operadores de clinica: ADMIN, DOCTORA, SECRETARIA)
CREATE TABLE IF NOT EXISTS usuario (
    id                 BIGSERIAL PRIMARY KEY,
    username           VARCHAR(50)  NOT NULL UNIQUE,
    password_hash      VARCHAR(255) NOT NULL,
    email              VARCHAR(100) NOT NULL UNIQUE,
    full_name          VARCHAR(100) NOT NULL,
    role               VARCHAR(20)  NOT NULL CHECK (role IN ('ADMIN', 'DOCTORA', 'SECRETARIA')),
    active             BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
ALTER TABLE usuario ENABLE ROW LEVEL SECURITY;

-- Entidad: PASSWORD_RESET_TOKEN (Tokens temporales de recuperacion)
CREATE TABLE IF NOT EXISTS password_reset_token (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    token       VARCHAR(255) NOT NULL UNIQUE,
    used_at     TIMESTAMPTZ  NULL,
    expires_at  TIMESTAMPTZ  NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
ALTER TABLE password_reset_token ENABLE ROW LEVEL SECURITY;

-- Entidad: PACIENTE (Receptores de atencion dermatologica)
CREATE TABLE IF NOT EXISTS paciente (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL CHECK (length(name) BETWEEN 1 AND 100),
    dni         VARCHAR(8)   NOT NULL UNIQUE CHECK (dni ~ '^[0-9]{7,8}$'),
    phone       VARCHAR(20)  NOT NULL UNIQUE,
    email       VARCHAR(100) NOT NULL UNIQUE,
    birth_date  DATE         NOT NULL CHECK (birth_date <= CURRENT_DATE),
    active      BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_paciente_dni   ON paciente(dni);
CREATE INDEX IF NOT EXISTS idx_paciente_email ON paciente(email);
CREATE INDEX IF NOT EXISTS idx_paciente_name  ON paciente(name);
ALTER TABLE paciente ENABLE ROW LEVEL SECURITY;

-- Entidad: HISTORIA_CLINICA (1:1 estricto con Paciente, titular_de total y suryectiva)
CREATE TABLE IF NOT EXISTS historia_clinica (
    id                            BIGSERIAL PRIMARY KEY,
    paciente_id                   BIGINT       NOT NULL UNIQUE REFERENCES paciente(id) ON DELETE RESTRICT,
    created_by_user_id            BIGINT       NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT,
    fitzpatrick_phototype         INT          NOT NULL CHECK (fitzpatrick_phototype BETWEEN 1 AND 6),
    physical_examination          BYTEA        NULL, -- Cifrado AES-256 via pgcrypto
    informed_consent_signed       BOOLEAN      NOT NULL DEFAULT FALSE,
    gynecological_history         VARCHAR(500) NULL,
    surgical_history              VARCHAR(1000) NULL,
    current_medications           VARCHAR(1000) NULL,
    previous_aesthetic_treatments VARCHAR(1000) NULL,
    created_at                    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at                    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
ALTER TABLE historia_clinica ENABLE ROW LEVEL SECURITY;

-- Entidad debil: ALERGIA (PK compuesta segun modelo de datos: historia_clinica_id, tipo)
CREATE TABLE IF NOT EXISTS alergia (
    historia_clinica_id  BIGINT       NOT NULL REFERENCES historia_clinica(id) ON DELETE RESTRICT,
    tipo                 VARCHAR(100) NOT NULL,
    observaciones        VARCHAR(500) NULL,
    created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    PRIMARY KEY (historia_clinica_id, tipo)
);
ALTER TABLE alergia ENABLE ROW LEVEL SECURITY;

-- Entidad debil: ANTECEDENTE_PATOLOGICO (PK compuesta: historia_clinica_id, tipo)
CREATE TABLE IF NOT EXISTS antecedente_patologico (
    historia_clinica_id  BIGINT       NOT NULL REFERENCES historia_clinica(id) ON DELETE RESTRICT,
    tipo                 VARCHAR(100) NOT NULL,
    observaciones        VARCHAR(500) NULL,
    created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    PRIMARY KEY (historia_clinica_id, tipo)
);
ALTER TABLE antecedente_patologico ENABLE ROW LEVEL SECURITY;

-- Entidad debil: HABITO (PK compuesta: historia_clinica_id, tipo)
CREATE TABLE IF NOT EXISTS habito (
    historia_clinica_id  BIGINT       NOT NULL REFERENCES historia_clinica(id) ON DELETE RESTRICT,
    tipo                 VARCHAR(100) NOT NULL,
    observaciones        VARCHAR(500) NULL,
    created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    PRIMARY KEY (historia_clinica_id, tipo)
);
ALTER TABLE habito ENABLE ROW LEVEL SECURITY;

-- Entidad: SERVICIO (Catalogo clinico)
CREATE TABLE IF NOT EXISTS servicio (
    id                      BIGSERIAL PRIMARY KEY,
    name                    VARCHAR(100)   NOT NULL UNIQUE,
    description             VARCHAR(500)   NULL,
    duration_minutes        INT            NOT NULL CHECK (duration_minutes BETWEEN 10 AND 480),
    base_price              NUMERIC(12, 2) NOT NULL CHECK (base_price > 0),
    deposit_percentage      INT            NOT NULL CHECK (deposit_percentage BETWEEN 1 AND 100),
    follow_up_interval_days INT            NOT NULL DEFAULT 0 CHECK (follow_up_interval_days >= 0),
    active                  BOOLEAN        NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);
ALTER TABLE servicio ENABLE ROW LEVEL SECURITY;

-- Relacion N:M: DOCTOR_SERVICIO (Relacion 'brinda' Doctor -> Servicio, suryectiva desde Servicio)
CREATE TABLE IF NOT EXISTS doctor_servicio (
    doctor_id    BIGINT      NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT,
    servicio_id  BIGINT      NOT NULL REFERENCES servicio(id) ON DELETE RESTRICT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (doctor_id, servicio_id)
);
ALTER TABLE doctor_servicio ENABLE ROW LEVEL SECURITY;

-- Entidad: BLOQUEO_CALENDARIO (Periodos de indisponibilidad)
CREATE TABLE IF NOT EXISTS bloqueo_calendario (
    id                  BIGSERIAL PRIMARY KEY,
    created_by_user_id  BIGINT       NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT,
    start_time          TIMESTAMPTZ  NOT NULL,
    end_time            TIMESTAMPTZ  NOT NULL CHECK (end_time > start_time),
    reason              VARCHAR(255) NULL,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
ALTER TABLE bloqueo_calendario ENABLE ROW LEVEL SECURITY;

-- Entidad: CITA (Consultas programadas)
CREATE TABLE IF NOT EXISTS cita (
    id                  BIGSERIAL PRIMARY KEY,
    paciente_id         BIGINT         NOT NULL REFERENCES paciente(id) ON DELETE RESTRICT,
    servicio_id         BIGINT         NOT NULL REFERENCES servicio(id) ON DELETE RESTRICT,
    created_by_user_id  BIGINT         NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT,
    start_time          TIMESTAMPTZ    NOT NULL,
    end_time            TIMESTAMPTZ    NOT NULL CHECK (end_time > start_time),
    status              VARCHAR(30)    NOT NULL CHECK (status IN (
                            'PENDING_PAYMENT', 'CONFIRMED', 'CANCELED',
                            'COMPLETED', 'PAYMENT_FAILED', 'NO_SHOW')),
    agreed_price        NUMERIC(12, 2) NOT NULL CHECK (agreed_price > 0),
    follow_up_to_id     BIGINT         NULL UNIQUE REFERENCES cita(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- Asegurar columna doctor_id requerida para la relacion atiende (Doctor -> Cita)
-- Permite compatibilidad total si la tabla cita ya existia previamente sin esta columna
ALTER TABLE cita ADD COLUMN IF NOT EXISTS doctor_id BIGINT REFERENCES usuario(id) ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS idx_cita_range    ON cita(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_cita_status   ON cita(status);
CREATE INDEX IF NOT EXISTS idx_cita_paciente ON cita(paciente_id);
CREATE INDEX IF NOT EXISTS idx_cita_doctor   ON cita(doctor_id);
ALTER TABLE cita ENABLE ROW LEVEL SECURITY;

-- Entidad: TRANSACCION_PAGO (Transacciones asociadas a turnos)
CREATE TABLE IF NOT EXISTS transaccion_pago (
    id                    BIGSERIAL PRIMARY KEY,
    cita_id               BIGINT         NOT NULL REFERENCES cita(id) ON DELETE RESTRICT,
    mp_preference_id      VARCHAR(100)   NULL,
    mp_payment_id         VARCHAR(100)   NULL UNIQUE,
    payment_type          VARCHAR(20)    NOT NULL CHECK (payment_type IN ('MERCADOPAGO', 'CASH', 'BANK_TRANSFER')),
    payment_concept       VARCHAR(20)    NOT NULL DEFAULT 'DEPOSIT' CHECK (payment_concept IN ('DEPOSIT', 'BALANCE', 'FULL')),
    amount                NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    status                VARCHAR(20)    NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'REFUNDED')),
    registered_by_user_id BIGINT         NULL REFERENCES usuario(id) ON DELETE RESTRICT,
    payment_date          TIMESTAMPTZ    NULL,
    created_at            TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_transaccion_cita          ON transaccion_pago(cita_id);
CREATE INDEX IF NOT EXISTS idx_transaccion_preference_id ON transaccion_pago(mp_preference_id);
ALTER TABLE transaccion_pago ENABLE ROW LEVEL SECURITY;

-- Entidad: ENTRADA_HC (Evolucion clinica cifrada)
CREATE TABLE IF NOT EXISTS entrada_hc (
    id              BIGSERIAL PRIMARY KEY,
    paciente_id     BIGINT      NOT NULL REFERENCES paciente(id) ON DELETE RESTRICT,
    cita_id         BIGINT      NOT NULL REFERENCES cita(id) ON DELETE RESTRICT,
    author_user_id  BIGINT      NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT,
    content         BYTEA       NOT NULL, -- Cifrado AES-256 via pgcrypto
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_entrada_hc_paciente ON entrada_hc(paciente_id);
CREATE INDEX IF NOT EXISTS idx_entrada_hc_cita     ON entrada_hc(cita_id);
ALTER TABLE entrada_hc ENABLE ROW LEVEL SECURITY;

-- Entidad: IMAGEN_HC (Metadatos fotograficos)
CREATE TABLE IF NOT EXISTS imagen_hc (
    id                 BIGSERIAL PRIMARY KEY,
    entrada_hc_id      BIGINT       NOT NULL REFERENCES entrada_hc(id) ON DELETE CASCADE,
    file_path          VARCHAR(500) NOT NULL UNIQUE,
    original_filename  VARCHAR(255) NOT NULL,
    content_type       VARCHAR(50)  NOT NULL CHECK (content_type IN ('image/jpeg', 'image/png')),
    file_size          BIGINT       NOT NULL CHECK (file_size <= 10485760), -- Max 10MB
    description        VARCHAR(500) NULL,
    uploaded_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_imagen_hc_entrada ON imagen_hc(entrada_hc_id);
ALTER TABLE imagen_hc ENABLE ROW LEVEL SECURITY;

-- Entidad de Auditoria: HISTORIA_CLINICA_AUDIT (Historico inmutable)
CREATE TABLE IF NOT EXISTS historia_clinica_audit (
    id                  BIGSERIAL PRIMARY KEY,
    historia_clinica_id BIGINT       NOT NULL REFERENCES historia_clinica(id) ON DELETE CASCADE,
    modified_by_user_id BIGINT       NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT,
    modified_section    VARCHAR(100) NOT NULL,
    previous_values     JSONB        NOT NULL,
    new_values          JSONB        NOT NULL,
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_hc_audit_record ON historia_clinica_audit(historia_clinica_id);
CREATE INDEX IF NOT EXISTS idx_hc_audit_user   ON historia_clinica_audit(modified_by_user_id);
CREATE INDEX IF NOT EXISTS idx_hc_audit_date   ON historia_clinica_audit(updated_at);
ALTER TABLE historia_clinica_audit ENABLE ROW LEVEL SECURITY;

-- Entidad de Auditoria: ENTRADA_HC_AUDIT (Historico inmutable con contenido cifrado)
CREATE TABLE IF NOT EXISTS entrada_hc_audit (
    id                  BIGSERIAL PRIMARY KEY,
    entrada_hc_id       BIGINT      NOT NULL REFERENCES entrada_hc(id) ON DELETE CASCADE,
    modified_by_user_id BIGINT      NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT,
    previous_content    BYTEA       NOT NULL, -- Cifrado AES-256 via pgcrypto
    new_content         BYTEA       NOT NULL, -- Cifrado AES-256 via pgcrypto
    modified_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_entrada_audit_entry ON entrada_hc_audit(entrada_hc_id);
CREATE INDEX IF NOT EXISTS idx_entrada_audit_user  ON entrada_hc_audit(modified_by_user_id);
CREATE INDEX IF NOT EXISTS idx_entrada_audit_date  ON entrada_hc_audit(modified_at);
ALTER TABLE entrada_hc_audit ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────────────────────
-- 2. FUNCIONES TRANSACCIONALES PL/pgSQL CON RECURSIVIDAD Y CONTROL DE COLISION
-- ─────────────────────────────────────────────────────────────────────────────────────

-- Alta en USUARIO
CREATE OR REPLACE FUNCTION sp_alta_usuario(
    p_username VARCHAR(50),
    p_password_hash VARCHAR(255),
    p_email VARCHAR(100),
    p_full_name VARCHAR(100),
    p_role VARCHAR(20),
    p_active BOOLEAN DEFAULT TRUE
) RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id BIGINT;
BEGIN
    IF p_role NOT IN ('ADMIN', 'DOCTORA', 'SECRETARIA') THEN
        RAISE EXCEPTION 'Rol invalido: %. Permitidos: ADMIN, DOCTORA, SECRETARIA', p_role;
    END IF;

    INSERT INTO usuario (username, password_hash, email, full_name, role, active, created_at, updated_at)
    VALUES (p_username, p_password_hash, p_email, p_full_name, p_role, COALESCE(p_active, TRUE), NOW(), NOW())
    RETURNING id INTO v_user_id;

    RETURN v_user_id;
END;
$$;

-- Alta en DOCTOR (Especializacion de Usuario con rol 'DOCTORA')
CREATE OR REPLACE FUNCTION sp_alta_doctor(
    p_username VARCHAR(50),
    p_password_hash VARCHAR(255),
    p_email VARCHAR(100),
    p_full_name VARCHAR(100)
) RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN sp_alta_usuario(p_username, p_password_hash, p_email, p_full_name, 'DOCTORA', TRUE);
END;
$$;

-- Alta en HISTORIA_CLINICA (Con control de colision 1:1 y cifrado pgcrypto AES-256)
CREATE OR REPLACE FUNCTION sp_alta_historia_clinica(
    p_paciente_id BIGINT,
    p_created_by_user_id BIGINT,
    p_fitzpatrick_phototype INT,
    p_physical_examination_plain TEXT,
    p_informed_consent_signed BOOLEAN,
    p_gynecological_history VARCHAR(500),
    p_surgical_history VARCHAR(1000),
    p_current_medications VARCHAR(1000),
    p_previous_aesthetic_treatments VARCHAR(1000),
    p_secret_key TEXT
) RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_hc_id BIGINT;
    v_encrypted_exam BYTEA := NULL;
    v_user_role VARCHAR(20);
    v_existing_hc BIGINT;
BEGIN
    SELECT role INTO v_user_role FROM usuario WHERE id = p_created_by_user_id AND active = TRUE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario creador % no existe o esta inactivo', p_created_by_user_id;
    END IF;

    -- Control de colision 1:1 en titular_de
    SELECT id INTO v_existing_hc FROM historia_clinica WHERE paciente_id = p_paciente_id;
    IF v_existing_hc IS NOT NULL THEN
        RAISE EXCEPTION 'Colision 1:1 en titular_de: El paciente % ya posee la historia clinica %', p_paciente_id, v_existing_hc;
    END IF;

    IF p_physical_examination_plain IS NOT NULL AND length(trim(p_physical_examination_plain)) > 0 THEN
        IF p_secret_key IS NULL OR length(p_secret_key) = 0 THEN
            RAISE EXCEPTION 'Clave simetrica AES-256 requerida para cifrar examen fisico';
        END IF;
        v_encrypted_exam := pgp_sym_encrypt(p_physical_examination_plain, p_secret_key, 'cipher-algo=aes256');
    END IF;

    INSERT INTO historia_clinica (
        paciente_id, created_by_user_id, fitzpatrick_phototype, physical_examination,
        informed_consent_signed, gynecological_history, surgical_history,
        current_medications, previous_aesthetic_treatments, created_at, updated_at
    ) VALUES (
        p_paciente_id, p_created_by_user_id, p_fitzpatrick_phototype, v_encrypted_exam,
        COALESCE(p_informed_consent_signed, FALSE), p_gynecological_history, p_surgical_history,
        p_current_medications, p_previous_aesthetic_treatments, NOW(), NOW()
    ) RETURNING id INTO v_hc_id;

    RETURN v_hc_id;
END;
$$;

-- Alta en PACIENTE (Recursion transaccional: Alta automatica en Historia_Clinica por relacion saliente total titular_de 1:1)
CREATE OR REPLACE FUNCTION sp_alta_paciente(
    p_name VARCHAR(100),
    p_dni VARCHAR(8),
    p_phone VARCHAR(20),
    p_email VARCHAR(100),
    p_birth_date DATE,
    p_doctor_id BIGINT,
    p_secret_key TEXT,
    p_fitzpatrick_phototype INT DEFAULT 3,
    p_physical_examination_plain TEXT DEFAULT NULL
) RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_paciente_id BIGINT;
    v_hc_id BIGINT;
    v_doctor_exists BOOLEAN;
BEGIN
    SELECT EXISTS(SELECT 1 FROM usuario WHERE id = p_doctor_id AND role IN ('DOCTORA', 'ADMIN') AND active = TRUE)
    INTO v_doctor_exists;

    IF NOT v_doctor_exists THEN
        RAISE EXCEPTION 'Doctor responsable % no existe o no tiene permisos clinicos', p_doctor_id;
    END IF;

    -- Grabar tupla en Paciente
    INSERT INTO paciente (name, dni, phone, email, birth_date, active, created_at, updated_at)
    VALUES (p_name, p_dni, p_phone, p_email, p_birth_date, TRUE, NOW(), NOW())
    RETURNING id INTO v_paciente_id;

    -- Proceso recursivo titular_de (Paciente -> Historia_Clinica, Total, Suryectiva, 1:1)
    v_hc_id := sp_alta_historia_clinica(
        p_paciente_id => v_paciente_id,
        p_created_by_user_id => p_doctor_id,
        p_fitzpatrick_phototype => COALESCE(p_fitzpatrick_phototype, 3),
        p_physical_examination_plain => p_physical_examination_plain,
        p_informed_consent_signed => FALSE,
        p_gynecological_history => NULL,
        p_surgical_history => NULL,
        p_current_medications => NULL,
        p_previous_aesthetic_treatments => NULL,
        p_secret_key => p_secret_key
    );

    RETURN v_paciente_id;
END;
$$;

-- Alta en SERVICIO (Manejo recursivo de relacion entrante suryectiva 'brinda')
CREATE OR REPLACE FUNCTION sp_alta_servicio(
    p_name VARCHAR(100),
    p_description VARCHAR(500),
    p_duration_minutes INT,
    p_base_price NUMERIC(12, 2),
    p_deposit_percentage INT,
    p_follow_up_interval_days INT,
    p_doctor_id BIGINT DEFAULT NULL
) RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_servicio_id BIGINT;
    v_doctor_id BIGINT := p_doctor_id;
    v_doctor_exists BOOLEAN;
BEGIN
    INSERT INTO servicio (
        name, description, duration_minutes, base_price,
        deposit_percentage, follow_up_interval_days, active, created_at, updated_at
    ) VALUES (
        p_name, p_description, p_duration_minutes, p_base_price,
        p_deposit_percentage, COALESCE(p_follow_up_interval_days, 0), TRUE, NOW(), NOW()
    ) RETURNING id INTO v_servicio_id;

    -- Relacion entrante suryectiva 'brinda' (Doctor -> Servicio)
    IF v_doctor_id IS NOT NULL THEN
        SELECT EXISTS(SELECT 1 FROM usuario WHERE id = v_doctor_id AND role = 'DOCTORA' AND active = TRUE)
        INTO v_doctor_exists;
    ELSE
        v_doctor_exists := FALSE;
    END IF;

    IF NOT v_doctor_exists THEN
        SELECT id INTO v_doctor_id FROM usuario WHERE role = 'DOCTORA' AND active = TRUE LIMIT 1;
        IF v_doctor_id IS NULL THEN
            -- Recursion: crear Doctor si no existe ninguno
            v_doctor_id := sp_alta_doctor(
                'dra_default',
                '$2a$12$e9L9G4MlhLpI8dM1K0n7eO6cQxYz1Wk8bXyZvUt5mK0n7eO6cQxYz',
                'doctora_default@clinica.com',
                'Doctora General Planta'
            );
        END IF;
    END IF;

    INSERT INTO doctor_servicio (doctor_id, servicio_id, created_at)
    VALUES (v_doctor_id, v_servicio_id, NOW())
    ON CONFLICT (doctor_id, servicio_id) DO NOTHING;

    RETURN v_servicio_id;
END;
$$;

-- Alta en BLOQUEO_CALENDARIO (Relacion entrante suryectiva 'crea')
CREATE OR REPLACE FUNCTION sp_alta_bloqueo_calendario(
    p_created_by_user_id BIGINT,
    p_start_time TIMESTAMPTZ,
    p_end_time TIMESTAMPTZ,
    p_reason VARCHAR(255) DEFAULT NULL
) RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_bloqueo_id BIGINT;
BEGIN
    IF NOT EXISTS(SELECT 1 FROM usuario WHERE id = p_created_by_user_id AND active = TRUE) THEN
        RAISE EXCEPTION 'Usuario creador % inexistente', p_created_by_user_id;
    END IF;

    INSERT INTO bloqueo_calendario (created_by_user_id, start_time, end_time, reason, created_at)
    VALUES (p_created_by_user_id, p_start_time, p_end_time, p_reason, NOW())
    RETURNING id INTO v_bloqueo_id;

    RETURN v_bloqueo_id;
END;
$$;

-- Alta en CITA (Integridad de relaciones suryectivas: atiende, asiste_a, reserva, se_brinda_en)
CREATE OR REPLACE FUNCTION sp_alta_cita(
    p_paciente_id BIGINT,
    p_servicio_id BIGINT,
    p_created_by_user_id BIGINT,
    p_start_time TIMESTAMPTZ,
    p_end_time TIMESTAMPTZ,
    p_agreed_price NUMERIC(12, 2),
    p_doctor_id BIGINT DEFAULT NULL,
    p_follow_up_to_id BIGINT DEFAULT NULL
) RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_cita_id BIGINT;
    v_doctor_id BIGINT := p_doctor_id;
BEGIN
    IF NOT EXISTS(SELECT 1 FROM paciente WHERE id = p_paciente_id AND active = TRUE) THEN
        RAISE EXCEPTION 'Paciente % inexistente o inactivo', p_paciente_id;
    END IF;

    IF NOT EXISTS(SELECT 1 FROM servicio WHERE id = p_servicio_id AND active = TRUE) THEN
        RAISE EXCEPTION 'Servicio % inexistente o inactivo', p_servicio_id;
    END IF;

    IF NOT EXISTS(SELECT 1 FROM usuario WHERE id = p_created_by_user_id AND active = TRUE) THEN
        RAISE EXCEPTION 'Usuario creador % inexistente', p_created_by_user_id;
    END IF;

    -- Si se especifica doctor_id, verificar rol DOCTORA; si es nulo, asignar creador si es doctora o primer medico disponible
    IF v_doctor_id IS NOT NULL THEN
        IF NOT EXISTS(SELECT 1 FROM usuario WHERE id = v_doctor_id AND role = 'DOCTORA' AND active = TRUE) THEN
            RAISE EXCEPTION 'Doctor % inexistente o sin rol DOCTORA', v_doctor_id;
        END IF;
    ELSE
        SELECT id INTO v_doctor_id FROM usuario WHERE role = 'DOCTORA' AND active = TRUE LIMIT 1;
    END IF;

    IF p_follow_up_to_id IS NOT NULL THEN
        IF EXISTS(SELECT 1 FROM cita WHERE follow_up_to_id = p_follow_up_to_id) THEN
            RAISE EXCEPTION 'Cita origen % ya posee seguimiento vinculado', p_follow_up_to_id;
        END IF;
    END IF;

    INSERT INTO cita (
        paciente_id, servicio_id, doctor_id, created_by_user_id,
        start_time, end_time, status, agreed_price, follow_up_to_id, created_at, updated_at
    ) VALUES (
        p_paciente_id, p_servicio_id, v_doctor_id, p_created_by_user_id,
        p_start_time, p_end_time, 'PENDING_PAYMENT', p_agreed_price, p_follow_up_to_id, NOW(), NOW()
    ) RETURNING id INTO v_cita_id;

    RETURN v_cita_id;
END;
$$;

-- Alta en TRANSACCION_PAGO (Relaciones suryectivas desde Cita y Usuario)
CREATE OR REPLACE FUNCTION sp_alta_transaccion_pago(
    p_cita_id BIGINT,
    p_payment_type VARCHAR(20),
    p_payment_concept VARCHAR(20),
    p_amount NUMERIC(12, 2),
    p_status VARCHAR(20),
    p_registered_by_user_id BIGINT DEFAULT NULL,
    p_mp_preference_id VARCHAR(100) DEFAULT NULL,
    p_mp_payment_id VARCHAR(100) DEFAULT NULL
) RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_transaccion_id BIGINT;
    v_payment_date TIMESTAMPTZ := NULL;
BEGIN
    IF NOT EXISTS(SELECT 1 FROM cita WHERE id = p_cita_id) THEN
        RAISE EXCEPTION 'Cita % inexistente para asociar pago', p_cita_id;
    END IF;

    IF p_registered_by_user_id IS NOT NULL THEN
        IF NOT EXISTS(SELECT 1 FROM usuario WHERE id = p_registered_by_user_id AND active = TRUE) THEN
            RAISE EXCEPTION 'Usuario registrador % inexistente', p_registered_by_user_id;
        END IF;
    END IF;

    IF p_status = 'APPROVED' THEN
        v_payment_date := NOW();
    END IF;

    INSERT INTO transaccion_pago (
        cita_id, mp_preference_id, mp_payment_id, payment_type, payment_concept,
        amount, status, registered_by_user_id, payment_date, created_at
    ) VALUES (
        p_cita_id, p_mp_preference_id, p_mp_payment_id, p_payment_type, p_payment_concept,
        p_amount, p_status, p_registered_by_user_id, v_payment_date, NOW()
    ) RETURNING id INTO v_transaccion_id;

    IF p_status = 'APPROVED' AND p_payment_concept = 'DEPOSIT' THEN
        UPDATE cita SET status = 'CONFIRMED', updated_at = NOW() WHERE id = p_cita_id;
    END IF;

    RETURN v_transaccion_id;
END;
$$;

-- Alta en ALERGIA (Entidad debil con PK compuesta: retorna tipo)
CREATE OR REPLACE FUNCTION sp_alta_alergia(
    p_historia_clinica_id BIGINT,
    p_tipo VARCHAR(100),
    p_observaciones VARCHAR(500) DEFAULT NULL
) RETURNS VARCHAR
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM historia_clinica WHERE id = p_historia_clinica_id) THEN
        RAISE EXCEPTION 'Historia clinica % inexistente', p_historia_clinica_id;
    END IF;

    INSERT INTO alergia (historia_clinica_id, tipo, observaciones, created_at, updated_at)
    VALUES (p_historia_clinica_id, p_tipo, p_observaciones, NOW(), NOW())
    ON CONFLICT (historia_clinica_id, tipo) DO UPDATE
    SET observaciones = EXCLUDED.observaciones, updated_at = NOW();

    RETURN p_tipo;
END;
$$;

-- Alta en ANTECEDENTE_PATOLOGICO (Entidad debil con PK compuesta: retorna tipo)
CREATE OR REPLACE FUNCTION sp_alta_antecedente_patologico(
    p_historia_clinica_id BIGINT,
    p_tipo VARCHAR(100),
    p_observaciones VARCHAR(500) DEFAULT NULL
) RETURNS VARCHAR
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM historia_clinica WHERE id = p_historia_clinica_id) THEN
        RAISE EXCEPTION 'Historia clinica % inexistente', p_historia_clinica_id;
    END IF;

    INSERT INTO antecedente_patologico (historia_clinica_id, tipo, observaciones, created_at, updated_at)
    VALUES (p_historia_clinica_id, p_tipo, p_observaciones, NOW(), NOW())
    ON CONFLICT (historia_clinica_id, tipo) DO UPDATE
    SET observaciones = EXCLUDED.observaciones, updated_at = NOW();

    RETURN p_tipo;
END;
$$;

-- Alta en HABITO (Entidad debil con PK compuesta: retorna tipo)
CREATE OR REPLACE FUNCTION sp_alta_habito(
    p_historia_clinica_id BIGINT,
    p_tipo VARCHAR(100),
    p_observaciones VARCHAR(500) DEFAULT NULL
) RETURNS VARCHAR
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM historia_clinica WHERE id = p_historia_clinica_id) THEN
        RAISE EXCEPTION 'Historia clinica % inexistente', p_historia_clinica_id;
    END IF;

    INSERT INTO habito (historia_clinica_id, tipo, observaciones, created_at, updated_at)
    VALUES (p_historia_clinica_id, p_tipo, p_observaciones, NOW(), NOW())
    ON CONFLICT (historia_clinica_id, tipo) DO UPDATE
    SET observaciones = EXCLUDED.observaciones, updated_at = NOW();

    RETURN p_tipo;
END;
$$;

-- Alta en ENTRADA_HC (Cifrado AES-256 via pgcrypto, relaciones es_autor, pertenece, es_sujeto_de)
CREATE OR REPLACE FUNCTION sp_alta_entrada_hc(
    p_paciente_id BIGINT,
    p_cita_id BIGINT,
    p_author_user_id BIGINT,
    p_content_plain TEXT,
    p_secret_key TEXT
) RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_entrada_id BIGINT;
    v_encrypted_content BYTEA;
BEGIN
    IF NOT EXISTS(SELECT 1 FROM usuario WHERE id = p_author_user_id AND role IN ('DOCTORA', 'ADMIN') AND active = TRUE) THEN
        RAISE EXCEPTION 'Autor % sin autorizacion medica', p_author_user_id;
    END IF;

    IF NOT EXISTS(SELECT 1 FROM cita WHERE id = p_cita_id AND paciente_id = p_paciente_id) THEN
        RAISE EXCEPTION 'Cita % no vinculada al paciente %', p_cita_id, p_paciente_id;
    END IF;

    IF p_content_plain IS NULL OR length(trim(p_content_plain)) = 0 THEN
        RAISE EXCEPTION 'Contenido clinico no puede estar vacio';
    END IF;

    IF p_secret_key IS NULL OR length(p_secret_key) = 0 THEN
        RAISE EXCEPTION 'Clave simetrica requerida para cifrado AES-256';
    END IF;

    v_encrypted_content := pgp_sym_encrypt(p_content_plain, p_secret_key, 'cipher-algo=aes256');

    INSERT INTO entrada_hc (paciente_id, cita_id, author_user_id, content, created_at, updated_at)
    VALUES (p_paciente_id, p_cita_id, p_author_user_id, v_encrypted_content, NOW(), NOW())
    RETURNING id INTO v_entrada_id;

    RETURN v_entrada_id;
END;
$$;

-- Alta en IMAGEN_HC (Metadatos fotograficos, validacion MIME y tamano)
CREATE OR REPLACE FUNCTION sp_alta_imagen_hc(
    p_entrada_hc_id BIGINT,
    p_file_path VARCHAR(500),
    p_original_filename VARCHAR(255),
    p_content_type VARCHAR(50),
    p_file_size BIGINT,
    p_description VARCHAR(500) DEFAULT NULL
) RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_img_id BIGINT;
BEGIN
    IF NOT EXISTS(SELECT 1 FROM entrada_hc WHERE id = p_entrada_hc_id) THEN
        RAISE EXCEPTION 'Entrada clinica % inexistente', p_entrada_hc_id;
    END IF;

    IF p_content_type NOT IN ('image/jpeg', 'image/png') THEN
        RAISE EXCEPTION 'MIME invalido: %. Permitidos: image/jpeg, image/png', p_content_type;
    END IF;

    IF p_file_size > 10485760 THEN
        RAISE EXCEPTION 'Tamano supera maximo de 10 MB: % bytes', p_file_size;
    END IF;

    INSERT INTO imagen_hc (
        entrada_hc_id, file_path, original_filename, content_type,
        file_size, description, uploaded_at
    ) VALUES (
        p_entrada_hc_id, p_file_path, p_original_filename, p_content_type,
        p_file_size, p_description, NOW()
    ) RETURNING id INTO v_img_id;

    RETURN v_img_id;
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────────────
-- 3. TRIGGERS DE AUDITORIA HISTORICA INMUTABLE
-- ─────────────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION trg_audit_entrada_hc()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO entrada_hc_audit (
        entrada_hc_id, modified_by_user_id, previous_content, new_content, modified_at
    ) VALUES (
        OLD.id, NEW.author_user_id, OLD.content, NEW.content, NOW()
    );
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_entrada_hc_update_audit ON entrada_hc;
CREATE TRIGGER trg_entrada_hc_update_audit
    AFTER UPDATE OF content ON entrada_hc
    FOR EACH ROW
    WHEN (OLD.content IS DISTINCT FROM NEW.content)
    EXECUTE FUNCTION trg_audit_entrada_hc();

CREATE OR REPLACE FUNCTION trg_audit_historia_clinica()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO historia_clinica_audit (
        historia_clinica_id, modified_by_user_id, modified_section,
        previous_values, new_values, updated_at
    ) VALUES (
        OLD.id,
        NEW.created_by_user_id,
        'DATOS_GENERALES',
        jsonb_build_object(
            'fitzpatrick', OLD.fitzpatrick_phototype,
            'consentimiento', OLD.informed_consent_signed,
            'ginecologico', OLD.gynecological_history,
            'cirugia', OLD.surgical_history,
            'medicamentos', OLD.current_medications,
            'tratamientos_previos', OLD.previous_aesthetic_treatments
        ),
        jsonb_build_object(
            'fitzpatrick', NEW.fitzpatrick_phototype,
            'consentimiento', NEW.informed_consent_signed,
            'ginecologico', NEW.gynecological_history,
            'cirugia', NEW.surgical_history,
            'medicamentos', NEW.current_medications,
            'tratamientos_previos', NEW.previous_aesthetic_treatments
        ),
        NOW()
    );
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_historia_clinica_update_audit ON historia_clinica;
CREATE TRIGGER trg_historia_clinica_update_audit
    AFTER UPDATE ON historia_clinica
    FOR EACH ROW
    EXECUTE FUNCTION trg_audit_historia_clinica();
