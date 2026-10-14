# Analysis Report — Backend Codebase Survey

**Date**: 2026-08-10  
**Agent**: `explorer_survey_1`  
**Target Path**: `backend/`

---

## Executive Summary

The `backend` directory contains a **Java 17 / Spring Boot 4.1.0** RESTful web application named **DermaCare Backend** (Sistema de Gestión Dermatológica). The application relies on **Spring Data JPA** with a **PostgreSQL** database (hosted on Supabase) and **Spring Security** with **JSON Web Tokens (JWT)** for stateless authentication.

Current state of the backend:
- Layered architecture with Entities, Repositories, Controllers, and Security configuration.
- Business logic service layer is currently empty (`com.dermacare.backend.services` directory exists but contains zero files).
- Existing test suite contains only a single placeholder context loading test (`BackendApplicationTests.java`).
- Mutation testing tool (such as `pitest-maven` for Java/Spring Boot) is **not yet configured** in `pom.xml`.

---

## 1. Technologies & Dependencies

- **Language & Runtime**: Java 17
- **Framework**: Spring Boot 4.1.0 (`spring-boot-starter-parent`)
- **Build System**: Maven (Wrapper `./mvnw` provided)
- **Database / ORM**: PostgreSQL (`org.postgresql:postgresql`), Hibernate ORM via Spring Data JPA (`spring-boot-starter-data-jpa`)
- **Authentication & Security**: Spring Security (`spring-boot-starter-security`), JJWT 0.12.3 (`io.jsonwebtoken:jjwt-api`, `jjwt-impl`, `jjwt-jackson`)
- **Validation**: `spring-boot-starter-validation`
- **Web MVC**: `spring-boot-starter-webmvc`
- **Test Libraries**: Spring Boot Test Starters (`spring-boot-starter-data-jpa-test`, `spring-boot-starter-security-test`, `spring-boot-starter-validation-test`, `spring-boot-starter-webmvc-test`, JUnit 5, Mockito, Spring Security Test).

---

## 2. Architectural Overview & Design

```
com.dermacare.backend
├── BackendApplication.java (Main Entry Point)
├── controllers/            (REST Endpoints: Auth, Patient, Appointment)
├── entities/               (JPA Entities: Appointment, Consultation, Patient, Profile, ServiceEntity, Enums)
├── repositories/           (Spring Data JPA Repositories: Appointment, Patient)
├── security/               (JWT Filter, JWT Service, Security Configuration)
└── services/               (Empty directory)
```

- **Pattern**: Classic Controller-Repository model (Services layer pending implementation).
- **Session Policy**: Stateless (`SessionCreationPolicy.STATELESS`), authenticated via JWT Bearer headers.
- **Database Configuration**: Supabase PostgreSQL database connection configured in `application.yml` (`jdbc:postgresql://aws-0-us-east-2.pooler.supabase.com:6543/postgres`).

---

## 3. Detailed Component Inventory

### 3.1 Entities (`com.dermacare.backend.entities`)

1. **`Appointment.java`** (Table: `appointments`)
   - Primary key: `id` (Long, Auto-increment)
   - Relations: `@ManyToOne` `doctor` (`Profile`), `@ManyToOne` `patient` (`Patient`), `@ManyToOne` `service` (`ServiceEntity`)
   - Custom Types: `timeRange` (`String` storing PostgreSQL `tstzrange`), `status` (`AppointmentStatus` enum, default `AVAILABLE`), `lockedUntil` (`ZonedDateTime`)
   - Payment Integration Fields: `mercadoPagoPreferenceId`, `mercadoPagoPaymentId`
   - Audit fields: `createdAt`, `updatedAt` (`@PrePersist`, `@PreUpdate`)

2. **`AppointmentStatus.java`** (Enum)
   - Values: `AVAILABLE`, `PENDING_PAYMENT`, `CONFIRMED`, `CANCELLED`, `COMPLETED`

3. **`Consultation.java`** (Table: `consultations`)
   - Primary key: `id` (Long, Auto-increment)
   - Relations: `@OneToOne` `appointment` (`Appointment`, unique, non-null)
   - Clinical Evaluation Fields: `reasonForVisit`, `fitzpatrickPhototype`, `facialExam`, `bodyExam`
   - Follow-up Fields: `procedurePerformed`, `materialsUsed`, `complicationsObserved`, `patientSatisfactionLevel` (Integer 1-5), `notes`
   - Audit field: `createdAt` (`@PrePersist`)

4. **`Patient.java`** (Table: `patients`)
   - Primary key: `id` (Long, Auto-increment)
   - Personal Info: `firstName` (non-null), `lastName` (non-null), `dni` (unique, non-null), `age`, `profession`, `contactPhone`, `contactEmail`
   - Clinical History Fields: `pathologicalHistory`, `allergies`, `toxicHabits`, `sunExposure`, `spfUse`, `surgicalHistory`, `gynecologicalHistory`, `habitualMedication`
   - Audit fields: `createdAt`, `updatedAt`

