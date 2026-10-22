# Handoff Report — explorer_m1_r1_1

## 1. Observation
- **Target Source Files Analyzed**:
  1. `backend/src/main/java/com/dermacare/backend/security/JwtService.java` (lines 1-59): uses `@Value("${jwt.secret}")` decoded via `Decoders.BASE64.decode` for HMAC-SHA256 key signing; methods: `extractUsername`, `extractClaim`, `isTokenValid`, `isTokenExpired`, `extractExpiration`, `extractAllClaims`, `getSignInKey`.
  2. `backend/src/main/java/com/dermacare/backend/security/JwtAuthenticationFilter.java` (lines 1-63): extends `OncePerRequestFilter`; checks `"Authorization"` header for `"Bearer "` prefix; extracts token using `.substring(7)`; populates `SecurityContextHolder` with `UsernamePasswordAuthenticationToken` if token valid and no existing authentication; catches exceptions and continues filter chain.
  3. `backend/src/main/java/com/dermacare/backend/controllers/AuthController.java` (lines 1-44): `@PostMapping("/login")`; extracts `username = credentials.get("username")`; builds JJWT with subject `username` and claim `"role" -> "ADMIN_SECRETARIA"`, secret key Base64 `"413F4428472B4B6250655368566D5970337336763979244226452948404D6351"`; returns `{ "token": "<jwt>" }`.
  4. `backend/src/main/java/com/dermacare/backend/controllers/PatientController.java` (lines 1-30): `@GetMapping` calls `patientRepository.findAll()`; `@PostMapping` calls `patientRepository.save(patient)`.
  5. `backend/src/main/java/com/dermacare/backend/controllers/AppointmentController.java` (lines 1-24): `@GetMapping` calls `appointmentRepository.findAll()`.
  6. `backend/src/main/java/com/dermacare/backend/security/SecurityConfig.java` (lines 1-39): permits `/api/auth/**` and `/api/public/**`, requires authentication for all other requests (`anyRequest().authenticated()`), configures stateless session and `jwtAuthFilter` before `UsernamePasswordAuthenticationFilter`.
- **Entities & Repositories**:
  - `Patient.java` (`patients` table, DNI unique, `@PrePersist`/`@PreUpdate`), `Appointment.java` (`appointments` table, status default `AVAILABLE`), `Profile.java`, `ServiceEntity.java`, `Consultation.java`, `AppointmentStatus.java`, `UserRole.java`.
  - `PatientRepository.java` (`JpaRepository<Patient, Long>`), `AppointmentRepository.java` (`JpaRepository<Appointment, Long>`).
- **Build & Dependency Findings (`backend/pom.xml`)**:
  - Command execution `./mvnw -o test` failed with:
    `[ERROR] Failed to execute goal org.apache.maven.plugins:maven-surefire-plugin:3.5.6:test (default-test) on project backend: Execution default-test of goal org.apache.maven.plugins:maven-surefire-plugin:3.5.6:test failed: Unable to load the mojo 'test' in the plugin 'org.apache.maven.plugins:maven-surefire-plugin:3.5.6'. A required class is missing: org/apache/maven/plugin/surefire/SurefireReportParameters`
  - Local repository inspect confirmed: `org/apache/maven/plugins/maven-surefire-plugin/3.1.2` is cached in `.m2`, `org/pitest/pitest-maven/1.15.3` and `pitest-junit5-plugin/1.2.1` are cached in `.m2`, `com/h2database/h2/2.2.224` is cached in `.m2`.
  - `pom.xml` currently lacks test-scope H2 dependency, pinned `maven-surefire-plugin` 3.1.2, and `pitest-maven` 1.15.3 plugin configuration.

## 2. Logic Chain
1. **Observation 1 & 2**: `JwtService` and `JwtAuthenticationFilter` handle JWT parsing, validation, and security context injection. SecurityConfig secures all endpoints under `/api/patients` and `/api/appointments` requiring bearer authentication.
2. **Observation 3, 4, 5**: `AuthController`, `PatientController`, and `AppointmentController` expose REST endpoints. `AuthController.login` generates tokens, while `PatientController` and `AppointmentController` perform CRUD operations via Spring Data JPA repositories.
3. **Observation 6**: `./mvnw -o test` failed because Maven defaults to unpinned `maven-surefire-plugin:3.5.6` which is not present in `.m2`. Local `.m2` repository contains version 3.1.2, PITest 1.15.3, pitest-junit5-plugin 1.2.1, and H2 2.2.224.
4. **Step-by-step reasoning**: Pinning `maven-surefire-plugin` to 3.1.2 in `pom.xml`, adding test-scoped `h2` dependency, configuring `pitest-maven` 1.15.3 with `pitest-junit5-plugin` 1.2.1, and creating comprehensive unit/integration test classes for the 5 target classes will enable running `./mvnw -o test` successfully and reaching >=70% mutation score via `./mvnw -o pitest:mutationCoverage`.

## 3. Caveats
- No caveats. The codebase analysis covers all target classes, entities, repositories, security configurations, and build files required for Milestone 1.

## 4. Conclusion
The backend architecture is cleanly structured around Spring Boot, Spring Security JWT authentication, and Spring Data JPA repositories. The primary technical requirements for Milestone 1 implementation are:
1. Update `backend/pom.xml` to add `h2` test dependency, pin `maven-surefire-plugin:3.1.2`, and configure `pitest-maven:1.15.3`.
2. Implement 5 test classes (`JwtServiceTest`, `JwtAuthenticationFilterTest`, `AuthControllerTest`, `PatientControllerTest`, `AppointmentControllerTest`) covering all execution paths and edge cases.
3. Verify test execution with `./mvnw -o test` and mutation testing with `./mvnw -o pitest:mutationCoverage` achieving >=70% mutation score.

## 5. Verification Method
1. Inspect `analysis.md` at `/Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/.agents/explorer_m1_r1_1/analysis.md`.
2. Inspect target source files under `backend/src/main/java/com/dermacare/backend/`.
3. Verify cached Maven artifacts in `~/.m2/repository`:
   - `org/apache/maven/plugins/maven-surefire-plugin/3.1.2/`
   - `org/pitest/pitest-maven/1.15.3/`
   - `com/h2database/h2/2.2.224/`
