-- =====================================================================================
-- MIGRACIÓN FLYWAY V3: Carga de Datos Iniciales (Semilla / Seed Data)
-- Contraseñas hasheadas con BCrypt (fuerza 12) correspondientes a 'Password123!'
-- =====================================================================================

-- 1. Inserción de Usuarios Iniciales del Sistema
INSERT INTO usuario (username, password_hash, email, full_name, role, active) VALUES
-- Usuario Administrador General
('admin', '$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6eW6vVev49/Z.qWkK', 'admin@clinicadermatologica.com', 'Administrador del Sistema', 'ADMIN', true),
-- Médica Dermatóloga
('dra.valeria', '$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6eW6vVev49/Z.qWkK', 'valeria.medica@clinicadermatologica.com', 'Dra. Valeria Gómez', 'PHYSICIAN', true),
-- Secretaria Recepcionista
('sofia.recepcion', '$2a$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQmG6eW6vVev49/Z.qWkK', 'sofia.secretaria@clinicadermatologica.com', 'Sofía Martínez', 'RECEPTIONIST', true)
ON CONFLICT (username) DO NOTHING;

-- 2. Inserción del Catálogo Oficial de Servicios Dermatológicos y Estéticos
INSERT INTO servicio (name, description, duration_minutes, base_price, deposit_percentage, follow_up_interval_days, active) VALUES
('Consulta Dermatológica General', 'Evaluación integral de afecciones de la piel, lunares (dermatoscopía), acné, rosácea y diagnóstico clínico.', 30, 25000.00, 50.00, 30, true),
('Limpieza Facial Profunda con Punta de Diamante', 'Higiene facial médica, microdermoabrasión, extracción de comedones, máscara descongestiva e hidratación profunda.', 60, 35000.00, 50.00, 30, true),
('Peeling Químico Médico', 'Renovación celular mediante ácidos específicos (glicólico, mandélico, salicílico o TCA) para manchas, fotoenvejecimiento y secuelas de acné.', 45, 42000.00, 50.00, 21, true),
('Toxina Botulínica (Botox) - Rostro Completo', 'Atenuación de arrugas de expresión en frente, entrecejo y patas de gallo mediante microinyecciones de toxina tipo A.', 45, 120000.00, 50.00, 120, true),
('Relleno con Ácido Hialurónico (Labios o Pómulos)', 'Volumen, hidratación y perfilado estético con ácido hialurónico reticulado de alta gama.', 60, 150000.00, 50.00, 180, true),
('Bioestimuladores de Colágeno (Radiesse / Sculptra)', 'Tratamiento inductor de colágeno para combatir flacidez facial y corporal, mejorando elasticidad y firmeza.', 60, 180000.00, 50.00, 90, true)
ON CONFLICT (name) DO NOTHING;

-- 3. Inserción de Pacientes de Ejemplo para Pruebas Iniciales
INSERT INTO paciente (name, dni, phone, email, birth_date, profession, active) VALUES
('Lucía Fernández', '38456123', '+5491145678901', 'lucia.fernandez@example.com', '1994-05-14', 'Diseñadora Gráfica', true),
('Martín Benítez', '35123987', '+5491156789012', 'martin.benitez@example.com', '1990-11-20', 'Abogado', true),
('Carla Rossi', '40987654', '+5491167890123', 'carla.rossi@example.com', '1998-03-08', 'Arquitecta', true)
ON CONFLICT (dni) DO NOTHING;
