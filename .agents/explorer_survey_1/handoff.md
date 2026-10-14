# Handoff Report — Backend Survey Analysis

**Agent**: `explorer_survey_1`  
**Working Directory**: `/Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/.agents/explorer_survey_1`  
**Date**: 2026-08-10  
**Target Path**: `backend/`

---

## 1. Observation

Direct observations from examining the `backend/` directory:

1. **Build Configuration (`backend/pom.xml`)**:
   - Parent: `org.springframework.boot:spring-boot-starter-parent:4.1.0` (lines 5-10)
   - Java Version: `17` (line 30)
   - Core Dependencies (lines 33-72):
     - `spring-boot-starter-data-jpa`
     - `spring-boot-starter-security`
     - `spring-boot-starter-validation`
     - `spring-boot-starter-webmvc`
     - `org.postgresql:postgresql` (runtime)
     - `io.jsonwebtoken:jjwt-api:0.12.3`, `jjwt-impl:0.12.3`, `jjwt-jackson:0.12.3`
   - Test Dependencies (lines 73-91):
     - `spring-boot-starter-data-jpa-test`
     - `spring-boot-starter-security-test`
     - `spring-boot-starter-validation-test`
     - `spring-boot-starter-webmvc-test`
   - Mutation Testing: **No mutation testing plugin** (e.g. `pitest-maven`) is present in `pom.xml`.

2. **Database Configuration (`backend/src/main/resources/application.yml`)**:
   - Server Port: `8080` (line 2)
   - Database URL: `jdbc:postgresql://aws-0-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require` (line 6)
   - Hibernate DDL Auto: `update` (line 12)
   - JWT Secret: `${JWT_SECRET:413F4428472B4B6250655368566D5970337336763979244226452948404D6351}` (line 20)

3. **Source Structure (`backend/src/main/java/com/dermacare/backend/`)**:
   - **Main App**: `BackendApplication.java` (`@SpringBootApplication`, lines 6-13)
   - **Entities (`entities/`)**:
     - `Appointment.java`: `@Entity @Table(name = "appointments")` with `doctor` (`Profile`), `patient` (`Patient`), `service` (`ServiceEntity`), `timeRange` (`String` - `tstzrange`), `status` (`AppointmentStatus`), `lockedUntil`, `mercadoPagoPreferenceId`, `mercadoPagoPaymentId` (lines 8-94)
     - `AppointmentStatus.java`: Enum (`AVAILABLE`, `PENDING_PAYMENT`, `CONFIRMED`, `CANCELLED`, `COMPLETED`) (lines 3-9)
     - `Consultation.java`: `@Entity @Table(name = "consultations")` with `@OneToOne` `appointment`, evaluation fields, follow-up fields (lines 6-91)
     - `Patient.java`: `@Entity @Table(name = "patients")` with `firstName`, `lastName`, `dni` (unique), personal details, clinical history fields (lines 6-129)
     - `Profile.java`: `@Entity @Table(name = "profiles")` with `UUID` id, `role` (`UserRole`), `firstName`, `lastName` (lines 7-47)
     - `ServiceEntity.java`: `@Entity @Table(name = "services")` with `name`, `description`, `durationMinutes`, `price`, `isActive` (lines 7-59)
     - `UserRole.java`: Enum (`ADMIN_SECRETARIA`, `MEDICA_PRESTADORA`) (lines 3-6)
   - **Repositories (`repositories/`)**:
     - `AppointmentRepository.java`: Interface extending `JpaRepository<Appointment, Long>` (lines 7-9)
     - `PatientRepository.java`: Interface extending `JpaRepository<Patient, Long>` (lines 7-9)
   - **Controllers (`controllers/`)**:
     - `AuthController.java`: `POST /api/auth/login` (generates JWT token with claim `role="ADMIN_SECRETARIA"`, lines 10-43)
     - `AppointmentController.java`: `GET /api/appointments` (returns `appointmentRepository.findAll()`, lines 9-23)
     - `PatientController.java`: `GET /api/patients`, `POST /api/patients` (lines 10-29)
   - **Security (`security/`)**:
     - `SecurityConfig.java`: Configures stateless session, permits `/api/auth/**` and `/api/public/**`, requires authentication for other endpoints (lines 11-38)
     - `JwtAuthenticationFilter.java`: Intercepts `Authorization: Bearer <token>` header, validates JWT and sets `SecurityContext` (lines 17-62)
     - `JwtService.java`: JWT parsing, secret key decoding, expiration checks (lines 14-58)
   - **Services (`services/`)**: Empty directory.

