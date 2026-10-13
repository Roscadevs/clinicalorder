# PLAN TÉCNICO DE IMPLEMENTACIÓN: FASE 24
## Formulario de Gestión, Alta y Edición de Tratamientos del Catálogo (Tarifas y Servicios)

---

## 1. Arquitectura y Persistencia de Datos

### 1.1. Base de Datos (PostgreSQL & JPA)
- **Tabla Existente:** `servicio`
  - `id BIGSERIAL PRIMARY KEY`
  - `name VARCHAR(100) NOT NULL UNIQUE`
  - `description VARCHAR(500)`
  - `duration_minutes INTEGER NOT NULL` (10 a 480 minutos)
  - `base_price NUMERIC(12,2) NOT NULL` (> 0)
  - `deposit_percentage INTEGER NOT NULL` (1 a 100%)
  - `follow_up_interval_days INTEGER NOT NULL DEFAULT 0` (>= 0)
  - `active BOOLEAN NOT NULL DEFAULT TRUE`
  - `created_at TIMESTAMP WITH TIME ZONE NOT NULL`
  - `updated_at TIMESTAMP WITH TIME ZONE NOT NULL`
- **Invariante de Precios:** Los precios acordados en citas ya agendadas (`agreed_price`) son inmutables; las actualizaciones de tarifas aplican exclusivamente a reservas futuras.
- **Contrato de Repositorio del Dominio:**
  - [`DermatologicServiceRepository.java`](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/backend/src/main/java/com/clinicadermatologica/app/domain/repository/DermatologicServiceRepository.java):
    - Declarar `boolean existsByNameAndIdNot(String name, Long id);` para validación de unicidad cruzada en edición.
- **Repositorio Spring Data JPA:**
  - [`JpaDermatologicServiceRepository.java`](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/jpa/JpaDermatologicServiceRepository.java):
    - Declarar query derivada: `boolean existsByNameAndIdNot(String name, Long id);`.
- **Adaptador de Persistencia:**
  - [`DermatologicServiceRepositoryAdapter.java`](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/adapter/DermatologicServiceRepositoryAdapter.java):
    - Implementar `existsByNameAndIdNot(String name, Long id)` delegando directamente a `jpaRepository.existsByNameAndIdNot(name, id)`.

---

## 2. Capa de Backend (Spring Boot 3 / Clean Architecture)

### 2.1. Capa de Aplicación (`DermatologicServiceService.java`)
- Ubicación: [`DermatologicServiceService.java`](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/backend/src/main/java/com/clinicadermatologica/app/application/service/DermatologicServiceService.java)
- Método `updateService(Long id, ServiceRequestDTO request)`:
  - Recuperar entidad existente por ID o arrojar `ResourceNotFoundException("Servicio no encontrado con ID " + id)`.
  - Evaluar unicidad excluyente:
    ```java
    if (serviceRepository.existsByNameAndIdNot(request.getName(), id)) {
        throw new BusinessRuleException("Ya existe otro tratamiento registrado con el nombre " + request.getName());
    }
    ```
  - Actualizar campos (`name`, `description`, `durationMinutes`, `basePrice`, `depositPercentage`, `followUpIntervalDays`, `active` si no es nulo).
  - Persistir y retornar `ServiceResponseDTO`.
- Transaccionalidad: `@Transactional` para escritura y `@Transactional(readOnly = true)` para lecturas.
- Excepciones RFC 7807: `BusinessRuleException` genera respuesta HTTP 400 Bad Request estructurada según RFC 7807 (`ProblemDetail`) procesada por `GlobalExceptionHandler`.

### 2.2. Suite de Pruebas Unitarias Backend
- Ubicación: `backend/src/test/java/com/clinicadermatologica/app/...`
- Cobertura con JUnit 5 y Mockito (114 tests en suite total, 0 fallos):
  - `DermatologicServiceServiceTest`:
    1. `createService_Success`: Creación exitosa de un nuevo tratamiento cuando el nombre no existe.
    2. `createService_DuplicateName_ThrowsException`: Arroja `BusinessRuleException` si ya existe un servicio con ese nombre.
    3. `createService_InactiveAndNullFollowUp_DefaultsCorrectly`: Creación de servicio inactivo con `followUpIntervalDays` nulo defaulteado defensivamente a 0.
    4. `updateService_Success`: Actualización exitosa manteniendo o modificando campos con nombre válido.
    5. `updateService_DuplicateName_ThrowsException`: Arroja `BusinessRuleException` si el nuevo nombre colisiona con otro servicio existente (`existsByNameAndIdNot` retorna true).
    6. `updateService_SameName_Success`: Actualización exitosa conservando el mismo nombre del servicio actual.
    7. `updateService_DeactivateAndNullFollowUp_Success`: Actualización desactivando tratamiento y saneando días de control nulos.
    8. `updateService_NotFound_ThrowsException`: Arroja `ResourceNotFoundException` si el ID no existe.
    9. `getAllActiveServices_ReturnsActiveOnly`: Retorna únicamente tratamientos marcados como activos.
    10. `getAllServicesForAdmin_ReturnsAll`: Retorna todos los tratamientos (activos e inactivos).
    11. `getServiceById_Success`: Recupera correctamente el servicio por identificador.
  - `DermatologicServiceRepositoryAdapterTest`:
    - Verifica delegación directa hacia `JpaDermatologicServiceRepository` en `findById`, `findByName`, `findAllActive`, `findAll`, `save`, `existsByName`, y `existsByNameAndIdNot`.
  - `ServiceCatalogControllerTest`:
    - Cobertura de endpoints REST `/servicios` (200 OK), `/servicios/todos` (200 OK), `/servicios/{id}` (200 OK), `POST /servicios` (201 CREATED) y `PUT /servicios/{id}` (200 OK).
  - `GlobalExceptionHandlerTest`:
    - Valida respuestas uniformes con MediaType `application/problem+json` (RFC 7807) para `BusinessRuleException`, `ResourceNotFoundException` y `MethodArgumentNotValidException` (con desglose amigable en campo `detail` y mapa `details`).

