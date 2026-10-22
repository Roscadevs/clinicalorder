# 🛠️ Plan Técnico de Implementación - Fase 13: Evaluación Heurística de Usabilidad (10 Principios de Jakob Nielsen) en el README

**Objetivo:** Integrar formalmente en el archivo [`README.md`](../README.md) la evaluación de Interacción Humano-Computadora (HCI / UX) basada en los **10 Principios Heurísticos de Jakob Nielsen**, mapeando cada principio a los componentes frontend, mecanismos de backend, control de concurrencia y auditoría médica de la **Clínica Dra. Valeria**.

---

## 1. Resumen Ejecutivo y Arquitectura de Usabilidad

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                       10 HEURÍSTICAS DE USABILIDAD (JAKOB NIELSEN)                           │
└──────────────────────────────────────────────┬───────────────────────────────────────────────┘
                                               │ Mapeo Arquitectónico
       ┌───────────────────────────────────────┴───────────────────────────────────────┐
       ▼                                                                               ▼
┌──────────────────────────────────────────────┐ ┌─────────────────────────────────────────────┐
│             FRONTEND (REACT 18 / TS)         │ │         BACKEND (SPRING BOOT 3 / JPA)       │
│                                              │ │                                             │
│ H1: Visibilidad del Estado                   │ │ H1: Estado de cita en tiempo real           │
│   - Countdown TTL 10 min en reserva          │ │   - GET /citas/{id}/estado                  │
│   - Stepper de 4 pasos & loaders             │ │   - Webhook de MercadoPago con feedback     │
│ H2: Mundo Real & Lenguaje Médico             │ │ H2: Modelo de datos clínico realista        │
│   - Fototipos Fitzpatrick (I a VI)           │ │   - Anamnesis estructurada y patologías     │
│   - Consentimientos Ley 26.529               │ │ H5: Prevención de Errores en Backend        │
│ H3: Control y Salidas de Emergencia          │ │   - Concurrencia optimista @Version         │
│   - Botones "Atrás", cancelar reserva        │ │   - Jakarta Validation (@Valid en DTOs)     │
│   - Bottom Sheets deslizables para cerrar    │ │   - Lock temporal de 10 min por TTL         │
│ H4: Consistencia y Estándares                │ │ H9: Manejo Amigable de Errores              │
│   - Zonas táctiles 48x48 px (WCAG 2.1 AA)    │ │   - RFC 7807 ProblemDetail en español       │
│   - Iconografía Lucide y diseño Tailwind     │ │   - Supresión de stack traces de Java       │
│ H5: Prevención Activa de Errores             │ │ H10: Asistencia Inteligente                 │
│   - Inhabilitación de fechas pasadas         │ │   - POST /chat/gemini (Gemini 1.5 Flash)    │
│   - Validación en tiempo real con Zod        │ │                                             │
│ H6: Reconocer antes que Recordar             │ └──────────────────────┬──────────────────────┘
│   - Catálogo visual de tratamientos con foto │                        │
│   - Carrusel de días táctil (*Day Pills*)    │                        ▼
│   - Visor Antes/Después interactivo táctil   │ ┌─────────────────────────────────────────────┐
│ H7: Flexibilidad y Eficiencia                │ │         BASE DE DATOS & AUDITORÍA           │
│   - Simulador RBAC en 1 clic (4 roles)       │ │                                             │
│   - Sincronización Google Calendar & .ics    │ │ - entrada_hc_audit (clinical_entries_audit):│
│ H8: Estética y Minimalismo                   │ │   Invariante legal inmutable protegido      │
│   - Layout clínico armónico y sin ruido      │ │ - Índices y claves únicas para integridad   │
│   - Métricas y KPIs concisos en Dashboard    │ └─────────────────────────────────────────────┘
│ H9: Diagnóstico y Recuperación de Errores    │
│   - Mensajes contextuales con guía de acción │
│ H10: Ayuda y Documentación Contextual        │
│   - Chatbot Gemini 1.5 Flash flotante 24/7   │
│   - Comprobantes descargables con QR         │
└──────────────────────────────────────────────┘
```

---

## 2. Base de Datos (Flyway, JPA, Índices e Invariantes)

### 2.1 Concurrencia Optimista (`@Version`) como Salvaguarda de Usabilidad (H5)
* **Principio H5 (Prevención de Errores):** En un consultorio médico con concurrencia de roles (la secretaria en recepción y la médica en consultorio), la edición concurrente de un turno o de la historia clínica podría causar sobrescrituras inadvertidas (*lost updates*).
* **Implementación:**
  * Las entidades JPA `Appointment` y `MedicalRecord` contienen la anotación `@Version private Long version;`.
  * Si dos usuarios intentan actualizar el mismo registro simultáneamente, Hibernate detecta la colisión mediante `OptimisticLockingFailureException`, devolviendo un código HTTP 409 con mensaje legible bajo RFC 7807 (H9) en lugar de corromper los datos.

### 2.2 Candado Lógico de Reserva Temporal (H1 y H5)
* El bloqueo temporal de turnos con TTL de 10 minutos asegura que ningún otro paciente pueda reservar el mismo horario mientras el proceso de pago está en curso en MercadoPago.
* Si el tiempo expira, el sistema libera automáticamente la franja horaria mediante un job programado (`AppointmentCleanupScheduler`).

### 2.3 Invariante Crítico de Auditoría Médica (`clinical_entries_audit`)
* **Invariabilidad:** Cualquier interacción en la historia clínica (creación o evolución) se registra de manera inmutable en `entrada_hc_audit` con timestamp, ID de la médica y payload íntegro.
* La formalización de las heurísticas en el `README.md` documenta expresamente esta garantía para cumplir con la **Ley Nacional 26.529 de Derechos del Paciente**.

---

## 3. Backend (Spring Boot 3, Servicios y Controladores RFC 7807)

### 3.1 Visibilidad del Estado en Tiempo Real (H1)
* Endpoints REST dedicados que informan el estado exacto de las operaciones:
  * `GET /api/v1/citas/{id}/estado`: Devuelve el estado actual (`PENDIENTE`, `CONFIRMADA`, `CANCELADA`) para actualizar la UI del paciente.
  * `POST /api/v1/pagos/webhook`: Procesa notificaciones de MercadoPago y transiciona el turno inmediatamente a `CONFIRMADA`.

### 3.2 Prevención de Errores y Validación Estricta (H5)
* Los controladores anotados con `@Valid` interceptan datos anómalos antes de que alcancen los servicios de dominio:
  * Validaciones de formato de email, longitud de DNI y teléfono, y fechas no pasadas.

### 3.3 Diagnóstico y Recuperación de Errores bajo RFC 7807 (H9)
* El componente `GlobalExceptionHandler` intercepta todas las excepciones (`MethodArgumentNotValidException`, `ResourceNotFoundException`, `BusinessRuleException`, etc.) y las transforma en una estructura `ProblemDetail`:
  * `title`: Descripción breve en español (ej. "Conflicto de Horario").
  * `detail`: Mensaje de orientación que indica cómo subsanar el error (ej. "El horario seleccionado ya ha sido reservado. Por favor, seleccione otro horario disponible.").
  * **Ocultación total de trazas:** No se exponen stack traces internos ni nombres de clases Java al cliente.

### 3.4 Asistencia Inteligente 24/7 (H10)
* Controlador `GeminiChatController` (`POST /api/v1/chat/gemini`):
  * Atiende consultas de pacientes en lenguaje natural las 24 horas sobre tratamientos dermatológicos, precios y cuidados previos, integrando un enlace directo hacia el asistente de reserva de turnos.

---

## 4. Frontend (React 18, TanStack Query, Tailwind y Ergonomía Táctil)

### 4.1 Mapeo de Componentes por Heurística de Nielsen

| Heurística | Componente React Clave | Mecanismo de UX / Ergonomía |
| :--- | :--- | :--- |
| **H1: Visibilidad del estado** | `TurnoModal.tsx`, `CitasCalendar.tsx` | Indicador visual de progreso en 4 pasos, contador TTL de 10 min, spinners en botones (`Button.tsx`), toasts de confirmación inmediata. |
| **H2: Coincidencia con mundo real** | `MedicalHistoryView.tsx`, `InformedConsentModal.tsx` | Uso de fototipos de Fitzpatrick (I al VI), anamnesis estética estructurada, consentimiento informado según Ley 26.529, iconografía Lucide común. |
| **H3: Control y libertad** | `TurnoModal.tsx`, `Modal.tsx`, `BottomNav.tsx` | Botones "Atrás" en cada paso del wizard, cancelar reserva, cierre por tecla `Esc` y clic externo, modales convertidos en *Bottom Sheets* deslizables en móviles. |
| **H4: Consistencia y estándares** | Componentes UI (`ui/index.ts`), `BottomNav.tsx` | Botones y modales consistentes, zonas táctiles mínimas de 48x48 px (WCAG 2.1 AA), barra de navegación fija en la zona del pulgar (*Thumb Zone*). |
| **H5: Prevención de errores** | `TurnoModal.tsx`, esquemas Zod | Inhabilitación de fechas pasadas y fines de semana no laborables en el calendario, validación en tiempo real antes de permitir avanzar de paso. |
| **H6: Reconocer antes que recordar** | `TurnoModal.tsx`, `BeforeAfterSlider.tsx` | Catálogo visual de tratamientos con tarjetas e imágenes ilustrativas, selector deslizable de días (*Day Pills*), comparador interactivo Antes/Después táctil. |
| **H7: Flexibilidad y eficiencia** | `Navbar.tsx`, `calendarGenerator.ts` | Simulador rápido de roles RBAC en 1 clic (Paciente / Secretaria / Médica / Admin), filtros rápidos en agenda, agendamiento en 1 clic en Google Calendar y `.ics`. |
| **H8: Estética y minimalismo** | `AnalyticsDashboardView.tsx`, layouts | Paleta médica relajante (verde esmeralda, blanco clínico), tarjetas con jerarquía tipográfica clara, eliminación de datos innecesarios en pantalla. |
| **H9: Recuperación de errores** | `api.ts`, formularios Zod | Mensajes en español junto al campo afectado (ej. "Ingrese un teléfono válido de 10 dígitos"), reintento guiado si MercadoPago falla. |
| **H10: Ayuda y documentación** | `GeminiChatbotWidget.tsx`, `AppointmentReceiptModal.tsx` | Asistente virtual flotante con IA (Gemini 1.5 Flash), comprobante con código QR y recomendaciones previas a la consulta, índice de documentación en el repositorio. |

---

## 5. Modificaciones Específicas en el Archivo `README.md`

### 5.1 Actualización del Índice (`📖 Índice`)
* Se insertará la nueva entrada:
  `- [🎨 Evaluación Heurística de Usabilidad (10 Principios de Jakob Nielsen)](#-evaluación-heurística-de-usabilidad-10-principios-de-jakob-nielsen)`
* Se organizarán los anclas para garantizar navegación fluida.

### 5.2 Nueva Sección: `🎨 Evaluación Heurística de Usabilidad (10 Principios de Jakob Nielsen)`
* Se añadirá inmediatamente después de la sección `## ✨ Visión General & Propósito`.
* Contendrá:
  1. Tabla sinóptica de las 10 heurísticas cruzadas con los módulos del sistema.
  2. Detalle exhaustivo de cada principio con ejemplos concretos de diseño, ergonomía táctil y arquitectura.
  3. Relación de la usabilidad con los candados de seguridad y la auditoría legal (`clinical_entries_audit`).

### 5.3 Actualización de Fases en `🗂️ Documentación Organizada por Fases`
* Incorporación de las fases recientes en la lista de documentación:
  * Fase 12: Seguridad Web por Path y Defensa en Profundidad.
  * Fase 13: Evaluación Heurística de Usabilidad de Nielsen en Documentación y README.

---

## 6. Pruebas y Verificación Requeridas

1. **Integridad del Backend (Java / Spring Boot 3):**
   * Ejecución de suite de tests unitarios:
     ```bash
     mvn test
     ```
   * Asegurar que no se rompa ninguna aserción existente en `MedicalRecordServiceTest`, `AppointmentServiceTest` ni en la auditoría inmutable.
2. **Integridad del Frontend (TypeScript / Vite):**
   * Verificación estática de tipos:
     ```bash
     npm run build --prefix frontend
     ```
   * Asegurar código de salida 0 (sin errores tipográficos ni discrepancias en componentes).
3. **Validación de Enlaces y Formato Markdown:**
   * Comprobar que los enlaces a archivos locales dentro del `README.md` apunten a rutas existentes.
