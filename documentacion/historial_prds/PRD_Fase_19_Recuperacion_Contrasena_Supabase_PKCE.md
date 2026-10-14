# PRD FASE 19: Flujo Nativo de Recuperación de Contraseña con Supabase Auth PKCE (React 18 + Vite)

---

## 1. Encabezado y Resumen (Hoy vs. Después)

| Dimensión | Hoy | Después |
| :--- | :--- | :--- |
| **Mecanismo de Recuperación** | Mock simulado en cliente (`PasswordRecoveryView.tsx`) sin conexión a proveedor de identidad, o flujo legado acoplado a backend Spring Boot con tokens locales. | Flujo nativo de **Supabase Auth** utilizando intercambio criptográfico PKCE (*Proof Key for Code Exchange*). |
| **Agnosticismo de Base de Datos** | Dependencia de tablas custom (`password_reset_token`) en esquema público de PostgreSQL. | Delegación total al esquema `auth.users` gestionado por Supabase, eliminando almacenamiento inseguro de tokens manuales. |
| **Seguridad de Redirección (PKCE)** | Enlaces directos o simulados en memoria sin protección contra robo de enlaces o ataques de intermediario. | Interceptor de callback (`/auth/callback`) que intercambia el parámetro `code` por una sesión autenticada mediante `supabase.auth.exchangeCodeForSession(code)`. |
| **Validación y UX** | Validación básica de HTML sin feedback estricto de complejidad. | Esquemas Zod estrictos (longitud mínima, mayúsculas, minúsculas, números, caracteres especiales y coincidencia de confirmación), con UX ciega (*blind response*) para mitigar enumeración de usuarios. |
| **Pantalla de Actualización** | Inexistente en frontend. | Vista dedicada `/update-password` con guarda de sesión activa, validación reactiva y llamada atómica a `supabase.auth.updateUser({ password })`. |

---

## 2. La Historia (Antes vs. Después, sin tecnicismos)

### Antes:
Cuando un operador (médica, secretaria o administrador) olvidaba su contraseña e ingresaba a la pantalla de recuperación en la aplicación web, el sistema solo mostraba una simulación visual estática en pantalla ("¡Enlace enviado!"), sin enviar ningún correo electrónico real ni conectarse a un servicio de autenticación. En caso de requerir un cambio de credencial, debía intervenirse manualmente la base de datos o recurrir a métodos improvisados que ponían en riesgo la integridad del acceso.

### Después:
Cualquier operador puede ingresar su correo electrónico institucional en la pantalla de recuperación. La aplicación valida el formato con reglas estrictas y solicita a Supabase el envío de un correo con un enlace seguro de uso único. Al hacer clic en el correo, el usuario es redirigido a la aplicación web a través de un canal protegido (PKCE), donde el sistema canjea el código temporal por una sesión segura sin exponer credenciales en la URL. Acto seguido, se abre una interfaz donde el operador define su nueva contraseña con comprobaciones inmediatas de seguridad. Una vez guardada, la contraseña queda actualizada en Supabase y el operador puede iniciar sesión de inmediato.

---

## 3. Objetivos y No-Objetivos

### Objetivos:
1. **Flujo Nativo Supabase Auth:** Utilizar exclusivamente la SDK `@supabase/supabase-js` para el ciclo de vida de recuperación de contraseña (`resetPasswordForEmail`, `exchangeCodeForSession`, `updateUser`).
2. **Arquitectura React 18 / Vite SPA:** Adaptar la directiva PKCE al ecosistema tecnológico real del proyecto (Single Page Application con React Router v7 y Vite), implementando el interceptor en una ruta de cliente `/auth/callback`.
3. **Validación Zod Defensiva:**
   - Formulario de solicitud: Validación de formato de email RFC 5322.
   - Formulario de actualización: Mínimo 8 caracteres, al menos 1 letra mayúscula, 1 número, 1 símbolo especial, y validación estricta de confirmación identica (`refine`).
4. **Mitigación de Enumeración de Cuentas (UX Ciega):** Responder con un mensaje genérico de confirmación siempre que se solicite un restablecimiento, independientemente de si el correo existe o no en la plataforma.
5. **Protección de Ruta de Actualización:** Garantizar que `/update-password` solo sea accesible si existe una sesión válida de recuperación generada por el intercambio PKCE.

### No-Objetivos:
- No se modificarán las tablas del backend Spring Boot ni se utilizará la entidad `PasswordResetToken` de JPA.
- No se alterarán los roles ni permisos clínicos existentes en el backend.
- No se modificará la estructura de historias clínicas, consultas ni la tabla de auditoría `clinical_entries_audit`.
- No se implementa autenticación social (OAuth con Google o GitHub) en esta fase.

---

## 4. Cómo funciona hoy vs. después

