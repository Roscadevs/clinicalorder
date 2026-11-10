-- =====================================================================================
-- MIGRACION FLYWAY V3: Adecuacion al Modelo Relacional (Pasaje al MR),
-- Stored Procedures de Transacciones de Alta y Triggers de Integridad/Auditoria
-- Base de datos: PostgreSQL 15+
--
-- Este script alinea el esquema fisico de PostgreSQL con el documento formal
-- "Pasaje al MR" y "Transacciones de alta de entidades":
--   1. Incorpora el atributo U-es-doctor en USUARIO y la tabla del subtipo ISA DOCTOR
--      (con U-nro_matricula).
--   2. Incorpora las tablas intermedias N:M BRINDA (doctor_servicio) y SE_BRINDA_EN
--      (cita <-> servicio).
--   3. Incorpora la clave foranea obligatoria HC-id-pertenece (historia_clinica_id)
--      en ENTRADA_HC (relacion saliente total 'pertenece').
--   4. Implementa todos los Stored Procedures (sp_alta_*) respetando exactamente las
--      subtransacciones de seleccion, control de colision 1:1 y procesos recursivos.
--   5. Implementa los Triggers para garantizar automaticamente:
--      - La relacion 1:1 Total y Suryectiva 'titular_de' al insertar un Paciente.
--      - El vinculo 'pertenece' (Entrada_HC -> Historia_Clinica) y 'se_brinda_en'.
--      - La auditoria historica automatica (invocando sp_alta_*_auditoria).
--      - La inmutabilidad de las tablas de auditoria (Ley 26.529).
-- =====================================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─────────────────────────────────────────────────────────────────────────────────────
-- PASO 1: ADECUACION ESTRUCTURAL AL PASAJE AL MODELO RELACIONAL (MR)
-- ─────────────────────────────────────────────────────────────────────────────────────

-- 1.1 Atributo discriminante U-es-doctor en USUARIO y tabla de subtipo ISA DOCTOR
ALTER TABLE usuario ADD COLUMN IF NOT EXISTS es_doctor BOOLEAN NOT NULL DEFAULT FALSE;
UPDATE usuario SET es_doctor = TRUE WHERE role = 'DOCTORA';

