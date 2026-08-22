# 📄 Product Requirements Document (PRD) - v11.0
**Fase 11: Landing Page Pública, Enrutamiento y Control de Acceso (Login)**

## 1. Visión General
Esta fase introduce la separación estructural entre la cara pública de la clínica (pacientes) y el panel interno de gestión (staff médico y administrativo) mediante la implementación de enrutamiento del lado del cliente (`react-router-dom`).

Se incorpora una **Landing Page** comercial y un flujo de **Autenticación (Login)** para el staff, sumado a una interfaz de **Recuperación de Contraseñas**.

## 2. Objetivos de Negocio (Business Goals)
1. **Separación de Contextos:** Aislar la experiencia del paciente (orientada a la conversión y reserva) de la herramienta de gestión clínica (orientada a la operatividad diaria).
2. **Presencia Institucional:** Proveer un portal público (Landing Page) que comunique la propuesta de valor y los servicios destacados de la clínica.
3. **Seguridad UX:** Proveer un punto de acceso explícito y reservado para el personal autorizado, fortaleciendo la percepción de privacidad y seguridad del sistema.

## 3. Requisitos Funcionales
1. **Migración a React Router:**
   - Reemplazar la renderización condicional basada en estados por enrutamiento basado en URL (`react-router-dom`).
   - Soportar las rutas `/`, `/login`, `/recover-password`, `/book` y `/app/*`.
2. **Landing Page (`/`):**
   - Debe exhibir una sección 'Hero' con propuesta de valor y un Call to Action (CTA) principal apuntando hacia el flujo de reserva de turnos (`/book` o embebido).
   - Debe detallar los servicios principales (Dermatología Clínica, Estética Médica, Tecnología Láser).
   - Debe incluir un enlace discreto de "Staff Login" en el encabezado/pie de página.
3. **Módulo de Autenticación (`/login` y `/recover-password`):**
   - Interfaz de Login exigiendo correo y contraseña.
   - Interfaz de Recuperación exigiendo correo para envío de enlace de reseteo.
4. **Dashboard Layout (`/app`):**
   - Envolver las vistas internas (Agenda, Clínica, Admin, Analytics) dentro de un layout que contiene la barra de navegación superior e inferior.
   - Ocultar estas barras de navegación en las rutas públicas.

## 4. Requisitos No Funcionales (Ergonomía y UI)
- **Consistencia de Marca:** Se debe preservar la paleta de colores corporativa (`teal` y `slate`).
- **Mobile-First:** Las nuevas pantallas deben mantener la adaptabilidad y el confort táctil para smartphones (zonas de toque de mínimo 48x48 px).

## 5. Diseño Arquitectónico (Cambios)
- **`App.tsx`**: Configurado como enrutador principal (`<Routes>`).
- **`DashboardLayout.tsx`**: Nuevo componente contenedor (Wrapper) que maneja el Outlet de las sub-rutas protegidas.
- **`LandingPageView.tsx`**, **`LoginView.tsx`**, **`PasswordRecoveryView.tsx`**: Vistas exclusivas de la capa pública.

## 6. Criterios de Aceptación
- [x] Navegar a `/` despliega la Landing Page.
- [x] El botón de "Agendar Turno" dirige correctamente al flujo de `BookingWizard`.
- [x] Acceder a `/login` permite ver el formulario de acceso y dirigir a `/app` tras simular ingreso.
- [x] La barra de navegación inferior (`BottomNav`) **no** es visible en `/`, `/login` ni `/recover-password`.
