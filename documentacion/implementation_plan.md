# Plan Técnico de Implementación - Fase 26: Persistencia Real de Pacientes en Supabase, Desbloqueo del Directorio y Resiliencia ante Cold Starts

**Rama de Trabajo:** `formularios`  
**Objetivo:** Eliminar el modo demo silencioso y el swallowing de errores en el registro de pacientes, extender la tolerancia a arranques en frío (cold starts) de Render en la autenticación, desbloquear la ruta `/app/patients` para todo el personal operativo y garantizar que el 100% de los pacientes dados de alta impacten de forma real en la base de datos de producción (Supabase PostgreSQL).

---

## 1. Arquitectura y Base de Datos (JPA & Supabase)

### 1.1. Esquema Relacional e Invariantes
- **Tabla Destino:** `public.paciente` (creada y versionada por Flyway en `V4__schema_redesign.sql` y `V5__seed_updated_data.sql`).
- **Campos Persistidos:** `id` (BIGINT PK autoincremental), `name` (VARCHAR(100)), `dni` (VARCHAR(8) UNIQUE), `phone` (VARCHAR(20) UNIQUE), `email` (VARCHAR(100) UNIQUE), `birth_date` (DATE), `active` (BOOLEAN DEFAULT TRUE), `created_at` (TIMESTAMP DEFAULT NOW()).
- **Invariante de Auditoría Clínica:** Preservar intactas las tablas de auditoría `entrada_hc_audit` e `historia_clinica_audit`. Ninguna operación de pacientes debe violar los disparadores ni la integridad referencial clínica.
- **Invariante de Concurrencia Optimista:** Preservar la anotación `@Version` en la entidad `Appointment` (`cita`) para evitar condiciones de carrera en la asignación de turnos.
- **Acción en Base de Datos:** Ninguna modificación destructiva ni nueva migración DDL requerida; el esquema de Supabase soporta íntegramente las altas requeridas.

---

## 2. Backend (Spring Boot 3 / Clean Architecture)

### 2.1. Endpoints de Pacientes (`/api/v1/pacientes`)
- **Controlador:** [`PatientController.java`](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/backend/src/main/java/com/clinicadermatologica/app/presentation/controller/PatientController.java)
  - `POST /api/v1/pacientes`: `@PreAuthorize("hasAnyRole('DOCTORA', 'SECRETARIA', 'ADMIN')")`.
  - Entrada: `@Valid @RequestBody PatientRequestDTO`.
  - Retorno: `HTTP 201 Created` con `PatientResponseDTO`.
- **Servicio Transaccional:** [`PatientService.java`](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/backend/src/main/java/com/clinicadermatologica/app/application/service/PatientService.java)
  - Anotado con `@Transactional`.
  - Valida unicidad de DNI (`existsByDni`) y Email (`existsByEmail`).
  - Lanza `BusinessRuleException` si hay colisión, transformado por `GlobalExceptionHandler` en `ProblemDetail` (RFC 7807) con código HTTP 400/409.

---

## 3. Frontend (React 18 / TypeScript / Tailwind CSS)

### 3.1. Resiliencia de Red y Eliminación de Modo Demo Ciego (`api.ts`)
- **Archivo:** [`frontend/src/services/api.ts`](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/frontend/src/services/api.ts)
- **Cambios Requeridos:**
  1. **Timeout diferenciado para Autenticación:** Configurar que las llamadas de login toleren hasta 60 segundos (`timeout: 60000`) para esperar que Render despierte de su suspensión por inactividad.
  2. **Eliminar el Swallowing en `patientsApi.createPatient`:**
     - Suprimir el bloque `catch` que capturaba fallos de red y guardaba en `localStorage('demo_patients')`.
     - Si la petición falla, relanzar el error (`throw err`) para que la interfaz muestre el error RFC 7807 real devuelto por el backend.
  3. **Invalidador de Caché:** Limpiar `patientSearchCache` tras cada alta o modificación exitosa para forzar la consulta en vivo a Supabase.

### 3.2. Pantalla de Inicio de Sesión Honesta (`LoginView.tsx`)
- **Archivo:** [`frontend/src/features/auth/LoginView.tsx`](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/frontend/src/features/auth/LoginView.tsx)
- **Cambios Requeridos:**
  1. **Eliminar la asignación de tokens falsos:** Quitar la inyección de `demo-token-12345` ante errores de conexión.
  2. **Feedback visual de arranque en frío:** Cuando la petición supera los 3 segundos, desplegar un mensaje dinámico: *"Despertando servidor en la nube, por favor aguarde unos segundos..."*.
  3. **Gestión de Errores Reales:** Mostrar el mensaje de error correspondiente (credenciales inválidas o servidor no disponible) mediante el Callout/AlertCircle sin redireccionar a `/app/agenda`.

### 3.3. Desbloqueo y Enrutamiento del Directorio de Pacientes
- **Configuración de Navegación ([`navConfig.ts`](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/frontend/src/components/navConfig.ts)):**
  - Añadir la pestaña `patients` a `NAV_TABS`:
    ```typescript
    {
      id: 'patients',
      label: 'Directorio de Pacientes',
      shortLabel: 'Pacientes',
      icon: 'Users',
      path: '/app/patients',
      roles: ['SECRETARIA', 'DOCTORA', 'ADMIN'],
    }
    ```
- **Enrutador Principal ([`App.tsx`](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/frontend/src/App.tsx)):**
  - Incorporar la ruta protegida:
    ```tsx
    <Route
      path="patients"
      element={
        <ProtectedRoute allowedRoles={['SECRETARIA', 'DOCTORA', 'ADMIN']}>
          <PatientDirectoryView />
        </ProtectedRoute>
      }
    />
    ```
- **Vista de Directorio ([`PatientDirectoryView.tsx`](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/frontend/src/features/clinical/PatientDirectoryView.tsx)):**
  - Conectar el botón "Nuevo Paciente" para abrir `<PacienteForm>` en un modal accesible.
  - Asegurar refresco reactivo del listado al confirmar el alta.
  - Ergonomía táctil para móviles (touch targets $\ge 44$ px).

### 3.4. Alta Médica Rápida en Consulta (`MedicalRecordView.tsx`)
- **Archivo:** [`frontend/src/features/clinical/MedicalRecordView.tsx`](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/frontend/src/features/clinical/MedicalRecordView.tsx)
- **Cambios Requeridos:**
  - En la barra de búsqueda de pacientes (línea 115), reemplazar `onAddNew={() => undefined}` por la apertura del modal con `<PacienteForm>`.
  - Al completar el alta exitosamente, seleccionar automáticamente al nuevo paciente e iniciar su ficha médica.

---

## 4. Matriz de Verificación y Pruebas Requeridas

1. **Backend Unit Testing:**
   - Ejecutar en `backend/`: `JAVA_HOME=/opt/homebrew/opt/openjdk@17 mvn test`.
   - Verificar que los 129 tests sigan pasando al 100% sin fallos ni regresiones.
2. **Frontend Type Checking & Build:**
   - Ejecutar en `frontend/`: `npm run build` o `npx tsc --noEmit`.
   - Garantizar 0 errores de TypeScript y compilación de producción exitosa en Vite.
3. **Prueba de Persistencia End-to-End:**
   - Validar que un alta enviada a `/api/v1/pacientes` retorne HTTP 201 y devuelva la tupla persistida en PostgreSQL.
