# Glosario Técnico, Métodos, Anotaciones y Conceptos del Sistema

**Proyecto:** Sistema Integral de Gestión Dermatológica y Estética con Inteligencia Artificial  
**Versión:** 2.0.0 (Fases 1 y 2) · **Fecha:** 2026-08-22  
**Finalidad:** Documentar en detalle todas las funciones, métodos de negocio, anotaciones del lenguaje Java/Spring Boot, utilidades de seguridad, hooks de React, frameworks de testing y patrones de Clean Code implementados en el proyecto.

---

## 1. Anotaciones de Java y Spring Boot (Backend)

### Anotaciones de Persistencia y Mapeo Objeto-Relacional (JPA / Hibernate)

| Anotación | Paquete | Propósito y Comportamiento |
| :--- | :--- | :--- |
| `@Entity` | `jakarta.persistence.Entity` | Declara que una clase de Java es una entidad administrada por JPA y se mapea a una tabla de base de datos relacional. |
| `@Table` | `jakarta.persistence.Table` | Especifica el nombre explícito de la tabla en PostgreSQL (ej. `@Table(name = "cita")`) y define índices o restricciones únicas a nivel de tabla. |
| `@Id` | `jakarta.persistence.Id` | Declara el atributo que actúa como Clave Primaria (Primary Key) de la entidad. |
| `@GeneratedValue` | `jakarta.persistence.GeneratedValue` | Define la estrategia de generación de la clave primaria (`GenerationType.IDENTITY` para columnas `BIGSERIAL` autoincrementales en PostgreSQL). |
| `@Version` | `jakarta.persistence.Version` | Habilita el **Control de Concurrencia Optimista**. Hibernate incrementa automáticamente este contador en cada `UPDATE`. Si dos transacciones intentan actualizar el mismo registro simultáneamente, la segunda falla arrojando `OptimisticLockException`, evitando la doble reserva. |
| `@Column` | `jakarta.persistence.Column` | Mapea un campo a una columna específica de la base de datos, configurando nulabilidad (`nullable = false`), longitud máxima (`length = 100`) y unicidad (`unique = true`). |
| `@Enumerated` | `jakarta.persistence.Enumerated` | Mapea un `enum` de Java a la base de datos como cadena de texto legible (`EnumType.STRING`) en lugar de su ordinal numérico. |
| `@ManyToOne` | `jakarta.persistence.ManyToOne` | Define una relación de muchos a uno entre entidades con `fetch = FetchType.LAZY` para optimizar el consumo de memoria. |
| `@OneToMany` | `jakarta.persistence.OneToMany` | Define una relación de uno a muchos (ej. una Historia Clínica contiene muchas Entradas Clínicas). |
| `@OneToOne` | `jakarta.persistence.OneToOne` | Define una relación uno a uno estricta (ej. un Paciente tiene exactamente una Historia Clínica). |
| `@JoinColumn` | `jakarta.persistence.JoinColumn` | Especifica el nombre de la columna física que actúa como Clave Foránea (Foreign Key) en la tabla (ej. `name = "paciente_id"`). |
| `@CreationTimestamp` | `org.hibernate.annotations.CreationTimestamp` | Asigna automáticamente la fecha y hora actual del sistema al momento de insertar el registro. |
| `@UpdateTimestamp` | `org.hibernate.annotations.UpdateTimestamp` | Actualiza automáticamente la fecha y hora cada vez que el registro sufre una modificación. |
| `@Modifying` | `org.springframework.data.jpa.repository.Modifying` | Indica que una consulta JPQL ejecuta una sentencia DML de modificación directa (`UPDATE` o `DELETE`). |
| `@Query` | `org.springframework.data.jpa.repository.Query` | Permite escribir consultas personalizadas en JPQL o SQL nativo. |
| `@Param` | `org.springframework.data.repository.query.Param` | Vincula un parámetro del método Java con un parámetro con nombre dentro de la consulta `@Query`. |

### Anotaciones de Control Transaccional y Lógica de Negocio

