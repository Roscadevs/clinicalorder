# Frontend Test Suite & Mutation Testing Investigation — Analysis & Setup Plan (M2)

**Agent**: `explorer_m2_1`  
**Milestone**: M2 (Frontend Test Suite & Mutation Testing)  
**Date**: 2026-08-10  
**Target Working Directory**: `/Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/frontend`

---

## 1. Executive Summary

This report provides a comprehensive analysis of the existing frontend codebase in `frontend/` and specifies the exact configuration, dependency specifications, test setup files, mutation testing setup, and `package.json` scripts required to establish the M2 Frontend Test Suite using **Vitest**, **React Testing Library**, **jsdom**, and **StrykerJS**.

### Core Technical Targets
- **Unit & Integration Test Engine**: Vitest (`^1.6.10`) + jsdom (`^24.1.3`) + `@testing-library/react` (`^14.3.1`) + `@testing-library/jest-dom` (`^6.6.3`).
- **Mutation Testing Engine**: StrykerJS (`@stryker-mutator/core` `^8.7.1` + `@stryker-mutator/vitest-runner` `^8.7.1`).
- **Target Mutation Score**: $\ge 70\%$ on tested React components and pages.
- **Key Target Components/Pages**: `Layout`, `App`, `InicioSesion`, `RegistroPaciente`, `PerfilPaciente`, `DirectorioPacientes`, `MatrizVisualAgenda`, `EdicionTurno`.

---

## 2. Existing Frontend Project Inspection

### 2.1 `frontend/package.json` Assessment
- **Package Type**: `"type": "module"` (ESM standard).
- **Runtime Dependencies**:
  - `react`: `^18.2.0`
  - `react-dom`: `^18.2.0`
  - `react-router-dom`: `^6.20.0`
  - `lucide-react`: `^0.292.0`
- **Current Build & Dev Dependencies**:
  - `vite`: `^5.4.21` (Vite 5)
  - `@vitejs/plugin-react`: `^4.7.0`
  - `tailwindcss`: `^3.4.19`
- **Current Scripts**:
  - `"dev": "vite"`
  - `"build": "vite build"`
  - `"preview": "vite preview"`

### 2.2 Existing `frontend/vite.config.js` Assessment
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
```
Currently, `vite.config.js` only configures the React plugin and lacks a `test` configuration block for Vitest.

---

## 3. Recommended `devDependencies` Specifications

To enable seamless unit, integration, and mutation testing in `frontend/`, the following `devDependencies` are required:

| Package | Recommended Version Range | Rationale / Purpose |
|---|---|---|
| `vitest` | `^1.6.10` | Fast, Vite-native test runner compatible with ESM and Vite 5. |
| `@testing-library/react` | `^14.3.1` | React component testing library providing DOM querying & rendering utilities. |
| `@testing-library/jest-dom` | `^6.6.3` | Custom DOM matchers for Vitest (`toBeInTheDocument()`, `toHaveTextContent()`, etc.). |
| `@testing-library/user-event` | `^14.5.2` | Simulates realistic user interactions (click, type, keyboard events). |
| `jsdom` | `^24.1.3` | Browser DOM emulation environment for Vitest. |
| `@stryker-mutator/core` | `^8.7.1` | StrykerJS mutation testing core engine. |
| `@stryker-mutator/vitest-runner` | `^8.7.1` | StrykerJS runner plugin for executing Vitest suites during mutation runs. |

### Proposed `devDependencies` snippet for `frontend/package.json`
```json
  "devDependencies": {
    "@stryker-mutator/core": "^8.7.1",
    "@stryker-mutator/vitest-runner": "^8.7.1",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^14.3.1",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.7.0",
    "autoprefixer": "^10.5.4",
    "jsdom": "^24.1.3",
    "postcss": "^8.5.26",
    "tailwindcss": "^3.4.19",
    "vite": "^5.4.21",
    "vitest": "^1.6.10"
  }
```

---

## 4. Vitest & Test Setup Configuration Proposal

### 4.1 Proposed `frontend/vite.config.js`
Updating `vite.config.js` to include the `test` block:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
```

#### Key Configuration Options:
1. `globals: true`: Automatically injects `describe`, `it`, `test`, `expect`, `beforeEach`, `afterEach`, `vi` into global scope so explicit imports in test files are optional.
2. `environment: 'jsdom'`: Configures Vitest to run tests inside a JSDOM environment, providing `window`, `document`, `HTMLElement`, etc.
3. `setupFiles: './src/setupTests.js'`: Specifies global setup executed prior to running tests.
4. `include: ['src/**/*.{test,spec}.{js,jsx}']`: Directs Vitest to look for test files located under `src/`.

### 4.2 Proposed Setup File: `frontend/src/setupTests.js`
Create `frontend/src/setupTests.js` to import DOM assertion matchers and handle DOM cleanup:

```javascript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Automatically cleanup DOM tree after each test execution
afterEach(() => {
  cleanup();
});
```

---

## 5. StrykerJS Mutation Testing Configuration Proposal

Create `frontend/stryker.config.json` in `frontend/`:

```json
{
  "$schema": "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
  "mutate": [
    "src/components/Layout.jsx",
    "src/pages/InicioSesion.jsx",
    "src/pages/RegistroPaciente.jsx",
    "src/pages/PerfilPaciente.jsx",
    "src/pages/DirectorioPacientes.jsx",
    "src/pages/MatrizVisualAgenda.jsx",
    "src/pages/EdicionTurno.jsx",
    "src/App.jsx"
  ],
  "testRunner": "vitest",
  "reporters": [
    "html",
    "clear-text",
    "progress"
  ],
  "htmlReporter": {
    "fileName": "reports/mutation/stryker.html"
  },
  "concurrency": 4,
  "tempDirName": ".stryker-tmp",
  "thresholds": {
    "high": 80,
    "low": 70,
    "break": 70
  }
}
```

### Key Stryker Features & Parameters:
- **`mutate` list**: Target key M2 components/pages (`Layout.jsx`, `InicioSesion.jsx`, `RegistroPaciente.jsx`, `PerfilPaciente.jsx`, `DirectorioPacientes.jsx`, `MatrizVisualAgenda.jsx`, `EdicionTurno.jsx`, `App.jsx`).
- **`testRunner`**: Configured as `"vitest"` via `@stryker-mutator/vitest-runner`.
- **`thresholds.break: 70`**: Fails the command if mutation score is below 70%, guaranteeing compliance with acceptance criteria.

---

## 6. Recommended `frontend/package.json` Scripts

Add the following scripts to `frontend/package.json`:

```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:mutation": "npx stryker run"
  }
```

### Purpose of Scripts:
- `npm test` (`vitest run`): Executes full Vitest suite in single-run mode for local/CI validation.
- `npm run test:watch` (`vitest`): Watch mode for test development.
- `npm run test:mutation` (`npx stryker run`): Runs StrykerJS mutation tests using `stryker.config.json`.

---

## 7. Component Testing Target Inventory (M2 Scope)

| Component / Page | Target File Path | Primary Router & UI Interactions to Validate |
|---|---|---|
| `Layout` | `src/components/Layout.jsx` | Sidebar links (`Agenda`, `Pacientes`, `Configuración`, `Register Patient`, `Logout`), active state styling, mobile bottom navigation, `Outlet` rendering. |
| `App` | `src/App.jsx` | Full router routing tree integration, public routes vs layout wrapped routes navigation. |
| `InicioSesion` | `src/pages/InicioSesion.jsx` | Email & password form fields, submit button, input placeholders, security text. |
| `RegistroPaciente` | `src/pages/RegistroPaciente.jsx` | Personal data inputs (nombre, DNI, edad, teléfono, email), medical checkboxes, allergies, submit form button. |
| `PerfilPaciente` | `src/pages/PerfilPaciente.jsx` | Patient details, tab navigation, medical history items, appointment list. |
| `DirectorioPacientes` | `src/pages/DirectorioPacientes.jsx` | Patient search filter, table listing, action buttons (`Ver Ficha`, `Nuevo Paciente`). |
| `MatrizVisualAgenda` | `src/pages/MatrizVisualAgenda.jsx` | Calendar view, slot matrix, appointment status filters, action buttons (`Nuevo Turno`). |
| `EdicionTurno` | `src/pages/EdicionTurno.jsx` | Edit appointment details (fecha, hora, tipo consulta, paciente, observaciones), save/cancel action buttons. |

---

## 8. Step-by-Step Implementation Roadmap for M2 Implementer

1. **Install devDependencies**: Run `npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @stryker-mutator/core @stryker-mutator/vitest-runner` inside `frontend/`.
2. **Configure `frontend/vite.config.js`**: Add `test` object with `globals: true`, `environment: 'jsdom'`, and `setupFiles: './src/setupTests.js'`.
3. **Create `frontend/src/setupTests.js`**: Include `@testing-library/jest-dom` import and `afterEach(cleanup)` hook.
4. **Create `frontend/stryker.config.json`**: Configure `testRunner: "vitest"` and `mutate` target list.
5. **Update `frontend/package.json` scripts**: Add `"test": "vitest run"` and `"test:mutation": "npx stryker run"`.
6. **Implement Unit & Integration Component Tests**: Create tests under `frontend/src/__tests__/` or co-located `.test.jsx` files for `Layout`, `App`, `InicioSesion`, `RegistroPaciente`, `PerfilPaciente`, `DirectorioPacientes`, `MatrizVisualAgenda`, `EdicionTurno`.
7. **Run Tests & Verify**:
   - `npm test` -> verify 100% pass rate.
   - `npm run test:mutation` -> verify Stryker runs and mutation score $\ge 70\%$.