CREATE TABLE IF NOT EXISTS doctor (
    user_id        BIGINT                   PRIMARY KEY REFERENCES usuario(id) ON DELETE CASCADE,
    username       VARCHAR(50)              NOT NULL UNIQUE,
    nro_matricula  VARCHAR(50)              NOT NULL UNIQUE,
    created_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Poblar subtipo DOCTOR para las doctoras existentes en el seed (V2)
INSERT INTO doctor (user_id, username, nro_matricula)
SELECT u.id, u.username, 'MP-' || (10000 + u.id)::VARCHAR
FROM usuario u
WHERE u.role = 'DOCTORA'
ON CONFLICT (user_id) DO NOTHING;

-- 1.2 Tabla intermedia N:M BRINDA (Doctor -> Servicio, suryectiva en Servicio)
CREATE TABLE IF NOT EXISTS doctor_servicio (
    doctor_id    BIGINT                   NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT,
    servicio_id  BIGINT                   NOT NULL REFERENCES servicio(id) ON DELETE RESTRICT,
    created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    PRIMARY KEY (doctor_id, servicio_id)
);

-- Vista con el nombre exacto del Pasaje al MR: BRINDA(U-usuario, S-id)
-- Se define con security_invoker = true (PostgreSQL 15+) para evitar la alerta de SECURITY DEFINER en Supabase
CREATE OR REPLACE VIEW brinda
WITH (security_invoker = true) AS
SELECT u.username AS u_usuario, ds.servicio_id AS s_id, ds.doctor_id
FROM doctor_servicio ds
JOIN usuario u ON u.id = ds.doctor_id;

-- Garantizar suryectividad inicial de 'brinda' para todos los servicios del seed (V2)
INSERT INTO doctor_servicio (doctor_id, servicio_id)
SELECT d.user_id, s.id
FROM servicio s
CROSS JOIN (SELECT user_id FROM doctor ORDER BY user_id LIMIT 1) d
ON CONFLICT (doctor_id, servicio_id) DO NOTHING;

-- 1.3 Relacion 'atiende' (Doctor -> Cita) y tabla intermedia N:M SE_BRINDA_EN (Cita <-> Servicio)
ALTER TABLE cita ADD COLUMN IF NOT EXISTS doctor_id BIGINT NULL REFERENCES usuario(id) ON DELETE RESTRICT;
CREATE INDEX IF NOT EXISTS idx_cita_doctor ON cita(doctor_id);

UPDATE cita
SET doctor_id = (SELECT user_id FROM doctor ORDER BY user_id LIMIT 1)
WHERE doctor_id IS NULL;

CREATE TABLE IF NOT EXISTS se_brinda_en (
    cita_id      BIGINT NOT NULL REFERENCES cita(id) ON DELETE CASCADE,
    servicio_id  BIGINT NOT NULL REFERENCES servicio(id) ON DELETE RESTRICT,
    PRIMARY KEY (cita_id, servicio_id)
);

INSERT INTO se_brinda_en (cita_id, servicio_id)
SELECT id, servicio_id FROM cita
ON CONFLICT (cita_id, servicio_id) DO NOTHING;

-- 1.4 Garantizar relacion 1:1 Total y Suryectiva 'titular_de' para todos los pacientes del seed
INSERT INTO historia_clinica (
    paciente_id, created_by_user_id, fitzpatrick_phototype,
    informed_consent_signed, created_at, updated_at
)
SELECT p.id,
       COALESCE((SELECT user_id FROM doctor ORDER BY user_id LIMIT 1), 1),
       3,
       FALSE,
       NOW(),
       NOW()
FROM paciente p
WHERE NOT EXISTS (
    SELECT 1 FROM historia_clinica hc WHERE hc.paciente_id = p.id
);

-- 1.5 Relacion saliente Total 'pertenece' (ENTRADA_HC -> HISTORIA_CLINICA)
ALTER TABLE entrada_hc
    ADD COLUMN IF NOT EXISTS historia_clinica_id BIGINT NULL REFERENCES historia_clinica(id) ON DELETE RESTRICT;

UPDATE entrada_hc e
SET historia_clinica_id = hc.id
FROM historia_clinica hc
WHERE hc.paciente_id = e.paciente_id
  AND e.historia_clinica_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_entrada_hc_historia ON entrada_hc(historia_clinica_id);

-- =====================================================================================
-- PASO 2: STORED PROCEDURES DE TRANSACCIONES DE ALTA (SEGUN DOCUMENTO 'PASAJE AL MR')
-- =====================================================================================

-- Limpieza previa de firmas anteriores (evita ERROR 42P13 en Supabase si ya existian funciones previas)
DROP FUNCTION IF EXISTS sp_alta_usuario(VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, BOOLEAN) CASCADE;
DROP FUNCTION IF EXISTS sp_alta_usuario(VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, BOOLEAN, BOOLEAN) CASCADE;
DROP FUNCTION IF EXISTS sp_alta_doctor(VARCHAR, VARCHAR, VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS sp_alta_doctor(VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS sp_alta_historia_clinica(BIGINT, BIGINT, INT, TEXT, BOOLEAN, VARCHAR, VARCHAR, VARCHAR, VARCHAR, TEXT) CASCADE;
DROP FUNCTION IF EXISTS sp_alta_paciente(VARCHAR, VARCHAR, VARCHAR, VARCHAR, DATE, BIGINT, TEXT, INT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS sp_alta_paciente(VARCHAR, VARCHAR, VARCHAR, VARCHAR, DATE, BIGINT, TEXT, INT, TEXT, BIGINT) CASCADE;
DROP FUNCTION IF EXISTS sp_alta_servicio(VARCHAR, VARCHAR, INT, NUMERIC, INT, INT, BIGINT) CASCADE;
DROP FUNCTION IF EXISTS sp_alta_bloqueo_calendario(BIGINT, TIMESTAMPTZ, TIMESTAMPTZ, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS sp_alta_cita(BIGINT, BIGINT, BIGINT, TIMESTAMPTZ, TIMESTAMPTZ, NUMERIC, BIGINT, BIGINT) CASCADE;
DROP FUNCTION IF EXISTS sp_alta_transaccion_pago(BIGINT, VARCHAR, VARCHAR, NUMERIC, VARCHAR, BIGINT, VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS sp_alta_alergia(BIGINT, VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS sp_alta_antecedente_patologico(BIGINT, VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS sp_alta_habito(BIGINT, VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS sp_alta_entrada_hc(BIGINT, BIGINT, BIGINT, TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS sp_alta_entrada_hc(BIGINT, BIGINT, BIGINT, TEXT, TEXT, BIGINT) CASCADE;
DROP FUNCTION IF EXISTS sp_alta_entrada_hc_auditoria(BIGINT, BIGINT, BYTEA, BYTEA) CASCADE;
DROP FUNCTION IF EXISTS sp_alta_historia_clinica_auditoria(BIGINT, BIGINT, VARCHAR, JSONB, JSONB) CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────────────
-- 2.1 Ts Alta en USUARIO
--     Relaciones salientes (reserva, crea, registra) son no totales: no se disparan.
--     Relaciones entrantes (crea bloqueo, solicita token, registra pago) se generan
--     posteriormente cuando ocurre el evento.
-- ─────────────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION sp_alta_usuario(
    p_username VARCHAR(50),
    p_password_hash VARCHAR(255),
    p_email VARCHAR(100),
    p_full_name VARCHAR(100),
    p_role VARCHAR(20),
    p_active BOOLEAN DEFAULT TRUE,
    p_es_doctor BOOLEAN DEFAULT FALSE
) RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_id BIGINT;
    v_is_doc BOOLEAN := COALESCE(p_es_doctor, p_role = 'DOCTORA');
BEGIN
    IF p_role NOT IN ('ADMIN', 'DOCTORA', 'SECRETARIA') THEN
        RAISE EXCEPTION 'Rol invalido: %. Permitidos: ADMIN, DOCTORA, SECRETARIA', p_role;
    END IF;

    -- Inicio-ts: Grabar tupla en Usuario
    INSERT INTO usuario (username, password_hash, email, full_name, role, active, es_doctor, created_at, updated_at)
    VALUES (p_username, p_password_hash, p_email, p_full_name, p_role, COALESCE(p_active, TRUE), v_is_doc, NOW(), NOW())
    RETURNING id INTO v_user_id;
    -- fin-ts

    RETURN v_user_id;
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────────────
-- 2.2 Ts Alta en DOCTOR (Subtipo ISA de USUARIO)
--     Relaciones salientes (atiende, brinda, es_autor, figura_en, participa_en) son
--     todas no totales: no hay relaciones salientes totales que disparar.
-- ─────────────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION sp_alta_doctor(
    p_username VARCHAR(50),
    p_password_hash VARCHAR(255),
    p_email VARCHAR(100),
    p_full_name VARCHAR(100),
    p_nro_matricula VARCHAR(50) DEFAULT NULL
) RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_id BIGINT;
    v_matricula VARCHAR(50);
BEGIN
    -- Inicio-ts:
    -- 1. Alta en superclase USUARIO (ISA)
    SELECT id INTO v_user_id FROM usuario WHERE username = p_username;
    IF v_user_id IS NULL THEN
        v_user_id := sp_alta_usuario(p_username, p_password_hash, p_email, p_full_name, 'DOCTORA', TRUE, TRUE);
    ELSE
        UPDATE usuario SET role = 'DOCTORA', es_doctor = TRUE, updated_at = NOW() WHERE id = v_user_id;
    END IF;

    v_matricula := COALESCE(NULLIF(trim(p_nro_matricula), ''), 'MP-' || (10000 + v_user_id)::VARCHAR);

    -- 2. Grabar tupla en Doctor (U-usuario, U-nro_matricula)
    INSERT INTO doctor (user_id, username, nro_matricula, created_at)
    VALUES (v_user_id, p_username, v_matricula, NOW())
    ON CONFLICT (user_id) DO UPDATE SET nro_matricula = EXCLUDED.nro_matricula;
    -- fin-ts

    RETURN v_user_id;
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────────────
-- 2.3 Ts Alta en HISTORIA_CLINICA
--     Relaciones entrantes suryectivas:
--       - titular_de desde Paciente (1:1, Total, Suryectiva) -> Control de colision 1:1
--       - es_autor / crea desde Doctor (1:N, No total, Suryectiva)
-- ─────────────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION sp_alta_historia_clinica(
    p_paciente_id BIGINT,
    p_created_by_user_id BIGINT,
    p_fitzpatrick_phototype INT,
    p_physical_examination_plain TEXT DEFAULT NULL,
    p_informed_consent_signed BOOLEAN DEFAULT FALSE,
    p_gynecological_history VARCHAR(500) DEFAULT NULL,
    p_surgical_history VARCHAR(1000) DEFAULT NULL,
    p_current_medications VARCHAR(1000) DEFAULT NULL,
    p_previous_aesthetic_treatments VARCHAR(1000) DEFAULT NULL,
    p_secret_key TEXT DEFAULT NULL
) RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_hc_id BIGINT;
    v_encrypted_exam BYTEA := NULL;
    v_existing_hc BIGINT;
BEGIN
    -- Inicio-ts

    -- ❖ Ts Seleccionar el elemento p en Paciente segun titular_de entrante:
    --   Buscar p en Paciente -> Si p no existe: Falla / Aborta
    IF NOT EXISTS (SELECT 1 FROM paciente WHERE id = p_paciente_id) THEN
        RAISE EXCEPTION 'Falla en titular_de: El paciente % no existe', p_paciente_id;
    END IF;

    --   Sino (p existe): (1:1) Verificar que p no esta vinculado a ningun elemento de Historia_clinica
    SELECT id INTO v_existing_hc FROM historia_clinica WHERE paciente_id = p_paciente_id;
    IF v_existing_hc IS NOT NULL THEN
        -- » Si (ya tiene HC): Falla / Aborta la transaccion
        RAISE EXCEPTION 'Colision 1:1 en titular_de: El paciente % ya esta vinculado a la historia clinica %', p_paciente_id, v_existing_hc;
    END IF;
    -- » No (esta libre): Ok

    -- ❖ Ts Seleccionar el elemento d en Doctor segun es_autor / crea entrante:
    --   Buscar d en Doctor -> Si d no existe: Falla / Aborta
    IF NOT EXISTS (
        SELECT 1 FROM usuario u
        LEFT JOIN doctor d ON d.user_id = u.id
        WHERE u.id = p_created_by_user_id
          AND u.active = TRUE
          AND (d.user_id IS NOT NULL OR u.role IN ('DOCTORA', 'ADMIN'))
    ) THEN
        RAISE EXCEPTION 'Falla en es_autor: El doctor/profesional % no existe o esta inactivo', p_created_by_user_id;
    END IF;

    -- Cifrado opcional de examen fisico si se provee texto en claro
    IF p_physical_examination_plain IS NOT NULL AND length(trim(p_physical_examination_plain)) > 0 THEN
        IF p_secret_key IS NULL OR length(p_secret_key) = 0 THEN
            RAISE EXCEPTION 'Clave simetrica AES-256 requerida para cifrar examen fisico';
        END IF;
        v_encrypted_exam := pgp_sym_encrypt(p_physical_examination_plain, p_secret_key, 'cipher-algo=aes256');
    END IF;

    -- Grabar tupla en Historia_clinica junto con las n-uplas (p, h) en titular_de y (d, h) en es_autor
    INSERT INTO historia_clinica (
        paciente_id, created_by_user_id, fitzpatrick_phototype, physical_examination,
        informed_consent_signed, gynecological_history, surgical_history,
        current_medications, previous_aesthetic_treatments, created_at, updated_at
    ) VALUES (
        p_paciente_id, p_created_by_user_id, COALESCE(p_fitzpatrick_phototype, 3), v_encrypted_exam,
        COALESCE(p_informed_consent_signed, FALSE), p_gynecological_history, p_surgical_history,
        p_current_medications, p_previous_aesthetic_treatments, NOW(), NOW()
    ) RETURNING id INTO v_hc_id;

    -- fin-ts
    RETURN v_hc_id;
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────────────
-- 2.4 Ts Alta en PACIENTE
--     Relacion saliente total: titular_de (Paciente -> Historia_clinica, 1:1, Total, Suryectiva)
--     - Si h no existe -> Alta en Historia_clinica ¡proceso recursivo!
--     - Sino (h existe) -> (1:1) Verificar que h no este vinculado a otro Paciente.
-- ─────────────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION sp_alta_paciente(
    p_name VARCHAR(100),
    p_dni VARCHAR(8),
    p_phone VARCHAR(20),
    p_email VARCHAR(100),
    p_birth_date DATE,
    p_doctor_id BIGINT DEFAULT NULL,
    p_secret_key TEXT DEFAULT NULL,
    p_fitzpatrick_phototype INT DEFAULT 3,
    p_physical_examination_plain TEXT DEFAULT NULL,
    p_historia_clinica_id BIGINT DEFAULT NULL
) RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_paciente_id BIGINT;
    v_hc_id BIGINT;
    v_hc_paciente_id BIGINT;
    v_doc_id BIGINT := p_doctor_id;
BEGIN
    IF v_doc_id IS NULL THEN
        SELECT user_id INTO v_doc_id FROM doctor ORDER BY user_id LIMIT 1;
    END IF;

    -- Inicio-ts
    -- 1. Grabar tupla en Paciente
    INSERT INTO paciente (name, dni, phone, email, birth_date, active, created_at, updated_at)
    VALUES (p_name, p_dni, p_phone, p_email, p_birth_date, TRUE, NOW(), NOW())
    RETURNING id INTO v_paciente_id;

    -- 2. Ts Generar la n-upla en titular_de -> Ts Seleccionar el elemento h en Historia_clinica
    IF p_historia_clinica_id IS NOT NULL THEN
        SELECT id, paciente_id INTO v_hc_id, v_hc_paciente_id
        FROM historia_clinica
        WHERE id = p_historia_clinica_id;
    ELSE
        SELECT id, paciente_id INTO v_hc_id, v_hc_paciente_id
        FROM historia_clinica
        WHERE paciente_id = v_paciente_id;
    END IF;

    IF v_hc_id IS NULL THEN
        -- Si h no existe: Alta en Historia_clinica ¡proceso recursivo!
        v_hc_id := sp_alta_historia_clinica(
            p_paciente_id => v_paciente_id,
            p_created_by_user_id => v_doc_id,
            p_fitzpatrick_phototype => COALESCE(p_fitzpatrick_phototype, 3),
            p_physical_examination_plain => p_physical_examination_plain,
            p_informed_consent_signed => FALSE,
            p_gynecological_history => NULL,
            p_surgical_history => NULL,
            p_current_medications => NULL,
            p_previous_aesthetic_treatments => NULL,
            p_secret_key => p_secret_key
        );
    ELSE
        -- Sino (h existe): (1:1) Verificar que h no esta vinculado a ningun otro elemento de Paciente
        IF v_hc_paciente_id IS NOT NULL AND v_hc_paciente_id <> v_paciente_id THEN
            -- » Si: falla
            RAISE EXCEPTION 'Colision 1:1 en titular_de: La historia clinica % ya pertenece al paciente %', v_hc_id, v_hc_paciente_id;
        END IF;
        -- » No: Ok -> Grabar la n-upla (p, h) en titular_de
        UPDATE historia_clinica SET paciente_id = v_paciente_id, updated_at = NOW() WHERE id = v_hc_id;
    END IF;
    -- fin-ts

    RETURN v_paciente_id;
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────────────
-- 2.5 Ts Alta en SERVICIO
--     Relacion entrante suryectiva: brinda (N:M) (Doctor -> Servicio)
--     - Buscar d en Doctor -> Si d no existe: Falla / Aborta la transaccion
--     - Sino: (N:M) Grabar la n-upla (d, s) en brinda (doctor_servicio)
-- ─────────────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION sp_alta_servicio(
    p_name VARCHAR(100),
    p_description VARCHAR(500),
    p_duration_minutes INT,
    p_base_price NUMERIC(12, 2),
    p_deposit_percentage INT,
    p_follow_up_interval_days INT,
    p_doctor_id BIGINT
) RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_servicio_id BIGINT;
BEGIN
    -- Inicio-ts
    -- 1. Grabar tupla en Servicio
    INSERT INTO servicio (
        name, description, duration_minutes, base_price,
        deposit_percentage, follow_up_interval_days, active, created_at, updated_at
    ) VALUES (
        p_name, p_description, p_duration_minutes, p_base_price,
        p_deposit_percentage, COALESCE(p_follow_up_interval_days, 0), TRUE, NOW(), NOW()
    ) RETURNING id INTO v_servicio_id;

    -- 2. Por brinda (relacion entrante suryectiva):
    --    Ts Seleccionar el elemento d en Doctor segun brinda entrante
    IF p_doctor_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM usuario u
        LEFT JOIN doctor d ON d.user_id = u.id
        WHERE u.id = p_doctor_id AND u.active = TRUE AND (d.user_id IS NOT NULL OR u.role = 'DOCTORA')
    ) THEN
        -- Si d no existe: Falla / Aborta la transaccion
        RAISE EXCEPTION 'Falla en brinda: El doctor % no existe en Doctor', p_doctor_id;
    END IF;

    -- Sino: (N:M) un doctor puede brindar varios servicios -> Grabar la n-upla (d, s) en brinda
    INSERT INTO doctor_servicio (doctor_id, servicio_id, created_at)
    VALUES (p_doctor_id, v_servicio_id, NOW())
    ON CONFLICT (doctor_id, servicio_id) DO NOTHING;
    -- fin-ts

    RETURN v_servicio_id;
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────────────
-- 2.6 Ts Alta en CITA
--     Relaciones entrantes suryectivas:
--       - atiende desde Doctor (1:N)
--       - asiste_a desde Paciente (1:N)
--       - reserva desde Usuario (1:N)
--       - se_brinda_en desde Servicio (N:M)
-- ─────────────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION sp_alta_cita(
    p_paciente_id BIGINT,
    p_servicio_id BIGINT,
    p_created_by_user_id BIGINT,
    p_start_time TIMESTAMP WITH TIME ZONE,
    p_end_time TIMESTAMP WITH TIME ZONE,
    p_agreed_price NUMERIC(12, 2),
    p_doctor_id BIGINT,
    p_follow_up_to_id BIGINT DEFAULT NULL
) RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_cita_id BIGINT;
BEGIN
    -- Inicio-ts

    -- ❖ Ts Seleccionar el elemento d en Doctor segun atiende entrante
    IF p_doctor_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM usuario u
        LEFT JOIN doctor d ON d.user_id = u.id
        WHERE u.id = p_doctor_id AND u.active = TRUE AND (d.user_id IS NOT NULL OR u.role = 'DOCTORA')
    ) THEN
        RAISE EXCEPTION 'Falla en atiende: El doctor % no existe', p_doctor_id;
    END IF;

    -- ❖ Ts Seleccionar el elemento p en Paciente segun asiste_a entrante
    IF p_paciente_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM paciente WHERE id = p_paciente_id AND active = TRUE
    ) THEN
        RAISE EXCEPTION 'Falla en asiste_a: El paciente % no existe o esta inactivo', p_paciente_id;
    END IF;

    -- ❖ Ts Seleccionar el elemento u en Usuario segun reserva entrante
    IF p_created_by_user_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM usuario WHERE id = p_created_by_user_id AND active = TRUE
    ) THEN
        RAISE EXCEPTION 'Falla en reserva: El usuario % no existe o esta inactivo', p_created_by_user_id;
    END IF;

    -- ❖ Ts Seleccionar el elemento s en Servicio segun se_brinda_en entrante
    IF p_servicio_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM servicio WHERE id = p_servicio_id AND active = TRUE
    ) THEN
        RAISE EXCEPTION 'Falla en se_brinda_en: El servicio % no existe o esta inactivo', p_servicio_id;
    END IF;

    -- Relacion recursiva opcional 'programa' (1:N, no total, no suryectiva)
    IF p_follow_up_to_id IS NOT NULL THEN
        IF NOT EXISTS (SELECT 1 FROM cita WHERE id = p_follow_up_to_id) THEN
            RAISE EXCEPTION 'Falla en programa: La cita origen % no existe', p_follow_up_to_id;
        END IF;
        IF EXISTS (SELECT 1 FROM cita WHERE follow_up_to_id = p_follow_up_to_id) THEN
            RAISE EXCEPTION 'Colision en programa: La cita origen % ya posee seguimiento vinculado', p_follow_up_to_id;
        END IF;
    END IF;

    -- Grabar tupla en Cita y las n-uplas (d, c) en atiende, (p, c) en asiste_a y (u, c) en reserva
    INSERT INTO cita (
        paciente_id, servicio_id, doctor_id, created_by_user_id,
        start_time, end_time, status, agreed_price, follow_up_to_id, created_at, updated_at
    ) VALUES (
        p_paciente_id, p_servicio_id, p_doctor_id, p_created_by_user_id,
        p_start_time, p_end_time, 'PENDING_PAYMENT', p_agreed_price, p_follow_up_to_id, NOW(), NOW()
    ) RETURNING id INTO v_cita_id;

    -- Grabar la n-upla (s, c) en se_brinda_en
    INSERT INTO se_brinda_en (cita_id, servicio_id)
    VALUES (v_cita_id, p_servicio_id)
    ON CONFLICT (cita_id, servicio_id) DO NOTHING;

    -- fin-ts
    RETURN v_cita_id;
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────────────
-- 2.7 Ts Alta en TRANSACCION_PAGO
--     Relaciones entrantes suryectivas:
--       - tiene_asociada (Cita -> Transaccion_pago)
--       - registra (Usuario -> Transaccion_pago)
-- ─────────────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION sp_alta_transaccion_pago(
    p_cita_id BIGINT,
    p_payment_type VARCHAR(20),
    p_payment_concept VARCHAR(20),
    p_amount NUMERIC(12, 2),
    p_status VARCHAR(20),
    p_registered_by_user_id BIGINT,
    p_mp_preference_id VARCHAR(100) DEFAULT NULL,
    p_mp_payment_id VARCHAR(100) DEFAULT NULL
) RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_transaccion_id BIGINT;
    v_payment_date TIMESTAMP WITH TIME ZONE := NULL;
BEGIN
    -- Inicio-ts

    -- ❖ Ts Generar la n-upla en tiene_asociada: Seleccionar c en Cita
    IF p_cita_id IS NULL OR NOT EXISTS (SELECT 1 FROM cita WHERE id = p_cita_id) THEN
        RAISE EXCEPTION 'Falla en tiene_asociada: La cita % no existe', p_cita_id;
    END IF;

    -- ❖ Ts Generar la n-upla en registra: Seleccionar u en Usuario
    IF p_registered_by_user_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM usuario WHERE id = p_registered_by_user_id AND active = TRUE
    ) THEN
        RAISE EXCEPTION 'Falla en registra: El usuario % no existe o esta inactivo', p_registered_by_user_id;
    END IF;

    IF p_status = 'APPROVED' THEN
        v_payment_date := NOW();
    END IF;

    -- Grabar tupla en Transaccion_pago y las n-uplas (c, p) en tiene_asociada y (u, p) en registra
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

    -- fin-ts
    RETURN v_transaccion_id;
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────────────
-- 2.8 Ts Alta en BLOQUEO_CALENDARIO
--     Relacion entrante suryectiva: crea (Usuario -> Bloqueo_calendario)
-- ─────────────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION sp_alta_bloqueo_calendario(
    p_created_by_user_id BIGINT,
    p_start_time TIMESTAMP WITH TIME ZONE,
    p_end_time TIMESTAMP WITH TIME ZONE,
    p_reason VARCHAR(255) DEFAULT NULL
) RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_bloqueo_id BIGINT;
BEGIN
    -- Inicio-ts
    -- ❖ Ts Generar la n-upla en crea: Seleccionar u en Usuario
    IF p_created_by_user_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM usuario WHERE id = p_created_by_user_id AND active = TRUE
    ) THEN
        RAISE EXCEPTION 'Falla en crea: El usuario % no existe o esta inactivo', p_created_by_user_id;
    END IF;

    -- Grabar tupla en Bloqueo_calendario y la n-upla (u, b) en crea
    INSERT INTO bloqueo_calendario (created_by_user_id, start_time, end_time, reason, created_at)
    VALUES (p_created_by_user_id, p_start_time, p_end_time, p_reason, NOW())
    RETURNING id INTO v_bloqueo_id;
    -- fin-ts

    RETURN v_bloqueo_id;
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────────────
-- 2.9 Ts Alta en ALERGIA, ANTECEDENTE_PATOLOGICO y HABITO (Entidades Debiles)
--     Relacion entrante suryectiva identificadora: detalla desde Historia_clinica
-- ─────────────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION sp_alta_alergia(
    p_historia_clinica_id BIGINT,
    p_tipo VARCHAR(100),
    p_observaciones VARCHAR(500) DEFAULT NULL
) RETURNS VARCHAR
LANGUAGE plpgsql
AS $$
BEGIN
    -- Inicio-ts
    -- ❖ Ts Generar la n-upla en detalla: Seleccionar h en Historia_clinica
    IF p_historia_clinica_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM historia_clinica WHERE id = p_historia_clinica_id
    ) THEN
        RAISE EXCEPTION 'Falla en detalla: La historia clinica % no existe', p_historia_clinica_id;
    END IF;

    -- Grabar tupla en Alergia y la n-upla (h, a)
    INSERT INTO alergia (historia_clinica_id, tipo, observaciones, created_at, updated_at)
    VALUES (p_historia_clinica_id, p_tipo, p_observaciones, NOW(), NOW());
    -- fin-ts

    RETURN p_tipo;
END;
$$;

CREATE OR REPLACE FUNCTION sp_alta_antecedente_patologico(
    p_historia_clinica_id BIGINT,
    p_tipo VARCHAR(100),
    p_observaciones VARCHAR(500) DEFAULT NULL
) RETURNS VARCHAR
LANGUAGE plpgsql
AS $$
BEGIN
    -- Inicio-ts
    -- ❖ Ts Generar la n-upla en detalla: Seleccionar h en Historia_clinica
    IF p_historia_clinica_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM historia_clinica WHERE id = p_historia_clinica_id
    ) THEN
        RAISE EXCEPTION 'Falla en detalla: La historia clinica % no existe', p_historia_clinica_id;
    END IF;

    -- Grabar tupla en Antecedente_patologico y la n-upla (h, ap)
    INSERT INTO antecedente_patologico (historia_clinica_id, tipo, observaciones, created_at, updated_at)
    VALUES (p_historia_clinica_id, p_tipo, p_observaciones, NOW(), NOW());
    -- fin-ts

    RETURN p_tipo;
END;
$$;

CREATE OR REPLACE FUNCTION sp_alta_habito(
    p_historia_clinica_id BIGINT,
    p_tipo VARCHAR(100),
    p_observaciones VARCHAR(500) DEFAULT NULL
) RETURNS VARCHAR
LANGUAGE plpgsql
AS $$
BEGIN
    -- Inicio-ts
    -- ❖ Ts Generar la n-upla en detalla: Seleccionar h en Historia_clinica
    IF p_historia_clinica_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM historia_clinica WHERE id = p_historia_clinica_id
    ) THEN
        RAISE EXCEPTION 'Falla en detalla: La historia clinica % no existe', p_historia_clinica_id;
    END IF;

    -- Grabar tupla en Habito y la n-upla (h, hbt)
    INSERT INTO habito (historia_clinica_id, tipo, observaciones, created_at, updated_at)
    VALUES (p_historia_clinica_id, p_tipo, p_observaciones, NOW(), NOW());
    -- fin-ts

    RETURN p_tipo;
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────────────
-- 2.10 Ts Alta en ENTRADA_HC
--      - Por pertenece (saliente total hacia Historia_clinica): Buscar h -> Si no existe: Falla/Aborta
--      - Por es_autor (entrante suryectiva desde Doctor): Buscar d -> Si no existe: Falla/Aborta
--      - Por es_sujeto_de (entrante suryectiva desde Paciente): Buscar p -> Si no existe: Falla/Aborta
--      - Por crea (entrante suryectiva desde Cita): Buscar c -> Si no existe: Falla/Aborta
-- ─────────────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION sp_alta_entrada_hc(
    p_paciente_id BIGINT,
    p_cita_id BIGINT,
    p_author_user_id BIGINT,
    p_content_plain TEXT,
    p_secret_key TEXT,
    p_historia_clinica_id BIGINT DEFAULT NULL
) RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_entrada_id BIGINT;
    v_hc_id BIGINT := p_historia_clinica_id;
    v_encrypted_content BYTEA;