### Flujo de Solicitud (`/recover-password` o `/forgot-password`):
- **Hoy:** `PasswordRecoveryView.tsx` intercepta el `onSubmit`, previene el comportamiento por defecto y hace `setSubmitted(true)` en el estado local de React.
- **Después:** `PasswordRecoveryView.tsx` valida el formulario con Zod + React Hook Form. Al enviar, ejecuta `supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/callback?next=/update-password` })`. Inmediatamente presenta una tarjeta informativa genérica y limpia los campos.

### Flujo de Retorno e Intercambio PKCE (`/auth/callback`):
- **Hoy:** La ruta `/auth/callback` no existe en `App.tsx`.
- **Después:** Se monta `AuthCallbackView.tsx` en `/auth/callback`.
  1. Extrae los parámetros de la URL (`code` o errores en query string/hash).
  2. Si `code` está presente, invoca `supabase.auth.exchangeCodeForSession(code)`.
  3. Si la respuesta es exitosa, navega automáticamente a `/update-password`.
  4. Si ocurre un error (enlace vencido, código manipulado o consumido previamente), muestra una pantalla de error amigable con botón para solicitar un nuevo enlace.

### Flujo de Cambio de Contraseña (`/update-password`):
- **Hoy:** No existe interfaz para actualizar la clave tras un enlace de correo.
- **Después:** Se monta `UpdatePasswordView.tsx` en `/update-password`.
  1. Verifica que exista sesión activa en Supabase Auth (`supabase.auth.getSession()`). Si no hay sesión válida, redirige a `/login` con advertencia.
  2. Presenta formulario con campos: "Nueva Contraseña" y "Confirmar Contraseña", con medidor visual de seguridad y visibilidad alternable (icono de ojo).
  3. Al enviar, invoca `supabase.auth.updateUser({ password: newPassword })`.
  4. Tras éxito, cierra la sesión temporal (`supabase.auth.signOut()`) y redirige a `/login` con notificación de éxito (toast de Sonner).

---

## 5. Los Datos (Triggers, candados lógicos, concurrencia)

1. **Gestión de Sesión y Tokens:**
   - La sesión criptográfica y el token de actualización residen en el almacenamiento seguro administrado por `@supabase/supabase-js` (Local Storage / PKCE Code Verifier en memoria de navegador).
   - El código PKCE enviado en el enlace es de uso único y tiene una ventana de expiración corta configurada en Supabase (típicamente 15 minutos o 1 hora).
2. **Invariantes Clínicas e Impacto en Auditoría:**
   - La operación de recuperación de contraseñas es estrictamente ortogonal a las entidades del dominio clínico (`Paciente`, `Cita`, `HistoriaClinica`, `EntradaClinica`).
   - La tabla `clinical_entries_audit` no recibe escrituras en este flujo, manteniéndose libre de riesgos de concurrencia o desalineación de triggers de negocio.
3. **Concurrencia e Idempotencia:**
   - Si un usuario solicita múltiples correos seguidos, Supabase invalida los códigos anteriores manteniendo únicamente el último emitido.
   - Si el enlace es abierto por duplicado, el segundo intento de `exchangeCodeForSession` fallará de manera segura y controlada.

---

## 6. Pseudo-código (El acuerdo en lenguaje natural)

```text
MODULO: RecuperacionContrasenaSupabasePKCE

PROCEDIMIENTO SolicitarRecuperacion(correo):
    Validar correo con esquema Zod (formato email estricto)
    Si validacion falla:
        Mostrar mensaje de error bajo el campo
        Terminar
    Intentar:
        URL_Retorno = OrigenActual() + "/auth/callback?next=/update-password"
        Llamar a supabase.auth.resetPasswordForEmail(correo, { redirectTo: URL_Retorno })
    Capturar cualquier excepcion:
        Registrar en consola para depuracion sin exponer detalle sensible
    FinIntentar
    // UX Ciega obligatoria
    Mostrar tarjeta de exito: "Si la cuenta existe, recibirás instrucciones en tu bandeja de entrada."
FIN PROCEDIMIENTO

PROCEDIMIENTO ProcesarCallbackPKCE():
    Obtener parametros URL (code, error_description)
    Si existe error_description o no existe code:
        Mostrar interfaz con error: "El enlace de recuperacion es invalido o ha expirado."
        Boton: "Solicitar nuevo enlace" -> Redirigir a /recover-password
        Terminar
    Intentar:
        Llamar a supabase.auth.exchangeCodeForSession(code)
        Si intercambio exitoso:
            Redirigir inmediatamente a /update-password
        Si intercambio falla:
            Mostrar interfaz de error con opcion de reintento
    Capturar error:
        Mostrar interfaz de error
    FinIntentar
FIN PROCEDIMIENTO

PROCEDIMIENTO ActualizarContrasena(nuevaContrasena, confirmacion):
    Comprobar sesion activa en supabase.auth.getSession()
    Si no hay sesion autenticada:
        Notificar "Sesión no autorizada o expirada"
        Redirigir a /login
        Terminar
    Validar con Zod:
        - Longitud >= 8
        - Al menos 1 mayuscula, 1 numero, 1 caracter especial
        - nuevaContrasena exactamente igual a confirmacion
    Si validacion falla:
        Mostrar errores en formulario
        Terminar
    Intentar:
        Llamar a supabase.auth.updateUser({ password: nuevaContrasena })
        Llamar a supabase.auth.signOut()
        Mostrar Toast de exito: "Tu contraseña ha sido restablecida con éxito."
        Redirigir a /login
    Capturar excepcion de Supabase:
        Mostrar mensaje de error retornado por Supabase
    FinIntentar
FIN PROCEDIMIENTO
```
