# PRD — Sistema Integral de Gestión Dermatológica, Estética y Asistente Virtual con IA

**Estado:** Aprobado para Construcción · **Dueño:** Equipo de Ingeniería de Software · **Fecha de Emisión:** 2026-08-22  
**Alcance:** Sistema Web Integral (Frontend React + Backend Spring Boot + Supabase PostgreSQL & Storage) para gestión de turnos dermatológicos con señas automáticas (MercadoPago), historia clínica estética digitalizada, auditoría clínica inmutable, asistente de atención al paciente con Google Gemini AI y control de accesos RBAC (Médica, Secretaria, Administrador).  
**No-Alcance Inicial:** Facturación electrónica fiscal directa (AFIP) en este ciclo, videollamadas integradas (telemedicina sincrónica en tiempo real) y prescripción digital con firma electrónica criptográfica avanzada de recetas de estupefacientes (se gestiona la prescripción en texto plano y formato imprimible).

---

## 1. Resumen Ejecutivo (Hoy vs Después)

- **Hoy:** La clínica pierde hasta un 30% de turnos por inasistencias sin seña previa; la agenda sufre sobreturnos manuales por descoordinación telefónica; la médica consulta fichas en papel dispersas donde no hay trazabilidad de fotos de evolución ni registro auditable de cambios en notas clínicas; y las consultas sobre tratamientos estéticos fuera de horario quedan desatendidas.
- **Después:** Cada turno queda bloqueado temporalmente por 10 minutos exigiendo el pago online de una seña del 50% vía MercadoPago para confirmarse; la médica accede en 1 clic a la historia clínica integral con registro fotográfico y auditoría estricta de cambios; la secretaria gestiona cobros y cancelaciones sin ver datos médicos confidenciales; y un Chatbot inteligente entrenado con la API de Gemini atiende 24/7 en la web pública, resolviendo dudas de procedimientos y guiando a los pacientes a la reserva.

---

## 2. La Historia (El Universo del Discurso y la Experiencia Humana)

### El Antes
> *Viernes, 17:45 hs.* La Dra. Valeria (médica dermatóloga y especialista en estética) atiende a Lucía para una sesión de aplicación de toxina botulínica y bioestimuladores. Busca la carpeta física de Lucía entre decenas de biblioratos: las anotaciones de las dosis aplicadas hace 4 meses están en un papel doblado con letra apenas legible, y las fotos del "antes" quedaron en el teléfono personal de la médica, sin fecha ni referencia cruzada.  
> Mientras tanto, en recepción, Sofía (la secretaria) atiende tres llamadas simultáneas de pacientes que preguntan precios y si hay turnos disponibles para el sábado. Sin querer, Sofía anota a dos pacientes en el mismo horario de las 18:00 hs. Uno de ellos nunca avisó que no iría porque no había abonado ninguna seña previa, dejando un bache de 45 minutos en el que la clínica no facturó nada.  
> Por la noche, a las 23:30 hs, Carla navega por la cuenta de Instagram de la clínica queriendo saber si el peeling químico sirve para sus manchas solares y cuánto cuesta, pero al no encontrar respuesta inmediata ni poder reservar online, cierra la pestaña y busca otra clínica.

