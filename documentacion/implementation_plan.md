# Plan Técnico de Implementación - Fase 15: Hotfix Inyección de Dependencias Constructor GeminiApiClientAdapter

---

## 1. Base de Datos (Flyway, JPA, Índices e Invariantes)
* **Scripts Flyway:** Ninguno requerido. El esquema y las migraciones de base de datos no sufren alteraciones.
* **Entidades JPA y Concurrencia:** No se tocan entidades de base de datos; la anotación `@Version` se preserva en todo el modelo relacional.
* **Auditoría Clínica (`clinical_entries_audit`):** No se generan ni alteran operaciones clínicas; las invariantes de auditoría permanecen blindadas.

---

## 2. Backend (Arquitectura Limpia & Spring Boot 3)
* **Archivo a Modificar:** `backend/src/main/java/com/clinicadermatologica/app/infrastructure/ai/GeminiApiClientAdapter.java`
* **Cambios Técnicos:**
  1. Importar `org.springframework.beans.factory.annotation.Autowired`.
  2. Anotar explícitamente el constructor primario de configuración con `@Autowired` para desambiguar la selección de constructores en el contenedor IoC:
     ```java
     @Autowired
     public GeminiApiClientAdapter(
             @Value("${gemini.api.key:}") String apiKey,
             @Value("${gemini.api.base-url:https://generativelanguage.googleapis.com/v1beta}") String baseUrl,
             @Value("${gemini.api.model:gemini-3.5-flash-lite}") String defaultModel,
             @Value("${gemini.api.models:#{null}}") String modelsConfig)
     ```
  3. Proporcionar tolerancias y valores por defecto defensivos en los placeholders `@Value("${gemini.api.key:}")` y `@Value("${gemini.api.base-url:https://generativelanguage.googleapis.com/v1beta}")` para que el arranque en entornos como Render no falle incluso si las credenciales de IA no estuviesen pobladas al momento exacto del boot de Tomcat.
  4. Preservar el constructor secundario `public GeminiApiClientAdapter(WebClient webClient, String apiKey, List<String> modelsCascade)` para su consumo directo en las pruebas unitarias con mocks.

---

## 3. Frontend (React 18 & TypeScript)
* **Impacto:** Ninguno. Los contratos REST del endpoint `/api/v1/chatbot/gemini` y los componentes UI (`GeminiChatbotWidget.tsx`) se mantienen completamente inalterados.

---

## 4. Pruebas Requeridas y Verificación
* **Backend (JUnit 5 & AssertJ):**
  - Actualizar / agregar prueba unitaria en `GeminiApiClientAdapterTest.java` para verificar que el constructor primario maneje correctamente parámetros vacíos y configuraciones por defecto.
  - Ejecutar `mvn test` en `backend/` asegurando que todos los tests unitarios pasen (código de salida 0).
* **Frontend:**
  - Ejecutar verificación de tipos TypeScript (`npx tsc --noEmit` o `npm run build`) en `frontend/` asegurando 0 errores de compilación.
