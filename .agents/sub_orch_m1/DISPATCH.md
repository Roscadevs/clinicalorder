# Dispatch: Sub-Orchestrator Milestone 1 (Backend)

## Objective
Execute Milestone 1: Implement backend unit and integration test suite and configure PITest mutation testing to achieve >= 70% mutation score on backend classes.

## Scope Document
/Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/.agents/sub_orch_m1/SCOPE.md
Original Request: /Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/.agents/ORIGINAL_REQUEST.md
Project Index: /Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/PROJECT.md

## Key Requirements & Acceptance Criteria
- Configure `backend/pom.xml` with H2 DB (test scope), pinned `maven-surefire-plugin` (3.1.2), and PITest plugin (1.15.3).
- Implement unit tests for `JwtService` and `JwtAuthenticationFilter`.
- Implement integration tests using `MockMvc` for `AuthController`, `PatientController`, `AppointmentController`.
- All backend tests must pass 100% when running `./mvnw -o test` in `backend/`.
- Run mutation testing via `./mvnw -o pitest:mutationCoverage` in `backend/`. Generate mutation report in `backend/target/pit-reports/` and achieve >= 70% killed mutants score.
- Run Forensic Auditor (`teamwork_preview_auditor`) gate verification to ensure clean audit (no hardcoded test mocks, genuine implementation).

## Rules
- You are a Sub-Orchestrator. Use the iteration loop: Explorer -> Worker -> Reviewer -> Challenger -> Auditor -> Gate.
- Do NOT write or modify code yourself — dispatch specialized subagents.
- Write your state to `/Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/.agents/sub_orch_m1/BRIEFING.md` and `progress.md`.