### El Después
> *Viernes, 17:45 hs.* La Dra. Valeria ingresa desde su tablet al sistema con su usuario seguro. Al abrir el turno de Lucía de las 18:00 hs, el sistema le despliega inmediatamente la **Historia Clínica Estructurada**: antecedentes de hipotiroidismo, alergia a la anestesia local (destacada en alerta roja), fototipo Fitzpatrick III y las fotos de alta resolución tomadas en la sesión previa con comparativa lateral. En 2 minutos, la Dra. Valeria escribe la evolución clínica de la sesión actual, registra los lotes y unidades inyectadas, adjunta la nueva fotografía y firma digitalmente la entrada. Cualquier modificación posterior quedará automáticamente grabada en una tabla de auditoría inmutable con fecha, hora y valores previos.  
> En la recepción, Sofía ve la agenda en tiempo real con código de colores: el turno de Lucía aparece en verde ("Confirmado") porque Lucía pagó el 50% de la seña online al reservar hace 3 días. Sofía no puede acceder a las notas médicas de Lucía (el sistema protege el secreto médico por rol), pero al finalizar la consulta, cobra el 50% restante en efectivo en un solo clic, marcando la cita como "Finalizada". Si dos secretarias o pacientes intentan seleccionar el mismo turno a la vez, el sistema bloquea la franja durante 10 minutos para la primera transacción y previene la doble reserva de forma determinista.  
> A las 23:30 hs, Carla ingresa al sitio web de la clínica. El **Asistente Virtual de Gemini** la saluda cordialmente, le explica en lenguaje claro y empático en qué consiste el peeling médico según el catálogo oficial de servicios, le informa el valor referencial y el porcentaje de seña, y le ofrece un enlace directo para elegir fecha y hora disponible. Carla selecciona el martes a las 15:00 hs, abona la seña en MercadoPago en menos de 2 minutos y recibe su comprobante de turno confirmado por correo electrónico.

---

## 3. Objetivos y No-Objetivos de Negocio

### Objetivos Principales (O)
- **O1 (Cero Doble Reserva):** Garantizar la exclusividad absoluta de cada franja horaria mediante bloqueo temporal de 10 minutos con TTL y control de concurrencia optimista (`@Version` en base de datos).
- **O2 (Garantía Financiera de Señas):** Integrar MercadoPago Checkout Pro para cobrar automáticamente el 50% del precio base vigente al momento de la reserva como condición *sine qua non* para confirmar el turno.
- **O3 (Confidencialidad y Secreto Médico Estricto):** Implementar control de acceso basado en roles (RBAC) donde únicamente los usuarios con rol `PHYSICIAN` puedan consultar, crear o editar historias clínicas (`historia_clinica`), evoluciones (`entrada_hc`) e imágenes (`imagen_hc`). Los usuarios `RECEPTIONIST` tienen acceso denegado por diseño a nivel de endpoint y lógica de dominio.
- **O4 (Auditoría Médica Completa e Inmutable):** Registrar en tablas dedicadas (`historia_clinica_audit` y `entrada_hc_audit`) cualquier actualización en registros clínicos, capturando el ID de la médica, timestamp exacto, campos alterados, valor anterior y valor nuevo.
- **O5 (Atención Inteligente 24/7):** Incorporar un Chatbot con la API de Gemini que responda preguntas frecuentes, oriente sobre tratamientos dermatológicos/estéticos y derive a la reserva sin alucinar precios ni diagnósticos médicos vinculantes.
- **O6 (Disponibilidad y Rendimiento Cloud):** Desplegar el frontend en Vercel (Edge CDN con carga < 1.5s), backend contenerizado en nube y base de datos relacional PostgreSQL con Supabase con tiempos de respuesta API < 250ms en percentil 95.

### No-Objetivos (NO)
- **NO1:** El Chatbot de Gemini **NO** emite diagnósticos médicos formales ni prescribe tratamientos farmacológicos; siempre aclara su rol orientativo e informativo y deriva a la consulta presencial.
- **NO2:** El sistema **NO** almacena datos de tarjetas de crédito o credenciales bancarias en la base de datos propia (toda la información de pago es procesada de forma segura dentro de los servidores PCI-DSS de MercadoPago).
- **NO3:** Las secretarias **NO** pueden desbloquear ni ver datos de historias clínicas bajo ninguna circunstancia operativa.

---

## 4. Cómo Funciona Hoy vs Cómo va a Funcionar

### Diagrama de Flujo: Ciclo de Vida del Turno y Pagos

