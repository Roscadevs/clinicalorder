# INFORME DE TESTING DE MUTACIÓN AD-HOC (FASE 25)
## Suite de Mutación sobre Operaciones Transaccionales del Backend

- **Fecha de Ejecución:** `2026-10-13T13:09:01.325802+00:00`
- **Duración Total:** `215.51 s`
- **Total Mutantes Evaluados:** `36`
- **Mutantes Abatidos (Killed):** `36`
- **Mutantes Supervivientes (Survived):** `0`
- **Errores de Compilación:** `0`
- **Timeouts:** `0`
- **Mutation Score Final:** `100.0%`

---

## 1. Resumen por Categoría

| Categoría | Total | Abatidos | Supervivientes | Score |
| :--- | :---: | :---: | :---: | :---: |
| `AUDIT_INVARIANTS` | 8 | 8 | 0 | **100.0%** |
| `BALANCES_AND_PAYMENTS` | 10 | 10 | 0 | **100.0%** |
| `CONCURRENCY_AND_SECURITY` | 12 | 12 | 0 | **100.0%** |
| `TEMPORAL_AND_UNIQUENESS` | 6 | 6 | 0 | **100.0%** |

---

## 2. Detalle Exhaustivo de Mutantes Sintéticos

| ID | Categoría | Servicio / Método | Test Objetivo | Estado | Abatido Por | Tiempo (s) | Descripción |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: | :--- |
| `MUT-BAL-01` | `BALANCES_AND_PAYMENTS` | `AppointmentService.bookTemporaryHold` | `AppointmentServiceTest` | **KILLED** | `AppointmentServiceTest` | 6.11 | Alteración del cálculo porcentual de seña: asigna precio total en vez de porcentaje configurado |
| `MUT-BAL-02` | `BALANCES_AND_PAYMENTS` | `AppointmentService.bookTemporaryHold` | `AppointmentServiceTest` | **KILLED** | `AppointmentServiceTest` | 6.16 | Omisión de validación de turnos superpuestos no expirados |
| `MUT-BAL-03` | `BALANCES_AND_PAYMENTS` | `PaymentService.registerDepositPayment` | `PaymentServiceTest` | **KILLED** | `PaymentServiceTest` | 6.04 | Bypass de validación de importe mínimo de seña requerida |
| `MUT-BAL-04` | `BALANCES_AND_PAYMENTS` | `PaymentService.registerDepositPayment` | `PaymentServiceTest` | **KILLED** | `PaymentServiceTest` | 6.48 | Bypass de validación de cota máxima de seña frente al precio total acordado |
| `MUT-BAL-05` | `BALANCES_AND_PAYMENTS` | `PaymentService.registerDepositPayment` | `PaymentServiceTest` | **KILLED** | `PaymentServiceTest` | 6.55 | Corrupción de transición de estado: no confirma el turno tras registrar la seña |
| `MUT-BAL-06` | `BALANCES_AND_PAYMENTS` | `PaymentService.registerFinalPayment` | `PaymentServiceTest` | **KILLED** | `PaymentServiceTest` | 6.82 | Bypass de precondición clínica: permite liquidar saldo de turnos que no están atendidos |
| `MUT-BAL-07` | `BALANCES_AND_PAYMENTS` | `PaymentService.registerFinalPayment` | `PaymentServiceTest` | **KILLED** | `PaymentServiceTest` | 6.57 | Corrupción de cálculo de saldo pendiente: ignora pagos previos de seña |
| `MUT-BAL-08` | `BALANCES_AND_PAYMENTS` | `PaymentService.registerFinalPayment` | `PaymentServiceTest` | **KILLED** | `PaymentServiceTest` | 7.01 | Cómputo indiscriminado de transacciones: suma pagos rechazados o pendientes al total abonado |
| `MUT-BAL-09` | `BALANCES_AND_PAYMENTS` | `AppointmentService.cancelAppointment` | `AppointmentServiceTest` | **KILLED** | `AppointmentServiceTest` | 5.76 | Bypass de protección contra cancelación de turnos completados |
| `MUT-BAL-10` | `BALANCES_AND_PAYMENTS` | `AppointmentService.cancelAppointment` | `AppointmentServiceTest` | **KILLED** | `AppointmentServiceTest` | 5.84 | Omisión de disparo de reembolso automático en MercadoPago ante cancelación |
| `MUT-AUD-01` | `AUDIT_INVARIANTS` | `MedicalRecordService.addClinicalEntry` | `MedicalRecordServiceTest` | **KILLED** | `MedicalRecordServiceTest` | 6.02 | Omisión de cifrado AES-256 en contenido de evolución clínica inicial (almacena texto plano) |
| `MUT-AUD-02` | `AUDIT_INVARIANTS` | `MedicalRecordService.addClinicalEntry` | `MedicalRecordServiceTest` | **KILLED** | `MedicalRecordServiceTest` | 6.03 | Bypass de resolución de médica autora en alta de evolución clínica |
| `MUT-AUD-03` | `AUDIT_INVARIANTS` | `MedicalRecordService.updateClinicalEntry` | `MedicalRecordServiceTest` | **KILLED** | `MedicalRecordServiceTest` | 6.03 | Omisión de persistencia en tabla de auditoría clínica entrada_hc_audit |
| `MUT-AUD-04` | `AUDIT_INVARIANTS` | `MedicalRecordService.updateClinicalEntry` | `MedicalRecordServiceTest` | **KILLED** | `MedicalRecordServiceTest` | 5.84 | Corrupción de snapshot previo en auditoría de entrada clínica (sobrescribe con contenido nuevo) |
| `MUT-AUD-05` | `AUDIT_INVARIANTS` | `MedicalRecordService.updateClinicalEntry` | `MedicalRecordServiceTest` | **KILLED** | `MedicalRecordServiceTest` | 6.11 | Omisión de cifrado AES-256 en actualización de nota clínica |
| `MUT-AUD-06` | `AUDIT_INVARIANTS` | `MedicalRecordService.saveOrUpdateMedicalRecord` | `MedicalRecordServiceTest` | **KILLED** | `MedicalRecordServiceTest` | 5.97 | Omisión de registro de auditoría estructurada en historia_clinica_audit al actualizar ficha médica |
| `MUT-AUD-07` | `AUDIT_INVARIANTS` | `MedicalRecordService.saveOrUpdateMedicalRecord` | `MedicalRecordServiceTest` | **KILLED** | `MedicalRecordServiceTest` | 5.91 | Omisión de cifrado AES-256 en examen físico de historia clínica |
| `MUT-AUD-08` | `AUDIT_INVARIANTS` | `MedicalRecordService.saveOrUpdateMedicalRecord` | `MedicalRecordServiceTest` | **KILLED** | `MedicalRecordServiceTest` | 5.98 | Ocultamiento silencioso de fallas de serialización de auditoría clínica |
| `MUT-SEC-01` | `CONCURRENCY_AND_SECURITY` | `UserService.toggleUserActive` | `UserServiceTest` | **KILLED** | `UserServiceTest` | 5.75 | Bypass de regla anti-lockout del administrador en sesión |
| `MUT-SEC-02` | `CONCURRENCY_AND_SECURITY` | `UserService.toggleUserActive` | `UserServiceTest` | **KILLED** | `UserServiceTest` | 5.68 | Inversión de regla anti-lockout: bloquea activación de la propia cuenta en vez de suspensión |
| `MUT-SEC-03` | `CONCURRENCY_AND_SECURITY` | `UserService.toggleUserActive` | `UserServiceTest` | **KILLED** | `UserServiceTest` | 5.64 | Inversión de transición de estado activo de operador |
| `MUT-SEC-04` | `CONCURRENCY_AND_SECURITY` | `UserService.updateUser` | `UserServiceTest` | **KILLED** | `UserServiceTest` | 5.45 | Bypass de unicidad de nombre de usuario en edición de operador |
| `MUT-SEC-05` | `CONCURRENCY_AND_SECURITY` | `UserService.updateUser` | `UserServiceTest` | **KILLED** | `UserServiceTest` | 5.61 | Bypass de unicidad de correo electrónico en edición de operador |
| `MUT-SEC-06` | `CONCURRENCY_AND_SECURITY` | `UserService.updateUser` | `UserServiceTest` | **KILLED** | `UserServiceTest` | 5.47 | Bypass de validación de longitud mínima de 8 caracteres para contraseña |
| `MUT-SEC-07` | `CONCURRENCY_AND_SECURITY` | `AuthService.registerUser` | `AuthServiceTest` | **KILLED** | `AuthServiceTest` | 5.61 | Omisión de cifrado BCrypt en registro de nuevo operador (almacena contraseña en texto plano) |
| `MUT-SEC-08` | `CONCURRENCY_AND_SECURITY` | `AuthService.registerUser` | `AuthServiceTest` | **KILLED** | `AuthServiceTest` | 6.05 | Bypass de validación de nombre de usuario duplicado en registro |
| `MUT-SEC-09` | `CONCURRENCY_AND_SECURITY` | `PaymentService.processMercadoPagoWebhook` | `PaymentServiceTest` | **KILLED** | `PaymentServiceTest` | 5.8 | Bypass de validación criptográfica de firma HMAC-SHA256 en webhook de pagos |
| `MUT-SEC-10` | `CONCURRENCY_AND_SECURITY` | `PaymentService.processMercadoPagoWebhook` | `PaymentServiceTest` | **KILLED** | `PaymentServiceTest` | 5.88 | Omisión de verificación de idempotencia ante webhook de pago ya aprobado |
| `MUT-SEC-11` | `CONCURRENCY_AND_SECURITY` | `PaymentService.refundPayment` | `PaymentServiceTest` | **KILLED** | `PaymentServiceTest` | 5.8 | Omisión de invocación a API de pasarela MercadoPago en proceso de reembolso |
| `MUT-SEC-12` | `CONCURRENCY_AND_SECURITY` | `PaymentService.refundPayment` | `PaymentServiceTest` | **KILLED** | `PaymentServiceTest` | 5.81 | Corrupción de estado de transacción reembolsada: permanece en APPROVED |
| `MUT-VAL-01` | `TEMPORAL_AND_UNIQUENESS` | `AppointmentService.bookTemporaryHold` | `AppointmentServiceTest` | **KILLED** | `AppointmentServiceTest` | 5.87 | Bypass de validación temporal: permite reservar turnos en fechas u horas pasadas |
| `MUT-VAL-02` | `TEMPORAL_AND_UNIQUENESS` | `AppointmentService.markAsAttended` | `AppointmentServiceTest` | **KILLED** | `AppointmentServiceTest` | 5.82 | Bypass de precondición CONFIRMED al marcar cita médica como atendida |
| `MUT-VAL-03` | `TEMPORAL_AND_UNIQUENESS` | `AppointmentService.markAsAttended` | `AppointmentServiceTest` | **KILLED** | `AppointmentServiceTest` | 5.85 | Corrupción de transición de estado: saltea estado intermedio ATTENDED marcando COMPLETED |
| `MUT-VAL-04` | `TEMPORAL_AND_UNIQUENESS` | `CalendarBlockService.createBlock` | `CalendarBlockServiceTest` | **KILLED** | `CalendarBlockServiceTest` | 5.49 | Bypass de validación temporal en bloqueo de agenda (permite fecha fin anterior a fecha inicio) |
| `MUT-VAL-05` | `TEMPORAL_AND_UNIQUENESS` | `DermatologicServiceService.createService` | `DermatologicServiceServiceTest` | **KILLED** | `DermatologicServiceServiceTest` | 5.58 | Bypass de unicidad global de nombre de tratamiento al crear servicio |
| `MUT-VAL-06` | `TEMPORAL_AND_UNIQUENESS` | `DermatologicServiceService.updateService` | `DermatologicServiceServiceTest` | **KILLED** | `DermatologicServiceServiceTest` | 6.48 | Bypass de unicidad excluyente de nombre de tratamiento al editar servicio |

---

## 3. Conclusión de Integridad y Blindaje

> **ESTADO: APROBADO AL 100% (MUTATION SCORE = 100%)**  
> Todos los mutantes sintéticos inyectados en las operaciones transaccionales críticas del backend fueron efectivamente detectados y abatidos por las pruebas unitarias. Cero mutantes supervivientes. El código productivo en `backend/src/main/` permanece 100% íntegro e inalterado.