---

## 3. Capa de Frontend (React 18 / TypeScript / Tailwind CSS)

### 3.1. Formulario Modal de Tratamientos (`ServiceFormModal.tsx`)
- Ubicación: [`ServiceFormModal.tsx`](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/frontend/src/features/admin/ServiceFormModal.tsx)
- **Captura y Despliegue de Errores RFC 7807:**
  - Extraer de forma resiliente el detalle del servidor:
    `const serverMsg = err?.response?.data?.detail || err?.response?.data?.message || err?.message;`
  - Mostrar en componente `Callout` con intent `error`.
- **Ergonomía Táctil y Accesibilidad Móvil:**
  - Garantizar altura mínima de 44px (`min-h-[44px]`) en todos los inputs, textarea y botones de envío y cancelación.
- **Atajos Rápidos y Plantillas de Tratamientos Comunes:**
  - Proveer botones de selección rápida solo disponibles en modo creación (o accesibles como sugerencia):
    1. *Consulta Dermatológica*: Duración 30m, Base $30.000 ARS, Seña 50%, Control 0 días.
    2. *Peeling Químico Facial*: Duración 45m, Base $45.000 ARS, Seña 50%, Control 21 días.
    3. *Toxina Botulínica*: Duración 45m, Base $120.000 ARS, Seña 50%, Control 15 días.
    4. *Relleno Ácido Hialurónico*: Duración 60m, Base $150.000 ARS, Seña 50%, Control 30 días.
    5. *Limpieza Profunda e Hidratación*: Duración 60m, Base $35.000 ARS, Seña 50%, Control 30 días.
  - Al hacer clic en un atajo, autocompletar automáticamente el formulario.

### 3.2. Panel de Administración de Servicios (`AdminServicesView.tsx`)
- Ubicación: [`AdminServicesView.tsx`](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/frontend/src/features/admin/AdminServicesView.tsx)
- **Diálogo Modal de Confirmación Segura:**
  - Añadir estado `serviceToToggle: DermatologicService | null`, `togglingService: boolean` y `serviceToggleError: string | null`.
  - Reemplazar la conmutación inmediata y alertas bloqueantes `alert()` por la apertura del diálogo de confirmación y feedback amigable con `Callout`.
  - Si el tratamiento está activo (se va a suspender):
    - Alerta informativa advirtiendo que los pacientes ya no podrán reservarlo en la web ni mediante el chatbot con IA.
  - Si el tratamiento está inactivo (se va a reactivar):
    - Mensaje de confirmación para reincorporar el tratamiento al catálogo público.
  - Botón de confirmación con estado de carga `togglingService` y touch target $\ge 44$ px.

### 3.3. Modal de Cobro de Saldo (`CollectBalanceModal.tsx`)
- Ubicación: [`CollectBalanceModal.tsx`](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/frontend/src/features/agenda/CollectBalanceModal.tsx)
- Verificar touch targets $\ge 44$ px en selectores de métodos de pago y botones de acción.
- Parsing de errores RFC 7807 (`err?.response?.data?.detail || err?.response?.data?.message || err?.message`).

---

## 4. Suite de Pruebas y Criterios de Aceptación

### 4.1. Backend (JUnit 5 & Mockito)
- Compilación y ejecución de tests unitarios:
  `mvn test` en directorio `backend`.
- Todos los tests deben pasar con código de salida 0.

### 4.2. Frontend (TypeScript & Vite)
- Verificación de tipos y empaquetado de producción:
  `npm run build && npx tsc --noEmit` en directorio `frontend`.
- Ausencia de errores de compilación o de tipado TypeScript.

---

## 5. Auditoría de Invariantes del Repositorio
- Conservar intacta la anotación `@Version` en todas las entidades JPA tocadas.
- No modificar ni alterar registros de auditoría médica (`clinical_entries_audit`).
- Formato uniforme de errores bajo el estándar RFC 7807 (`ProblemDetail`).
- Prohibición estricta de scripts Flyway destructivos (`DROP COLUMN`, `DROP TABLE`).
- Sincronización del grafo de conocimiento: `graphify update . && graphify export obsidian`.
- Actualización de estado en `CHANGELOG_PRDS.md`.
