# Frontend Codebase Analysis Report — Dermatology Management System

## Executive Summary
This report provides a comprehensive analysis of the frontend codebase for the Dermatology Management System (`dermatology-frontend`), located at `/Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/frontend`.

The application is a modern Single Page Application (SPA) built with React 18, Vite 5, React Router 6, and Tailwind CSS. Currently, the codebase is strictly presentational: all 20 views/pages and layout components are pure React components rendering static JSX mockups without state management, API integration, or automated tests.

---

## 1. Project Architecture & Frameworks

| Aspect | Technology / Details |
|---|---|
| **Framework** | React 18 (`react` ^18.2.0, `react-dom` ^18.2.0) |
| **Build Tool & Dev Server** | Vite 5 (`vite` ^5.4.21, `@vitejs/plugin-react` ^4.7.0) |
| **Module Type** | ES Modules (`"type": "module"` in `package.json`) |
| **Routing** | React Router DOM 6 (`react-router-dom` ^6.20.0) |
| **Styling** | Tailwind CSS 3 (`tailwindcss` ^3.4.19), PostCSS (`postcss` ^8.5.26), Autoprefixer (`autoprefixer` ^10.5.4) |
| **Icons & Typography** | `lucide-react` (^0.292.0), Google Fonts (Inter) & Google Material Symbols Outlined (via CDN in `index.html`) |
| **Deployment Config** | `vercel.json` configured with client-side SPA rewrites |

---

## 2. Directory & Component Structure

```
frontend/
├── index.html                  # HTML entry point, CDN links for Inter font and Material Symbols
├── package.json                # Project manifest and scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.js          # Extended Tailwind theme (colors, spacing, font sizes)
├── vercel.json                 # Vercel deployment routing rewrites
├── vite.config.js              # Vite React plugin configuration
└── src/
    ├── App.jsx                 # Main application router setup (Public & Protected routes)
    ├── main.jsx                # React root entry point
    ├── index.css               # Global CSS imports (@tailwind directive)
    ├── components/
    │   └── Layout.jsx          # Shell layout (Sidebar, Mobile bottom nav, <Outlet />)
    └── pages/                  # 20 page components (described below)
```

### Components Summary

1. **`Layout.jsx` (`/src/components/Layout.jsx`)**:
   - Master layout wrapper.
   - Desktop sidebar (`<aside className="hidden lg:flex...">`) containing brand title ("Dermacare Clinical Portal"), main navigation links (`Agenda`, `Pacientes`, `Configuración`), "Register Patient" button, Support & Logout links.
   - Dynamic active-route highlighting using React Router's `useLocation()`.
   - Mobile navigation bar (`<nav className="lg:hidden...">`).
   - Central content area rendering nested routes via `<Outlet />`.