```
ESTADO HOY:
[Solicitud de Turno] ──> [Anotación en Papel/Excel] ──> [Inasistencia 30% / Pérdida Económica]

ESTADO DESPUÉS:
[Paciente/Secretaria selecciona Turno]
        │
        ▼
[Bloqueo Temporal de 10 minutos (DISPONIBLE -> BLOQUEADO_TEMPORALMENTE)]
        │
        ├──────────────────────┬──────────────────────┐
        │ (Dentro de 10 min)   │ (Expiran 10 min)     │ (Cancelación)
        ▼                      ▼                      ▼
[Pago Seña 50% en MP]   [TTL Libera Turno]    [Turno Cancelado]
        │                      │                      │
        ▼                      ▼                      ▼
  (Webhook MP)            (DISPONIBLE)           (DISPONIBLE)
        │
        ▼
[CONFIRMADO] ──> [Paciente asiste a Clínica]
                        │
                        ▼
            [Atención Médica (Dra.)]
            └─ Accede a Historia Clínica
            └─ Registra Evolución / Fotos
            └─ Guarda Auditoría Automática
                        │
                        ▼
            [Cobro de Saldo 50% (Recepción)]
            └─ MercadoPago o Efectivo/POS
                        │
                        ▼
                  [FINALIZADO]
```

---

## 5. Plano de Datos: Entidades, Atributos y Reglas de Integridad

El sistema implementa 12 tablas normalizadas en Supabase PostgreSQL 15+ cumpliendo 3FN/BCNF:

```
+---------------------------------------------------------------------------------------+
|                                    TABLAS DEL SISTEMA                                 |
+--------------------------+------------------------------------------------------------+
| Tabla                    | Responsabilidad / Propósito                                |
+--------------------------+------------------------------------------------------------+
| usuario                  | Operadores del sistema (ADMIN, PHYSICIAN, RECEPTIONIST)    |
| password_reset_token     | Tokens criptográficos de un solo uso (15 min expiración)   |
| paciente                 | Ficha de filiación del paciente (DNI, contacto, etc.)      |
| servicio                 | Catálogo de tratamientos dermatológicos/estéticos          |
| cita                     | Turnos agendados con control de concurrencia (@Version)    |
| transaccion_pago         | Registro de señas y saldos finales (MercadoPago/Efectivo)  |
| bloqueo_calendario       | Indisponibilidad por vacaciones, feriados o cierres        |
| historia_clinica         | Ficha médica base de la primera consulta (anamnesis)       |
| historia_clinica_audit   | Pista de auditoría inmutable de cambios en historia base   |
| entrada_hc               | Notas de evolución clínica por cada sesión/cita            |
| entrada_hc_audit         | Pista de auditoría inmutable de cambios en notas clínicas  |
| imagen_hc                | Metadatos de fotos médicas (archivo en Supabase Storage)   |
+--------------------------+------------------------------------------------------------+
```

### Detalle de Atributos e Invariantes de Negocio

1. **`usuario`**:
   - `id`: BIGSERIAL PRIMARY KEY.
   - `username`: VARCHAR(50) UNIQUE NOT NULL.
   - `password_hash`: VARCHAR(255) NOT NULL (BCrypt factor 12).
   - `email`: VARCHAR(100) UNIQUE NOT NULL.
   - `full_name`: VARCHAR(100) NOT NULL.
   - `role`: VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'PHYSICIAN', 'RECEPTIONIST')).
   - `active`: BOOLEAN NOT NULL DEFAULT TRUE.
   - `failed_login_attempts`: INT NOT NULL DEFAULT 0.
   - `locked_until`: TIMESTAMP WITH TIME ZONE NULL.
   - *Candado de Seguridad:* Si `failed_login_attempts` >= 5, se fija `locked_until = NOW() + INTERVAL '15 minutes'`.

2. **`paciente`**:
   - `id`: BIGSERIAL PRIMARY KEY.
   - `name`: VARCHAR(100) NOT NULL (1 a 100 caracteres).
   - `dni`: VARCHAR(8) UNIQUE NOT NULL CHECK (dni ~ '^[0-9]{7,8}$').
   - `phone`: VARCHAR(20) UNIQUE NOT NULL.
   - `email`: VARCHAR(100) UNIQUE NOT NULL.
   - `birth_date`: DATE NULL.
   - `profession`: VARCHAR(100) NULL.
   - `active`: BOOLEAN NOT NULL DEFAULT TRUE (borrado lógico).

