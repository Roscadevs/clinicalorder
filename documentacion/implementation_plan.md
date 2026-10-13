# PLAN TÉCNICO DE IMPLEMENTACIÓN: FASE 21
## Gestión, Listado y Edición de Usuarios del Staff (Panel Administrador)

---

## 1. Arquitectura y Base de Datos

### 1.1. Base de Datos (PostgreSQL & Flyway)
- **Tabla:** `usuario` (creada en migración Flyway `V4__create_initial_schema.sql`).
- **Esquema:**
  - `id BIGSERIAL PRIMARY KEY`
  - `username VARCHAR(50) NOT NULL UNIQUE`
  - `password_hash VARCHAR(255) NOT NULL`
  - `email VARCHAR(100) NOT NULL UNIQUE`
  - `full_name VARCHAR(100) NOT NULL`
  - `role VARCHAR(20) NOT NULL` (`ADMIN`, `DOCTORA`, `SECRETARIA`)
  - `active BOOLEAN NOT NULL DEFAULT true`
  - `created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()`
  - `updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()`
- **Estrategia Flyway:** No se requieren migraciones DDL adicionales ya que la tabla cuenta con todas las columnas necesarias. Se preserva el principio de migraciones no destructivas.

---

## 2. Capa de Backend (Spring Boot 3 / Clean Architecture)

### 2.1. Entidades y Repositorios
- **Entidad:** [`User.java`](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/backend/src/main/java/com/clinicadermatologica/app/domain/model/User.java)
  - Conserva su mapeo JPA intacto. No se modifica ninguna anotación existente.
- **Contrato de Dominio:** [`UserRepository.java`](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/backend/src/main/java/com/clinicadermatologica/app/domain/repository/UserRepository.java)
  - Adición de métodos de consulta:
    - `List<User> findAll();`
    - `boolean existsByUsernameAndIdNot(String username, Long id);`
    - `boolean existsByEmailAndIdNot(String email, Long id);`
- **Repositorio JPA:** [`JpaUserRepository.java`](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/jpa/JpaUserRepository.java)
  - Métodos derivados Spring Data JPA:
    - `boolean existsByUsernameAndIdNot(String username, Long id);`
    - `boolean existsByEmailAndIdNot(String email, Long id);`
