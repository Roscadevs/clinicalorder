# PLAN TÉCNICO DE IMPLEMENTACIÓN: FASE 25
## Testing de Mutación Ad-Hoc sobre Operaciones Transaccionales y Blindaje de la Suite de Pruebas Backend

---

## 1. Arquitectura y Persistencia de Datos

### 1.1. Invariantes de Base de Datos (PostgreSQL, Flyway y JPA)
- **Marco Normativo e Invariante de Auditoría Médica Legal:**
  - En estricto cumplimiento de la Ley de Derechos del Paciente e Historia Clínica (Ley 26.529), el repositorio mantiene tablas inmutables de auditoría creadas en la migración `V2__audit_triggers_and_tables.sql`:
    * Tabla `entrada_hc_audit`:
      - `id BIGSERIAL PRIMARY KEY`
      - `clinical_entry_id BIGINT NOT NULL REFERENCES entrada_historia_clinica(id)`
      - `modified_by_user_id BIGINT NOT NULL REFERENCES usuario(id)`
      - `previous_content BYTEA NOT NULL` (Instantánea previa cifrada con AES-256-GCM)
      - `new_content BYTEA NOT NULL` (Nueva versión cifrada con AES-256-GCM)
      - `modified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()`
    * Tabla `historia_clinica_audit`:
      - `id BIGSERIAL PRIMARY KEY`
      - `medical_record_id BIGINT NOT NULL REFERENCES historia_clinica(id)`
      - `modified_by_user_id BIGINT NOT NULL REFERENCES usuario(id)`
      - `modified_section VARCHAR(50) NOT NULL`
      - `previous_values JSONB NOT NULL` (Instantánea estructurada previa)
      - `new_values JSONB NOT NULL` (Nueva instantánea estructurada)
      - `modified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()`
  - **Invariante de Cifrado Criptográfico:** Queda terminantemente prohibido almacenar texto plano de evoluciones o exámenes físicos tanto en tablas vivas como en tablas de auditoría. Todo dato clínico sensible debe atravesar `AesEncryptionService.encrypt(...)`.

### 1.2. Invariante de Concurrencia Optimista (`@Version` y Bloqueos de Agenda)
- **Columna de Versión en Citas:**
  - La tabla `cita` cuenta con la columna `version BIGINT NOT NULL DEFAULT 0` (definida en `V1__initial_schema.sql:78`) para prevenir sobreescrituras concurrentes y garantizar la detección de colisiones de reserva.
  - La entidad de dominio `Appointment` administra transiciones de estado y ventanas temporales de retención (*Hold Policy* con TTL estricto de 10 minutos).
- **Prohibición de Migraciones Destructivas:**
  - Fase 25 **NO** altera el esquema relacional (`DROP TABLE`, `DROP COLUMN` están prohibidos). La estructura de base de datos se mantiene 100% estable e íntegra.

### 1.3. Candados de Integridad de Datos en Dominio y Persistencia
| Entidad | Restricción / Invariante | Mecanismo de Control |
| :--- | :--- | :--- |
| `entrada_hc_audit` | Preservación del contenido previo exacto y nueva versión | Captura obligatoria en `MedicalRecordService.updateClinicalEntry` |
| `historia_clinica_audit` | Registro de auditoría JSON en modificaciones de antecedentes/encabezado | Captura obligatoria en `MedicalRecordService.saveOrUpdateMedicalRecord` (ruta update) |
| `cita` | Concurrencia y expiración de pre-reserva (Hold de 10 minutos) | Validación de `HoldPolicy.isExpired(...)` y unicidad de franja |
| `transaccion_pago` | Balance financiero de señas y saldos | Validación `amount >= deposit`, `amount <= agreedPrice`, `amount == remainingBalance` |
| `usuario` | Anti-lockout del operador administrador en sesión | Chequeo `!active && user.getUsername().equalsIgnoreCase(currentUsername)` |
| `servicio` | Unicidad excluyente de nombre de tratamiento | `existsByNameAndIdNot(name, id)` en edición |
| `bloqueo_agenda` | Validez de intervalo temporal | `endTime.isAfter(startTime)` |

---

## 2. Capa de Backend (Spring Boot 3 / Clean Architecture)

### 2.1. Mapeo Exhaustivo de Servicios Transaccionales Bajo Prueba
Se auditan e intervienen las operaciones transaccionales críticas distribuidas en la capa de aplicación (`backend/src/main/java/com/clinicadermatologica/app/application/service/`):

