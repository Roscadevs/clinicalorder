-- =====================================================================================
-- MIGRACION FLYWAY V2: Datos Iniciales (Seed) de la Clinica Dermatologica
--
-- Contrasenas hasheadas con BCrypt (costo 12) correspondientes a 'Password123!'.
-- Todos los INSERT son idempotentes (WHERE NOT EXISTS): seguros de re-ejecutar.
-- Las fechas de turnos/pagos son relativas a NOW() para que la agenda siempre
-- muestre datos vigentes el dia que se corra la demo.
--
-- NOTA sobre cifrado: los campos physical_examination (historia_clinica) y content
-- (entrada_hc) van cifrados AES-256-GCM por la aplicacion y NO se siembran por SQL.
-- Las historias clinicas se cargan solo con sus campos de texto plano.
-- =====================================================================================

-- ─────────────────────────────────────────────────────────────────────────────────────
-- 1. Usuarios del Sistema (contrasena unica 'Password123!'). Roles: ADMIN | DOCTORA | SECRETARIA
-- ─────────────────────────────────────────────────────────────────────────────────────

INSERT INTO usuario (username, password_hash, email, full_name, role, active)
SELECT 'admin',
       '$2a$12$xRMRmwLBTnYv5/p8pwWZmuvFuhLNIi/mIga3oXCbPM1tJjFjA6uQq',
       'admin@clinicadermatologica.com',
       'Administrador del Sistema',
       'ADMIN',
       true
WHERE NOT EXISTS (
    SELECT 1 FROM usuario WHERE username = 'admin' OR email = 'admin@clinicadermatologica.com'
);

INSERT INTO usuario (username, password_hash, email, full_name, role, active)
SELECT 'pvilla',
       '$2a$12$xRMRmwLBTnYv5/p8pwWZmuvFuhLNIi/mIga3oXCbPM1tJjFjA6uQq',
       'paula.villa@clinicadermatologica.com',
       'Dra. Paula Villa Fuhrmann',
       'DOCTORA',
       true
WHERE NOT EXISTS (
    SELECT 1 FROM usuario WHERE username = 'pvilla' OR email = 'paula.villa@clinicadermatologica.com'
);

INSERT INTO usuario (username, password_hash, email, full_name, role, active)
SELECT 'smartinez',
       '$2a$12$xRMRmwLBTnYv5/p8pwWZmuvFuhLNIi/mIga3oXCbPM1tJjFjA6uQq',
       'sofia.martinez@clinicadermatologica.com',
       'Sofia Martinez',
       'SECRETARIA',
       true
WHERE NOT EXISTS (
    SELECT 1 FROM usuario WHERE username = 'smartinez' OR email = 'sofia.martinez@clinicadermatologica.com'
);

-- ─────────────────────────────────────────────────────────────────────────────────────
-- 2. Catalogo de Servicios Dermatologicos y Esteticos (sena 50% en todos)
-- ─────────────────────────────────────────────────────────────────────────────────────

INSERT INTO servicio (name, description, duration_minutes, base_price, deposit_percentage, follow_up_interval_days, active)
SELECT 'Peeling Quimico', 'Renovacion celular mediante acidos especificos para manchas, fotoenvejecimiento y secuelas de acne.', 45, 45000.00, 50, 21, true
WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE name = 'Peeling Quimico');

INSERT INTO servicio (name, description, duration_minutes, base_price, deposit_percentage, follow_up_interval_days, active)
SELECT 'Mesoterapia Capilar', 'Microinyecciones de activos para fortalecer el cabello y estimular el cuero cabelludo.', 30, 38000.00, 50, 15, true
WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE name = 'Mesoterapia Capilar');

INSERT INTO servicio (name, description, duration_minutes, base_price, deposit_percentage, follow_up_interval_days, active)
SELECT 'Mesoterapia Facial', 'Hidratacion y revitalizacion facial con vitaminas y antioxidantes aplicados por microinyeccion.', 40, 42000.00, 50, 21, true
WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE name = 'Mesoterapia Facial');