BEGIN
    -- Inicio-ts

    -- ❖ Ts Seleccionar el elemento p en Paciente segun es_sujeto_de entrante
    IF p_paciente_id IS NULL OR NOT EXISTS (SELECT 1 FROM paciente WHERE id = p_paciente_id) THEN
        RAISE EXCEPTION 'Falla en es_sujeto_de: El paciente % no existe', p_paciente_id;
    END IF;

    -- ❖ Ts Seleccionar el elemento h en Historia_clinica segun pertenece saliente
    IF v_hc_id IS NULL THEN
        SELECT id INTO v_hc_id FROM historia_clinica WHERE paciente_id = p_paciente_id;
    ELSE
        SELECT id INTO v_hc_id FROM historia_clinica WHERE id = v_hc_id AND paciente_id = p_paciente_id;
    END IF;

    IF v_hc_id IS NULL THEN
        RAISE EXCEPTION 'Falla en pertenece: La historia clinica asociada al paciente % no existe', p_paciente_id;
    END IF;

    -- ❖ Ts Seleccionar el elemento d en Doctor segun es_autor entrante
    IF p_author_user_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM usuario u
        LEFT JOIN doctor d ON d.user_id = u.id
        WHERE u.id = p_author_user_id AND u.active = TRUE AND (d.user_id IS NOT NULL OR u.role IN ('DOCTORA', 'ADMIN'))
    ) THEN
        RAISE EXCEPTION 'Falla en es_autor: El doctor % no existe o no esta autorizado', p_author_user_id;
    END IF;

    -- ❖ Ts Seleccionar el elemento c en Cita segun crea entrante
    IF p_cita_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM cita WHERE id = p_cita_id AND paciente_id = p_paciente_id
    ) THEN
        RAISE EXCEPTION 'Falla en crea: La cita % no existe o no corresponde al paciente %', p_cita_id, p_paciente_id;
    END IF;

    IF p_content_plain IS NULL OR length(trim(p_content_plain)) = 0 THEN
        RAISE EXCEPTION 'Contenido clinico no puede estar vacio';
    END IF;

    IF p_secret_key IS NULL OR length(p_secret_key) = 0 THEN
        RAISE EXCEPTION 'Clave simetrica requerida para cifrado AES-256';
    END IF;

    v_encrypted_content := pgp_sym_encrypt(p_content_plain, p_secret_key, 'cipher-algo=aes256');

    -- Grabar tupla en Entrada_hc junto con (e, h) en pertenece, (d, e) en es_autor, (p, e) en es_sujeto_de y (c, e) en crea
    INSERT INTO entrada_hc (
        paciente_id, cita_id, author_user_id, historia_clinica_id, content, created_at, updated_at
    ) VALUES (
        p_paciente_id, p_cita_id, p_author_user_id, v_hc_id, v_encrypted_content, NOW(), NOW()
    ) RETURNING id INTO v_entrada_id;

    -- fin-ts
    RETURN v_entrada_id;
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────────────
-- 2.11 Ts Alta en ENTRADA_HC_AUDITORIA y Ts Alta en HISTORIA_CLINICA_AUDITORIA
--      - Por es_auditada (entrante suryectiva desde Entrada_hc / Historia_clinica)
--      - Por figura_en / participa_en (entrante suryectiva desde Doctor)
-- ─────────────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION sp_alta_entrada_hc_auditoria(
    p_entrada_hc_id BIGINT,
    p_modified_by_user_id BIGINT,
    p_previous_content BYTEA,
    p_new_content BYTEA
) RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_audit_id BIGINT;
BEGIN
    -- Inicio-ts
    -- ❖ Ts Seleccionar el elemento e en Entrada_hc segun es_auditada entrante
    IF p_entrada_hc_id IS NULL OR NOT EXISTS (SELECT 1 FROM entrada_hc WHERE id = p_entrada_hc_id) THEN
        RAISE EXCEPTION 'Falla en es_auditada: La entrada clinica % no existe', p_entrada_hc_id;
    END IF;

    -- ❖ Ts Seleccionar el elemento d en Doctor segun figura_en entrante
    IF p_modified_by_user_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM usuario u
        LEFT JOIN doctor d ON d.user_id = u.id
        WHERE u.id = p_modified_by_user_id AND (d.user_id IS NOT NULL OR u.role IN ('DOCTORA', 'ADMIN'))
    ) THEN
        RAISE EXCEPTION 'Falla en figura_en: El doctor % no existe', p_modified_by_user_id;
    END IF;

    -- Grabar tupla en Entrada_hc_auditoria y las n-uplas (e, ea) y (d, ea)
    INSERT INTO entrada_hc_audit (
        entrada_hc_id, modified_by_user_id, previous_content, new_content, modified_at
    ) VALUES (
        p_entrada_hc_id, p_modified_by_user_id, p_previous_content, p_new_content, NOW()
    ) RETURNING id INTO v_audit_id;
    -- fin-ts

    RETURN v_audit_id;
