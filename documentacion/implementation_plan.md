# 🛠️ Plan Técnico de Implementación - Fase 12: Seguridad Web por Path y Defensa en Profundidad

**Objetivo:** Implementar una arquitectura de seguridad integral enfocada en la capa de rutas (*paths*), transporte, autorización perimetral y particionado de código en Spring Boot 3 y React 18, bajo el principio de menor privilegio (*Defense-in-Depth*).

---

## 1. Resumen Ejecutivo y Arquitectura Objetivo

```
                                    ┌────────────────────────────────────────────────────────┐
                                    │                     CLIENTE WEB                        │
                                    │  - Lazy Loading (Módulos Clínicos/Admin aislados)       │
                                    │  - ProtectedRoute Guard (Redirección por Token/Rol)    │
                                    └───────────────────────────┬────────────────────────────┘
                                                                │ HTTPS /api/v1/...
                                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     SPRING BOOT 3 BACKEND                                  │
│                                                                                            │
│  [ CAPA 1: FIREWALL PERIMETRAL ]                                                           │
│  StrictHttpFirewall: Bloqueo de Matrix params (;), Slashes codificados (%2F), Traversal (..)│
│                                                                                            │
│  [ CAPA 2: CABECERAS Y CORS ]                                                              │
│  CORS con origen explícito (sin comodín * con credenciales) + Headers (CSP, FrameOptions) │
│                                                                                            │
│  [ CAPA 3: MATRIZ DE AUTORIZACIÓN POR PATH ]                                               │
│  /auth/**, /servicios (GET id), /citas/disponibilidad ──► permitAll()                      │
│  /servicios/todos ──────────────────────────────────────► hasRole('ADMIN')                 │
│  /historias-clinicas/** ────────────────────────────────► hasRole('DOCTORA')               │
│  /citas/**, /pacientes/** ──────────────────────────────► hasAnyRole('DOCTORA','SECRETARIA')│
│  Ruta residual ─────────────────────────────────────────► authenticated()                  │
│                                                                                            │
│  [ CAPA 4: MANEJO DE ERRORES RFC 7807 ]                                                    │
│  401 Unauthorized / 403 Forbidden devuelven ProblemDetail sin trazas ni rutas internas    │
└───────────────────────────┬────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   BASE DE DATOS & AUDITORÍA                                │
│  - entrada_hc_audit (clinical_entries_audit): Invariante inmutable de auditoría médica     │
│  - historia_clinica_audit: Invariante inmutable de auditoría anamnesis                     │
│  - Control transaccional @Transactional + Protección de concurrencia                       │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Base de Datos (Flyway, JPA, Índices e Invariantes)

### 2.1 Esquema e Índices (Estado Actual y Verificación)
* La base de datos ya cuenta con las estructuras y los índices necesarios en las migraciones Flyway:
  * `entrada_hc_audit`: `idx_entrada_audit_entry`, `idx_entrada_audit_user`, `idx_entrada_audit_date`.
  * `historia_clinica_audit`: `idx_hc_audit_record`, `idx_hc_audit_user`, `idx_hc_audit_date`.
* **No se requieren nuevas migraciones DDL ni alteraciones de tablas.** El esquema Flyway `V1` a `V6` se mantiene intacto y con máxima compatibilidad.

### 2.2 Invariante Crítico de Auditoría Médica (`clinical_entries_audit`)
* La protección perimetral de paths hacia `/historias-clinicas/**` y la normalización de peticiones **no deben interferir** con la extracción del usuario autenticado en `JwtAuthenticationFilter`.
* Las operaciones en `MedicalRecordService`:
  * `addClinicalEntry(request, physicianUserId)`
  * `updateClinicalEntry(entryId, newContent, physicianUserId)`
  deben continuar registrando cada mutación en la tabla `entrada_hc_audit` de forma automática e inmutable dentro de la misma transacción `@Transactional`.

### 2.3 Concurrencia y Bloqueos
* Las entidades clínicas y operativas mantienen sus invariantes de integridad y transaccionalidad sin relajar validaciones.

---

## 3. Backend (Spring Boot 3 / Spring Security 6)

### 3.1 Normalización de Paths con `StrictHttpFirewall`
* Configurar un Bean `HttpFirewall` en `SecurityConfig.java`:
  * Rechazar variables de matriz / *matrix parameters* (`;`).
  * Rechazar barras inclinadas dobles o codificadas (`%2F`, `%2f`, `\\`).
  * Rechazar puntos porcentuales codificados para evitar evasión de path traversal (`%2e`, `%2E`).
  * Rechazar caracteres de control o nulos (`%00`).

### 3.2 Cadena de Filtros de Seguridad (`SecurityFilterChain`)
* Reestructurar la política de autorización HTTP en `SecurityConfig.java`:
  1. **Endpoints Públicos de Autenticación:**
     * `.requestMatchers("/auth/**").permitAll()`
  2. **Endpoints Públicos de Paciente / Catálogo:**
     * `.requestMatchers(HttpMethod.GET, "/servicios", "/servicios/{id:[0-9]+}").permitAll()`
     * `.requestMatchers(HttpMethod.POST, "/citas/reservar-temporal").permitAll()`
     * `.requestMatchers(HttpMethod.GET, "/citas/disponibilidad").permitAll()`
     * `.requestMatchers(HttpMethod.GET, "/citas/{id:[0-9]+}/estado").permitAll()`
     * `.requestMatchers(HttpMethod.POST, "/chat/gemini").permitAll()`
     * `.requestMatchers(HttpMethod.POST, "/pagos/webhook").permitAll()`
  3. **Endpoints de Administración (Catálogo completo y gestión):**
     * `.requestMatchers("/servicios/todos", "/servicios/admin/**", "/admin/**").hasRole("ADMIN")`
  4. **Endpoints Clínicos de Alta Confidencialidad:**
     * `.requestMatchers("/historias-clinicas/**").hasRole("DOCTORA")`
  5. **Endpoints Compartidos de Staff (Agenda y Pacientes):**
     * `.requestMatchers("/citas/**", "/pacientes/**", "/bloqueos/**").hasAnyRole("DOCTORA", "SECRETARIA", "ADMIN")`
  6. **Regla de Cierre Perimetral (Default Deny):**
     * `.anyRequest().authenticated()`

### 3.3 Endurecimiento de CORS
* Modificar `corsConfigurationSource()` en `SecurityConfig.java`:
  * Eliminar el comodín global `configuration.setAllowedOriginPatterns(List.of("*"))` combinado con `allowCredentials(true)`.
  * Leer orígenes permitidos desde propiedades de entorno (`app.cors.allowed-origins`, por defecto `http://localhost:5173`, `http://localhost:3000`).
  * Exponer cabeceras específicas (`Authorization`).
  * Configurar métodos HTTP estrictos: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `OPTIONS`.

### 3.4 Cabeceras de Seguridad HTTP Web
* Agregar configuración de cabeceras en `SecurityFilterChain`:
  * `headers.frameOptions(f -> f.deny())`: Mitiga ataques de Clickjacking.
  * `headers.contentTypeOptions(Customizer.withDefaults())`: Evita sniffing de tipos MIME (`X-Content-Type-Options: nosniff`).
  * `headers.referrerPolicy(r -> r.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))`.
  * `headers.xssProtection(Customizer.withDefaults())`.

### 3.5 Manejo de Errores RFC 7807 (ProblemDetail) en la Capa de Seguridad
* Implementar `AuthenticationEntryPoint` (401) y `AccessDeniedHandler` (403) personalizados:
  * Retornar respuesta `application/problem+json` con estructura RFC 7807:
    * `type`: URI de referencia (`about:blank` o URL de error).
    * `title`: "No Autenticado" / "Acceso Denegado".
    * `status`: 401 / 403.
    * `detail`: Mensaje amigable para el cliente sin exponer trazas del framework ni rutas absolutas de servidor.
    * `timestamp`: Fecha y hora del evento.

### 3.6 Sanitización en Almacenamiento de Archivos (`SupabaseStorageAdapter`)
* En `uploadFile`, sanitizar la extracción de extensión:
  * Rechazar nombres de archivo con `..`, `/`, `\` o caracteres no alfanuméricos.
  * Generar estrictamente la clave del objeto como `{patientId}/{UUID}.{cleanExt}` sin preservar rutas relativas provistas por el cliente.

---

## 4. Frontend (React 18 / TypeScript / Vite)

### 4.1 Componente Guardián de Rutas (`ProtectedRoute.tsx`)
* Ubicación: `frontend/src/components/ProtectedRoute.tsx`
* Responsabilidades:
  1. Verificar si existe token válido en sesión (`localStorage.getItem('token')` o sesión de demo no anónima).
  2. Si no hay autenticación: redirigir a `/login` pasando `state: { from: location }` para retorno tras inicio de sesión exitoso.
  3. Si hay autenticación pero el rol actual (`localStorage.getItem('role')`) no figura en `allowedRoles`:
     * Redirigir a la ruta por defecto permitida (`/app/agenda` para secretaria, `/app/clinical` para doctora, `/app/admin` para admin).
     * Disparar notificación toast amigable: "No cuentas con permisos para acceder a esta sección".
  4. Si cumple los requisitos: renderizar `<Outlet />` o `children`.

### 4.2 Particionado de Código (*Code Splitting*) en `App.tsx`
* Migrar las importaciones estáticas de las vistas internas pesadas a `React.lazy()`:
  * `MedicalRecordView` (Módulo clínico confidencial).
  * `AdminServicesView` (Módulo de administración).
  * `AnalyticsDashboardView` (Módulo de analítica).
  * `AgendaView` y `EditAppointmentView`.
* Envolver las rutas en `<Suspense fallback={<LoadingSpinner />}>`.
* **Resultado:** Reducción del bundle principal de 832 kB, impidiendo que usuarios de la landing pública descarguen código de historias clínicas o administración.

### 4.3 Mapeo Seguro de Rutas en `App.tsx`
* Envolver `/app/*` en el guardián de autenticación general.
* Envolver sub-rutas específicas con sus roles correspondientes:
  * `/app/clinical` ──► `allowedRoles={['DOCTORA']}`
  * `/app/admin` ──► `allowedRoles={['ADMIN']}`
  * `/app/agenda`, `/app/booking` ──► `allowedRoles={['SECRETARIA', 'DOCTORA', 'ADMIN']}`

### 4.4 Ergonomía Táctil en Móvil y Esquemas Zod
* Los componentes de redirección, modales de advertencia y pantallas de carga deben preservar zonas táctiles mínimas de 48x48 px (`min-h-[48px]`, `min-w-[48px]`) y consistencia con la paleta de colores de la clínica (`teal` y `slate`).

---

## 5. Plan de Pruebas y Criterios de Aceptación

### 5.1 Pruebas Automatizadas Backend (JUnit 5 + MockMvc)
* Crear `SecurityPathAuthorizationTest.java`:
  1. `testPublicEndpoints_AllowedWithoutAuth`: GET `/api/v1/servicios`, GET `/api/v1/citas/disponibilidad` retornan 200 OK sin token.
  2. `testAdminEndpoint_DeniedForAnonymous`: GET `/api/v1/servicios/todos` retorna 401 Unauthorized para usuarios anónimos.
  3. `testAdminEndpoint_DeniedForSecretaria`: GET `/api/v1/servicios/todos` retorna 403 Forbidden para usuarios con rol `SECRETARIA`.
  4. `testClinicalEndpoints_DeniedForSecretaria`: GET `/api/v1/historias-clinicas/paciente/1` retorna 403 Forbidden con rol `SECRETARIA`.
  5. `testClinicalEndpoints_AllowedForDoctora`: GET `/api/v1/historias-clinicas/paciente/1` procede para rol `DOCTORA`.
  6. `testPathTraversal_RejectedByFirewall`: Solicitudes con `%2e%2e`, `;` o slashes maliciosos retornan error perimetral (400/Bad Request).
  7. `testRfc7807_ProblemDetailsFormat`: Las respuestas 401 y 403 presentan cabecera `Content-Type: application/problem+json` y campos `title`, `status`, `detail`.

### 5.2 Pruebas Automatizadas Frontend (TypeScript & Vite)
* Verificación estricta de tipos: `npx tsc --noEmit` sin errores.
* Construcción de bundle: `npm run build` con chunks particionados correctamente vía dynamic imports.

### 5.3 Verificación de Invariantes
* Ejecutar la suite completa de tests de aplicación existentes (`AuthServiceTest`, `AppointmentServiceTest`, `MedicalRecordServiceTest`, `PaymentServiceTest`, `AesEncryptionServiceTest`) garantizando 100% de éxito (`JAVA_HOME=/opt/homebrew/opt/openjdk@17 mvn test`).

---

## 6. Plan de Ejecución Paso a Paso

1. **Paso 1 (Backend - Seguridad de Rutas & Firewall):**
   * Actualizar `SecurityConfig.java` con `StrictHttpFirewall`, matchers específicos, cabeceras seguras, CORS y manejadores RFC 7807.
   * Sanitizar rutas en `SupabaseStorageAdapter.java`.
2. **Paso 2 (Backend - Suite de Tests de Seguridad):**
   * Crear `SecurityPathAuthorizationTest.java` para verificar todas las combinaciones de acceso por rol y path.
   * Ejecutar y validar con `JAVA_HOME=/opt/homebrew/opt/openjdk@17 mvn test`.
3. **Paso 3 (Frontend - Route Guards y Code Splitting):**
   * Crear `frontend/src/components/ProtectedRoute.tsx`.
   * Actualizar `frontend/src/App.tsx` para incorporar `ProtectedRoute`, `React.lazy` y `<Suspense>`.
   * Ajustar `DashboardLayout.tsx` para sincronización limpia de sesiones.
4. **Paso 4 (Frontend - Verificación y Build):**
   * Ejecutar `npx tsc --noEmit` y `npm run build` para asegurar código libre de errores de tipado y chunks optimizados.
5. **Paso 5 (Auditoría de Invariantes y Cierre):**
   * Comprobar la inmutabilidad de `clinical_entries_audit` y emitir informe final.

---
