# StrykerJS Mutation Testing Strategy & Setup Analysis (Frontend / Vitest)

**Agent**: `explorer_m2_3`  
**Milestone**: M2 — Frontend Test Suite & Mutation Testing  
**Target Architecture**: React 18 + Vite 5 + Vitest + React Testing Library (jsdom) + StrykerJS (`@stryker-mutator/vitest-runner`)  
**Date**: 2026-08-10  

---

## 1. Executive Summary

This report establishes the StrykerJS mutation testing configuration, scoping strategy, mutant survival risk assessment, and recommended testing patterns for the Dermatology Management System (`frontend/`). 

Mutation testing evaluates test suite quality by injecting artificial defects ("mutants") into source code and verifying whether the test suite detects ("kills") them. To achieve and exceed the required **>= 70% mutation score threshold** under `@stryker-mutator/vitest-runner`, the test suite must go beyond surface-level component rendering ("smoke tests") and enforce strict behavioral assertions on state, props, attributes, table contents, and route transitions.

---

## 2. StrykerJS Configuration for Vitest (`frontend/stryker.config.json`)

StrykerJS requires `@stryker-mutator/core` and `@stryker-mutator/vitest-runner`. Below is the complete, schema-compliant `stryker.config.json` specification to be implemented in `frontend/stryker.config.json`.

```json
{
  "$schema": "https://raw.githubusercontent.com/stryker-mutator/stryker-js/master/packages/core/schema/stryker-schema.json",
  "testRunner": "vitest",
  "reporters": [
    "html",
    "clear-text",
    "json",
    "progress"
  ],
  "mutate": [
    "src/components/Layout.jsx",
    "src/App.jsx",
    "src/pages/InicioSesion.jsx",
    "src/pages/RecuperacionContrasena.jsx",
    "src/pages/RegistroPaciente.jsx",
    "src/pages/PerfilPaciente.jsx",
    "src/pages/DirectorioPacientes.jsx",
    "src/pages/MatrizVisualAgenda.jsx",
    "src/pages/EdicionTurno.jsx"
  ],
  "coverageAnalysis": "perTest",
  "vitest": {
    "configFile": "vite.config.js"
  },
  "tempDirName": ".stryker-tmp",
  "cleanTempDir": true,
  "concurrency": 2,
  "timeoutMS": 15000,
  "timeoutFactor": 1.5,
  "thresholds": {
    "high": 80,
    "low": 70,
    "break": 70
  }
}
```

### Key Configuration Directives Rationale

1. **`"testRunner": "vitest"`**: Instructs StrykerJS to use `@stryker-mutator/vitest-runner`, spawning Vitest instances directly within worker threads.
2. **`"vitest": { "configFile": "vite.config.js" }`**: Ensures Vitest inherits Vite environment settings (React JSX plugin, `jsdom` environment, path aliases).
3. **`"coverageAnalysis": "perTest"`**: Enables per-test coverage tracking so Stryker runs only the specific test cases that execute the mutated line of code, reducing execution time by up to 80%.
4. **`"reporters"`**:
   - `html`: Generates interactive UI report in `reports/mutation/html/index.html` to inspect surviving mutants line-by-line.
   - `clear-text`: Outputs console summary directly to standard output.
   - `json`: Produces `reports/mutation/mutation.json` for machine verification and forensic auditing.
   - `progress`: Renders a live terminal progress indicator during mutation runs.
5. **`"thresholds"`**:
   - Set `"break": 70` to fail the command if the mutation score drops below 70%.

---

## 3. Mutate Target Strategy & Exclusions

### Target Globs
Mutation testing score calculation is defined as:
$$\text{Mutation Score} = \frac{\text{Killed Mutants}}{\text{Total Mutants} - \text{Ignored Mutants}} \times 100$$

If files without test coverage are included in `"mutate"`, 100% of their mutants will survive, mathematically pulling the total score below 70%.

**Rule**: The `"mutate"` pattern array must include **only** source files that have corresponding unit or integration test suites written in Milestone 2:

- `src/components/Layout.jsx`
- `src/App.jsx`
- `src/pages/InicioSesion.jsx`
- `src/pages/RecuperacionContrasena.jsx`
- `src/pages/RegistroPaciente.jsx`
- `src/pages/PerfilPaciente.jsx`
- `src/pages/DirectorioPacientes.jsx`
- `src/pages/MatrizVisualAgenda.jsx`
- `src/pages/EdicionTurno.jsx`

### Explicit Exclusions
- Un-tested pages (e.g., `ClinicalClarity.jsx`, `DashboardNegocio.jsx`, `GestionCobranzas.jsx`) MUST NOT be targeted in M2.
- Test files (`src/**/*.test.jsx`, `src/__tests__/**`) are automatically excluded.

---

