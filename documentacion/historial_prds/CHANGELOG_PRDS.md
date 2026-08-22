# Registro Histórico de Versiones del PRD (Product Requirements Document)

**Proyecto:** Sistema Integral de Gestión Dermatológica, Estética y Asistente Virtual con IA  
**Estándar de Especificación:** *How I Spec* de Rivera (Formato de Ingeniería de Software)

---

## 📜 Historial de Revisiones

### 🔹 [Versión 8.0 (Master - Fase 8: Recordatorios Multicanal & Sincronización de Calendarios)](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/historial_prds/PRD_v8.0_Fase8_Recordatorios_Calendario_Master.md)
- **Fecha:** 2026-08-22
- **Estado:** VIGENTE / MASTER
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - Implementación del generador de eventos para **Google Calendar** en 1 clic y exportación de archivos **iCalendar (.ics)** estándar RFC 5545 para **Apple Calendar y Microsoft Outlook** con alarmas programadas de 24 hs y 2 hs previas (`calendarGenerator.ts`).
  - Modal interactivo de **Recordatorios y Notificaciones Multicanal** (`ReminderNotificationModal.tsx`) con simulación de WhatsApp / Push y botón de confirmación de asistencia.
  - Integración de los botones de agendamiento en el `BookingWizard.tsx`, `AppointmentReceiptModal.tsx` y `AgendaView.tsx`.

---

### 🔹 [Versión 7.0 (Fase 7 - Dashboard Analítico & Métricas de Gestión KPIs)](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/historial_prds/PRD_v7.0_Fase7_Dashboard_KPIs_Master.md)
- **Fecha:** 2026-08-22
- **Estado:** HISTÓRICO
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - Dashboard de Analítica y KPIs Clínico-Financieros (`AnalyticsDashboardView.tsx`) con métricas de facturación bruta (\$5.840.000 ARS), reducción del absentismo del 35% al 4.2% y selector de roles RBAC.

---

### 🔹 [Versión 6.0 (Fase 6 - Comprobantes Médicos & Consentimientos en PDF)](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/historial_prds/PRD_v6.0_Fase6_Documentos_PDF_Master.md)
- **Fecha:** 2026-08-22
- **Estado:** HISTÓRICO
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - Comprobantes Oficiales de Turno con QR (`AppointmentReceiptModal.tsx`) y Consentimiento Informado Ley 26.529 (`InformedConsentModal.tsx`).

---

### 🔹 [Versión 5.0 (Fase 5 - Pipelines CI/CD & Calidad Automatizada)](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/historial_prds/PRD_v5.0_Fase5_CICD_Calidad_Master.md)
- **Fecha:** 2026-08-22
- **Estado:** HISTÓRICO
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - Pipelines de Integración Continua (CI/CD) en GitHub Actions (`backend-ci.yml` y `frontend-ci.yml`).

---

### 🔹 [Versión 4.0 (Fase 4 - BPMN 2.0 & Casos de Uso Formales)](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/historial_prds/PRD_v4.0_Fase4_BPMN_CasosDeUso_Master.md)
- **Fecha:** 2026-08-22
- **Estado:** HISTÓRICO
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - 5 Diagramas de Procesos de Negocio en BPMN 2.0 (`PR-01` a `PR-05`) y 8 Casos de Uso detallados (`CU-01` a `CU-08`).

---

### 🔹 [Versión 3.0 (Fase 3 - Frontend UI/UX Avanzado & DevOps)](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/historial_prds/PRD_v3.0_Fase3_Frontend_DevOps_Master.md)
- **Fecha:** 2026-08-22
- **Estado:** HISTÓRICO
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - Visor Antes/Después con slider horizontal, línea de tiempo de auditoría y Dockerfile multi-stage.

---

### 🔹 [Versión 2.0 (Fase 2 - Backend, Storage & Tests)](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/historial_prds/PRD_v2.0_Fase2_Backend_Storage_Tests.md)
- **Fecha:** 2026-08-22
- **Estado:** HISTÓRICO
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - Disponibilidad de slots en tiempo real, fotos en Supabase Storage y suite de tests JUnit 5.

---

### 🔹 [Versión 1.0 (Fase 1 - Especificación Inicial)](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/historial_prds/PRD_v1.0_Fase1_Inicial.md)
- **Fecha:** 2026-08-21
- **Estado:** HISTÓRICO
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - PRD inicial bajo la metodología *How I Spec* de Rivera, universo de discurso, objetivos O1-O6, ciclo de vida del turno y auditoría inmutable.
