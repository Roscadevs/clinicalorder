# PRD v2.0: Sistema Integral de Gestión Dermatológica, Estética y Asistente IA (Fase 2)

**Autor:** Equipo de Arquitectura & Desarrollo  
**Fecha de Publicación:** 2026-08-22 · **Versión:** 2.0 (Fase 2)  
**Estado:** Histórico (Superado por v3.0) · **Metodología:** *How I Spec* (Rivera)

---

## 0. Encabezado y Control de Cambios v2.0
En esta revisión v2.0 se incorporan los requerimientos técnicos y de calidad desarrollados durante la **Fase 2**:
1. **Cálculo dinámico de slots libres en tiempo real** (`/citas/disponibilidad`) descontando turnos en curso, bloqueos temporales activos y vacaciones/feriados.
2. **Subida y gestión de fotos médicas** (`imagen_hc`) en Supabase Storage con validación de tipo MIME y generación de URLs seguras.
3. **Flujo de recuperación de contraseñas** (`password_reset_token`) con tokens criptográficos de un solo uso y 15 minutos de TTL.
4. **Servicio desacoplado de notificaciones por email** para comprobantes de reserva y enlaces de restablecimiento de contraseña.
5. **Suite de pruebas unitarias automatizadas** con JUnit 5 y Mockito.

---

## 1. Resumen: El Antes y el Después
- **Antes (v1.0):** Los horarios eran fijos y no se calculaba dinámicamente la duración ni la antelación mínima; las fotos médicas no tenían adaptador de almacenamiento en la nube; el reset de clave no estaba automatizado.
- **Después (v2.0):** Disponibilidad calculada al milisegundo según el catálogo del servicio y antelación de 2 horas; fotos médicas almacenadas de forma segura en Supabase Storage; recuperación de cuenta automatizada por token y cobertura de pruebas unitarias superior al 85% en servicios críticos.

---

## 2. Historias de Usuario Ampliadas (Fase 2)

### Historia: La Dra. Valeria y el Registro Fotográfico Seguro
> *"Como médica dermatóloga, necesito subir fotos de alta resolución del rostro de mis pacientes antes de iniciar un protocolo de peeling químico o toxina botulínica, para evaluar la evolución estética a lo largo de las semanas sin que esas imágenes se mezclen con mi galería personal de WhatsApp o queden desprotegidas."*

### Historia: Sofía y la Recuperación Rápida de Clave
> *"Como secretaria del consultorio, si olvido mi contraseña al inicio de la jornada laboral, necesito ingresar mi correo electrónico corporativo y recibir un enlace seguro de 15 minutos para restablecerla de inmediato sin depender de que el Administrador tenga que modificar la base de datos manualmente."*

---

## 3. Especificación de Nuevos Endpoints y Transacciones

### 3.1. Consulta Dinámica de Disponibilidad (`GET /citas/disponibilidad`)
- **Parámetros:** `fecha` (ISO Date), `servicioId` (Long).
- **Invariante:** Los turnos solo se pueden agendar entre las 09:00 y las 19:00 hs con al menos 2 horas de anticipación a la hora actual.
- **Respuesta:**
  ```json
  [
    { "startTime": "2026-08-25T15:00:00Z", "endTime": "2026-08-25T15:45:00Z", "timeDisplay": "15:00 hs", "available": true },
    { "startTime": "2026-08-25T15:30:00Z", "endTime": "2026-08-25T16:15:00Z", "timeDisplay": "15:30 hs", "available": false }
  ]
  ```

### 3.2. Subida de Fotos Médicas (`POST /historias-clinicas/{id}/fotos`)
- **Headers:** `Content-Type: multipart/form-data`, `Authorization: Bearer <JWT-Médica>`.
- **Validaciones:**
  - `file.size <= 5MB`.
  - `contentType IN ('image/jpeg', 'image/png', 'image/webp')`.
- **Destino:** Supabase Storage Bucket `photos` en `{patientId}/{uuid}.{ext}`.

### 3.3. Recuperación de Contraseña (`POST /auth/forgot-password` y `POST /auth/reset-password`)
- **Invariante de Seguridad:** Token de 32 caracteres hexadecimales, un solo uso (`used = false`) y caducidad estricta a los 15 minutos. Al actualizar la contraseña, la cuenta se desbloquea (`failed_login_attempts = 0`, `locked_until = null`).

---

## 4. Cobertura de Calidad y Pruebas Unitarias (JUnit 5 + Mockito)
- `AppointmentServiceTest`: 4 casos de prueba (Reserva temporal, colisión de slots, liberación programada, cálculo de disponibilidad).
- `AuthServiceTest`: 5 casos de prueba (Login exitoso, error de clave, bloqueo por fuerza bruta, token de 15 min, reset de contraseña).
- `PaymentServiceTest`: 2 casos de prueba (Webhook aprobado, liquidación de saldo en mostrador).
- `MedicalRecordServiceTest`: 3 casos de prueba (Creación inicial, auditoría inmutable JSON, nota de evolución).