INSERT INTO servicio (name, description, duration_minutes, base_price, deposit_percentage, follow_up_interval_days, active)
SELECT 'Mesoterapia Corporal', 'Tratamiento reductor y reafirmante por microinyeccion de activos en zonas corporales.', 50, 48000.00, 50, 21, true
WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE name = 'Mesoterapia Corporal');

INSERT INTO servicio (name, description, duration_minutes, base_price, deposit_percentage, follow_up_interval_days, active)
SELECT 'Plasma Rico en Plaquetas Facial', 'Bioestimulacion facial con plasma autologo del paciente para regeneracion de la piel.', 60, 70000.00, 50, 30, true
WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE name = 'Plasma Rico en Plaquetas Facial');

INSERT INTO servicio (name, description, duration_minutes, base_price, deposit_percentage, follow_up_interval_days, active)
SELECT 'Plasma Rico en Plaquetas Capilar', 'Aplicacion de plasma autologo en cuero cabelludo para fortalecer el cabello.', 60, 75000.00, 50, 30, true
WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE name = 'Plasma Rico en Plaquetas Capilar');

INSERT INTO servicio (name, description, duration_minutes, base_price, deposit_percentage, follow_up_interval_days, active)
SELECT 'Microneedling', 'Induccion de colageno mediante microagujas para textura, cicatrices y luminosidad.', 45, 55000.00, 50, 30, true
WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE name = 'Microneedling');

INSERT INTO servicio (name, description, duration_minutes, base_price, deposit_percentage, follow_up_interval_days, active)
SELECT 'Toxina Botulinica Facial', 'Atenuacion de arrugas de expresion en frente, entrecejo y patas de gallo.', 45, 130000.00, 50, 120, true
WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE name = 'Toxina Botulinica Facial');

INSERT INTO servicio (name, description, duration_minutes, base_price, deposit_percentage, follow_up_interval_days, active)
SELECT 'Toxina Botulinica para Hiperhidrosis', 'Reduccion de la sudoracion excesiva en axilas, manos o pies.', 60, 180000.00, 50, 180, true
WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE name = 'Toxina Botulinica para Hiperhidrosis');

INSERT INTO servicio (name, description, duration_minutes, base_price, deposit_percentage, follow_up_interval_days, active)
SELECT 'Relleno de Labios', 'Volumen, hidratacion y perfilado de labios con acido hialuronico reticulado.', 60, 160000.00, 50, 180, true
WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE name = 'Relleno de Labios');

INSERT INTO servicio (name, description, duration_minutes, base_price, deposit_percentage, follow_up_interval_days, active)
SELECT 'Relleno de Ojeras', 'Correccion del surco lagrimal y atenuacion de ojeras con acido hialuronico.', 60, 170000.00, 50, 180, true
WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE name = 'Relleno de Ojeras');

INSERT INTO servicio (name, description, duration_minutes, base_price, deposit_percentage, follow_up_interval_days, active)
SELECT 'Relleno Mandibular', 'Definicion y perfilado del contorno mandibular con acido hialuronico de alta densidad.', 75, 220000.00, 50, 180, true
WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE name = 'Relleno Mandibular');

INSERT INTO servicio (name, description, duration_minutes, base_price, deposit_percentage, follow_up_interval_days, active)
SELECT 'Hilos PDO', 'Tensado y estimulacion de colageno mediante hilos de polidioxanona reabsorbibles.', 90, 250000.00, 50, 180, true
WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE name = 'Hilos PDO');

INSERT INTO servicio (name, description, duration_minutes, base_price, deposit_percentage, follow_up_interval_days, active)
SELECT 'Bioestimuladores', 'Induccion de colageno para combatir flacidez facial y corporal, mejorando firmeza.', 60, 190000.00, 50, 90, true
WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE name = 'Bioestimuladores');

