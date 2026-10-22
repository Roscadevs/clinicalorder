# Scope: Milestone 1 — Backend Test Suite & Mutation Testing

## Architecture
- Stack: Spring Boot 4.1.0, Java 17, JUnit 5, Mockito, MockMvc, H2 DB.
- Mutation Runner: PITest plugin (`pitest-maven:1.15.3` with `pitest-junit5-plugin:1.2.1`).

## Feature Inventory Scope (M1)
1. Configure `backend/pom.xml` with test scope H2 DB, pinned `maven-surefire-plugin` 3.1.2, and `pitest-maven` plugin 1.15.3.
2. Implement comprehensive unit and integration tests covering JWT security (`JwtService`, `JwtAuthenticationFilter`) and REST controllers (`AuthController`, `PatientController`, `AppointmentController`).
3. Execute unit/integration tests (`./mvnw -o test`) and ensure 100% pass.
4. Execute PITest mutation testing (`./mvnw -o pitest:mutationCoverage`), generate report in `backend/target/pit-reports/`, and achieve >= 70% mutation score on tested classes.

## Interface Contracts
- `POST /api/auth/login`: `{ email, password }` -> returns `{ token }`
- `GET /api/patients`: `Authorization: Bearer <token>` -> returns list of patients
- `POST /api/patients`: `Authorization: Bearer <token>` -> creates patient
- `GET /api/appointments`: `Authorization: Bearer <token>` -> returns list of appointments

## Code Layout Ownership (M1)
- Exclusive write ownership: `backend/pom.xml`, `backend/src/test/java/com/dermacare/backend/**`
- Read-only reference: `backend/src/main/java/com/dermacare/backend/**`
