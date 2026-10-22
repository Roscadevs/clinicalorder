# Analysis Report: Backend Test Implementation & Mutation Testing Strategy (Milestone 1)

**Agent**: `explorer_m1_r1_3`  
**Date**: 2026-08-10  
**Target Path**: `/Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/.agents/explorer_m1_r1_3/analysis.md`

---

## 1. Executive Summary & Objective Overview

The objective of this investigation is to design a comprehensive unit and integration test suite and formulate a mutation testing strategy under PITest (`pitest-maven` 1.15.3 with `pitest-junit5-plugin` 1.2.1) for the backend of the **Sistema de Gestión Dermatológica**.

The target classes for Milestone 1 comprise:
1. **Security Layer**:
   - `com.dermacare.backend.security.JwtService`
   - `com.dermacare.backend.security.JwtAuthenticationFilter`
2. **Controller Layer**:
   - `com.dermacare.backend.controllers.AuthController`
   - `com.dermacare.backend.controllers.PatientController`
   - `com.dermacare.backend.controllers.AppointmentController`

The primary goal is to achieve **100% test pass rate** on `./mvnw -o test` and **>= 70% mutation score** (mutants killed / total mutants) under PITest execution (`./mvnw -o pitest:mutationCoverage`).

---

## 2. Target Class Codebase Audit

### 2.1 `JwtService` (`backend/src/main/java/com/dermacare/backend/security/JwtService.java`)
- **Key Responsibilities**:
  - `extractUsername(String token)`: Extracts JWT subject claim.
  - `extractClaim(String token, Function<Claims, T> claimsResolver)`: Generic claim extraction.
  - `isTokenValid(String token, String username)`: Validates token signature, username match, and expiration status (`!isTokenExpired`).
- **Dependencies & Configuration**:
  - `@Value("${jwt.secret}") private String secretKey;` (Base64-encoded secret).
  - `@Value("${jwt.expiration}") private long jwtExpiration;`

### 2.2 `JwtAuthenticationFilter` (`backend/src/main/java/com/dermacare/backend/security/JwtAuthenticationFilter.java`)
- **Key Responsibilities**:
  - Extends `OncePerRequestFilter`.
  - Extracts `Authorization` HTTP header (`Bearer <token>`).
  - Validates header format (null check, `startsWith("Bearer ")`).
  - Calls `jwtService.extractUsername(jwt)`.
  - If `userId != null` and `SecurityContextHolder.getContext().getAuthentication() == null`, builds `UsernamePasswordAuthenticationToken` with `WebAuthenticationDetailsSource` and populates `SecurityContextHolder`.
  - Catches invalid/expired token exceptions silently, logs via `logger.error`, and proceeds down `filterChain.doFilter(request, response)`.

### 2.3 `AuthController` (`backend/src/main/java/com/dermacare/backend/controllers/AuthController.java`)
- **Endpoint**: `POST /api/auth/login` (Public endpoint in `SecurityConfig`).
- **Behavior**: Accepts `{ "username": "...", "password": "..." }`, builds signed JWT token with claim `"role": "ADMIN_SECRETARIA"`, 24-hour expiration, signed with HMAC-SHA secret key `413F4428472B4B6250655368566D5970337336763979244226452948404D6351`, returns `{ "token": "<jwt>" }`.

### 2.4 `PatientController` (`backend/src/main/java/com/dermacare/backend/controllers/PatientController.java`)
- **Endpoints**:
  - `GET /api/patients`: Requires authentication. Calls `patientRepository.findAll()`.
  - `POST /api/patients`: Requires authentication. Calls `patientRepository.save(patient)`.

### 2.5 `AppointmentController` (`backend/src/main/java/com/dermacare/backend/controllers/AppointmentController.java`)
- **Endpoint**:
  - `GET /api/appointments`: Requires authentication. Calls `appointmentRepository.findAll()`.

---

## 3. Unit Test Suite Design (`JwtService` & `JwtAuthenticationFilter`)

### 3.1 `JwtServiceTest` Design
- **Location**: `backend/src/test/java/com/dermacare/backend/security/JwtServiceTest.java`
- **Testing Approach**: Pure JUnit 5 unit test using `ReflectionTestUtils` to inject `secretKey`.
- **Secret Key**: `413F4428472B4B6250655368566D5970337336763979244226452948404D6351` (Base64).

#### Test Cases & Assertions:
1. `extractUsername_ValidToken_ReturnsSubject()`:
   - Generate token with subject `"doctor@dermacare.com"`.
   - Assert `jwtService.extractUsername(token)` returns `"doctor@dermacare.com"`.
2. `extractClaim_ExpirationClaim_ReturnsCorrectExpirationDate()`:
   - Generate token with known expiration date.
   - Assert extracted expiration date matches generated timestamp within tolerance.