1. **`AppointmentService.java`**:
   - `bookTemporaryHold(BookAppointmentRequestDTO, Long)`: `@Transactional` — Valida no-pasado, superposición de turnos y bloqueos, calcula seña porcentual con redondeo bancario, emite preferencia de pago.
   - `cancelAppointment(Long)`: `@Transactional` — Impide cancelación de turnos `COMPLETED`, dispara reembolso automático de transacciones MercadoPago `APPROVED`, transiciona a `CANCELED`.
   - `markAsAttended(Long)`: `@Transactional` — Exige estado previo `CONFIRMED`, idempotente si ya está `ATTENDED`, transiciona a `ATTENDED`.
2. **`PaymentService.java`**:
   - `registerDepositPayment(Long, RegisterPaymentRequestDTO, Long)`: `@Transactional(noRollbackFor = BusinessRuleException.class)` — Exige estado `PENDING_PAYMENT`, valida TTL de hold, evalúa cotas de seña (`amount >= deposit` y `amount <= agreedPrice`), pasa turno a `CONFIRMED`.
   - `registerFinalPayment(Long, FinalizePaymentRequestDTO, Long)`: `@Transactional` — Exige estado previo `ATTENDED`, invoca `validateRemainingBalance` computando exclusivamente transacciones previas `APPROVED`, exige coincidencia exacta con deuda, transiciona a `COMPLETED`.
   - `processMercadoPagoWebhook(Map, Map, String, String)`: `@Transactional` — Valida firma criptográfica HMAC-SHA256, aplica idempotencia estricta para transacciones `APPROVED`, transiciona turno según concepto (`DEPOSIT`/`FULL` -> `CONFIRMED`, `BALANCE` -> `COMPLETED`, `refunded` -> `CANCELED`).
   - `refundPayment(PaymentTransaction)`: `@Transactional` — Invoca adaptador de pasarela MercadoPago y actualiza estado de transacción a `REFUNDED`.
3. **`MedicalRecordService.java`**:
   - `addClinicalEntry(ClinicalEntryRequestDTO, Long)`: `@Transactional` — Cifra contenido con AES-256-GCM y asocia a médica autora y paciente.
   - `updateClinicalEntry(Long, String, Long)`: `@Transactional` — Cifra nuevo contenido, captura instantánea de auditoría inmutable (`ClinicalEntryAudit`) en `entrada_hc_audit` con snapshot previo y nuevo, actualiza entrada viva.
   - `saveOrUpdateMedicalRecord(Long, MedicalRecordDTO, Long)`: `@Transactional` — Si existe ficha médica previa, genera instantánea JSON en `MedicalRecordAudit` (`historia_clinica_audit`), cifra examen físico y persiste.
4. **`UserService.java` & `AuthService.java`**:
   - `updateUser(Long, UpdateUserRequestDTO)`: `@Transactional` — Evalúa colisión de nombre y correo (`existsByUsernameAndIdNot`, `existsByEmailAndIdNot`), longitud mínima de contraseña (8 caracteres) y hash BCrypt.
   - `toggleUserActive(Long, boolean, String)`: `@Transactional` — Aplica candado de anti-bloqueo del administrador (`!active && username.equalsIgnoreCase(currentUsername)`), actualiza estado booleano.
   - `registerUser(RegisterUserRequestDTO)` (`AuthService.java`): `@Transactional` — Evalúa unicidad de operador y cifra contraseña obligatoriamente con BCrypt antes de persistir.
5. **`DermatologicServiceService.java`**:
   - `createService(ServiceRequestDTO)`: `@Transactional` — Valida unicidad global `existsByName`.
   - `updateService(Long, ServiceRequestDTO)`: `@Transactional` — Valida unicidad excluyente `existsByNameAndIdNot`.
6. **`CalendarBlockService.java`**:
   - `createBlock(CalendarBlockRequestDTO, Long)`: `@Transactional` — Valida consistencia temporal estricta `endTime.isAfter(startTime)` y valores no nulos.

---

### 2.2. Catálogo Detallado de Mutantes Sintéticos (34 Mutantes en 4 Categorías)

A continuación se detalla el catálogo exhaustivo de mutantes sintéticos diseñado para desafiar cada operación transaccional:

