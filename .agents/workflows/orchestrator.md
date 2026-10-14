---
name: orchestrator
description: Ejecución del ciclo estricto de desarrollo en 5 fases (A-Loop & Spec-Driven Development)
---

# Workflow: Agent Orchestrator Protocol (5 Fases)

Este workflow rige cualquier requerimiento o instrucción sobre el repositorio (Spring Boot 3 + React 18/TypeScript).

1. **Fase 1: Mapeo y Análisis de Impacto (Automática)**
   - Rastrear dependencias entre capas con graphify (`shortest_path` o semánticas): DTOs, Entidades JPA (`@Version`), Servicios (`@Transactional`), TanStack Query, Zod y Flyway.
   - Advertir riesgos sobre `clinical_entries_audit`.
   - Transicionar de inmediato a Fase 2.

2. **Fase 2: Especificación Formal (PRD Rivera)**
   - Escribir `documentacion/historial_prds/PRD_Fase_[X]_[NOMBRE].md` (Hoy vs Después, La Historia, Objetivos/No-Objetivos, Datos/Candados/Concurrencia, Pseudo-código). Cero código final.
   - **Barrera de Parada 1:** Detenerse y solicitar confirmación expresa: *"Fase 2 completa. Por favor revisa el PRD. Escribe 'Aprobado' para redactar el plan técnico o indica ajustes."*

3. **Fase 3: Plan Técnico de Implementación**
   - Redactar `documentacion/implementation_plan.md` (Flyway/JPA, Backend Clean Arch + RFC 7807, Frontend Zod/mobile-first, Tests JUnit 5).
   - **Barrera de Parada 2:** Detenerse y solicitar confirmación expresa: *"Fase 3 completa. Plan técnico listo en implementation_plan.md. Escribe 'Aprobado' para comenzar la codificación."*

4. **Fase 4: Implementación y Suite de Verificación (Automática tras aprobación)**
   - Codificar respetando Clean Architecture.
   - Tests unitarios para cada servicio modificado.
   - Ejecutar `mvn test` y `npm run build` o `npx tsc --noEmit` de forma iterativa hasta código de salida 0.

5. **Fase 5: Auditoría de Invariantes y Cierre**
   - Auditar eventos en `clinical_entries_audit`, persistencia de `@Version`, RFC 7807 sin stack traces.
   - Presentar resumen de archivos tocados y tests en verde.
