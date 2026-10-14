# Clínica Dermatológica y Estética — Sistema de Gestión de Turnos e Historias Clínicas

Sistema web para una clínica dermatológica que gestiona la reserva de turnos con seña
online, el cobro en mostrador, las historias clínicas con auditoría y un asistente de
consultas. Backend en Spring Boot, frontend en React y base de datos PostgreSQL.

[![Backend CI](https://github.com/eliasdelcastillo04/momento-de-epifania-inge2/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/eliasdelcastillo04/momento-de-epifania-inge2/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/eliasdelcastillo04/momento-de-epifania-inge2/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/eliasdelcastillo04/momento-de-epifania-inge2/actions/workflows/frontend-ci.yml)

---

## Tabla de contenidos

- [Qué hace el sistema](#qué-hace-el-sistema)
- [Pila tecnológica](#pila-tecnológica)
- [Arquitectura en capas](#arquitectura-en-capas)
- [Patrones de diseño aplicados](#patrones-de-diseño-aplicados)
- [Seguridad y roles](#seguridad-y-roles)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Cómo ejecutarlo](#cómo-ejecutarlo)
- [Pruebas](#pruebas)
- [Integración continua](#integración-continua)

---

## Qué hace el sistema

- **Reserva de turnos online con seña.** El paciente elige un servicio y un horario; el
  turno queda en estado `PENDING_PAYMENT` (bloqueo temporal) hasta que se paga la seña.
  Un proceso programado libera los bloqueos vencidos.
- **Cobro de la seña con MercadoPago.** Se genera una preferencia de pago y el estado del
  turno se confirma al recibir el webhook de la pasarela.
- **Agenda y cobros en mostrador.** La secretaria consulta la agenda, registra pagos
  (efectivo, transferencia o MercadoPago) y gestiona pacientes.
- **Historia clínica electrónica.** La médica registra la ficha del paciente (antecedentes,
  alergias, hábitos), notas de evolución e imágenes clínicas.
- **Auditoría de la historia clínica.** Toda modificación de la historia clínica queda
  registrada automáticamente en tablas de auditoría (`historia_clinica_audit`,
  `entrada_hc_audit`) mediante triggers de base de datos.
- **Asistente de consultas.** Un chatbot asistido por la API de Google Gemini responde
  dudas de los pacientes sobre tratamientos.
- **Panel de métricas.** Indicadores de gestión (facturación, turnos, tratamientos).

---

## Pila tecnológica

| Capa | Tecnología | Versión |
| :--- | :--- | :--- |
| Backend | Spring Boot | 3.2.3 |
| Lenguaje backend | Java | 17 (LTS) |
| Persistencia | Spring Data JPA (Hibernate) | — |
| Migraciones | Flyway | 10.7.2 |
| Seguridad | Spring Security + JWT (jjwt) | 0.12.5 |
| Pagos | SDK de MercadoPago | 2.1.20 |
| Base de datos | PostgreSQL | 15 |
| Frontend | React | 18 |
| Lenguaje frontend | TypeScript | 5.3 |
| Build frontend | Vite | 5 |
| Estilos | Tailwind CSS | 3.4 |
| Datos en cliente | TanStack Query, Axios, Zod | — |
| Almacenamiento de imágenes | Supabase Storage | — |
| Asistente | Google Gemini API | — |

Las versiones provienen de `backend/pom.xml` y `frontend/package.json`.

---

## Arquitectura en capas

El backend sigue una **arquitectura en capas** con un flujo cerrado
`Controlador → Servicio → Acceso a datos → Base de datos`. Cada paquete corresponde a una capa:

```
Cliente web (React SPA)
        │  HTTP / REST (JWT)
        ▼
┌─────────────────────────────────────────────┐
│ presentation   Controllers + DTOs            │  Recibe HTTP, valida, devuelve JSON
│                GlobalExceptionHandler         │
├─────────────────────────────────────────────┤
│ application    Services + Strategy de pagos   │  Reglas de negocio y casos de uso
├─────────────────────────────────────────────┤
│ domain         Entidades + enums + exceptions │  Modelo del dominio
├─────────────────────────────────────────────┤
│ infrastructure persistence (DAO/JPA)          │  Acceso a datos, seguridad, pagos,
│                security, payment, storage, ai │  almacenamiento, IA, scheduling
└─────────────────────────────────────────────┘
        │  JDBC
        ▼
PostgreSQL  ·  Supabase Storage  ·  MercadoPago  ·  Google Gemini
```

Paquete raíz: `com.clinicadermatologica.app`

- `presentation.controller` — controladores REST (`@RestController`), prefijo `/api/v1/...`.
- `presentation.dto` — objetos de transferencia de entrada y salida.
- `presentation.advice` — manejo centralizado de errores (`GlobalExceptionHandler`).
- `application.service` — servicios de negocio (`@Service`): turnos, pagos, historia clínica, etc.
- `application.strategy` — contrato e implementación del patrón Strategy de pagos.
- `domain.model` — entidades JPA, enums (`UserRole`, `AppointmentStatus`, …) y objetos de valor.
- `domain.exception` — excepciones de negocio.
- `infrastructure.persistence.dao` — DAO por entidad (acceso a datos con Spring Data JPA).
  Ver la nota sobre acceso a datos más abajo.
- `infrastructure.security` — JWT, filtro de autenticación y configuración de Spring Security.
- `infrastructure.payment`, `infrastructure.storage`, `infrastructure.ai`,
  `infrastructure.notification`, `infrastructure.scheduling` — adaptadores a servicios externos
  y tareas programadas.

El frontend (`frontend/src`) se organiza por funcionalidades (`features/`): `appointments`,
`agenda`, `clinical`, `admin`, `analytics`, `auth`, `documents`, `public`, más componentes de
UI reutilizables (`components/ui`) y la capa de acceso a la API (`services/api.ts`).

### Nota sobre el acceso a datos (DAO)

El acceso a datos convive en dos estilos por una decisión deliberada de simplificación. Los
casos de uso que se presentan en la defensa se realizaron siguiendo **patrón DAO** directo (un
`@Repository` por entidad que extiende `JpaRepository`, en `infrastructure/persistence/dao`):
turnos (`AppointmentDAO`), bloqueos de calendario (`CalendarBlockDAO`), catálogo de servicios
(`DermatologicServiceDAO`), pacientes (`PatientDAO`), pagos (`PaymentTransactionDAO`) y
usuarios (`UserDAO`).

El módulo de **historia clínica** (alergias, antecedentes, hábitos, entradas e imágenes
clínicas) tiene una estructura de puerto + adaptador (`domain/repository` +
`infrastructure/persistence/adapter` + `infrastructure/persistence/jpa`). 
---

## Patrones de diseño aplicados


| Patrón | Dónde | Qué hace |
| :--- | :--- | :--- |
| **DAO** | `infrastructure/persistence/dao/` (ej. `AppointmentDAO`, `PatientDAO`) | Un DAO por entidad, extiende `JpaRepository` y concentra las consultas de acceso a datos de esa entidad. |
| **Singleton** | `infrastructure/persistence/ConexionBD` y `infrastructure/security/AesEncryptionService` | `ConexionBD` es un Singleton clásico (constructor privado + `getInstance()`), usado por `SystemStatusController` para verificar la base de datos. `AesEncryptionService` es un Singleton gestionado por Spring con `@Scope("singleton")` explícito, que carga una única vez la clave de cifrado. |
| **Strategy** | `application/strategy/` + `infrastructure/payment/strategy/` | `PaymentRegistrationStrategy` define el contrato de registro de un pago; `CashPaymentStrategy`, `BankTransferPaymentStrategy` y `MercadoPagoPaymentStrategy` lo implementan; `PaymentStrategyFactory` selecciona la estrategia según el medio de pago. |

---

## Seguridad y roles

- **Autenticación con JWT.** El inicio de sesión emite un token firmado (jjwt). Un filtro
  (`JwtAuthenticationFilter`) valida el token en cada petición. La sesión es *stateless*.
- **Autorización por roles (RBAC).** Spring Security protege los endpoints según el rol del
  usuario. Los roles están definidos en el enum `UserRole`:
  - `ADMIN` — administración general y configuración de servicios.
  - `DOCTORA` — acceso completo a historias clínicas y auditoría médica.
  - `SECRETARIA` — turnos, cobros y pacientes (sin acceso a datos clínicos).
- **Cifrado de datos sensibles.** `AesEncryptionService` cifra con AES-256-GCM los campos
  clínicos sensibles antes de persistirlos.
- **Respuestas de error uniformes.** Los errores se devuelven con un formato consistente a
  través de `GlobalExceptionHandler`, sin exponer trazas internas.

---

## Estructura del repositorio

```
.
├── backend/            API REST en Spring Boot (Java 17)
│   ├── src/main/java/com/clinicadermatologica/app/
│   │   ├── presentation/     controllers, dto, advice
│   │   ├── application/       service, strategy
│   │   ├── domain/            model, exception, repository
│   │   └── infrastructure/    persistence, security, payment, storage, ai, scheduling
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── db/migration/      migraciones Flyway (V1..V6)
│   └── src/test/              pruebas con JUnit 5 + Mockito
├── frontend/           SPA en React 18 + TypeScript + Vite
│   └── src/
│       ├── features/          vistas por funcionalidad
│       ├── components/        UI reutilizable
│       └── services/          acceso a la API y a Supabase
├── docs/               documentación de diseño (UML, casos de uso) — local
├── docker-compose.yml  orquestación local (postgres + backend + frontend)
└── README.md
```

> La carpeta `graphify-out/` (si existe) es un grafo de conocimiento generado por la
> herramienta [graphify](https://github.com/Graphify-Labs/graphify) y **no se versiona**.
> Ver [docs/graphify.md](docs/graphify.md) para cómo generarlo.

---

## Cómo ejecutarlo

### Requisitos

- Java 17 (JDK)
- Node.js 18 o superior y npm
- PostgreSQL 15 (o Docker, para levantarlo con `docker-compose`)

### Opción A — Docker Compose (todo en contenedores)

```bash
docker compose up -d
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080/api/v1`

### Opción B — Ejecución manual

Backend:

```bash
cd backend
mvn spring-boot:run
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Las variables de entorno (conexión a la base de datos, clave JWT, credenciales de
MercadoPago, Gemini y Supabase) se configuran según `backend/.env.example` y
`frontend/.env.example`. **No incluyas credenciales reales en el repositorio.**

El esquema de la base de datos se crea y versiona automáticamente con Flyway al iniciar
el backend (`backend/src/main/resources/db/migration`).

---

## Pruebas

Backend — JUnit 5 + Mockito (servicios, seguridad y controladores):

```bash
cd backend
mvn test
```

Frontend — verificación de tipos y compilación de producción:

```bash
cd frontend
npm run build   # ejecuta tsc && vite build
```

---

## Integración continua

El repositorio incluye workflows de GitHub Actions en `.github/workflows/`:

- **`backend-ci.yml`** — compila con Maven sobre Java 17 y ejecuta las pruebas.
- **`frontend-ci.yml`** — verifica el tipado y compila el frontend con Vite.

---