2. **Page Components (`/src/pages/`)**:
   - **`InicioSesion.jsx`** (`/inicio-sesion`): Login screen with email & password inputs, forgot password link, sign-in button.
   - **`RecuperacionContrasena.jsx`** (`/recuperacion-contrasena`): Password reset request page with email entry and back-to-login navigation.
   - **`MatrizVisualAgenda.jsx`** (`/matriz-visual-agenda`, default index route): Visual calendar appointment matrix with professional/treatment filters, appointment slot cards (Available, Reserved, Deposit/Señado, Blocked), action buttons, and side details panel.
   - **`CatalogoServicios.jsx`** (`/catalogo-servicios`): Service catalog grid displaying cards for procedures (Deep Cleansing Facial, Chemical Peel, Botulinum Toxin A, Laser Hair Removal) with duration, pricing, status badge, edit/deactivate buttons.
   - **`ConfiguracionCatalogo.jsx`** (`/configuracion-catalogo`): Tabular management view of catalog services with category filtering, search input, status indicators, and action triggers.
   - **`DashboardDermacare.jsx`** (`/dashboard-dermacare`): KPI dashboard (New Patients, Occupancy Rate, Revenue, Top Treatment), date filter, report export button, `<canvas>` containers for consultation evolution and demographic charts.
   - **`DashboardNegocio.jsx`** (`/dashboard-negocio`): Financial and operational business intelligence dashboard.
   - **`DirectorioPacientes.jsx`** (`/directorio-pacientes`): Patient directory table with search, filters, and action buttons.
   - **`EdicionTurno.jsx`** (`/edicion-turno`): Appointment modification and rescheduling modal/view.
   - **`FormularioEvolucion.jsx`** (`/formulario-evolucion`): Form for recording clinical evolution notes during consultations.
   - **`GestionCobranzas.jsx`** (`/gestion-cobranzas`): Payment collections and pending balance management view.
   - **`HistoriaClinicaCompleta.jsx`** (`/historia-clinica-completa`): Comprehensive medical history record for a patient.
   - **`HistoriaClinicaPanel.jsx`** (`/historia-clinica-panel`): Medical history overview dashboard panel.
   - **`HistoriaClinicaRegistro.jsx`** (`/historia-clinica-registro`): Form for adding new medical history entries.
   - **`HistoriaClinicaTabulada.jsx`** (`/historia-clinica-tabulada`): Tabbed medical history interface.
   - **`PanelLateralReserva.jsx`** (`/panel-lateral-reserva`): Drawer overlay interface for creating new appointment bookings.
   - **`PanelRegistroPago.jsx`** (`/panel-registro-pago`): Payment registration form panel.
   - **`PerfilPaciente.jsx`** (`/perfil-paciente`): Detailed patient profile page with contact details, medical background summary, and clinical timeline.
   - **`RegistroPaciente.jsx`** (`/registro-paciente`): Patient registration form featuring sections for personal details, medical background (pathologies, allergies, toxic habits), and previous aesthetic procedures.
   - **`ClinicalClarity.jsx`** (`/clinical-clarity`): Placeholder stub component ("Vista en construcción...").

---

## 3. State Management & Data Architecture

- **State Management**: None currently implemented. All page components render static JSX without `useState`, `useReducer`, `useContext`, or external state stores (e.g., Redux, Zustand).
- **Form Handling**: HTML standard form elements (`<input>`, `<select>`, `<textarea>`, `<button>`) without event handlers (`onChange`, `onSubmit`) or validation logic.
- **API Services & Data Integration**: None. There are no API service modules, `axios` instances, or `fetch` calls. Mock data is embedded directly as hardcoded JSX text.

---

## 4. Existing Tests & Test Infrastructure

- **Current Status**: Zero test coverage.
- **Existing Test Files**: None in `frontend/src` or `frontend/`.
- **Test Runner Config**: Vitest, Jest, React Testing Library, and Stryker JS are **not installed** or configured in `package.json` or `vite.config.js`.

---

## 5. Dependencies Inventory

### Production Dependencies (`dependencies`)
```json
{
  "lucide-react": "^0.292.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0"
}
```

### Development Dependencies (`devDependencies`)
```json
{
  "@types/react": "^18.2.37",
  "@types/react-dom": "^18.2.15",
  "@vitejs/plugin-react": "^4.7.0",
  "autoprefixer": "^10.5.4",
  "postcss": "^8.5.26",
  "tailwindcss": "^3.4.19",
  "vite": "^5.4.21"
}
```

---

## 6. Gap Analysis & Testing Strategy Recommendations

To satisfy requirements R1, R2, and R3 from `ORIGINAL_REQUEST.md`:

1. **Testing Setup (Vitest + React Testing Library)**:
   - Install devDependencies: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`.
   - Configure `vite.config.js` with `test: { environment: 'jsdom', setupFiles: './src/setupTests.js' }`.
   - Create `src/setupTests.js` importing `@testing-library/jest-dom`.

2. **Mutation Testing Setup (Stryker JS)**:
   - Install devDependencies: `@stryker-mutator/core`, `@stryker-mutator/vitest-runner`.
   - Create `stryker.config.mjs` configured to target frontend components and test files.
   - Goal: Achievable >70% mutation score on tested modules.

3. **Key Use Cases to Target for Testing**:
   - `App.jsx` & `Layout.jsx`: Route navigation, active link highlighting, layout rendering.
   - `InicioSesion.jsx` & `RegistroPaciente.jsx`: Form rendering, input presence, field accessibility.
   - `MatrizVisualAgenda.jsx` & `CatalogoServicios.jsx`: Rendering of appointment matrix slots, filter controls, service cards, and pricing details.
