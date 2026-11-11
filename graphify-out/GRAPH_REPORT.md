# Graph Report - TP  (2026-11-11)

## Corpus Check
- 202 files · ~86,864 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: .css 6, (none) 4, .example 1)

## Summary
- 1559 nodes · 3839 edges · 86 communities (80 shown, 4 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 126 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `49ba9ef9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SecurityConfig.java
- MedicalRecord
- api.ts
- V3__stored_procedures_and_triggers.sql
- AnalyticsKpisResponseDTO
- AppointmentService
- Patient
- MedicalRecordView.tsx
- ref_lucide_react
- Clínica Dermatológica y Estética — Sistema de Gestión de Turnos e Historias Clínicas
- cn
- org.springframework.transaction.annotation.Transactional
- lombok
- UserDAO
- ref_react
- BookingWizard.tsx
- ServiceResponseDTO
- DermatologicService
- AesEncryptionService.java
- ClinicalEntry
- AgendaView.tsx
- ref_hookform_resolvers
- MedicalRecordService
- UserResponseDTO
- localdate
- AppointmentStatus
- CalendarBlockResponseDTO
- .processUserMessage
- AnalyticsService.java
- Stepper.tsx
- PasswordResetToken
- ClinicalEntryAudit
- LoginAudit
- AppointmentResponseDTO
- UserRole
- org.springframework.data.jpa.repository.JpaRepository
- AntecedentePatologicoResponseDTO
- MercadoPagoPaymentAdapter.java
- jakarta.servlet.http.HttpServletRequest
- DashboardLayout.tsx
- HabitoResponseDTO
- Habito
- lombok.extern.slf4j.Slf4j
- org.springframework.stereotype.Component
- LandingPageView.tsx
- MedicalRecordAudit
- AppointmentController
- TimeSlotDTO
- org.springframework.context.annotation.Bean
- CalendarBlock
- BlurText.tsx
- ErrorBoundary.tsx
- org.springframework.http.ResponseEntity
- ClinicalImage
- AlergiaResponseDTO
- Appointment
- AlergiaId
- AntecedentePatologico
- notblank
- GlideSelect.tsx
- AnamnesisForm.tsx
- reactbits/index.ts
- AntecedentePatologicoId
- SecurityConfig
- ReminderNotificationModal.tsx
- TreatmentPhotos.tsx
- HabitoId
- ClinicalEntryRequestDTO
- User
- AlergiaId.java
- ClinicaDermatologicaApplication.java
- GeminiChatRequestDTO
- .register
- .register
- .register
- .bookTemporaryHold
- value
- JwtTokenProvider.java
- FinalizePaymentRequestDTO
- ForgotPasswordRequestDTO
- RegisterPaymentRequestDTO
- MedicalRecordDTO
- vite-env.d.ts
- ref_motion

## God Nodes (most connected - your core abstractions)
1. `cn()` - 55 edges
2. `MedicalRecordService` - 38 edges
3. `User` - 34 edges
4. `AppointmentService` - 28 edges
5. `PaymentTransaction` - 26 edges
6. `UserDAO` - 26 edges
7. `Appointment` - 24 edges
8. `Button` - 23 edges
9. `PaymentService` - 22 edges
10. `MedicalRecordController` - 22 edges

## Surprising Connections (you probably didn't know these)
- `ProtectedRouteProps` --references--> `RoleType`  [EXTRACTED]
  frontend/src/components/ProtectedRoute.tsx → frontend/src/components/navConfig.ts
- `AnalyticsDashboardView()` --calls--> `cn()`  [EXTRACTED]
  frontend/src/features/analytics/AnalyticsDashboardView.tsx → frontend/src/utils/cn.ts
- `ReadRow()` --calls--> `cn()`  [EXTRACTED]
  frontend/src/features/clinical/AnamnesisForm.tsx → frontend/src/utils/cn.ts
- `AnalyticsService` --references--> `AppointmentDAO`  [EXTRACTED]
  backend/src/main/java/com/clinicadermatologica/app/application/service/AnalyticsService.java → backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/dao/AppointmentDAO.java
- `AnalyticsService` --references--> `PaymentTransactionDAO`  [EXTRACTED]
  backend/src/main/java/com/clinicadermatologica/app/application/service/AnalyticsService.java → backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/dao/PaymentTransactionDAO.java

## Import Cycles
- None detected.

## Communities (86 total, 4 thin omitted)

### Community 0 - "SecurityConfig.java"
Cohesion: 0.13
Nodes (14): abstracthttpconfigurer, arraylist, bcryptpasswordencoder, corsconfiguration, customizer, headersconfigurer, httpmethod, org.springframework.security.authentication.AuthenticationManager (+6 more)

### Community 1 - "MedicalRecord"
Cohesion: 0.12
Nodes (16): Alergia, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+8 more)

### Community 2 - "api.ts"
Cohesion: 0.06
Nodes (39): AnalyticsDashboardView, GeminiChatbotWidget(), AnalyticsDashboardView(), ALERGIAS_MAPPING, analyticsApi, api, API_BASE_URL, calendarBlocksApi (+31 more)

### Community 3 - "V3__stored_procedures_and_triggers.sql"
Cohesion: 0.05
Nodes (76): alergia, antecedente_patologico, bloqueo_calendario, cita, entrada_hc, entrada_hc_audit, habito, historia_clinica (+68 more)

### Community 4 - "AnalyticsKpisResponseDTO"
Cohesion: 0.12
Nodes (26): AnalyticsService, ConexionBD, AnalyticsController, SystemStatusController, AiAssistantKpis, AnalyticsKpisResponseDTO, FinancialKpis, OperationalKpis (+18 more)

### Community 5 - "AppointmentService"
Cohesion: 0.27
Nodes (4): AppointmentService, Appointment, HoldExpirationScheduler, org.springframework.scheduling.annotation.Scheduled

### Community 6 - "Patient"
Cohesion: 0.08
Nodes (23): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, Patient (+15 more)

### Community 7 - "MedicalRecordView.tsx"
Cohesion: 0.09
Nodes (31): RFC-7807, PatientDirectoryView, frontend_src_components_ui_index_badge, frontend_src_components_ui_index_card, PatientSearch(), PatientSearchProps, ClinicalNoteModal(), ClinicalNoteModalProps (+23 more)

### Community 8 - "ref_lucide_react"
Cohesion: 0.09
Nodes (43): Button, Callout(), CalloutIntent, CalloutProps, intentStyles, frontend_src_components_ui_index_button, frontend_src_components_ui_index_callout, frontend_src_components_ui_index_input (+35 more)

### Community 9 - "Clínica Dermatológica y Estética — Sistema de Gestión de Turnos e Historias Clínicas"
Cohesion: 0.12
Nodes (15): Arquitectura en capas, Clínica Dermatológica y Estética — Sistema de Gestión de Turnos e Historias Clínicas, Cómo ejecutarlo, Estructura del repositorio, Integración continua, Nota sobre el acceso a datos (DAO), Opción A — Docker Compose (todo en contenedores), Opción B — Ejecución manual (+7 more)

### Community 10 - "cn"
Cohesion: 0.07
Nodes (34): Badge, BadgeProps, BadgeSize, BadgeVariant, dotStyles, sizeStyles, variantStyles, ButtonProps (+26 more)

### Community 11 - "org.springframework.transaction.annotation.Transactional"
Cohesion: 0.15
Nodes (15): ClinicalImageService, GeminiChatbotService, LoginAuditService, PatientService, BusinessRuleException, ResourceNotFoundException, CustomUserDetailsService, collectors (+7 more)

### Community 12 - "lombok"
Cohesion: 0.22
Nodes (5): creationtimestamp, instant, lombok, persistence, updatetimestamp

### Community 13 - "UserDAO"
Cohesion: 0.15
Nodes (8): AuthService, User, UserDAO, AuthController, PostMapping, RequestMapping, RestController, org.springframework.security.crypto.password.PasswordEncoder

### Community 14 - "ref_react"
Cohesion: 0.06
Nodes (41): RFC-5322, AdminServicesView, AgendaView, BookingWizard, EditAppointmentView, MedicalRecordView, PageTransition(), PageTransitionProps (+33 more)

### Community 15 - "BookingWizard.tsx"
Cohesion: 0.11
Nodes (28): frontend_src_components_reactbits_index_glideselect, frontend_src_components_reactbits_index_stepper, ars(), BookingWizard(), formatCountdown(), formatDateTime(), Hold, Outcome (+20 more)

### Community 16 - "ServiceResponseDTO"
Cohesion: 0.12
Nodes (18): DermatologicServiceService, GetMapping, PostMapping, RequestMapping, RestController, ServiceCatalogController, AllArgsConstructor, Builder (+10 more)

### Community 17 - "DermatologicService"
Cohesion: 0.18
Nodes (9): DermatologicService, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+1 more)

### Community 18 - "AesEncryptionService.java"
Cohesion: 0.17
Nodes (9): arrays, AesEncryptionService, base64, cipher, gcmparameterspec, generalsecurityexception, org.springframework.context.annotation.Scope, secretkeyspec (+1 more)

### Community 19 - "ClinicalEntry"
Cohesion: 0.22
Nodes (9): ClinicalEntry, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+1 more)

### Community 20 - "AgendaView.tsx"
Cohesion: 0.17
Nodes (27): addDays(), AgendaView(), AppointmentDetail(), ApptChip, ars(), computeRange(), ConfirmState, dayKey() (+19 more)

### Community 22 - "MedicalRecordService"
Cohesion: 0.08
Nodes (17): ClinicalEntry, MedicalRecordService, Override, PostMapping, DeleteMapping, GetMapping, PutMapping, RequestMapping (+9 more)

### Community 23 - "UserResponseDTO"
Cohesion: 0.14
Nodes (13): UserService, GetMapping, PutMapping, RequestMapping, RestController, UserController, AllArgsConstructor, Builder (+5 more)

### Community 25 - "AppointmentStatus"
Cohesion: 0.10
Nodes (18): AppointmentStatus, ATTENDED, CANCELED, COMPLETED, CONFIRMED, NO_SHOW, PAYMENT_FAILED, PENDING_PAYMENT (+10 more)

### Community 26 - "CalendarBlockResponseDTO"
Cohesion: 0.11
Nodes (18): CalendarBlockService, CalendarBlockController, DeleteMapping, GetMapping, RequestMapping, RestController, CalendarBlockRequestDTO, AllArgsConstructor (+10 more)

### Community 27 - ".processUserMessage"
Cohesion: 0.29
Nodes (4): GeminiChatbotController, PostMapping, RequestMapping, RestController

### Community 28 - "AnalyticsService.java"
Cohesion: 0.08
Nodes (22): appointmentstatus, Appointment, PaymentConcept, User, PaymentStatus, APPROVED, PENDING, REFUNDED (+14 more)

### Community 29 - "Stepper.tsx"
Cohesion: 0.17
Nodes (6): SlideTransitionProps, StepContentWrapperProps, StepIndicatorProps, Stepper(), StepperProps, stepVariants

### Community 30 - "PasswordResetToken"
Cohesion: 0.22
Nodes (9): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, PasswordResetToken (+1 more)

### Community 31 - "ClinicalEntryAudit"
Cohesion: 0.22
Nodes (9): ClinicalEntryAudit, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+1 more)

### Community 32 - "LoginAudit"
Cohesion: 0.22
Nodes (9): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, LoginAudit (+1 more)

### Community 33 - "AppointmentResponseDTO"
Cohesion: 0.19
Nodes (7): GetMapping, AppointmentResponseDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter

### Community 34 - "UserRole"
Cohesion: 0.09
Nodes (22): UserRole, ADMIN, DOCTORA, SECRETARIA, AuthResponseDTO, AllArgsConstructor, Builder, Getter (+14 more)

### Community 35 - "org.springframework.data.jpa.repository.JpaRepository"
Cohesion: 0.25
Nodes (8): AlergiaDAO, AntecedentePatologicoDAO, HabitoDAO, MedicalRecordDAO, optional, org.springframework.data.jpa.repository.JpaRepository, org.springframework.stereotype.Repository, param

### Community 36 - "AntecedentePatologicoResponseDTO"
Cohesion: 0.16
Nodes (12): AntecedentePatologicoRequestDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter, AntecedentePatologicoResponseDTO, AllArgsConstructor (+4 more)

### Community 37 - "MercadoPagoPaymentAdapter.java"
Cohesion: 0.17
Nodes (10): PaymentGatewayException, MercadoPagoPaymentAdapter, collections, com.mercadopago.resources.payment.Payment, com.mercadopago.resources.payment.PaymentRefund, com.mercadopago.resources.preference.Preference, mprequestoptions, offsetdatetime (+2 more)

### Community 38 - "jakarta.servlet.http.HttpServletRequest"
Cohesion: 0.06
Nodes (36): DuplicateResourceException, SlotUnavailableException, UnauthorizedAccessException, DelegatedAccessDeniedHandler, Override, DelegatedAuthenticationEntryPoint, Override, Override (+28 more)

### Community 39 - "DashboardLayout.tsx"
Cohesion: 0.17
Nodes (18): BottomNav(), BottomNavProps, ICONS, DashboardLayout(), pathToTab(), roleLanding, tabToPath(), ICONS (+10 more)

### Community 40 - "HabitoResponseDTO"
Cohesion: 0.15
Nodes (12): HabitoRequestDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter, HabitoResponseDTO, AllArgsConstructor (+4 more)

### Community 41 - "Habito"
Cohesion: 0.25
Nodes (8): Habito, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table

### Community 42 - "lombok.extern.slf4j.Slf4j"
Cohesion: 0.10
Nodes (17): Appointment, User, PaymentService, PaymentStrategyFactory, EmailNotificationService, PostMapping, RequestMapping, RestController (+9 more)

### Community 43 - "org.springframework.stereotype.Component"
Cohesion: 0.24
Nodes (9): PaymentType, PaymentRegistrationStrategy, BankTransferPaymentStrategy, CashPaymentStrategy, MercadoPagoPaymentStrategy, PaymentTransactionDAO, bigdecimal, model (+1 more)

### Community 44 - "LandingPageView.tsx"
Cohesion: 0.16
Nodes (14): HumanFriendlyErrorFallback(), HumanFriendlyErrorFallbackProps, frontend_src_components_reactbits_index_aurora, frontend_src_components_reactbits_index_blurtext, frontend_src_components_reactbits_index_specularbutton, frontend_src_components_reactbits_index_spotlightcard, BOOKING_MESSAGE, serviceInquiryMessage() (+6 more)

### Community 45 - "MedicalRecordAudit"
Cohesion: 0.22
Nodes (9): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, MedicalRecordAudit (+1 more)

### Community 46 - "AppointmentController"
Cohesion: 0.27
Nodes (4): AppointmentController, PostMapping, RequestMapping, RestController

### Community 47 - "TimeSlotDTO"
Cohesion: 0.29
Nodes (6): AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter, TimeSlotDTO

### Community 48 - "org.springframework.context.annotation.Bean"
Cohesion: 0.31
Nodes (5): ConfiguracionBaseDeDatos, javax.sql.DataSource, org.springframework.context.annotation.Bean, org.springframework.context.annotation.Configuration, org.springframework.security.web.firewall.HttpFirewall

### Community 49 - "CalendarBlock"
Cohesion: 0.22
Nodes (9): CalendarBlock, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+1 more)

### Community 50 - "BlurText.tsx"
Cohesion: 0.40
Nodes (5): AnimateBy, BlurText(), BlurTextProps, buildKeyframes(), Direction

### Community 51 - "ErrorBoundary.tsx"
Cohesion: 0.20
Nodes (5): App(), ErrorBoundary, ErrorBoundaryProps, State, frontend_src_index

### Community 52 - "org.springframework.http.ResponseEntity"
Cohesion: 0.20
Nodes (14): annotation, DeleteMapping, GetMapping, RequestMapping, RestController, PatientController, PutMapping, datetimeformat (+6 more)

### Community 53 - "ClinicalImage"
Cohesion: 0.22
Nodes (9): ClinicalImage, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+1 more)

### Community 54 - "AlergiaResponseDTO"
Cohesion: 0.15
Nodes (13): PostMapping, AlergiaRequestDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter, AlergiaResponseDTO (+5 more)

### Community 55 - "Appointment"
Cohesion: 0.22
Nodes (10): Appointment, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+2 more)

### Community 56 - "AlergiaId"
Cohesion: 0.29
Nodes (6): AlergiaId, AllArgsConstructor, Getter, NoArgsConstructor, Override, Setter

### Community 57 - "AntecedentePatologico"
Cohesion: 0.15
Nodes (9): MedicalRecord, AntecedentePatologico, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter (+1 more)

### Community 58 - "notblank"
Cohesion: 0.12
Nodes (15): AuthRequestDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter, AllArgsConstructor, Builder (+7 more)

### Community 59 - "GlideSelect.tsx"
Cohesion: 0.21
Nodes (11): DEFAULT_OPTIONS, GlideSelect(), GlideSelectProps, MenuBox, norm(), OptionInput, Phase, SIZES (+3 more)

### Community 60 - "AnamnesisForm.tsx"
Cohesion: 0.24
Nodes (9): ALERGIAS, AnamnesisForm(), AnamnesisFormProps, FITZ, HABITOS, PATOLOGIAS, ReadRow(), MedicalRecord (+1 more)

### Community 61 - "reactbits/index.ts"
Cohesion: 0.13
Nodes (11): Aurora(), AuroraProps, GlideOption, ButtonSize, SpecularButton(), SpecularButtonProps, SpecularPropsSnapshot, SpotlightCard() (+3 more)

### Community 62 - "AntecedentePatologicoId"
Cohesion: 0.29
Nodes (6): AntecedentePatologicoId, AllArgsConstructor, Getter, NoArgsConstructor, Override, Setter

### Community 63 - "SecurityConfig"
Cohesion: 0.25
Nodes (6): SecurityConfig, org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity, org.springframework.security.config.annotation.web.builders.HttpSecurity, org.springframework.security.config.annotation.web.configuration.EnableWebSecurity, org.springframework.security.web.SecurityFilterChain, org.springframework.web.cors.CorsConfigurationSource

### Community 64 - "ReminderNotificationModal.tsx"
Cohesion: 0.39
Nodes (7): CLINIC, ReminderNotificationModal(), ReminderNotificationModalProps, CalendarEventData, downloadIcsCalendarFile(), formatToIcsDate(), generateGoogleCalendarUrl()

### Community 65 - "TreatmentPhotos.tsx"
Cohesion: 0.28
Nodes (4): photoStore, TreatmentPhotos(), TreatmentPhotosProps, ClinicalPhoto

### Community 66 - "HabitoId"
Cohesion: 0.29
Nodes (6): HabitoId, AllArgsConstructor, Getter, NoArgsConstructor, Override, Setter

### Community 67 - "ClinicalEntryRequestDTO"
Cohesion: 0.13
Nodes (10): ClinicalEntryRequestDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter, decimalmin, max (+2 more)

### Community 68 - "User"
Cohesion: 0.25
Nodes (8): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, User

### Community 69 - "AlergiaId.java"
Cohesion: 0.57
Nodes (4): column, jakarta.persistence.Embeddable, objects, serializable

### Community 70 - "ClinicaDermatologicaApplication.java"
Cohesion: 0.47
Nodes (4): ClinicaDermatologicaApplication, org.springframework.boot.autoconfigure.SpringBootApplication, org.springframework.scheduling.annotation.EnableScheduling, springapplication

### Community 71 - "GeminiChatRequestDTO"
Cohesion: 0.07
Nodes (28): GeminiApiClientAdapter, SupabaseStorageAdapter, ClinicalImageResponseDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter (+20 more)

### Community 72 - ".register"
Cohesion: 0.29
Nodes (5): Appointment, Override, PaymentConcept, PaymentType, User

### Community 73 - ".register"
Cohesion: 0.29
Nodes (5): Appointment, Override, PaymentConcept, PaymentType, User

### Community 74 - ".register"
Cohesion: 0.29
Nodes (5): Appointment, Override, PaymentConcept, PaymentType, User

### Community 75 - ".bookTemporaryHold"
Cohesion: 0.12
Nodes (14): HoldPolicy, BookAppointmentRequestDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter, AllArgsConstructor (+6 more)

### Community 76 - "value"
Cohesion: 0.40
Nodes (4): MercadoPagoConfigBean, jakarta.annotation.PostConstruct, mercadopagoconfig, value

### Community 77 - "JwtTokenProvider.java"
Cohesion: 0.33
Nodes (5): date, javax.crypto.SecretKey, jsonwebtoken, keys, standardcharsets

### Community 78 - "FinalizePaymentRequestDTO"
Cohesion: 0.33
Nodes (6): FinalizePaymentRequestDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter

### Community 79 - "ForgotPasswordRequestDTO"
Cohesion: 0.33
Nodes (6): ForgotPasswordRequestDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter

### Community 80 - "RegisterPaymentRequestDTO"
Cohesion: 0.33
Nodes (6): AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter, RegisterPaymentRequestDTO

### Community 82 - "MedicalRecordDTO"
Cohesion: 0.33
Nodes (6): AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter, MedicalRecordDTO

## Knowledge Gaps
- **143 isolated node(s):** `PENDING_PAYMENT`, `CONFIRMED`, `ATTENDED`, `CANCELED`, `COMPLETED` (+138 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 596 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `MedicalRecord`, `org.springframework.transaction.annotation.Transactional`, `lombok`, `UserDAO`, `ClinicalEntry`, `MedicalRecordService`, `UserResponseDTO`, `AnalyticsService.java`, `PasswordResetToken`, `ClinicalEntryAudit`, `LoginAudit`, `UserRole`, `org.springframework.data.jpa.repository.JpaRepository`, `jakarta.servlet.http.HttpServletRequest`, `MedicalRecordAudit`, `CalendarBlock`, `org.springframework.http.ResponseEntity`, `Appointment`, `JwtTokenProvider.java`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `MedicalRecordService` connect `MedicalRecordService` to `org.springframework.data.jpa.repository.JpaRepository`, `AntecedentePatologicoResponseDTO`, `Patient`, `jakarta.servlet.http.HttpServletRequest`, `HabitoResponseDTO`, `lombok.extern.slf4j.Slf4j`, `org.springframework.transaction.annotation.Transactional`, `MedicalRecordAudit`, `UserDAO`, `AesEncryptionService.java`, `ClinicalEntry`, `org.springframework.http.ResponseEntity`, `AlergiaResponseDTO`, `Appointment`, `AntecedentePatologico`, `ClinicalEntryAudit`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `Appointment` connect `Appointment` to `AnalyticsKpisResponseDTO`, `User`, `Patient`, `.bookTemporaryHold`, `lombok`, `DermatologicService`, `ClinicalEntry`, `AppointmentStatus`, `AnalyticsService.java`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `PENDING_PAYMENT`, `CONFIRMED`, `ATTENDED` to the rest of the system?**
  _143 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SecurityConfig.java` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `MedicalRecord` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05550416281221091 - nodes in this community are weakly interconnected._