3. **`servicio`**:
   - `id`: BIGSERIAL PRIMARY KEY.
   - `name`: VARCHAR(100) NOT NULL UNIQUE.
   - `description`: VARCHAR(500) NULL.
   - `duration_minutes`: INT NOT NULL CHECK (duration_minutes >= 15 AND duration_minutes <= 240).
   - `base_price`: NUMERIC(12, 2) NOT NULL CHECK (base_price > 0).
   - `deposit_percentage`: NUMERIC(5, 2) NOT NULL DEFAULT 50.00 CHECK (deposit_percentage >= 0 AND deposit_percentage <= 100).
   - `follow_up_interval_days`: INT NULL.
   - `active`: BOOLEAN NOT NULL DEFAULT TRUE.

4. **`cita` (Turno)**:
   - `id`: BIGSERIAL PRIMARY KEY.
   - `paciente_id`: BIGINT NOT NULL REFERENCES paciente(id) ON DELETE RESTRICT.
   - `servicio_id`: BIGINT NOT NULL REFERENCES servicio(id) ON DELETE RESTRICT.
   - `created_by_user_id`: BIGINT NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT.
   - `start_time`: TIMESTAMP WITH TIME ZONE NOT NULL.
   - `end_time`: TIMESTAMP WITH TIME ZONE NOT NULL CHECK (end_time > start_time).
   - `status`: VARCHAR(30) NOT NULL CHECK (status IN ('PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'PAYMENT_FAILED', 'NO_SHOW')).
   - `agreed_price`: NUMERIC(12, 2) NOT NULL CHECK (agreed_price >= 0).
   - `follow_up_to_id`: BIGINT NULL REFERENCES cita(id) ON DELETE SET NULL.
   - `temporary_hold_deadline`: TIMESTAMP WITH TIME ZONE NULL.
   - `reschedule_count`: INT NOT NULL DEFAULT 0.
   - `original_start_time`: TIMESTAMP WITH TIME ZONE NOT NULL.
   - `version`: BIGINT NOT NULL DEFAULT 0 (Control de Concurrencia Optimista).

5. **`transaccion_pago`**:
   - `id`: BIGSERIAL PRIMARY KEY.
   - `cita_id`: BIGINT NOT NULL REFERENCES cita(id) ON DELETE RESTRICT.
   - `mp_preference_id`: VARCHAR(100) NULL.
   - `mp_payment_id`: VARCHAR(100) NULL UNIQUE.
   - `payment_type`: VARCHAR(20) NOT NULL CHECK (payment_type IN ('DEPOSIT_50', 'FINAL_BALANCE_50', 'FULL_PAYMENT')).
   - `amount`: NUMERIC(12, 2) NOT NULL CHECK (amount > 0).
   - `status`: VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'REFUNDED')).
   - `registered_by_user_id`: BIGINT NULL REFERENCES usuario(id) ON DELETE RESTRICT.
   - `payment_date`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW().

6. **`historia_clinica`**:
   - `id`: BIGSERIAL PRIMARY KEY.
   - `paciente_id`: BIGINT NOT NULL UNIQUE REFERENCES paciente(id) ON DELETE RESTRICT (Relación 1:1 estricta).
   - `created_by_user_id`: BIGINT NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT.
   - *Antecedentes Patológicos:* `has_hta`, `has_dbt`, `has_hypothyroidism`, `has_hyperthyroidism`, `has_anemia`, `has_autoimmune_diseases`, `has_glaucoma`, `has_coagulation_disorders`, `has_scarring_alterations` (BOOLEAN NOT NULL DEFAULT FALSE), `other_pathological` (TEXT).
   - *Alergias:* `allergy_anesthesia`, `allergy_egg`, `allergy_fish` (BOOLEAN NOT NULL DEFAULT FALSE), `other_allergies` (TEXT).
   - *Hábitos Tóxicos:* `habit_tobacco`, `habit_alcohol`, `habit_sun_exposure`, `habit_spf_use` (BOOLEAN NOT NULL DEFAULT FALSE).
   - *Gineco/Quirúrgicos y Estéticos:* `surgical_history`, `gynecological_history`, `current_medications`, `previous_aesthetic_treatments` (TEXT).
   - *Evaluación Inicial:* `fitzpatrick_phototype` (VARCHAR(10) NOT NULL CHECK (fitzpatrick_phototype IN ('I', 'II', 'III', 'IV', 'V', 'VI'))), `physical_examination` (TEXT), `treatment_plan` (TEXT), `informed_consent_signed` (BOOLEAN NOT NULL DEFAULT FALSE).

