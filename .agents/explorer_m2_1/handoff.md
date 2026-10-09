# Handoff Report: Frontend Test Suite & Mutation Testing Setup (M2)

**Agent**: `explorer_m2_1`  
**Working Directory**: `/Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/.agents/explorer_m2_1`  
**Handoff Type**: Hard (Task Complete)  
**Recipient**: `sub_orch_m2` / `implementer_m2_1`  

---

## 1. Observation

1. **Existing `frontend/package.json`**:
   - File path: `/Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/frontend/package.json`
   - Lines 5-10:
     ```json
     "type": "module",
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview"
     },
     ```
   - Lines 24-25:
     ```json
     "vite": "^5.4.21"
     ```
   - Standard React 18 (`^18.2.0`), React Router DOM 6 (`^6.20.0`), Vite 5 (`^5.4.21`), Tailwind CSS environment.
   - Currently lacks test dependencies (`vitest`, `@testing-library/*`, `jsdom`, `@stryker-mutator/*`) and test execution scripts.

2. **Existing `frontend/vite.config.js`**:
   - File path: `/Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/frontend/vite.config.js`
   - Lines 1-8:
     ```javascript
     import { defineConfig } from 'vite'
     import react from '@vitejs/plugin-react'

     // https://vitejs.dev/config/
     export default defineConfig({
       plugins: [react()],
     })
     ```
   - Lacks `test` configuration block required by Vitest.

3. **Node & NPM Environment**:
   - Output from `node -v && npm -v`: `Node v22.19.0`, `npm 10.9.3`.

4. **Source Code Structure (`frontend/src/`)**:
   - Component: `src/components/Layout.jsx` (uses `react-router-dom` `Outlet`, `Link`, `useLocation`).
   - App Root: `src/App.jsx` (uses `BrowserRouter`, `Routes`, `Route`, `Navigate`).
   - Target Pages: `src/pages/InicioSesion.jsx`, `src/pages/RegistroPaciente.jsx`, `src/pages/PerfilPaciente.jsx`, `src/pages/DirectorioPacientes.jsx`, `src/pages/MatrizVisualAgenda.jsx`, `src/pages/EdicionTurno.jsx`.

---

## 2. Logic Chain

1. **Dependency Selection**:
   - Based on Observation 1 (`vite: ^5.4.21`, `react: ^18.2.0`, `"type": "module"`), `vitest` v1.6.10, `@testing-library/react` v14.3.1, `@testing-library/jest-dom` v6.6.3, `@testing-library/user-event` v14.5.2, and `jsdom` v24.1.3 provide optimal native ES Module compatibility with Vite 5 without transpilation or CJS conflicts.
   - For mutation testing, `@stryker-mutator/core` v8.7.1 combined with `@stryker-mutator/vitest-runner` v8.7.1 supports native Vitest execution in StrykerJS.

2. **Configuration Design**:
   - Vitest reuses `vite.config.js`. Adding `test: { globals: true, environment: 'jsdom', setupFiles: './src/setupTests.js' }` enables global test utilities and DOM simulation.
   - Creating `src/setupTests.js` with `import '@testing-library/jest-dom'` extends Vitest expect assertions with custom DOM matchers (`toBeInTheDocument`, etc.).
   - Creating `stryker.config.json` with `testRunner: "vitest"` and `mutate: [...]` targets the exact components/pages specified in `SCOPE.md` and enforces `thresholds.break: 70` to satisfy the $\ge 70\%$ mutation score requirement.

3. **Script Standardization**:
   - Adding `"test": "vitest run"` and `"test:mutation": "npx stryker run"` to `package.json` satisfies the requirement for deterministic single-run test execution commands.

---

## 3. Caveats

- **Network Mode**: Installing npm packages via `npm install` requires internet access to npm registry. If offline or in sandboxed mode, packages must be fetched from npm cache or workspace node_modules.
- **Router Wrapping in Tests**: Since components like `Layout.jsx` and pages use `react-router-dom` hooks (`useLocation`, `Link`), tests for individual components must render the component inside a `MemoryRouter` wrapper.

---

## 4. Conclusion

The setup plan for M2 Frontend Test Suite & Mutation Testing is fully defined and documented in `/Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/.agents/explorer_m2_1/analysis.md`. The implementer can directly apply the proposed modifications to `frontend/package.json`, `frontend/vite.config.js`, `frontend/src/setupTests.js`, and `frontend/stryker.config.json`.

---

## 5. Verification Method

1. **Inspect Analysis Report**:
   - View `/Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/.agents/explorer_m2_1/analysis.md` to confirm full dependency specs, configuration files, and component inventory.

2. **Post-Implementation Execution Verification**:
   - `cd frontend && npm test` -> Must execute Vitest and report 100% tests passing.
   - `cd frontend && npm run test:mutation` -> Must execute StrykerJS and report Mutation Score $\ge 70\%$.