#### Categoría 1: Balances Financieros y Reglas de Pagos (Área 1)
| ID | Servicio y Método | Línea Aprox. | Código Original | Código Mutado | Clase de Prueba Objetivo | Estado Inicial Previsto |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `MUT-BAL-01` | `AppointmentService.bookTemporaryHold` | L166–L168 | `BigDecimal depositAmount = agreedPrice.multiply(new BigDecimal(service.getDepositPercentage())).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);` | `BigDecimal depositAmount = agreedPrice;` | `AppointmentServiceTest` | **KILLED** |
| `MUT-BAL-02` | `AppointmentService.bookTemporaryHold` | L159–L161 | `if (!overlapping.isEmpty()) { throw new SlotUnavailableException("La franja horaria seleccionada ya se encuentra reservada o en proceso de pago"); }` | `if (false) { throw new SlotUnavailableException("..."); }` | `AppointmentServiceTest` | **KILLED** |
| `MUT-BAL-03` | `PaymentService.registerDepositPayment` | L356–L359 | `if (amount.compareTo(deposit) < 0) { throw new BusinessRuleException("El monto abonado ... es menor a la seña requerida"); }` | `if (false) { throw new BusinessRuleException("..."); }` | `PaymentServiceTest` | **KILLED** |
| `MUT-BAL-04` | `PaymentService.registerDepositPayment` | L360–L363 | `if (amount.compareTo(agreedPrice) > 0) { throw new BusinessRuleException("El monto abonado ... supera el precio total"); }` | `if (false) { throw new BusinessRuleException("..."); }` | `PaymentServiceTest` | **SURVIVED** (Brecha de test en cota máxima) |
| `MUT-BAL-05` | `PaymentService.registerDepositPayment` | L377 | `appointment.setStatus(AppointmentStatus.CONFIRMED);` | `appointment.setStatus(AppointmentStatus.PENDING_PAYMENT);` | `PaymentServiceTest` | **KILLED** |
| `MUT-BAL-06` | `PaymentService.registerFinalPayment` | L416–L418 | `if (appointment.getStatus() != AppointmentStatus.ATTENDED) { throw new BusinessRuleException("Solo se puede liquidar el saldo de turnos ya atendidos por el médico"); }` | `if (false) { throw new BusinessRuleException("..."); }` | `PaymentServiceTest` | **KILLED** |
| `MUT-BAL-07` | `PaymentService.registerFinalPayment` | L471 | `BigDecimal remainingBalance = agreedPrice.subtract(totalPaid);` | `BigDecimal remainingBalance = agreedPrice;` | `PaymentServiceTest` | **KILLED** |
| `MUT-BAL-08` | `PaymentService.registerFinalPayment` | L466 | `.filter(tx -> tx.getStatus() == PaymentStatus.APPROVED)` | `.filter(tx -> true)` | `PaymentServiceTest` | **SURVIVED** (Mock actual solo retorna transacciones aprobadas) |
| `MUT-BAL-09` | `AppointmentService.cancelAppointment` | L222–L224 | `if (appointment.getStatus() == AppointmentStatus.COMPLETED) { throw new BusinessRuleException("No se puede cancelar un turno que ya ha sido completado"); }` | `if (false) { throw new BusinessRuleException("..."); }` | `AppointmentServiceTest` | **SURVIVED** (Brecha: no existe test cancelando turno completado) |
| `MUT-BAL-10` | `AppointmentService.cancelAppointment` | L228–L230 | `.filter(t -> t.getPaymentType() == PaymentType.MERCADOPAGO && t.getStatus() == PaymentStatus.APPROVED).forEach(paymentService::refundPayment);` | `// refund omitted` | `AppointmentServiceTest` | **KILLED** |