END;
$$;

CREATE OR REPLACE FUNCTION sp_alta_historia_clinica_auditoria(
    p_historia_clinica_id BIGINT,
    p_modified_by_user_id BIGINT,
    p_modified_section VARCHAR(100),
    p_previous_values JSONB,
    p_new_values JSONB
) RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_audit_id BIGINT;
BEGIN
    -- Inicio-ts
    -- ❖ Ts Seleccionar el elemento h en Historia_clinica segun es_auditada entrante
    IF p_historia_clinica_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM historia_clinica WHERE id = p_historia_clinica_id
    ) THEN
        RAISE EXCEPTION 'Falla en es_auditada: La historia clinica % no existe', p_historia_clinica_id;
    END IF;

    -- ❖ Ts Seleccionar el elemento d en Doctor segun participa_en entrante
    IF p_modified_by_user_id IS NULL OR NOT EXISTS (
        SELECT 1 FROM usuario u
        LEFT JOIN doctor d ON d.user_id = u.id
        WHERE u.id = p_modified_by_user_id AND (d.user_id IS NOT NULL OR u.role IN ('DOCTORA', 'ADMIN'))
    ) THEN
        RAISE EXCEPTION 'Falla en participa_en: El doctor % no existe', p_modified_by_user_id;
    END IF;

    -- Grabar tupla en Historia_clinica_auditoria y las n-uplas (h, hca) y (d, hca)
    INSERT INTO historia_clinica_audit (
        historia_clinica_id, modified_by_user_id, modified_section, previous_values, new_values, updated_at
    ) VALUES (
        p_historia_clinica_id, p_modified_by_user_id, p_modified_section, p_previous_values, p_new_values, NOW()
    ) RETURNING id INTO v_audit_id;
    -- fin-ts

    RETURN v_audit_id;
