-- =====================================================================================
-- MIGRACIÓN FLYWAY V3: Carga de Datos Iniciales (Semilla / Seed Data)
-- Contraseñas hasheadas con BCrypt (fuerza 12) correspondientes a 'Password123!'
-- =====================================================================================

-- 1. Inserción de Usuarios Iniciales del Sistema
INSERT INTO usuario (username, password_hash, email, full_name, role, active)
SELECT 'admin', '$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6eW6vVev49/Z.qWkK', 'admin@clinicadermatologica.com', 'Administrador del Sistema', 'ADMIN', true
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE username = 'admin' OR email = 'admin@clinicadermatologica.com');

INSERT INTO usuario (username, password_hash, email, full_name, role, active)
SELECT 'dra.valeria', '$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6eW6vVev49/Z.qWkK', 'valeria.medica@clinicadermatologica.com', 'Dra. Valeria Gómez', 'PHYSICIAN', true
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE username = 'dra.valeria' OR email = 'valeria.medica@clinicadermatologica.com');

INSERT INTO usuario (username, password_hash, email, full_name, role, active)
SELECT 'sofia.recepcion', '$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6eW6vVev49/Z.qWkK', 'sofia.secretaria@clinicadermatologica.com', 'Sofía Martínez', 'RECEPTIONIST', true
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE username = 'sofia.recepcion' OR email = 'sofia.secretaria@clinicadermatologica.com');

-- 2. Inserción del Catálogo Oficial de Servicios Dermatológicos y Estéticos
INSERT INTO servicio (name, description, duration_minutes, base_price, deposit_percentage, follow_up_interval_days, active)
SELECT 'Consulta Dermatológica General', 'Evaluación integral de afecciones de la piel, lunares (dermatoscopía), acné, rosácea y diagnóstico clínico.', 30, 25000.00, 50.00, 30, true
WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE name = 'Consulta Dermatológica General');

INSERT INTO servicio (name, description, duration_minutes, base_price, deposit_percentage, follow_up_interval_days, active)
SELECT 'Limpieza Facial Profunda con Punta de Diamante', 'Higiene facial médica, microdermoabrasión, extracción de comedones, máscara descongestiva e hidratación profunda.', 60, 35000.00, 50.00, 30, true
WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE name = 'Limpieza Facial Profunda con Punta de Diamante');

INSERT INTO servicio (name, description, duration_minutes, base_price, deposit_percentage, follow_up_interval_days, active)
SELECT 'Peeling Químico Médico', 'Renovación celular mediante ácidos específicos (glicólico, mandélico, salicílico o TCA) para manchas, fotoenvejecimiento y secuelas de acné.', 45, 42000.00, 50.00, 21, true
WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE name = 'Peeling Químico Médico');

INSERT INTO servicio (name, description, duration_minutes, base_price, deposit_percentage, follow_up_interval_days, active)
SELECT 'Toxina Botulínica (Botox) - Rostro Completo', 'Atenuación de arrugas de expresión en frente, entrecejo y patas de gallo mediante microinyecciones de toxina tipo A.', 45, 120000.00, 50.00, 120, true
WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE name = 'Toxina Botulínica (Botox) - Rostro Completo');

INSERT INTO servicio (name, description, duration_minutes, base_price, deposit_percentage, follow_up_interval_days, active)
SELECT 'Relleno con Ácido Hialurónico (Labios o Pómulos)', 'Volumen, hidratación y perfilado estético con ácido hialurónico reticulado de alta gama.', 60, 150000.00, 50.00, 180, true
WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE name = 'Relleno con Ácido Hialurónico (Labios o Pómulos)');

INSERT INTO servicio (name, description, duration_minutes, base_price, deposit_percentage, follow_up_interval_days, active)
SELECT 'Bioestimuladores de Colágeno (Radiesse / Sculptra)', 'Tratamiento inductor de colágeno para combatir flacidez facial y corporal, mejorando elasticidad y firmeza.', 60, 180000.00, 50.00, 90, true
WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE name = 'Bioestimuladores de Colágeno (Radiesse / Sculptra)');

-- 3. Inserción de Pacientes de Ejemplo para Pruebas Iniciales
INSERT INTO paciente (name, dni, phone, email, birth_date, profession, active)
SELECT 'Lucía Fernández', '38456123', '+5491145678901', 'lucia.fernandez@example.com', '1994-05-14', 'Diseñadora Gráfica', true
WHERE NOT EXISTS (SELECT 1 FROM paciente WHERE dni = '38456123' OR phone = '+5491145678901' OR email = 'lucia.fernandez@example.com');

INSERT INTO paciente (name, dni, phone, email, birth_date, profession, active)
SELECT 'Martín Benítez', '35123987', '+5491156789012', 'martin.benitez@example.com', '1990-11-20', 'Abogado', true
WHERE NOT EXISTS (SELECT 1 FROM paciente WHERE dni = '35123987' OR phone = '+5491156789012' OR email = 'martin.benitez@example.com');

INSERT INTO paciente (name, dni, phone, email, birth_date, profession, active)
SELECT 'Carla Rossi', '40987654', '+5491167890123', 'carla.rossi@example.com', '1998-03-08', 'Arquitecta', true
WHERE NOT EXISTS (SELECT 1 FROM paciente WHERE dni = '40987654' OR phone = '+5491167890123' OR email = 'carla.rossi@example.com');