7. **`entrada_hc` (Evolución de Sesión)**:
   - `id`: BIGSERIAL PRIMARY KEY.
   - `historia_clinica_id`: BIGINT NOT NULL REFERENCES historia_clinica(id) ON DELETE RESTRICT.
   - `cita_id`: BIGINT NOT NULL REFERENCES cita(id) ON DELETE RESTRICT.
   - `author_user_id`: BIGINT NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT.
   - `content`: TEXT NOT NULL (Descripción clínica, procedimiento, unidades aplicadas, zonas, observaciones).

8. **`historia_clinica_audit` & `entrada_hc_audit`**:
   - Tablas de auditoría que almacenan `modified_by_user_id`, `modified_at`, `modified_section`, `previous_values` (JSONB) y `new_values` (JSONB).

9. **`imagen_hc`**:
   - `id`: BIGSERIAL PRIMARY KEY.
   - `historia_clinica_id`: BIGINT NOT NULL REFERENCES historia_clinica(id) ON DELETE RESTRICT.
   - `file_path`: VARCHAR(255) NOT NULL UNIQUE (Ruta en Supabase Storage: `photos/{paciente_id}/{uuid}.{ext}`).
   - `original_filename`: VARCHAR(255) NOT NULL.
   - `content_type`: VARCHAR(50) NOT NULL.
   - `file_size`: BIGINT NOT NULL.
   - `description`: VARCHAR(255) NULL.

10. **`bloqueo_calendario`**:
    - `id`: BIGSERIAL PRIMARY KEY.
    - `created_by_user_id`: BIGINT NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT.
    - `start_time`: TIMESTAMP WITH TIME ZONE NOT NULL.
    - `end_time`: TIMESTAMP WITH TIME ZONE NOT NULL CHECK (end_time > start_time).
    - `reason`: VARCHAR(255) NOT NULL.

---

## 6. Pseudo-código y Acuerdos de Negocio (Lógica Transaccional Paso a Paso)

### Transacción 1: Solicitud y Bloqueo Temporal de Turno (10 Minutos TTL)
```text
CUANDO un Paciente o Secretaria solicita reservar un turno para un Servicio S en fecha/hora (T_inicio, T_fin):
  INICIAR TRANSACCIÓN (Nivel: READ COMMITTED con Bloqueo Optimista)
    1. Validar que T_inicio sea >= NOW() + 2 horas y en horario de atención.
    2. Validar que no existan bloqueos de calendario que intersecten con [T_inicio, T_fin].
    3. Consultar si existe alguna cita activa donde:
       (status IN ('PENDING_PAYMENT', 'CONFIRMED', 'COMPLETED'))
       AND (start_time < T_fin AND end_time > T_inicio)
       AND (status != 'PENDING_PAYMENT' OR temporary_hold_deadline > NOW())
    
    SI existe superposición:
      RECHAZAR solicitud con error: "La franja horaria seleccionada ya no está disponible."
      ROLLBACK
    SI NO:
      Crear registro en 'cita':
        status = 'PENDING_PAYMENT'
        agreed_price = Servicio.base_price
        temporary_hold_deadline = NOW() + INTERVAL '10 minutes'
        version = 0
      Generar Preferencia de Pago en MercadoPago SDK por el 50% de agreed_price:
        monto_seña = agreed_price * (Servicio.deposit_percentage / 100)
        items = [{ title: Servicio.name, unit_price: monto_seña, quantity: 1 }]
        back_urls = { success: "...", failure: "...", pending: "..." }
        notification_url = Webhook endpoint
        expires = true (10 minutos)
      Registrar 'transaccion_pago':
        payment_type = 'DEPOSIT_50'
        amount = monto_seña
        status = 'PENDING'
        mp_preference_id = preferencia.id
      COMMIT
      RETORNAR al cliente { cita_id, preference_id, init_point_url, hold_expires_at }
```