END;
$$;

-- =====================================================================================
-- PASO 3: TRIGGERS DE BASE DE DATOS (CUMPLIMIENTO AUTOMATICO EN TODA OPERACION)
-- =====================================================================================

-- 3.1 Trigger AFTER INSERT en PACIENTE: garantiza que SIEMPRE se dispare el proceso
--     recursivo de Alta en Historia_clinica por la relacion saliente total titular_de (1:1),
--     incluso cuando el alta se realiza desde el backend JPA (PatientDAO.save).
CREATE OR REPLACE FUNCTION trg_fn_paciente_ensure_titular_de()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_doctor_id BIGINT;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM historia_clinica WHERE paciente_id = NEW.id) THEN
        SELECT user_id INTO v_doctor_id FROM doctor ORDER BY user_id LIMIT 1;
        IF v_doctor_id IS NULL THEN
            SELECT id INTO v_doctor_id FROM usuario WHERE role IN ('DOCTORA', 'ADMIN') ORDER BY id LIMIT 1;
        END IF;

        IF v_doctor_id IS NOT NULL THEN
            PERFORM sp_alta_historia_clinica(
                p_paciente_id => NEW.id,
                p_created_by_user_id => v_doctor_id,
                p_fitzpatrick_phototype => 3
            );
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_paciente_ensure_titular_de ON paciente;
CREATE TRIGGER trg_paciente_ensure_titular_de
    AFTER INSERT ON paciente
    FOR EACH ROW EXECUTE FUNCTION trg_fn_paciente_ensure_titular_de();

