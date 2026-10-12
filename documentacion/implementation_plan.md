# Plan Técnico de Implementación: Integración Oficial de Google Jules (Agentic GitOps)

## 1. Base de Datos
* **Migraciones Flyway:** No se requieren nuevas migraciones de base de datos para esta integración de infraestructura y gobernanza.
* **Invariantes del Esquema:** Se mantiene intacta la estructura de tablas y relaciones existentes. Se explicita la restricción de que las tareas desatendidas de Jules no podrán generar migraciones DDL destructivas (`DROP`, `TRUNCATE`, `ALTER COLUMN` sin retrocompatibilidad).
* **Auditoría Clínica (`clinical_entries_audit`):** Se reafirma la regla inviolable de que toda operación sobre historias clínicas generada por agentes asíncronos debe registrar eventos de auditoría inmutables.

---

## 2. Backend (Spring Boot 3.2.3 & Maven)
* **Sincronización de Dependencia Lombok (`backend/pom.xml`):**
  - **Problema detectado:** `backend/pom.xml` declara la dependencia `org.projectlombok:lombok` sin versión fija (heredando `1.18.30` de Spring Boot 3.2.3), mientras que `annotationProcessorPaths` utiliza `1.18.36`. En runners modernos de Linux con OpenJDK 17.0.17+, esta disparidad provoca `java.lang.NoSuchFieldException: com.sun.tools.javac.code.TypeTag :: UNKNOWN` durante la compilación.
  - **Solución:** Declarar explícitamente en la sección `<properties>` de `backend/pom.xml`:
    ```xml
    <lombok.version>1.18.36</lombok.version>
    ```
  - **Efecto:** Garantiza compilación exitosa y corrida limpia de pruebas tanto en local como en la máquina virtual Ubuntu de Google Jules.

---

## 3. Gobernanza y Protocolo de Agentes (`AGENTS.md` y `GEMINI.md`)
* **Adición de Sección de Ejecución Asíncrona / Headless:**
  - Definir las pautas de comportamiento cuando el repositorio es operado de forma no interactiva por Google Jules.
  - Especificar que las 5 fases del A-LOOP se ejecutan atómicamente de inicio a fin.
  - Detallar que las barreras de parada interactivas se sustituyen por la **revisión humana obligatoria de la Pull Request** generada por Jules antes del merge a `main`.
  - Especificar los comandos y directorios de ejecución obligatorios:
    - Backend: `cd backend && mvn clean test -B`
    - Frontend: `cd frontend && npm run build && npx tsc --noEmit`

---

## 4. Automatización y CI/CD (`.github/workflows/jules-agent.yml`)
* **Creación del Flujo de GitHub Actions:**
  - **Disparadores (`on`):**
    - `workflow_dispatch` con inputs (`prompt` y `starting_branch`).
    - `issue_comment` (evento `created`).
  - **Seguridad RBAC:** Condicional `if` que restringe la ejecución exclusivamente a usuarios con asociación `OWNER`, `MEMBER` o `COLLABORATOR` en el repositorio, descartando comentarios en Pull Requests.
  - **Mitigación de Inyección de Código:** Paso `Prepare Prompt` que encapsula `${{ github.event.issue.body }}` y `${{ github.event.comment.body }}` en variables de entorno del runner antes de construir el texto final.
  - **Invocación Oficial:** Uso de la Action `google-labs-code/jules-invoke@v1` con el parámetro de autenticación `secrets.JULES_API_KEY`.
  - **Feedback Automático:** Notificación en el issue informando el inicio de la sesión mediante `actions/github-script@v7`.

---

## 5. Pruebas y Verificación Requeridas
1. **Verificación de Compilación y Tests en Backend:**
   - Comando: `cd backend && mvn clean test -B`
   - Criterio de éxito: Salida `BUILD SUCCESS` con 0 fallos en las 9 clases de pruebas unitarias existentes.
2. **Verificación de Tipos y Empaquetado en Frontend:**
   - Comandos: `cd frontend && npx tsc --noEmit && npm run build`
   - Criterio de éxito: Código de salida 0 sin errores de tipos TypeScript y assets generados en `dist/`.
3. **Validación de Integridad de Gobernanza:**
   - Comprobar que `AGENTS.md` y `GEMINI.md` conservan todas las reglas previas intactas e incorporan la cláusula headless sin contradicciones.
4. **Validación de Sintaxis YAML:**
   - Verificar que `.github/workflows/jules-agent.yml` cumple con el esquema estándar de GitHub Actions.
