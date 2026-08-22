# Registro Histórico de Versiones del PRD (Product Requirements Document)

**Proyecto:** Sistema Integral de Gestión Dermatológica, Estética y Asistente Virtual con IA  
**Estándar de Especificación:** *How I Spec* de Rivera (Formato de Ingeniería de Software)

---

## 📜 Historial de Revisiones

### 🔹 [Versión 9.0 (Master Final - Fase 9: Guía de Defensa Oral & Demostración Integral)](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/historial_prds/PRD_v9.0_Fase9_Master_Defensa_Integral.md)
- **Fecha:** 2026-08-22
- **Estado:** VIGENTE / MASTER FINAL
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - Consolidación del ciclo de vida completo de ingeniería de software.
  - Incorporación de la **Guía Estratégica de Defensa Oral y Demostración Cronometrada de 7 minutos** (`GUIA_DE_DEFENSA_Y_DEMOSTRACION.md`).
  - Banco de 10 preguntas críticas de la cátedra con respuestas técnicas fundamentadas (Concurrencia `@Version`, transacciones ACID, 3FN/BCNF, Ley 26.529 y Secreto Médico, Docker y CI/CD).

---

### 🔹 [Versión 8.0 (Fase 8 - Recordatorios Multicanal & Sincronización de Calendarios)](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/historial_prds/PRD_v8.0_Fase8_Recordatorios_Calendario_Master.md)
- **Fecha:** 2026-08-22
- **Estado:** HISTÓRICO
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - Integración de **Google Calendar** en 1 clic y estándar **iCalendar (.ics)** RFC 5545 con alarmas a las -24h y -2h (`calendarGenerator.ts`).
  - Modal interactivo de **Recordatorios WhatsApp / Push** (`ReminderNotificationModal.tsx`).

---

### 🔹 [Versión 7.0 (Fase 7 - Dashboard Analítico & Métricas de Gestión KPIs)](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/historial_prds/PRD_v7.0_Fase7_Dashboard_KPIs_Master.md)
- **Fecha:** 2026-08-22
- **Estado:** HISTÓRICO
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - Dashboard de Analítica y KPIs Clínico-Financieros (`AnalyticsDashboardView.tsx`) con métricas de facturación (\$5.840.000 ARS), reducción de absentismo (35% a 4.2%) y selector de roles RBAC.

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