- **Adaptador:** [`UserRepositoryAdapter.java`](file:///Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP/backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/adapter/UserRepositoryAdapter.java)
  - Implementación de los nuevos métodos delegando en `JpaUserRepository`.

### 2.2. DTOs (Data Transfer Objects)
- **`UserResponseDTO.java`** (Nuevo en `presentation/dto`):
  - Campos: `id`, `username`, `email`, `fullName`, `role`, `active`, `createdAt`, `updatedAt`.
  - **Seguridad Criptográfica:** No incluye `passwordHash` bajo ninguna circunstancia, eliminando la filtración de credenciales.
- **`UpdateUserRequestDTO.java`** (Nuevo en `presentation/dto`):
  - Campos:
    - `@NotBlank @Size(min = 3, max = 50) private String username;`
    - `@NotBlank @Email private String email;`
    - `@NotBlank private String fullName;`
    - `@NotNull private UserRole role;`
    - `private String password;` (Opcional; si no viene vacío, debe tener al menos 8 caracteres).

### 2.3. Servicio de Aplicación (`UserService.java`)
- **Clase:** `com.clinicadermatologica.app.application.service.UserService`
- **Anotaciones:** `@Service`, `@RequiredArgsConstructor`, `@Slf4j`
- **Dependencias:** `UserRepository`, `PasswordEncoder`
- **Métodos:**
  - `@Transactional(readOnly = true) public List<UserResponseDTO> getAllUsers()`:
    - Retorna todos los usuarios ordenados por ID mapeados a `UserResponseDTO`.
  - `@Transactional public UserResponseDTO updateUser(Long id, UpdateUserRequestDTO request)`:
    - Valida existencia del usuario (404 `ResourceNotFoundException`).
    - Valida unicidad de `username` mediante `existsByUsernameAndIdNot` (409/400 `BusinessRuleException`).
    - Valida unicidad de `email` mediante `existsByEmailAndIdNot` (409/400 `BusinessRuleException`).
    - Actualiza `fullName`, `username`, `email` y `role`.
    - Si `request.getPassword()` no es nulo ni vacío, valida longitud y codifica con BCrypt (`passwordEncoder.encode`).
    - Guarda y retorna `UserResponseDTO`.
  - `@Transactional public UserResponseDTO toggleUserActive(Long id, boolean active, String currentUsername)`:
    - Valida existencia del usuario (404).
    - Valida regla de negocio anti-lockout: si el usuario es el administrador en sesión y se intenta desactivar (`!active`), rechaza la solicitud (`BusinessRuleException("No puede suspender su propia cuenta de administrador en sesión")`).
    - Actualiza `active = active`.
    - Guarda y retorna `UserResponseDTO`.

### 2.4. Controlador REST (`UserController.java`)
- **Ruta:** `/usuarios` (prefijo `/api/v1/usuarios`)
- **Anotaciones:** `@RestController`, `@RequestMapping("/usuarios")`, `@RequiredArgsConstructor`, `@PreAuthorize("hasRole('ADMIN')")`
- **Endpoints:**
  - `GET /usuarios`: retorna `ResponseEntity<List<UserResponseDTO>>` (HTTP 200).
  - `PUT /usuarios/{id}`: recibe `@PathVariable Long id`, `@Valid @RequestBody UpdateUserRequestDTO request`, retorna `ResponseEntity<UserResponseDTO>` (HTTP 200).
  - `PATCH /usuarios/{id}/toggle-active`: recibe `@PathVariable Long id`, `@RequestParam boolean active`, `Authentication auth`, retorna `ResponseEntity<UserResponseDTO>` (HTTP 200).
- **Manejo de Errores:** Centralizado en `GlobalExceptionHandler` con formato estándar RFC 7807 (`ProblemDetail`).

### 2.5. Seguridad Perimetral (`SecurityConfig.java`)
- Agregar regla explícita en `securityFilterChain`:
  - `.requestMatchers("/usuarios/**").hasRole("ADMIN")`

---

## 3. Capa de Frontend (React 18 / TypeScript / Tailwind CSS)

### 3.1. Definición de Tipos (`types/index.ts`)
- Declarar interfaz `User`:
  ```typescript
  export interface User {
    id: number;
    username: string;
    email: string;
    fullName: string;
    role: UserRole;
    active: boolean;
    createdAt?: string;
    updatedAt?: string;
  }
  ```

### 3.2. Cliente API (`services/api.ts`)
- Declarar `usersApi`:
  - `getAllUsers(): Promise<User[]>`: invoca `GET /usuarios` con fallback resiliente en modo demo (`DEMO_USERS`).
  - `updateUser(id: number, data: UpdateUserData): Promise<User>`: invoca `PUT /usuarios/{id}`.
  - `toggleUserActive(id: number, active: boolean): Promise<User>`: invoca `PATCH /usuarios/{id}/toggle-active?active={active}`.

### 3.3. Modal Dual de Usuario (`UserFormModal.tsx`)
- Props actualizadas:
  - `isOpen: boolean`
  - `onClose: () => void`
  - `user?: User | null` (usuario a editar, o nulo para alta)
  - `onSaved: () => void`
- Comportamiento:
  - En alta (`!user`): contraseña requerida (min 8 caracteres), título "Nuevo usuario del staff", botón "Crear usuario".
  - En edición (`!!user`): campos precargados con `user`, contraseña opcional ("Nueva contraseña - dejar en blanco para conservar actual"), título "Editar usuario del staff", botón "Guardar cambios".
  - Captura y muestra de errores del backend con `Callout intent="error"`.

### 3.4. Pestaña de Usuarios en Panel Administrador (`AdminServicesView.tsx`)
- Estado:
  - Lista de operadores `users: User[]`, `loadingUsers: boolean`.
  - Usuario en edición `editingUser: User | null`.
  - Diálogo de confirmación para suspender/reactivar usuario.
- UI:
  - Encabezado con título "Usuarios del staff", descripción y botón principal "Crear usuario".
  - Tabla responsiva estilizada con Tailwind:
    - **Nombre y Usuario:** Nombre en negrita, username en texto secundario.
    - **Correo:** Dirección institucional.
    - **Rol:** Badge visual (`ADMIN` -> Púrpura, `DOCTORA` -> Turquesa, `SECRETARIA` -> Ámbar).
    - **Estado:** Badge (`Activo` -> Verde esmeralda, `Suspendido` -> Rojo/Gris suave).
    - **Acciones:**
      - Botón "Editar" (ícono `Pencil`) -> abre `UserFormModal` con el usuario.
      - Botón "Suspender" / "Reactivar" (ícono `UserX` / `UserCheck`) -> abre modal de confirmación con advertencia de seguridad.

---

## 4. Pruebas y Plan de Verificación

### 4.1. Pruebas Unitarias Backend (`UserServiceTest.java`)
- Suite completa con JUnit 5 y Mockito:
  1. `testGetAllUsers_Success`: retorna lista de DTOs sin hash.
  2. `testUpdateUser_Success`: actualiza datos y codifica contraseña si fue provista.
  3. `testUpdateUser_KeepPassword_WhenPasswordEmpty`: conserva hash anterior si contraseña es nula o vacía.
  4. `testUpdateUser_UsernameCollision_ThrowsException`: rechaza si el username ya lo tiene otro operador.
  5. `testUpdateUser_EmailCollision_ThrowsException`: rechaza si el email ya lo tiene otro operador.
  6. `testUpdateUser_UserNotFound_ThrowsException`: emite 404 si el ID no existe.
  7. `testToggleUserActive_Success`: actualiza estado activo.
  8. `testToggleUserActive_SelfDeactivationBlocked_ThrowsException`: rechaza si el admin intenta suspender su propia cuenta.

### 4.2. Ejecución de Tests y Verificación Autónoma
- Backend:
  ```bash
  JAVA_HOME=/opt/homebrew/opt/openjdk@17 mvn test
  ```
- Frontend:
  ```bash
  cd frontend && npm run build && npx tsc --noEmit
  ```

### 4.3. Auditoría de Invariantes
- Verificar que ninguna operación sobre `usuario` afecte la tabla `clinical_entries_audit`.
- Confirmar que las respuestas de error sigan el estándar RFC 7807 (`ProblemDetail`).
- Confirmar que `passwordHash` jamás sea serializado en respuestas REST.