### Transacción 2: Procesamiento de Webhook de MercadoPago (Confirmación de Seña)
```text
CUANDO se recibe una notificación HTTP POST de MercadoPago Webhook con { type: 'payment', data.id: payment_id }:
  INICIAR TRANSACCIÓN
    1. Consultar a la API de MercadoPago el estado real del payment_id (evitar falsificaciones).
    2. Obtener la transacción de pago local vinculada por mp_preference_id o mp_payment_id.
    3. Obtener la cita vinculada con bloqueo de versión (@Version).
    
    SI pago.status == 'approved':
      Actualizar transaccion_pago:
        status = 'APPROVED'
        mp_payment_id = payment_id
        payment_date = NOW()
      Actualizar cita:
        status = 'CONFIRMED'
        temporary_hold_deadline = NULL (candado liberado)
      Disparar evento asíncrono de notificación por correo (Turno Confirmado con datos de cita).
    SINO SI pago.status IN ('rejected', 'cancelled'):
      Actualizar transaccion_pago: status = 'REJECTED'
      Actualizar cita: status = 'PAYMENT_FAILED', temporary_hold_deadline = NOW() (libera horario de inmediato)
    
    COMMIT
    RESPONDER HTTP 200 OK a MercadoPago
```

### Transacción 3: Tarea Programada de Liberación de Turnos Vencidos (Scheduler TTL)
```text
CADA 60 segundos (Cron Job en Spring Boot):
  EJECUTAR:
    UPDATE cita
    SET status = 'PAYMENT_FAILED'
    WHERE status = 'PENDING_PAYMENT'
      AND temporary_hold_deadline < NOW();
```

### Transacción 4: Edición de Entrada Clínica con Auditoría Atómica
```text
CUANDO la Médica edita el contenido de una 'entrada_hc' existente con nuevo texto:
  INICIAR TRANSACCIÓN
    1. Validar que el usuario autenticado tenga Rol 'PHYSICIAN'.
    2. Obtener registro 'entrada_hc' actual (old_entry).
    3. Registrar fila en 'entrada_hc_audit':
       entrada_hc_id = old_entry.id
       modified_by_user_id = current_user.id
       previous_content = old_entry.content
       new_content = nuevo_texto
       modified_at = NOW()
    4. Actualizar 'entrada_hc':
       content = nuevo_texto
       updated_at = NOW()
    COMMIT
```

---

## 7. Desglose Modular del Sistema

### Módulo 1: Autenticación, Seguridad y RBAC
- Registro inicial de usuarios y gestión de roles (`ADMIN`, `PHYSICIAN`, `RECEPTIONIST`).
- Login seguro con validación BCrypt (costo 12) y emisión de JWT Stateless (HS256) con expiración de 8 horas.
- Control de ataques de fuerza bruta: bloqueo temporal de 15 minutos tras 5 intentos fallidos consecutivos.
- Recuperación de contraseña mediante token aleatorio criptográfico de un solo uso enviado por correo (15 min de vida útil).

### Módulo 2: Gestión de Pacientes
- Búsqueda en tiempo real por DNI, Nombre o Teléfono.
- Alta, modificación y baja lógica (`active = false`) de pacientes.
- Visualización de historial de citas pasadas y futuras.

### Módulo 3: Catálogo de Servicios y Tarifas Dinámicas
- Administración de servicios dermatológicos/estéticos (nombre, descripción, duración en minutos, precio base, % de seña e intervalo recomendado de sesión de seguimiento).
- Actualización dinámica de precios que aplica de forma inmediata a nuevas reservas sin alterar citas previamente confirmadas (`agreed_price`).

