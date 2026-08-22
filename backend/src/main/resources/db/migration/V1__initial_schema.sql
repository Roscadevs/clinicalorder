-- =====================================================================================
-- MIGRACIÓN FLYWAY V1: Esquema Relacional Inicial del Sistema de Gestión Dermatológica
-- Base de datos: Supabase PostgreSQL 15+
-- =====================================================================================

-- 1. Tabla de Usuarios del Sistema (Personal de la Clínica)
CREATE TABLE usuario (
    id BIGSERIAL PRIMARY KEY, -- Clave primaria autoincremental
    username VARCHAR(50) NOT NULL UNIQUE, -- Nombre de usuario único para login
    password_hash VARCHAR(255) NOT NULL, -- Contraseña con hash BCrypt
    email VARCHAR(100) NOT NULL UNIQUE, -- Correo electrónico único de contacto
    full_name VARCHAR(100) NOT NULL, -- Nombre y apellido completo
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'PHYSICIAN', 'RECEPTIONIST')), -- Rol RBAC
    active BOOLEAN NOT NULL DEFAULT TRUE, -- Indicador de cuenta activa
    failed_login_attempts INT NOT NULL DEFAULT 0, -- Contador de intentos fallidos
    locked_until TIMESTAMP WITH TIME ZONE NULL, -- Bloqueo temporal por intentos fallidos
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), -- Timestamp de creación
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW() -- Timestamp de última modificación
);

-- 2. Tabla de Tokens de Restablecimiento de Contraseña
CREATE TABLE password_reset_token (
    id BIGSERIAL PRIMARY KEY, -- Identificador único
    user_id BIGINT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE, -- Usuario asociado
    token VARCHAR(255) NOT NULL UNIQUE, -- Token criptográfico aleatorio
    used BOOLEAN NOT NULL DEFAULT FALSE, -- Indicador de si ya fue consumido
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL, -- Fecha y hora límite (15 minutos)
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW() -- Timestamp de generación
);

-- 3. Tabla de Pacientes
CREATE TABLE paciente (
    id BIGSERIAL PRIMARY KEY, -- Identificador único del paciente
    name VARCHAR(100) NOT NULL, -- Nombre y apellido
    dni VARCHAR(8) NOT NULL UNIQUE CHECK (dni ~ '^[0-9]{7,8}$'), -- DNI argentino de 7 u 8 dígitos
    phone VARCHAR(20) NOT NULL UNIQUE, -- Teléfono único
    email VARCHAR(100) NOT NULL UNIQUE, -- Correo electrónico único
    birth_date DATE NULL, -- Fecha de nacimiento
    profession VARCHAR(100) NULL, -- Profesión u ocupación
    active BOOLEAN NOT NULL DEFAULT TRUE, -- Borrado lógico
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), -- Timestamp de alta
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW() -- Timestamp de modificación
);

-- Índices de búsqueda para optimizar consultas de pacientes
CREATE INDEX idx_paciente_dni ON paciente(dni);
CREATE INDEX idx_paciente_email ON paciente(email);
CREATE INDEX idx_paciente_name ON paciente(name);

-- 4. Tabla de Servicios Dermatológicos y Estéticos
CREATE TABLE servicio (
    id BIGSERIAL PRIMARY KEY, -- Identificador del servicio
    name VARCHAR(100) NOT NULL UNIQUE, -- Nombre único del tratamiento
    description VARCHAR(500) NULL, -- Descripción clínica y estética del servicio
    duration_minutes INT NOT NULL CHECK (duration_minutes >= 15 AND duration_minutes <= 240), -- Duración en min
    base_price NUMERIC(12, 2) NOT NULL CHECK (base_price > 0), -- Precio base actual
    deposit_percentage NUMERIC(5, 2) NOT NULL DEFAULT 50.00 CHECK (deposit_percentage >= 0 AND deposit_percentage <= 100), -- % seña
    follow_up_interval_days INT NULL, -- Días recomendados para control post-tratamiento
    active BOOLEAN NOT NULL DEFAULT TRUE, -- Estado activo/inactivo
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), -- Timestamp de creación
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW() -- Timestamp de modificación
);

