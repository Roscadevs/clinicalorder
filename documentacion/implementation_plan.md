# PLAN TÉCNICO DE IMPLEMENTACIÓN: FASE 22
## Formulario de Nueva Nota de Evolución Clínica (Atención Médica en Consulta)

---

## 1. Arquitectura y Persistencia de Datos

### 1.1. Base de Datos (PostgreSQL & Flyway)
- **Tabla:** `entrada_historia_clinica` (creada en Flyway `V4__create_initial_schema.sql`).
- **Esquema:**
  - `id BIGSERIAL PRIMARY KEY`
  - `paciente_id BIGINT NOT NULL REFERENCES paciente(id)`
  - `cita_id BIGINT NOT NULL REFERENCES cita(id)`
  - `usuario_medico_id BIGINT NOT NULL REFERENCES usuario(id)`
  - `contenido_cifrado BYTEA NOT NULL` (cifrado con AES-256-GCM)
  - `created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()`
  - `updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()`
- **Tabla de Auditoría Inmutable:** `clinical_entries_audit` / `entrada_hc_audit`.
- **Estrategia Flyway:** No se requieren modificaciones DDL en esta fase.

---

## 2. Capa de Backend (Spring Boot 3 / Clean Architecture)

### 2.1. Endpoints y Resiliencia en `MedicalRecordController`
- **Ruta:** `POST /api/v1/historias-clinicas/entradas`
- **Controlador:** [`MedicalRecordController.java`](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/backend/src/main/java/com/clinicadermatologica/app/presentation/controller/MedicalRecordController.java)
- **Anotación de Seguridad:** `@PreAuthorize("hasRole('DOCTORA')")`
- **Mejora Defensiva:**
  - Hacer `@RequestParam(required = false) Long physicianUserId` opcional en el controlador, con resolución de respaldo mediante `Authentication.getName()` y `userRepository.findByUsername(...)` en caso de que el cliente HTTP no envíe el parámetro explícito en la URL.
- **DTOs:**
  - [`ClinicalEntryRequestDTO.java`](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/backend/src/main/java/com/clinicadermatologica/app/presentation/dto/ClinicalEntryRequestDTO.java): `@NotNull Long appointmentId`, `@NotBlank String content`.
  - [`ClinicalEntryResponseDTO.java`](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/backend/src/main/java/com/clinicadermatologica/app/presentation/dto/ClinicalEntryResponseDTO.java): retorna texto descifrado en claro para consumo exclusivo de la médica autenticada.

### 2.2. Servicio de Aplicación (`MedicalRecordService`)
- Método `addClinicalEntry(ClinicalEntryRequestDTO request, Long physicianUserId)`:
  - Valida existencia del turno `Appointment` y del usuario médico `User`.
  - Deriva el `Patient` directamente desde la relación del turno para garantizar consistencia relacional.
  - Cifra el contenido clínico mediante `AesEncryptionService.encrypt(...)`.
  - Persiste la entidad `ClinicalEntry` y mapea a `ClinicalEntryResponseDTO` enriquecido con el nombre del servicio del turno (`serviceName`).

---

## 3. Capa de Frontend (React 18 / TypeScript / Tailwind CSS)

### 3.1. Formulario Modal: `NewClinicalNoteModal.tsx` *(Nuevo Componente)*
- **Ubicación:** `frontend/src/features/clinical/NewClinicalNoteModal.tsx`
- **Contrato de Props:**
  ```typescript
  interface NewClinicalNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    patient: Patient;
    appointments: Appointment[];
    onSaved: (entry: ClinicalEntry) => void;
  }
  ```
- **Campos del Formulario:**
  1. **Selector de Turno / Sesión:**
     - Menú desplegable (`Select`) con los turnos del paciente formateados (Fecha, Hora y Nombre del Servicio).
     - Preselección automática del turno más reciente.
     - Si el paciente no posee turnos confirmados, muestra advertencia clara.
  2. **Área de Texto de Evolución:**
     - `Textarea` multilínea amplio con validación de al menos 10 caracteres.
     - Contador de caracteres reactivo.
  3. **Plantillas Rápidas Clínicas (Atajos de Consulta):**
     - Botones tipo "chip" para insertar texto base común con un clic:
       - *Toxina Botulínica*: "Aplicación de toxina botulínica en tercio superior (...U). Buena tolerancia. Control en 15 días."
       - *Peeling Químico*: "Sesión de peeling (...%). Exposición ... minutos. Neutralizado. Se indica FPS 50+ cada 3 hs."
       - *Ácido Hialurónico*: "Relleno con ácido hialurónico con cánula en zona (...). Anestesia tópica. Sin hematomas inmediatos."
- **Feedback:**
  - Alerta de error mediante `Callout intent="error"` ante respuestas HTTP 400/409/500.
  - Botón "Guardar evolución" con spinner `isLoading={saving}`.

### 3.2. Integración en `MedicalRecordView.tsx`
- **Ubicación:** `frontend/src/features/clinical/MedicalRecordView.tsx`
- **Cambios:**
  - En la pestaña `section === 'notas'`:
    - Incorporar botón en el encabezado:
      ```tsx
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-display font-bold text-sand-900">Notas clínicas</h3>
          <p className="text-xs text-sand-500">Historial de evoluciones médicas y tratamientos realizados.</p>
        </div>
        {isMedicalStaff() && (
          <Button onClick={() => setNewNoteOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
            Nueva nota de evolución
          </Button>
        )}
      </div>
      ```
    - Apertura reactiva de `NewClinicalNoteModal`.
    - Al guardar:
      ```tsx
      onSaved={(newEntry) => {
        setEntries((prev) => [newEntry, ...prev]);
        toast.success('Nota de evolución registrada con éxito');
      }}
      ```

### 3.3. Cliente API (`services/api.ts`)
- Asegurar que `clinicalApi.addClinicalEntry` pase un fallback seguro de `physicianUserId` utilizando `currentUserId() ?? 2` y capture respuestas correctamente.

---

## 4. Pruebas y Plan de Verificación

### 4.1. Suite de Pruebas Backend (JUnit 5 & Mockito)
- Ejecutar pruebas en `MedicalRecordServiceTest.java`:
  - `testAddClinicalEntry_EncryptsContent` (verifica cifrado de bytes).
  - Escenarios de excepciones (turno no encontrado).
- Comando:
  ```bash
  JAVA_HOME=/opt/homebrew/opt/openjdk@17 mvn test
  ```

### 4.2. Suite de Verificación Frontend
- Compilación y tipado estricto:
  ```bash
  cd frontend && npm run build && npx tsc --noEmit
  ```

### 4.3. Auditoría de Invariantes
- Verificar que el contenido persista cifrado con AES-256-GCM.
- Comprobar que cualquier edición posterior siga generando registros en `clinical_entries_audit`.
- Confirmar que las respuestas sigan el estándar RFC 7807.
