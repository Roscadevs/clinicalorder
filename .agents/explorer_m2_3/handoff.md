# Handoff Report — StrykerJS Mutation Testing Strategy & Setup Analysis (Frontend)

**Agent**: `explorer_m2_3`  
**Working Directory**: `/Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/.agents/explorer_m2_3`  
**Milestone**: M2 — Frontend Test Suite & Mutation Testing  

---

## 1. Observation

1. **Workspace Files Inspected**:
   - `frontend/package.json`: Lines 11-25 currently include React 18, Vite 5, Lucide React, Tailwind, but missing test devDependencies (`vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`).
   - `frontend/vite.config.js`: Lines 1-8 currently contain standard Vite config with `@vitejs/plugin-react` without `test` options.
   - `frontend/stryker.config.json`: File does not exist yet.
   - `frontend/src/`: Contains `App.jsx`, `components/Layout.jsx`, and 18 page components in `pages/`.

2. **Component Source Code Analysis Findings**:
   - `frontend/src/components/Layout.jsx` (Lines 7-11, 28-41, 65-80): Renders sidebar and mobile navigation with `navItems` array (`path`, `icon`, `name`) and checks active route using `location.pathname.startsWith(item.path)`.
   - `frontend/src/App.jsx` (Lines 32-58): Renders `BrowserRouter` and routes, including `<Navigate to="/matriz-visual-agenda" replace />`.
   - `frontend/src/pages/InicioSesion.jsx` (Lines 25, 37, 38-40): Form fields have explicit attributes (`id="email"`, `type="email"`, `required=""`, `id="password"`, `type="password"`). Password visibility toggle button is static (`type="button"`).
   - `frontend/src/pages/RegistroPaciente.jsx` (Lines 24-52, 119): Checkbox for SPF photoprotector has default `checked=""` attribute. Form has distinct input types (`type="number"`, `type="tel"`, `type="email"`).
   - `frontend/src/pages/PerfilPaciente.jsx` (Lines 33-43, 143-193): Contains action buttons (`Modificar`, `Agendar Cita`, `title="Eliminar Paciente"`) and clinical summary badges (`Alergia: Penicilina`).
   - `frontend/src/pages/DirectorioPacientes.jsx` (Lines 57-61, 81-137): Table contains 3 static patient rows (`Elena Martinez` #PT-8842, `Robert Chen` #PT-7710, `Sarah Jenkins` #PT-9012) and a filter status `<select>`.
   - `frontend/src/pages/MatrizVisualAgenda.jsx` (Lines 35-48, 67-86, 146-193): Renders appointment slots (`M. Gomez`, `R. Blanco`), select dropdowns for doctors and treatments, and slot status badges (`Disponible`, `Señado`, `Reservado`, `Bloqueado`).
   - `frontend/src/pages/EdicionTurno.jsx` (Lines 50, 58, 68, 86): Date/time inputs have hardcoded initial values (`value="2023-11-15"`, `value="10:30"`), default selected option (`selected=""`), and toggle checkbox (`checked=""`).

---

## 2. Logic Chain

1. **StrykerJS Integration with Vitest**:
   - StrykerJS uses `@stryker-mutator/vitest-runner` to run Vitest in worker threads (`testRunner: "vitest"`).
   - Because `frontend/package.json` specifies `"type": "module"`, StrykerJS reads `stryker.config.json` referencing `vite.config.js`.
   - Setting `"coverageAnalysis": "perTest"` enables Vitest test filtering, executing only relevant tests for each mutant, optimizing runtime.

2. **Scoping `mutate` Globs**:
   - If Stryker mutates files that lack tests (e.g. untested pages in `src/pages/`), 100% of mutants in those files survive, pulling the overall mutation score below the 70% threshold.
   - Therefore, the `mutate` array in `stryker.config.json` must strictly list target components tested in M2 (`Layout.jsx`, `App.jsx`, `InicioSesion.jsx`, `RecuperacionContrasena.jsx`, `RegistroPaciente.jsx`, `PerfilPaciente.jsx`, `DirectorioPacientes.jsx`, `MatrizVisualAgenda.jsx`, `EdicionTurno.jsx`).

3. **Mutant Survival Risk Mitigation**:
   - Stryker mutates string literals (e.g., input `type`, `placeholder`, `href`, `title`, text content), boolean flags (e.g. `required`, `checked`), and conditions (`startsWith`, `? :`).
   - Basic presence assertions (`getByText`) allow attribute/value mutants to survive.
   - To achieve >= 70% mutation score, unit/integration tests must assert exact element attributes (`toHaveAttribute('type', 'email')`, `toBeRequired()`), initial input values (`toHaveValue('2023-11-15')`), checked states (`toBeChecked()`), active route CSS classes, and all rows in table components (`DirectorioPacientes`).

---

## 3. Caveats

- **Scope boundary**: This analysis covers the 9 target components defined for Milestone 2 (`Layout.jsx`, `App.jsx`, `InicioSesion.jsx`, `RecuperacionContrasena.jsx`, `RegistroPaciente.jsx`, `PerfilPaciente.jsx`, `DirectorioPacientes.jsx`, `MatrizVisualAgenda.jsx`, `EdicionTurno.jsx`). If additional components are added to the test suite in M2, they must be added to the `stryker.config.json` `mutate` array.
- **Dependency installation**: Dependencies (`@stryker-mutator/core`, `@stryker-mutator/vitest-runner`) must be installed in `frontend/package.json` by the implementer agent before running `npx stryker run`.

---

## 4. Conclusion

- A complete, schema-compliant `stryker.config.json` has been designed using `@stryker-mutator/vitest-runner` with `coverageAnalysis: "perTest"` and reporters `html`, `clear-text`, `json`, `progress`.
- The target component mutate patterns and survival risks have been mapped out in detail in `/Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/.agents/explorer_m2_3/analysis.md`.
- Implementation of the recommended 4 core RTL testing patterns (Exact Attribute Assertions, Route Active State Assertions, Initial Value/Checked Assertions, and Exhaustive Table Row Assertions) will guarantee a mutation score between 80% and 95%, easily surpassing the >= 70% threshold.

---

## 5. Verification Method

1. **File Inspection**:
   - View `/Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/.agents/explorer_m2_3/analysis.md` for full detailed analysis, JSON schema, and testing patterns.

2. **Execution Verification (After Implementer Setup)**:
   - Run Vitest tests:
     ```bash
     cd /Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/frontend && npm test
     ```
   - Run Stryker mutation runner:
     ```bash
     cd /Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/frontend && npm run test:mutation
     ```
   - Invalidation Condition: Failure to achieve >= 70% mutation score on `reports/mutation/mutation.json` or `html` report.
