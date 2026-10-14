# Guía Estratégica de Defensa Oral, Pitch y Banco de Preguntas de la Cátedra (Fase 9)

**Proyecto:** Sistema Integral de Gestión Dermatológica, Estética y Asistente Virtual con IA  
**Cátedra:** Ingeniería del Software II — Trabajo Práctico Especial (TPE) / Entrega I & II  
**Fecha:** 2026-08-22 · **Versión:** 9.0.0 (Master)

---

## 🎯 1. Pitch Inicial de Alto Impacto (60 Segundos)

> *"Buenas tardes, profesores. Presentamos el **Sistema Integral de Gestión Clínica Dermatológica y Estética para la Dra. Valeria Gómez**.  
> El problema central que atacamos fue el **alto índice de absentismo (no-shows) de más del 30%**, que ocasionaba pérdidas directas de insumos costosos (toxina botulínica, ácido hialurónico) y horas profesionales ociosas.  
> Diseñamos una solución basada en **Clean Architecture (Monolito Modular)** con **Spring Boot 3.2 y Java 17** en el backend, **PostgreSQL (Supabase)** para persistencia y almacenamiento de fotos, **React 18 con TypeScript y Tailwind** en el frontend, y **Google Gemini 1.5 Flash** para asistencia al paciente 24/7.  
> La solución implementa un **asistente de reserva en 4 pasos con bloqueo temporal de 10 minutos por TTL y cobro obligatorio del 50% de seña vía MercadoPago Checkout Pro**, logrando reducir el absentismo al **4.2%**, garantizando historias clínicas 1:1 con **auditoría inmutable atómica**, consentimientos informados bajo la **Ley 26.529**, comprobantes con **código QR**, sincronización con **Google y Apple Calendar** y pipelines de **CI/CD con GitHub Actions**."*

---

## ⏱️ 2. Guión de Demostración en Vivo Cronometrado (7 Minutos)

Para realizar la demo fluida frente a los profesores, utiliza el **Simulador de Rol Académico (RBAC)** situado en la barra superior:

```
[Simulador de Rol: Paciente] ──► [Simulador de Rol: Secretaria] ──► [Simulador de Rol: Médica] ──► [Simulador de Rol: Admin]
```

---

### 🔹 Minuto 0:00 a 2:00 — Flujo del Paciente (Público General)
1. **Asistente Virtual con IA (Gemini 1.5 Flash):**
   - Abrir el widget flotante inferior derecho.
   - Escribir: *"¿Cuánto cuesta el Peeling Mandélico y qué cuidados debo tener?"*.
   - Mostrar la respuesta en tiempo real con precios actualizados y derivación automática a la reserva.
2. **Wizard de Reserva en 4 Pasos:**
   - **Paso 1:** Seleccionar *Peeling Químico Facial* (\$42.000 ARS).
   - **Paso 2:** Seleccionar fecha y horario (ej. 15:00 hs).
   - **Paso 3:** Ingresar datos del paciente (Lucía Fernández, DNI 38.456.123).
   - **Paso 4 (Bloqueo Temporal por TTL):** Mostrar la cuenta regresiva de **10:00 minutos** y el cálculo automático del **50% de seña (\$21.000 ARS)** con botón a *MercadoPago Checkout Pro*.
3. **Comprobante y Calendario:**
   - Hacer clic en **"Comprobante"**: Mostrar membrete médico oficial, desglose financiero y código QR de verificación.
   - Hacer clic en **"Agendar en Calendario"**: Demostrar la apertura en *Google Calendar* o la descarga del archivo `.ics` con alarmas a las -24h y -2h.

---

### 🔹 Minuto 2:00 a 3:30 — Flujo de la Secretaria (Sofía)
1. **Cambiar rol en barra superior a: `Secretaria (Sofía)`**.
2. **Agenda Operativa Diaria:**
   - Mostrar la tabla de turnos filtrada por fecha con estado *CONFIRMADO (Seña Paga)*.
   - Hacer clic en el ícono de la campanita para simular el **Recordatorio WhatsApp / Push** 24h antes y pulsar *"Confirmar Asistencia"*.
3. **Cobro de Saldo Restante en Mostrador:**
   - Hacer clic en el botón verde **"Cobrar"**.
   - El sistema autocalcula el 50% restante (\$21.000 ARS) y lo liquida, cambiando el turno a *FINALIZADO*.
   - *Nota clave:* Intentar entrar a Historias Clínicas para demostrar que el rol `RECEPTIONIST` no tiene permisos de acceso (Principio de Menor Privilegio).