-- 5. Tabla de Citas (Turnos)
CREATE TABLE cita (
    id BIGSERIAL PRIMARY KEY, -- Identificador único de la cita
    paciente_id BIGINT NOT NULL REFERENCES paciente(id) ON DELETE RESTRICT, -- Paciente citado
    servicio_id BIGINT NOT NULL REFERENCES servicio(id) ON DELETE RESTRICT, -- Servicio a realizar
    created_by_user_id BIGINT NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT, -- Operador creador
    start_time TIMESTAMP WITH TIME ZONE NOT NULL, -- Fecha y hora de inicio
    end_time TIMESTAMP WITH TIME ZONE NOT NULL CHECK (end_time > start_time), -- Fecha y hora de fin
    status VARCHAR(30) NOT NULL CHECK (status IN ('PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'PAYMENT_FAILED', 'NO_SHOW')), -- Estado del turno
    agreed_price NUMERIC(12, 2) NOT NULL CHECK (agreed_price >= 0), -- Precio acordado al reservar
    follow_up_to_id BIGINT NULL REFERENCES cita(id) ON DELETE SET NULL, -- Referencia a turno previo si es control
    temporary_hold_deadline TIMESTAMP WITH TIME ZONE NULL, -- Límite de 10 minutos para pago de seña
    reschedule_count INT NOT NULL DEFAULT 0, -- Contador de reprogramaciones
    original_start_time TIMESTAMP WITH TIME ZONE NOT NULL, -- Horario inicial original
    version BIGINT NOT NULL DEFAULT 0, -- Versión para bloqueo optimista (@Version)
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), -- Timestamp de reserva
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW() -- Timestamp de actualización
);

-- Índices para búsqueda de disponibilidad y estados de agenda
CREATE INDEX idx_cita_range ON cita(start_time, end_time);
CREATE INDEX idx_cita_status ON cita(status);
CREATE INDEX idx_cita_paciente ON cita(paciente_id);
CREATE INDEX idx_cita_hold_deadline ON cita(temporary_hold_deadline);

-- 6. Tabla de Transacciones de Pago (MercadoPago y Mostrador)
CREATE TABLE transaccion_pago (
    id BIGSERIAL PRIMARY KEY, -- Identificador de la transacción
    cita_id BIGINT NOT NULL REFERENCES cita(id) ON DELETE RESTRICT, -- Cita a la que pertenece el pago
    mp_preference_id VARCHAR(100) NULL, -- ID de preferencia generado en MercadoPago
    mp_payment_id VARCHAR(100) NULL UNIQUE, -- ID del pago procesado en MercadoPago
    payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('DEPOSIT_50', 'FINAL_BALANCE_50', 'FULL_PAYMENT')), -- Tipo de pago
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0), -- Monto abonado
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'REFUNDED')), -- Estado del pago
    registered_by_user_id BIGINT NULL REFERENCES usuario(id) ON DELETE RESTRICT, -- Personal que registró cobro manual
    payment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), -- Fecha de cobro
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW() -- Timestamp de creación
);

-- 7. Tabla de Bloqueos de Calendario (Indisponibilidad)
CREATE TABLE bloqueo_calendario (
    id BIGSERIAL PRIMARY KEY, -- Identificador del bloqueo
    created_by_user_id BIGINT NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT, -- Usuario que bloqueó
    start_time TIMESTAMP WITH TIME ZONE NOT NULL, -- Inicio del bloqueo
    end_time TIMESTAMP WITH TIME ZONE NOT NULL CHECK (end_time > start_time), -- Fin del bloqueo
    reason VARCHAR(255) NOT NULL, -- Motivo (vacaciones, feriado, congreso)
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW() -- Timestamp de creación
);