INSERT INTO servicio (name, description, duration_minutes, base_price, deposit_percentage, follow_up_interval_days, active)
SELECT 'Extraccion de Verrugas', 'Remocion de verrugas y lesiones cutaneas benignas con tecnica medica.', 30, 35000.00, 50, 15, true
WHERE NOT EXISTS (SELECT 1 FROM servicio WHERE name = 'Extraccion de Verrugas');

-- ─────────────────────────────────────────────────────────────────────────────────────
-- 3. Pacientes (5 activos + 1 dado de baja logica). Datos ficticios de ejemplo.
-- ─────────────────────────────────────────────────────────────────────────────────────

INSERT INTO paciente (name, dni, phone, email, birth_date, active)
SELECT 'Lucia Fernandez', '38456123', '+5491145678901', 'lucia.fernandez@example.com', '1994-05-14', true
WHERE NOT EXISTS (SELECT 1 FROM paciente WHERE dni = '38456123' OR phone = '+5491145678901' OR email = 'lucia.fernandez@example.com');

INSERT INTO paciente (name, dni, phone, email, birth_date, active)
SELECT 'Martin Benitez', '35123987', '+5491156789012', 'martin.benitez@example.com', '1990-11-20', true
WHERE NOT EXISTS (SELECT 1 FROM paciente WHERE dni = '35123987' OR phone = '+5491156789012' OR email = 'martin.benitez@example.com');

INSERT INTO paciente (name, dni, phone, email, birth_date, active)
SELECT 'Carla Rossi', '40987654', '+5491167890123', 'carla.rossi@example.com', '1998-03-08', true
WHERE NOT EXISTS (SELECT 1 FROM paciente WHERE dni = '40987654' OR phone = '+5491167890123' OR email = 'carla.rossi@example.com');

INSERT INTO paciente (name, dni, phone, email, birth_date, active)
SELECT 'Javier Dominguez', '33765498', '+5491178901234', 'javier.dominguez@example.com', '1987-09-02', true
WHERE NOT EXISTS (SELECT 1 FROM paciente WHERE dni = '33765498' OR phone = '+5491178901234' OR email = 'javier.dominguez@example.com');

INSERT INTO paciente (name, dni, phone, email, birth_date, active)
SELECT 'Valentina Ibarra', '42310876', '+5491189012345', 'valentina.ibarra@example.com', '2000-01-27', true
WHERE NOT EXISTS (SELECT 1 FROM paciente WHERE dni = '42310876' OR phone = '+5491189012345' OR email = 'valentina.ibarra@example.com');

-- Paciente dado de baja (baja logica: active = false)
INSERT INTO paciente (name, dni, phone, email, birth_date, active)
SELECT 'Ricardo Paz', '30567812', '+5491190123456', 'ricardo.paz@example.com', '1982-07-19', false
WHERE NOT EXISTS (SELECT 1 FROM paciente WHERE dni = '30567812' OR phone = '+5491190123456' OR email = 'ricardo.paz@example.com');

-- ─────────────────────────────────────────────────────────────────────────────────────
-- 4. Turnos (8 turnos cubriendo los 6 estados). Fechas relativas a NOW().
--    created_by_user_id: la secretaria (smartinez) crea los turnos.
--    Los INSERT usan subconsultas por nombre/username para resolver los IDs sin asumirlos.
-- ─────────────────────────────────────────────────────────────────────────────────────

-- COMPLETED #1: Lucia - Peeling Quimico (hace 10 dias)
INSERT INTO cita (paciente_id, servicio_id, created_by_user_id, start_time, end_time, status, agreed_price)
SELECT (SELECT id FROM paciente WHERE dni = '38456123'),
       (SELECT id FROM servicio WHERE name = 'Peeling Quimico'),
       (SELECT id FROM usuario WHERE username = 'smartinez'),
       NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days' + INTERVAL '45 minutes',
       'COMPLETED', 45000.00
WHERE NOT EXISTS (SELECT 1 FROM cita WHERE paciente_id = (SELECT id FROM paciente WHERE dni = '38456123') AND servicio_id = (SELECT id FROM servicio WHERE name = 'Peeling Quimico') AND status = 'COMPLETED');

