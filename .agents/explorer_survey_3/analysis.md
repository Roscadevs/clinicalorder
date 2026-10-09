# Detailed Testing & Mutation Testing Infrastructure Analysis

**Author**: `explorer_survey_3`  
**Date**: 2026-08-10  
**Scope**: Project Root, Backend (Java/Spring Boot), Frontend (React/Vite)  

---

## 1. Executive Summary

This report presents a thorough survey of the testing and mutation testing infrastructure for the **Sistema de Gestión Dermatológica** (`Dermacare Elite`).

Currently, the project lacks complete unit, integration, and mutation test suites in both the **backend** and **frontend**. 
- **Backend (Java / Maven)**: Contains JUnit 5 dependencies transitively via Spring Boot, but only has a single empty test file (`BackendApplicationTests.java`). Mutation testing with PITest is **not configured** in `pom.xml`, although PITest plugin artifacts (v1.15.3) are present in the local Maven cache (`.m2`). Furthermore, running tests offline requires pinning `maven-surefire-plugin` to version `3.1.2` and adding `com.h2database:h2` as a test dependency to avoid requiring external PostgreSQL database connectivity during testing.
- **Frontend (React / Vite)**: Has **zero** test setup, **zero** test files, and **no test dependencies** installed (Vitest, React Testing Library, and StrykerJS are absent from `package.json`).
- **Mutation Score Goal**: The target for both frontend and backend is **≥ 70% killed mutants** on tested application modules.

---

## 2. Workspace & Root Level Survey

### Workspace Structure
- **Root path**: `/Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP`
- **Subdirectories**:
  - `backend/`: Java 17 Spring Boot 3/4 Maven project.
  - `frontend/`: React 18 + Vite 5 single-page application.
  - `stitch_premium_dermatology_management_interface/`: HTML/UI reference mockups.
  - `.agents/`: Task coordination metadata (must NOT contain application source/test code).
- **Global Configurations**: No root-level `package.json`, root `pom.xml`, or workspace-wide test runner configuration exists. Frontend and Backend operate as independent sub-projects.

---

## 3. Backend Survey (Java 17 / Spring Boot / Maven)

### 3.1 Architecture & Code Inventory
- **Main Package**: `com.dermacare.backend`
- **Controllers**:
  - `AuthController`: Endpoint `/api/auth/login` for user authentication, returning JWT token generated via JJWT (`io.jsonwebtoken`).
  - `PatientController`: Endpoints `/api/patients` (GET list, POST create patient).
  - `AppointmentController`: Endpoint `/api/appointments` (GET list).
- **Services**: `backend/src/main/java/com/dermacare/backend/services` directory currently exists but is empty (business logic is directly inside controllers/repositories).
- **Security**: `SecurityConfig` (stateless JWT authentication), `JwtAuthenticationFilter`, `JwtService` (extracts username, checks expiration, validates token).
- **Entities**: `Patient`, `Appointment`, `Consultation`, `Profile`, `ServiceEntity`, `UserRole`, `AppointmentStatus`.
- **Repositories**: `PatientRepository`, `AppointmentRepository` (Spring Data JPA interfaces).

### 3.2 Current Testing Setup
- **Existing Test Files**: Only 1 test file: `backend/src/test/java/com/dermacare/backend/BackendApplicationTests.java` containing an empty `contextLoads()` method.
- **Dependencies in `pom.xml`**:
  - `spring-boot-starter-data-jpa-test`
  - `spring-boot-starter-security-test`
  - `spring-boot-starter-validation-test`
  - `spring-boot-starter-webmvc-test`
  - `jjwt-api`, `jjwt-impl`, `jjwt-jackson` (0.12.3)
- **Gaps Identified**:
  1. **Missing standard `spring-boot-starter-test`**: Gives unified access to JUnit Jupiter 5, Mockito, AssertJ, and Spring Boot Test utilities.
  2. **Missing Test Database (`h2`)**: `application.yml` points to Supabase PostgreSQL (`aws-0-us-east-2.pooler.supabase.com`). Without `h2` database in `scope=test`, repository and controller integration tests will attempt to connect to live external PostgreSQL or fail when offline. `com/h2database:h2:2.2.224` is already cached in `~/.m2/repository`.
  3. **Surefire Plugin Versioning**: Running `./mvnw test` attempts to resolve `maven-surefire-plugin:3.5.6` from Maven Central. In offline mode or sandboxed environments, this fails unless pinned to `3.1.2` (which is present in `.m2`).
  4. **Zero Unit & Integration Test Coverage**: Controllers, JWT Service, and Data JPA Repositories have no test coverage.

### 3.3 Mutation Testing Setup (PITest)
- **Current State**: Unconfigured in `pom.xml`.
- **Cached Resources**: `org.pitest:pitest-maven:1.15.3` and `org.pitest:pitest-junit5-plugin:1.2.1` exist in local `.m2` repository.
- **Required Configuration**: Add `pitest-maven` plugin to `pom.xml`:
  ```xml
  <plugin>
      <groupId>org.pitest</groupId>
      <artifactId>pitest-maven</artifactId>
      <version>1.15.3</version>
      <dependencies>
          <dependency>
              <groupId>org.pitest</groupId>
              <artifactId>pitest-junit5-plugin</artifactId>
              <version>1.2.1</version>
          </dependency>
      </dependencies>
      <configuration>
          <targetClasses>
              <param>com.dermacare.backend.*</param>
          </targetClasses>
          <targetTests>
              <param>com.dermacare.backend.*</param>
          </targetTests>
          <mutationThreshold>70</mutationThreshold>
          <outputFormats>
              <param>HTML</param>
              <param>XML</param>
          </outputFormats>
      </configuration>
  </plugin>
  ```

