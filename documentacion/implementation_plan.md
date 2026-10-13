# PLAN TÉCNICO DE IMPLEMENTACIÓN: FASE 23
## Formulario de Bloqueos de Agenda e Indisponibilidad Médica (Agenda de Turnos)

---

## 1. Arquitectura y Persistencia de Datos

### 1.1. Base de Datos (PostgreSQL & Flyway)
- **Tabla Existente:** `bloqueo_calendario` (creada en la migración Flyway `V4__calendar_block_schema.sql`).
- **Esquema:**
  - `id BIGSERIAL PRIMARY KEY`
  - `usuario_id BIGINT NOT NULL REFERENCES usuario(id)`
  - `start_time TIMESTAMP WITH TIME ZONE NOT NULL`
  - `end_time TIMESTAMP WITH TIME ZONE NOT NULL`
  - `motivo VARCHAR(255) NOT NULL`
  - `created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()`
- **Estrategia Flyway:** No se requieren modificaciones DDL adicionales ya que la estructura cubre íntegramente las necesidades de auditoría y fechas.
- **Entidad JPA:** [`CalendarBlock.java`](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/backend/src/main/java/com/clinicadermatologica/app/domain/model/CalendarBlock.java).
- **Repositorio JPA:** [`CalendarBlockRepository.java`](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/backend/src/domain/repository/CalendarBlockRepository.java) con consultas por rango `findByDateRange(start, end)` y solapamiento `findOverlappingBlocks(start, end)`.

---

## 2. Capa de Backend (Spring Boot 3 / Clean Architecture)

### 2.1. Controlador REST (`CalendarBlockController.java`)
- **Ruta:** `/api/v1/bloqueos`
- **Controlador:** [`CalendarBlockController.java`](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/backend/src/main/java/com/clinicadermatologica/app/presentation/controller/CalendarBlockController.java)
- **Seguridad:** `@PreAuthorize("hasAnyRole('ADMIN', 'DOCTORA')")`
- **Mejora de Robustez Defensiva en `POST /api/v1/bloqueos`:**
  - Flexibilizar el parámetro `@RequestParam(required = false) Long userId`.
  - Inyectar `UserRepository` y resolver el usuario automáticamente desde el token JWT mediante `Authentication authentication` (`authentication.getName()`).
  - Si no se provee parámetro ni token resoluble, delegar al fallback seguro del servicio (`userId = 1L`).
- **Endpoints Expuestos:**
  1. `POST /api/v1/bloqueos`: Crea un nuevo bloqueo a partir de `CalendarBlockRequestDTO`. Responde con HTTP 201 Created y `CalendarBlockResponseDTO`.
  2. `GET /api/v1/bloqueos?start={iso}&end={iso}`: Obtiene la lista de bloqueos en el rango temporal. Responde con HTTP 200 OK y `List<CalendarBlockResponseDTO>`.
  3. `DELETE /api/v1/bloqueos/{id}`: Elimina el bloqueo por su identificador primario. Responde con HTTP 204 No Content.
- **Respuestas de Error:** Estándar RFC 7807 (`ProblemDetail`) ante `BusinessRuleException` (por ejemplo, si `endTime <= startTime`) o `ResourceNotFoundException`.

### 2.2. Capa de Aplicación (`CalendarBlockService.java`)
- Verificar que las transacciones sean `@Transactional` para escritura y `@Transactional(readOnly = true)` para lectura.
- Mantener la validación temporal `if (request.getEndTime().isBefore(request.getStartTime())) throw new BusinessRuleException(...)`.

---

## 3. Capa de Frontend (React 18 / TypeScript / Tailwind CSS)

### 3.1. Definición de Tipos (`types/index.ts`)
- Declarar la interfaz oficial de bloqueos:
  ```typescript
  export interface CalendarBlock {
    id: number;
    createdByUserId?: number;
    createdByUserFullName?: string;
    startTime: string; // ISO 8601
    endTime: string;   // ISO 8601
    reason: string;
    createdAt?: string;
  }
  ```

