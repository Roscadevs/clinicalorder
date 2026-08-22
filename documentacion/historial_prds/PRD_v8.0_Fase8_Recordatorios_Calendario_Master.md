# PRD v8.0 (Master): Sistema Integral Dermatológico, Estética y Asistente IA con Recordatorios Multicanal & Sincronización con Calendarios (Google / Apple / Outlook)

**Autor:** Equipo de Arquitectura & Desarrollo  
**Fecha:** 2026-08-22 · **Versión:** 8.0 (Master / Vigente)  
**Estado:** VIGENTE · **Metodología:** *How I Spec* (Rivera)  
**Cátedra:** Ingeniería del Software II — Entrega I & II

---

## 0. Encabezado & Novedades de la Versión 8.0
En esta revisión v8.0 se integra el **Sistema de Recordatorios Multicanal y Sincronización de Calendarios**:
1. **Agendamiento en 1 Clic con Google Calendar (`calendarGenerator.ts`):**
   - Creación de eventos enriquecidos con fecha, hora exacta, dirección de la clínica e indicaciones previas al procedimiento.
2. **Exportación Universal a Apple Calendar y Microsoft Outlook en Formato `.ics` (RFC 5545):**
   - Archivos estándar iCalendar con dos niveles de alarmas automatizadas (`VALARM: -24h` y `VALARM: -2h`).
3. **Simulador de Recordatorios Push & WhatsApp (`ReminderNotificationModal.tsx`):**
   - Interfaz de aviso interactivo con botón de confirmación de asistencia en tiempo real.
4. **Blindaje de Tipado TypeScript y Verificación Continua:**
   - 100% de cumplimiento estático verificado en compilación local y en pipelines de GitHub Actions.

---

## 1. El Resumen: Hoy vs Después

| Dimensión | Hoy (Proceso Manual / Fragmentado) | Después (Con el Sistema Integrado) |
| :--- | :--- | :--- |
| **Reserva de Citas** | WhatsApp informal sin horario exacto ni cobro de seña. | Wizard público con cálculo de disponibilidad real y retención de 10 min. |
| **Garantía Financiera** | No-shows de más del 30% con pérdida económica de insumos. | Seña del 50% requerida vía MercadoPago Checkout Pro. |
| **Calendario del Paciente** | El paciente debe anotar la fecha manualmente arriesgando olvidos. | Agendado en 1 clic en Google Calendar o Apple Calendar con alarmas -24h y -2h. |
| **Recordatorios** | La secretaria debe enviar mensajes uno por uno manualmente. | Simulador y generador automático de avisos WhatsApp / Push con confirmación. |
| **Métricas de Gestión** | Sin estadísticas de tratamientos ni control de absentismo. | Dashboard de KPIs en tiempo real con tasa de asistencia del 95.8%. |
| **Comprobantes de Pago** | Mensajes de chat desordenados sin validez formal. | Comprobante oficial imprimible en PDF con código QR y desglose de saldo. |
| **Consentimiento Legal** | Hojas sueltas de papel que se extravían en carpetas físicas. | Consentimiento estructurado digital conforme a la Ley 26.529 exportable en PDF. |
| **Historia Clínica** | Fichas en papel sin registro de modificaciones ni fotos seguras. | Ficha estructurada 1:1 en Supabase con auditoría inmutable e imágenes seguras. |
| **Comparativa de Resultados** | Fotos en el celular de la médica sin fecha ni control. | Visor interactivo "Antes y Después" con slider comparativo en pantalla. |
| **Atención al Paciente** | Mensajes de WhatsApp sin responder fuera de horario. | Chatbot 24/7 con Google Gemini para resolver dudas y tarifas. |
| **Aseguramiento de Calidad** | Pruebas manuales propensas a errores y regresiones. | Pipelines de CI/CD automáticos con GitHub Actions en cada commit. |

---

## 2. Historias de Usuario Principales

1. **Paciente (Lucía):** Reserva su cita de Peeling, paga la seña del 50% en MercadoPago y pulsa "Agendar en Calendario", importando el evento a su Google Calendar con recordatorio automático para el día previo.
2. **Secretaria (Sofía):** Revisa la agenda matutina y pulsa el ícono de la campanita para enviar el recordatorio del turno del día siguiente con las indicaciones pre-tratamiento.
3. **Médica (Dra. Valeria):** Atiende a la paciente puntual, registra las observaciones en su historia clínica auditada y revisa las fotos comparativas de control.
4. **Administrador General:** Evalúa la reducción de cancelaciones en el Dashboard Analítico y mantiene la vigencia de los pipelines de CI/CD.

---

## 3. Arquitectura Transaccional y Reglas de Integridad

1. **Bloqueo Temporal por TTL:** Cita en `PENDING_PAYMENT` con `temporary_hold_deadline = NOW() + 10 min` y liberación automática por `@Scheduled`.
2. **Control de Concurrencia Optimista:** `@Version` en `Appointment` para prevenir sobreturnos simultáneos.
3. **Auditoría Médica Atómica:** Inserción inmutable en `historia_clinica_audit` ante cada actualización de la ficha.
4. **Estándar iCalendar (RFC 5545):** Compatibilidad multiplataforma con Google, Apple, Android y Windows Outlook.
5. **Seguridad RBAC:** Las secretarias no acceden a historias clínicas ni notas de evolución médica.
6. **Calidad Continua:** GitHub Actions ejecuta `mvn test` y `tsc --noEmit` en cada push a `main`.

---

## 4. Estructura de Módulos del Sistema

1. **Módulo 1: Portal y Asistente IA (Público):** Landing + Chatbot Gemini + Catálogo.
2. **Módulo 2: Reserva, Señas y Comprobantes:** Wizard 4 pasos + MercadoPago Checkout Pro + Comprobante PDF con QR.
3. **Módulo 3: Sincronización de Calendarios & Recordatorios:** Google Calendar URL + Archivo .ics (RFC 5545) + WhatsApp/Push.
4. **Módulo 4: Agenda y Cobros en Mostrador:** Vista diaria/semanal + Liquidación de saldos + Envío de avisos.
5. **Módulo 5: Historia Clínica y Consentimiento:** Ficha estructurada + Consentimiento Ley 26.529 + Supabase Storage + Visor Antes/Después.
6. **Módulo 6: Auditoría y Trazabilidad Médica:** Historial inmutable de versiones y diffs JSON.
7. **Módulo 7: Administración y Métricas de Gestión:** Dashboard de KPIs + Control de tarifas + RBAC + CI/CD.