-- COMPLETED #2: Martin - Microneedling (hace 7 dias)
INSERT INTO cita (paciente_id, servicio_id, created_by_user_id, start_time, end_time, status, agreed_price)
SELECT (SELECT id FROM paciente WHERE dni = '35123987'),
       (SELECT id FROM servicio WHERE name = 'Microneedling'),
       (SELECT id FROM usuario WHERE username = 'smartinez'),
       NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days' + INTERVAL '45 minutes',
       'COMPLETED', 55000.00
WHERE NOT EXISTS (SELECT 1 FROM cita WHERE paciente_id = (SELECT id FROM paciente WHERE dni = '35123987') AND servicio_id = (SELECT id FROM servicio WHERE name = 'Microneedling') AND status = 'COMPLETED');

-- NO_SHOW: Carla - Mesoterapia Facial (hace 3 dias, no asistio)
INSERT INTO cita (paciente_id, servicio_id, created_by_user_id, start_time, end_time, status, agreed_price)
SELECT (SELECT id FROM paciente WHERE dni = '40987654'),
       (SELECT id FROM servicio WHERE name = 'Mesoterapia Facial'),
       (SELECT id FROM usuario WHERE username = 'smartinez'),
       NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '40 minutes',
       'NO_SHOW', 42000.00
WHERE NOT EXISTS (SELECT 1 FROM cita WHERE paciente_id = (SELECT id FROM paciente WHERE dni = '40987654') AND servicio_id = (SELECT id FROM servicio WHERE name = 'Mesoterapia Facial') AND status = 'NO_SHOW');

-- CANCELED: Javier - Toxina Botulinica Facial (hace 2 dias, cancelado)
INSERT INTO cita (paciente_id, servicio_id, created_by_user_id, start_time, end_time, status, agreed_price)
SELECT (SELECT id FROM paciente WHERE dni = '33765498'),
       (SELECT id FROM servicio WHERE name = 'Toxina Botulinica Facial'),
       (SELECT id FROM usuario WHERE username = 'smartinez'),
       NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '45 minutes',
       'CANCELED', 130000.00
WHERE NOT EXISTS (SELECT 1 FROM cita WHERE paciente_id = (SELECT id FROM paciente WHERE dni = '33765498') AND servicio_id = (SELECT id FROM servicio WHERE name = 'Toxina Botulinica Facial') AND status = 'CANCELED');

-- CONFIRMED #1: Lucia - Relleno de Labios (en 2 dias, sena pagada)
INSERT INTO cita (paciente_id, servicio_id, created_by_user_id, start_time, end_time, status, agreed_price)
SELECT (SELECT id FROM paciente WHERE dni = '38456123'),
       (SELECT id FROM servicio WHERE name = 'Relleno de Labios'),
       (SELECT id FROM usuario WHERE username = 'smartinez'),
       NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '60 minutes',
       'CONFIRMED', 160000.00
WHERE NOT EXISTS (SELECT 1 FROM cita WHERE paciente_id = (SELECT id FROM paciente WHERE dni = '38456123') AND servicio_id = (SELECT id FROM servicio WHERE name = 'Relleno de Labios') AND status = 'CONFIRMED');

-- CONFIRMED #2: Valentina - Bioestimuladores (en 4 dias, sena pagada)
INSERT INTO cita (paciente_id, servicio_id, created_by_user_id, start_time, end_time, status, agreed_price)
SELECT (SELECT id FROM paciente WHERE dni = '42310876'),
       (SELECT id FROM servicio WHERE name = 'Bioestimuladores'),
       (SELECT id FROM usuario WHERE username = 'smartinez'),
       NOW() + INTERVAL '4 days', NOW() + INTERVAL '4 days' + INTERVAL '60 minutes',
       'CONFIRMED', 190000.00