#### Categoría 2: Auditoría Legal e Invariantes Médicas (Área 2)
| ID | Servicio y Método | Línea Aprox. | Código Original | Código Mutado | Clase de Prueba Objetivo | Estado Inicial Previsto |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `MUT-AUD-01` | `MedicalRecordService.addClinicalEntry` | L109 | `byte[] encryptedContent = encrypt(request.getContent());` | `byte[] encryptedContent = request.getContent() != null ? request.getContent().getBytes() : null;` | `MedicalRecordServiceTest` | **KILLED** |
| `MUT-AUD-02` | `MedicalRecordService.addClinicalEntry` | L103–L104 | `User author = userRepository.findById(physicianUserId).orElseThrow(() -> new ResourceNotFoundException("Medica autora no encontrada"));` | `User author = null;` | `MedicalRecordServiceTest` | **SURVIVED** (Brecha: falta aserción de autor médico en entrada guardada) |
| `MUT-AUD-03` | `MedicalRecordService.updateClinicalEntry` | L139 | `clinicalEntryRepository.saveAudit(audit);` | `// clinicalEntryRepository.saveAudit(audit);` | `MedicalRecordServiceTest` | **SURVIVED** (0 pruebas unitarias para `updateClinicalEntry`) |
| `MUT-AUD-04` | `MedicalRecordService.updateClinicalEntry` | L135 | `.previousContent(entry.getContent())` | `.previousContent(encryptedNew)` | `MedicalRecordServiceTest` | **SURVIVED** (0 pruebas unitarias para `updateClinicalEntry`) |
| `MUT-AUD-05` | `MedicalRecordService.updateClinicalEntry` | L129 | `byte[] encryptedNew = encrypt(newContent);` | `byte[] encryptedNew = newContent != null ? newContent.getBytes() : null;` | `MedicalRecordServiceTest` | **SURVIVED** (0 pruebas unitarias para `updateClinicalEntry`) |
| `MUT-AUD-06` | `MedicalRecordService.saveOrUpdateMedicalRecord` | L84 | `medicalRecordRepository.saveAudit(audit);` | `// medicalRecordRepository.saveAudit(audit);` | `MedicalRecordServiceTest` | **SURVIVED** (Ruta update de ficha médica no probada en tests) |
| `MUT-AUD-07` | `MedicalRecordService.saveOrUpdateMedicalRecord` | L273–L274 | `dto.getPhysicalExamination() != null ? encrypt(dto.getPhysicalExamination()) : null` | `dto.getPhysicalExamination() != null ? dto.getPhysicalExamination().getBytes() : null` | `MedicalRecordServiceTest` | **SURVIVED** (Examen físico es null en pruebas actuales) |
| `MUT-AUD-08` | `MedicalRecordService.saveOrUpdateMedicalRecord` | L88–L90 | `catch (Exception e) { throw new BusinessRuleException("Error al registrar auditoria de historia clinica: " + e.getMessage()); }` | `catch (Exception e) { /* swallow error */ }` | `MedicalRecordServiceTest` | **SURVIVED** (Falta test simulando fallo de serialización JSON) |

#### Categoría 3: Concurrencia Optimista y Seguridad (Área 3)
| ID | Servicio y Método | Línea Aprox. | Código Original | Código Mutado | Clase de Prueba Objetivo | Estado Inicial Previsto |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `MUT-SEC-01` | `UserService.toggleUserActive` | L97–L99 | `if (!active && currentUsername != null && user.getUsername().equalsIgnoreCase(currentUsername.trim())) { throw new BusinessRuleException("No puede suspender su propia cuenta de administrador en sesión"); }` | `if (false) { throw new BusinessRuleException("..."); }` | `UserServiceTest` | **KILLED** |
| `MUT-SEC-02` | `UserService.toggleUserActive` | L97 | `if (!active && currentUsername != null` | `if (active && currentUsername != null` | `UserServiceTest` | **SURVIVED** (Falta test verificando activación permitida del propio admin) |
| `MUT-SEC-03` | `UserService.toggleUserActive` | L101 | `user.setActive(active);` | `user.setActive(!active);` | `UserServiceTest` | **KILLED** |
| `MUT-SEC-04` | `UserService.updateUser` | L62–L64 | `if (userRepository.existsByUsernameAndIdNot(sanitizedUsername, id)) { throw new BusinessRuleException("El nombre de usuario ya se encuentra registrado por otro operador"); }` | `if (false) { throw new BusinessRuleException("..."); }` | `UserServiceTest` | **KILLED** |
| `MUT-SEC-05` | `UserService.updateUser` | L66–L68 | `if (userRepository.existsByEmailAndIdNot(sanitizedEmail, id)) { throw new BusinessRuleException("El correo electronico ya se encuentra registrado por otro operador"); }` | `if (false) { throw new BusinessRuleException("..."); }` | `UserServiceTest` | **KILLED** |
| `MUT-SEC-06` | `UserService.updateUser` | L77–L79 | `if (newPassword.length() < 8) { throw new BusinessRuleException("La contraseña debe tener al menos 8 caracteres"); }` | `if (false) { throw new BusinessRuleException("..."); }` | `UserServiceTest` | **KILLED** |
| `MUT-SEC-07` | `AuthService.registerUser` | L133 | `.passwordHash(passwordEncoder.encode(request.getPassword()))` | `.passwordHash(request.getPassword())` | `AuthServiceTest` | **SURVIVED** (0 tests para `registerUser` en `AuthServiceTest`) |
| `MUT-SEC-08` | `AuthService.registerUser` | L124–L126 | `if (userRepository.existsByUsername(request.getUsername())) { throw new BusinessRuleException("El nombre de usuario ya se encuentra registrado"); }` | `if (false) { throw new BusinessRuleException("..."); }` | `AuthServiceTest` | **SURVIVED** (0 tests para `registerUser` en `AuthServiceTest`) |
| `MUT-SEC-09` | `PaymentService.processMercadoPagoWebhook` | L108–L111 | `if (!isValidSignature(xSignature, xRequestId, paymentIdStr)) { log.warn("Firma de webhook MercadoPago inválida o no autorizada para pago ID: {}", paymentIdStr); return false; }` | `if (false) { return false; }` | `PaymentServiceTest` | **SURVIVED** (Webhook en test corre con firma nula permitida) |
| `MUT-SEC-10` | `PaymentService.processMercadoPagoWebhook` | L157–L161 | `if (transaction.getStatus() == PaymentStatus.APPROVED) { log.info("Idempotencia webhook: Pago {} ya fue aprobado previamente..."); return true; }` | `if (false) { return true; }` | `PaymentServiceTest` | **KILLED** |
| `MUT-SEC-11` | `PaymentService.refundPayment` | L304 | `mercadoPagoAdapter.refundPayment(mpPaymentId);` | `// mercadoPagoAdapter.refundPayment(mpPaymentId);` | `PaymentServiceTest` | **KILLED** |
| `MUT-SEC-12` | `PaymentService.refundPayment` | L305 | `transaction.setStatus(PaymentStatus.REFUNDED);` | `transaction.setStatus(PaymentStatus.APPROVED);` | `PaymentServiceTest` | **KILLED** |