3. `isTokenValid_ValidTokenAndMatchingUsername_ReturnsTrue()`:
   - Token subject = `"doctor@dermacare.com"`, username = `"doctor@dermacare.com"`.
   - Assert `jwtService.isTokenValid(token, "doctor@dermacare.com")` is `true`.
4. `isTokenValid_ValidTokenAndDifferentUsername_ReturnsFalse()`:
   - Token subject = `"doctor@dermacare.com"`, username = `"other@dermacare.com"`.
   - Assert `jwtService.isTokenValid(token, "other@dermacare.com")` is `false`.
5. `isTokenValid_ExpiredToken_ThrowsExpiredJwtException()`:
   - Generate token with expiration set in the past (`System.currentTimeMillis() - 10000`).
   - Assert `assertThrows(ExpiredJwtException.class, () -> jwtService.isTokenValid(expiredToken, username))`.
6. `isTokenValid_InvalidSignature_ThrowsSignatureException()`:
   - Generate token signed with a different key (`513F...`).
   - Assert parsing throws `SignatureException` or `JwtException`.
7. `isTokenValid_MalformedToken_ThrowsMalformedJwtException()`:
   - Pass `"invalid.token.string"`.
   - Assert throws `MalformedJwtException`.

---

### 3.2 `JwtAuthenticationFilterTest` Design
- **Location**: `backend/src/test/java/com/dermacare/backend/security/JwtAuthenticationFilterTest.java`
- **Testing Approach**: JUnit 5 + Mockito (`@ExtendWith(MockitoExtension.class)`).
- **Mocks**: `JwtService`, `HttpServletRequest`, `HttpServletResponse`, `FilterChain`.
- **Lifecycle Management**: `@BeforeEach` & `@AfterEach` must execute `SecurityContextHolder.clearContext()` to prevent state leakage.

#### Test Cases & Assertions:
1. `doFilterInternal_NullAuthorizationHeader_ProceedsWithoutAuthentication()`:
   - `when(request.getHeader("Authorization")).thenReturn(null);`
   - Execute filter.
   - Verify `filterChain.doFilter(request, response)` called **once**.
   - Assert `SecurityContextHolder.getContext().getAuthentication()` is `null`.
2. `doFilterInternal_NonBearerAuthorizationHeader_ProceedsWithoutAuthentication()`:
   - `when(request.getHeader("Authorization")).thenReturn("Basic dXNlcjpwYXNz");`
   - Execute filter.
   - Verify `filterChain.doFilter(request, response)` called **once**.
   - Assert `SecurityContextHolder.getContext().getAuthentication()` is `null`.
3. `doFilterInternal_ValidBearerToken_SetsSecurityContextAndProceeds()`:
   - Header: `"Bearer valid.jwt.token"`.
   - Mock `jwtService.extractUsername("valid.jwt.token")` -> `"admin@dermacare.com"`.
   - Execute filter.
   - Verify `jwtService.extractUsername` called with exact substring `"valid.jwt.token"`.
   - Verify `filterChain.doFilter(request, response)` called **once**.
   - Assert `SecurityContextHolder.getContext().getAuthentication()` is NOT null.
   - Assert `authentication.getPrincipal()` equals `"admin@dermacare.com"`.
   - Assert `authentication.getDetails()` is NOT null (kills `setDetails` void call mutant).
4. `doFilterInternal_ExistingAuthenticationInSecurityContext_DoesNotOverride()`:
   - Pre-populate `SecurityContextHolder` with existing `UsernamePasswordAuthenticationToken("existingUser", ...)`
   - Header: `"Bearer valid.jwt.token"`.
   - Mock `jwtService.extractUsername("valid.jwt.token")` -> `"newUser@dermacare.com"`.
   - Execute filter.
   - Assert `SecurityContextHolder.getContext().getAuthentication().getPrincipal()` remains `"existingUser"`.
5. `doFilterInternal_NullUserIdExtracted_DoesNotSetSecurityContext()`:
   - Header: `"Bearer token.with.null.user"`.
   - Mock `jwtService.extractUsername(...)` -> `null`.
   - Execute filter.
   - Assert `SecurityContextHolder.getContext().getAuthentication()` is `null`.
   - Verify `filterChain.doFilter(request, response)` called **once**.
6. `doFilterInternal_JwtServiceException_CatchesExceptionAndProceeds()`:
   - Header: `"Bearer invalid.token"`.
   - Mock `jwtService.extractUsername(...)` -> throw `new RuntimeException("Token error")`.
   - Execute filter.
   - Assert `SecurityContextHolder.getContext().getAuthentication()` is `null`.
   - Verify `filterChain.doFilter(request, response)` called **once**.