WHERE NOT EXISTS (SELECT 1 FROM cita WHERE paciente_id = (SELECT id FROM paciente WHERE dni = '42310876') AND servicio_id = (SELECT id FROM servicio WHERE name = 'Bioestimuladores') AND status = 'CONFIRMED');

-- PENDING_PAYMENT: Martin - Mesoterapia Capilar (en 5 dias, esperando sena)
INSERT INTO cita (paciente_id, servicio_id, created_by_user_id, start_time, end_time, status, agreed_price)
SELECT (SELECT id FROM paciente WHERE dni = '35123987'),
       (SELECT id FROM servicio WHERE name = 'Mesoterapia Capilar'),
       (SELECT id FROM usuario WHERE username = 'smartinez'),
       NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '30 minutes',
       'PENDING_PAYMENT', 38000.00
WHERE NOT EXISTS (SELECT 1 FROM cita WHERE paciente_id = (SELECT id FROM paciente WHERE dni = '35123987') AND servicio_id = (SELECT id FROM servicio WHERE name = 'Mesoterapia Capilar') AND status = 'PENDING_PAYMENT');

-- PAYMENT_FAILED: Carla - Hilos PDO (en 6 dias, fallo el pago de la sena)
INSERT INTO cita (paciente_id, servicio_id, created_by_user_id, start_time, end_time, status, agreed_price)
SELECT (SELECT id FROM paciente WHERE dni = '40987654'),
       (SELECT id FROM servicio WHERE name = 'Hilos PDO'),
       (SELECT id FROM usuario WHERE username = 'smartinez'),
       NOW() + INTERVAL '6 days', NOW() + INTERVAL '6 days' + INTERVAL '90 minutes',
       'PAYMENT_FAILED', 250000.00
WHERE NOT EXISTS (SELECT 1 FROM cita WHERE paciente_id = (SELECT id FROM paciente WHERE dni = '40987654') AND servicio_id = (SELECT id FROM servicio WHERE name = 'Hilos PDO') AND status = 'PAYMENT_FAILED');

-- ─────────────────────────────────────────────────────────────────────────────────────
-- 5. Transacciones de Pago (coherentes con el estado de cada turno).
--    Medios: CASH / BANK_TRANSFER (MercadoPago no se usa en el seed).
--    registered_by_user_id: la secretaria registra los cobros de mostrador.
-- ─────────────────────────────────────────────────────────────────────────────────────

-- COMPLETED #1 (Lucia/Peeling): sena APPROVED + saldo APPROVED
INSERT INTO transaccion_pago (cita_id, payment_type, payment_concept, amount, status, registered_by_user_id, payment_date)
SELECT c.id, 'CASH', 'DEPOSIT', 22500.00, 'APPROVED', (SELECT id FROM usuario WHERE username = 'smartinez'), NOW() - INTERVAL '12 days'
FROM cita c WHERE c.paciente_id = (SELECT id FROM paciente WHERE dni = '38456123') AND c.servicio_id = (SELECT id FROM servicio WHERE name = 'Peeling Quimico') AND c.status = 'COMPLETED'
AND NOT EXISTS (SELECT 1 FROM transaccion_pago t WHERE t.cita_id = c.id AND t.payment_concept = 'DEPOSIT');

INSERT INTO transaccion_pago (cita_id, payment_type, payment_concept, amount, status, registered_by_user_id, payment_date)
SELECT c.id, 'CASH', 'BALANCE', 22500.00, 'APPROVED', (SELECT id FROM usuario WHERE username = 'smartinez'), NOW() - INTERVAL '10 days'
FROM cita c WHERE c.paciente_id = (SELECT id FROM paciente WHERE dni = '38456123') AND c.servicio_id = (SELECT id FROM servicio WHERE name = 'Peeling Quimico') AND c.status = 'COMPLETED'
AND NOT EXISTS (SELECT 1 FROM transaccion_pago t WHERE t.cita_id = c.id AND t.payment_concept = 'BALANCE');