-- 3.2 Trigger BEFORE INSERT en ENTRADA_HC: valida y completa la relacion saliente total
--     'pertenece' hacia HISTORIA_CLINICA si la insercion proviene de JPA.
CREATE OR REPLACE FUNCTION trg_fn_entrada_hc_ensure_pertenece()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.historia_clinica_id IS NULL THEN
        SELECT id INTO NEW.historia_clinica_id
        FROM historia_clinica
        WHERE paciente_id = NEW.paciente_id;
    END IF;

    IF NEW.historia_clinica_id IS NULL THEN
        RAISE EXCEPTION 'Falla en pertenece: No existe Historia_clinica para el paciente %', NEW.paciente_id;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_entrada_hc_ensure_pertenece ON entrada_hc;
CREATE TRIGGER trg_entrada_hc_ensure_pertenece
    BEFORE INSERT ON entrada_hc
    FOR EACH ROW EXECUTE FUNCTION trg_fn_entrada_hc_ensure_pertenece();

-- 3.3 Triggers en CITA y SERVICIO para mantener sincronizadas las relaciones suryectivas
--     'atiende', 'se_brinda_en' y 'brinda' cuando se opera desde JPA.
CREATE OR REPLACE FUNCTION trg_fn_cita_before_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.doctor_id IS NULL THEN
        SELECT user_id INTO NEW.doctor_id FROM doctor ORDER BY user_id LIMIT 1;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_cita_before_insert ON cita;
