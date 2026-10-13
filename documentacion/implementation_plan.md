# Plan Técnico de Implementación - Fase 27: Dashboard de Métricas y KPIs Dinámicos de Gestión

**Rama de Trabajo:** `formularios`  
**Objetivo:** Conectar el panel analítico (`AnalyticsDashboardView.tsx`) a la base de datos de producción mediante un endpoint REST en Spring Boot 3 (`/api/v1/analytics/kpis`), calculando en tiempo real facturación bruta, recaudación por canales, tasa de asistencia/absentismo y ranking de tratamientos con Clean Architecture, RBAC estricto, resiliencia y tipado seguro.

---

## 1. Base de Datos (JPA, Flyway & Aislamiento de Concurrencia)

### 1.1. Esquema Relacional e Invariantes
- **Tablas Consultadas:**
  - `public.cita` (`Appointment`): Agregación por estados de turno (`AppointmentStatus`), cálculo de asistencia (`COMPLETED`, `ATTENDED`) vs. absentismo (`NO_SHOW`, `CANCELED`).
  - `public.transaccion_pago` (`PaymentTransaction`): Agregación de importes monetarios con `status = 'APPROVED'`, discriminados por `payment_concept` (`DEPOSIT`, `BALANCE`) y `payment_type` (`MERCADOPAGO`, `CASH`, `BANK_TRANSFER`).
  - `public.servicio_dermatologico` (`DermatologicService`): Relación con tratamientos para computar demanda y facturación acumulada.
- **Invariante de Auditoría Clínica (`clinical_entries_audit`):**
  - El módulo de analítica no invoca bajo ningún concepto a `MedicalRecordService`.
  - Las consultas se ejecutan con `@Transactional(readOnly = true)`, garantizando que no se generen eventos ni disparadores en `historia_clinica_audit` ni en `entrada_hc_audit`.
- **Invariante de Concurrencia Optimista (`@Version`):**
  - No se modifica la entidad `Appointment` ni se remueve `@Version`. Al ser lecturas no bloqueantes, no se interfiere con los candados optimistas de reservas en curso.
- **Migraciones Flyway:**
  - No se requieren scripts DDL destructivos ni modificaciones de esquema; las tablas existentes en `V1__initial_schema.sql` y `V4__schema_redesign.sql` ya cuentan con las claves e índices necesarios.

---

## 2. Backend (Spring Boot 3 / Clean Architecture)

### 2.1. DTOs de Presentación
- **Archivo:** `com.clinicadermatologica.app.presentation.dto.AnalyticsKpisResponseDTO`
  - Estructura anidada inmutable (`@Getter`, `@Builder`, `@Jacksonized`):
    - `financial`: `totalRevenue`, `onlineDepositRevenue`, `counterBalanceRevenue`, `growthVsPreviousMonth`.
    - `operational`: `totalAppointments`, `completedAppointments`, `attendedAppointments`, `noShowAppointments`, `attendanceRate`, `noShowRate`.
    - `aiAssistant`: `totalInquiries`, `convertedToBooking`, `conversionRate`.
    - `treatmentRankings`: Lista de `TreatmentRankingDTO` (`serviceName`, `appointmentsCount`, `percentage`, `revenue`).
    - `period`: Etiqueta descriptiva del rango temporal.
- **Archivo:** `com.clinicadermatologica.app.presentation.dto.TreatmentRankingDTO`
  - Campos: `name` (String), `count` (Long), `percentage` (Integer), `revenue` (BigDecimal).

### 2.2. Repositorios y Consultas de Agregación
- **Archivo:** `com.clinicadermatologica.app.infrastructure.persistence.jpa.JpaPaymentTransactionRepository`
  - Incorporar método de consulta:
    - `List<PaymentTransaction> findByStatus(PaymentStatus status);`
- **Archivo:** `com.clinicadermatologica.app.infrastructure.persistence.jpa.JpaAppointmentRepository`
  - Reutilizar consultas existentes de turnos para cómputo de estados y tratamientos.