-- COMPLETED #2 (Martin/Microneedling): sena APPROVED + saldo APPROVED
INSERT INTO transaccion_pago (cita_id, payment_type, payment_concept, amount, status, registered_by_user_id, payment_date)
SELECT c.id, 'BANK_TRANSFER', 'DEPOSIT', 27500.00, 'APPROVED', (SELECT id FROM usuario WHERE username = 'smartinez'), NOW() - INTERVAL '9 days'
FROM cita c WHERE c.paciente_id = (SELECT id FROM paciente WHERE dni = '35123987') AND c.servicio_id = (SELECT id FROM servicio WHERE name = 'Microneedling') AND c.status = 'COMPLETED'
AND NOT EXISTS (SELECT 1 FROM transaccion_pago t WHERE t.cita_id = c.id AND t.payment_concept = 'DEPOSIT');

INSERT INTO transaccion_pago (cita_id, payment_type, payment_concept, amount, status, registered_by_user_id, payment_date)
SELECT c.id, 'CASH', 'BALANCE', 27500.00, 'APPROVED', (SELECT id FROM usuario WHERE username = 'smartinez'), NOW() - INTERVAL '7 days'
FROM cita c WHERE c.paciente_id = (SELECT id FROM paciente WHERE dni = '35123987') AND c.servicio_id = (SELECT id FROM servicio WHERE name = 'Microneedling') AND c.status = 'COMPLETED'
AND NOT EXISTS (SELECT 1 FROM transaccion_pago t WHERE t.cita_id = c.id AND t.payment_concept = 'BALANCE');

-- NO_SHOW (Carla/Mesoterapia Facial): sena APPROVED (pago la sena pero no asistio)
INSERT INTO transaccion_pago (cita_id, payment_type, payment_concept, amount, status, registered_by_user_id, payment_date)
SELECT c.id, 'CASH', 'DEPOSIT', 21000.00, 'APPROVED', (SELECT id FROM usuario WHERE username = 'smartinez'), NOW() - INTERVAL '5 days'
FROM cita c WHERE c.paciente_id = (SELECT id FROM paciente WHERE dni = '40987654') AND c.servicio_id = (SELECT id FROM servicio WHERE name = 'Mesoterapia Facial') AND c.status = 'NO_SHOW'
AND NOT EXISTS (SELECT 1 FROM transaccion_pago t WHERE t.cita_id = c.id AND t.payment_concept = 'DEPOSIT');

-- CANCELED (Javier/Toxina Facial): sena REFUNDED (se cancelo y se devolvio la sena)
INSERT INTO transaccion_pago (cita_id, payment_type, payment_concept, amount, status, registered_by_user_id, payment_date)
SELECT c.id, 'BANK_TRANSFER', 'DEPOSIT', 65000.00, 'REFUNDED', (SELECT id FROM usuario WHERE username = 'smartinez'), NOW() - INTERVAL '3 days'
FROM cita c WHERE c.paciente_id = (SELECT id FROM paciente WHERE dni = '33765498') AND c.servicio_id = (SELECT id FROM servicio WHERE name = 'Toxina Botulinica Facial') AND c.status = 'CANCELED'
AND NOT EXISTS (SELECT 1 FROM transaccion_pago t WHERE t.cita_id = c.id AND t.payment_concept = 'DEPOSIT');

-- CONFIRMED #1 (Lucia/Relleno de Labios): sena APPROVED (falta el saldo del dia)
INSERT INTO transaccion_pago (cita_id, payment_type, payment_concept, amount, status, registered_by_user_id, payment_date)
SELECT c.id, 'CASH', 'DEPOSIT', 80000.00, 'APPROVED', (SELECT id FROM usuario WHERE username = 'smartinez'), NOW() - INTERVAL '1 day'
FROM cita c WHERE c.paciente_id = (SELECT id FROM paciente WHERE dni = '38456123') AND c.servicio_id = (SELECT id FROM servicio WHERE name = 'Relleno de Labios') AND c.status = 'CONFIRMED'
AND NOT EXISTS (SELECT 1 FROM transaccion_pago t WHERE t.cita_id = c.id AND t.payment_concept = 'DEPOSIT');