---

## 4. Integration Test Suite Design (Controllers using MockMvc)

### 4.1 Integration Test Setup Paradigm
- **Annotations**: `@SpringBootTest`, `@AutoConfigureMockMvc`, `@ActiveProfiles("test")`.
- **Database**: In-Memory H2 DB configured in `src/test/resources/application-test.yml` or default test context.
- **Security Mocking**: Valid Bearer tokens generated via `JwtService` included in `Authorization` HTTP header (`Bearer <token>`).

---

### 4.2 `AuthControllerTest` Design
- **Location**: `backend/src/test/java/com/dermacare/backend/controllers/AuthControllerTest.java`
- **Endpoint Tested**: `POST /api/auth/login`

#### Test Cases & Assertions:
1. `login_WithValidCredentials_Returns200AndJwtToken()`:
   - Request Body: `{"username": "admin@dermacare.com", "password": "anyPassword"}`
   - `mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content(jsonBody))`
   - Assert Status `200 OK`.
   - Assert JSON Path `$.token` exists and is non-empty string.
2. `login_ReturnedToken_HasValidClaimsAndSignature()`:
   - Extract `token` string from response.
   - Parse JWT using secret key `413F4428472B4B6250655368566D5970337336763979244226452948404D6351`.
   - Assert Subject equals `"admin@dermacare.com"`.
   - Assert Claim `"role"` equals `"ADMIN_SECRETARIA"`.
   - Assert Expiration Date is in the future.

---

### 4.3 `PatientControllerTest` Design
- **Location**: `backend/src/test/java/com/dermacare/backend/controllers/PatientControllerTest.java`
- **Endpoints Tested**: `GET /api/patients`, `POST /api/patients`

#### Test Cases & Assertions:
1. `getAllPatients_Unauthenticated_Returns401Or403()`:
   - `mockMvc.perform(get("/api/patients"))`
   - Assert Status `401 Unauthorized` or `403 Forbidden`.
2. `getAllPatients_Authenticated_ReturnsListOfPatients()`:
   - Database Seed: Save 2 `Patient` entities to `PatientRepository`.
   - Header: `Authorization: Bearer <valid_jwt_token>`.
   - `mockMvc.perform(get("/api/patients").header("Authorization", bearerToken))`
   - Assert Status `200 OK`.
   - Assert `jsonPath("$.length()").value(2)`.
   - Assert `jsonPath("$[0].firstName").value("Juan")` and `jsonPath("$[1].firstName").value("Maria")`.
3. `createPatient_Unauthenticated_Returns401Or403()`:
   - `mockMvc.perform(post("/api/patients").contentType(MediaType.APPLICATION_JSON).content(patientJson))`
   - Assert Status `401 Unauthorized` or `403 Forbidden`.
4. `createPatient_Authenticated_SavesAndReturnsCreatedPatient()`:
   - Header: `Authorization: Bearer <valid_jwt_token>`.
   - Request Body:
     ```json
     {
       "firstName": "Carlos",
       "lastName": "Gomez",
       "dni": "87654321",
       "age": 35,
       "contactPhone": "1122334455",
       "contactEmail": "carlos@example.com"
     }
     ```
   - Assert Status `200 OK`.
   - Assert `jsonPath("$.id").exists()`.
   - Assert `jsonPath("$.firstName").value("Carlos")`.
   - Assert `jsonPath("$.dni").value("87654321")`.
   - Verify `patientRepository.count()` equals `1` in DB.

---

### 4.4 `AppointmentControllerTest` Design
- **Location**: `backend/src/test/java/com/dermacare/backend/controllers/AppointmentControllerTest.java`
- **Endpoint Tested**: `GET /api/appointments`

#### Test Cases & Assertions:
1. `getAllAppointments_Unauthenticated_Returns401Or403()`:
   - `mockMvc.perform(get("/api/appointments"))`
   - Assert Status `401 Unauthorized` or `403 Forbidden`.
2. `getAllAppointments_Authenticated_ReturnsAppointmentsList()`:
   - Header: `Authorization: Bearer <valid_jwt_token>`.
   - Database Seed: Save 1 `Appointment` entity to `AppointmentRepository`.
   - `mockMvc.perform(get("/api/appointments").header("Authorization", bearerToken))`
   - Assert Status `200 OK`.
   - Assert `jsonPath("$.length()").value(1)`.
   - Assert `jsonPath("$[0].status").value("AVAILABLE")`.

---

## 5. Mutation Testing Strategy & PITest Operator Matrix

To ensure a mutation score **>= 70%** (target: ~95%+), tests are specifically designed to kill all major PITest mutation operators.

### 5.1 PITest Operator & Mutant Matrix