4. **Existing Tests (`backend/src/test/java/com/dermacare/backend/`)**:
   - `BackendApplicationTests.java`: Single class with empty `@Test void contextLoads() {}` (lines 6-13). Zero unit tests or integration tests exist for domain logic, controllers, or security.

5. **Tool Command Result**:
   - Executing `./mvnw test -o` in `backend/` failed with `ClassNotFoundException: org.apache.maven.plugin.surefire.SurefireReportParameters` due to missing plugin dependencies in offline mode.

---

## 2. Logic Chain

1. **Observation 1 & 2** show that the backend is built on Spring Boot 4.1.0, Java 17, Spring Data JPA, Spring Security, PostgreSQL, and JJWT.
2. **Observation 3** reveals that the domain model is fully defined (7 entities/enums: `Appointment`, `AppointmentStatus`, `Consultation`, `Patient`, `Profile`, `ServiceEntity`, `UserRole`).
3. **Observation 3** also shows that controllers (`AuthController`, `PatientController`, `AppointmentController`) interact directly with JPA repositories or utility classes, bypassing a dedicated service layer (`services/` is empty).
4. **Observation 4** indicates that test coverage is currently ~0% (only a context loading skeleton exists).
5. **Observation 1** indicates that mutation testing tools (like `pitest-maven`) are absent from `pom.xml`.
6. Therefore, to satisfy requirements **R1** (Unit and Integration testing) and **R2** (Mutation score ≥ 70%), the following steps are required:
   - Configure `pitest-maven` (with `pitest-junit5-plugin`) in `pom.xml`.
   - Write comprehensive unit tests for `JwtService`, `JwtAuthenticationFilter`, `Patient`, `Appointment`, and `Consultation`.
   - Write integration tests using `@WebMvcTest` / `@SpringBootTest` + `MockMvc` for `AuthController`, `PatientController`, and `AppointmentController`.

---

## 3. Caveats

1. **Database Environment**: `application.yml` points to a live Supabase PostgreSQL instance. Integration tests must use an in-memory database (e.g. H2) or mock repository calls to ensure reliable, offline test execution without external DB side-effects.
2. **Maven Dependencies Offline**: Test execution requires maven dependencies (including `maven-surefire-plugin` and `pitest`) to be downloaded or pre-cached in the local repository.
3. **Empty Services Directory**: Since business logic currently resides inside controllers and security filters, unit tests will target security filters/services and controller endpoints until service components are refactored/added.

---

## 4. Conclusion

The backend codebase is a lightweight, structured Spring Boot REST application. However, it lacks unit tests, integration tests, and mutation testing setup. 

To achieve full quality compliance (Requirements R1, R2, R3):
1. **Mutation Testing Setup**: Add `pitest-maven` plugin to `pom.xml`.
2. **Test Implementation Plan**:
   - Security Unit Tests: `JwtServiceTest`, `JwtAuthenticationFilterTest`.
   - Controller Integration Tests: `AuthControllerTest`, `PatientControllerTest`, `AppointmentControllerTest`.
   - Repository & Model Tests: Entity validation and repository integration tests.

---

## 5. Verification Method

To independently verify this analysis:

1. **Inspect pom.xml**:
   - `view_file` on `backend/pom.xml` — verify Spring Boot version 4.1.0, Java 17, and absence of `pitest-maven`.
2. **Inspect Codebase Structure**:
   - `list_dir` on `backend/src/main/java/com/dermacare/backend/` — verify presence of `controllers`, `entities`, `repositories`, `security`, and empty `services`.
3. **Inspect Detailed Analysis**:
   - `view_file` on `.agents/explorer_survey_1/analysis.md`.
4. **Invalidation Conditions**:
   - If dependencies in `backend/pom.xml` are modified or new packages/services are created.
