# GEMINI PROTOCOL & AGENT ORCHESTRATOR INSTRUCTIONS

Este repositorio (Spring Boot 3 + React 18/TypeScript) sigue una metodología estricta de desarrollo: **A-LOOP & SPEC-DRIVEN DEVELOPMENT**.
Cualquier requerimiento, cambio o instrucción solicitada por el usuario DEBE ejecutarse siguiendo este ciclo de 5 fases de forma obligatoria y secuencial.

---

## REGLA GENERAL DE EJECUCIÓN (BARRERAS OBLIGATORIAS)
Bajo ninguna circunstancia debes avanzar a una fase que requiera aprobación sin detener tu ejecución y solicitar confirmación expresa del usuario ("Aprobado"). 
No asumas aprobaciones tácitas ni generes código final antes de superar la Fase 3.

---

### FASE 1: MAPEO Y ANÁLISIS DE IMPACTO (Automática)
1. Recibe la solicitud del usuario.
2. Invoca obligatoriamente el MCP de `graphify` (`shortest_path` o consultas semánticas) para rastrear dependencias entre capas:
   - DTOs, Entidades JPA (`@Version`), Servicios (`@Transactional`).
   - Hooks de TanStack Query, componentes React y esquemas Zod.
   - Scripts de Flyway (`V...__*.sql`).
3. Detalla en tu respuesta los archivos detectados y advierte riesgos sobre `clinical_entries_audit`.
4. Pasa de inmediato a la Fase 2 sin esperar al usuario.

---

### FASE 2: ESPECIFICACIÓN FORMAL (PRD RIVERA)
1. Redacta el documento de requerimientos y guárdalo en `documentacion/historial_prds/PRD_Fase_[X]_[NOMBRE].md`.
2. Estructura obligatoria:
   - Encabezado y Resumen (Hoy vs. Después).
   - La Historia (Antes vs. Después, sin tecnicismos).
   - Objetivos y No-Objetivos.
   - Cómo funciona hoy vs. después.
   - Los Datos (Triggers, candados lógicos, concurrencia).
   - Pseudo-código (El acuerdo en lenguaje natural).
3. PROHIBICIÓN: No escribas código final en Java, TypeScript o SQL dentro del PRD.
4. BARRERA DE PARADA 1: Detente. Muestra el enlace al archivo y di textualmente:
   > "Fase 2 completa. Por favor revisa el PRD. Escribe 'Aprobado' para redactar el plan técnico o indica ajustes."

---

### FASE 3: PLAN TÉCNICO DE IMPLEMENTACIÓN
1. Una vez recibido el "Aprobado" de la Fase 2, genera el archivo `documentacion/implementation_plan.md`.
2. Especifica:
   - Base de datos (Flyway, JPA, índices).
   - Backend (Entidades, Servicios, Controladores `/api/v1/...` con RFC 7807).
   - Frontend (Esquemas Zod, queries/mutations, ergonomía táctil en móvil).
   - Pruebas requeridas (JUnit 5, Mockito, validación de tipos).
3. BARRERA DE PARADA 2: Detente. Muestra el plan y di textualmente:
   > "Fase 3 completa. Plan técnico listo en implementation_plan.md. Escribe 'Aprobado' para comenzar la codificación."

---

### FASE 4: IMPLEMENTACIÓN Y SUITE DE VERIFICACIÓN (Automática tras aprobación)
1. Una vez recibido el "Aprobado" de la Fase 3, escribe el código respetando Clean Architecture.
2. Añade los tests unitarios correspondientes a cada servicio modificado.
3. Ejecuta de forma autónoma en la terminal:
   - Backend: `mvn test`
   - Frontend: `npm run build` o `npx tsc --noEmit`
4. Si hay fallos en las pruebas o de tipos, corrígelos de forma iterativa hasta que los comandos devuelvan código de salida 0 (éxito).

---

### FASE 5: AUDITORÍA DE INVARIANTES Y CIERRE
1. Comprueba:
   - Que las operaciones clínicas generen eventos en `clinical_entries_audit`.
   - Que no se haya eliminado la anotación `@Version` en entidades tocadas.
   - Que las respuestas de error sigan el estándar RFC 7807 sin exponer stack traces.
2. Presenta un resumen final con la lista de archivos creados/modificados y el estado en verde de los tests.

---

## PROTOCOLO PARA AGENTES ASÍNCRONOS / HEADLESS (GOOGLE JULES)
Cuando este repositorio sea operado por Google Jules o flujos desatendidos de CI/CD:

1. **Régimen de Barreras de Parada**:
   - Ejecuta las 5 fases de forma atómica y secuencial sin detenerte a solicitar confirmación en el terminal.
   - **Fase 1**: Mapeo de impacto consultando `graphify-out/GRAPH_REPORT.md` y estructura del código.
   - **Fase 2**: Redacta el PRD formal en `documentacion/historial_prds/PRD_Fase_[X]_[NOMBRE].md`.
   - **Fase 3**: Redacta el Plan Técnico en `documentacion/implementation_plan.md`.
   - **Fase 4**: Implementa el código y pruebas unitarias. Ejecuta obligatoriamente en sus respectivos directorios:
     * Backend: `cd backend && mvn clean test -B`
     * Frontend: `cd frontend && npm run build && npx tsc --noEmit`
   - **Fase 5**: Audita invariantes (auditoría en `clinical_entries_audit`, persistencia de `@Version`, RFC 7807 y prohibición de migraciones Flyway destructivas).
   - **Transferencia de Aprobación**: La barrera de parada se traslada a la revisión humana formal de la Pull Request de GitHub previa al merge a `main`.

