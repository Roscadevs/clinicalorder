# PRD FASE 21: Gestión, Listado y Edición de Usuarios del Staff (Panel Administrador)

---

## 1. Encabezado y Resumen (Hoy vs. Después)

| Dimensión | Hoy | Después |
| :--- | :--- | :--- |
| **Pestaña "Usuarios del Staff"** | `AdminServicesView.tsx` solo muestra un botón de creación y un texto informativo: *"El listado y la edición de usuarios existentes se agregará en una próxima etapa."* | Presenta un panel completo de gestión con tabla/grilla responsiva de operadores del staff, badges de rol (`ADMIN`, `DOCTORA`, `SECRETARIA`), switch o badge de estado (`Activo` / `Suspendido`), botón de edición y botón de activación/desactivación. |
| **Modal de Usuario (`UserFormModal.tsx`)** | Solo soporta creación en blanco (`authApi.register`), exigiendo contraseña y sin posibilidad de precarga de datos existentes. | Opera en modo dual: **Alta** (todos los campos obligatorios, incluyendo contraseña inicial) y **Edición** (precarga reactiva, contraseña opcional para cambio selectivo de credenciales, botón "Guardar Cambios"). |
| **Cliente API Frontend (`api.ts`)** | `authApi` únicamente cuenta con `login` y `register`. No existe llamada para listar usuarios, actualizarlos o modificar su estado activo. | Incorpora `usersApi` (o ampliación en `authApi`): `getAllUsers()`, `updateUser(id, data)` y `toggleUserActive(id, active)`, con soporte para modo demo simulado. |
| **Endpoints Backend** | Solo existen `/api/v1/auth/login`, `/register`, `/forgot-password`, `/reset-password`. No hay endpoints REST para consultar la nómina del staff ni actualizar operadores. | Incorpora controlador REST `/api/v1/usuarios` protegido con `@PreAuthorize("hasRole('ADMIN')")` para listar (`GET`), actualizar (`PUT /{id}`) y alternar estado activo (`PATCH /{id}/toggle-active`). |
| **Seguridad de DTOs** | El endpoint de registro `/auth/register` retorna la entidad `User` directamente, exponiendo el campo `passwordHash`. | Se introduce `UserResponseDTO`, omitiendo de forma definitiva y estricta el hash de la contraseña en todas las respuestas JSON hacia el cliente. |
| **Validación de Unicidad en Edición** | No existe validación de colisión para operadores existentes. | `UserService` valida unicidad de `username` y `email` excluyendo el identificador del propio operador que se edita (`id != targetId`). |

---

## 2. La Historia (Antes vs. Después, sin tecnicismos)

### Antes:
El administrador de la clínica podía crear nuevos usuarios para el personal (secretarias o médicas), pero una vez creados, los usuarios "desaparecían" de la interfaz gráfica. Si una secretaria cambiaba su apellido o correo institucional, si se cometía una errata al escribir su nombre de usuario, o si un miembro del equipo dejaba de trabajar en la clínica, el administrador no tenía manera de ver la lista del personal registrado, ni de corregir sus datos, ni de suspender su acceso. La única forma de resolverlo requería solicitar asistencia técnica para consultar y modificar directamente la base de datos PostgreSQL.

### Después:
Al ingresar a la sección de administración y seleccionar la pestaña de "Usuarios del staff", el administrador visualiza una tabla limpia y ordenada con todos los operadores del sistema. De un vistazo observa el nombre completo, el usuario de acceso, el correo, el rol asignado (con colores diferenciados para Administrador, Doctora o Secretaria) y el estado de la cuenta (Activo o Suspendido). Junto a cada operador dispone de un botón "Editar" que abre el formulario con sus datos precargados, permitiéndole corregir su nombre, correo, usuario, rol o cambiar su contraseña si la olvidó. Asimismo, cuenta con un botón para suspender o reactivar la cuenta de manera inmediata, impidiendo el inicio de sesión de ex-empleados con un solo clic y sin perder la trazabilidad de sus registros históricos.

---

## 3. Objetivos y No-Objetivos

