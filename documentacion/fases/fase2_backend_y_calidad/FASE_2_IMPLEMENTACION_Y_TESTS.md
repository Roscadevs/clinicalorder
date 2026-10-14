# Documento de Implementación y Tests — Fase 2 (Backend Avanzado y Calidad)

**Proyecto:** Sistema Integral de Gestión Dermatológica y Estética con Inteligencia Artificial  
**Fase:** Fase 2 · **Fecha:** 2026-08-22  
**Objetivo:** Extender la lógica del Backend en Spring Boot 3.2+ / Java 17 para incorporar el cálculo dinámico de franjas horarias en tiempo real, almacenamiento de fotografías médicas en Supabase Storage, flujo completo de recuperación de contraseñas por token temporal y suite de pruebas unitarias automatizadas con JUnit 5 y Mockito.

---

## 1. Módulos Implementados en Fase 2

### 1.1. Cálculo Dinámico de Disponibilidad (`/citas/disponibilidad`)
- **Clase:** `AppointmentService.java`
- **Lógica de Negocio:**
  - Franjas de atención de Lunes a Sábado de **09:00 a 19:00 hs** en intervalos configurables de 30 minutos.
  - Antelación mínima obligatoria: **2 horas** a partir del momento actual (`NOW() + 2h`).
  - Algoritmo de filtrado que evalúa la duración del tratamiento (`durationMinutes`) y descarta slots que colisionen con:
    1. Citas confirmadas (`CONFIRMED`) o completadas (`COMPLETED`).
    2. Bloqueos temporales activos (`PENDING_PAYMENT` con menos de 10 minutos de antigüedad).
    3. Bloqueos de calendario de la clínica (`bloqueo_calendario`).
- **Endpoint:** `GET /api/v1/citas/disponibilidad?fecha=YYYY-MM-DD&servicioId=X`
- **Respuesta:** Lista de objetos `TimeSlotDTO` (`startTime`, `endTime`, `timeDisplay`, `available`).

### 1.2. Módulo de Fotografías Médicas (`imagen_hc` + Supabase Storage)
- **Clases:** `ClinicalImageService.java`, `SupabaseStorageAdapter.java`, `ClinicalImageRepositoryAdapter.java`
- **Lógica de Negocio:**
  - Recepción de archivos binarios *Multipart* (`.jpg`, `.png`, `.webp`).
  - Validación de tamaño máximo permitido (< 5 MB) y tipo MIME cutáneo.
  - Almacenamiento en el bucket privado `photos` de Supabase Storage bajo la convención `{pacienteId}/{uuid}.{ext}`.
  - Generación de URLs seguras para renderizado de fotografías en la historia clínica.
  - Registro de metadatos clínicos (nombre original, tamaño, descripción de la toma y fecha).
- **Endpoints:**
  - `POST /api/v1/historias-clinicas/{id}/fotos` (Consumes `multipart/form-data`)
  - `GET /api/v1/historias-clinicas/{id}/fotos`
- **Seguridad:** Restringido a usuarias con rol `PHYSICIAN`.

### 1.3. Recuperación de Contraseña por Token Temporal (`password_reset_token`)
- **Clases:** `AuthService.java`, `PasswordResetTokenRepositoryAdapter.java`, `EmailNotificationService.java`
- **Lógica de Negocio:**
  - `forgotPassword`: Genera un token aleatorio criptográfico único con **TTL de 15 minutos** y dispara notificación por correo electrónico.
  - `resetPassword`: Valida la existencia del token, verifica que no esté usado (`used = false`) ni expirado (`NOW() < expiresAt`), actualiza la contraseña con un nuevo hash BCrypt (costo 12), desbloquea la cuenta y marca el token como consumido de forma atómica.
- **Endpoints:**
  - `POST /api/v1/auth/forgot-password`
  - `POST /api/v1/auth/reset-password`

### 1.4. Servicio Desacoplado de Notificaciones (`EmailNotificationService`)
- Componente que gestiona el envío de comprobantes de reserva de turno y enlaces de recuperación de contraseña con plantillas HTML y fallback a logs de depuración para desarrollo.

---

## 2. Suite de Pruebas Unitarias Automatizadas (JUnit 5 + Mockito)

Se implementaron 4 suites de pruebas unitarias cubriendo la lógica crítica del negocio:

```
backend/src/test/java/com/clinicadermatologica/app/application/
├── AppointmentServiceTest.java       # Pruebas de turnos, bloqueos de 10 min, disponibilidad y scheduler
├── AuthServiceTest.java              # Pruebas de login, fuerza bruta (5 intentos) y reset de password
├── PaymentServiceTest.java           # Pruebas de webhook MercadoPago (approved/rejected) y saldo en mostrador
└── MedicalRecordServiceTest.java     # Pruebas de historia clínica y creación de pistas de auditoría JSON
```

### Resumen de Casos de Prueba

| Suite de Test | Caso de Prueba | Comportamiento Verificado |
| :--- | :--- | :--- |
| `AppointmentServiceTest` | `testBookTemporaryHold_Success` | Valida reserva temporal con deadline a 10 min, cálculo exacto de seña del 50% y persistencia. |
| `AppointmentServiceTest` | `testBookTemporaryHold_SlotUnavailable` | Comprueba que arroje `SlotUnavailableException` si el horario está ocupado y no guarde la cita. |
| `AppointmentServiceTest` | `testReleaseExpiredHoldsScheduler` | Valida que el `@Scheduled` actualice masivamente a `PAYMENT_FAILED` las citas expiradas. |
| `AppointmentServiceTest` | `testGetAvailableSlots` | Comprueba el cálculo dinámico de franjas horarias libres. |
| `AuthServiceTest` | `testLogin_Success` | Valida autenticación con credenciales válidas y generación de JWT. |
| `AuthServiceTest` | `testLogin_WrongPassword_IncrementsAttempts` | Comprueba incremento del contador de intentos fallidos. |
| `AuthServiceTest` | `testLogin_FiveAttempts_LocksAccount` | Valida bloqueo temporal de la cuenta por 15 minutos tras 5 intentos fallidos. |
| `AuthServiceTest` | `testForgotPassword_Success` | Comprueba generación de token criptográfico de 15 minutos y envío de correo. |
| `AuthServiceTest` | `testResetPassword_Success` | Valida actualización de contraseña con BCrypt e invalidación del token consumido. |
| `PaymentServiceTest` | `testProcessWebhook_Approved` | Comprueba que webhook aprobado cambie la cita a `CONFIRMED` y libere el candado temporal. |
| `PaymentServiceTest` | `testRegisterFinalPayment_Success` | Valida cobro de saldo en mostrador y cierre formal del turno a `COMPLETED`. |
| `MedicalRecordServiceTest` | `testSaveInitialMedicalRecord` | Comprueba alta inicial de ficha médica estructurada 1:1. |
| `MedicalRecordServiceTest` | `testUpdateMedicalRecord_GeneratesAudit` | Valida que cada edición guarde un snapshot inmutable en `historia_clinica_audit`. |
| `MedicalRecordServiceTest` | `testAddClinicalEntry_Success` | Valida registro de evolución clínica ligada al identificador del turno. |