5. **`Profile.java`** (Table: `profiles`)
   - Primary key: `id` (`UUID`, non-generated; aligns with authentication provider user UUID)
   - Fields: `role` (`UserRole` enum), `firstName`, `lastName`, `createdAt`

6. **`ServiceEntity.java`** (Table: `services`)
   - Primary key: `id` (Long, Auto-increment)
   - Fields: `name`, `description`, `durationMinutes`, `price` (`BigDecimal`), `isActive` (`Boolean`, default `true`), `createdAt`

7. **`UserRole.java`** (Enum)
   - Values: `ADMIN_SECRETARIA`, `MEDICA_PRESTADORA`

---

### 3.2 Repositories (`com.dermacare.backend.repositories`)

1. **`AppointmentRepository`**: Extends `JpaRepository<Appointment, Long>`.
2. **`PatientRepository`**: Extends `JpaRepository<Patient, Long>`.
*Note*: `ConsultationRepository`, `ProfileRepository`, and `ServiceRepository` are missing.

---

### 3.3 Security Components (`com.dermacare.backend.security`)

1. **`SecurityConfig`**:
   - Enables WebSecurity, disables CSRF, configures CORS.
   - Configures URL permissions:
     - `/api/auth/**` → `permitAll()`
     - `/api/public/**` → `permitAll()`
     - `anyRequest()` → `authenticated()`
   - Registers `JwtAuthenticationFilter` prior to `UsernamePasswordAuthenticationFilter`.

2. **`JwtAuthenticationFilter`**:
   - Extends `OncePerRequestFilter`.
   - Reads `Authorization: Bearer <token>` header.
   - Parses `userId` using `JwtService`.
   - Populates `SecurityContextHolder` with `UsernamePasswordAuthenticationToken`.

3. **`JwtService`**:
   - Reads `jwt.secret` and `jwt.expiration` from configuration.
   - Parses JWT claims using JJWT library keys (`io.jsonwebtoken.security.Keys.hmacShaKeyFor`).
   - Provides helper methods `extractUsername`, `isTokenValid`, `isTokenExpired`.

---

### 3.4 REST Controllers & API Routes (`com.dermacare.backend.controllers`)

| HTTP Method | Route | Controller | Method | Description | Security |
|---|---|---|---|---|---|
| `POST` | `/api/auth/login` | `AuthController` | `login` | Accepts username, generates signed JWT token with `ADMIN_SECRETARIA` role claim. | `permitAll()` |
| `GET` | `/api/appointments` | `AppointmentController` | `getAllAppointments` | Retrieves all appointments from database. | `authenticated()` |
| `GET` | `/api/patients` | `PatientController` | `getAllPatients` | Retrieves all patients from database. | `authenticated()` |
| `POST` | `/api/patients` | `PatientController` | `createPatient` | Persists a new patient to database. | `authenticated()` |

---

## 4. Existing Tests & Test Gaps

- **Existing Test**: `src/test/java/com/dermacare/backend/BackendApplicationTests.java` with single empty test `contextLoads()`.
- **Gaps**:
  1. No unit tests for JWT authentication (`JwtService`, `JwtAuthenticationFilter`).
  2. No controller integration tests using `MockMvc` or `WebMvcTest` for `AuthController`, `AppointmentController`, or `PatientController`.
  3. No repository layer integration tests (`DataJpaTest`).
  4. No unit tests for entity callbacks (`@PrePersist`, `@PreUpdate`).
  5. No mutation testing plugin (`pitest-maven`) configured in `pom.xml`.

---

## 5. Key Recommendations for Implementation Phase

1. **Mutation Testing Setup**: Add `pitest-maven` plugin to `pom.xml` configured for JUnit 5 (`pitest-junit5-plugin`). Target mutation score requirement is ≥ 70%.
2. **Comprehensive Unit & Integration Test Coverage**:
   - `JwtServiceTest`: Test token generation, validation, expiration, and claim extraction.
   - `JwtAuthenticationFilterTest`: Test request filtering with valid, invalid, missing, and expired Bearer tokens.
   - `AuthControllerTest`: Test `/api/auth/login` endpoint (valid credentials, invalid payloads).
   - `PatientControllerTest`: Test `/api/patients` GET and POST endpoints using MockMvc and security contexts.
   - `AppointmentControllerTest`: Test `/api/appointments` GET endpoint.
   - Repository & Entity tests: Test entity lifecycle hooks (`@PrePersist`, `@PreUpdate`) and constraint validations.
