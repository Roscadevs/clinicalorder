-- =====================================================================================
-- MIGRACION FLYWAY V5: Datos Iniciales Actualizados
-- Reemplaza funcionalmente a V3 para el esquema rediseñado en V4.
-- V3 (seed original) ya no es compatible con el esquema V4 porque:
--   - Los roles PHYSICIAN y RECEPTIONIST no existen en el nuevo CHECK constraint de usuario.
--   - La columna profession fue eliminada de paciente.
--   - deposit_percentage en servicio es ahora INT (no NUMERIC).
-- Contrasenas hasheadas con BCrypt (costo 12) para 'Password123!'
-- =====================================================================================

-- ─────────────────────────────────────────────────────────────────────────────────────
-- 1. Usuarios del Sistema
--    Roles actualizados: DOCTORA (antes PHYSICIAN), SECRETARIA (antes RECEPTIONIST)
-- ─────────────────────────────────────────────────────────────────────────────────────

INSERT INTO usuario (username, password_hash, email, full_name, role, active)
SELECT 'admin',
       '$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6eW6vVev49/Z.qWkK',
       'admin@clinicadermatologica.com',
       'Administrador del Sistema',
       'ADMIN',
       true
WHERE NOT EXISTS (
    SELECT 1 FROM usuario
    WHERE username = 'admin' OR email = 'admin@clinicadermatologica.com'
);

INSERT INTO usuario (username, password_hash, email, full_name, role, active)
SELECT 'dra.valeria',
       '$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6eW6vVev49/Z.qWkK',
       'valeria.medica@clinicadermatologica.com',
       'Dra. Valeria Gomez',
       'DOCTORA',                                            -- Antes: PHYSICIAN
       true
WHERE NOT EXISTS (
    SELECT 1 FROM usuario
    WHERE username = 'dra.valeria' OR email = 'valeria.medica@clinicadermatologica.com'
);

INSERT INTO usuario (username, password_hash, email, full_name, role, active)
SELECT 'sofia.recepcion',
       '$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6eW6vVev49/Z.qWkK',
       'sofia.secretaria@clinicadermatologica.com',
       'Sofia Martinez',
       'SECRETARIA',                                         -- Antes: RECEPTIONIST
       true
WHERE NOT EXISTS (
    SELECT 1 FROM usuario
    WHERE username = 'sofia.recepcion' OR email = 'sofia.secretaria@clinicadermatologica.com'
);

-- ─────────────────────────────────────────────────────────────────────────────────────
-- 2. Catalogo de Servicios Dermatologicos y Esteticos
--    deposit_percentage ahora es INT (antes NUMERIC); follow_up_interval_days NOT NULL
-- ─────────────────────────────────────────────────────────────────────────────────────

INSERT INTO servicio (name, description, duration_minutes, base_price,
                      deposit_percentage, follow_up_interval_days, active)
SELECT 'Consulta Dermatologica General',
       'Evaluacion integral de afecciones de la piel, lunares (dermatoscopia), acne, rosacea y diagnostico clinico.',
       30, 25000.00, 50, 30, true
WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE name = 'Consulta Dermatologica General');

INSERT INTO servicio (name, description, duration_minutes, base_price,
                      deposit_percentage, follow_up_interval_days, active)
SELECT 'Limpieza Facial Profunda con Punta de Diamante',
       'Higiene facial medica, microdermoabrasion, extraccion de comedones, mascara descongestiva e hidratacion profunda.',
       60, 35000.00, 50, 30, true
WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE name = 'Limpieza Facial Profunda con Punta de Diamante');

INSERT INTO servicio (name, description, duration_minutes, base_price,
                      deposit_percentage, follow_up_interval_days, active)
SELECT 'Peeling Quimico Medico',
       'Renovacion celular mediante acidos especificos (glicolico, mandelico, salicilico o TCA) para manchas, fotoenvejecimiento y secuelas de acne.',
       45, 42000.00, 50, 21, true
WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE name = 'Peeling Quimico Medico');

INSERT INTO servicio (name, description, duration_minutes, base_price,
                      deposit_percentage, follow_up_interval_days, active)
SELECT 'Toxina Botulinica (Botox) - Rostro Completo',
       'Atenuacion de arrugas de expresion en frente, entrecejo y patas de gallo mediante microinyecciones de toxina tipo A.',
       45, 120000.00, 50, 120, true
WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE name = 'Toxina Botulinica (Botox) - Rostro Completo');

INSERT INTO servicio (name, description, duration_minutes, base_price,
                      deposit_percentage, follow_up_interval_days, active)
SELECT 'Relleno con Acido Hialuronico (Labios o Pomulos)',
       'Volumen, hidratacion y perfilado estetico con acido hialuronico reticulado de alta gama.',
       60, 150000.00, 50, 180, true
WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE name = 'Relleno con Acido Hialuronico (Labios o Pomulos)');

INSERT INTO servicio (name, description, duration_minutes, base_price,
                      deposit_percentage, follow_up_interval_days, active)
SELECT 'Bioestimuladores de Colageno (Radiesse / Sculptra)',
       'Tratamiento inductor de colageno para combatir flacidez facial y corporal, mejorando elasticidad y firmeza.',
       60, 180000.00, 50, 90, true
WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE name = 'Bioestimuladores de Colageno (Radiesse / Sculptra)');

-- ─────────────────────────────────────────────────────────────────────────────────────
-- 3. Pacientes de Ejemplo
--    Columna profession ELIMINADA del esquema V4.
--    birth_date ahora NOT NULL — se incluye en todos los registros.
-- ─────────────────────────────────────────────────────────────────────────────────────

INSERT INTO paciente (name, dni, phone, email, birth_date, active)
SELECT 'Lucia Fernandez', '38456123', '+5491145678901',
       'lucia.fernandez@example.com', '1994-05-14', true
WHERE NOT EXISTS (
    SELECT 1 FROM paciente
    WHERE dni = '38456123' OR phone = '+5491145678901' OR email = 'lucia.fernandez@example.com'
);

INSERT INTO paciente (name, dni, phone, email, birth_date, active)
SELECT 'Martin Benitez', '35123987', '+5491156789012',
       'martin.benitez@example.com', '1990-11-20', true
WHERE NOT EXISTS (
    SELECT 1 FROM paciente
    WHERE dni = '35123987' OR phone = '+5491156789012' OR email = 'martin.benitez@example.com'
);

INSERT INTO paciente (name, dni, phone, email, birth_date, active)
SELECT 'Carla Rossi', '40987654', '+5491167890123',
       'carla.rossi@example.com', '1998-03-08', true
WHERE NOT EXISTS (
    SELECT 1 FROM paciente
    WHERE dni = '40987654' OR phone = '+5491167890123' OR email = 'carla.rossi@example.com'
);
