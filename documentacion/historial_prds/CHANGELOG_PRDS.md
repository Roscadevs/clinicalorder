# Registro Histórico de Versiones del PRD (Product Requirements Document)

**Proyecto:** Sistema Integral de Gestión Dermatológica, Estética y Asistente Virtual con IA  
**Estándar de Especificación:** *How I Spec* de Rivera (Formato de Ingeniería de Software)

---

## 📜 Historial de Revisiones

### 🔹 [Versión 17.0 (Fase 17 - Blindaje de Dominio, Jerarquía Visual y Ergonomía del Chatbot Gemini)](PRD_Fase_17_Blindaje_Dominio_Ergonomia_Chatbot_Gemini.md)
- **Fecha:** 2026-10-12
- **Estado:** VIGENTE / IMPLEMENTADO
- **Autor:** Equipo de Producto, Seguridad de IA y Experiencia de Usuario
- **Cambios Principales:**
  - Blindaje estricto de dominio (*domain guardrails*) anti-jailbreak para declinar cortésmente solicitudes de código fuente, matemáticas y temas ajenos a la clínica.
  - Comprensión semántica de modismos financieros argentinos ("plata", "efectivo", "seña", "transferencia"), detallando el 50% de seña por MercadoPago y saldo en consultorio.
  - Protocolo de jerarquía visual y ergonomía en respuestas de precios divididas en 3 categorías (Consultas Médicas, Cuidado Facial, Armonización/Inyectables) evitando volcados masivos.
  - Corrección de identidad institucional en el mensaje de bienvenida y estado inicial del widget fijando a la Dra. Paula Villa Fuhrmann.

---

### 🔹 [Versión 16.0 (Fase 16 - Proxy Inverso en Vercel y Política de CORS en Producción)](PRD_Fase_16_Proxy_CORS_Chatbot_Vercel_Render.md)
- **Fecha:** 2026-10-12
- **Estado:** VIGENTE / IMPLEMENTADO
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - Configuración de proxy inverso transparente en Vercel (`vercel.json`) para reescribir `/api/(.*)` hacia el backend en Render, eliminando error HTTP 405 Method Not Allowed.
  - Ampliación de orígenes y comodines CORS en Spring Security (`SecurityConfig.java`) autorizando `https://clinicalorder.eliasdelcastillo.com` y subdominios de preview.
  - Configuración defensiva de fallback a URL de Render en `api.ts`.

---

### 🔹 [Versión 15.0 (Fase 15 - Hotfix Constructor GeminiApiClientAdapter en Deploy)](PRD_Fase_15_Hotfix_Constructor_GeminiApiClientAdapter_Deploy.md)
- **Fecha:** 2026-10-12
- **Estado:** VIGENTE / IMPLEMENTADO
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - Resolución definitiva de `BeanCreationException` y ambigüedad de constructores en Spring Boot 3 para despliegue en Render.
  - Anotación explícita `@Autowired`, eliminación de constructor redundante, fallbacks seguros y adición de test de integración en Spring IoC.

---

### 🔹 [Versión 14.0 (Fase 14 - Chatbot Cascada Multi-Modelo Gemini 50 RPM)](PRD_Fase_14_Chatbot_Cascada_MultiModelo_Gemini.md)
- **Fecha:** 2026-10-12
- **Estado:** VIGENTE
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - Arquitectura de resiliencia en cascada para 6 modelos Gemini (50 RPM combinadas) con failover automático ante 429/503.
  - Memoria conversacional en DTOs y frontend.

---

### 🔹 [Versión 13.0 (Fase 13 - Heurísticas de Usabilidad de Nielsen en README)](PRD_v13.0_Fase13_Heuristicas_Usabilidad_Nielsen_README.md)
- **Fecha:** 2026-10-12
- **Estado:** VIGENTE
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - Incorporación de la evaluación heurística de 10 principios de Jakob Nielsen en el `README.md`.
  - Mapeo punto por punto de cada heurística a componentes funcionales, validaciones, control de concurrencia y asistente IA.

---

### 🔹 [Versión 12.0 (Fase 12 - Seguridad Web & Blindaje Perimetral de Rutas)](PRD_v12.0_Fase12_Seguridad_Web_Path.md)
- **Fecha:** 2026-10-12
- **Estado:** VIGENTE
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - Blindaje perimetral de rutas en Spring Security y guardianes de ruta en React (`ProtectedRoute`).
  - StrictHttpFirewall, mitigación de path traversal y separación estricta de rutas públicas y privadas.

---

### 🔹 [Versión 11.0 (Fase 11 - Landing Page & Enrutamiento)](PRD_v11.0_Fase11_Landing_Login.md)
- **Fecha:** 2026-10-05
- **Estado:** VIGENTE
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - Separación de Landing comercial y aplicación clínica bajo `/app/*`.

---

### 🔹 [Versión 10.0 (Master Final - Fase 10: Diseño Mobile-First & Responsive UX)](PRD_v10.0_Fase10_Mobile_Responsive_Master.md)
- **Fecha:** 2026-08-22
- **Estado:** HISTÓRICO
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - Implementación de la **Barra de Navegación Inferior (*Bottom Tab Bar*)** para celulares (`BottomNav.tsx`) con zonas táctiles de 48x48 px.
  - Transformación de modales clínicos en **Bottom Sheets táctiles** deslizables desde el borde inferior de la pantalla.
  - **Carrusel de Días Horizontal (*Day Pills*)** táctil para la Agenda en móviles y grilla semanal de 7 columnas en escritorio.
  - **Soporte Táctil Multitouch** en el Visor *Antes / Después* (`BeforeAfterSlider.tsx`) con eventos `onTouchMove` y tirador de 44px.

---

### 🔹 [Versión 9.0 (Fase 9 - Guía de Defensa Oral & Demostración Integral)](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/historial_prds/PRD_v9.0_Fase9_Master_Defensa_Integral.md)
- **Fecha:** 2026-08-22
- **Estado:** HISTÓRICO
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - Guía estratégica de defensa oral de 7 minutos cronometrados y banco de 10 preguntas críticas de la cátedra con respuestas técnicas.

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