| Target Class | PITest Mutation Operator | Target Code Line | Possible Mutant | Test Case Killing Strategy |
|--------------|-------------------------|------------------|-----------------|----------------------------|
| `JwtService` | **Conditionals Boundary** | Line 34: `(extractedUsername.equals(username)) && !isTokenExpired(token)` | Inverts `equals` to `!equals` or `&&` to `||` | Test matching username -> `true`; mismatching username -> `false`. Inverting `&&` to `||` is killed by verifying wrong username returns `false` despite valid expiration. |
| `JwtService` | **Negate Conditionals** | Line 38: `extractExpiration(token).before(new Date())` | Inverts `.before(...)` to `.after(...)` | Test non-expired token -> `isTokenExpired` is `false`; expired token -> throws `ExpiredJwtException` or `true`. |
| `JwtService` | **Return Values** | Line 24: `extractUsername(...)` | Replaces return value with `""` or `null` | Assert `extractUsername` returns exact non-empty string `"doctor@dermacare.com"`. |
| `JwtAuthenticationFilter` | **Null Check / Boundary** | Line 36: `if (authHeader == null \|\| !authHeader.startsWith("Bearer "))` | Replaces `== null` with `!= null` or `\|\|` with `&&` | Test with `null` header: if `!= null`, evaluates `.startsWith(...)` on null throwing NullPointerException; if `&&`, evaluates substring on null. |
| `JwtAuthenticationFilter` | **String Mutator** | Line 41: `jwt = authHeader.substring(7)` | Changes index `7` to `6` or `8` | Test header `"Bearer validToken"`. Assert `jwtService.extractUsername` receives exact string `"validToken"`. Index 6 yields `" validToken"`, failing string match. |
| `JwtAuthenticationFilter` | **Conditionals** | Line 45: `if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null)` | Changes `== null` to `!= null` | Test with pre-existing `Authentication` in SecurityContext. Inverting `== null` would override existing authentication. Test asserts existing auth is preserved. |
| `JwtAuthenticationFilter` | **Void Call Removal** | Line 52: `authToken.setDetails(...)` and Line 53: `SecurityContextHolder.getContext().setAuthentication(authToken)` | Removes `setDetails` or `setAuthentication` call | Test asserts `SecurityContextHolder.getContext().getAuthentication()` is NOT null AND `getDetails()` is NOT null. |
| `JwtAuthenticationFilter` | **Void Call Removal** | Lines 37, 60: `filterChain.doFilter(request, response)` | Removes `filterChain.doFilter(...)` call | Mockito `verify(filterChain, times(1)).doFilter(request, response)` executed in all 6 test scenarios. |
| `AuthController` | **Return Values & Map Keys** | Line 24: `credentials.get("username")` and Line 40: `response.put("token", token)` | Changes `"username"` key or `"token"` key | MockMvc test passes `{"username": "admin"}` and expects `jsonPath("$.token").exists()`. Also parses token to verify subject is `"admin"`. |
| `AuthController` | **Arithmetic Mutator** | Line 35: `expiration(new Date(currentTime + 1000 * 60 * 24))` | Changes `+` to `-` | Parse generated JWT in test and verify expiration date is in the future. Subtracting time creates an immediately expired token, failing parsing/validation. |
| `PatientController` | **Return Value Replacement** | Lines 22, 27: `patientRepository.findAll()`, `save(patient)` | Returns `null` or empty list | MockMvc tests assert JSON response contains exact saved patient attributes and length. |
| `AppointmentController` | **Return Value Replacement** | Line 21: `appointmentRepository.findAll()` | Returns `null` or empty list | MockMvc tests assert JSON response array length and status. |

---

## 6. Implementation Checklist for `implementer_m1`

1. **Test Infrastructure Pre-requisites**:
   - Ensure `backend/pom.xml` contains H2 DB test dependency, Surefire 3.1.2 pinning, and PITest 1.15.3 plugin as configured by `explorer_m1_r1_2`.
2. **File Creation**:
   - Create `backend/src/test/java/com/dermacare/backend/security/JwtServiceTest.java`
   - Create `backend/src/test/java/com/dermacare/backend/security/JwtAuthenticationFilterTest.java`
   - Create `backend/src/test/java/com/dermacare/backend/controllers/AuthControllerTest.java`
   - Create `backend/src/test/java/com/dermacare/backend/controllers/PatientControllerTest.java`
   - Create `backend/src/test/java/com/dermacare/backend/controllers/AppointmentControllerTest.java`
3. **Execution Verification**:
   - Run `./mvnw -o test` -> Confirm 100% pass (0 failures, 0 errors).
   - Run `./mvnw -o pitest:mutationCoverage` -> Confirm mutation report generated in `backend/target/pit-reports/index.html` with mutation score >= 70%.
