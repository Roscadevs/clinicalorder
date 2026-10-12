# Plan Técnico de Implementación - Fase 16: Proxy Inverso en Vercel y Política de CORS para Conectividad en Producción

---

## 1. Base de Datos (Flyway, JPA, Índices e Invariantes)
* **Scripts Flyway:** Ninguno requerido. El esquema y las migraciones de base de datos no sufren modificaciones.
* **Entidades JPA y Concurrencia:** Sin cambios; la anotación `@Version` se preserva intacta en todas las entidades de dominio.
* **Auditoría Clínica (`clinical_entries_audit`):** Las operaciones de auditoría inmutable no son afectadas.

---

## 2. Backend (Spring Boot 3 & Spring Security)
* **Archivos a Modificar:**
  - `backend/src/main/resources/application.yml`
  - `backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/SecurityConfig.java`
* **Cambios Técnicos:**
  1. En `application.yml`, declarar la propiedad configurable de orígenes CORS:
     ```yaml
     app:
       cors:
         allowed-origins: ${APP_CORS_ALLOWED_ORIGINS:http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,https://clinicalorder.eliasdelcastillo.com,https://clinicalorder.onrender.com}
     ```
  2. En `SecurityConfig.java`, actualizar `corsConfigurationSource()` para utilizar `setAllowedOriginPatterns`:
     - Permite comodines para previsualizaciones de Vercel y subdominios propios (`https://*.eliasdelcastillo.com`, `https://*.vercel.app`, `https://*.onrender.com`, `http://localhost:*`, `http://127.0.0.1:*`).
     - Habilita `allowCredentials(true)` de forma compatible con la especificación de Spring Framework.

---

## 3. Frontend (Vercel & React 18 / TypeScript)
* **Archivos a Modificar:**
  - `frontend/vercel.json`
  - `vercel.json`
  - `frontend/src/services/api.ts`
* **Cambios Técnicos:**
  1. En `frontend/vercel.json` y `vercel.json`, anteponer la regla de proxy inverso hacia Render:
     ```json
     {
       "source": "/api/(.*)",
       "destination": "https://clinicalorder.onrender.com/api/$1"
     }
     ```
     Evita que Vercel intercepte solicitudes POST hacia `/api/*` y devuelva el código `HTTP 405 Method Not Allowed`.
  2. En `frontend/src/services/api.ts`:
     - Configurar `defaultBaseUrl` para que en entornos de producción (fuera de localhost) utilice como fallback directo `https://clinicalorder.onrender.com/api/v1` en caso de que `VITE_API_BASE_URL` no se haya inyectado en el build estático.

---

## 4. Pruebas Requeridas y Verificación
* **Backend:**
  - Ejecutar `JAVA_HOME=/opt/homebrew/opt/openjdk@17 mvn test` asegurando 100% de éxito en la suite (código de salida 0).
* **Frontend:**
  - Ejecutar `npx tsc --noEmit` y `npm run build` en `frontend/` asegurando 0 errores de compilación y empaquetado.