CREATE TRIGGER trg_cita_before_insert
    BEFORE INSERT ON cita
    FOR EACH ROW EXECUTE FUNCTION trg_fn_cita_before_insert();

CREATE OR REPLACE FUNCTION trg_fn_cita_after_insert_se_brinda_en()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO se_brinda_en (cita_id, servicio_id)
    VALUES (NEW.id, NEW.servicio_id)
    ON CONFLICT (cita_id, servicio_id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_cita_after_insert_se_brinda_en ON cita;
CREATE TRIGGER trg_cita_after_insert_se_brinda_en
    AFTER INSERT ON cita
    FOR EACH ROW EXECUTE FUNCTION trg_fn_cita_after_insert_se_brinda_en();

CREATE OR REPLACE FUNCTION trg_fn_servicio_after_insert_brinda()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_doc_id BIGINT;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM doctor_servicio WHERE servicio_id = NEW.id) THEN
        SELECT user_id INTO v_doc_id FROM doctor ORDER BY user_id LIMIT 1;
        IF v_doc_id IS NOT NULL THEN
            INSERT INTO doctor_servicio (doctor_id, servicio_id, created_at)
            VALUES (v_doc_id, NEW.id, NOW())
            ON CONFLICT (doctor_id, servicio_id) DO NOTHING;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_servicio_after_insert_brinda ON servicio;
