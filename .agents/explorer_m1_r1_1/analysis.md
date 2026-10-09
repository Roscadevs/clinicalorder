# Backend Codebase Analysis Report — Milestone 1

## Executive Summary
This document presents a comprehensive analysis of the Spring Boot backend (`backend/src/main/java/com/dermacare/backend/`) for the **Sistema de Gestión Dermatológica**. It provides target-by-target analysis, dependency mappings, security mechanisms, entity models, build configuration gaps in `pom.xml`, and a recommended test strategy to achieve >=70% PITest mutation score across all target classes.

---

## 1. Target Classes Analysis

### 1.1 `com.dermacare.backend.security.JwtService`
- **Location**: `backend/src/main/java/com/dermacare/backend/security/JwtService.java` (59 lines)
- **Annotations**: `@Service`
- **Configuration Fields**:
  - `@Value("${jwt.secret}") private String secretKey;`
  - `@Value("${jwt.expiration}") private long jwtExpiration;`
- **Methods**:
  - `extractUsername(String token)`: Returns claims subject (`Claims::getSubject`).
  - `extractClaim(String token, Function<Claims, T> claimsResolver)`: Generic claims extractor.
  - `isTokenValid(String token, String username)`: Returns `(extractedUsername.equals(username)) && !isTokenExpired(token)`.
  - `isTokenExpired(String token)` (private): Compares expiration date with `new Date()`.
  - `extractExpiration(String token)` (private): Returns claims expiration date (`Claims::getExpiration`).
  - `extractAllClaims(String token)` (private): Parses token using JJWT 0.12.3 parser (`verifyWith(getSignInKey()).build().parseSignedClaims(token).getPayload()`).
  - `getSignInKey()` (private): Decodes `secretKey` using Base64 (`Decoders.BASE64.decode(secretKey)`) and returns HMAC-SHA256 `SecretKey`.
- **Observations & Edge Cases**:
  - `secretKey` must be a valid Base64 string of at least 256 bits (32 bytes).
  - Calling `extractUsername` or `extractClaim` on an expired token throws `io.jsonwebtoken.ExpiredJwtException`.
  - Calling methods with malformed or tampered tokens throws `MalformedJwtException` or `SignatureException`.
  - Note: `JwtService` currently lacks a public `generateToken` method (tokens are generated inline in `AuthController`), but token extraction and validation rely heavily on validly signed JWTs.
- **PITest Mutation Vulnerabilities**:
  - Boolean flips in `isTokenValid` (`equals` vs `!equals`, `&&` vs `||`).
  - Expiration comparison (`before(new Date())` vs `after(new Date())`).
  - Null checks or string comparisons.

### 1.2 `com.dermacare.backend.security.JwtAuthenticationFilter`
- **Location**: `backend/src/main/java/com/dermacare/backend/security/JwtAuthenticationFilter.java` (63 lines)
- **Annotations**: `@Component`
- **Extends**: `OncePerRequestFilter`
- **Constructor Injection**: `JwtService jwtService`
- **Method**:
  - `doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)`
- **Execution Flow**:
  1. Inspects `Authorization` header: `request.getHeader("Authorization")`.
  2. If `authHeader == null || !authHeader.startsWith("Bearer ")`: calls `filterChain.doFilter(request, response)` and returns immediately.
  3. Extracts token string: `authHeader.substring(7)`.
  4. Calls `jwtService.extractUsername(jwt)`.
  5. If `userId != null` AND `SecurityContextHolder.getContext().getAuthentication() == null`:
     - Instantiates `UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList())`.
     - Sets request details via `WebAuthenticationDetailsSource().buildDetails(request)`.
     - Sets authentication in `SecurityContextHolder.getContext().setAuthentication(authToken)`.
  6. Catches `Exception e` (if JWT is invalid/expired): logs error (`logger.error(...)`).
  7. Invokes `filterChain.doFilter(request, response)` at the end of execution regardless of authentication outcome.
- **Observations & Edge Cases**:
  - Substring extraction uses hardcoded offset `7` (`"Bearer ".length()`).
  - Empty/null authorization header, non-Bearer headers (e.g. "Basic xxx", "Bearer"), malformed Bearer strings.
  - Pre-existing SecurityContext authentication (must not overwrite).
  - Exceptions during token extraction must not halt the filter chain execution.
- **PITest Mutation Vulnerabilities**:
  - Substring index mutations (`substring(7)` changed to `substring(0)` or `8`).
  - `authHeader == null` or `!authHeader.startsWith("Bearer ")` condition mutations.
  - Bypassing or removing `filterChain.doFilter(...)`.