| Anotación | Paquete | Propósito y Comportamiento |
| :--- | :--- | :--- |
| `@Service` | `org.springframework.stereotype.Service` | Marca una clase como componente de servicio en la capa de aplicación, gestionada por el contenedor de inversión de control (IoC) de Spring. |
| `@Transactional` | `org.springframework.transaction.annotation.Transactional` | Delimita una transacción física en la base de datos con soporte de rollback automático ante excepciones. |
| `@Scheduled` | `org.springframework.scheduling.annotation.Scheduled` | Ejecuta un método de forma periódica en segundo plano según una frecuencia fija (`fixedRate = 60000` para 60 segundos). |
| `@Component` | `org.springframework.stereotype.Component` | Marca una clase como componente general administrado por Spring. |
| `@Configuration` | `org.springframework.context.annotation.Configuration` | Declara que una clase contiene métodos de definición de beans `@Bean`. |
| `@Bean` | `org.springframework.context.annotation.Bean` | Produce una instancia administrada por el contenedor IoC de Spring. |
| `@Value` | `org.springframework.beans.factory.annotation.Value` | Inyecta valores de configuración definidos en `application.yml` o variables de entorno. |

### Anotaciones de Exposición REST y Validación (Capa de Presentación)

| Anotación | Paquete | Propósito y Comportamiento |
| :--- | :--- | :--- |
| `@RestController` | `org.springframework.web.bind.annotation.RestController` | Controlador REST con serialización JSON automática por Jackson. |
| `@RequestMapping` | `org.springframework.web.bind.annotation.RequestMapping` | Define la ruta URL base para los endpoints del controlador (ej. `/api/v1/citas`). |
| `@GetMapping` / `@PostMapping` / `@PutMapping` / `@DeleteMapping` | `org.springframework.web.bind.annotation.*` | Mapean solicitudes HTTP para operaciones GET, POST, PUT y DELETE. |
| `@RequestBody` | `org.springframework.web.bind.annotation.RequestBody` | Deserializa el cuerpo JSON de la petición HTTP a un objeto DTO de Java. |
| `@PathVariable` | `org.springframework.web.bind.annotation.PathVariable` | Extrae variables dinámicas incrustadas en la URL (ej. `/api/v1/pacientes/{id}`). |
| `@RequestParam` | `org.springframework.web.bind.annotation.RequestParam` | Extrae parámetros de consulta (*query parameters*) de la URL. |
| `@Valid` | `jakarta.validation.Valid` | Dispara el motor de validación de Bean Validation sobre el DTO antes de ejecutar el método. |
| `@NotNull` / `@NotBlank` / `@Size` / `@Pattern` / `@Email` / `@Min` / `@Max` | `jakarta.validation.constraints.*` | Restricciones declarativas de validación de campos. |
| `@RestControllerAdvice` | `org.springframework.web.bind.annotation.RestControllerAdvice` | Interceptor global transversal que captura excepciones y estandariza respuestas JSON de error. |
| `@ExceptionHandler` | `org.springframework.web.bind.annotation.ExceptionHandler` | Mapea un método específico para manejar un tipo determinado de excepción. |

### Anotaciones de Seguridad y Control de Acceso (Spring Security)

| Anotación | Paquete | Propósito y Comportamiento |
| :--- | :--- | :--- |
| `@EnableWebSecurity` | `org.springframework.security.config.annotation.web.configuration.EnableWebSecurity` | Habilita la seguridad web personalizada. |
| `@EnableMethodSecurity` | `org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity` | Habilita la evaluación declarativa de seguridad a nivel de métodos con `@PreAuthorize`. |
| `@PreAuthorize` | `org.springframework.security.access.prepost.PreAuthorize` | Evalúa expresiones SpEL de autorización (ej. `hasRole('PHYSICIAN')`). |
| `@CrossOrigin` | `org.springframework.web.bind.annotation.CrossOrigin` | Configura políticas de CORS para clientes web externos. |

### Anotaciones de Testing (JUnit 5 y Mockito)

| Anotación | Paquete | Propósito y Comportamiento |
| :--- | :--- | :--- |
| `@ExtendWith` | `org.junit.jupiter.api.extension.ExtendWith` | Registra extensiones en JUnit 5 (ej. `MockitoExtension.class` para inicializar mocks). |
| `@Test` | `org.junit.jupiter.api.Test` | Declara un método como caso de prueba ejecutable por el motor JUnit. |
| `@BeforeEach` | `org.junit.jupiter.api.BeforeEach` | Ejecuta un método de preparación antes de cada método de test. |
| `@DisplayName` | `org.junit.jupiter.api.DisplayName` | Define un nombre legible y descriptivo para el reporte de ejecución del test. |
| `@Mock` | `org.mockito.Mock` | Crea una instancia simulada (*mock*) de una interfaz o clase dependiente. |
| `@InjectMocks` | `org.mockito.InjectMocks` | Instancia la clase bajo prueba inyectando automáticamente los `@Mock` declarados. |
| `@Spy` | `org.mockito.Spy` | Crea un *wrapper* sobre un objeto real permitiendo verificar interacciones y ejecutar métodos reales. |

