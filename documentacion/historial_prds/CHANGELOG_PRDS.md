# Registro Histórico de Versiones del PRD (Product Requirements Document)

**Proyecto:** Sistema Integral de Gestión Dermatológica, Estética y Asistente Virtual con IA  
**Estándar de Especificación:** *How I Spec* de Rivera (Formato de Ingeniería de Software)

---

## 📜 Historial de Revisiones

### 🔹 [Versión 4.0 (Master - Fase 4: BPMN & Casos de Uso Formales)](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/historial_prds/PRD_v4.0_Fase4_BPMN_CasosDeUso_Master.md)
- **Fecha:** 2026-08-22
- **Estado:** VIGENTE / MASTER
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - Incorporación formal de **5 Diagramas de Procesos de Negocio en BPMN 2.0** (`PR-01` a `PR-05`) con modelado de pools, lanes, compuertas lógicas, eventos temporales y tareas de servicio (MercadoPago, Gemini, Storage, Schedulers).
  - Especificación formal de **8 Casos de Uso detallados** (`CU-01` a `CU-08`) con actores, precondiciones, postcondiciones, flujos principales numerados paso a paso, alternativos, excepciones y reglas de negocio.
  - Generación de la **Matriz de Trazabilidad** que vincula Objetivos de Negocio (O1-O6), Casos de Uso, Entidades de Base de Datos y Módulos de Software.

---

### 🔹 [Versión 3.0 (Fase 3 - Frontend UI/UX Avanzado & DevOps)](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/historial_prds/PRD_v3.0_Fase3_Frontend_DevOps_Master.md)
- **Fecha:** 2026-08-22
- **Estado:** HISTÓRICO
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - Incorporación de especificaciones de UI/UX avanzada en Frontend: Visor Comparativo Antes/Después con slider horizontal (`BeforeAfterSlider.tsx`), línea de tiempo de auditoría médica (`AuditTimelineView.tsx`), panel de administración de servicios y tarifas (`AdminServicesView.tsx`) y pantallas de retorno de MercadoPago.
  - Especificación de despliegue contenerizado (`Dockerfile` multi-stage para backend, `vercel.json` para frontend y `docker-compose.yml` para orquestación local).

---

### 🔹 [Versión 2.0 (Fase 2 - Backend, Storage & Tests)](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/historial_prds/PRD_v2.0_Fase2_Backend_Storage_Tests.md)
- **Fecha:** 2026-08-22
- **Estado:** HISTÓRICO
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - Especificación formal del algoritmo de cálculo de disponibilidad de franjas horarias en tiempo real (`/citas/disponibilidad`) de Lunes a Sábado (09:00 a 19:00 hs, paso de 30 min, antelación mínima de 2 horas).
  - Incorporación del módulo de fotografías médicas con Supabase Storage (`imagen_hc`), validación de tipo MIME y generación de URLs firmadas.
  - Especificación del flujo de recuperación de contraseña con tokens temporales de 15 minutos (`password_reset_token`).
  - Plan y cobertura de la suite de pruebas unitarias automatizadas con JUnit 5 y Mockito.

---

### 🔹 [Versión 1.0 (Fase 1 - Especificación Inicial)](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/historial_prds/PRD_v1.0_Fase1_Inicial.md)
- **Fecha:** 2026-08-21
- **Estado:** HISTÓRICO
- **Autor:** Equipo de Arquitectura & Desarrollo
- **Cambios Principales:**
  - Creación del PRD inicial bajo la metodología *How I Spec* de Rivera.
  - Definición del universo de discurso (Dra. Valeria, Sofía y pacientes).
  - Definición de objetivos (O1 a O6) y no-objetivos (NO1 a NO3).
  - Especificación del ciclo de vida del turno, bloqueo temporal de 10 minutos por TTL y seña del 50% vía MercadoPago Checkout Pro.
  - Modelo de historias clínicas con auditoría inmutable en PostgreSQL (Supabase) y Asistente Virtual con Google Gemini API.
