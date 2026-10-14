# 📄 Product Requirements Document (PRD) - v12.0
**Fase 12: Seguridad Integral en Entorno Web - Blindaje Perimetral de Rutas, Autorización y Prevención de Fugas por Path**

---

## 1. Encabezado y Resumen (Hoy vs. Después)

| Dimensión | Hoy (Estado Actual) | Después (Estado Propuesto) |
| :--- | :--- | :--- |
| **Arquitectura de Paths API** | Rutas planas heterogéneas (`/servicios`, `/citas`, `/historias-clinicas`, etc.) con un matcher genérico `.requestMatchers("/admin/**")` que no protege ningún endpoint real. | Estructura jerárquica con principio de menor privilegio (*Default Deny*), segmentada por nivel de sensibilidad y roles específicos. |
| **Filtrado Perimetral Web** | Exposición de endpoints internos en la cadena de filtros de URL (ej. `/servicios/**` es público por GET, desprotegiendo a nivel de red `/servicios/todos`). | Separación estricta de rutas públicas y privadas en la cadena de filtros. La seguridad a nivel de URL actúa como primera barrera infranqueable. |
| **Configuración CORS en Web** | `setAllowedOriginPatterns("*")` combinado con `setAllowCredentials(true)` aplicado a todas las rutas indiscriminadamente. | CORS estricto limitado únicamente a dominios autorizados de producción/desarrollo por variables de entorno, sin comodines con credenciales. |
| **Normalización y Path Traversal** | Firewall por defecto sin restricciones explícitas sobre caracteres maliciosos (`%2f`, matrix parameters `;`, traversal `..`). | `StrictHttpFirewall` explícito para mitigar desincronizaciones de proxy/servidor y sanitización estricta de nombres de archivos en storage. |
| **Protección de Rutas Frontend** | En `App.tsx`, las rutas de `/app/*` están expuestas sin guardianes de autenticación; un usuario anónimo entra y adopta rol simulado por defecto. | Guardián centralizado (`ProtectedRoute`) en React Router que intercepta accesos anónimos o desautorizados antes de renderizar componentes. |
| **Carga de Código y Fuga de Módulos** | Empaquetado estático monolítico donde cualquier visitante anónimo de la landing descarga el JavaScript de historias clínicas y administración. | División de código por ruta (*Code Splitting / Lazy Loading*), impidiendo la descarga de bundles de módulos médicos y de administración sin sesión. |

---

## 2. La Historia (Antes vs. Después, sin tecnicismos)

### Antes
Un usuario cualquiera abre su navegador en la página pública de la clínica. Si curiosea y escribe manualmente en la barra de direcciones `/app/clinical` o `/app/admin`, la aplicación web no le pide credenciales de inmediato ni le prohíbe el paso: carga la interfaz, lo trata internamente como si fuera personal de secretaría y despliega la estructura de pantallas privadas. 

En el backend, aunque existen candados en las funciones de negocio, la puerta de entrada a nivel de direcciones web no tiene una distinción clara entre lo que es público y lo que es reservado para la doctora o el administrador. Además, las reglas del navegador permiten que solicitudes desde cualquier origen web con credenciales sean procesadas, y si alguien intenta navegar directorios o subir archivos con nombres engañosos, el sistema confía en las reglas por defecto sin una verificación estricta previa.

### Después
La clínica opera bajo una arquitectura de defensa en profundidad donde cada dirección web tiene un propósito y una frontera claramente delimitados. Si un usuario no autenticado intenta escribir directamente la dirección de una sección interna, el navegador lo detiene en seco antes de mostrar una sola pantalla y lo redirige a la página de ingreso seguro. Además, el navegador solo descarga los archivos indispensables para la página pública, manteniendo los módulos médicos confidenciales fuera del alcance de curiosos.

En el servidor, cada solicitud es examinada por un filtro estricto antes de llegar a cualquier servicio: se rechazan caminos con caracteres sospechosos o intentos de evasión, solo se aceptan conexiones desde las direcciones oficiales del sistema, y cada ruta web exige de forma automática el rol que corresponde (Doctora, Administrador o Público) como una muralla perimetral infranqueable.

---

## 3. Objetivos y No-Objetivos

### Objetivos
1. **Defensa en Profundidad por Path:** Establecer un control perimetral a nivel de filtro web que complemente y refuerce las anotaciones de seguridad en los métodos del negocio.
2. **Eliminación de Brechas de Acceso en Frontend:** Proteger las rutas cliente con un componente guardián que evalúe la autenticación y los roles permitidos antes de instanciar componentes sensibles.
3. **Optimización y Confidencialidad de Código:** Emplear carga perezosa (*Lazy Loading*) para que el código fuente compilado de las áreas médicas y administrativas no se transmita a usuarios no autorizados.
4. **CORS Seguro y Cabeceras de Transporte:** Configurar CORS explícito y añadir cabeceras HTTP de seguridad web para prevenir ataques de inyección, incrustación en marcos y desincronización de rutas.
5. **Normalización Anti-Bypass y Errores Estándar:** Activar un cortafuegos HTTP estricto contra manipulaciones de rutas y garantizar que cualquier fallo de ruta (401, 403, 404) devuelva el formato estándar RFC 7807 sin revelar detalles internos.
6. **Integridad de Auditoría:** Asegurar que ninguna reorganización de paths o filtros eluda la generación de auditorías médicas en `clinical_entries_audit` (`entrada_hc_audit`).

