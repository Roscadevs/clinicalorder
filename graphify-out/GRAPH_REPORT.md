# Graph Report - TP  (2026-11-10)

## Corpus Check
- 198 files · ~86,103 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: .css 6, (none) 4, .example 1)

## Summary
- 1537 nodes · 3782 edges · 85 communities (76 shown, 7 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 125 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cefffe02`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SecurityConfig.java
- MedicalRecord
- api.ts
- V3__stored_procedures_and_triggers.sql
- AnalyticsKpisResponseDTO
- AppointmentService
- PatientResponseDTO
- MedicalRecordView.tsx
- ref_lucide_react
- Clínica Dermatológica y Estética — Sistema de Gestión de Turnos e Historias Clínicas
- cn
- org.springframework.transaction.annotation.Transactional
- instant
- User
- ref_react
- BookingWizard.tsx
- ServiceResponseDTO
- DermatologicService
- JwtAuthenticationFilter.java
- ClinicalEntry
- AgendaView.tsx
- ref_hookform_resolvers
- MedicalRecordService
- UserResponseDTO
- localdate
- bigdecimal
- CalendarBlockResponseDTO
- GeminiChatResponseDTO
- AnalyticsService.java
- Stepper.tsx
- PasswordResetToken
- MedicalRecordController
- AuthController
- AppointmentResponseDTO
- UserRole
- list
- AntecedentePatologicoResponseDTO
- lombok.extern.slf4j.Slf4j
- jakarta.servlet.http.HttpServletRequest
- DashboardLayout.tsx
- HabitoResponseDTO
- Habito
- PaymentService
- PaymentTransactionDAO
- LandingPageView.tsx
- MedicalRecordAudit
- lombok.RequiredArgsConstructor
- TimeSlotDTO
- Patient
- CalendarBlock
- BlurText.tsx
- ErrorBoundary.tsx
- org.springframework.http.ResponseEntity
- ClinicalImage
- AlergiaResponseDTO
- Appointment
- AlergiaId
- AntecedentePatologico
- lombok
- GlideSelect.tsx
- AnamnesisForm.tsx
- reactbits/index.ts
- AntecedentePatologicoId
- ClinicalImageResponseDTO
- ReminderNotificationModal.tsx
- TreatmentPhotos.tsx
- HabitoId
- ClinicalEntryRequestDTO
- MedicalRecordDTO.java
- AlergiaId.java
- ClinicaDermatologicaApplication.java
- GeminiApiClientAdapter.java
- GeminiApiClientAdapter
- MercadoPagoPaymentStrategy
- ClinicalImageService
- BookAppointmentRequestDTO
- HabitoRequestDTO
- PaymentPreferenceResponseDTO
- GeminiChatRequestDTO
- ForgotPasswordRequestDTO
- RegisterPaymentRequestDTO
- vite-env.d.ts
- ref_motion

## God Nodes (most connected - your core abstractions)
1. `cn()` - 55 edges
2. `MedicalRecordService` - 38 edges
3. `User` - 31 edges
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

## Communities (85 total, 7 thin omitted)

### Community 0 - "SecurityConfig.java"
Cohesion: 0.05
Nodes (42): abstracthttpconfigurer, arraylist, arrays, MercadoPagoConfigBean, ConfiguracionBaseDeDatos, AesEncryptionService, SecurityConfig, base64 (+34 more)

### Community 1 - "MedicalRecord"
Cohesion: 0.12
Nodes (16): Alergia, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+8 more)

### Community 2 - "api.ts"
Cohesion: 0.06
Nodes (39): AnalyticsDashboardView, GeminiChatbotWidget(), AnalyticsDashboardView(), ALERGIAS_MAPPING, analyticsApi, api, API_BASE_URL, calendarBlocksApi (+31 more)

### Community 3 - "V3__stored_procedures_and_triggers.sql"
Cohesion: 0.06
Nodes (72): alergia, antecedente_patologico, bloqueo_calendario, cita, entrada_hc, entrada_hc_audit, habito, historia_clinica (+64 more)

### Community 4 - "AnalyticsKpisResponseDTO"
Cohesion: 0.11
Nodes (27): AnalyticsService, ConexionBD, AnalyticsController, SystemStatusController, AiAssistantKpis, AnalyticsKpisResponseDTO, FinancialKpis, OperationalKpis (+19 more)

### Community 6 - "PatientResponseDTO"
Cohesion: 0.09
Nodes (20): PatientService, DeleteMapping, GetMapping, PostMapping, PutMapping, RequestMapping, RestController, PatientController (+12 more)

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
Cohesion: 0.22
Nodes (5): BusinessRuleException, ResourceNotFoundException, collectors, comparator, org.springframework.transaction.annotation.Transactional

### Community 12 - "instant"
Cohesion: 0.27
Nodes (5): creationtimestamp, duration, instant, persistence, updatetimestamp

### Community 13 - "User"
Cohesion: 0.14
Nodes (10): User, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+2 more)

### Community 14 - "ref_react"
Cohesion: 0.06
Nodes (41): RFC-5322, AdminServicesView, AgendaView, BookingWizard, EditAppointmentView, MedicalRecordView, PageTransition(), PageTransitionProps (+33 more)

### Community 15 - "BookingWizard.tsx"
Cohesion: 0.11
Nodes (28): frontend_src_components_reactbits_index_glideselect, frontend_src_components_reactbits_index_stepper, ars(), BookingWizard(), formatCountdown(), formatDateTime(), Hold, Outcome (+20 more)

### Community 16 - "ServiceResponseDTO"
Cohesion: 0.10
Nodes (19): DermatologicServiceService, GetMapping, PostMapping, PutMapping, RequestMapping, RestController, ServiceCatalogController, AllArgsConstructor (+11 more)

### Community 17 - "DermatologicService"
Cohesion: 0.20
Nodes (10): GeminiChatbotService, DermatologicService, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter (+2 more)

### Community 18 - "JwtAuthenticationFilter.java"
Cohesion: 0.10
Nodes (17): CustomUserDetailsService, Override, Override, JwtAuthenticationFilter, JwtTokenProvider, collections, jakarta.servlet.FilterChain, org.springframework.security.core.userdetails.UserDetails (+9 more)

### Community 19 - "ClinicalEntry"
Cohesion: 0.11
Nodes (17): ClinicalEntry, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+9 more)

### Community 20 - "AgendaView.tsx"
Cohesion: 0.17
Nodes (27): addDays(), AgendaView(), AppointmentDetail(), ApptChip, ars(), computeRange(), ConfirmState, dayKey() (+19 more)

### Community 22 - "MedicalRecordService"
Cohesion: 0.10
Nodes (16): ClinicalEntry, MedicalRecord, MedicalRecordService, GetMapping, ClinicalEntryResponseDTO, AllArgsConstructor, Builder, Getter (+8 more)

### Community 23 - "UserResponseDTO"
Cohesion: 0.11
Nodes (19): UserService, GetMapping, PutMapping, RequestMapping, RestController, UserController, AllArgsConstructor, Builder (+11 more)

### Community 25 - "bigdecimal"
Cohesion: 0.12
Nodes (15): AppointmentStatus, ATTENDED, CANCELED, COMPLETED, CONFIRMED, NO_SHOW, PAYMENT_FAILED, PENDING_PAYMENT (+7 more)

### Community 26 - "CalendarBlockResponseDTO"
Cohesion: 0.10
Nodes (18): CalendarBlockService, CalendarBlockController, DeleteMapping, GetMapping, RequestMapping, RestController, CalendarBlockRequestDTO, AllArgsConstructor (+10 more)

### Community 27 - "GeminiChatResponseDTO"
Cohesion: 0.17
Nodes (10): GeminiChatbotController, PostMapping, RequestMapping, RestController, GeminiChatResponseDTO, AllArgsConstructor, Builder, Getter (+2 more)

### Community 28 - "AnalyticsService.java"
Cohesion: 0.07
Nodes (27): appointmentstatus, Appointment, PaymentConcept, User, PaymentConcept, BALANCE, DEPOSIT, FULL (+19 more)

### Community 29 - "Stepper.tsx"
Cohesion: 0.17
Nodes (6): SlideTransitionProps, StepContentWrapperProps, StepIndicatorProps, Stepper(), StepperProps, stepVariants

### Community 30 - "PasswordResetToken"
Cohesion: 0.12
Nodes (14): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, PasswordResetToken (+6 more)

### Community 31 - "MedicalRecordController"
Cohesion: 0.14
Nodes (8): PostMapping, DeleteMapping, PostMapping, PutMapping, RequestMapping, RestController, MedicalRecordController, org.springframework.security.core.Authentication

### Community 32 - "AuthController"
Cohesion: 0.16
Nodes (10): AuthController, PostMapping, RequestMapping, RestController, AuthRequestDTO, AllArgsConstructor, Builder, Getter (+2 more)

### Community 33 - "AppointmentResponseDTO"
Cohesion: 0.25
Nodes (6): AppointmentResponseDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter

### Community 34 - "UserRole"
Cohesion: 0.11
Nodes (16): UserRole, ADMIN, DOCTORA, SECRETARIA, AuthResponseDTO, AllArgsConstructor, Builder, Getter (+8 more)

### Community 35 - "list"
Cohesion: 0.21
Nodes (13): AlergiaDAO, AntecedentePatologicoDAO, ClinicalEntryAuditDAO, ClinicalImageDAO, HabitoDAO, MedicalRecordAuditDAO, MedicalRecordDAO, PasswordResetTokenDAO (+5 more)

### Community 36 - "AntecedentePatologicoResponseDTO"
Cohesion: 0.15
Nodes (12): AntecedentePatologicoRequestDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter, AntecedentePatologicoResponseDTO, AllArgsConstructor (+4 more)

### Community 37 - "lombok.extern.slf4j.Slf4j"
Cohesion: 0.11
Nodes (19): AuthService, PaymentGatewayException, EmailNotificationService, MercadoPagoPaymentAdapter, chronounit, com.mercadopago.resources.payment.Payment, com.mercadopago.resources.payment.PaymentRefund, com.mercadopago.resources.preference.Preference (+11 more)

### Community 38 - "jakarta.servlet.http.HttpServletRequest"
Cohesion: 0.13
Nodes (15): DuplicateResourceException, SlotUnavailableException, UnauthorizedAccessException, Override, GlobalExceptionHandler, ResponseEntity, ExceptionHandler, fielderror (+7 more)

### Community 39 - "DashboardLayout.tsx"
Cohesion: 0.17
Nodes (18): BottomNav(), BottomNavProps, ICONS, DashboardLayout(), pathToTab(), roleLanding, tabToPath(), ICONS (+10 more)

### Community 40 - "HabitoResponseDTO"
Cohesion: 0.25
Nodes (6): HabitoResponseDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter

### Community 41 - "Habito"
Cohesion: 0.22
Nodes (8): Habito, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table

### Community 42 - "PaymentService"
Cohesion: 0.15
Nodes (10): Appointment, User, PaymentService, PostMapping, FinalizePaymentRequestDTO, AllArgsConstructor, Builder, Getter (+2 more)

### Community 43 - "PaymentTransactionDAO"
Cohesion: 0.11
Nodes (17): PaymentType, PaymentRegistrationStrategy, PaymentStrategyFactory, BankTransferPaymentStrategy, Appointment, Override, PaymentConcept, PaymentType (+9 more)

### Community 44 - "LandingPageView.tsx"
Cohesion: 0.16
Nodes (14): HumanFriendlyErrorFallback(), HumanFriendlyErrorFallbackProps, frontend_src_components_reactbits_index_aurora, frontend_src_components_reactbits_index_blurtext, frontend_src_components_reactbits_index_specularbutton, frontend_src_components_reactbits_index_spotlightcard, BOOKING_MESSAGE, serviceInquiryMessage() (+6 more)

### Community 45 - "MedicalRecordAudit"
Cohesion: 0.22
Nodes (8): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, MedicalRecordAudit

### Community 46 - "lombok.RequiredArgsConstructor"
Cohesion: 0.15
Nodes (18): HoldExpirationScheduler, DelegatedAccessDeniedHandler, DelegatedAuthenticationEntryPoint, Override, RequestMapping, RestController, PaymentWebhookController, com.fasterxml.jackson.databind.ObjectMapper (+10 more)

### Community 47 - "TimeSlotDTO"
Cohesion: 0.29
Nodes (6): AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter, TimeSlotDTO

### Community 48 - "Patient"
Cohesion: 0.21
Nodes (9): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, Patient (+1 more)

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
Cohesion: 0.18
Nodes (12): annotation, AppointmentController, GetMapping, PostMapping, RequestMapping, RestController, datetimeformat, dto (+4 more)

### Community 53 - "ClinicalImage"
Cohesion: 0.25
Nodes (8): ClinicalImage, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table

### Community 54 - "AlergiaResponseDTO"
Cohesion: 0.14
Nodes (12): AlergiaRequestDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter, AlergiaResponseDTO, AllArgsConstructor (+4 more)

### Community 55 - "Appointment"
Cohesion: 0.16
Nodes (11): Appointment, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+3 more)

### Community 56 - "AlergiaId"
Cohesion: 0.29
Nodes (6): AlergiaId, AllArgsConstructor, Getter, NoArgsConstructor, Override, Setter

### Community 57 - "AntecedentePatologico"
Cohesion: 0.22
Nodes (8): AntecedentePatologico, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table

### Community 58 - "lombok"
Cohesion: 0.25
Nodes (6): decimalmin, email, lombok, notblank, notnull, size

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

### Community 63 - "ClinicalImageResponseDTO"
Cohesion: 0.22
Nodes (6): ClinicalImageResponseDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter

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
Cohesion: 0.33
Nodes (6): ClinicalEntryRequestDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter

### Community 69 - "AlergiaId.java"
Cohesion: 0.57
Nodes (4): column, jakarta.persistence.Embeddable, objects, serializable

### Community 70 - "ClinicaDermatologicaApplication.java"
Cohesion: 0.47
Nodes (4): ClinicaDermatologicaApplication, org.springframework.boot.autoconfigure.SpringBootApplication, org.springframework.scheduling.annotation.EnableScheduling, springapplication

### Community 71 - "GeminiApiClientAdapter.java"
Cohesion: 0.32
Nodes (5): SupabaseStorageAdapter, mediatype, org.springframework.web.reactive.function.client.WebClient, util, uuid

### Community 72 - "GeminiApiClientAdapter"
Cohesion: 0.32
Nodes (3): GeminiApiClientAdapter, org.springframework.beans.factory.annotation.Autowired, SuppressWarnings

### Community 73 - "MercadoPagoPaymentStrategy"
Cohesion: 0.29
Nodes (6): Appointment, Override, PaymentConcept, PaymentType, User, MercadoPagoPaymentStrategy

### Community 75 - "BookAppointmentRequestDTO"
Cohesion: 0.29
Nodes (6): BookAppointmentRequestDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter

### Community 76 - "HabitoRequestDTO"
Cohesion: 0.33
Nodes (6): HabitoRequestDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter

### Community 77 - "PaymentPreferenceResponseDTO"
Cohesion: 0.29
Nodes (6): AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter, PaymentPreferenceResponseDTO

### Community 78 - "GeminiChatRequestDTO"
Cohesion: 0.52
Nodes (7): ChatMessageItemDTO, GeminiChatRequestDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter

### Community 79 - "ForgotPasswordRequestDTO"
Cohesion: 0.33
Nodes (6): ForgotPasswordRequestDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter

### Community 80 - "RegisterPaymentRequestDTO"
Cohesion: 0.33
Nodes (6): AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter, RegisterPaymentRequestDTO

## Knowledge Gaps
- **143 isolated node(s):** `PENDING_PAYMENT`, `CONFIRMED`, `ATTENDED`, `CANCELED`, `COMPLETED` (+138 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 589 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `SecurityConfig.java`, `MedicalRecord`, `UserRole`, `list`, `AuthController`, `org.springframework.transaction.annotation.Transactional`, `instant`, `MedicalRecordAudit`, `CalendarBlock`, `JwtAuthenticationFilter.java`, `ClinicalEntry`, `UserResponseDTO`, `org.springframework.http.ResponseEntity`, `Appointment`, `AnalyticsService.java`, `PasswordResetToken`, `MedicalRecordController`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `MedicalRecordService` connect `MedicalRecordService` to `SecurityConfig.java`, `list`, `AntecedentePatologicoResponseDTO`, `lombok.extern.slf4j.Slf4j`, `HabitoResponseDTO`, `MedicalRecordAudit`, `User`, `lombok.RequiredArgsConstructor`, `Patient`, `ClinicalEntry`, `org.springframework.http.ResponseEntity`, `AlergiaResponseDTO`, `Appointment`, `MedicalRecordController`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `MedicalRecordDTO` connect `MedicalRecordService` to `MedicalRecordDTO.java`, `AntecedentePatologicoResponseDTO`, `HabitoResponseDTO`, `AlergiaResponseDTO`, `MedicalRecordController`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `PENDING_PAYMENT`, `CONFIRMED`, `ATTENDED` to the rest of the system?**
  _143 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SecurityConfig.java` be split into smaller, more focused modules?**
  _Cohesion score 0.05380852550663871 - nodes in this community are weakly interconnected._
- **Should `MedicalRecord` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05550416281221091 - nodes in this community are weakly interconnected._