### Módulo 4: Agenda, Turnos y Bloqueos de Calendario
- Vista interactiva de calendario (diaria, semanal, mensual) para Médica y Secretaria.
- Gestión de indisponibilidades mediante Bloqueos de Calendario (vacaciones, feriados, congresos médicos).
- Algoritmo de cálculo de slots disponibles según duración del servicio y bloqueos existentes.

### Módulo 5: Motor Transaccional de Pagos (MercadoPago y Efectivo)
- Generación de preferencias de pago con Checkout Pro para cobro de seña (50%).
- Receptor de Webhooks asíncronos con verificación de idempotencia y validación contra API de MercadoPago.
- Registro en mostrador del saldo final (50% restante) en efectivo, tarjeta POS o transferencia al concluir el turno.

### Módulo 6: Historia Clínica Digital, Registro Fotográfico y Auditoría Médica
- Ficha clínica inicial estructurada (anamnesis completa, antecedentes patológicos, alergias, fototipo Fitzpatrick I-VI, examen físico facial y corporal).
- Hojas de evolución clínica asociadas al identificador único de cada turno (`entrada_hc`).
- Carga y visualización de fotografías médicas de alta resolución almacenadas en buckets privados de Supabase Storage mediante URLs prefirmadas.
- Pistas de auditoría inmutables (`historia_clinica_audit` y `entrada_hc_audit`) con trazabilidad completa de cambios.

### Módulo 7: Asistente Virtual Inteligente con Google Gemini API
- Widget de Chatbot en el landing público de la clínica.
- Integración con el modelo `gemini-1.5-flash` a través de un cliente REST/SDK con System Prompt acotado al catálogo de servicios de la clínica.
- Asesoramiento en lenguaje natural sobre tratamientos, cuidados pre/post procedimiento, rangos de duración y precios.
- Derivación automática mediante links directos al selector de turnos con el servicio preseleccionado.

---

## 8. Análisis de Pros y Contras de las Decisiones Arquitectónicas

| Componente / Decisión | Pros (Ventajas) | Contras / Mitigaciones |
| :--- | :--- | :--- |
| **Monolito Modular en Capas (Clean Architecture) en Spring Boot** | - Máxima cohesión y bajo acoplamiento.<br>- Transacciones ACID nativas sin complejidad de microservicios distribuidos (Saga/2PC).<br>- Facilidad de testing integral y despliegue rápido. | Requiere disciplina de equipo para evitar acoplar capas de dominio con controladores o frameworks (mitigado mediante reglas de dependencias estrictas). |
| **React 18 + TypeScript + Vite + Tailwind + Shadcn** | - Carga ultrarrápida (SPA bundle optimizado).<br>- Tipado estricto extremo a extremo.<br>- Componentes accesibles (Radix UI) y diseño profesional sobrio acorde a una clínica médica. | Curva de aprendizaje inicial de TypeScript estricto con Zod y React Hook Form. |
| **Supabase (PostgreSQL 15+ & Storage)** | - Base de datos relacional estándar robusta con extensiones JSONB y UUID.<br>- Almacenamiento seguro S3-compatible integrado para fotos médicas.<br>- Costo operativo cero en tiers de desarrollo. | Requiere gestionar pool de conexiones (HikariCP) configurando adecuadamente el connection string transaccional. |
| **MercadoPago Checkout Pro con Seña 50% y 10 min TTL** | - Reduce la tasa de inasistencias (*no-shows*) a menos del 5%.<br>- Los pacientes pagan con cualquier medio (tarjeta, débito, dinero en cuenta) sin fricción.<br>- Webhook asíncrono garantiza confirmación desatendida. | Dependencia de la disponibilidad de la API de MercadoPago (mitigado con opción de cobro manual para secretarias). |
| **Google Gemini API para Chatbot Público** | - Respuestas naturales, empáticas y contextualizadas sobre tratamientos estéticos.<br>- Gran ventana de contexto para inyectar el catálogo completo de servicios.<br>- Aumenta la conversión de visitantes a turnos confirmados. | Riesgo de alucinaciones médicas (mitigado con System Prompt restrictivo que prohíbe diagnósticos y exige validación médica presencial). |