CREATE TRIGGER trg_servicio_after_insert_brinda
    AFTER INSERT ON servicio
    FOR EACH ROW EXECUTE FUNCTION trg_fn_servicio_after_insert_brinda();

-- 3.4 Triggers de Auditoria Automatica que invocan sp_alta_entrada_hc_auditoria
--     y sp_alta_historia_clinica_auditoria
CREATE OR REPLACE FUNCTION trg_audit_entrada_hc()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM entrada_hc_audit
        WHERE entrada_hc_id = OLD.id
          AND modified_at >= NOW() - INTERVAL '2 seconds'
    ) THEN
        PERFORM sp_alta_entrada_hc_auditoria(
            p_entrada_hc_id => OLD.id,
            p_modified_by_user_id => NEW.author_user_id,
            p_previous_content => OLD.content,
            p_new_content => NEW.content
        );
    END IF;
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
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM historia_clinica_audit
        WHERE historia_clinica_id = OLD.id
          AND updated_at >= NOW() - INTERVAL '2 seconds'
    ) THEN
        PERFORM sp_alta_historia_clinica_auditoria(
            p_historia_clinica_id => OLD.id,
            p_modified_by_user_id => NEW.created_by_user_id,
            p_modified_section => 'DATOS_GENERALES',
            p_previous_values => jsonb_build_object(
                'fitzpatrick', OLD.fitzpatrick_phototype,
                'consentimiento', OLD.informed_consent_signed,
                'ginecologico', OLD.gynecological_history,
                'cirugia', OLD.surgical_history,
                'medicamentos', OLD.current_medications,
                'tratamientos_previos', OLD.previous_aesthetic_treatments
            ),
            p_new_values => jsonb_build_object(
                'fitzpatrick', NEW.fitzpatrick_phototype,
                'consentimiento', NEW.informed_consent_signed,
                'ginecologico', NEW.gynecological_history,
                'cirugia', NEW.surgical_history,
                'medicamentos', NEW.current_medications,
                'tratamientos_previos', NEW.previous_aesthetic_treatments
            )
        );
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_historia_clinica_update_audit ON historia_clinica;
CREATE TRIGGER trg_historia_clinica_update_audit
    AFTER UPDATE ON historia_clinica
    FOR EACH ROW
    EXECUTE FUNCTION trg_audit_historia_clinica();

-- 3.5 Triggers de actualizacion de updated_at e inmutabilidad de auditoria
CREATE OR REPLACE FUNCTION trg_fn_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_usuario_updated_at ON usuario;
CREATE TRIGGER trg_usuario_updated_at
    BEFORE UPDATE ON usuario
    FOR EACH ROW EXECUTE FUNCTION trg_fn_set_updated_at();

DROP TRIGGER IF EXISTS trg_paciente_updated_at ON paciente;
CREATE TRIGGER trg_paciente_updated_at
    BEFORE UPDATE ON paciente
    FOR EACH ROW EXECUTE FUNCTION trg_fn_set_updated_at();

DROP TRIGGER IF EXISTS trg_servicio_updated_at ON servicio;
CREATE TRIGGER trg_servicio_updated_at
    BEFORE UPDATE ON servicio
    FOR EACH ROW EXECUTE FUNCTION trg_fn_set_updated_at();

DROP TRIGGER IF EXISTS trg_cita_updated_at ON cita;
CREATE TRIGGER trg_cita_updated_at
    BEFORE UPDATE ON cita
    FOR EACH ROW EXECUTE FUNCTION trg_fn_set_updated_at();

CREATE OR REPLACE FUNCTION trg_fn_protect_audit_immutability()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION 'Operacion % no permitida: los registros de auditoria clinica son inmutables.', TG_OP;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_hc_audit ON historia_clinica_audit;
CREATE TRIGGER trg_protect_hc_audit
    BEFORE UPDATE OR DELETE ON historia_clinica_audit
    FOR EACH ROW EXECUTE FUNCTION trg_fn_protect_audit_immutability();

DROP TRIGGER IF EXISTS trg_protect_entrada_hc_audit ON entrada_hc_audit;
CREATE TRIGGER trg_protect_entrada_hc_audit
    BEFORE UPDATE OR DELETE ON entrada_hc_audit
    FOR EACH ROW EXECUTE FUNCTION trg_fn_protect_audit_immutability();