---

## 2. Catálogo de Métodos y Funciones de Negocio (Backend)

### 1. `AppointmentService.getAvailableSlots(LocalDate date, Long serviceId)`
- **Propósito:** Calcula dinámicamente las franjas horarias disponibles de 09:00 a 19:00 hs para una fecha y servicio determinados.
- **Comportamiento:**
  1. Genera slots de tiempo discretos según la duración del tratamiento.
  2. Descarta franjas previas a la hora actual más 2 horas de antelación mínima.
  3. Filtra colisiones con citas confirmadas o reservas temporales en plazo de 10 minutos.
  4. Filtra colisiones con bloqueos de calendario por vacaciones o feriados.

### 2. `AppointmentService.bookTemporaryHold(BookAppointmentRequestDTO request, Long createdByUserId)`
- **Propósito:** Bloquea temporalmente un turno durante 10 minutos y genera el link de pago de seña en MercadoPago.
- **Comportamiento:** Valida disponibilidad, crea cita en `PENDING_PAYMENT` con deadline a 10 min, invoca SDK de MercadoPago por el 50% y persiste la transacción de pago en `PENDING`.

### 3. `AppointmentService.releaseExpiredHoldsScheduler()`
- **Propósito:** Tarea programada (Cron Job cada 60s) que actualiza masivamente a `PAYMENT_FAILED` los turnos con deadline vencido.

### 4. `PaymentService.processMercadoPagoWebhook(Map<String, Object> payload)`
- **Propósito:** Procesa notificaciones asíncronas de MercadoPago, verifica el estado en la API oficial y confirma el turno (`CONFIRMED`).

### 5. `PaymentService.registerFinalPayment(Long appointmentId, FinalizePaymentRequestDTO request, Long receptionistUserId)`
- **Propósito:** Registra el cobro en mostrador del 50% restante (efectivo/tarjeta) y finaliza el turno a `COMPLETED`.

### 6. `MedicalRecordService.saveOrUpdateMedicalRecord(Long patientId, MedicalRecordDTO dto, Long physicianUserId)`
- **Propósito:** Guarda o actualiza la ficha médica general, insertando un snapshot JSON inmutable en `historia_clinica_audit`.

### 7. `MedicalRecordService.addClinicalEntry(ClinicalEntryRequestDTO request, Long physicianUserId)`
- **Propósito:** Agrega una nota de evolución de sesión ligada al turno y a la médica autora.

### 8. `ClinicalImageService.uploadClinicalImage(Long medicalRecordId, MultipartFile file, String description)`
- **Propósito:** Valida tipo MIME y tamaño (<5MB), almacena la fotografía en Supabase Storage y persiste sus metadatos en `imagen_hc`.

### 9. `AuthService.forgotPassword(ForgotPasswordRequestDTO request)`
- **Propósito:** Genera un token aleatorio de un solo uso con 15 minutos de TTL y dispara el correo de recuperación.

### 10. `AuthService.resetPassword(ResetPasswordRequestDTO request)`
- **Propósito:** Valida vigencia del token, actualiza la contraseña cifrada con BCrypt y desbloquea la cuenta.

### 11. `GeminiChatbotService.processUserMessage(GeminiChatRequestDTO request)`
- **Propósito:** Inyecta el catálogo fresco de servicios en el prompt del sistema y consulta a `gemini-1.5-flash` para asesorar al paciente.

---

## 3. Glosario de Hooks, Utilidades y Componentes (Frontend React)

| Función / Hook / Utilidad | Biblioteca | Propósito y Uso |
| :--- | :--- | :--- |
| `useState<T>()` | `react` | Gestión de estado local reactivo en componentes visuales. |
| `useEffect()` | `react` | Ejecución de efectos secundarios y sincronización de ciclo de vida. |
| `useRef()` | `react` | Referencia mutable persistente (utilizada para el auto-scroll de mensajes del chatbot). |
| `useQuery()` / `useMutation()` | `@tanstack/react-query` | Consultas y mutaciones asíncronas con caché y revalidación automática. |
| `axios.create()` / `interceptors` | `axios` | Cliente HTTP con inyección automática de tokens Bearer JWT en cabeceras. |