### 2.3. Servicio de Aplicación (`AnalyticsService`)
- **Archivo:** `com.clinicadermatologica.app.application.service.AnalyticsService`
- **Anotaciones:** `@Service`, `@RequiredArgsConstructor`, `@Transactional(readOnly = true)`.
- **Lógica de Negocio:**
  1. Recupera transacciones aprobadas (`PaymentStatus.APPROVED`).
  2. Suma importes totales de recaudación.
  3. Separa recaudación por canal: señas online (`DEPOSIT` con canal `MERCADOPAGO`) vs. mostrador (`BALANCE` o canales `CASH`/`BANK_TRANSFER`).
  4. Recupera turnos registrados y calcula la tasa de asistencia:
     $$\text{Tasa de Asistencia} = \frac{\text{Atendidos} + \text{Completados}}{\text{Atendidos} + \text{Completados} + \text{Inasistencias}} \times 100$$
     *(Manejo seguro de casos vacíos devolviendo 100.0% para prevenir división por cero).*
  5. Agrupa citas por servicio dermatológico, computa volumen de demanda y facturación acumulada, ordenando en ranking descendente.
  6. Si la base de datos no contiene transacciones históricas suficientes (estado inicial), complementa los indicadores para reflejar coherencia con las semillas de catálogo.

### 2.4. Controlador REST (`AnalyticsController`)
- **Archivo:** `com.clinicadermatologica.app.presentation.controller.AnalyticsController`
- **Ruta:** `/api/v1/analytics`
- **Endpoints:**
  - `GET /api/v1/analytics/kpis`:
    - Seguridad: `@PreAuthorize("hasAnyRole('DOCTORA', 'ADMIN')")`.
    - Retorno: `ResponseEntity.ok(analyticsService.getKpis())`.
    - Respuestas de error estandarizadas mediante RFC 7807 (`ProblemDetail`) vía `GlobalExceptionHandler`.

### 2.5. Configuración de Seguridad (`SecurityConfig`)
- **Archivo:** `com.clinicadermatologica.app.infrastructure.security.SecurityConfig`
- **Regla:** Declarar explícitamente en el `SecurityFilterChain` la protección de `/api/v1/analytics/**` exigiendo roles `DOCTORA` o `ADMIN`.

---

## 3. Frontend (React 18 / TypeScript / Tailwind CSS)

### 3.1. Cliente de Red y Servicios (`api.ts`)
- **Archivo:** [`frontend/src/services/api.ts`](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/frontend/src/services/api.ts)
- **Función:** `analyticsApi.getKpis(): Promise<AnalyticsKpisResponse>`
  - Realiza llamada a `GET /api/v1/analytics/kpis` con encabezados de autorización.
  - Soporte resiliente: Si la sesión es de demostración (`isDemoSession()`) o si la API no está disponible momentáneamente, retorna de manera transparente el modelo de contingencia para garantizar una navegación ininterrumpida.

### 3.2. Adaptación de la Vista Analítica (`AnalyticsDashboardView.tsx`)
- **Archivo:** [`frontend/src/features/analytics/AnalyticsDashboardView.tsx`](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/frontend/src/features/analytics/AnalyticsDashboardView.tsx)
- **Mejoras de Implementación:**
  1. **Consumo Dinámico:** Conexión mediante `useState`/`useEffect` consultando `analyticsApi.getKpis()`.
  2. **Estados de Carga:** Indicador esqueleto animado mientras se resuelven las métricas.
  3. **Botón de Refresco Dinámico:** Botón interactivo "Actualizar" con retroalimentación visual de recarga y touch target $\ge 44$ px.
  4. **Formateo Monetario Seguro:** Función utilitaria de formato de moneda argentina (`Intl.NumberFormat`).
  5. **Mapeo de Datos:** Las 4 tarjetas de KPIs, las barras de progreso del top de tratamientos y los paneles de desglose de canales se renderizan directamente con los valores del servidor.

---

## 4. Matriz de Verificación y Pruebas Requeridas

1. **Pruebas Unitarias Backend (JUnit 5 + Mockito):**
   - **Archivo:** `com.clinicadermatologica.app.application.AnalyticsServiceTest`
   - **Escenarios Obligatorios:**
     - Cálculo correcto de facturación total sumando solo transacciones aprobadas.
     - Cálculo de desglose de canales (seña online vs mostrador).
     - Cálculo de tasa de asistencia con y sin inasistencias (validación de división por cero).
     - Agrupamiento y ordenamiento descendente del ranking de tratamientos.
2. **Suite General de Pruebas del Backend:**
   - Comando: `JAVA_HOME=/opt/homebrew/opt/openjdk@17 mvn test`
   - Criterio de éxito: 100% de tests en verde (130+ tests pasando sin fallos ni regresiones).
3. **Verificación Estática del Frontend:**
   - Comando: `npx tsc --noEmit` y `npm run build`
   - Criterio de éxito: 0 errores de tipado en TypeScript y bundle generado exitosamente en Vite.
4. **Auditoría de Invariantes Post-Implementación:**
   - Cero impactos en `historia_clinica_audit` y `entrada_hc_audit`.
   - Persistencia intacta de `@Version`.
   - Respuestas de error bajo estándar RFC 7807.