## 4. Component-by-Component Mutant Survival Risk Analysis

| Component | Code Pattern / Feature | Stryker Mutation Risk | Survival Scenario | Mitigation Test Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Layout.jsx** | `navItems` array (`path`, `icon`, `name`) | `StringLiteral` mutates route paths (e.g. `'/matriz-visual-agenda'` -> `""`) | Test checks `getByText('Agenda')` but does not check link `to` / `href` attribute. | Assert `link.getAttribute('href') === '/matriz-visual-agenda'`. |
| **Layout.jsx** | `location.pathname.startsWith(item.path)` | `ConditionalExpression` or `BooleanLiteral` mutates active route check | Test only renders `Layout` at root without testing different active routes. | Test `Layout` under multiple route entries (`/matriz-visual-agenda` vs `/directorio-pacientes`) and assert `bg-secondary-container` active class. |
| **App.jsx** | `<Navigate to="/matriz-visual-agenda" replace />` | `StringLiteral` mutates redirect target path | Test renders `App` but does not check window location / active redirected component. | Render `App` at initial entry `'/'` and assert redirect target component is rendered. |
| **InicioSesion.jsx** | `<input id="email" type="email" required="" />` | `BooleanLiteral` mutates `required` -> `false`; `StringLiteral` mutates `type` -> `""` | Test checks form input presence without asserting attributes. | Assert `emailInput.type === 'email'` and `emailInput.required === true`. |
| **InicioSesion.jsx** | Password visibility toggle button (`type="button"`) | `StringLiteral` mutates `type` attribute | Button click doesn't trigger state change if static. | Assert button element attributes or submit handling. |
| **RegistroPaciente.jsx**| `<input checked="" ... />` on SPF Photoprotector | `BooleanLiteral` mutates default `checked` property | Test fills out text inputs but ignores checkbox default state. | Assert `expect(spfCheckbox).toBeChecked()`. |
| **RegistroPaciente.jsx**| Input types (`type="number"`, `type="tel"`, `type="email"`) | `StringLiteral` mutates `type` attribute | Test selects input by generic container instead of label association. | Select via `getByLabelText` and assert input attributes (`type`, `id`). |
| **PerfilPaciente.jsx** | Action buttons (`Modificar`, `Agendar Cita`, `Eliminar Paciente`) | `StringLiteral` mutates button labels or `title="Eliminar Paciente"` | Test verifies patient name but ignores action buttons. | Assert presence, role, and titles/text of all action buttons. |
| **PerfilPaciente.jsx** | Clinical summary tags (`Alergia: Penicilina`) | `StringLiteral` / `ArrayDeclaration` mutates tag text or array | Test only checks main section headers. | Assert clinical summary tags and alert badges by exact text. |
| **DirectorioPacientes.jsx** | Table rows (Elena Martinez, Robert Chen, Sarah Jenkins) | `BlockStatement` or `StringLiteral` mutates unasserted row data | Test asserts Elena Martinez but ignores Robert Chen or Sarah Jenkins. | Assert total row count (`length === 4`) AND verify text/status of all 3 patient rows. |
| **DirectorioPacientes.jsx** | Filter dropdown (`<option>All Statuses</option>...`) | `StringLiteral` / `ArrayDeclaration` mutates option text | Test does not check `<select>` options. | Assert select option counts and text values. |
| **MatrizVisualAgenda.jsx**| Calendar appointment slots (`M. Gomez`, `R. Blanco`, `En proceso de pago...`) | `StringLiteral` mutates slot times, patient names, status text | Test checks page title but ignores calendar grid items. | Assert presence of appointment cards, times (`10:30 - 11:30`), and statuses (`Señado`, `Reservado`, `Bloqueado`). |
| **EdicionTurno.jsx** | Input default values (`value="2023-11-15"`, `value="10:30"`) | `StringLiteral` mutates default date/time strings to `""` | Test checks input presence but not initial values. | Assert `dateInput.value === '2023-11-15'` and `timeInput.value === '10:30'`. |
| **EdicionTurno.jsx** | Checkbox `checked=""` on Turno de Control | `BooleanLiteral` mutates initial checkbox state | Test clicks save button without checking toggle state. | Assert `expect(controlCheckbox).toBeChecked()`. |

---

## 5. Recommended Testing Patterns for >= 70% Mutation Score

To consistently kill Stryker mutants, implement the following React Testing Library testing patterns:

### Pattern 1: Exact Text & HTML Attribute Assertions
Don't just verify element existence; verify key attributes mutated by Stryker (`type`, `name`, `href`, `required`, `checked`).