-- CONFIRMED #2 (Valentina/Bioestimuladores): sena APPROVED (falta el saldo del dia)
INSERT INTO transaccion_pago (cita_id, payment_type, payment_concept, amount, status, registered_by_user_id, payment_date)
SELECT c.id, 'BANK_TRANSFER', 'DEPOSIT', 95000.00, 'APPROVED', (SELECT id FROM usuario WHERE username = 'smartinez'), NOW()
FROM cita c WHERE c.paciente_id = (SELECT id FROM paciente WHERE dni = '42310876') AND c.servicio_id = (SELECT id FROM servicio WHERE name = 'Bioestimuladores') AND c.status = 'CONFIRMED'
AND NOT EXISTS (SELECT 1 FROM transaccion_pago t WHERE t.cita_id = c.id AND t.payment_concept = 'DEPOSIT');

-- PENDING_PAYMENT (Martin/Mesoterapia Capilar): sena PENDING (esperando acreditacion)
INSERT INTO transaccion_pago (cita_id, payment_type, payment_concept, amount, status, registered_by_user_id, payment_date)
SELECT c.id, 'BANK_TRANSFER', 'DEPOSIT', 19000.00, 'PENDING', (SELECT id FROM usuario WHERE username = 'smartinez'), NULL
FROM cita c WHERE c.paciente_id = (SELECT id FROM paciente WHERE dni = '35123987') AND c.servicio_id = (SELECT id FROM servicio WHERE name = 'Mesoterapia Capilar') AND c.status = 'PENDING_PAYMENT'
AND NOT EXISTS (SELECT 1 FROM transaccion_pago t WHERE t.cita_id = c.id AND t.payment_concept = 'DEPOSIT');

-- PAYMENT_FAILED (Carla/Hilos PDO): sena REJECTED (el pago fallo)
INSERT INTO transaccion_pago (cita_id, payment_type, payment_concept, amount, status, registered_by_user_id, payment_date)
SELECT c.id, 'CASH', 'DEPOSIT', 125000.00, 'REJECTED', (SELECT id FROM usuario WHERE username = 'smartinez'), NULL
FROM cita c WHERE c.paciente_id = (SELECT id FROM paciente WHERE dni = '40987654') AND c.servicio_id = (SELECT id FROM servicio WHERE name = 'Hilos PDO') AND c.status = 'PAYMENT_FAILED'
AND NOT EXISTS (SELECT 1 FROM transaccion_pago t WHERE t.cita_id = c.id AND t.payment_concept = 'DEPOSIT');

-- ─────────────────────────────────────────────────────────────────────────────────────
-- 6. Historias Clinicas (solo campos de texto plano; physical_examination queda NULL por cifrado).
--    created_by_user_id: la doctora (pvilla) crea las historias.
--    - Lucia y Martin: pacientes atendidos (COMPLETED), ficha completa.
--    - Valentina: ficha creada antes de ser atendida (tiene turno CONFIRMED futuro).
--    (Carla, Javier y el paciente de baja NO tienen historia: muestra ese estado.)
-- ─────────────────────────────────────────────────────────────────────────────────────

INSERT INTO historia_clinica (paciente_id, created_by_user_id, fitzpatrick_phototype, informed_consent_signed, gynecological_history, surgical_history, current_medications, previous_aesthetic_treatments)
SELECT (SELECT id FROM paciente WHERE dni = '38456123'), (SELECT id FROM usuario WHERE username = 'pvilla'),
       3, true, 'Sin antecedentes relevantes. No embarazo ni lactancia.', 'Apendicectomia en 2015.', 'Anticonceptivos orales.', 'Limpiezas faciales periodicas.'
WHERE NOT EXISTS (SELECT 1 FROM historia_clinica WHERE paciente_id = (SELECT id FROM paciente WHERE dni = '38456123'));