### Objetivos:
1. **Listado Integral de Operadores:** Mostrar en `AdminServicesView.tsx` la nómina completa de usuarios del staff con roles, estado de activación y marcas temporales.
2. **Formulario Dual y Ergonómico:** Adaptar `UserFormModal.tsx` para admitir tanto el alta de nuevo operador como la edición de un operador existente (`user?: User`), haciendo opcional la contraseña en caso de edición.
3. **Acción Rápida de Activación/Suspensión:** Permitir al administrador suspender o reactivar el acceso de cualquier operador (con confirmación modal para prevenir bloqueos accidentales).
4. **Protección Criptográfica en Salida:** Garantizar que ninguna respuesta REST del backend transmita el hash BCrypt (`passwordHash`), utilizando el nuevo `UserResponseDTO`.
5. **Validación Defensiva Cruzada:** Evitar colisiones de nombre de usuario o correo electrónico al editar un operador contra otros usuarios registrados en el sistema.
6. **Protección Perimetral RBAC:** Restringir todos los métodos de consulta y modificación de usuarios exclusivamente al rol `ADMIN` tanto a nivel de URL en `SecurityConfig` como de método con `@PreAuthorize("hasRole('ADMIN')")`.

### No-Objetivos:
- No se permitirá la auto-desactivación del propio administrador en sesión para evitar bloqueos del sistema sin operadores activos (*lockout*).
- No se realizarán borrados físicos (`DELETE` en cascada) sobre la tabla `usuario` para garantizar la integridad referencial histórica en citas y auditorías.
- No se alterarán los mecanismos inmutables de auditoría médica en `clinical_entries_audit`.

---

## 4. Cómo funciona hoy vs. después

### Flujo de Visualización y Gestión:
- **Hoy:** 
  - El administrador abre la pestaña "Usuarios del staff".
  - Solo ve el botón "Crear usuario" y un texto que indica que el listado vendrá en una próxima etapa.
- **Después:**
  - El administrador abre la pestaña "Usuarios del staff".
  - Se consulta automáticamente la nómina mediante `usersApi.getAllUsers()`.
  - Se renderiza una tabla elegante con:
    - Nombre completo y Nombre de usuario.
    - Rol con insignia distintiva (Púrpura para Admin, Turquesa para Doctora, Ámbar para Secretaria).
    - Estado con indicador visual (Verde para Activo, Gris/Rojo para Suspendido).
    - Acciones: Botón de edición (ícono de lápiz) y botón de alternar estado (ícono de candado / switch).

### Flujo de Edición de Usuario:
- **Hoy:** 
  - Inexistente.
- **Después:**
  - El administrador hace clic en "Editar" sobre un usuario de la lista.
  - Se abre `UserFormModal` con los datos del operador precargados (nombre, usuario, email, rol).
  - El campo de contraseña se titula *"Nueva contraseña (opcional - dejar en blanco para conservar actual)"*.
  - El administrador modifica los datos requeridos y presiona "Guardar cambios".
  - Si se ingresó una contraseña, se valida que cumpla con el mínimo de 8 caracteres; si se dejó en blanco, se preserva el hash existente.
  - El sistema actualiza los datos en la base de datos, refresca el listado local y notifica el éxito.

### Flujo de Suspensión / Reactivación:
- **Hoy:** 
  - Inexistente.
- **Después:**
  - El administrador hace clic en "Suspender cuenta" o "Reactivar cuenta".
  - Se presenta un diálogo de confirmación claro advirtiendo las consecuencias del bloqueo.
  - Al confirmar, se invoca `usersApi.toggleUserActive(id, nuevoEstado)`.
  - La cuenta se actualiza instantáneamente en pantalla y dicho operador no podrá volver a iniciar sesión hasta ser reactivado.

---

## 5. Los Datos (Triggers, candados lógicos, concurrencia)

1. **Estructura de la Tabla `usuario`:**
   - Columnas: `id` (PK), `username` (UNIQUE), `password_hash`, `email` (UNIQUE), `full_name`, `role`, `active`, `created_at`, `updated_at`.
   - Modificación sin migración destructiva: la estructura de base de datos actual ya soporta todos los campos necesarios.
2. **Validación de Unicidad Defensiva en Edición:**
   - Métodos en el repositorio:
     - `existsByUsernameAndIdNot(String username, Long id)`
     - `existsByEmailAndIdNot(String email, Long id)`
   - Si colisiona con otro usuario, se dispara `BusinessRuleException` traducida en RFC 7807 (HTTP 409 Conflict o 400 Bad Request).