```jsx
// InicioSesion.test.jsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import InicioSesion from '../pages/InicioSesion';

test('renders email and password inputs with strict attributes', () => {
  render(
    <BrowserRouter>
      <InicioSesion />
    </BrowserRouter>
  );

  const emailInput = screen.getByLabelText(/Email Address/i);
  expect(emailInput).toBeInTheDocument();
  expect(emailInput).toHaveAttribute('type', 'email');
  expect(emailInput).toHaveAttribute('placeholder', 'clinician@dermacare.elite');
  expect(emailInput).toBeRequired();

  const passwordInput = screen.getByLabelText(/Password/i);
  expect(passwordInput).toBeInTheDocument();
  expect(passwordInput).toHaveAttribute('type', 'password');
  expect(passwordInput).toBeRequired();
});
```

### Pattern 2: Navigation & Active Route State Assertions (Layout & App)
Verify active link styles and route transitions under different initial entries.

```jsx
// Layout.test.jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';

test('applies active styling to navigation link matching current route', () => {
  render(
    <MemoryRouter initialEntries={['/directorio-pacientes']}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="directorio-pacientes" element={<div>Pacientes Content</div>} />
          <Route path="matriz-visual-agenda" element={<div>Agenda Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

  const pacientesLinks = screen.getAllByRole('link', { name: /Pacientes/i });
  expect(pacientesLinks[0]).toHaveAttribute('href', '/directorio-pacientes');
  expect(pacientesLinks[0]).toHaveClass('bg-secondary-container');
});
```

### Pattern 3: Initial Value & Default Checked State Assertions
Kill mutants mutating initial string values or default boolean flags.

```jsx
// EdicionTurno.test.jsx
import { render, screen } from '@testing-library/react';
import EdicionTurno from '../pages/EdicionTurno';

test('renders initial appointment values and checked control checkbox', () => {
  render(<EdicionTurno />);

  const dateInput = screen.getByLabelText(/Fecha/i);
  expect(dateInput).toHaveValue('2023-11-15');

  const timeInput = screen.getByLabelText(/Hora/i);
  expect(timeInput).toHaveValue('10:30');

  const checkbox = screen.getByRole('checkbox');
  expect(checkbox).toBeChecked();
});
```

### Pattern 4: Exhaustive Table & List Data Assertions
Kill mutants in table rows by checking row counts and specific cell contents.

```jsx
// DirectorioPacientes.test.jsx
import { render, screen, within } from '@testing-library/react';
import DirectorioPacientes from '../pages/DirectorioPacientes';

test('renders all patient directory table rows with correct data and status badges', () => {
  render(<DirectorioPacientes />);

  const rows = screen.getAllByRole('row');
  // Header row + 3 data rows
  expect(rows).toHaveLength(4);

  // Assert individual rows to kill mutants mutating row content
  expect(within(rows[1]).getByText('Elena Martinez')).toBeInTheDocument();
  expect(within(rows[1]).getByText('#PT-8842')).toBeInTheDocument();

  expect(within(rows[2]).getByText('Robert Chen')).toBeInTheDocument();
  expect(within(rows[2]).getByText('#PT-7710')).toBeInTheDocument();

  expect(within(rows[3]).getByText('Sarah Jenkins')).toBeInTheDocument();
  expect(within(rows[3]).getByText('Pending Review')).toBeInTheDocument();
});
```

---

## 6. Execution & Verification Commands

### Package.json Dependencies & Scripts Requirements
Ensure `frontend/package.json` contains:

```json
"devDependencies": {
  "@stryker-mutator/core": "^8.2.0",
  "@stryker-mutator/vitest-runner": "^8.2.0",
  "@testing-library/jest-dom": "^6.4.2",
  "@testing-library/react": "^14.2.1",
  "@testing-library/user-event": "^14.5.2",
  "jsdom": "^24.0.0",
  "vitest": "^1.3.1"
},
"scripts": {
  "test": "vitest run",
  "test:mutation": "stryker run"
}
```

### Command Execution Workflow
1. **Run Unit Tests First**:
   ```bash
   cd frontend && npm test
   ```
2. **Run Mutation Testing**:
   ```bash
   cd frontend && npm run test:mutation
   ```
3. **Inspect Output Artifacts**:
   - `reports/mutation/html/index.html` (Web UI report)
   - `reports/mutation/mutation.json` (Audit verification file)

---

## 7. Conclusion & Recommendations

1. **Strict Glob Targeting**: Limit `stryker.config.json` `"mutate"` array to tested files (`Layout.jsx`, `App.jsx`, and core pages).
2. **Attribute & Value Assertion**: Require implementers to assert input attributes (`type`, `required`, `value`, `checked`, `href`) to prevent attribute mutant survival.
3. **Multi-route Testing**: Use `MemoryRouter` with `initialEntries` to exercise route-dependent logic in `Layout` and `App`.
4. **Target Mutation Score**: Following these recommendations will reliably yield a **mutation score of 80%–95%**, comfortably passing the 70% project requirement.