### 1.3 `com.dermacare.backend.controllers.AuthController`
- **Location**: `backend/src/main/java/com/dermacare/backend/controllers/AuthController.java` (44 lines)
- **Annotations**: `@RestController`, `@RequestMapping("/api/auth")`
- **Constructor Injection**: `JwtService jwtService`
- **Endpoints**:
  - `POST /api/auth/login`: `@RequestBody Map<String, String> credentials`
- **Behavior**:
  - Extracts `username = credentials.get("username")`.
  - Builds JWT with claim `role = "ADMIN_SECRETARIA"`, `subject = username`, `issuedAt = now`, `expiration = now + 24 minutes` (`1000 * 60 * 24` ms).
  - Signs JWT using Base64 decoded secret `"413F4428472B4B6250655368566D5970337336763979244226452948404D6351"`.
  - Returns `ResponseEntity.ok(Map.of("token", token))`.
- **Observations & Key Details**:
  - The endpoint reads `credentials.get("username")`. If a client sends `{"username": "user@example.com"}`, it sets subject to `"user@example.com"`.
  - Token secret matches default `jwt.secret` in `application.yml`.
  - Response structure is `{ "token": "<jwt_string>" }`.

### 1.4 `com.dermacare.backend.controllers.PatientController`
- **Location**: `backend/src/main/java/com/dermacare/backend/controllers/PatientController.java` (30 lines)
- **Annotations**: `@RestController`, `@RequestMapping("/api/patients")`
- **Constructor Injection**: `PatientRepository patientRepository`
- **Endpoints**:
  - `GET /api/patients`: calls `patientRepository.findAll()`, returns `List<Patient>`.
  - `POST /api/patients`: accepts `@RequestBody Patient patient`, calls `patientRepository.save(patient)`, returns created `Patient`.
- **Security Context**:
  - Protected under `SecurityConfig` (`.anyRequest().authenticated()`).
  - Unauthenticated requests must receive 401 Unauthorized or 403 Forbidden.
  - Authenticated requests (Bearer token) receive 200 OK.

### 1.5 `com.dermacare.backend.controllers.AppointmentController`
- **Location**: `backend/src/main/java/com/dermacare/backend/controllers/AppointmentController.java` (24 lines)
- **Annotations**: `@RestController`, `@RequestMapping("/api/appointments")`
- **Constructor Injection**: `AppointmentRepository appointmentRepository`
- **Endpoints**:
  - `GET /api/appointments`: calls `appointmentRepository.findAll()`, returns `List<Appointment>`.
- **Security Context**:
  - Protected under `SecurityConfig` (`.anyRequest().authenticated()`).

---

## 2. Entities & Repositories Mappings

### 2.1 Entities
1. **`Patient`** (`patients` table):
   - Fields: `id` (Long, IDENTITY), `firstName`, `lastName`, `dni` (unique, non-null), `age`, `profession`, `contactPhone`, `contactEmail`, medical history fields (`pathologicalHistory`, `allergies`, `toxicHabits`, `sunExposure`, `spfUse`, `surgicalHistory`, `gynecologicalHistory`, `habitualMedication`), `createdAt`, `updatedAt`.
   - Lifecycle: `@PrePersist` sets `createdAt` and `updatedAt`; `@PreUpdate` sets `updatedAt`.
2. **`Appointment`** (`appointments` table):
   - Fields: `id` (Long, IDENTITY), `doctor` (`Profile`, `@ManyToOne`, lazy), `patient` (`Patient`, `@ManyToOne`, lazy), `service` (`ServiceEntity`, `@ManyToOne`, lazy), `timeRange` (`String`, PostgreSQL `tstzrange`), `status` (`AppointmentStatus` enum, default `AVAILABLE`), `lockedUntil` (`ZonedDateTime`), `mercadoPagoPreferenceId`, `mercadoPagoPaymentId`, `createdAt`, `updatedAt`.
3. **`Profile`** (`profiles` table):
   - Fields: `id` (UUID), `role` (`UserRole`), `firstName`, `lastName`, `createdAt`.
4. **`ServiceEntity`** (`services` table):
   - Fields: `id` (Long, IDENTITY), `name`, `description`, `durationMinutes`, `price` (`BigDecimal`), `isActive` (`Boolean`, default true), `createdAt`.
5. **`Consultation`** (`consultations` table):
   - Fields: `id` (Long, IDENTITY), `appointment` (`Appointment`, `@OneToOne`), clinical exam fields, `createdAt`.

### 2.2 Repositories
1. `PatientRepository` extends `JpaRepository<Patient, Long>`
2. `AppointmentRepository` extends `JpaRepository<Appointment, Long>`

---

