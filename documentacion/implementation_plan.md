# Plan Técnico de Implementación - Fase 14
## Resiliencia en Cascada Multi-Modelo para Asistente Virtual Gemini (50 RPM)

---

### 1. Base de Datos
* **Impacto en Esquema:** Ninguno. La funcionalidad de asistencia conversacional opera exclusivamente en modo lectura contra el catálogo de servicios dermatológicos activos (`dermatologic_services`).
* **Flyway:** No se requieren nuevos scripts `V...__*.sql`.
* **Invariantes y Auditoría:** Se confirma que ninguna operación clínica ni historia médica es modificada, por lo que la tabla `clinical_entries_audit` no recibe mutaciones ni corre riesgos de desincronización.

---

### 2. Backend (Spring Boot 3 + Java 17)

#### 2.1. Configuración (`application.yml`)
* Añadir propiedad `gemini.api.models` con lista separada por comas de los 6 modelos verificados:
  ```yaml
  gemini:
    api:
      key: ${GEMINI_API_KEY:}
      base-url: https://generativelanguage.googleapis.com/v1beta
      model: ${GEMINI_MODEL:gemini-3.5-flash-lite}
      models: ${GEMINI_MODELS_CASCADE:gemini-3.5-flash-lite,gemini-3.1-flash-lite,gemini-3-flash-preview,gemini-3.8-flash,gemini-3.7-flash,gemini-3.6-flash}
  ```

#### 2.2. Adaptador de Infraestructura (`GeminiApiClientAdapter.java`)
* Inyectar la lista de modelos (`List<String> models`).
* Modificar `generateResponse(GeminiChatRequestDTO request, String servicesCatalogContext)`:
  * Implementar bucle de ejecución secuencial sobre la lista de modelos.
  * Captura específica de `WebClientResponseException` (evaluando códigos HTTP 429 Too Many Requests, 503 Service Unavailable, 404 Not Found o timeouts).
  * Logging estructurado de advertencia (`log.warn("Modelo {} no disponible (HTTP {}). Conmutando al siguiente modelo en cascada...", currentModel, statusCode)`).
  * Si un modelo responde con éxito (HTTP 200) y contenido válido, registrar log informativo (`log.info("Consulta resuelta exitosamente por modelo {}", currentModel)`) y retornar inmediatamente.
  * Si se agotan todos los modelos de la cadena, registrar `log.error("Todos los modelos de la cascada fallaron o agotaron cuota.")` y retornar el DTO de contingencia institucional con sugerencias y enlace de reserva.

#### 2.3. Capa de Aplicación y Controlador (`GeminiChatbotService.java` & `GeminiChatbotController.java`)
* Mantener la transacción de solo lectura `@Transactional(readOnly = true)`.
* Mantener el endpoint público `POST /api/v1/chat/gemini` protegido por validación `@Valid` y respuestas de error RFC 7807 (`ProblemDetail`).

---

### 3. Frontend (React 18 + TypeScript)

#### 3.1. Cliente de API (`api.ts`)
* Actualizar `chatbotApi.sendMessage` para permitir enviar el mensaje y el historial si existe.
* Remover el mensaje estático promocional desactualizado del bloque `catch` para evitar mostrar precios inconsistentes ante fallos de conexión.

#### 3.2. Widget de Chatbot (`GeminiChatbotWidget.tsx`)
* Mantener la experiencia fluida de usuario con scroll automático y feedback de carga mientras el backend ejecuta el failover en segundo plano.

---

### 4. Pruebas Requeridas (JUnit 5 + Mockito)

* **`GeminiChatbotServiceTest.java`:**
  * Prueba 1: Inyección correcta del catálogo activo en el prompt de contexto.
  * Prueba 2: Resolución exitosa con el primer modelo de la cascada.
  * Prueba 3: Conmutación por failover (primer modelo simula HTTP 429, segundo modelo resuelve exitosamente con HTTP 200).
  * Prueba 4: Todos los modelos agotan cuota o fallan, verificación de retorno seguro del DTO de contingencia sin excepciones no controladas.
* **Verificación de Tipos y Compilación:**
  * Backend: `mvn test-compile` y `mvn test`.
  * Frontend: `npm run build` o `npx tsc --noEmit`.
