# Handoff Report — Testing & Mutation Testing Setup Survey

**Agent**: `explorer_survey_3`  
**Date**: 2026-08-10  
**Working Directory**: `/Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/.agents/explorer_survey_3`  

---

## 1. Observation

Direct observations from inspecting repository structure, configuration files, and terminal executions:

1. **Backend Build & Dependencies (`backend/pom.xml`)**:
   - `pom.xml` uses `<parent><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-parent</artifactId><version>4.1.0</version></parent>`.
   - Test dependencies present: `spring-boot-starter-data-jpa-test`, `spring-boot-starter-security-test`, `spring-boot-starter-validation-test`, `spring-boot-starter-webmvc-test`.
   - Missing: Unified `spring-boot-starter-test` and `com.h2database:h2` in test scope.
   - Running `./mvnw test` attempts to download `maven-surefire-plugin:3.5.6` from Maven Central. Offline execution fails unless surefire is configured with version `3.1.2`, which is verified present in `~/.m2/repository/org/apache/maven/plugins/maven-surefire-plugin/3.1.2/`.
   - PITest artifacts (`pitest:1.15.3`, `pitest-maven:1.15.3`, `pitest-junit5-plugin:1.2.1`) are present in `~/.m2/repository/org/pitest/`.

2. **Backend Source & Test Code (`backend/src`)**:
   - Controllers present: `AuthController.java` (lines 1-44), `PatientController.java` (lines 1-30), `AppointmentController.java` (lines 1-24).
   - Security classes: `JwtService.java` (lines 1-59), `JwtAuthenticationFilter.java` (lines 1-63), `SecurityConfig.java` (lines 1-39).
   - Tests present: `BackendApplicationTests.java` (lines 1-14) with single empty `contextLoads()` method.

3. **Frontend Configuration & Dependencies (`frontend/package.json`, `frontend/vite.config.js`)**:
   - `package.json` contains `dependencies` (`lucide-react`, `react`, `react-dom`, `react-router-dom`) and `devDependencies` (`@types/react`, `@types/react-dom`, `@vitejs/plugin-react`, `autoprefixer`, `postcss`, `tailwindcss`, `vite`).
   - `scripts` in `package.json`: `"dev": "vite"`, `"build": "vite build"`, `"preview": "vite preview"`.
   - `npm list vitest @stryker-mutator/core jest jsdom` returns `(empty)`.
   - Zero test files exist inside `frontend/src`.

---

## 2. Logic Chain

1. **Backend Testing Gap**:
   - *Observation*: Only `BackendApplicationTests.java` exists with an empty test method, and `pom.xml` lacks `h2` test DB dependency. `application.yml` connects to remote Supabase PostgreSQL.
   - *Deduction*: Executing Spring Boot tests without an in-memory DB will depend on an active remote DB connection. Adding `h2` to `scope=test` enables offline, fast, repeatable unit and integration testing.
   - *Surefire Resolution*: Pinned `maven-surefire-plugin` version `3.1.2` in `pom.xml` allows `./mvnw -o test` to execute offline using local `.m2` artifacts.

2. **Backend Mutation Testing Gap**:
   - *Observation*: PITest plugin is missing from `pom.xml`, but `pitest-maven:1.15.3` and `pitest-junit5-plugin:1.2.1` are cached in `~/.m2/repository`.
   - *Deduction*: PITest can be enabled by configuring `<plugin><groupId>org.pitest</groupId><artifactId>pitest-maven</artifactId>...</plugin>` in `pom.xml`, allowing execution via `./mvnw -o pitest:mutationCoverage` to calculate mutation scores.

3. **Frontend Testing & Mutation Gap**:
   - *Observation*: `frontend/package.json` lacks Vitest, React Testing Library, and StrykerJS. `frontend/src` has 0 test files.
   - *Deduction*: To fulfill requirements R1, R2, and R3, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `@stryker-mutator/core`, and `@stryker-mutator/vitest-runner` must be added to `devDependencies`. `vite.config.js` and `stryker.config.json` must be configured with test environment and mutant selection filters.

---

## 3. Caveats

1. **Network Restrictions**: Standard sandbox execution blocks external network access (`nodename nor servname provided, or not known`). All Maven and npm tool invocations during implementation must rely on cached artifacts or local offline modes (`./mvnw -o`).
2. **PostgreSQL Specific Types**: `Appointment.java` uses `tstzrange` column type (`PostgreSQLDialect`). If testing JPA queries using H2 in-memory DB, custom column definitions or mock repositories/unit tests should be used to avoid H2 syntax errors on PostgreSQL-specific types.

---

## 4. Conclusion

- Both **backend** and **frontend** currently lack functional test suites and mutation testing configurations.
- The project can be brought into complete compliance with requirements **R1, R2, R3** and **Acceptance Criteria** (passing tests & ≥70% mutation score) by:
  1. **Backend**: Updating `pom.xml` with `spring-boot-starter-test`, `h2` (test scope), pinned `maven-surefire-plugin` (3.1.2), and `pitest-maven` plugin (1.15.3). Adding unit & integration test classes for `JwtServiceTest`, `AuthControllerTest`, `PatientControllerTest`, and `AppointmentControllerTest`.
  2. **Frontend**: Adding `vitest`, `@testing-library/react`, `jsdom`, `@stryker-mutator/core`, and `@stryker-mutator/vitest-runner` to `package.json`, creating `stryker.config.json`, and writing unit/integration test specs for `InicioSesion.test.jsx`, `RegistroPaciente.test.jsx`, `App.test.jsx`, etc.

---

## 5. Verification Method

To verify the investigation findings and test suite execution setup:

1. **Backend Compilation & Test Check**:
   ```bash
   cd /Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/backend
   ./mvnw -o test-compile
   ```
   *Expected result*: `BUILD SUCCESS`.

2. **Frontend Dependency Check**:
   ```bash
   cd /Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/frontend
   npm list vitest @stryker-mutator/core
   ```
   *Expected result*: Confirms missing packages before setup.

3. **Artifact Location Inspection**:
   - Analysis report: `/Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/.agents/explorer_survey_3/analysis.md`
   - Handoff report: `/Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/.agents/explorer_survey_3/handoff.md`