#### Categoría 4: Validaciones de Tiempo y Unicidad de Dominio (Área 4)
| ID | Servicio y Método | Línea Aprox. | Código Original | Código Mutado | Clase de Prueba Objetivo | Estado Inicial Previsto |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `MUT-VAL-01` | `AppointmentService.bookTemporaryHold` | L141–L143 | `if (startTime.isBefore(Instant.now())) { throw new BusinessRuleException("No es posible reservar un turno en una fecha u hora pasada"); }` | `if (false) { throw new BusinessRuleException("..."); }` | `AppointmentServiceTest` | **SURVIVED** (Falta test que reserve turno en el pasado) |
| `MUT-VAL-02` | `AppointmentService.markAsAttended` | L250–L253 | `if (appointment.getStatus() != AppointmentStatus.CONFIRMED) { throw new BusinessRuleException("Sólo se puede marcar como atendido un turno confirmado (estado actual: " + appointment.getStatus() + ")"); }` | `if (false) { throw new BusinessRuleException("..."); }` | `AppointmentServiceTest` | **KILLED** |
| `MUT-VAL-03` | `AppointmentService.markAsAttended` | L255 | `appointment.setStatus(AppointmentStatus.ATTENDED);` | `appointment.setStatus(AppointmentStatus.COMPLETED);` | `AppointmentServiceTest` | **KILLED** |
| `MUT-VAL-04` | `CalendarBlockService.createBlock` | L34–L36 | `if (request.getStartTime() == null || request.getEndTime() == null || !request.getEndTime().isAfter(request.getStartTime())) { throw new BusinessRuleException("La fecha de fin debe ser posterior a la fecha de inicio"); }` | `if (false) { throw new BusinessRuleException("..."); }` | `CalendarBlockServiceTest` | **KILLED** |
| `MUT-VAL-05` | `DermatologicServiceService.createService` | L60–L62 | `if (serviceRepository.existsByName(request.getName())) { throw new BusinessRuleException("Ya existe un servicio con el nombre " + request.getName()); }` | `if (false) { throw new BusinessRuleException("..."); }` | `DermatologicServiceServiceTest` | **KILLED** |
| `MUT-VAL-06` | `DermatologicServiceService.updateService` | L85–L87 | `if (serviceRepository.existsByNameAndIdNot(request.getName(), id)) { throw new BusinessRuleException("Ya existe otro tratamiento registrado con el nombre " + request.getName()); }` | `if (false) { throw new BusinessRuleException("..."); }` | `DermatologicServiceServiceTest` | **KILLED** |

---

### 2.3. Arquitectura y Diseño del Harness Automatizado (`scripts/mutation_runner.py`)

El ejecutor automatizado de mutaciones se implementará en Python 3 puro (sin dependencias externas pesadas) en `scripts/mutation_runner.py`.

#### 2.3.1. Esquema del Catálogo de Mutantes (`scripts/mutants_catalog.json`)
```json
[
  {
    "id": "MUT-AUD-03",
    "category": "AUDIT_INVARIANTS",
    "service": "MedicalRecordService",
    "target_file": "backend/src/main/java/com/clinicadermatologica/app/application/service/MedicalRecordService.java",
    "line_number": 139,
    "original_code": "clinicalEntryRepository.saveAudit(audit);",
    "mutated_code": "// clinicalEntryRepository.saveAudit(audit);",
    "target_test_class": "MedicalRecordServiceTest",
    "description": "Omisión de persistencia en tabla de auditoría clínica entrada_hc_audit"
  }
]
```