3. **Regla de Negocio Anti-Lockout:**
   - Un administrador no puede desactivar su propia cuenta de usuario en sesión.
   - Debe existir al menos un administrador activo en el sistema.
4. **Hashing Criptográfico Inmutable:**
   - Si el campo `password` en la solicitud de edición viene presente y no vacío, se codifica con BCrypt (costo 12).
   - Si viene nulo o vacío, el campo `passwordHash` previo se conserva intacto.
5. **Aislamiento de Auditoría Clínica:**
   - La tabla `usuario` no participa en la lógica clínica de evolución médica, por lo que `clinical_entries_audit` permanece totalmente inalterada y protegida.

---

## 6. Pseudo-código (El acuerdo en lenguaje natural)

```text
MODULO: GestionUsuariosStaff

// FRONTEND: UserFormModal Dual
COMPONENTE UserFormModal(usuarioExistente, alGuardar, alCerrar):
    Si usuarioExistente esta definido:
        Inicializar formulario con (usuarioExistente.fullName, username, email, role)
        password = vacio
        TituloModal = "Editar usuario del staff"
        TextoBoton = "Guardar cambios"
        PasswordRequerida = FALSO
    Sino:
        Inicializar campos vacios, role = "SECRETARIA"
        TituloModal = "Nuevo usuario del staff"
        TextoBoton = "Crear usuario"
        PasswordRequerida = VERDADERO
    FinSi

    AL ENVIAR(formulario):
        Validar formato de email y longitud de username >= 3
        Si PasswordRequerida O formulario.password no esta vacio:
            Validar longitud de password >= 8
        FinSi

        Si usuarioExistente esta definido:
            Llamar a usersApi.updateUser(usuarioExistente.id, formulario)
            Notificar exito "Usuario actualizado correctamente"
        Sino:
            Llamar a usersApi.createUser(formulario)
            Notificar exito "Usuario creado correctamente"
        FinSi
        alGuardar()
        alCerrar()
    FIN AL ENVIAR

// FRONTEND: Vista AdminServicesView (Pestaña Usuarios)
COMPONENTE AdminUsuariosStaff():
    Cargar lista de usuarios con usersApi.getAllUsers()
    Renderizar boton "Crear usuario"
    Renderizar tabla de usuarios con columnas:
        - Nombre completo y Username
        - Insignia de Rol (ADMIN, DOCTORA, SECRETARIA)
        - Insignia de Estado (Activo / Suspendido)
        - Boton Editar (Abre UserFormModal con usuario seleccionado)
        - Boton Suspender/Reactivar (Abre dialogo de confirmacion)

// BACKEND: Servicio UserService
PROCEDIMIENTO getAllUsers():
    Consultar todos los usuarios en userRepository ordenados por id ascendente
    Mapear cada entidad User a UserResponseDTO (omitiendo passwordHash)
    Retornar lista de UserResponseDTO
FIN PROCEDIMIENTO

PROCEDIMIENTO updateUser(idUsuario, peticion):
    Buscar usuario por idUsuario
    Si no existe:
        Lanzar ResourceNotFoundException("Usuario no encontrado")

    Verificar si existe otro usuario con peticion.username y distinto ID
    Si existe:
        Lanzar BusinessRuleException("El nombre de usuario ya se encuentra en uso")

    Verificar si existe otro usuario con peticion.email y distinto ID
    Si existe:
        Lanzar BusinessRuleException("El correo electronico ya se encuentra en uso")

    usuario.fullName = peticion.fullName
    usuario.username = peticion.username
    usuario.email = peticion.email
    usuario.role = peticion.role

    Si peticion.password no es nulo Y no esta vacio:
        usuario.passwordHash = passwordEncoder.encode(peticion.password)
    FinSi

    Guardar usuario en repositorio
    Retornar UserResponseDTO mapeado
FIN PROCEDIMIENTO

PROCEDIMIENTO toggleUserActive(idUsuario, nuevoEstado, usuarioEnSesion):
    Buscar usuario por idUsuario
    Si no existe:
        Lanzar ResourceNotFoundException("Usuario no encontrado")

    Si usuario.id == usuarioEnSesion.id Y nuevoEstado == FALSO:
        Lanzar BusinessRuleException("No puede suspender su propia cuenta de administrador")

    usuario.active = nuevoEstado
    Guardar usuario en repositorio
    Retornar UserResponseDTO mapeado
FIN PROCEDIMIENTO
```
