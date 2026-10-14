# Instrucciones para agentes — Proyecto académico (Ingeniería del Software II)

Este repositorio es un **Trabajo Práctico Especial** de la asignatura Ingeniería del Software II.
Es un proyecto **académico de grado**, no un producto de producción. La prioridad número uno es que
el código sea **simple, claro y defendible oralmente por una estudiante**, no que sea sofisticado.

Stack: Spring Boot 3 + Java 17 (backend), React 18 + TypeScript (frontend), PostgreSQL.

---

## PRINCIPIO RECTOR: SIMPLICIDAD POR SOBRE SOFISTICACIÓN

- Ante dos soluciones, elegí **siempre la más simple y explicable**, aunque sea "menos elegante".
- No introduzcas capas de abstracción, patrones ni indirecciones que no estén pedidas por la
  consigna de la cátedra. Menos clases y más directas es mejor que más clases "bien diseñadas".
- Cada pieza del código debe poder justificarse en una defensa oral de 20 minutos. Si una
  abstracción no se puede explicar en una o dos frases, probablemente sobra.
- No agregues infraestructura de producción (auditoría avanzada, concurrencia optimista,
  observabilidad, mutation testing, etc.) salvo pedido explícito del usuario.

---

## REQUISITOS DE LA CÁTEDRA (lo que SÍ debe cumplirse)

La implementación debe demostrar, de forma visible y explicable:

1. **Arquitectura en capas** (Layered), con separación clara:
   - Presentación / Controlador (`@RestController`): recibe HTTP, devuelve JSON.
   - Lógica de negocio / Servicio (`@Service`): reglas de negocio y coordinación de casos de uso.
   - Persistencia / DAO (`@Repository`): acceso a datos.
   - Base de datos (PostgreSQL).
   - El flujo debe ser **cerrado**: Controlador → Servicio → DAO → BD, sin saltos.
2. **Patrón DAO** explícito y simple (un DAO por entidad, sin capas puerto/adapter intermedias).
3. **Patrón Singleton** explícito y defendible.
4. **Un tercer patrón a elección: Strategy** (ya aplicado en el registro de pagos).
5. **Conceptos de seguridad** aplicados (autenticación, autorización por roles).
6. **Consistencia entre los modelos de diseño (UML) y el código.** Si cambia el código, hay que
   actualizar los diagramas de clases/secuencia correspondientes, y viceversa.

---

## QUÉ EVITAR (complejidad que esta cátedra NO pide)

- **Arquitectura hexagonal / puertos y adaptadores.** No crear interfaces de repositorio de dominio
  con adapters que deleguen en Spring Data JPA. Usar directamente repositorios `@Repository`
  (Spring Data JPA) como DAO.
- **Vías de persistencia duplicadas** (p. ej. stored procedures vía RPC *además* de JPA para lo mismo).
- Anotaciones o mecanismos avanzados no pedidos (`@Version`/bloqueo optimista, auditoría
  automática de entidades, etc.) salvo que el usuario los pida.
- Documentos PRD extensos, graphify, mutation testing y protocolos de múltiples fases con barreras.

---

## FLUJO DE TRABAJO (liviano)

Para cualquier cambio de código:

1. **Entender antes de tocar.** Leé el código relevante. No modifiques lo que no leíste.
2. **Explicar el plan brevemente** al usuario (en lenguaje claro, sin jerga innecesaria) y, si el
   cambio es grande o destructivo (borrar clases, cambiar esquema de BD), **pedir confirmación**
   antes de ejecutarlo.
3. **Implementar** de la forma más simple que cumpla el requisito.
4. **Verificar que compila y corre:**
   - Backend: `mvn -q -DskipTests package` (o `mvn test` si hay tests relevantes).
   - Frontend: `npm run build`.
5. **Mantener la consistencia de documentación.** Si el cambio afecta clases o flujos que están en
   los diagramas UML de `docs/`, actualizá esos diagramas.

No es obligatorio escribir tests nuevos salvo que el usuario lo pida; si existen, no romperlos.

---

## CONVENCIONES DEL REPOSITORIO

- La documentación propia de trabajo va en `docs/` (carpeta local, ignorada por git).
  La carpeta `documentacion/` pertenece a otra persona: no modificarla salvo pedido explícito.
- Responder al usuario en español, en lenguaje claro y accesible.
- Las rutas REST usan el prefijo `/api/v1/...`.
