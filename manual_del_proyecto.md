# Manual del Proyecto — Sistema de Gestión de Clínica Dermatológica

> **Qué es este documento.** Una guía rápida pero completa para entender todo el proyecto:
> arquitectura, estructura de carpetas y archivos, entidades y cómo se comunican, los tres
> casos de uso que pide la cátedra explicados paso a paso, los patrones de diseño aplicados,
> la seguridad, los diagramas que ya construimos y cómo se desarrolla el proyecto junto a
> agentes de IA.
>
> **Para quién.** Gente del ambiente (que sabe qué es un controlador, una entidad JPA o un
> componente React), pero sin asumir conocimiento previo de *este* sistema en particular.
>
> **Cómo leerlo.** Las secciones 1 a 4 dan el panorama y el veredicto frente a la cátedra.
> Las 5 a 9 son la referencia estructural. La 10 es el corazón: los tres casos de uso.
> Las 11 a 15 cubren procesos, IA, build y deuda conocida.
>
> **Nota de método.** Todo lo que se afirma acá fue verificado leyendo el código, no inferido
> del nombre de los archivos. Donde hay una inconsistencia entre la documentación previa y el
> código, se señala explícitamente (ver sección 15).

---

## Índice

1. [Qué hace el sistema](#1-qué-hace-el-sistema)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Arquitectura: la pregunta del MVC](#3-arquitectura-la-pregunta-del-mvc)
4. [Checklist de la cátedra: cumple / no cumple](#4-checklist-de-la-cátedra-cumple--no-cumple)
5. [Estructura de carpetas](#5-estructura-de-carpetas)
6. [Estructura de archivos del backend](#6-estructura-de-archivos-del-backend)
7. [Entidades, enums y comunicación entre ellas](#7-entidades-enums-y-comunicación-entre-ellas)
8. [Los tres patrones de diseño](#8-los-tres-patrones-de-diseño)
9. [Seguridad](#9-seguridad)
10. [Los tres casos de uso, paso a paso](#10-los-tres-casos-de-uso-paso-a-paso)
11. [Procesos automáticos y comunicación con sistemas externos](#11-procesos-automáticos-y-comunicación-con-sistemas-externos)
12. [Diagramas de diseño y de secuencia](#12-diagramas-de-diseño-y-de-secuencia)
13. [Desarrollo asistido por agentes de IA](#13-desarrollo-asistido-por-agentes-de-ia)
14. [Build, ejecución, tests y despliegue](#14-build-ejecución-tests-y-despliegue)
15. [Inconsistencias conocidas y deuda técnica](#15-inconsistencias-conocidas-y-deuda-técnica)
16. [Guía de defensa oral](#16-guía-de-defensa-oral)

---

## 1. Qué hace el sistema

Es un sistema de gestión para una clínica dermatológica. El **actor principal es el personal
interno** de la clínica (roles `ADMIN`, `DOCTORA`, `SECRETARIA`); el paciente no opera el
sistema, aunque sí existe una parte pública (landing, catálogo de tratamientos, link de pago).

Funcionalidades principales:

| Módulo | Qué resuelve |
| :--- | :--- |
| **Turnos (citas)** | Reserva con bloqueo temporal de 10 minutos, cálculo de disponibilidad, agenda del staff, reprogramación, cancelación |
| **Pagos** | Seña y saldo final por tres canales: efectivo, transferencia bancaria y MercadoPago (Checkout Pro con webhook) |
| **Pacientes** | Alta, búsqueda por nombre/DNI, validación de DNI/email/teléfono únicos |
| **Historia clínica** | Anamnesis, entradas clínicas, alergias, antecedentes, hábitos, fotos de tratamiento, auditoría inmutable. Contenido sensible cifrado con AES-256-GCM |
| **Catálogo de servicios** | Tratamientos con duración, precio base y porcentaje de seña |
| **Bloqueos de calendario** | Franjas no disponibles (vacaciones, licencias) |
| **Analítica** | Dashboard de KPIs y ranking de tratamientos |
| **Asistente virtual** | Chatbot público sobre la API de Google Gemini |

El concepto de negocio más característico es el **bloqueo temporal (hold)**: cuando se
reserva un turno, el horario queda retenido 10 minutos en estado `PENDING_PAYMENT`. Durante
esa ventana nadie más puede tomarlo. Si no se registra el pago, el turno se cancela y el
horario se libera. Es la misma mecánica que la venta de pasajes o entradas.

---

## 2. Stack tecnológico

### Backend

| Componente | Versión / detalle |
| :--- | :--- |
| Java | 17 |
| Spring Boot | 3.2.3 (parent `spring-boot-starter-parent`) |
| Starters | `web`, `security`, `data-jpa`, `validation`, `webflux` (solo para `WebClient` hacia Gemini) |
| Persistencia | Spring Data JPA + Hibernate, PostgreSQL |
| Migraciones | Flyway 10.7.2 (`flyway-core` + `flyway-database-postgresql`) |
| JWT | JJWT 0.12.5 (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`) |
| Pagos | MercadoPago SDK Java 2.1.20 |
| Boilerplate | Lombok 1.18.38 |
| Tests | JUnit 5 + Mockito + AssertJ (`spring-boot-starter-test`) + `spring-security-test` |
| Artefacto | `com.clinicadermatologica:clinica-dermatologica-backend:1.0.0` |

Prefijo global de rutas: **`/api/v1`**, definido con `server.servlet.context-path` en
`application.yml`. No está repetido en los `@RequestMapping` de los controladores.

### Frontend

| Componente | Versión |
| :--- | :--- |
| React / React DOM | ^18.2.0 |
| TypeScript | ^5.3.3 |
| Vite | ^5.1.4 |
| React Router | ^7.18.2 |
| axios | ^1.6.7 |
| TanStack React Query | ^5.24.1 |
| react-hook-form + zod | ^7.50.1 / ^3.22.4 |
| Tailwind CSS | ^3.4.1 |
| motion (Framer Motion) | ^13.4.4 |
| lucide-react (iconos) | ^0.344.0 |
| sonner (toasts) | ^2.0.8 |
| qrcode.react | ^4.2.0 |
| @supabase/supabase-js | ^2.112.3 |

El script `build` es `tsc && vite build`: el build **sí** verifica tipos. No hay framework
de testing en el frontend.

### Servicios externos

- **PostgreSQL** (local vía Docker, o Supabase en la nube).
- **MercadoPago** — Checkout Pro, preferencias de pago y webhook de notificaciones.
- **Google Gemini** — asistente virtual, con cascada de 6 modelos de respaldo.
- **Supabase Storage** — bucket `photos` para fotos clínicas.

---

## 3. Arquitectura: la pregunta del MVC

El proyecto **no** es un MVC clásico literal. Implementa una **arquitectura en capas
(Layered)**, que es la forma que toma el MVC en una aplicación web desacoplada. El mapeo es
directo:

| Rol en MVC | Dónde vive | Qué contiene |
| :--- | :--- | :--- |
| **Controlador** | `presentation/controller` + `presentation/dto` | `@RestController` que reciben HTTP y devuelven JSON |
| **Lógica de negocio** | `application/service` + `application/strategy` | `@Service` con las reglas y la coordinación de casos de uso |
| **Modelo** | `domain/model` + `infrastructure/persistence/dao` | Entidades JPA y acceso a datos (DAO) |
| **Vista** | `frontend/src` (React) | SPA que consume la API REST |

El punto clave: **el backend no tiene vista**. Expone JSON. La vista es el frontend React.
Por eso la respuesta correcta en una defensa no es "sí, es MVC" ni "no, no es MVC", sino:

> Seguimos una arquitectura en capas. El Controlador y el Modelo están en el backend Spring
> Boot (Presentación → Servicio → Persistencia/DAO → Base de datos) y la Vista es el frontend
> React que consume la API REST. Es la forma habitual del MVC en aplicaciones web desacopladas.

### El flujo es cerrado

Una capa cerrada significa que una petición que baja desde arriba **debe** pasar por la capa
inmediatamente inferior, sin saltearse ninguna. Acá se cumple:

```
Navegador (React)
    │  HTTP + JSON, Bearer JWT
    ▼
@RestController  ──── recibe, valida formato (@Valid), delega
    │
    ▼
@Service  ──────────── reglas de negocio, @Transactional
    │
    ▼
DAO (interfaz Spring Data JPA)  ──── acceso a datos
    │
    ▼
PostgreSQL
```

Dos verificaciones concretas sobre el código:

- **Ningún controlador inyecta un DAO.** `AppointmentController` inyecta `AppointmentService`
  y `PaymentService`. `PatientController` inyecta `PatientService`. Y así con el resto.
- **Ningún servicio toca la base de datos salteando el DAO.** `AppointmentService` depende de
  `AppointmentDAO`, `PatientDAO`, `DermatologicServiceDAO`, `UserDAO`, `PaymentTransactionDAO`
  y `CalendarBlockDAO`, todos inyectados por constructor.

### Sobre el nombre de los paquetes

Los paquetes se llaman `presentation`, `application`, `domain` e `infrastructure`, que son
nombres de vocabulario hexagonal / Clean Architecture. **Eso es solo nomenclatura.** La
estructura real que importa es la de capas:

- `presentation` → capa de Presentación
- `application` → capa de Lógica de Negocio
- `infrastructure/persistence/dao` → capa de Persistencia (DAO)
- `infrastructure/{payment,ai,notification,storage,security,scheduling}` → middleware técnico
- `domain/model` → las entidades, que atraviesan las capas como objetos de datos

No hay puertos ni adaptadores intermedios en los casos de uso defendidos. Los servicios
hablan **directo** con los DAO.

**La única excepción** es el módulo de Historia Clínica, que sí usa el esquema
puerto + adaptador: interfaces en `domain/repository` (`MedicalRecordRepository`,
`ClinicalEntryRepository`, etc.), implementadas por clases `...RepositoryAdapter` en
`infrastructure/persistence/adapter`, que delegan en interfaces `Jpa...Repository` de
`infrastructure/persistence/jpa`. Son tres saltos en lugar de uno. Ese módulo **no forma
parte de los tres casos de uso que se defienden**, y se mantiene así por su requisito de
auditoría legal. Conviene tenerlo presente porque si en la defensa alguien abre esa carpeta,
va a ver un patrón distinto al del resto.

---

## 4. Checklist de la cátedra: cumple / no cumple

| # | Requisito | Estado | Dónde se verifica |
| :-- | :--- | :--- | :--- |
| 1 | Arquitectura en capas, flujo cerrado | ✅ Cumple | Paquetes `presentation` / `application` / `infrastructure.persistence.dao`; ningún controlador inyecta un DAO |
| 2 | Patrón DAO explícito, uno por entidad | ✅ Cumple | `infrastructure/persistence/dao`: 6 interfaces, una por entidad |
| 3 | Patrón Singleton explícito | ✅ Cumple | `ConexionBD` (Singleton de libro) + `AesEncryptionService` (`@Scope("singleton")`) |
| 4 | Tercer patrón: Strategy | ✅ Cumple | `PaymentRegistrationStrategy` + 3 implementaciones + `PaymentStrategyFactory` |
| 5 | Conceptos de seguridad (autenticación + autorización por roles) | ✅ Cumple | JWT stateless, BCrypt(12), matriz de rutas en `SecurityConfig`, `@PreAuthorize` por método |
| 6 | Consistencia entre UML y código | ⚠️ Parcial | Ver sección 15: hay desvíos puntuales en los encabezados de la documentación |

Detalle del punto 6 y de otros desvíos menores en la sección 15. El resto se desarrolla a
continuación.

### Sobre el antipatrón del "sumidero arquitectónico"

La crítica habitual a la arquitectura en capas es que las peticiones atraviesen capas sin
que ninguna haga nada (puro pasamanos). La regla de referencia es 80-20: al menos ~80% de
las operaciones deberían ejecutar lógica real en las capas que atraviesan.

Acá los servicios concentran lógica sustantiva. Ejemplos concretos y verificables:

- `AppointmentService.bookTemporaryHold` ejecuta ~10 decisiones de negocio: valida servicio
  activo, calcula `endTime` según la duración del servicio, rechaza fechas pasadas, consulta
  bloqueos de calendario, detecta y expira holds vencidos, resuelve colisiones, calcula la
  seña, crea el turno, genera la preferencia de pago y persiste la transacción.
- `PaymentService.registerDepositPayment` valida estado, vencimiento del hold (y cancela si
  venció), rechaza MercadoPago por esa vía, valida el rango del monto, determina el concepto
  y delega en la estrategia.
- `PaymentService.processMercadoPagoWebhook` valida firma HMAC, consulta el estado real
  contra la API, aplica idempotencia y mapea estados.
- `AppointmentService.getAvailableSlots` genera franjas, aplica antelación mínima de 2 horas
  y descarta solapamientos y bloqueos.

Las operaciones de pasamanos (`getAppointmentById`, `getAppointmentsByRange`, que leen y
mapean a DTO) son minoría.

> **Matiz honesto:** no se midió el porcentaje exacto endpoint por endpoint. La afirmación se
> apoya en que los casos de uso núcleo concentran la lógica. Cualitativamente no hay sumidero;
> un conteo formal daría el número preciso.

---

## 5. Estructura de carpetas

### Raíz del repositorio

```
momento-de-epifania-inge2/
├── backend/              Spring Boot 3 (Java 17, Maven)
├── frontend/             React 18 + TypeScript (Vite)
├── docs/                 Documentación propia de trabajo (ignorada por git)
├── documentacion/        Documentación de otra integrante — NO modificar
├── scripts/              mutation_runner.py + mutants_catalog.json
├── .agents/              Metadatos de orquestación de agentes de IA
├── .kiro/hooks/          Hooks del IDE (recordatorios de graphify)
├── .github/workflows/    CI: backend-ci.yml, frontend-ci.yml, jules-agent.yml
├── graphify-out/         Grafo de conocimiento generado (regenerable, no versionado)
├── nextjs/               Carpeta auxiliar
├── AGENTS.md             Reglas para agentes de IA (principio rector: simplicidad)
├── GEMINI.md             Instrucciones para el agente Gemini
├── PROJECT.md            Inventario de features/milestones de una fase previa
├── docker-compose.yml    Stack local: postgres + backend + frontend
├── Dockerfile            Build multi-etapa del backend (para Render)
├── render.yaml           Despliegue del backend en Render
├── vercel.json           Despliegue del frontend en Vercel + proxy inverso
├── .graphifyignore       Alcance del grafo de conocimiento
└── README.md
```

> **Convención importante:** la documentación propia va en `docs/`. La carpeta
> `documentacion/` pertenece a otra persona del equipo y no se toca.

### Backend

```
backend/
├── pom.xml
└── src/
    ├── main/
    │   ├── java/com/clinicadermatologica/app/
    │   │   ├── ClinicaDermatologicaApplication.java    ← punto de entrada
    │   │   ├── presentation/        CAPA 1 — Presentación
    │   │   │   ├── controller/      11 @RestController
    │   │   │   ├── dto/             38 DTOs de request/response
    │   │   │   └── advice/          GlobalExceptionHandler
    │   │   ├── application/         CAPA 2 — Lógica de negocio
    │   │   │   ├── service/         11 @Service
    │   │   │   └── strategy/        Contrato Strategy + Factory
    │   │   ├── domain/              Modelo del dominio
    │   │   │   ├── model/           Entidades JPA, enums, HoldPolicy
    │   │   │   ├── repository/      Puertos (solo Historia Clínica)
    │   │   │   └── exception/       6 excepciones de negocio
    │   │   └── infrastructure/      CAPA 3 — Persistencia + middleware técnico
    │   │       ├── persistence/
    │   │       │   ├── dao/         ← LOS DAO (6 interfaces)
    │   │       │   ├── ConexionBD.java   ← SINGLETON explícito
    │   │       │   ├── jpa/         Repos JPA de Historia Clínica
    │   │       │   └── adapter/     Adaptadores de Historia Clínica
    │   │       ├── payment/
    │   │       │   ├── MercadoPagoPaymentAdapter.java
    │   │       │   ├── MercadoPagoConfigBean.java
    │   │       │   └── strategy/    ← LAS 3 ESTRATEGIAS concretas
    │   │       ├── security/        JWT, SecurityConfig, AES, handlers
    │   │       ├── ai/              GeminiApiClientAdapter
    │   │       ├── notification/    EmailNotificationService
    │   │       ├── scheduling/      HoldExpirationScheduler
    │   │       └── storage/         SupabaseStorageAdapter
    │   └── resources/
    │       ├── application.yml
    │       └── db/migration/        V1 … V6 (Flyway)
    └── test/java/...                16 clases, 115 tests
```

### Frontend

```
frontend/src/
├── main.tsx              Bootstrap de React
├── App.tsx               Routing completo (público + protegido por rol)
├── index.css             Tailwind
├── components/
│   ├── ui/               Design system propio: Button, Card, Modal, Input, Select…
│   ├── reactbits/        Componentes visuales: Aurora, Stepper, GlideSelect…
│   ├── DashboardLayout.tsx
│   ├── ProtectedRoute.tsx    ← guard de rutas por rol
│   ├── RoleGuard.tsx         (existe pero App.tsx no lo usa)
│   ├── Navbar.tsx / BottomNav.tsx / navConfig.ts
│   ├── GeminiChatbotWidget.tsx
│   └── ErrorBoundary.tsx
├── features/             Organización por caso de uso
│   ├── public/           LandingPageView, ServicesCatalogView
│   ├── auth/             LoginView, PasswordRecoveryView, UpdatePasswordView
│   ├── appointments/     BookingWizard, RegisterPaymentStep, PatientSearch
│   ├── agenda/           AgendaView, EditAppointmentView, CollectBalanceModal
│   ├── clinical/         MedicalRecordView, AnamnesisForm, TreatmentPhotos
│   ├── admin/            AdminServicesView, ServiceFormModal, UserFormModal
│   ├── analytics/        AnalyticsDashboardView
│   ├── documents/        AppointmentReceiptModal, InformedConsentModal
│   └── reminders/        ReminderNotificationModal
├── services/
│   ├── api.ts            Cliente axios único + todos los módulos de API
│   └── supabaseClient.ts Cliente de Supabase Storage
├── types/index.ts        Tipos espejo de los DTOs del backend
├── config/contact.ts
└── utils/                cn.ts, session.ts, calendarGenerator.ts
```

---

## 6. Estructura de archivos del backend

### Controladores (`presentation/controller`)

| Controlador | Ruta base | Acceso |
| :--- | :--- | :--- |
| `AppointmentController` | `/api/v1/citas` | Mixto: 3 endpoints públicos, el resto por rol |
| `PaymentWebhookController` | `/api/v1/pagos` | Público (autenticado por HMAC) |
| `AuthController` | `/api/v1/auth` | Público, salvo `register` (ADMIN) |
| `PatientController` | `/api/v1/pacientes` | DOCTORA, SECRETARIA, ADMIN |
| `ServiceCatalogController` | `/api/v1/servicios` | GET públicos; escritura ADMIN |
| `MedicalRecordController` | `/api/v1/historias-clinicas` | Solo DOCTORA |
| `CalendarBlockController` | `/api/v1/bloqueos` | ADMIN, DOCTORA |
| `UserController` | `/api/v1/usuarios` | Solo ADMIN |
| `AnalyticsController` | `/api/v1/analytics` | DOCTORA, ADMIN |
| `GeminiChatbotController` | `/api/v1/chat` | Público |
| `SystemStatusController` | `/api/v1/estado` | Autenticado (usa el Singleton `ConexionBD`) |

### Servicios (`application/service`)

`AppointmentService`, `PaymentService`, `AuthService`, `PatientService`,
`DermatologicServiceService`, `MedicalRecordService`, `ClinicalImageService`,
`CalendarBlockService`, `UserService`, `AnalyticsService`, `GeminiChatbotService`.

Todos anotados con `@Service`, inyección por constructor vía `@RequiredArgsConstructor` de
Lombok, y `@Transactional` en los métodos que escriben (`@Transactional(readOnly = true)` en
los de lectura).

### DAO (`infrastructure/persistence/dao`)

Seis interfaces, una por entidad de los casos de uso. Cada una extiende
`JpaRepository<Entidad, Long>` y Spring Data JPA genera la implementación en tiempo de
ejecución.

| DAO | Métodos relevantes más allá del CRUD |
| :--- | :--- |
| `AppointmentDAO` | `findOverlappingAppointments(Instant, Instant)`, `findExpiredHolds(Instant)`, `findByDateRange(Instant, Instant)` |
| `PaymentTransactionDAO` | `findByAppointmentId(Long)`, `findByMpPreferenceId(String)`, `findByMpPaymentId(String)`, `findByStatus(PaymentStatus)` |
| `PatientDAO` | `findByDni(String)`, `searchByNameOrDni(String)`, `findAllActive()`, `existsByDni/Email/Phone` |
| `DermatologicServiceDAO` | `findAllActive()` |
| `CalendarBlockDAO` | `findOverlappingBlocks(Instant, Instant)`, `findByDateRange(...)` |
| `UserDAO` | `findByUsername(String)`, `findByEmail(String)`, `existsByUsername/Email` |

### Excepciones de dominio y su mapeo HTTP

`GlobalExceptionHandler` (`presentation/advice`) es el único `@RestControllerAdvice`. Devuelve
JSON con `Content-Type: application/problem+json`, con forma de RFC 7807 construida a mano
(un `LinkedHashMap`, no la clase `ProblemDetail` de Spring). Duplica cada campo en dos
variantes (`detail` + `message`, `title` + `error`) para que el frontend pueda leer cualquiera.

| Excepción | HTTP |
| :--- | :--- |
| `ResourceNotFoundException` | 404 Not Found |
| `SlotUnavailableException` | 409 Conflict |
| `DuplicateResourceException` | 409 Conflict |
| `BusinessRuleException` | 400 Bad Request |
| `UnauthorizedAccessException` | 403 Forbidden |
| `AccessDeniedException` (de `@PreAuthorize`) | 403 Forbidden |
| `MethodArgumentNotValidException` (de `@Valid`) | 400 con mapa `details` campo→mensaje |
| `PaymentGatewayException` | 502 Bad Gateway |
| `Exception` (catch-all) | 500 con mensaje genérico, stacktrace solo al log |

Las seis excepciones de dominio extienden `RuntimeException` con constructor `(String)`.
`PaymentGatewayException` agrega además `(String, Throwable)`.

> **Detalle a tener en cuenta:** un login con credenciales inválidas lanza
> `BusinessRuleException`, por lo que devuelve **400**, no 401. El 401 lo produce solo
> `DelegatedAuthenticationEntryPoint` cuando falta el token en una ruta protegida.

### Migraciones Flyway (`resources/db/migration`)

| Archivo | Qué hace |
| :--- | :--- |
| `V1__initial_schema.sql` | Esquema inicial (174 líneas), todo con `CREATE TABLE IF NOT EXISTS` |
| `V2__audit_triggers_and_tables.sql` | Tablas de auditoría inmutable `historia_clinica_audit` y `entrada_hc_audit`, con `previous_values JSONB` |
| `V3__seed_initial_data.sql` | Seed de usuarios con BCrypt costo 12. Usa roles antiguos (`PHYSICIAN`) |
| `V4__schema_redesign.sql` | Rediseño completo: descarta y recrea las tablas (entorno greenfield) |
| `V5__seed_updated_data.sql` | Reemplaza funcionalmente a V3 para el esquema V4 |
| `V6__spec_alignment.sql` | Alineación final: renombra `payment_method` → `payment_type`, acota longitudes de texto |

Config: `ddl-auto: none` (Hibernate no toca el esquema; lo gobierna Flyway),
`baseline-on-migrate: true`, `out-of-order: true`.

Contraseña de los usuarios sembrados en desarrollo: `Password123!`.

---

## 7. Entidades, enums y comunicación entre ellas

### Las entidades de los casos de uso

| Clase | Tabla | Campos principales | Relaciones |
| :--- | :--- | :--- | :--- |
| `Appointment` | `cita` | `id`, `startTime`, `endTime`, `status`, `agreedPrice`, `createdAt`, `updatedAt` | `* → 1 Patient`, `* → 1 DermatologicService`, `* → 1 User` (createdByUser), `* → 0..1 Appointment` (followUpTo, autorrelación) |
| `PaymentTransaction` | `transaccion_pago` | `id`, `mpPreferenceId`, `mpPaymentId` (único), `paymentType`, `paymentConcept`, `amount`, `status`, `paymentDate`, `createdAt` | `* → 1 Appointment`, `* → 0..1 User` (registeredByUser) |
| `Patient` | `paciente` | `id`, `name`, `dni`, `phone`, `email`, `birthDate`, `active`, timestamps | — |
| `DermatologicService` | `servicio` | `id`, `name`, `description`, `durationMinutes`, `basePrice`, `depositPercentage`, `active` | — |
| `CalendarBlock` | `bloqueo_calendario` | `id`, `startTime`, `endTime`, `reason`, `createdAt` | `* → 1 User` (createdByUser) |
| `User` | `usuario` | `id`, `username`, `email`, `passwordHash`, `fullName`, `role`, `active` | — |

Las entidades de Historia Clínica (`MedicalRecord`, `ClinicalEntry`, `ClinicalImage`,
`Alergia`, `AntecedentePatologico`, `Habito` y sus `...Id` de clave compuesta, más
`MedicalRecordAudit` y `ClinicalEntryAudit`) pertenecen al módulo clínico.

> **Ninguna entidad usa `@Version`.** No hay bloqueo optimista. El control de concurrencia
> del turno se resuelve con verificación de solapamiento más el bloqueo temporal de 10
> minutos. Esto importa porque documentación previa afirma lo contrario (ver sección 15).

### Enums

```java
AppointmentStatus : PENDING_PAYMENT, CONFIRMED, ATTENDED, COMPLETED,
                    CANCELED, PAYMENT_FAILED, NO_SHOW
PaymentType       : MERCADOPAGO, CASH, BANK_TRANSFER
PaymentConcept    : DEPOSIT, BALANCE, FULL
PaymentStatus     : PENDING, APPROVED, REJECTED, REFUNDED
UserRole          : ADMIN, DOCTORA, SECRETARIA
```

### Ciclo de vida de un turno

```
                    reservar
                       │
                       ▼
              PENDING_PAYMENT ────── vencen 10 min ──────► CANCELED
                       │                                      ▲
         pago OK ──────┤                                       │
                       ▼                      cancelación ─────┤
                  CONFIRMED ──────────────────────────────────┘
                       │
                  marcar atendido
                       │
                       ▼
                   ATTENDED
                       │
                  cobrar saldo
                       │
                       ▼
                   COMPLETED

   Ramas desde PENDING_PAYMENT vía webhook de MercadoPago:
     pago rechazado / cancelado  →  PAYMENT_FAILED
     pago reembolsado / contracargo  →  CANCELED
```

### Clase auxiliar `HoldPolicy`

Vive en `domain/model`. Es una clase `final` con constructor privado y solo métodos
estáticos: concentra la regla del bloqueo temporal en un único lugar.

```java
public static final Duration TTL = Duration.ofMinutes(10);

// createdAt + 10 min
public static Instant expiresAt(Appointment appointment);

// true si es un hold (PENDING_PAYMENT) cuyo plazo ya venció
public static boolean isExpired(Appointment appointment, Instant now);
```

La usan `AppointmentService` (al reservar y al calcular disponibilidad), `PaymentService`
(al registrar un pago) y `HoldExpirationScheduler` (job periódico).

### Cómo se comunican las piezas

**1. Frontend → Backend.** HTTP + JSON. Un único cliente axios en `services/api.ts`, con
`baseURL` desde `VITE_API_BASE_URL`. Un interceptor de request lee el token de
`localStorage` y agrega `Authorization: Bearer <jwt>` en cada llamada. Un interceptor de
response maneja 401 (toast + redirección a `/login`), 403 (toast de acceso denegado) y 5xx.

**2. Controlador → Servicio.** Llamada a método Java. El controlador recibe un DTO de
request (validado con `@Valid`), llama al servicio y devuelve un DTO de response envuelto en
`ResponseEntity`. Los DTOs son el contrato: las entidades JPA nunca se serializan
directamente a JSON.

**3. Servicio → DAO.** Llamada a método sobre la interfaz Spring Data JPA. El servicio abre
la transacción con `@Transactional`; todas las operaciones del DAO dentro del método
participan de la misma transacción.

**4. DAO → Base de datos.** Hibernate traduce a SQL. Las consultas derivadas salen del nombre
del método; las más complejas usan `@Query` con JPQL.

**5. Servicio → sistema externo.** Siempre a través de un adaptador en `infrastructure`:
`MercadoPagoPaymentAdapter` (pagos), `GeminiApiClientAdapter` (IA),
`SupabaseStorageAdapter` (fotos), `EmailNotificationService` (mails). El servicio nunca
habla HTTP directo con un tercero.

**6. Sistema externo → Backend.** MercadoPago llama a `POST /api/v1/pagos/webhook`. Es el
único flujo que entra sin que lo inicie un usuario.

**7. Comunicación entre servicios.** Existe en casos puntuales: `AppointmentService` inyecta
`PaymentService` para emitir reembolsos al cancelar un turno.

---

## 8. Los tres patrones de diseño

### 8.1 DAO (Data Access Object)

**Dónde:** `infrastructure/persistence/dao`, seis interfaces.

**Cómo está implementado:**

```java
@Repository
public interface AppointmentDAO extends JpaRepository<Appointment, Long> {

    @Query("SELECT a FROM Appointment a WHERE a.status IN ('CONFIRMED','COMPLETED','PENDING_PAYMENT') " +
           "AND a.startTime < :end AND a.endTime > :start")
    List<Appointment> findOverlappingAppointments(Instant start, Instant end);

    // ...
}
```

**Cómo defenderlo en una frase:** el DAO es una interfaz por entidad que aísla a la lógica de
negocio de los detalles de SQL y JPA. El servicio pide `findOverlappingAppointments(...)` y no
sabe ni le importa cómo se consulta la base. Spring Data JPA genera la implementación en
tiempo de ejecución, así que no hay código de acceso a datos escrito a mano.

**Por qué no hay puerto + adapter:** sería una capa de indirección extra sin beneficio en este
contexto. El DAO ya es la abstracción del acceso a datos.

### 8.2 Singleton

Aparece de dos formas, ambas defendibles.

**(a) Explícito — `ConexionBD`** en `infrastructure/persistence`. Es el Singleton de libro:

```java
public final class ConexionBD {

    private static ConexionBD instancia;          // instancia única, estática

    private ConexionBD() { ... }                  // constructor privado

    public static synchronized ConexionBD getInstance() {   // acceso global, lazy
        if (instancia == null) {
            instancia = new ConexionBD();
        }
        return instancia;
    }

    public Connection obtenerConexion() throws SQLException {
        return DriverManager.getConnection(url, usuario, password);
    }
}
```

Los tres elementos canónicos están presentes: constructor privado (nadie puede hacer `new`
desde afuera), atributo privado estático que guarda la única instancia, y `getInstance()`
público y estático con inicialización perezosa. El `synchronized` lo hace seguro ante
múltiples hilos. Los datos de conexión salen de variables de entorno, con los mismos valores
por defecto que usa el `DataSource` de Spring, para que coincidan.

**Quién lo consume:** `SystemStatusController` en `GET /api/v1/estado`, para verificar
conectividad con la base.

**(b) Explícito también — `AesEncryptionService`**, anotado `@Service @Scope("singleton")`.
El `@Scope` está puesto a propósito para hacer el patrón visible. La justificación funcional
es real: la clave AES de 32 bytes se decodifica y valida **una sola vez** al arrancar la
aplicación, y se reutiliza en cada operación de cifrado.

**(c) Implícito — los beans de Spring.** Todos los `@Service`, `@RestController`,
`@Component` y DAO son beans de alcance singleton por defecto: una sola instancia compartida
en toda la aplicación. Están diseñados *stateless* (sin estado mutable de instancia), que es
la condición para que compartir una instancia sea seguro.

### 8.3 Strategy

**El problema que resuelve:** registrar un pago se hace distinto según el canal. Efectivo y
transferencia se confirman en el momento (`APPROVED`), mientras que MercadoPago queda
pendiente hasta que llega el webhook. Sin Strategy, `PaymentService` tendría un `if/else`
sobre `PaymentType` que crecería con cada canal nuevo.

**Las piezas:**

| Rol en el patrón | Clase | Ubicación |
| :--- | :--- | :--- |
| Contrato (Strategy) | `PaymentRegistrationStrategy` (interfaz) | `application/strategy` |
| Selector (Factory) | `PaymentStrategyFactory` | `application/strategy` |
| Estrategia concreta | `CashPaymentStrategy` | `infrastructure/payment/strategy` |
| Estrategia concreta | `BankTransferPaymentStrategy` | `infrastructure/payment/strategy` |
| Estrategia concreta | `MercadoPagoPaymentStrategy` | `infrastructure/payment/strategy` |
| Contexto (cliente) | `PaymentService` | `application/service` |

**El contrato:**

```java
public interface PaymentRegistrationStrategy {

    /** Qué PaymentType implementa esta estrategia. Lo usa el Factory para elegir. */
    PaymentType supportedType();

    /** Registra la transacción de pago para la cita indicada. */
    PaymentTransaction register(Appointment appointment,
                                BigDecimal amount,
                                PaymentConcept concept,
                                User registeredBy,
                                String preferenceId);
}
```

**El detalle más elegante — cómo se registran las estrategias.** No hay un `switch` ni un
registro manual. Spring inyecta automáticamente **todos** los beans que implementan la
interfaz como una `List`, y el constructor del Factory la convierte en un mapa:

```java
@Component
public class PaymentStrategyFactory {

    private final Map<PaymentType, PaymentRegistrationStrategy> strategies;

    public PaymentStrategyFactory(List<PaymentRegistrationStrategy> strategyList) {
        this.strategies = strategyList.stream()
                .collect(Collectors.toMap(PaymentRegistrationStrategy::supportedType, s -> s));
    }

    public PaymentRegistrationStrategy getStrategy(PaymentType type) {
        PaymentRegistrationStrategy strategy = strategies.get(type);
        if (strategy == null) {
            throw new BusinessRuleException("Tipo de pago no soportado: " + type);
        }
        return strategy;
    }
}
```

Consecuencia práctica: **agregar un canal de pago nuevo es crear una clase.** Se implementa la
interfaz, se anota `@Component`, y el Factory la descubre sola. No se modifica
`PaymentService` ni el Factory. Eso es el principio abierto/cerrado funcionando de verdad, y
es un punto fuerte para la defensa.

**Cómo lo usa el cliente** (sin un solo `if` sobre el canal):

```java
PaymentTransaction transaction = paymentStrategyFactory
        .getStrategy(request.getPaymentType())
        .register(appointment, amount, concept, registeredBy, null);
```

**Qué hace cada estrategia concreta:**

| Estrategia | `supportedType()` | Estado con que crea la transacción | Notas |
| :--- | :--- | :--- | :--- |
| `CashPaymentStrategy` | `CASH` | `APPROVED` | El cobro se confirma físicamente en mostrador. Setea `registeredByUser` y `paymentDate = now`. Ignora `preferenceId` |
| `BankTransferPaymentStrategy` | `BANK_TRANSFER` | `APPROVED` | La transferencia se verifica manualmente antes del registro. Misma mecánica que efectivo |
| `MercadoPagoPaymentStrategy` | `MERCADOPAGO` | `PENDING` | El resultado llega después, por webhook. Guarda `mpPreferenceId` |

---

## 9. Seguridad

### Autenticación: JWT stateless

`SecurityConfig` configura la cadena de filtros con `SessionCreationPolicy.STATELESS`: no hay
sesión de servidor ni `JSESSIONID`. Cada petición se autentica sola con su token.

**Flujo de login:**

1. `POST /api/v1/auth/login` con `{ username, password }`.
2. `AuthService.login` busca el usuario por username. Si no existe → `BusinessRuleException`
   con mensaje genérico `"Credenciales no válidas"` (no revela si el usuario existe).
3. Si `!user.getActive()` → cuenta suspendida.
4. `passwordEncoder.matches(...)` compara contra el hash. Si falla → el **mismo** mensaje
   genérico.
5. `JwtTokenProvider.generateToken(user)` emite un JWT firmado con **HS256**.
6. Devuelve `AuthResponseDTO` con `token`, `tokenType: "Bearer"`, `userId`, `username`,
   `fullName`, `role` y `expiresInMs`.

**El token** lleva como claims: `sub` = username, `userId`, `role`, `fullName`, `iat` y `exp`.
Expira en **8 horas** (`28800000` ms). La clave secreta viene de la variable de entorno
`JWT_SECRET_KEY`, sin valor por defecto: **si falta, la aplicación no arranca**. Si el secreto
mide menos de 32 bytes, se deriva por SHA-256 para alcanzar el largo que exige HS256.

**Hash de contraseñas:** `BCryptPasswordEncoder(12)`. BCrypt con factor de costo 12, que es
un valor sólido para producción (más alto = más lento de crackear y de verificar).

**El filtro** `JwtAuthenticationFilter` extiende `OncePerRequestFilter`. Lee el header
`Authorization`, exige el prefijo `Bearer `, valida el token y, si es válido, carga el usuario
desde la base con `CustomUserDetailsService` y arma el `Authentication` en el
`SecurityContextHolder`.

Dos detalles de diseño que vale conocer:

- El filtro **nunca corta la cadena**. Si no hay token o es inválido, simplemente sigue sin
  autenticación; son `authorizeHttpRequests` y el `AuthenticationEntryPoint` los que producen
  el 401. Esto permite que las rutas públicas funcionen sin token.
- El rol efectivo se **relee de la base de datos** en cada request, no se toma del claim
  `role` del token. Cuesta un SELECT por petición, pero significa que si un admin revoca un
  rol, el cambio surte efecto de inmediato sin esperar a que expire el token.

### Autorización: dos capas deliberadas

**Capa 1 — perimetral**, la matriz de rutas en `SecurityConfig.authorizeHttpRequests`. Las
rutas se escriben sin el prefijo `/api/v1` porque ese prefijo es el `context-path` y Spring
Security hace matching sobre el path relativo al contexto.

| Rutas | Acceso |
| :--- | :--- |
| `/auth/**` | Público |
| `GET /servicios`, `GET /servicios/{id}` | Público |
| `POST /citas/reservar-temporal` | Público |
| `GET /citas/disponibilidad` | Público |
| `GET /citas/{id}/estado` | Público |
| `POST /chat/gemini` | Público |
| `POST /pagos/webhook` | Público (lo autentica el HMAC) |
| `/servicios/todos`, `/servicios/admin/**`, `/admin/**`, `/usuarios/**` | `ADMIN` |
| `/historias-clinicas/**` | `DOCTORA` |
| `/analytics/**` | `DOCTORA`, `ADMIN` |
| `/citas/**`, `/pacientes/**`, `/bloqueos/**` | `DOCTORA`, `SECRETARIA`, `ADMIN` |
| cualquier otra | `authenticated()` — **default deny** |

El `anyRequest().authenticated()` al final es importante: lo que no esté explícitamente
permitido, queda cerrado. Es el principio de denegación por defecto.

**Capa 2 — por método**, con `@PreAuthorize` (habilitado por
`@EnableMethodSecurity(prePostEnabled = true)`). Algunos ejemplos:

```java
@PreAuthorize("hasAnyRole('SECRETARIA', 'ADMIN', 'DOCTORA')")   // registrar-pago
@PreAuthorize("hasAnyRole('DOCTORA', 'ADMIN')")                 // atender
@PreAuthorize("hasRole('DOCTORA')")                             // MedicalRecordController (clase)
@PreAuthorize("hasRole('ADMIN')")                               // UserController (clase)
```

Hay anotaciones a nivel de clase (`MedicalRecordController`, `UserController`,
`PatientController`, `CalendarBlockController`) y a nivel de método (los endpoints de
`AppointmentController`, `AnalyticsController`, `ServiceCatalogController`,
`AuthController.register`).

La redundancia entre las dos capas es intencional: defensa en profundidad. Si alguien
modifica la matriz de rutas por error, el `@PreAuthorize` sigue protegiendo el método.

### Otros mecanismos de seguridad

**Cifrado de datos clínicos — AES-256-GCM.** `AesEncryptionService` cifra dos campos
concretos, que se almacenan como `BYTEA`:

- `MedicalRecord.physicalExamination`
- `ClinicalEntry.content`

Usa `AES/GCM/NoPadding` con IV aleatorio de 12 bytes generado por `SecureRandom` en **cada**
llamada, y tag de autenticación de 128 bits. El formato del resultado es
`[12 bytes IV | ciphertext + 16 bytes tag]`. GCM es un modo autenticado: si alguien altera un
byte del ciphertext, el descifrado falla con `AEADBadTagException` en lugar de devolver basura.
La clave sale de `AES_ENCRYPTION_KEY` (Base64 de 32 bytes) y el constructor **falla al
arrancar** si no mide exactamente 32 bytes. El cifrado se aplica en la capa de servicio
(`MedicalRecordService`), no en la entidad ni en el DAO.

**Firewall HTTP estricto.** `StrictHttpFirewall` con todo deshabilitado explícitamente:
barras codificadas (`%2F`), porcentajes codificados, punto y coma (terminaciones matriciales),
backslashes y puntos codificados. Mitiga path traversal y desincronización de proxy.

**Cabeceras de seguridad.** `X-Frame-Options: DENY` (anti-clickjacking),
`X-Content-Type-Options: nosniff`, protección XSS, y
`Referrer-Policy: STRICT_ORIGIN_WHEN_CROSS_ORIGIN`.

**CORS.** Lista configurable por `APP_CORS_ALLOWED_ORIGINS`, más patrones comodín para
`localhost:*`, `*.onrender.com` y `*.vercel.app`. Usa `setAllowedOriginPatterns` (no
`setAllowedOrigins`) porque con `allowCredentials(true)` el comodín literal `*` está
prohibido. CSRF está deshabilitado, lo cual es coherente con una API stateless que autentica
por header y no por cookie.

**Respuestas de error que no filtran información.** `DelegatedAuthenticationEntryPoint`
devuelve 401 y `DelegatedAccessDeniedHandler` devuelve 403, ambos con JSON
`application/problem+json` y mensajes genéricos. El catch-all del `GlobalExceptionHandler`
devuelve un mensaje fijo y manda el stacktrace solo al log, nunca al cliente.

**Recuperación de contraseña.** Token `UUID` de un solo uso, con vencimiento de 15 minutos,
persistido en `PasswordResetToken`. Al usarse se marca `usedAt`, y hay dos controles
independientes: token ya usado y token expirado.

**Control de acceso en el frontend: es solo UX.** `ProtectedRoute` lee el rol de
`localStorage` y redirige si no corresponde. Hay que ser claro en esto: el rol vive en
`localStorage` y el usuario puede editarlo (de hecho `DashboardLayout` tiene un select para
cambiarlo). **La autorización real es la del backend.** El guard del frontend solo evita que
se muestre una pantalla que luego fallaría con 403.

### Observaciones de seguridad honestas

Estas son cosas que conviene conocer antes de que las pregunten:

1. **`POST /citas/reservar-temporal` es público.** Cualquiera puede crear turnos en
   `PENDING_PAYMENT` sin autenticarse. Es intencional (permite que un paciente reserve desde
   la landing), pero no tiene rate limiting, así que es vulnerable a que alguien llene la
   agenda de holds. El TTL de 10 minutos limita el daño.
2. **Validación de firma permisiva en local.** Si `MERCADOPAGO_WEBHOOK_SECRET` está vacío y
   tampoco viene el header `x-signature`, `isValidSignature` devuelve `true` para permitir
   pruebas locales. En producción, con el secreto configurado, rechaza cualquier webhook sin
   firma válida.
3. **Comparación de HMAC no es constant-time.** Usa `equalsIgnoreCase`, teóricamente
   vulnerable a timing attack. En la práctica es poco explotable sobre HTTP.
4. **`forgotPassword` permite enumeración de correos**: si el email no existe lanza
   `ResourceNotFoundException`, lo que revela qué correos están registrados. Lo correcto sería
   responder siempre lo mismo.
5. **El `userId` se pasa como query param**, no se deriva del JWT. Es decir, un usuario
   autenticado podría registrar un pago atribuyéndoselo a otro. El dato es de auditoría, no de
   autorización, así que no abre un agujero de privilegios, pero debilita la traza.
6. **`resolveAuditorUser` cae silenciosamente al usuario 1** si el `userId` no existe, en vez
   de fallar. Conviene saberlo si alguien pregunta por la confiabilidad de la auditoría.

---

## 10. Los tres casos de uso, paso a paso

Esta es la sección central. Cada caso de uso se presenta con: el resumen, el recorrido por las
capas, la secuencia exacta del código y una **receta de replicación** (qué archivos crear, en
qué orden, para reconstruirlo desde cero).

### 10.1 Caso de uso 1 — Reservar Turno

**Actor:** Usuario (personal interno: `SECRETARIA`, `ADMIN`, `DOCTORA`).

**Propósito:** reservar un turno para un paciente, dejándolo retenido 10 minutos hasta que se
registre el pago de la seña.

**Endpoint:** `POST /api/v1/citas/reservar-temporal` → **201 Created**

**Control principal:** `AppointmentService.bookTemporaryHold(request, createdByUserId)`

**Precondiciones:**
- Debe existir al menos un servicio activo.
- El paciente debe estar registrado (o crearse en el momento — extensión E-1).
- El horario debe estar libre y no ser pasado.

#### Recorrido por las capas

```
BookingWizard.tsx (React, 5 pasos)
    │  POST /api/v1/citas/reservar-temporal
    │  body: BookAppointmentRequestDTO { patientId, serviceId, startTime }
    ▼
AppointmentController.bookTemporaryHold()          ← @RestController, público
    │
    ▼
AppointmentService.bookTemporaryHold()             ← @Service, @Transactional
    │
    ├──► PatientDAO.findById()
    ├──► DermatologicServiceDAO.findById()
    ├──► UserDAO.findById()
    ├──► CalendarBlockDAO.findOverlappingBlocks()
    ├──► AppointmentDAO.findOverlappingAppointments()
    ├──► AppointmentDAO.save()                     ← crea el turno PENDING_PAYMENT
    ├──► MercadoPagoPaymentAdapter.createDepositPreference()   ← API externa
    └──► PaymentTransactionDAO.save()              ← transacción PENDING
    │
    ▼
PaymentPreferenceResponseDTO { appointmentId, preferenceId, initPointUrl,
                               depositAmount, holdExpiresAt }
```

#### Secuencia exacta del código

1. **Buscar el paciente** — `patientRepository.findById(request.getPatientId())`.
   Si no existe → `ResourceNotFoundException("Paciente no encontrado")` → **404**.
2. **Buscar el servicio** — `serviceRepository.findById(request.getServiceId())`.
   Si no existe → `ResourceNotFoundException("Servicio no encontrado")` → **404**.
3. **Validar que el servicio esté activo** — si `!service.getActive()` →
   `BusinessRuleException("El servicio seleccionado no se encuentra activo")` → **400**.
4. **Resolver el usuario creador** — si `createdByUserId != null`, lo busca; si queda `null`,
   cae al usuario `id = 1`. Si tampoco existe ese → `ResourceNotFoundException`. El fallback
   existe porque la columna `created_by_user_id` es `NOT NULL`.
5. **Calcular `endTime`** — `startTime.plus(service.getDurationMinutes(), ChronoUnit.MINUTES)`.
   La duración la define el **servicio**, no la envía el cliente. Eso evita que alguien
   manipule la duración del turno.
6. **Rechazar fechas pasadas** — si `startTime.isBefore(Instant.now())` →
   `BusinessRuleException` → **400**.
7. **Verificar bloqueos de calendario** —
   `calendarBlockRepository.findOverlappingBlocks(startTime, endTime)`. Si hay alguno →
   `SlotUnavailableException` → **409**, incluyendo el motivo del bloqueo si está cargado.
8. **Resolver colisiones con otros turnos** — recorre
   `appointmentRepository.findOverlappingAppointments(startTime, endTime)` (la consulta JPQL
   filtra `status IN ('CONFIRMED','COMPLETED','PENDING_PAYMENT')`). Para cada turno solapado:
   - Si `HoldPolicy.isExpired(appt, now)` → llama a `expireHold(appt)`, que lo pasa a
     `CANCELED`, lo guarda y rechaza sus transacciones pendientes. **No bloquea la reserva.**
   - Si está vigente → se acumula como colisión real.

   Si quedan colisiones → `SlotUnavailableException("La franja horaria seleccionada ya se
   encuentra reservada o en proceso de pago")` → **409**. Esto es la extensión **E-2**.

   > Este paso es el corazón del control de concurrencia: limpia la basura (holds vencidos que
   > el job todavía no cazó) antes de decidir si el horario está libre.

9. **Calcular los montos:**
   ```java
   agreedPrice   = service.getBasePrice();                    // precio congelado
   depositAmount = agreedPrice * service.getDepositPercentage() / 100;   // HALF_UP, 2 decimales
   ```
   `agreedPrice` se guarda en el turno: si mañana cambia el precio del servicio, el turno
   conserva el precio con el que se pactó.
10. **Crear y persistir el turno** — `Appointment` con status `PENDING_PAYMENT`, y
    `appointmentRepository.save(...)`. Se guarda **antes** de hablar con MercadoPago porque el
    `appointmentId` se usa como `externalReference` de la preferencia de pago.
11. **Generar la preferencia en MercadoPago** —
    `mercadoPagoAdapter.createDepositPreference(appointmentId, serviceName, depositAmount,
    email, name, dni, phone)`. Dentro del adaptador:
    - Ítem con título `"Seña (50%): " + serviceTitle`, `currencyId("ARS")`.
    - Payer con email, nombre, DNI y teléfono.
    - `expires(true)` con vencimiento a **10 minutos**, coordinado con el TTL del hold.
    - `externalReference = String.valueOf(appointmentId)`.
    - Header `X-Idempotency-Key` para evitar preferencias duplicadas.
    - Back-urls hacia `/turnos/confirmado`, `/turnos/fallido`, `/turnos/pendiente`.
    - Errores de la API se traducen a `PaymentGatewayException` → **502**.
12. **Resolver la URL de pago** — `resolveInitPoint(preference)` elige según la credencial:
    si el access token empieza con `APP_USR-` (producción) usa `init_point`; si no (credencial
    de prueba) usa `sandbox_init_point`.
13. **Persistir la transacción pendiente** — `PaymentTransaction` con
    `paymentType = MERCADOPAGO`, `paymentConcept = DEPOSIT`, `status = PENDING` y
    `mpPreferenceId = preference.getId()`. Se crea acá para que el webhook la encuentre
    después.
14. **Devolver el DTO** — `PaymentPreferenceResponseDTO` con `holdExpiresAt =
    HoldPolicy.expiresAt(appointment)` (= `createdAt + 10 min`), que el frontend usa para
    mostrar el contador.

#### En el frontend

`features/appointments/BookingWizard.tsx` implementa un wizard de 5 pasos:
`Paciente → Servicio → Fecha y hora → Confirmación → Pago`.

Detalles relevantes:
- `HOLD_MS = 10 * 60 * 1000` — espejo del TTL del backend, para el contador visual.
- `SLOTS_REFRESH_MS = 30_000` — repolling de disponibilidad, porque otro usuario puede tomar
  el horario mientras se completa el formulario.
- Al salir de la pestaña llama a `releaseHoldOnPageExit` con `fetch(..., { keepalive: true })`
  para intentar liberar el hold. No es garantizado (el navegador puede cerrarse de golpe); la
  garantía real es el vencimiento en el servidor.
- Si el paciente no existe, abre `PacienteForm` para darlo de alta (extensión **E-1**).

#### Receta de replicación

Para reconstruir este caso de uso desde cero, en este orden:

| # | Archivo | Contenido |
| :-- | :--- | :--- |
| 1 | `domain/model/Appointment.java` | Entidad `@Entity @Table(name="cita")` con relaciones a `Patient`, `DermatologicService` y `User` |
| 2 | `domain/model/AppointmentStatus.java` | Enum con los 7 estados |
| 3 | `domain/model/HoldPolicy.java` | Clase `final`, `TTL = 10 min`, `expiresAt`, `isExpired` |
| 4 | `infrastructure/persistence/dao/AppointmentDAO.java` | `extends JpaRepository`, con `@Query` para `findOverlappingAppointments` y `findExpiredHolds` |
| 5 | Los otros 5 DAO | `PatientDAO`, `DermatologicServiceDAO`, `UserDAO`, `CalendarBlockDAO`, `PaymentTransactionDAO` |
| 6 | `presentation/dto/BookAppointmentRequestDTO.java` | `patientId`, `serviceId`, `startTime` con anotaciones `@NotNull` |
| 7 | `presentation/dto/PaymentPreferenceResponseDTO.java` | Respuesta con `@Builder` de Lombok |
| 8 | `infrastructure/payment/MercadoPagoPaymentAdapter.java` | `createDepositPreference`, `resolveInitPoint`, `getPaymentDetails` |
| 9 | `application/service/AppointmentService.java` | `bookTemporaryHold` con los 14 pasos de arriba, `@Transactional` |
| 10 | `presentation/controller/AppointmentController.java` | `@PostMapping("/reservar-temporal")`, devuelve 201 |
| 11 | `domain/exception/*` + `presentation/advice/GlobalExceptionHandler.java` | Para que los errores salgan con el HTTP correcto |
| 12 | `frontend/src/features/appointments/BookingWizard.tsx` | Wizard de 5 pasos |
| 13 | `frontend/src/services/api.ts` → `appointmentsApi.bookTemporaryHold` | Llamada axios |

**El orden importa:** entidad → DAO → DTO → adaptador externo → servicio → controlador →
frontend. Siempre de adentro hacia afuera, porque cada capa depende de la de abajo.

---

### 10.2 Caso de uso 2 — Registrar Pago Efectivo

**Actor:** Usuario (`SECRETARIA`, `ADMIN`, `DOCTORA`).

**Propósito:** registrar el cobro en efectivo de la seña de un turno retenido y confirmarlo.

**Endpoint:** `POST /api/v1/citas/{id}/registrar-pago` → **200 OK**

**Seguridad:** `@PreAuthorize("hasAnyRole('SECRETARIA', 'ADMIN', 'DOCTORA')")`

**Control principal:** `PaymentService.registerDepositPayment(appointmentId, request, userId)`
**más el patrón Strategy** (`CashPaymentStrategy`).

**Precondiciones:**
- Debe existir un turno en `PENDING_PAYMENT`.
- El bloqueo temporal de 10 minutos debe seguir vigente.

#### Recorrido por las capas

```
RegisterPaymentStep.tsx (paso 5 del wizard)
    │  POST /api/v1/citas/{id}/registrar-pago?userId=N
    │  body: RegisterPaymentRequestDTO { paymentType: "CASH", amount }
    ▼
AppointmentController.registerDepositPayment()     ← @PreAuthorize
    │
    ▼
PaymentService.registerDepositPayment()            ← @Transactional(noRollbackFor=...)
    │
    ├──► AppointmentDAO.findById()
    ├──► HoldPolicy.isExpired()                    ← regla de negocio pura
    ├──► UserDAO.findById()                        ← auditor
    ├──► PaymentStrategyFactory.getStrategy(CASH)  ← PATRÓN STRATEGY
    │         └──► CashPaymentStrategy.register()
    │                   └──► PaymentTransactionDAO.save()   ← APPROVED
    ├──► PaymentTransactionDAO (rechaza las PENDING)
    └──► AppointmentDAO.save()                     ← CONFIRMED
    │
    ▼
PaymentReceiptDTO { appointmentId, transactionId, paymentType,
                    concept, amount, paymentDate, appointmentStatus }
```

#### Secuencia exacta del código

**Firma y anotación:**

```java
@Transactional(noRollbackFor = BusinessRuleException.class)
public PaymentReceiptDTO registerDepositPayment(Long appointmentId,
                                                RegisterPaymentRequestDTO request,
                                                Long registeredByUserId)
```

El `noRollbackFor = BusinessRuleException.class` es **deliberado y vale explicarlo**: cuando
el hold venció, el método cancela el turno y *después* lanza la excepción. Sin esa cláusula,
Spring revertiría la transacción y la cancelación se perdería. Con ella, el turno queda
cancelado (el horario se libera de verdad) aunque la operación termine en error.

1. **Buscar el turno** — `appointmentRepository.findById(appointmentId)`.
   Si no existe → `ResourceNotFoundException` → **404**.
2. **Validar el estado** — si `status != PENDING_PAYMENT` →
   `BusinessRuleException("El turno no está pendiente de pago (estado actual: X)")` → **400**.
3. **Validar el vencimiento del hold** — `HoldPolicy.isExpired(appointment, Instant.now())`.
   Si venció (extensión **E-2**):
   - `appointment.setStatus(CANCELED)` + `save(...)` → libera el horario.
   - `rejectPendingTransactions(appointment, null)` → marca las transacciones `PENDING` como
     `REJECTED`.
   - Lanza `BusinessRuleException("El tiempo para completar la operación expiró. El horario
     fue liberado; iniciá la reserva nuevamente.")`.
4. **Rechazar MercadoPago por esta vía** — si `request.getPaymentType() == MERCADOPAGO` →
   `BusinessRuleException("El pago virtual se acredita automáticamente a través de
   MercadoPago")`. Esta es la extensión **E-1** y es la única barrera que restringe el
   endpoint a `CASH` y `BANK_TRANSFER`.
5. **Calcular la seña requerida:**
   ```java
   deposit = appointment.getAgreedPrice()
                * appointment.getService().getDepositPercentage() / 100;   // HALF_UP
   ```
   Nótese que usa `agreedPrice` del **turno** (el precio congelado al reservar), no el precio
   actual del servicio.
6. **Validar el rango del monto** (extensión **E-2**):
   - Si `amount < deposit` → `BusinessRuleException` con los dos montos en el mensaje.
   - Si `amount > agreedPrice` → `BusinessRuleException("El monto abonado supera el precio
     total del turno")`.
7. **Resolver el usuario auditor** — `resolveAuditorUser(registeredByUserId)`: busca el
   usuario; si no lo encuentra, cae al `id = 1`.
8. **Determinar el concepto:**
   ```java
   concept = amount.compareTo(agreedPrice) >= 0 ? PaymentConcept.FULL : PaymentConcept.DEPOSIT;
   ```
   Si el monto cubre el total, el pago es `FULL` y no queda saldo. Si cubre solo la seña, es
   `DEPOSIT`.
9. **Delegar en la estrategia** — acá entra el patrón, sin un solo `if` sobre el canal:
   ```java
   PaymentTransaction transaction = paymentStrategyFactory
           .getStrategy(request.getPaymentType())
           .register(appointment, amount, concept, registeredBy, null);
   ```
   `preferenceId` va en `null` porque es un pago manual.

   `CashPaymentStrategy.register(...)` construye la `PaymentTransaction` con
   `paymentType = CASH`, `status = APPROVED` (el cobro ya ocurrió físicamente),
   `registeredByUser`, `paymentDate = now`, y la persiste con `PaymentTransactionDAO.save(...)`.
10. **Invalidar el link de MercadoPago** — `rejectPendingTransactions(appointment, transaction)`
    marca como `REJECTED` todas las transacciones `PENDING` del turno **salvo** la que se
    acaba de crear. Esto descarta la preferencia que se había generado al reservar: si se pagó
    en efectivo, ese link ya no debe servir.
11. **Confirmar el turno** — `appointment.setStatus(CONFIRMED)` + `save(...)`.
12. **Devolver el comprobante** — `PaymentReceiptDTO` con todos los datos del pago.

#### En el frontend

`features/appointments/RegisterPaymentStep.tsx` (paso 5 del wizard). Maneja dos métodos
(`CASH` y `VIRTUAL`) y dos conceptos (`DEPOSIT` y `FULL`). Calcula el `depositAmount` del
lado del cliente para mostrarlo, valida que el monto sea numérico, positivo y no menor al
importe a cobrar, y calcula el **vuelto**. Al confirmar llama a
`appointmentsApi.registerDepositPayment`.

El cobro del **saldo final** (que es otra cosa: `ATTENDED → COMPLETED`) está en
`features/agenda/CollectBalanceModal.tsx`, que pega a `POST /citas/{id}/liquidar-saldo`.

#### Receta de replicación

| # | Archivo | Contenido |
| :-- | :--- | :--- |
| 1 | `domain/model/PaymentTransaction.java` | Entidad `@Table(name="transaccion_pago")`, FK a `Appointment` y `User` |
| 2 | `domain/model/PaymentType.java`, `PaymentConcept.java`, `PaymentStatus.java` | Los tres enums |
| 3 | `infrastructure/persistence/dao/PaymentTransactionDAO.java` | `findByAppointmentId`, `findByMpPreferenceId` |
| 4 | **`application/strategy/PaymentRegistrationStrategy.java`** | La interfaz: `supportedType()` + `register(...)` |
| 5 | **`application/strategy/PaymentStrategyFactory.java`** | `@Component`, recibe `List<Strategy>` y arma el `Map` |
| 6 | **`infrastructure/payment/strategy/CashPaymentStrategy.java`** | `@Component`, `supportedType() = CASH`, crea la transacción `APPROVED` |
| 7 | Las otras dos estrategias | `BankTransferPaymentStrategy`, `MercadoPagoPaymentStrategy` |
| 8 | `presentation/dto/RegisterPaymentRequestDTO.java` | `@NotNull PaymentType paymentType`, `@NotNull @DecimalMin("0.01") BigDecimal amount` |
| 9 | `presentation/dto/PaymentReceiptDTO.java` | Comprobante con `@Builder` |
| 10 | `application/service/PaymentService.java` | `registerDepositPayment` con los 12 pasos, `@Transactional(noRollbackFor=...)` |
| 11 | `presentation/controller/AppointmentController.java` | `@PostMapping("/{id}/registrar-pago")` + `@PreAuthorize` |
| 12 | `frontend/.../RegisterPaymentStep.tsx` | Paso 5 del wizard |

**Clave del orden:** crear la interfaz Strategy (4) **antes** de las estrategias concretas
(6, 7) y antes del servicio (10). Si se escribe el servicio primero, la tentación es resolver
con `if/else` y después cuesta refactorizar.

---

### 10.3 Caso de uso 3 — Registrar Pago Digital

Este caso tiene **dos realizaciones** con mecánicas muy distintas:

- **3A — MercadoPago (asíncrono).** El pago se acredita por webhook. El sistema nunca lo
  registra a mano.
- **3B — Transferencia bancaria (síncrono).** El usuario lo registra manualmente tras
  verificar la acreditación. Mismo endpoint que el efectivo.

#### 10.3A — MercadoPago por webhook

**Actor principal:** Usuario. **Actor secundario:** pasarela MercadoPago.

**Endpoint:** `POST /api/v1/pagos/webhook` → **200 OK** / **401 Unauthorized**

**Acceso:** público (`permitAll`). **La autenticación efectiva es la firma HMAC.**

**Control principal:** `PaymentService.processMercadoPagoWebhook(payload, queryParams,
xSignature, xRequestId)`

**Flujo completo del negocio:**

```
1. Al reservar (caso de uso 1) el sistema generó la preferencia y el initPointUrl.
2. El Usuario comparte el link (o el QR) con el cliente.
3. El cliente paga en MercadoPago.
4. MercadoPago llama al webhook del sistema.
5. El sistema valida la firma, consulta el estado REAL contra la API y actualiza.
6. El frontend sondea GET /citas/{id}/estado y refleja el cambio.
```

**Recorrido por las capas:**

```
MercadoPago (sistema externo)
    │  POST /api/v1/pagos/webhook
    │  headers: x-signature, x-request-id
    ▼
PaymentWebhookController.handleMercadoPagoWebhook()    ← público
    │
    ▼
PaymentService.processMercadoPagoWebhook()             ← @Transactional
    │
    ├──► isValidSignature()                            ← HMAC SHA-256
    ├──► MercadoPagoPaymentAdapter.getPaymentDetails() ← consulta la API REAL
    ├──► PaymentTransactionDAO.findByMpPreferenceId() / findByAppointmentId()
    ├──► [chequeo de idempotencia]
    ├──► PaymentTransactionDAO.save()
    └──► AppointmentDAO.save()
    │
    ▼
  true → 200 OK      |      false → 401 Unauthorized
```

**Secuencia exacta del código** (todo dentro de un `try/catch` que loguea y devuelve `false`):

1. **Extraer el ID del pago y el tópico.** Busca `type` (o `topic`) y el id en
   `payload.data.id`, o `payload.id`, o los query params `data.id` / `id`. MercadoPago manda
   la notificación en formatos distintos según la configuración, así que acepta varios.
2. **Si no hay ID** → log informativo y `return true`. Devuelve éxito a propósito: es un
   webhook que no interesa, y responder error haría que MercadoPago reintente para siempre.
3. **Validar la firma HMAC** — `isValidSignature(xSignature, xRequestId, paymentIdStr)`.
   Si falla → `return false` → el controlador responde **401**.
4. **Filtrar el tópico** — si `type` no es `payment` ni `payments` → `return true` (se
   descarta sin procesar).
5. **Consultar el estado real** — `mercadoPagoAdapter.getPaymentDetails(paymentId)`, que hace
   `new PaymentClient().get(paymentId)` contra la API oficial.

   > **Este paso es la defensa central contra el spoofing.** El estado del pago **nunca** se
   > toma del cuerpo de la notificación, que podría ser falsificado. Se pregunta a MercadoPago.
   > Si alguien manda un webhook falso diciendo "aprobado", el sistema consulta y descubre que
   > no lo está.

   Si devuelve `null` → `return true`.
6. **Obtener el `externalReference`** del pago. Si está vacío → `return true`.
7. **Localizar la transacción** — primero `findByMpPreferenceId(externalReference)`, y si no
   encuentra, parsea el `externalReference` como `appointmentId` y busca con
   `findByAppointmentId(...)`, filtrando por `paymentType == MERCADOPAGO`.

   > En la práctica resuelve la segunda rama, porque la preferencia se crea con
   > `externalReference = appointmentId` mientras la transacción se guarda con
   > `mpPreferenceId = preference.getId()`. Son valores distintos. Ver sección 15.

8. **Idempotencia** — si `transaction.getStatus() == APPROVED`, loguea y `return true` sin
   reprocesar. MercadoPago reintenta las notificaciones, así que la misma puede llegar varias
   veces. Sin este control, un pago podría contarse dos veces. Hay una segunda barrera a nivel
   de base: `mp_payment_id` tiene restricción `unique`.
9. **Mapear el estado:**

   | Estado en MercadoPago | `PaymentStatus` | `AppointmentStatus` |
   | :--- | :--- | :--- |
   | `approved` | `APPROVED` (+ `mpPaymentId`, + `paymentDate`) | Según el concepto: `DEPOSIT`/`FULL` → `CONFIRMED` (solo si estaba en `PENDING_PAYMENT`); `BALANCE` → `COMPLETED` |
   | `in_process`, `pending`, `authorized` | sin cambio (solo guarda `mpPaymentId`) | **sin cambio** — la reserva se mantiene activa (extensión **E-2**) |
   | `rejected`, `cancelled` | `REJECTED` | `PAYMENT_FAILED` (extensión **E-1**) |
   | `refunded`, `charged_back` | `REFUNDED` | `CANCELED` (extensión **E-3**) |

10. **Persistir** — `paymentTransactionRepository.save(transaction)` +
    `appointmentRepository.save(appointment)`. El `@Transactional` garantiza que ambos cambios
    se apliquen juntos o ninguno.

**Cómo se valida la firma (`isValidSignature`):**

1. Si no hay secreto configurado y tampoco vino `x-signature` → `return true` (modo prueba
   local). Si no hay secreto pero **sí** vino firma → `return false`.
2. Si hay secreto y no vino firma → `return false`.
3. Parsea el header `x-signature`, que tiene la forma `ts=<timestamp>,v1=<hash>`.
4. Construye el *manifest* según la especificación oficial de MercadoPago:
   ```
   id:<data.id en minúsculas>;request-id:<x-request-id>;ts:<ts>;
   ```
5. Calcula `HmacSHA256(manifest, webhookSecret)` y lo convierte a hexadecimal.
6. Compara con el `v1` recibido. Si coinciden, la notificación es auténtica.

#### 10.3B — Transferencia bancaria

Reutiliza **exactamente** el mismo endpoint y el mismo método que el efectivo:
`POST /api/v1/citas/{id}/registrar-pago` → `PaymentService.registerDepositPayment(...)`.

La única diferencia es el `paymentType` del body: `BANK_TRANSFER` en lugar de `CASH`. El
Factory resuelve `BankTransferPaymentStrategy`, que crea la transacción con
`paymentType = BANK_TRANSFER` y `status = APPROVED` (la transferencia se verificó manualmente
antes de registrarla). Todo el resto del flujo —validaciones, concepto, confirmación del
turno— es idéntico.

**Ese es justamente el valor del patrón Strategy:** soportar un canal más no requirió tocar
el servicio ni el controlador. Solo existe una clase más.

#### En el frontend

`RegisterPaymentStep.tsx` para el canal virtual muestra el `initPointUrl`, un **código QR**
generado con `qrcode.react` a partir de ese link, y botones para copiar o enviar por WhatsApp.
Las vistas de retorno (`BookingStatusViews.tsx`) atienden `/turnos/confirmado`,
`/turnos/fallido` y `/turnos/pendiente`, que son las `back-urls` configuradas en
`application.yml`. El sondeo del estado se hace contra `GET /citas/{id}/estado`, que es
público.

> **Aclaración de alcance:** para MercadoPago el sistema genera un **link de Checkout Pro**.
> El QR que muestra el frontend es una codificación visual de ese mismo link, no un QR de
> cobro de MercadoPago. Si en el mostrador se usara un QR estático de la cuenta, sería un
> elemento externo al sistema.

#### Receta de replicación

| # | Archivo | Contenido |
| :-- | :--- | :--- |
| 1 | `infrastructure/payment/MercadoPagoConfigBean.java` | Lee `MERCADOPAGO_ACCESS_TOKEN` y configura el SDK |
| 2 | `infrastructure/payment/MercadoPagoPaymentAdapter.java` | `createDepositPreference`, `resolveInitPoint`, `getPaymentDetails`, `refundPayment` |
| 3 | `infrastructure/payment/strategy/MercadoPagoPaymentStrategy.java` | Crea la transacción en `PENDING` |
| 4 | `infrastructure/payment/strategy/BankTransferPaymentStrategy.java` | Crea la transacción en `APPROVED` |
| 5 | `application/service/PaymentService.java` → `isValidSignature` | HMAC SHA-256 con el manifest oficial |
| 6 | `application/service/PaymentService.java` → `processMercadoPagoWebhook` | Los 10 pasos de arriba |
| 7 | `presentation/controller/PaymentWebhookController.java` | `@PostMapping("/webhook")`, 200/401 |
| 8 | `SecurityConfig` | `permitAll()` para `POST /pagos/webhook` |
| 9 | `application.yml` | `mercadopago.webhook-secret`, `notification-url`, `back-urls` |
| 10 | `frontend/.../BookingStatusViews.tsx` | Las tres vistas de retorno |

**Clave:** el adaptador (2) va antes que el servicio (6), y la validación de firma (5) antes
que el procesamiento (6). Y la configuración de `SecurityConfig` (8) es imprescindible: sin
el `permitAll`, MercadoPago recibiría 401 en cada notificación y el pago nunca se acreditaría.

---

## 11. Procesos automáticos y comunicación con sistemas externos

### El job de expiración de holds

`infrastructure/scheduling/HoldExpirationScheduler` ejecuta periódicamente
`AppointmentService.releaseExpiredHolds()`:

```java
@Transactional
public int releaseExpiredHolds() {
    List<Appointment> expired =
        appointmentRepository.findExpiredHolds(Instant.now().minus(HoldPolicy.TTL));
    expired.forEach(this::expireHold);
    return expired.size();
}
```

`expireHold` pasa el turno a `CANCELED` y marca sus transacciones `PENDING` como `REJECTED`.

**Por qué hay dos mecanismos de limpieza.** El job es la red de contención, pero no es la
única defensa. Tanto `bookTemporaryHold` como `getAvailableSlots` y `registerDepositPayment`
evalúan `HoldPolicy.isExpired(...)` en el momento. Así, un hold vencido deja de retener el
horario **inmediatamente**, sin esperar la siguiente corrida del job. El job solo se encarga
de dejar la base ordenada.

Es un buen punto a mencionar en una defensa: la corrección no depende del timing de un
scheduler.

### Adaptadores hacia sistemas externos

Todos viven en `infrastructure` y son la única puerta de salida del sistema:

| Adaptador | Sistema externo | Qué hace |
| :--- | :--- | :--- |
| `MercadoPagoPaymentAdapter` | MercadoPago | Crea preferencias, consulta pagos, emite reembolsos |
| `GeminiApiClientAdapter` | Google Gemini | Chatbot, vía `WebClient`, con cascada de 6 modelos de respaldo |
| `SupabaseStorageAdapter` | Supabase Storage | Sube y recupera fotos clínicas del bucket `photos` |
| `EmailNotificationService` | Correo | Envía el mail de recuperación de contraseña |

El patrón es consistente: el servicio de aplicación nunca habla HTTP con un tercero. Siempre
pasa por un adaptador, que además traduce los errores del proveedor a excepciones del dominio
(por ejemplo, `MPApiException` → `PaymentGatewayException`).

Esto tiene una consecuencia práctica muy concreta: para testear `AppointmentService` se
mockea `MercadoPagoPaymentAdapter` y no hace falta red.

### Resiliencia del frontend: el modo demo

`services/api.ts` tiene un mecanismo que conviene conocer porque es inusual. Si el backend
está caído o la sesión es de demostración, casi todos los métodos devuelven datos simulados
en memoria en lugar de fallar.

- `isDemoSession()` → no hay token, o el token empieza con `demo-`.
- `isNetworkError()` → no hubo respuesta, o fue 502/503/504, o un 500 con cuerpo vacío (lo que
  devuelve el proxy de Vite cuando Spring Boot está apagado).
- `shouldFallbackToDemo()` → combina ambas.

**Lo importante:** los errores reales de negocio (400, 404, **409**) se propagan y **no** se
simulan. El comentario del código es explícito sobre `bookTemporaryHold`: no se simula éxito
ante un 409 porque eso rompería el control de concurrencia y mostraría un turno reservado que
no existe.

Es una decisión defendible (permite demostrar la UI sin levantar el backend) pero hay que
saber explicarla, porque a primera vista parece que la aplicación "inventa" datos.

---

## 12. Diagramas de diseño y de secuencia

### Dónde están

| Documento | Contenido |
| :--- | :--- |
| `docs/modelo_diseno_casos_de_uso.md` | **El principal.** Diagramas de clases y de secuencia en Mermaid para los tres casos de uso, con especificación textual de cada clase participante y descripción numerada de los mensajes |
| `docs/casos_de_uso_corregidos.md` | Plantillas de casos de uso (actor, propósito, precondiciones, flujo principal, flujos excepcionales) verificadas contra el código |
| `docs/arquitectura_en_capas.md` | Marco teórico de la arquitectura en capas + análisis de cumplimiento |
| `docs/sobre_seguridad_claves_hardcodeadas.md` | Nota sobre el manejo de secretos |
| `docs/01_content_and_functionality_inventory.md` | Inventario de contenido y funcionalidad |
| `graphify-out/graph.html` | Grafo de conocimiento navegable del código (generado) |

### Qué contiene `modelo_diseno_casos_de_uso.md`

Para cada uno de los tres casos de uso trae cuatro piezas:

1. **Diagrama de clases** en Mermaid (`classDiagram`), con estereotipos UML.
2. **Especificación textual de las clases**: estereotipo, atributos con tipos, firmas de
   métodos, relaciones y multiplicidad. Esto permite redibujar el diagrama en cualquier
   herramienta UML sin volver al código.
3. **Diagrama de secuencia** en Mermaid (`sequenceDiagram`), incluyendo los flujos
   excepcionales con bloques `alt` / `opt`.
4. **Descripción numerada de los mensajes**, que acompaña al diagrama de secuencia.

### Convención de estereotipos usada

| Estereotipo | Qué marca |
| :--- | :--- |
| `<<boundary>>` | Frontera con el usuario: componentes React + controladores REST |
| `<<control>>` | Services y el Factory (coordinan el flujo) |
| `<<entity>>` | Entidades JPA del dominio |
| `<<repository>>` | Los DAO |
| `<<strategy>>` | Las estrategias de registro de pago |
| `<<adapter>>` | Adaptadores hacia sistemas externos |
| `<<dto>>` | Objetos de transferencia |
| `<<utility>>` | `HoldPolicy` |
| `<<singleton>>` | `ConexionBD` |
| `<<external>>` | La pasarela MercadoPago |

### Un detalle de consistencia

El encabezado de `modelo_diseno_casos_de_uso.md` describe la arquitectura como "hexagonal /
Clean" y menciona "repositorios de dominio + adapter + Spring Data JPA". **El cuerpo del
documento y el código dicen otra cosa**: los diagramas muestran DAO directos
(`AppointmentDAO`, `PatientDAO`, etc.) y una nota aclara expresamente que no hay capas
intermedias de puerto/adapter.

Es decir: los diagramas están bien y son fieles al código; el encabezado quedó desactualizado
de una versión anterior. Si se va a entregar ese documento, conviene corregir el encabezado
para que diga "arquitectura en capas" y no "hexagonal". Ver sección 15.

### Diagrama de contexto del sistema

```
   ┌──────────────┐          ┌──────────────┐
   │   Paciente   │          │   Personal   │
   │  (público)   │          │  de la clínica│
   └──────┬───────┘          └──────┬───────┘
          │                         │
          │  landing, catálogo,     │  login + JWT
          │  link de pago           │  agenda, pagos, HC
          ▼                         ▼
   ┌───────────────────────────────────────────┐
   │        Frontend React (Vite SPA)          │
   │        Vercel + proxy inverso             │
   └───────────────────┬───────────────────────┘
                       │  HTTPS / JSON
                       ▼
   ┌───────────────────────────────────────────┐
   │   Backend Spring Boot  (Render, Docker)   │
   │                                           │
   │   presentation → application → dao        │
   └───┬───────────┬───────────┬───────────┬───┘
       │           │           │           │
       ▼           ▼           ▼           ▼
  PostgreSQL  MercadoPago   Gemini    Supabase
  (Supabase)  (pagos +      (chatbot)  Storage
              webhook)                 (fotos)
```

---

## 13. Desarrollo asistido por agentes de IA

Este proyecto se desarrolla de forma colaborativa con agentes de IA. No es un detalle
anecdótico: hay infraestructura concreta en el repositorio para dirigir, acotar y auditar ese
trabajo. Esta sección documenta cómo funciona.

### 13.1 El problema que resuelve

Un agente de IA, si se lo deja suelto, tiende a sobre-ingeniar: agrega capas de abstracción,
patrones no pedidos, infraestructura de producción. En un proyecto académico eso es
contraproducente, porque el código tiene que ser **defendible oralmente por una estudiante en
20 minutos**. Una abstracción que no se puede explicar en dos frases es un pasivo, no un
activo.

La respuesta del repositorio es un conjunto de reglas escritas que el agente lee
automáticamente al inicio de cada sesión.

### 13.2 `AGENTS.md` — el contrato principal

Está en la raíz y se inyecta como contexto en cada sesión. Su principio rector es explícito:

> **SIMPLICIDAD POR SOBRE SOFISTICACIÓN.** Ante dos soluciones, elegir siempre la más simple
> y explicable, aunque sea "menos elegante".

Define cuatro bloques:

**(a) Lo que SÍ debe cumplirse** — los seis requisitos de la cátedra (capas, DAO, Singleton,
Strategy, seguridad, consistencia UML–código).

**(b) Lo que hay que EVITAR** — y esta lista es la parte más valiosa, porque son errores que
el agente cometió o estuvo a punto de cometer:

- Arquitectura hexagonal / puertos y adaptadores.
- Vías de persistencia duplicadas (stored procedures vía RPC *además* de JPA para lo mismo).
- `@Version` / bloqueo optimista no pedido.
- Auditoría automática de entidades.
- Documentos PRD extensos, mutation testing, protocolos de múltiples fases con barreras.

**(c) Flujo de trabajo liviano** — entender antes de tocar, explicar el plan, pedir
confirmación si el cambio es destructivo, implementar simple, verificar que compila
(`mvn -q -DskipTests package` y `npm run build`), mantener los diagramas al día.

**(d) Convenciones** — `docs/` es documentación propia; `documentacion/` es de otra persona y
no se toca; responder en español; rutas REST con prefijo `/api/v1`.

### 13.3 La historia que cuenta `.agents/`

La carpeta `.agents/` es el registro arqueológico de un enfoque **anterior**, mucho más
pesado, y es instructivo justamente por eso.

```
.agents/
├── ORIGINAL_REQUEST.md
├── rules/
│   ├── orchestrator-protocol.md     ← protocolo de 5 fases con barreras
│   └── graphify.md
├── orchestrator/                    ← agente coordinador
├── sub_orch_m1/ sub_orch_m2/ …      ← sub-orquestadores por milestone
├── explorer_survey_1/ _2/ _3/       ← agentes de relevamiento
├── explorer_m1_r1_1/ … _m2_3/       ← agentes exploradores por tarea
└── sentinel/                        ← agente auditor
```

Cada carpeta de agente tiene el mismo esqueleto: `BRIEFING.md` (qué se le pide),
`DISPATCH.md` (la orden concreta), `analysis.md` (lo que encontró), `handoff.md` (lo que
entrega al siguiente) y `progress.md`.

El `orchestrator-protocol.md` definía un ciclo obligatorio de **5 fases con barreras de
parada**:

| Fase | Qué hacía | Barrera |
| :-- | :--- | :--- |
| 1 | Mapeo de impacto consultando el grafo graphify | automática |
| 2 | Redactar un PRD formal en `documentacion/historial_prds/` | **esperar "Aprobado"** |
| 3 | Redactar el plan técnico en `implementation_plan.md` | **esperar "Aprobado"** |
| 4 | Implementar + tests + `mvn test` + `npm run build` iterando hasta exit code 0 | automática |
| 5 | Auditoría de invariantes y cierre | — |

**Por qué se abandonó.** Era desproporcionado para un TP de grado. Producía documentación
voluminosa (PRDs, planes técnicos, reportes de orquestación) que nadie iba a defender, y
empujaba decisiones de diseño sofisticadas: el propio protocolo menciona `@Version` y
"Clean Architecture" como invariantes a preservar, que son exactamente las cosas que
`AGENTS.md` ahora prohíbe.

`PROJECT.md` es el testimonio de ese período: documenta una fase completa dedicada a
**mutation testing ad-hoc**, con un harness en Python (`scripts/mutation_runner.py`) que
inyectaba mutaciones en el código fuente, corría JUnit y clasificaba resultados en
KILLED / SURVIVED / TIMEOUT. Técnicamente interesante; completamente fuera del alcance de la
cátedra.

**La lección, que es el aporte real de esta sección:** el valor no estuvo en la sofisticación
del protocolo, sino en **escribir las restricciones**. Lo que mejoró la calidad del trabajo
fue pasar de "hacé lo que creas mejor" a "estos seis requisitos sí, estas cinco cosas no, y
ante la duda elegí lo más simple".

### 13.4 Herramientas de contexto

**graphify — grafo de conocimiento del código.** Una CLI que parsea el código con AST (local,
sin LLM ni API key) y construye un grafo navegable de las relaciones entre archivos, clases y
funciones.

```powershell
graphify update .                 # construye o actualiza el grafo (incremental)
graphify export obsidian          # vista navegable en Obsidian
graphify explain "AppointmentService"          # un concepto y sus conexiones
graphify path "BookingWizard" "Appointment"    # cómo se relacionan dos cosas
graphify query "cómo se confirma un turno tras el pago"
```

Genera `graphify-out/` con `graph.html` (navegable), `GRAPH_REPORT.md` (nodos más conectados,
comunidades) y `graph.json` (consultable sin releer archivos). La salida **no se versiona**:
es regenerable.

El archivo `.graphifyignore` acota el alcance al código real: excluye `documentacion/`,
`docs/`, `.agents/`, `.github/`, tests, assets, builds y todos los `*.md` salvo el README. Así
el grafo contiene ~206 archivos de `backend/src` y `frontend/src`, sin documentación ni
metadatos de agentes.

La utilidad concreta: en lugar de grepear a ciegas para entender qué rompe un cambio, se
consulta el grafo. Para un sistema con 11 servicios, 11 controladores y 38 DTOs, eso ahorra
bastante.

**Hooks de Kiro** (`.kiro/hooks/`): tres archivos.

- `graphify-guard.json` + `graphify-guard.ps1` — guard que corre sobre eventos del IDE.
- `graphify-update-reminder.json` — recuerda regenerar el grafo al guardar archivos de código.

Son archivos JSON que el agente lee al iniciar sesión y ejecuta según el trigger
(`PostFileSave`, `PreToolUse`, `SessionStart`, etc.).

**CI en GitHub Actions** (`.github/workflows/`): `backend-ci.yml`, `frontend-ci.yml` y
`jules-agent.yml`. El tercero es para Google Jules, un agente asíncrono que opera el
repositorio de forma desatendida. En ese modo las barreras de aprobación se trasladan a la
revisión humana de la Pull Request antes del merge a `main`.

### 13.5 Cómo trabajar con el agente en la práctica

Lo que funciona:

1. **Pedir investigación antes de implementación.** "Leé cómo funciona X y explicame" antes de
   "cambiá X". Un agente que no leyó el código inventa.
2. **Exigir verificación.** Que corra `mvn -q -DskipTests package` y `npm run build` y muestre
   el resultado. Que el código compile no es opcional.
3. **Pedir el plan primero** para cambios de más de un archivo. Es mucho más barato corregir
   un plan que un refactor.
4. **Desconfiar de las abstracciones que propone.** La pregunta de control es: ¿puedo
   explicar esto en dos frases? Si no, sobra.
5. **Pedirle que señale lo que no verificó.** Un agente útil distingue entre "leí esto" y
   "asumo esto".

Lo que no funciona:

- Pedir una feature grande de una sola vez sin revisar los pasos intermedios.
- Aceptar "listo, funciona" sin ver la salida del build.
- Dejar que elija la arquitectura. Para eso está `AGENTS.md`.

### 13.6 La IA dentro del producto

Distinto de lo anterior: el sistema **también** usa IA como funcionalidad.

`GeminiChatbotService` + `GeminiApiClientAdapter` implementan un asistente virtual público
sobre la API de Google Gemini, expuesto en `POST /api/v1/chat/gemini` y consumido por
`GeminiChatbotWidget.tsx`.

Un detalle de diseño: `application.yml` define una **cascada de 6 modelos** en
`GEMINI_MODELS_CASCADE`. Si el modelo principal no está disponible o devuelve error, el
adaptador prueba el siguiente. Es resiliencia barata frente a un proveedor cuyos nombres de
modelo cambian seguido.

---

## 14. Build, ejecución, tests y despliegue

### Levantar el proyecto

**Opción A — Docker Compose (todo junto):**

```powershell
docker-compose up
```

Levanta tres servicios: `postgres` (15-alpine, con healthcheck `pg_isready`), `backend`
(puerto 8080, espera a que postgres esté sano) y `frontend` (node 20-alpine, puerto 5173).

Las credenciales se inyectan con la sintaxis `${VAR:?mensaje}`, que **aborta el `up`** si la
variable no está en el `.env`. Es intencional: falla rápido y claro en lugar de arrancar con
una configuración a medias.

**Opción B — por separado:**

```powershell
# Backend
cd backend
mvn spring-boot:run              # http://localhost:8080/api/v1

# Frontend (otra terminal)
cd frontend
npm install
npm run dev                      # http://localhost:5173
```

En desarrollo, `vite.config.ts` hace proxy de `/api/v1` hacia `http://localhost:8080`, así que
el frontend usa rutas relativas y no hay problemas de CORS.

### Variables de entorno

**Obligatorias** (sin valor por defecto; la aplicación **no arranca** sin ellas):

| Variable | Para qué |
| :--- | :--- |
| `JWT_SECRET_KEY` | Firma de los tokens JWT |
| `AES_ENCRYPTION_KEY` | Cifrado de datos clínicos. Base64 de 32 bytes: `openssl rand -base64 32` |
| `SUPABASE_ANON_KEY` | Acceso a Supabase Storage |

**Opcionales** (con default): `SPRING_DATASOURCE_URL` / `USERNAME` / `PASSWORD`,
`MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_PUBLIC_KEY`, `MERCADOPAGO_WEBHOOK_SECRET`,
`GEMINI_API_KEY`, `APP_CORS_ALLOWED_ORIGINS`, `FRONTEND_BASE_URL`, `BACKEND_BASE_URL`,
`VITE_API_BASE_URL` (frontend).

Ver `.env.example` y `frontend/.env.example`.

### Comandos de verificación

```powershell
# Backend: compila sin correr tests
cd backend; mvn -q -DskipTests package

# Backend: corre la suite completa
cd backend; mvn test

# Frontend: compila y verifica tipos
cd frontend; npm run build

# Frontend: solo verificar tipos
cd frontend; npx tsc --noEmit
```

### Tests

**16 clases, 115 métodos `@Test`**, todas en el backend. El frontend no tiene tests.

| Capa | Clases | Tests | Cobertura |
| :--- | :-- | :-- | :--- |
| `application/` (servicios) | 8 | 90 | `PaymentServiceTest` (23 tests, 652 líneas) es la más grande y cubre el patrón Strategy. Le siguen `AppointmentServiceTest` (12), `DermatologicServiceServiceTest` (12), `UserServiceTest` (11), `AuthServiceTest` (10), `AnalyticsServiceTest` (9), `CalendarBlockServiceTest` (7), `PatientServiceTest` (6) |
| `infrastructure/` | 4 | 18 | `SecurityInfrastructureTest` (6), `AesEncryptionServiceTest` (5, incluye detección de manipulación), `GeminiApiClientAdapterTest` (5), `GeminiContextInstantiationTest` (2) |
| `presentation/` | 4 | 17 | `CalendarBlockControllerTest` (6), `ServiceCatalogControllerTest` (5), `AnalyticsControllerTest` (3), `GlobalExceptionHandlerTest` (3) |

Enfoque: tests unitarios con Mockito (`@ExtendWith(MockitoExtension.class)`), mockeando los
DAO y los adaptadores externos.

**Qué no está cubierto**, por honestidad: no hay tests de `AppointmentController`,
`AuthController`, `MedicalRecordController`, `PatientController`, `UserController`,
`PaymentWebhookController` ni `GeminiChatbotController`. No hay tests de integración con
`@SpringBootTest` sobre la cadena de seguridad completa, ni Testcontainers, ni JaCoCo.

### Despliegue

| Archivo | Despliega | Detalle |
| :--- | :--- | :--- |
| `Dockerfile` (raíz) | Backend | Build multi-etapa: Maven 3.9.6 + Temurin 17 → `eclipse-temurin:17-jre`. Usuario no-root `appuser`. G1GC y `MaxRAMPercentage=75` |
| `render.yaml` | Backend | Servicio web Docker en Render, plan free, región oregon |
| `vercel.json` | Frontend | Build estático + dos rewrites |
| `docker-compose.yml` | Todo (local) | postgres + backend + frontend |

El detalle inteligente de `vercel.json`: el rewrite `/api/(.*)` →
`https://clinicalorder.onrender.com/api/$1` actúa como proxy inverso. El navegador ve
same-origin, así que **no hay CORS en producción**. El segundo rewrite, `/(.*)` →
`/index.html`, es el fallback de SPA para que React Router maneje las rutas. Además agrega
tres headers de seguridad (`nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection`).

---

## 15. Inconsistencias conocidas y deuda técnica

Esta sección existe porque la cátedra evalúa **consistencia entre los modelos de diseño y el
código**, y porque es mejor conocer los desvíos que ser sorprendido por ellos.

### Documentación desalineada con el código

| # | Dónde | Qué dice | Qué pasa en realidad | Acción |
| :-- | :--- | :--- | :--- | :--- |
| 1 | Encabezado de `docs/modelo_diseno_casos_de_uso.md` | "arquitectura hexagonal / Clean … repositorios de dominio + adapter" | Los diagramas del mismo documento y el código muestran **DAO directos**. El cuerpo está bien; el encabezado quedó de una versión anterior | Corregir el encabezado a "arquitectura en capas" |
| 2 | `PROJECT.md` | "columna de bloqueo optimista `@Version` en `cita`" | **Ninguna entidad usa `@Version`.** El control de concurrencia es solapamiento + hold de 10 min | Es documento histórico de otra fase; no refleja el estado actual |
| 3 | `.agents/rules/orchestrator-protocol.md` | Exige preservar `@Version` y "Clean Architecture" | Contradice directamente a `AGENTS.md`, que prohíbe ambas | Protocolo abandonado. Considerar archivarlo para evitar confusión |
| 4 | `PROJECT.md` | Menciona `clinical_entries_audit` | Las tablas reales son `historia_clinica_audit` y `entrada_hc_audit` | Nombre desactualizado |

El punto 1 es el único que conviene arreglar antes de entregar, porque es el documento de
diseño que se presenta.

### Deuda en el código

| # | Qué | Detalle | Impacto |
| :-- | :--- | :--- | :--- |
| 5 | **El flujo de reserva no usa el Strategy** | `bookTemporaryHold` construye la `PaymentTransaction` inline, aunque `MercadoPagoPaymentStrategy` hace exactamente lo mismo. Hay duplicación real | Bajo funcional, pero **debilita el argumento del patrón**. Si se pregunta "¿dónde se usa `MercadoPagoPaymentStrategy`?", la respuesta honesta es que casi no se usa |
| 6 | **Desalineación de `externalReference`** | La preferencia se crea con `externalReference = appointmentId`, pero la transacción se guarda con `mpPreferenceId = preference.getId()`. Son valores distintos, así que `findByMpPreferenceId(externalReference)` normalmente no matchea y resuelve el fallback | Funciona, pero la primera búsqueda es código muerto en la práctica |
| 7 | **Endpoint inexistente en el frontend** | `appointmentsApi.rescheduleAppointment` llama a `POST /citas/{id}/reprogramar`, que no existe en `AppointmentController` | Devolvería 404 y el catch del modo demo lo absorbe silenciosamente. Falla muda |
| 8 | **Health check de Render inválido** | `render.yaml` define `healthCheckPath: /api/v1/health`. No existe ese endpoint (no hay actuator) y el real es `/api/v1/estado`, que además requiere autenticación | El health check nunca puede dar 200 |
| 9 | **`AES_ENCRYPTION_KEY` en el servicio frontend** | `docker-compose.yml` se la pasa al contenedor del frontend, donde no cumple ninguna función | Ruido de configuración. Pasar una clave de cifrado a un contenedor que no la necesita es mala práctica |
| 10 | **Dos Dockerfiles** | `docker-compose.yml` apunta a `./backend/Dockerfile`, distinto del `Dockerfile` de la raíz que usa Render | Dos definiciones de build que pueden divergir |
| 11 | **`resolveAuditorUser` nunca falla** | Si el `userId` no existe, cae silenciosamente al usuario 1 en lugar de rechazar | Debilita la confiabilidad de la traza de auditoría |
| 12 | **Perfil `prod` sin configuración** | `render.yaml` setea `SPRING_PROFILES_ACTIVE=prod`, pero no existe `application-prod.yml` | El perfil queda sin efecto. No rompe nada, pero es engañoso |
| 13 | **`RoleGuard.tsx` huérfano** | Existe pero `App.tsx` solo usa `ProtectedRoute` | Código muerto |
| 14 | **Expiración del token duplicada** | 8 horas está en `application.yml` y además como literal `28800000L` en `AuthService` | Si se cambia uno y no el otro, el cliente y el servidor discrepan |

### Si hubiera que priorizar

Para una entrega académica, en este orden:

1. **(1)** Corregir el encabezado de `modelo_diseno_casos_de_uso.md`. Es el documento de
   diseño que se evalúa, y la cátedra pide consistencia explícitamente.
2. **(5)** Decidir qué hacer con el Strategy en el flujo de reserva: o se usa la estrategia
   (y se elimina la duplicación), o se explica por qué no. Es el patrón que se defiende.
3. **(7)** y **(8)** son fallas silenciosas fáciles de arreglar.
4. El resto es ruido tolerable en un TP.

---

## 16. Guía de defensa oral

Respuestas breves a las preguntas más probables.

**¿Qué arquitectura usaron?**
Arquitectura en capas, cerrada. Cuatro capas: Presentación (`@RestController`), Lógica de
negocio (`@Service`), Persistencia (DAO con Spring Data JPA) y Base de datos (PostgreSQL). El
flujo siempre baja una capa a la vez, sin saltos.

**¿Es MVC?**
Es la forma que toma el MVC en una aplicación web desacoplada. Controlador y Modelo están en
el backend; la Vista es el frontend React que consume la API REST. El backend no tiene vista:
devuelve JSON.

**¿Por qué los paquetes se llaman `domain` e `infrastructure` si es en capas?**
Es solo nomenclatura. `presentation` es la capa de presentación, `application` la de negocio,
`infrastructure/persistence/dao` la de persistencia. No hay puertos ni adaptadores en los
casos de uso defendidos: los servicios hablan directo con los DAO.

**¿Dónde está el patrón DAO?**
En `infrastructure/persistence/dao`, seis interfaces, una por entidad. Cada una extiende
`JpaRepository` y Spring genera la implementación. El DAO aísla a la lógica de negocio de los
detalles de SQL.

**¿Dónde está el Singleton?**
`ConexionBD`: constructor privado, instancia estática única, `getInstance()` perezoso y
`synchronized`. Lo consume `SystemStatusController` en `GET /api/v1/estado`. Además
`AesEncryptionService` está marcado `@Scope("singleton")` porque la clave AES se valida una
sola vez al arrancar, y todos los beans de Spring son singleton por defecto.

**¿Dónde está el Strategy y qué problema resuelve?**
En el registro de pagos. Cada canal (efectivo, transferencia, MercadoPago) persiste la
transacción distinto: los dos primeros quedan `APPROVED` al instante, MercadoPago queda
`PENDING` hasta el webhook. Sin Strategy habría un `if/else` sobre `PaymentType` en el
servicio. Con Strategy, `PaymentService` hace
`factory.getStrategy(tipo).register(...)` y no conoce los canales.

**¿Cómo se agrega un canal de pago nuevo?**
Se crea una clase que implemente `PaymentRegistrationStrategy`, anotada `@Component`. Spring
la inyecta automáticamente en la lista que recibe el Factory, que la indexa por su
`supportedType()`. No se modifica ni el servicio ni el Factory.

**¿Cómo evitan que dos personas reserven el mismo horario?**
Con un bloqueo temporal de 10 minutos. Al reservar, el turno queda en `PENDING_PAYMENT` y
retiene el horario. Antes de permitir una reserva nueva se consultan los turnos solapados; los
holds vencidos se cancelan en el momento y no bloquean, los vigentes sí. Si hay colisión real,
se responde 409.

**¿Y si el usuario cierra el navegador?**
El frontend intenta liberar el hold con `fetch(keepalive)`, pero no es garantizado. La garantía
real es del servidor: a los 10 minutos el hold vence. Y además de un job periódico, cada
operación relevante evalúa `HoldPolicy.isExpired()` en el momento, así que un hold vencido deja
de retener el horario de inmediato.

**¿Usan bloqueo optimista?**
No. No hay `@Version`. El control es la verificación de solapamiento más el hold de 10
minutos. Es más simple y alcanza para el volumen de este dominio.

**¿Cómo se aseguran de que un pago de MercadoPago sea real?**
Tres mecanismos. Primero, se valida la firma HMAC SHA-256 del header `x-signature`. Segundo,
el estado del pago **nunca** se toma del cuerpo de la notificación: se consulta contra la API
oficial de MercadoPago. Tercero, hay idempotencia: si la transacción ya está `APPROVED`, no se
reprocesa, porque MercadoPago reintenta las notificaciones.

**¿Qué conceptos de seguridad aplicaron?**
Autenticación con JWT stateless firmado en HS256, contraseñas con BCrypt costo 12.
Autorización por roles en dos capas: matriz de rutas en `SecurityConfig` con denegación por
defecto, más `@PreAuthorize` por método. Cifrado AES-256-GCM de los campos clínicos sensibles.
Firewall HTTP estricto, cabeceras de seguridad, CORS restringido, y errores en formato RFC
7807 que no filtran stacktraces.

**¿Por qué el rol se relee de la base en cada request si viene en el token?**
Para que revocar un rol surta efecto inmediato, sin esperar las 8 horas de expiración del
token. Cuesta un SELECT por petición y es un trade-off aceptable.

**¿Cuál es el punto más débil del sistema?**
Que `POST /citas/reservar-temporal` es público y sin rate limiting: alguien podría llenar la
agenda de holds. El TTL de 10 minutos limita el daño, pero la mitigación correcta sería
limitar por IP. Y en el código, que el flujo de reserva construye la transacción de
MercadoPago inline en lugar de usar `MercadoPagoPaymentStrategy`, lo que duplica lógica.

---

*Documento de trabajo. Verificado contra el código del repositorio. Última revisión: octubre de 2026.*