#### 2.3.2. Ciclo de Ejecución con Respaldo y Rollback Inmutable
1. **Verificación Pre-Vuelo:**
   - Confirmar que el directorio de trabajo Git esté limpio (`git diff --exit-code`).
   - Comprobar que `JAVA_HOME=/opt/homebrew/opt/openjdk@17` esté disponible y que la suite original pase al 100%.
2. **Copia de Seguridad Inmutable:**
   - Antes de modificar el archivo destino en disco, almacenar el contenido en memoria y crear un archivo físico inmutable `<archivo>.original_bak`.
3. **Manejador de Señales del Sistema Operativo:**
   - Registrar manejadores para `SIGINT` (Ctrl+C), `SIGTERM` y `SIGHUP`. Ante cualquier señal, el script ejecuta la restauración inmediata del archivo original antes de finalizar.
4. **Inyección Quirúrgica:**
   - Verificar que `original_code` exista una única vez en el archivo objetivo. Si no coincide de forma exacta, abortar con error para evitar corrupciones.
   - Reemplazar exactamente esa ocurrencia con `mutated_code`.
5. **Estrategia de Ejecución en Dos Fases:**
   - **Fase 1 (Prueba Rápida Específica):**
     Ejecutar `JAVA_HOME=/opt/homebrew/opt/openjdk@17 mvn test -Dtest=<target_test_class>` en el subdirectorio `backend/`.
     - Si la prueba falla (`Tests run: X, Failures: Y` con $Y > 0$ o `Errors: Z` con $Z > 0$): el mutante es clasificado de inmediato como **ABATIDO (KILLED)** en ~2.0 segundos.
     - Si hay error de compilación (`[ERROR] COMPILATION ERROR`): el mutante se clasifica como **ERROR_COMPILACION**.
   - **Fase 2 (Confirmación con Suite Completa):**
     Si la prueba específica pasó exitosamente con código de salida 0, ejecutar la suite completa (`mvn test` en ~4.1s).
     - Si alguna otra prueba falla: clasificado como **ABATIDO (KILLED)**.
     - Si la suite completa pasa limpia: el mutante es clasificado como **SUPERVIVIENTE (SURVIVED)**.
6. **Restauración Atómica Obligatoria (`finally` block):**
   - Restaurar el archivo original desde la copia en memoria.
   - Eliminar el archivo `.original_bak`.
   - Ejecutar `git diff --exit-code <archivo>`. Si el código de salida es distinto de cero, detener la ejecución emitiendo una alarma crítica de integridad.
7. **Generación de Reportes Estructurados:**
   - Generar `documentacion/mutation_report.json` y `documentacion/mutation_report.md` con:
     * Total de mutantes evaluados.
     * Cantidad de mutantes abatidos (Killed).
     * Cantidad de mutantes supervivientes (Survived).
     * Cantidad de errores de compilación o timeouts.
     * **Mutation Score:** $(\text{Killed} / (\text{Killed} + \text{Survived})) \times 100\%$.

---

## 3. Suite de Pruebas Requeridas (JUnit 5 & Mockito)

Para cerrar las 11 brechas detectadas donde los mutantes sobreviven inicialmente y elevar el Mutation Score al **100%**, se diseñan e incorporan las siguientes pruebas unitarias estrictas en las suites del backend:

### 3.1. `MedicalRecordServiceTest.java` (Blindaje de Auditoría Legal e Invariantes)
1. **`testUpdateClinicalEntry_Success_CreatesEncryptedAuditRecord_KillsMutant`**:
   - Escenario: Médico modifica una entrada clínica existente.
   - Implementación:
     * Mock de `clinicalEntryRepository.findById(1L)` retornando entrada existente con contenido cifrado previo.
     * Mock de `userRepository.findById(2L)` retornando médica autora válida.
     * Ejecutar `medicalRecordService.updateClinicalEntry(1L, "Nueva evolución de acné", 2L)`.
     * Usar `ArgumentCaptor<ClinicalEntryAudit>` sobre `clinicalEntryRepository.saveAudit(captor.capture())`.
     * **Aserciones Críticas:**
       - `assertNotNull(captor.getValue());`
       - `assertArrayEquals(previousEncryptedContent, captor.getValue().getPreviousContent());` (Garantiza que la instantánea histórica previa no fue sobreescrita ni alterada; **Abate MUT-AUD-04**).
       - `assertArrayEquals(newEncryptedContent, captor.getValue().getNewContent());` (**Abate MUT-AUD-05**).
       - `assertEquals(2L, captor.getValue().getModifiedByUser().getId());`
       - `verify(clinicalEntryRepository, times(1)).saveAudit(any());` (**Abate MUT-AUD-03**).
       - `verify(aesEncryptionService, times(1)).encrypt("Nueva evolución de acné");`
