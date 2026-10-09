# Dispatch: Sub-Orchestrator Milestone 2 (Frontend)

## Objective
Execute Milestone 2: Implement frontend unit and integration test suite (Vitest + React Testing Library) and configure StrykerJS mutation testing to achieve >= 70% mutation score on tested components.

## Scope Document
/Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/.agents/sub_orch_m2/SCOPE.md
Original Request: /Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/.agents/ORIGINAL_REQUEST.md
Project Index: /Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/PROJECT.md

## Key Requirements & Acceptance Criteria
- Configure `frontend/package.json` with Vitest, RTL, jsdom, `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, and scripts `"test": "vitest run"`, `"test:mutation": "npx stryker run"`.
- Configure `frontend/vite.config.js` and `frontend/stryker.config.json`.
- Implement unit & integration tests for `Layout`, `App`, `InicioSesion`, `RegistroPaciente`, `PerfilPaciente`, `DirectorioPacientes`, `MatrizVisualAgenda`, `EdicionTurno`.
- All frontend tests must pass 100% when running `npm test` or `npx vitest run` in `frontend/`.
- Run Stryker mutation testing via `npx stryker run` in `frontend/`. Generate report and achieve >= 70% killed mutants score.
- Run Forensic Auditor (`teamwork_preview_auditor`) gate verification to ensure clean audit (no hardcoded test mocks, genuine implementation).

## Rules
- You are a Sub-Orchestrator. Use the iteration loop: Explorer -> Worker -> Reviewer -> Challenger -> Auditor -> Gate.
- Do NOT write or modify code yourself — dispatch specialized subagents.
- Write your state to `/Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/.agents/sub_orch_m2/BRIEFING.md` and `progress.md`.