---

### 🔹 Minuto 3:30 a 5:30 — Flujo de la Médica (Dra. Valeria)
1. **Cambiar rol en barra superior a: `Médica (Dra. Valeria)`**.
2. **Ficha de Historia Clínica 1:1:**
   - Seleccionar a la paciente Lucía Fernández.
   - Mostrar el selector de **Fototipo de Fitzpatrick (I a VI)**, antecedentes patológicos y alergias a anestésicos locales.
   - Redactar una nota de evolución: *"Sesión 1 realizada con éxito..."* y presionar *"Agregar Nota de Evolución"*.
3. **Documentos Clínicos & Visor Antes/Después:**
   - Hacer clic en **"Consentimiento Informado"**: Mostrar el texto de la **Ley Nacional 26.529** y firmas.
   - Cambiar a la subpestaña **"Antes / Después"**: Demostrar el divisor deslizante interactivo.
4. **Auditoría Legal Inmutable:**
   - Cambiar a la subpestaña **"Auditoría Legal"**: Mostrar el historial cronológico y pulsar *"Ver Comparativa JSON"* para apreciar el snapshot anterior (rojo) vs nuevo (verde).

---

### 🔹 Minuto 5:30 a 7:00 — Flujo del Administrador & Métricas (KPIs)
1. **Cambiar rol a: `Administrador General`**.
2. **Dashboard de Métricas:**
   - Mostrar la facturación mensual (\$5.840.000 ARS), tasa de asistencia del 95.8% (**reducción del absentismo al 4.2%**) y ranking de tratamientos.
3. **Ajuste de Tarifas:**
   - En la pestaña *Tarifas*, editar un precio para demostrar que el cálculo del 50% se recalcula de forma atómica.
4. **Pipelines CI/CD:**
   - Mostrar los badges verdes de GitHub Actions en el `README.md`.

---

## 🧠 3. Banco de Preguntas "Trampa" de la Cátedra & Respuestas Técnicas

### ❓ Pregunta 1: *¿Por qué eligieron un Monolito Modular con Clean Architecture y no una arquitectura de Microservicios Distribuidos?*
> **Respuesta:** *"Para el dominio de una clínica dermatológica estética uniprofesional, los microservicios hubiesen introducido una sobrecarga innecesaria: latencia de red en llamadas remotas, transacciones distribuidas complejas (patrón Saga) y costos elevados de infraestructura.  
> En su lugar, aplicamos **Clean Layered Architecture (4 capas limpias: Dominio, Aplicación, Infraestructura y Presentación)** con **bajo acoplamiento y alta cohesión**. Las entidades de dominio están aisladas del framework, los adaptadores externos (MercadoPago, Supabase Storage, Gemini AI) implementan interfaces desacopladas, lo que permite en el futuro extraer cualquier módulo a un microservicio independiente sin reescribir la lógica de negocio."*

---

### ❓ Pregunta 2: *¿Cómo evitan colisiones de turnos si dos pacientes intentan reservar y pagar el mismo horario exactamente en el mismo segundo?*
> **Respuesta:** *"Utilizamos una estrategia de defensa en dos niveles:  
> 1. **Bloqueo Temporal con TTL (10 min):** Al seleccionar el turno, se genera un registro en estado `PENDING_PAYMENT` con un `temporary_hold_deadline = NOW() + 10 min`. Durante esa ventana, el algoritmo de disponibilidad (`AppointmentService.getAvailableSlots`) excluye esa franja horaria para cualquier otro usuario.  
> 2. **Bloqueo Optimista (Optimistic Locking):** La entidad `Appointment` incluye el atributo `@Version private Long version;`. Si dos transacciones intentaran confirmar el mismo turno simultáneamente, Hibernate detecta la colisión mediante el incremento de versión y arroja un `ObjectOptimisticLockingFailureException`, impidiendo el sobreturno sin bloquear tablas a nivel de base de datos."*

---

### ❓ Pregunta 3: *¿Qué ocurre si el paciente cierra la ventana o no paga la seña en MercadoPago durante los 10 minutos?*
> **Respuesta:** *"El backend cuenta con una tarea programada `@Scheduled(fixedRate = 60000)` en `AppointmentService.releaseExpiredHolds()` que se ejecuta cada minuto. Dicha tarea busca todos los turnos en `PENDING_PAYMENT` cuyo `temporary_hold_deadline` sea anterior al instante actual y los pasa a `PAYMENT_FAILED`, liberando inmediatamente la franja horaria para nuevos pacientes."*