INSERT INTO historia_clinica (paciente_id, created_by_user_id, fitzpatrick_phototype, informed_consent_signed, gynecological_history, surgical_history, current_medications, previous_aesthetic_treatments)
SELECT (SELECT id FROM paciente WHERE dni = '35123987'), (SELECT id FROM usuario WHERE username = 'pvilla'),
       2, true, NULL, 'Sin cirugias previas.', 'Ninguna.', 'Primera consulta estetica.'
WHERE NOT EXISTS (SELECT 1 FROM historia_clinica WHERE paciente_id = (SELECT id FROM paciente WHERE dni = '35123987'));

INSERT INTO historia_clinica (paciente_id, created_by_user_id, fitzpatrick_phototype, informed_consent_signed, gynecological_history, surgical_history, current_medications, previous_aesthetic_treatments)
SELECT (SELECT id FROM paciente WHERE dni = '42310876'), (SELECT id FROM usuario WHERE username = 'pvilla'),
       4, false, 'Sin antecedentes relevantes.', 'Sin cirugias previas.', 'Suplementos vitaminicos.', 'Sin tratamientos esteticos previos.'
WHERE NOT EXISTS (SELECT 1 FROM historia_clinica WHERE paciente_id = (SELECT id FROM paciente WHERE dni = '42310876'));

-- ─────────────────────────────────────────────────────────────────────────────────────
-- 7. Entidades debiles de Historia Clinica (alergias, antecedentes, habitos) de ejemplo.
-- ─────────────────────────────────────────────────────────────────────────────────────

-- Alergias
INSERT INTO alergia (historia_clinica_id, tipo, observaciones)
SELECT hc.id, 'Penicilina', 'Reaccion cutanea leve informada por la paciente.'
FROM historia_clinica hc WHERE hc.paciente_id = (SELECT id FROM paciente WHERE dni = '38456123')
AND NOT EXISTS (SELECT 1 FROM alergia a WHERE a.historia_clinica_id = hc.id AND a.tipo = 'Penicilina');

INSERT INTO alergia (historia_clinica_id, tipo, observaciones)
SELECT hc.id, 'Anestesicos locales', 'Precaucion en procedimientos con infiltracion.'
FROM historia_clinica hc WHERE hc.paciente_id = (SELECT id FROM paciente WHERE dni = '42310876')
AND NOT EXISTS (SELECT 1 FROM alergia a WHERE a.historia_clinica_id = hc.id AND a.tipo = 'Anestesicos locales');

-- Antecedentes patologicos
INSERT INTO antecedente_patologico (historia_clinica_id, tipo, observaciones)
SELECT hc.id, 'Hipotiroidismo', 'Controlado con medicacion.'
FROM historia_clinica hc WHERE hc.paciente_id = (SELECT id FROM paciente WHERE dni = '38456123')
AND NOT EXISTS (SELECT 1 FROM antecedente_patologico ap WHERE ap.historia_clinica_id = hc.id AND ap.tipo = 'Hipotiroidismo');

-- Habitos
INSERT INTO habito (historia_clinica_id, tipo, observaciones)
SELECT hc.id, 'Exposicion solar frecuente', 'Recomendado uso diario de protector solar FPS 50+.'
FROM historia_clinica hc WHERE hc.paciente_id = (SELECT id FROM paciente WHERE dni = '35123987')
AND NOT EXISTS (SELECT 1 FROM habito h WHERE h.historia_clinica_id = hc.id AND h.tipo = 'Exposicion solar frecuente');

INSERT INTO habito (historia_clinica_id, tipo, observaciones)
SELECT hc.id, 'Tabaquismo', 'Fumadora ocasional; se recomienda cese para mejor cicatrizacion.'
FROM historia_clinica hc WHERE hc.paciente_id = (SELECT id FROM paciente WHERE dni = '42310876')
AND NOT EXISTS (SELECT 1 FROM habito h WHERE h.historia_clinica_id = hc.id AND h.tipo = 'Tabaquismo');