## 3. Security Configuration (`SecurityConfig`)
- **Location**: `backend/src/main/java/com/dermacare/backend/security/SecurityConfig.java`
- Configuration details:
  - CSRF disabled: `csrf.disable()`
  - Stateless session: `SessionCreationPolicy.STATELESS`
  - Permitted paths: `/api/auth/**`, `/api/public/**`
  - Authenticated paths: `anyRequest().authenticated()`
  - Filter order: `addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)`

---

## 4. Maven & PITest Configuration Gaps in `pom.xml`

### 4.1 Current Status of `pom.xml`
- `spring-boot-starter-parent`: 4.1.0
- Dependencies present: `spring-boot-starter-data-jpa`, `spring-boot-starter-security`, `spring-boot-starter-validation`, `spring-boot-starter-webmvc`, `postgresql`, `jjwt-api` / `jjwt-impl` / `jjwt-jackson` (0.12.3).
- Test starters present: `spring-boot-starter-data-jpa-test`, `spring-boot-starter-security-test`, `spring-boot-starter-validation-test`, `spring-boot-starter-webmvc-test`.

### 4.2 Missing Dependencies & Plugins
1. **H2 Database for Testing**: `com.h2database:h2` with `<scope>test</scope>` is currently missing from `pom.xml`.
2. **Pinned Surefire Plugin**: `maven-surefire-plugin` must be explicitly configured with version `3.1.2` in `<build><plugins>`. Without pinning, Maven attempts to resolve `3.5.6` which fails in offline mode (`ClassNotFoundException: SurefireReportParameters`).
3. **PITest Maven Plugin**: `pitest-maven` plugin version `1.15.3` with `pitest-junit5-plugin` dependency version `1.2.1` must be added to `<build><plugins>` with target classes and mutation threshold set.

---

## 5. Recommended Test Plan & Strategy for >=70% Mutation Score

### 5.1 Proposed Test Classes
1. `com.dermacare.backend.security.JwtServiceTest`
2. `com.dermacare.backend.security.JwtAuthenticationFilterTest`
3. `com.dermacare.backend.controllers.AuthControllerTest`
4. `com.dermacare.backend.controllers.PatientControllerTest`
5. `com.dermacare.backend.controllers.AppointmentControllerTest`

### 5.2 Test Scenarios for High Mutation Coverage
- **`JwtServiceTest`**:
  - Test `extractUsername` with valid token.
  - Test `isTokenValid` with matching username and unexpired token (returns true).
  - Test `isTokenValid` with mismatched username (returns false).
  - Test `isTokenValid` or `extractUsername` with expired token (throws `ExpiredJwtException` or returns false).
  - Test `extractClaim` with custom claims (role, subject, expiration).
  - Test tampered/invalid signature token (throws `SignatureException`).
  - Test malformed JWT string (throws `MalformedJwtException`).

- **`JwtAuthenticationFilterTest`**:
  - Test missing Authorization header -> calls `filterChain.doFilter`, SecurityContext authentication is null.
  - Test header not starting with "Bearer " (e.g. "Basic 12345", "Token 12345") -> calls `filterChain.doFilter`, SecurityContext is null.
  - Test valid Bearer token -> extracts username, creates `UsernamePasswordAuthenticationToken`, sets authentication in SecurityContext, calls `filterChain.doFilter`.
  - Test invalid/expired Bearer token -> `jwtService` throws exception -> exception caught, logged, SecurityContext remains null, calls `filterChain.doFilter`.
  - Test existing SecurityContext authentication -> filter does not overwrite existing authentication, calls `filterChain.doFilter`.

- **`AuthControllerTest`**:
  - Test `POST /api/auth/login` with `{"username": "admin@dermacare.com"}` -> returns 200 OK with `{"token": "<jwt>"}`.
  - Verify token subject equals `"admin@dermacare.com"`, claim `role` equals `"ADMIN_SECRETARIA"`, valid signature, valid expiration.

- **`PatientControllerTest`**:
  - Unit tests: Mock `PatientRepository`, test `getAllPatients()` and `createPatient()`.
  - Integration / Security tests:
    - `GET /api/patients` unauthenticated -> 401 Unauthorized / 403 Forbidden.
    - `GET /api/patients` authenticated -> 200 OK with list of patients.
    - `POST /api/patients` authenticated -> 200 OK with created patient.

- **`AppointmentControllerTest`**:
  - Unit tests: Mock `AppointmentRepository`, test `getAllAppointments()`.
  - Integration / Security tests:
    - `GET /api/appointments` unauthenticated -> 401 / 403.
    - `GET /api/appointments` authenticated -> 200 OK with list of appointments.

---
*Report prepared by explorer_m1_r1_1 for Milestone 1 implementation.*
