# Fase 11: Landing Page Pública y Enrutamiento (React Router)

## Introducción
Para poder ofrecer el sistema al público general (pacientes) sin comprometer la vista de gestión interna (dashboard), la Fase 11 introduce **React Router v6** a la arquitectura del Frontend. Esto permite separar las experiencias y controlar la visibilidad de los componentes estructurales (como las barras de navegación).

## Cambios Implementados

### 1. Migración a `react-router-dom`
Anteriormente, la aplicación principal (`App.tsx`) delegaba la renderización de vistas utilizando un estado reactivo simple (`currentTab`). 
Con esta fase, se envolvió la aplicación en un `<BrowserRouter>` y se definieron rutas estáticas y dinámicas.

### 2. Vistas Públicas
- **Landing Page (`/`)**: Actúa como portal institucional de la Clínica. Combina una sección "Hero" destacando el valor médico y un listado de servicios destacados (Dermatología Clínica, Estética Médica y Tecnología Láser). Su función primordial es derivar tráfico hacia el Wizard de Reservas.
- **Login (`/login`)**: Un formulario estandarizado de acceso para personal de la clínica.
- **Recuperación de Contraseña (`/recover-password`)**: Flujo sencillo para blanquear claves.

### 3. Aislamiento del Dashboard
Se creó el `DashboardLayout.tsx`. Todas las herramientas de uso interno:
- Barra superior (`Navbar`)
- Barra inferior táctil (`BottomNav`)
- Agendas, Historias Clínicas, Tarifas y Métricas

Se han recluido bajo el prefijo de ruta `/app`. De este modo, los pacientes navegando la Landing Page o el flujo de reservas no experimentan el "ruido visual" de herramientas administrativas.
