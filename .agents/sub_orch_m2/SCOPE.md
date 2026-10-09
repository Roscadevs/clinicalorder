# Scope: Milestone 2 — Frontend Test Suite & Mutation Testing

## Architecture
- Stack: React 18, Vite 5, Vitest, React Testing Library, jsdom.
- Mutation Runner: StrykerJS (`@stryker-mutator/core`, `@stryker-mutator/vitest-runner`).

## Feature Inventory Scope (M2)
1. Configure `frontend/package.json` with Vitest, RTL, jsdom, and Stryker dependencies & scripts (`test`, `test:mutation`).
2. Create `frontend/vite.config.js` test configuration and `frontend/stryker.config.json`.
3. Implement unit and integration component tests for key components and pages (`Layout`, `App`, `InicioSesion`, `RegistroPaciente`, `PerfilPaciente`, `DirectorioPacientes`, `MatrizVisualAgenda`, `EdicionTurno`).
4. Execute unit/integration tests (`npm test` / `npx vitest run`) and ensure 100% pass.
5. Execute Stryker mutation testing (`npx stryker run` / `npm run test:mutation`), generate report, and achieve >= 70% mutation score on tested files.

## Interface Contracts
- React Router 6 navigation and page components inside `frontend/src/pages/` and `frontend/src/components/Layout.jsx`.

## Code Layout Ownership (M2)
- Exclusive write ownership: `frontend/package.json`, `frontend/vite.config.js`, `frontend/stryker.config.json`, `frontend/src/__tests__/**` or `frontend/src/**/*.test.jsx`
- Read-only reference: `frontend/src/**/*.jsx` (unless minor fix needed for testability)
