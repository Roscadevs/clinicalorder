# PRD Fase 18: Integración Oficial de Google Jules (Agentic GitOps & Desarrollo Asíncrono)

## 1. Encabezado y Resumen (Hoy vs. Después)
* **Fecha:** 2026-10-12
* **Autor:** Equipo de Desarrollo & Agente Orquestador
* **Proyecto:** Clínica Médica Dermatológica & Estética — Dra. Paula Villa Fuhrmann
* **Materia:** Ingeniería del Software II

### Resumen Ejecutivo
* **Hoy:** El ciclo de desarrollo y mantenimiento de la plataforma depende exclusivamente de sesiones sincrónicas e interactivas en el entorno local (IDE/Antigravity). La resolución de bugs menores reportados en producción, la creación de tests unitarios y la atención de issues de backlog requieren que un desarrollador interrumpa sus actividades y abra su computadora para codificar, compilar y abrir pull requests manualmente.
* **Después:** El repositorio cuenta con una integración oficial, blindada y de bajo coste con **Google Jules** (el agente asíncrono en la nube de Google Labs). Los colaboradores autorizados pueden delegar tareas mediante GitHub Issues (vía etiqueta o comentario) o desde la consola de comandos. Jules clona el repositorio en una máquina virtual efímera en la nube de Google, respeta las reglas de gobernanza del proyecto de forma autónoma, ejecuta las suites de pruebas y genera Pull Requests listas para revisión humana, integrándose fluidamente con las acciones de CI/CD existentes.

---

## 2. La Historia (Antes vs. Después, sin tecnicismos)
* **Antes:** Cuando un paciente o docente reportaba una discrepancia visual o un bug menor en la plataforma web desplegada, la tarea quedaba pendiente en una lista de pendientes hasta que algún integrante del equipo tuviera tiempo de sentarse frente a su editor de código. Esto retrasaba la resolución de tareas mecánicas (como tests unitarios y validaciones de datos) y quitaba tiempo para diseñar la arquitectura y preparar la defensa oral.
* **Después:** Al identificarse un problema o una necesidad de prueba, cualquier integrante del equipo con permisos puede redactar un issue en GitHub desde su celular o navegador. Jules toma la tarea automáticamente en segundo plano, analiza el proyecto, aplica la solución en una rama protegida, verifica que no se rompa ninguna funcionalidad y entrega una propuesta formal de cambio (Pull Request). El equipo solo necesita revisar y aprobar el cambio con un click.

---

## 3. Objetivos y No-Objetivos

### Objetivos
1. Habilitar la integración canónica de Google Jules mediante la tríada oficial: GitHub App, GitHub Action (`google-labs-code/jules-invoke`) y CLI para desarrolladores.
2. Adaptar el protocolo de gobernanza (`AGENTS.md` y `GEMINI.md`) para incorporar el "Modo Asíncrono / Headless", permitiendo que Jules complete las 5 fases de desarrollo atómicamente y transfiera la aprobación humana a la revisión del Pull Request.
3. Blindar el canal de ejecución con control de acceso estricto (RBAC) para que solo mantenedores y colaboradores autorizados puedan invocar al agente, evitando inyecciones de código o prompts no autorizados.
4. Homogeneizar las dependencias del compilador Maven en el backend (Lombok 1.18.36) para garantizar que la compilación y ejecución de tests en entornos Linux modernos no sufran incompatibilidades de Java 17.

### No-Objetivos
1. No se reemplaza el agente interactivo local ni la supervisión humana: las decisiones arquitecturales complejas y los cambios estructurales siguen realizándose interactivamente en el IDE.
2. No se otorga a Jules permiso de push directo a la rama principal (`main`); todo cambio debe pasar obligatoriamente por Pull Request y por los flujos de integración continua existentes (`backend-ci.yml` y `frontend-ci.yml`).
3. No se exponen credenciales de producción ni secretos bancarios/médicos (MercadoPago, Supabase service keys, llaves criptográficas) al entorno del agente asíncrono.
4. No se autoriza la modificación autónoma de scripts destructivos de base de datos Flyway sin supervisión previa.

---

## 4. Cómo funciona hoy vs. después

### Flujo Actual (Hoy)
1. Un mantenedor detecta un requerimiento o bug menor.
2. Debe abrir su entorno local, iniciar la terminal y dialogar interactivamente con el agente o codificar manualmente.
3. Se requiere interacción paso a paso en el chat para autorizar cada fase.
4. El desarrollador debe ejecutar manualmente las pruebas y hacer push a GitHub.