-- 8. Tabla de Historia Clínica Base (Ficha Anamnesis por Paciente - Relación 1:1)
CREATE TABLE historia_clinica (
    id BIGSERIAL PRIMARY KEY, -- Identificador único de la historia clínica
    paciente_id BIGINT NOT NULL UNIQUE REFERENCES paciente(id) ON DELETE RESTRICT, -- Paciente único
    created_by_user_id BIGINT NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT, -- Médica que creó la ficha
    -- Antecedentes Patológicos
    has_hta BOOLEAN NOT NULL DEFAULT FALSE, -- Hipertensión arterial
    has_dbt BOOLEAN NOT NULL DEFAULT FALSE, -- Diabetes
    has_hypothyroidism BOOLEAN NOT NULL DEFAULT FALSE, -- Hipotiroidismo
    has_hyperthyroidism BOOLEAN NOT NULL DEFAULT FALSE, -- Hipertiroidismo
    has_anemia BOOLEAN NOT NULL DEFAULT FALSE, -- Anemia
    has_autoimmune_diseases BOOLEAN NOT NULL DEFAULT FALSE, -- Enfermedades autoinmunes
    has_glaucoma BOOLEAN NOT NULL DEFAULT FALSE, -- Glaucoma
    has_coagulation_disorders BOOLEAN NOT NULL DEFAULT FALSE, -- Trastornos de coagulación
    has_scarring_alterations BOOLEAN NOT NULL DEFAULT FALSE, -- Alteraciones de cicatrización
    other_pathological TEXT NULL, -- Otras patologías descritas
    -- Alergias
    allergy_anesthesia BOOLEAN NOT NULL DEFAULT FALSE, -- Alergia a anestésicos locales
    allergy_egg BOOLEAN NOT NULL DEFAULT FALSE, -- Alergia al huevo
    allergy_fish BOOLEAN NOT NULL DEFAULT FALSE, -- Alergia al pescado
    other_allergies TEXT NULL, -- Otras alergias
    -- Hábitos Tóxicos
    habit_tobacco BOOLEAN NOT NULL DEFAULT FALSE, -- Tabaquismo
    habit_alcohol BOOLEAN NOT NULL DEFAULT FALSE, -- Consumo de alcohol
    habit_sun_exposure BOOLEAN NOT NULL DEFAULT FALSE, -- Exposición solar frecuente
    habit_spf_use BOOLEAN NOT NULL DEFAULT FALSE, -- Uso diario de protector solar (SPF)
    -- Antecedentes Específicos
    surgical_history TEXT NULL, -- Cirugías previas
    gynecological_history TEXT NULL, -- FUM, embarazo, lactancia
    current_medications TEXT NULL, -- Medicación habitual (aspirinas, anticoagulantes)
    previous_aesthetic_treatments TEXT NULL, -- Tratamientos estéticos previos y respuesta
    -- Evaluación y Diagnóstico
    fitzpatrick_phototype VARCHAR(10) NOT NULL CHECK (fitzpatrick_phototype IN ('I', 'II', 'III', 'IV', 'V', 'VI')), -- Fototipo de piel
    physical_examination TEXT NULL, -- Examen físico facial y corporal
    treatment_plan TEXT NULL, -- Plan de tratamiento propuesto
    informed_consent_signed BOOLEAN NOT NULL DEFAULT FALSE, -- Consentimiento informado firmado
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), -- Timestamp de creación
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW() -- Timestamp de modificación
);

-- 9. Tabla de Entradas de Evolución Clínica (Notas por Sesión)
CREATE TABLE entrada_hc (
    id BIGSERIAL PRIMARY KEY, -- Identificador de la nota clínica
    historia_clinica_id BIGINT NOT NULL REFERENCES historia_clinica(id) ON DELETE RESTRICT, -- Historia asociada
    cita_id BIGINT NOT NULL REFERENCES cita(id) ON DELETE RESTRICT, -- Turno específico atendido
    author_user_id BIGINT NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT, -- Médica autora
    content TEXT NOT NULL, -- Redacción de evolución, procedimiento, dosis y cuidados
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), -- Timestamp de creación
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW() -- Timestamp de modificación
);

-- 10. Tabla de Metadatos de Fotografías Médicas
CREATE TABLE imagen_hc (
    id BIGSERIAL PRIMARY KEY, -- Identificador de la foto
    historia_clinica_id BIGINT NOT NULL REFERENCES historia_clinica(id) ON DELETE CASCADE, -- Historia clínica
    file_path VARCHAR(255) NOT NULL UNIQUE, -- Ruta en Supabase Storage (photos/...)
    original_filename VARCHAR(255) NOT NULL, -- Nombre original del archivo subido
    content_type VARCHAR(50) NOT NULL, -- Tipo MIME (image/jpeg, image/png)
    file_size BIGINT NOT NULL, -- Tamaño en bytes
    description VARCHAR(255) NULL, -- Descripción médica (ej. 'Pre-peeling frontal')
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW() -- Timestamp de carga
);