### No-Objetivos
- No se reemplaza el protocolo de cifrado de base de datos en reposo (AES-256-GCM ya implementado para exámenes y evoluciones).
- No se implementa una pasarela API externa (API Gateway dedicado en contenedor separado); la seguridad perimetral se resuelve dentro del stack actual Spring Boot + React.
- No se altera la estructura de tablas de la base de datos ni los triggers relacionales ya existentes.

---

## 4. Cómo Funciona Hoy vs. Después

### Flujo de Navegación del Usuario en el Frontend
* **Hoy:**
  1. El usuario ingresa a `/app/clinical` desde una ventana limpia en incógnito.
  2. `DashboardLayout` lee `localStorage.getItem('role')`, al ser nulo asume `'SECRETARIA'` y renderiza la estructura general.
  3. Si la API backend está apagada o en modo demo, el frontend muestra información de prueba directamente en pantalla.
* **Después:**
  1. El usuario intenta navegar a `/app/clinical`.
  2. El guardián de ruta intercepta la navegación en el cliente.
  3. Verifica la existencia de una sesión válida y el rol `DOCTORA`.
  4. Al no existir credenciales válidas, redirige de inmediato a `/login?redirect=/app/clinical` con una notificación clara de seguridad.

### Flujo de Solicitud HTTP en el Backend
* **Hoy:**
  1. Llega una petición `GET /api/v1/servicios/todos`.
  2. El filtro de seguridad de Spring evalúa `requestMatchers(HttpMethod.GET, "/servicios/**").permitAll()`.
  3. Como la ruta coincide con el comodín público, la cadena de filtros permite el paso sin validar token JWT.
  4. La seguridad depende exclusivamente de si el controlador ejecuta `@PreAuthorize`.
* **Después:**
  1. Las rutas públicas quedan acotadas de forma exacta (o bajo un espacio de nombres explícito como endpoints públicos de consulta).
  2. La regla perimetral exige explícitamente rol de administración antes de llegar al controlador para listar la totalidad de los servicios.
  3. Cualquier solicitud que no coincida explícitamente con un endpoint público es bloqueada por la regla por defecto (*Default Deny*).

---

## 5. Los Datos (Triggers, Candados Lógicos y Concurrencia)

1. **Invariante Crítico de Auditoría (`clinical_entries_audit`):**
   - Cualquier acceso que modifique o cree entradas clínicas a través de rutas autorizadas (`DOCTORA`) debe continuar disparando el registro inmutable en `entrada_hc_audit`.
   - La reestructuración o protección de paths no debe omitir ni interferir con la captura del `author_user_id` ni el contexto de auditoría del usuario autenticado.
2. **Candados Lógicos y Concurrencia:**
   - La preservación de la integridad transaccional (`@Transactional`) en los servicios médicos y de agenda es obligatoria.
   - Si se tocan entidades JPA sujetas a control concurrente, se debe respetar rigurosamente la anotación `@Version` y el manejo de excepciones de colisión.
3. **Sanitización de Nombres en Almacenamiento:**
   - Para las rutas de archivos de fotografías clínicas, los identificadores en Supabase Storage deben ser UUIDs autogenerados en el servidor, neutralizando cualquier intento de inyección de rutas relativas provistas en el nombre original del archivo subido.

---

## 6. Pseudo-código (El Acuerdo en Lenguaje Natural)

### 6.1 Guardián de Rutas del Frontend
```text
CUANDO el usuario navega a una ruta protegida:
    SI no existe un token de sesión válido:
        Redirigir inmediatamente a la página de ingreso "/login"
        Recordar la ruta que intentaba visitar para redirigirlo tras autenticarse
        TERMINAR
    
    SI la ruta exige roles específicos Y el rol del usuario NO está en la lista permitida:
        Redirigir a la vista de "Acceso Denegado (403)" o a su pantalla de inicio asignada
        Mostrar notificación de advertencia sobre permisos insuficientes
        TERMINAR
    
    Renderizar el componente solicitado de forma segura
```

### 6.2 Cadena de Filtros Perimetral del Servidor
```text
PARA cada petición HTTP entrante:
    Verificar que el path no contenga caracteres de escape, puntos dobles o secuencias maliciosas
    SI se detecta anomalía en el path:
        Responder inmediatamente con error estándar RFC 7807 (Bad Request)
        TERMINAR
    
    Verificar si el origen del navegador está explícitamente habilitado en la lista blanca de CORS
    SI no está permitido:
        Rechazar la solicitud de origen cruzado
        TERMINAR
    
    EVALUAR reglas de ruta en estricto orden de especificidad:
        1. Endpoints de autenticación y salud -> Permitir acceso público
        2. Consulta pública de tratamientos y turnos libres -> Permitir solo métodos GET específicos
        3. Webhooks con validación de firma externa -> Permitir POST específico
        4. Rutas clínicas y médicas -> Exigir autenticación Y rol exclusivo DOCTORA
        5. Rutas de administración y catálogos completos -> Exigir autenticación Y rol ADMIN
        6. Rutas de gestión de turnos y agenda -> Exigir autenticación Y roles STAFF (DOCTORA o SECRETARIA)
        7. CUALQUIER OTRA RUTA -> Rechazar por defecto (Deny All)
```

---