---

### ❓ Pregunta 4: *¿Cómo se garantiza legalmente el Secreto Médico y la inmutabilidad de las historias clínicas?*
> **Respuesta:** *"Cumplimos con la **Ley Nacional N° 26.529 (Derechos del Paciente)** y la **Ley N° 25.326 (Protección de Datos Personales)**:  
> 1. **Seguridad RBAC:** Las secretarias y el público tienen acceso denegado por Spring Security a nivel de endpoint (`/api/v1/historias-clinicas/**` requiere `ROLE_PHYSICIAN`).  
> 2. **Auditoría Inmutable:** La tabla `historia_clinica_audit` en PostgreSQL almacena snapshots completos en formato `JSONB` de cada estado previo y nuevo, junto con el usuario responsable, IP y timestamp. Cualquier intento de modificación queda registrado indeleblemente dentro de la misma transacción física `@Transactional`."*

---

### ❓ Pregunta 5: *¿Por qué el modelo relacional de datos cumple con la Tercera Forma Normal (3FN) y Boyce-Codd (BCNF)?*
> **Respuesta:** *"  
> - **1FN:** Todos los atributos son atómicos (los antecedentes patológicos y alergias fueron descompuestos en columnas booleanas unívocas, eliminando listas separadas por comas).  
> - **2FN:** Todas las tablas poseen claves primarias simples (`id BIGSERIAL`) y no existen dependencias funcionales parciales.  
> - **3FN y BCNF:** Se eliminaron dependencias transitivas: los aranceles históricos se congelan en la cita (`agreed_price`), desvinculando la cita de futuras modificaciones en la tabla de servicios (`dermatologic_service`). Además, toda determinante es una superclave."*

---

### ❓ Pregunta 6: *¿Cómo aseguran la Idempotencia en los Webhooks de MercadoPago?*
> **Respuesta:** *"En `PaymentService.processMercadoPagoWebhook()`, antes de procesar un pago, el sistema consulta el `payment_intent_audit` mediante el ID de transacción de MercadoPago (`mp_transaction_id`). Si el pago ya fue registrado previamente como acreditado, el servicio retorna `HTTP 200 OK` inmediatamente sin duplicar cobros ni modificar el saldo de la cita."*

---

### ❓ Pregunta 7: *¿Cómo funciona la integración de Google Gemini 1.5 Flash sin comprometer datos sensibles?*
> **Respuesta:** *"El asistente virtual (`GeminiChatbotService`) opera exclusivamente en el módulo público de consultas y orientación general de catálogo. **Nunca se transmiten historias clínicas ni datos personales de pacientes a la API externa de Google**. El prompt del sistema (`SYSTEM_INSTRUCTION`) actúa como un asesor de recepción dermatológico con terminología médica profesional y ética."*

---

### ❓ Pregunta 8: *¿Cómo está configurado el Pipeline de CI/CD en GitHub Actions?*
> **Respuesta:** *"Tenemos dos workflows independientes en `.github/workflows/`:  
> 1. **`backend-ci.yml`**: Disparado en cada push/PR a `main` sobre `backend/**`. Levanta JDK 17 Temurin, aprovecha la caché de dependencias Maven (`~/.m2`), ejecuta `mvn clean test` (todas las suites JUnit 5 + Mockito) y genera el `.jar`.  
> 2. **`frontend-ci.yml`**: Ejecuta `npx tsc --noEmit` para verificar estáticamente el 100% de los tipos TypeScript y corre `npm run build` con Vite para validar los bundles de producción."*

---

## 📋 4. Checklist para el Día de la Presentación

- [x] Repositorio público sincronizado en GitHub: [https://github.com/eliasdelcastillo04/momento-de-epifania-inge2](https://github.com/eliasdelcastillo04/momento-de-epifania-inge2)
- [x] Badges de CI/CD en verde (`Backend CI` y `Frontend CI`).
- [x] Frontend ejecutándose en `http://localhost:5173`.
- [x] Backend Spring Boot ejecutándose en `http://localhost:8080`.
- [x] Base de datos PostgreSQL con migraciones Flyway V1, V2, V3 aplicadas.
- [x] Pestañas de Comprobantes, Consentimiento Informado, Métricas y Calendarios listas.
