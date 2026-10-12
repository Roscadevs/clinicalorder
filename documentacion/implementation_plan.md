# Plan Técnico de Implementación: Flujo Nativo de Recuperación de Contraseña (Supabase Auth PKCE en React 18 + Vite)

---

## 1. Base de Datos & Persistencia
* **Agnosticismo de Esquema Custom:**
  - No se generarán nuevas migraciones Flyway ni modificaciones sobre las tablas de PostgreSQL.
  - La tabla `password_reset_token` y el backend tradicional se omiten en este flujo; la gestión de credenciales se transfiere enteramente a la infraestructura de identidad nativa de Supabase (`auth.users`).
* **Auditoría e Invariantes (`clinical_entries_audit` & `@Version`):**
  - Cero interacción con entidades clínicas (`Paciente`, `Cita`, `HistoriaClinica`, `EntradaClinica`).
  - No se tocan entidades JPA ni sus anotaciones `@Version`.
  - La tabla `clinical_entries_audit` no recibe modificaciones ni dispara eventos en este módulo.

---

## 2. Backend (Spring Boot)
* El backend no interviene en el intercambio PKCE de Supabase Auth, manteniendo una arquitectura limpia y desacoplada.
* Los endpoints existentes (`/api/v1/auth/...`) permanecen sin cambios para compatibilidad de sesiones legacy o pruebas internas.
* No se compromete la convención de respuestas de error RFC 7807 del sistema.

---

## 3. Frontend (React 18 + Vite + TypeScript + Supabase JS)

### 3.1. Configuración de Cliente Supabase (`frontend/src/services/supabaseClient.ts`)
* Garantizar que la inicialización de `createClient` habilite explícitamente el flujo PKCE y la detección de sesión:
  ```ts
  auth: {
    flowType: 'pkce',
    autoRefreshToken: true,
    detectSessionInUrl: true,
    persistSession: true,
  }
  ```

### 3.2. Esquemas de Validación Zod (`frontend/src/features/auth/schemas/recoverySchemas.ts`)
* **`forgotPasswordSchema`:**
  - `email`: Formato de correo electrónico válido RFC 5322, normalizado en minúsculas.
* **`updatePasswordSchema`:**
  - `password`: Mínimo 8 caracteres, al menos 1 letra mayúscula, 1 letra minúscula, 1 número y 1 carácter especial (`/[!@#$%^&*(),.?":{}|<>]/`).
  - `confirmPassword`: Texto requerido.
  - Regla `refine`: `data.password === data.confirmPassword`, mensaje *"Las contraseñas no coinciden"*.

### 3.3. Vista de Solicitud de Recuperación (`frontend/src/features/auth/PasswordRecoveryView.tsx`)
* Formulario defensivo con React Hook Form y `@hookform/resolvers/zod`.
* Invocación a `supabase.auth.resetPasswordForEmail`:
  ```ts
  const redirectTo = `${window.location.origin}/auth/callback?next=/update-password`;
  await supabase.auth.resetPasswordForEmail(data.email, { redirectTo });
  ```
* **UX Ciega:** Presentación incondicional de tarjeta de confirmación ("Si el correo se encuentra registrado en el sistema, recibirás un enlace de recuperación"), mitigando ataques de fuerza bruta y enumeración de usuarios.
* **Ergonomía Móvil:** Botones con altura táctil mínima de 44px, inputs con `autoComplete="email"` y `inputMode="email"`.

### 3.4. Interceptor PKCE de Callback (`frontend/src/features/auth/AuthCallbackView.tsx`) - *Nuevo Componente*
* Componente cliente montado en la ruta `/auth/callback`.
* **Procesamiento de URL:**
  - Extrae `code` de los parámetros de búsqueda (`window.location.search`).
  - Detecta parámetros de error emitidos por Supabase (`error`, `error_code`, `error_description`).
* **Intercambio Criptográfico:**
  - Llama a `supabase.auth.exchangeCodeForSession(code)`.
  - Muestra un estado de carga estilizado con spinner y mensaje: *"Verificando enlace de seguridad..."*.
  - En caso de éxito, redirige a la ruta especificada en el parámetro `next` (por defecto `/update-password`).
  - En caso de error (código expirado, enlace ya utilizado o inválido), muestra pantalla de error amigable con botón de acción para solicitar un nuevo enlace en `/recover-password`.

### 3.5. Vista de Actualización de Contraseña (`frontend/src/features/auth/UpdatePasswordView.tsx`) - *Nuevo Componente*
* Componente montado en la ruta `/update-password`.
* **Guarda de Seguridad:**
  - Comprueba en el montaje si existe una sesión activa mediante `supabase.auth.getSession()`.
  - Si no existe sesión válida o autenticada, redirige de inmediato a `/login` alertando de sesión no autorizada.
* **Formulario Defensivo:**
  - Inputs para "Nueva Contraseña" y "Confirmar Contraseña" con botones de alternancia de visibilidad (ojo abierto/cerrado con Lucide Icons).
  - Indicador dinámico de complejidad de contraseña (barra visual y checklist de requisitos).
* **Actualización en Supabase:**
  - Invoca `supabase.auth.updateUser({ password: data.password })`.
  - Tras resolución exitosa:
    - Ejecuta `supabase.auth.signOut()` para invalidar la sesión temporal de recuperación.
    - Despliega toast de éxito con Sonner: *"Contraseña actualizada exitosamente. Por favor, inicia sesión con tu nueva clave."*
    - Redirige a `/login`.

### 3.6. Enrutamiento en `frontend/src/App.tsx`
* Registrar las rutas públicas:
  - `/recover-password` y `/forgot-password` apuntando a `PasswordRecoveryView`.
  - `/auth/callback` apuntando a `AuthCallbackView`.
  - `/update-password` apuntando a `UpdatePasswordView`.

---

## 4. Configuración del Panel de Supabase (Guía para el Usuario)
* Documentar con precisión la configuración necesaria en Supabase Dashboard:
  - **Site URL:** Configurar el dominio de la aplicación (`https://clinicalorder.eliasdelcastillo.com` o `http://localhost:5173`).
  - **Redirect URLs:** Agregar `${ORIGIN}/auth/callback**`.
  - **Email Template (Reset Password):** Asegurar que el hipervínculo en el cuerpo del correo utilice `{{ .ConfirmationURL }}` apuntando al endpoint de redirección.

---

## 5. Pruebas y Criterios de Aceptación
1. **Validación Estática de Tipos TypeScript:**
   - Comando: `cd frontend && npx tsc --noEmit`
   - Criterio: 0 errores de tipado en los nuevos componentes y esquemas.
2. **Empaquetado y Build de Frontend:**
   - Comando: `cd frontend && npm run build`
   - Criterio: Finalización con código de salida 0, sin advertencias bloqueantes ni errores de bundle.
3. **Suite de Verificación del Backend:**
   - Comando: `cd backend && mvn test`
   - Criterio: Éxito total de las pruebas unitarias y de integración sin regresiones.
