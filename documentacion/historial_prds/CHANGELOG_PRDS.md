# Registro Histórico de Versiones del PRD (Product Requirements Document)

**Proyecto:** Sistema Integral de Gestión Dermatológica, Estética y Asistente Virtual con IA  
**Estándar de Especificación:** *How I Spec* de Rivera (Formato de Ingeniería de Software)

---

## 📜 Historial de Revisiones

### 🔹 [Versión 6.0 (Master - Fase 6: Comprobantes Médicos & Consentimientos en PDF)](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/historial_prds/PRD_v6.0_Fase6_Documentos_PDF_Master.md)
- **Fecha:** 2026-08-22
- **Estado:** VIGENTE / MASTER
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - Incorporación del generador de **Comprobantes Oficiales de Turno e Impresión en PDF** (`AppointmentReceiptModal.tsx`) con desglose de seña del 50%, saldo restante, código QR de verificación e indicaciones pre-turno.
  - Implementación del documento de **Consentimiento Informado Médico-Legal** (`InformedConsentModal.tsx`) conforme a la Ley Nacional N° 26.529 con declaración jurada de antecedentes, riesgos informados, fototipo y firmas.
  - Integración del botón de comprobante e impresión en `BookingWizard.tsx`, `AgendaView.tsx` y `MedicalRecordView.tsx`.

---

### 🔹 [Versión 5.0 (Fase 5 - Pipelines CI/CD & Calidad Automatizada)](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/historial_prds/PRD_v5.0_Fase5_CICD_Calidad_Master.md)
- **Fecha:** 2026-08-22
- **Estado:** HISTÓRICO
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - Incorporación de **Pipelines Automatizados de Integración Continua (CI/CD)** en GitHub Actions (`backend-ci.yml` y `frontend-ci.yml`).
  - Ejecución obligatoria de la suite de pruebas unitarias JUnit 5 y validación estática de tipos TypeScript en cada push/PR.

---

### 🔹 [Versión 4.0 (Fase 4 - BPMN 2.0 & Casos de Uso Formales)](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/historial_prds/PRD_v4.0_Fase4_BPMN_CasosDeUso_Master.md)
- **Fecha:** 2026-08-22
- **Estado:** HISTÓRICO
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - Incorporación formal de **5 Diagramas de Procesos de Negocio en BPMN 2.0** (`PR-01` a `PR-05`).
  - Especificación formal de **8 Casos de Uso detallados** (`CU-01` a `CU-08`) y Matriz de Trazabilidad.

---

### 🔹 [Versión 3.0 (Fase 3 - Frontend UI/UX Avanzado & DevOps)](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/historial_prds/PRD_v3.0_Fase3_Frontend_DevOps_Master.md)
- **Fecha:** 2026-08-22
- **Estado:** HISTÓRICO
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - Visor Comparativo Antes/Después con slider horizontal (`BeforeAfterSlider.tsx`), línea de tiempo de auditoría médica (`AuditTimelineView.tsx`), panel de administración de servicios (`AdminServicesView.tsx`) y Dockerfile multi-stage.

---

### 🔹 [Versión 2.0 (Fase 2 - Backend, Storage & Tests)](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/historial_prds/PRD_v2.0_Fase2_Backend_Storage_Tests.md)
- **Fecha:** 2026-08-22
- **Estado:** HISTÓRICO
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - Algoritmo de cálculo de disponibilidad (`/citas/disponibilidad`), fotos con Supabase Storage (`imagen_hc`), tokens de 15 min (`password_reset_token`) y suite de tests unitarios JUnit 5.

---

### 🔹 [Versión 1.0 (Fase 1 - Especificación Inicial)](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/historial_prds/PRD_v1.0_Fase1_Inicial.md)
- **Fecha:** 2026-08-21
- **Estado:** HISTÓRICO
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - PRD inicial bajo la metodología *How I Spec* de Rivera, universo de discurso, objetivos O1-O6, ciclo de vida del turno y auditoría inmutable.