2. **`testUpdateClinicalEntry_AuthorNotFound_ThrowsException_KillsMutant`**:
   - Escenario: Identificador de médica autora inexistente en base de datos.
   - Mock `userRepository.findById(999L)` retornando `Optional.empty()`.
   - Verificar `assertThrows(ResourceNotFoundException.class, ...)`. (**Abate MUT-AUD-02**).
3. **`testSaveOrUpdateMedicalRecord_UpdatePath_CreatesAuditRecord_KillsMutant`**:
   - Escenario: Paciente ya cuenta con expediente médico registrado; se actualiza examen físico y antecedentes.
   - Mock `medicalRecordRepository.findByPatientId(1L)` retornando registro existente.
   - Ejecutar `medicalRecordService.saveOrUpdateMedicalRecord(1L, dtoConExamenFisico, 2L)`.
   - Usar `ArgumentCaptor<MedicalRecordAudit>` sobre `medicalRecordRepository.saveAudit(captor.capture())`.
   - **Aserciones Críticas:**
     * `verify(medicalRecordRepository, times(1)).saveAudit(any());` (**Abate MUT-AUD-06**).
     * `verify(aesEncryptionService, atLeastOnce()).encrypt("Piel con lesiones eritematosas");` (**Abate MUT-AUD-07**).
     * `assertEquals("ACTUALIZACION_GENERAL", captor.getValue().getModifiedSection());`
     * `assertNotNull(captor.getValue().getPreviousValues());`
     * `assertNotNull(captor.getValue().getNewValues());`
4. **`testSaveOrUpdateMedicalRecord_AuditSerializationFailure_ThrowsBusinessRuleException_KillsMutant`**:
   - Forzar ObjectMapper o datos inválidos para provocar fallo en serialización de auditoría.
   - Verificar que arroje `BusinessRuleException` y nunca oculte silenciosamente la falla. (**Abate MUT-AUD-08**).

### 3.2. `AppointmentServiceTest.java` (Blindaje de Balances y Reglas Temporales)
1. **`testBookTemporaryHold_PastStartTime_ThrowsBusinessRule_KillsMutant`**:
   - Configurar `request.setStartTime(Instant.now().minus(2, ChronoUnit.HOURS))`.
   - Verificar `assertThrows(BusinessRuleException.class, () -> appointmentService.bookTemporaryHold(request, 1L));` con mensaje que contiene "fecha u hora pasada". (**Abate MUT-VAL-01**).
   - `verify(appointmentRepository, never()).save(any());`
2. **`testCancelAppointment_CompletedStatus_ThrowsBusinessRule_KillsMutant`**:
   - Mock de cita con `status = AppointmentStatus.COMPLETED`.
   - Verificar `assertThrows(BusinessRuleException.class, () -> appointmentService.cancelAppointment(1L));` con mensaje que contiene "ya ha sido completado". (**Abate MUT-BAL-09**).
   - `verify(paymentService, never()).refundPayment(any());`
3. **`testBookTemporaryHold_CapturesStrictPendingPaymentState_KillsMutant`**:
   - Usar `ArgumentCaptor<Appointment>` y `ArgumentCaptor<PaymentTransaction>`.
   - Asegurar que `appointmentCaptor.getValue().getStatus() == AppointmentStatus.PENDING_PAYMENT` y `txCaptor.getValue().getPaymentConcept() == PaymentConcept.DEPOSIT`.

### 3.3. `PaymentServiceTest.java` (Blindaje de Saldos y Cota Máxima de Señas)
1. **`testRegisterDepositPayment_AmountExceedsAgreedPrice_ThrowsBusinessRule_KillsMutant`**:
   - Turno con precio acordado $30.000 y seña mínima requerida $15.000.
   - Paciente intenta abonar $35.000.
   - Verificar `assertThrows(BusinessRuleException.class, () -> paymentService.registerDepositPayment(1L, requestExcedido, 1L));` con mensaje que contiene "supera el precio total". (**Abate MUT-BAL-04**).