### 3.2. Cliente HTTP y Modo Resiliente (`api.ts`)
- Crear el objeto `calendarBlocksApi`:
  - `getBlocks(start: string, end: string): Promise<CalendarBlock[]>`: Consume `GET /bloqueos?start=...&end=...` con fallback en memoria a `DEMO_BLOCKS`.
  - `createBlock(data: { startTime: string; endTime: string; reason: string }, userId?: number): Promise<CalendarBlock>`: Consume `POST /bloqueos` enviando JSON y `userId` opcional.
  - `deleteBlock(id: number): Promise<void>`: Consume `DELETE /bloqueos/{id}` y actualiza el almacenamiento local en caso de contingencia.

### 3.3. Componente Modal: `CalendarBlockModal.tsx` *(Nuevo)*
- **Ubicación:** `frontend/src/features/agenda/CalendarBlockModal.tsx`
- **Contrato de Props:**
  ```typescript
  interface CalendarBlockModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialDate?: Date;
    onSaved: () => void;
  }
  ```
- **Características de UX y Ergonomía:**
  - Campo de fecha con inicialización en el día seleccionado de la agenda.
  - Interruptor (Toggle) de "Día completo": al activarse, deshabilita los selectores de hora y configura el rango de 00:00 a 23:59:59.
  - Selectores de "Hora desde" y "Hora hasta" (valores entre 08:00 y 20:00 en saltos de 30 o 60 minutos) con validación reactiva de coherencia temporal.
  - Campo de texto obligatorio "Motivo del bloqueo" (con sugerencias rápidas: *Cirugía programada*, *Congreso / Capacitación*, *Feriado / Asueto*, *Mantenimiento de consultorio*, *Licencia médica*).
  - Alerta integrada de errores (`Callout`) para retroalimentación visual inmediata.
  - Controles táctiles optimizados para dispositivos móviles (mínimo 44px de área táctil).

### 3.4. Integración en la Vista de Agenda (`AgendaView.tsx`)
- **Botón de Acción:**
  - Agregar botón "Bloquear horario" en la cabecera de la agenda, visible exclusivamente para roles autorizados (`isMedicalStaff()`).
- **Carga y Sincronización:**
  - Invocar `calendarBlocksApi.getBlocks(start.toISOString(), end.toISOString())` de forma coordinada con la carga de turnos (`fetchAgenda`).
  - Almacenar el estado reactivo `blocks: CalendarBlock[]`.
- **Visualización en Grilla y Panel Lateral:**
  - Renderizar bloques en el panel lateral de turnos del día seleccionado y en la vista semanal/diaria, con diseño distintivo (tarjeta con borde ámbar/rojo suave, ícono de candado, horario destacado y motivo visible).
- **Acción de Desbloqueo / Liberación:**
  - Botón "Liberar horario" en cada tarjeta de bloqueo.
  - Al hacer clic, invocar el modal de confirmación `setConfirm(...)`: *"¿Deseas liberar este horario y permitir nuevamente la reserva de turnos?"*.
  - Al confirmar, invocar `calendarBlocksApi.deleteBlock(id)` y refrescar la agenda reactivamente sin recargar la página.

---

## 4. Suite de Pruebas y Criterios de Aceptación

### 4.1. Backend (JUnit 5 & Mockito)
- Tests unitarios en `CalendarBlockServiceTest` y verificación de `CalendarBlockController`:
  1. Creación exitosa de bloqueo con usuario autenticado resuelto automáticamente.
  2. Fallo de validación cuando `endTime <= startTime` retornando `BusinessRuleException`.
  3. Consulta por rango devolviendo lista de bloqueos en formato DTO.
  4. Eliminación exitosa de bloqueo por ID.
- Ejecución con OpenJDK 17: `JAVA_HOME=/opt/homebrew/opt/openjdk@17 mvn test`.

### 4.2. Frontend (TypeScript & Vite)
- Validación de tipos sin errores: `npm run build` o `npx tsc --noEmit`.
- Verificación de renderizado y flujos de usuario (creación, visualización y desbloqueo).

---

## 5. Auditoría de Invariantes del Repositorio
- Preservar inmutable la anotación `@Version` en las entidades JPA.
- Garantizar que las operaciones de indisponibilidad no alteren `clinical_entries_audit`.
- Respuestas de excepción uniformes bajo el estándar RFC 7807.