### Flujo Futuro (Después)
1. Un mantenedor crea un issue en GitHub o comenta en uno existente con la directiva `@jules`.
2. El flujo de GitHub Actions valida que el usuario sea miembro, colaborador o dueño del repositorio.
3. Se invoca de forma segura a la API de Google Jules mediante variables de entorno aisladas (previniendo script injection).
4. Jules levanta una máquina virtual efímera en la nube de Google, lee `AGENTS.md` y ejecuta las 5 fases en modo headless:
   - Mapeo de impacto en el proyecto.
   - Redacción de especificación formal.
   - Plan de implementación.
   - Modificación de código y corrida de tests (`mvn test`, `npm run build`).
   - Auditoría de invariantes (verificando que no se afecte la auditoría clínica ni los candados de concurrencia).
5. Jules publica una Pull Request en GitHub con el detalle de lo realizado.
6. GitHub Actions ejecuta automáticamente `backend-ci.yml` y `frontend-ci.yml` sobre la rama de la PR.
7. El equipo humano revisa el diff y aprueba el merge hacia `main`.

---

## 5. Los Datos (Triggers, candados lógicos y concurrencia)

### Disparadores (Triggers)
* **Trigger 1 (Manual):** Ejecución de `workflow_dispatch` desde la interfaz de GitHub Actions con un prompt personalizado.
* **Trigger 2 (Comentario):** Creación de un comentario en un Issue que contenga la mención `@jules`.
* **Trigger 3 (Etiqueta):** Adición de la etiqueta `jules` en cualquier Issue del repositorio mediante la GitHub App.

### Candados Lógicos y Control de Acceso (RBAC)
* Solo se permite el disparo si la asociación del autor del comentario es `OWNER`, `MEMBER` o `COLLABORATOR`. Comentarios de usuarios anónimos o no autorizados son ignorados silenciosamente.
* Las peticiones en Issues que sean Pull Requests son descartadas para evitar ciclos recursivos de auto-modificación.
* Se establece un grupo de concurrencia para evitar ejecuciones duplicadas simultáneas sobre la misma referencia de rama.

### Invariantes del Dominio Clínico
* Cualquier tarea que involucre el expediente médico debe preservar la generación de registros en la tabla de auditoría clínica (`clinical_entries_audit`).
* Las entidades modificadas no deben perder la anotación de bloqueo optimista (`@Version`).
* La gestión de errores de controladores REST debe respetar el formato RFC 7807 (`ProblemDetail`).

---

## 6. Pseudo-código (El acuerdo en lenguaje natural)

### Regla de Despacho en GitHub Actions
```text
CUANDO se cree un comentario en un issue O se dispare el flujo manualmente:
  SI el evento es manual:
    ASIGNAR prompt = entrada_usuario
    ASIGNAR rama_base = rama_seleccionada
    CONTINUAR
  SINO SI el evento es un comentario en un issue:
    SI el issue es en realidad una Pull Request:
      CANCELAR ejecución
    SI el autor del comentario NO es OWNER, MEMBER ni COLLABORATOR:
      CANCELAR ejecución por falta de permisos
    SI el comentario NO contiene la mención '@jules':
      CANCELAR ejecución
    CONSTRUIR prompt seguro utilizando variables de entorno protegidas con el título, cuerpo del issue y comentario
    ASIGNAR rama_base = "main"

  INVOCAR la acción oficial de Jules con el prompt y la clave API segura
  NOTIFICAR en el issue mediante comentario que la sesión asíncrona ha comenzado
```

### Regla de Ejecución para Jules en AGENTS.md
```text
CUANDO Jules inicie sesión en su máquina virtual en la nube:
  LEER AGENTS.md y detectar directiva de "Modo Asíncrono / Headless"
  EJECUTAR Fase 1 (Mapeo de dependencias y análisis)
  EJECUTAR Fase 2 (Redacción de PRD en documentacion/historial_prds/)
  EJECUTAR Fase 3 (Redacción de plan técnico en documentacion/implementation_plan.md)
  EJECUTAR Fase 4:
    Moverse a la carpeta backend y ejecutar pruebas unitarias con Maven
    Moverse a la carpeta frontend y compilar/validar tipos con TypeScript
  EJECUTAR Fase 5 (Verificar que se respeten los invariantes de auditoría y versiones)
  CREAR Pull Request en GitHub hacia la rama principal
  TRANSFERIR la barrera de aprobación humana a la revisión formal de la Pull Request
```
