# Plan Técnico de Implementación - Fase 20: Edición y Gestión Integral de Pacientes

**Fecha:** 2026-10-12  
**Documento de Especificación:** [PRD_Fase_20_Edicion_Y_Gestion_Pacientes.md](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/documentacion/historial_prds/PRD_Fase_20_Edicion_Y_Gestion_Pacientes.md)  
**Estado:** EN ESPERA DE APROBACIÓN (Fase 3)  

---

## 1. Arquitectura y Modelo de Datos (Base de Datos & JPA)

### 1.1. Tablas y Restricciones (Flyway)
- **Tabla afectada:** `paciente` (definida en [V4__schema_redesign.sql](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/backend/src/main/resources/db/migration/V4__schema_redesign.sql#L64-L78)).
- **Restricciones activas:**
  - `dni VARCHAR(8) NOT NULL UNIQUE CHECK (dni ~ '^[0-9]{7,8}$')`
  - `email VARCHAR(100) NOT NULL UNIQUE`
  - `phone VARCHAR(20) NOT NULL UNIQUE`
  - `active BOOLEAN NOT NULL DEFAULT TRUE`
- **Integridad referencial y bajas:** No se ejecutan migraciones DDL nuevas. La baja es estrictamente lógica (`active = false`), garantizando que las foreign keys restrictivas desde `cita` (`ON DELETE RESTRICT`) e `historia_clinica` (`ON DELETE RESTRICT`) permanezcan íntegras y sin violaciones referenciales.
- **Invariante de auditoría:** Se verifica que la tabla `clinical_entries_audit` no sea afectada por modificaciones en datos de filiación del paciente.

### 1.2. Dominio y Repositorios JPA
- **Entidad:** [Patient.java](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/backend/src/main/java/com/clinicadermatologica/app/domain/model/Patient.java) preservando `@Version` para concurrencia optimista.
- **Contrato de Repositorio:** [PatientRepository.java](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/backend/src/main/java/com/clinicadermatologica/app/domain/repository/PatientRepository.java):
  - Añadir método `boolean existsByEmailAndIdNot(String email, Long id)`
  - Añadir método `boolean existsByPhoneAndIdNot(String phone, Long id)`
- **Adaptador e Implementación Spring Data JPA:**
  - [JpaPatientRepository.java](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/jpa/JpaPatientRepository.java): Definir las firmas de métodos derivados de Spring Data.
  - [PatientRepositoryAdapter.java](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/adapter/PatientRepositoryAdapter.java): Delegar la invocación al repositorio JPA subyacente.

---

## 2. Capa Backend (Spring Boot 3)

### 2.1. Servicio de Aplicación (`PatientService.java`)
- **Modificación en `updatePatient(Long id, PatientRequestDTO request)`:**
  1. Recuperar la entidad por ID (`findById`). Si no existe, lanzar `ResourceNotFoundException("Paciente no encontrado con ID " + id)`.
  2. Validar colisión de email: `if (patientRepository.existsByEmailAndIdNot(request.getEmail(), id))` $\rightarrow$ lanzar `BusinessRuleException("Ya existe otro paciente registrado con el correo " + request.getEmail())`.
  3. Validar colisión de teléfono: `if (patientRepository.existsByPhoneAndIdNot(request.getPhone(), id))` $\rightarrow$ lanzar `BusinessRuleException("Ya existe otro paciente registrado con el teléfono " + request.getPhone())`.
  4. Actualizar campos demográficos permitidos: `name`, `phone`, `email`, `birthDate`.
  5. Preservar `dni` inmutable (o verificar que coincida con el existente).
  6. Guardar la entidad y retornar `PatientResponseDTO` mapeado.
- **Método `deactivatePatient(Long id)`:**
  1. Recuperar la entidad por ID.
  2. Asignar `patient.setActive(false)`.
  3. Persistir y confirmar el soft-delete.

### 2.2. Controlador REST (`PatientController.java`)
- **Endpoint `PUT /api/v1/pacientes/{id}`:**
  - `@PreAuthorize("hasAnyRole('DOCTORA', 'SECRETARIA', 'ADMIN')")`
  - Validar request body con `@Valid @RequestBody PatientRequestDTO request`.
  - Retornar `HttpStatus.OK` con `PatientResponseDTO`.
- **Endpoint `DELETE /api/v1/pacientes/{id}`:**
  - `@PreAuthorize("hasAnyRole('DOCTORA', 'SECRETARIA', 'ADMIN')")`
  - Invocar `patientService.deactivatePatient(id)`.
  - Retornar `HttpStatus.NO_CONTENT` (HTTP 204).
- **Manejo de Errores RFC 7807:**
  - Las excepciones `BusinessRuleException` y `ResourceNotFoundException` son capturadas por [GlobalExceptionHandler.java](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/backend/src/main/java/com/clinicadermatologica/app/presentation/advice/GlobalExceptionHandler.java), retornando `ProblemDetail` con código 400/404/409 sin filtrar stack traces.

---

## 3. Capa Frontend (React 18 / TypeScript)

### 3.1. Cliente de API (`patientsApi` en `src/services/api.ts`)
- **Implementar método `updatePatient`:**
  - Firma: `updatePatient: async (id: number, patient: Partial<Patient>): Promise<Patient>`
  - Llamada HTTP: `PUT /pacientes/${id}` enviando el payload sanitizado.
  - Modo demo: actualizar el registro en `demo_patients` de `localStorage`.
  - Invalidador: Limpiar caché en memoria `patientSearchCache.clear()`.
- **Implementar método `deactivatePatient`:**
  - Firma: `deactivatePatient: async (id: number): Promise<void>`
  - Llamada HTTP: `DELETE /pacientes/${id}`.
  - Modo demo: marcar `active: false` en `localStorage`.
  - Invalidador: Limpiar `patientSearchCache.clear()`.

### 3.2. Formulario Dual (`PacienteForm.tsx`)
- **Interfaz de Props extendida:**
  ```typescript
  export interface PacienteFormProps {
    patient?: Patient; // Si está definido -> MODO EDICIÓN
    onSuccess?: (patient: Patient) => void;
    onCancel?: () => void;
    initialQuery?: string;
    showHeader?: boolean;
    className?: string;
  }
  ```
- **Comportamiento en Modo Edición (`patient !== undefined`):**
  - Inicializar `useForm` con los datos del paciente (`name`, `dni`, `phone`, `email`, `birthDate`).
  - Campo DNI: Renderizar con atributo `disabled={isEditMode}`, estilo visual atenuado y badge aclaratorio: *"Identificador civil inmutable"*.
  - Título y textos: Cabecera *"Modificar datos del paciente"*, subtítulo *"Actualizá la información de contacto y filiación"*, botón principal *"Guardar cambios"*.
  - Al enviar: invocar `patientsApi.updatePatient(patient.id, sanitizedData)`.
- **Comportamiento en Modo Alta (`patient === undefined`):**
  - Mantiene intacto el flujo actual de creación (`patientsApi.createPatient`).

### 3.3. Integración en `PatientDirectoryView.tsx`
- En la tarjeta del paciente seleccionado ([PatientDirectoryView.tsx#L76-L91](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/frontend/src/features/clinical/PatientDirectoryView.tsx#L76-L91)):
  - Agregar botón de acción *"Editar"* (ícono `Pencil`) $\rightarrow$ abre `Modal` con `PacienteForm` en modo edición.
  - Agregar botón *"Desactivar"* (ícono `UserX` o `Trash2`, variante fantasma/peligro) $\rightarrow$ abre diálogo de confirmación de baja lógica.
  - Al confirmar baja: invocar `deactivatePatient(selected.id)`, emitir toast de éxito y deseleccionar paciente (`setSelected(null)`).
  - Al guardar edición: actualizar el estado `selected` con la respuesta y refrescar la búsqueda.

### 3.4. Integración en `MedicalRecordView.tsx`
- En la cabecera clínica del paciente ([MedicalRecordView.tsx#L200-L215](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/frontend/src/features/clinical/MedicalRecordView.tsx#L200-L215)):
  - Incorporar botón compacto *"Editar datos"* junto a la información de contacto.
  - Abrir modal de edición para que la médica pueda corregir teléfono o email en tiempo real si el paciente lo manifiesta durante la sesión.

### 3.5. Ergonomía Táctil y Mobile
- Botones de acción táctiles con `min-h-[44px]` y espaciado adaptado a pulgares.
- Modales responsivos con cierre claro y foco automático.

---

## 4. Suite de Pruebas y Verificación

### 4.1. Backend (JUnit 5 & Mockito)
- **Archivo:** `backend/src/test/java/com/clinicadermatologica/app/application/PatientServiceTest.java`
- **Casos de prueba a incluir/verificar:**
  1. `updatePatient_Success`: Actualiza datos demográficos y valida DTO resultante.
  2. `updatePatient_NotFound_ThrowsException`: Lanza `ResourceNotFoundException` ante ID inexistente.
  3. `updatePatient_EmailCollision_ThrowsBusinessRuleException`: Verifica que arroje error si el email pertenece a otro paciente.
  4. `updatePatient_PhoneCollision_ThrowsBusinessRuleException`: Verifica que arroje error si el teléfono pertenece a otro paciente.
  5. `deactivatePatient_Success`: Verifica que el flag `active` pase a `false`.
- **Ejecución autónoma:** `cd backend && mvn test -Dtest=PatientServiceTest`

### 4.2. Frontend (Compilación y Tipos)
- Ejecución de chequeo estricto TypeScript: `cd frontend && npx tsc --noEmit`
- Verificación del empaquetado de producción: `cd frontend && npm run build`