### 3.4 Execution Commands for Backend
- **Compile tests**:
  `./mvnw -o test-compile`
- **Run Unit & Integration Tests**:
  `./mvnw -o test` (or `./mvnw test`)
- **Run Mutation Tests**:
  `./mvnw -o pitest:mutationCoverage` (or `./mvnw pitest:mutationCoverage`)
- **Report Location**: `backend/target/pit-reports/index.html`

---

## 4. Frontend Survey (React 18 / Vite 5)

### 4.1 Architecture & Code Inventory
- **Framework**: React 18, React Router DOM 6, Vite 5, Tailwind CSS 3.
- **Source Directory**: `frontend/src/`
- **Key Components & Pages**:
  - `App.jsx`: Router configuration (public routes vs protected layout routes).
  - `components/Layout.jsx`: Main UI shell with navigation sidebar & header.
  - `pages/InicioSesion.jsx`: Authentication login form with email & password inputs.
  - `pages/RegistroPaciente.jsx`: Form with personal information, medical history (checkboxes, text fields), allergies, and habits.
  - `pages/DirectorioPacientes.jsx`: Patient list view with search/filter capabilities.
  - `pages/MatrizVisualAgenda.jsx`: Appointment schedule grid.
  - `pages/FormularioEvolucion.jsx`: Daily progress & clinical evolution form.
  - `pages/CatalogoServicios.jsx`, `pages/GestionCobranzas.jsx`, `pages/PerfilPaciente.jsx`, etc.

### 4.2 Current Testing Setup
- **Existing Test Files**: **0** test files in `frontend/src`.
- **Dependencies in `package.json`**: No testing frameworks (Vitest, Jest, RTL) are present.
- **Scripts in `package.json`**: Only `"dev"`, `"build"`, and `"preview"`.

### 4.3 Proposed Testing & Mutation Testing Stack
1. **Unit & Integration Framework**: **Vitest**
   - Packages required: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`.
2. **Mutation Testing Framework**: **StrykerJS** (`@stryker-mutator/core`, `@stryker-mutator/vitest-runner`)
3. **Configuration**:
   - `vite.config.js` or `vitest.config.js`:
     ```js
     test: {
       globals: true,
       environment: 'jsdom',
       setupFiles: './src/test/setup.js',
     }
     ```
   - `stryker.config.json`:
     ```json
     {
       "$schema": "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
       "testRunner": "vitest",
       "reporters": ["html", "clear-text", "progress"],
       "mutate": [
         "src/**/*.jsx",
         "src/**/*.js",
         "!src/main.jsx",
         "!src/**/*.test.jsx",
         "!src/**/*.test.js"
       ],
       "thresholds": { "high": 80, "low": 70, "break": 70 }
     }
     ```
   - `package.json` scripts:
     ```json
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview",
       "test": "vitest run",
       "test:watch": "vitest",
       "test:mutation": "stryker run"
     }
     ```

### 4.4 Execution Commands for Frontend
- **Run Unit & Integration Tests**:
  `npm test` or `npx vitest run`
- **Run Mutation Tests**:
  `npm run test:mutation` or `npx stryker run`
- **Report Location**: `frontend/reports/mutation/mutation.html`

---

## 5. Representative Use Cases for Testing

To satisfy requirement **R3** and reach the **≥ 70% mutation score threshold**, test suites should target these key business flows:

| Domain | Flow / Component | Class / File Path | Key Test Scenarios |
| :--- | :--- | :--- | :--- |
| **Backend Auth** | JWT Generation & Validation | `JwtService.java` | Token creation, username extraction, expiration check, signature verification with altered key. |
| **Backend Auth** | Login API Endpoint | `AuthController.java` | Valid login returns token, invalid credentials handle error properly, payload mapping. |
| **Backend Patient** | Patient CRUD | `PatientController.java`, `PatientRepository.java` | GET all patients returns list, POST creates patient with required fields (DNI, names). |
| **Backend Appointment**| Appointment Query | `AppointmentController.java`, `AppointmentRepository.java` | Retrieval of appointments list, status filtering. |
| **Frontend Auth** | Login View | `InicioSesion.jsx` | Input rendering (email/password), validation error on submit, password toggle visibility. |
| **Frontend Patient** | Patient Registration Form | `RegistroPaciente.jsx` | Filling personal details, checking medical history options, submitting form. |
| **Frontend Navigation**| App Routing & Layout | `App.jsx`, `Layout.jsx` | Redirection from `/` to `/matriz-visual-agenda`, navigation links in sidebar. |

---

## 6. Summary Comparison Matrix

| Aspect | Backend (Java/Spring Boot) | Frontend (React/Vite) |
| :--- | :--- | :--- |
| **Language** | Java 17 | JavaScript / JSX (ES2022) |
| **Build System** | Maven (`./mvnw`) | npm / Vite |
| **Test Runner** | JUnit Jupiter 5 | Vitest (to be added) |
| **Test DB / Env** | H2 in-memory (to be added) | jsdom (to be added) |
| **Mutation Runner** | PITest (`pitest-maven` 1.15.3) | StrykerJS (`@stryker-mutator/core`) |
| **Current Test Files** | 1 (`BackendApplicationTests.java`) | 0 |
| **Target Mutation Score** | ≥ 70% | ≥ 70% |
| **Unit Command** | `./mvnw -o test` | `npm test` |
| **Mutation Command** | `./mvnw -o pitest:mutationCoverage` | `npm run test:mutation` |