2. **`testValidateRemainingBalance_IgnoresRejectedAndPendingTransactions_KillsMutant`**:
   - Mock de `paymentTransactionRepository.findByAppointmentId(1L)` retornando 3 transacciones:
     * Transacción 1: `APPROVED`, Monto $15.000.
     * Transacción 2: `REJECTED`, Monto $10.000.
     * Transacción 3: `PENDING`, Monto $10.000.
   - Precio pactado: $30.000. Deuda real pendiente: $15.000.
   - Si se intenta abonar $15.000, la operación debe ser exitosa.
   - Si el mutante computara transacciones rechazadas o pendientes (`totalPaid = 35.000`), arrojaría error de saldo. Al pasar exitosamente, demuestra que el filtro `tx.getStatus() == PaymentStatus.APPROVED` es estricto y discriminatorio. (**Abate MUT-BAL-08**).
3. **`testProcessWebhook_SignatureValidation_KillsMutant`**:
   - Configurar secreto de webhook en entorno de prueba y enviar firma inválida o adulterada.
   - Verificar que el servicio retorne `false` y no altere el estado de la cita. (**Abate MUT-SEC-09**).

### 3.4. `AuthServiceTest.java` & `UserServiceTest.java` (Blindaje de Operadores y Anti-Lockout)
1. **`testRegisterUser_Success_HashesPasswordWithBCrypt_KillsMutant`**: (en `AuthServiceTest`)
   - Registrar operador con contraseña `"SecureP@ssword2026"`.
   - Capturar entidad persistida en `userRepository.save(captor.capture())`.
   - **Aserciones Críticas:**
     * `verify(passwordEncoder, times(1)).encode("SecureP@ssword2026");` (**Abate MUT-SEC-07**).
     * `assertNotEquals("SecureP@ssword2026", captor.getValue().getPasswordHash());`
     * `assertEquals("$2a$10$hashedPasswordSample", captor.getValue().getPasswordHash());`
2. **`testRegisterUser_DuplicateUsername_ThrowsBusinessRule_KillsMutant`**: (en `AuthServiceTest`)
   - Mock `userRepository.existsByUsername("admin")` retornando `true`.
   - Verificar `assertThrows(BusinessRuleException.class, () -> authService.registerUser(request));`. (**Abate MUT-SEC-08**).
3. **`testToggleUserActive_AdminSelfActivation_Allowed_KillsMutant`**: (en `UserServiceTest`)
   - Admin en sesión activa (`currentUsername = "admin"`) activa una cuenta (`active = true`).
   - Verificar que la operación transcurra sin arrojar excepción, confirmando que la regla anti-lockout aplica estrictamente ante suspensiones (`!active`). (**Abate MUT-SEC-02**).

---

## 4. Criterios de Aceptación y Protocolo de Cierre

### 4.1. Integridad y Efectividad de la Mutación
- [ ] **Cobertura Exhaustiva:** Al menos 2 mutantes sintéticos evaluados por cada una de las 16 operaciones transaccionales catalogadas (34 mutantes totales en el catálogo).
- [ ] **Mutation Score 100%:** Tras el fortalecimiento de la suite de pruebas unitarias, el 100% de los 34 mutantes válidos deben resultar **ABATIDOS (KILLED)** por la suite de pruebas. Cero mutantes supervivientes.
- [ ] **Regresión Limpia:** La suite original de pruebas del backend en su código base productivo ejecuta con 0 fallos y código de salida 0:
  ```bash
  cd backend && JAVA_HOME=/opt/homebrew/opt/openjdk@17 mvn test
  ```
  (Total de pruebas unitarias incrementado de 114 a 125+ pruebas pasando limpias).
- [ ] **Arnés Seguro y Restauración Atómica:** `scripts/mutation_runner.py` garantiza que el árbol de trabajo de Git quede completamente limpio tras finalizar:
  ```bash
  git diff --exit-code
  ```
  (Código de salida 0).

### 4.2. Auditoría de Invariantes del Repositorio (Fase 5)
1. **Auditoría Médica Legal:** Las tablas `entrada_hc_audit` e `historia_clinica_audit` y sus entidades asociadas permanecen inmutables y estrictamente requeridas en las modificaciones clínicas.
2. **Concurrencia Optimista:** La columna `version` de la tabla `cita` se preserva intacta sin cambios DDL.
3. **Estándar RFC 7807:** Todas las excepciones de negocio (`BusinessRuleException`, `ResourceNotFoundException`, etc.) continúan mapeadas a `ProblemDetail` con `application/problem+json` sin exponer stack traces.
4. **Actualización de Conocimiento:** Sincronización final obligatoria mediante:
   ```bash
   graphify update . && graphify export obsidian
   ```
