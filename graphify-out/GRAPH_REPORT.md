# Graph Report - TP  (2026-11-09)

## Corpus Check
- 197 files · ~85,976 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: .css 6, (none) 4, .example 1)

## Summary
- 1536 nodes · 3777 edges · 81 communities (77 shown, 3 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 125 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `31714a32`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SecurityConfig.java
- Alergia
- api.ts
- V3__stored_procedures_and_triggers.sql
- AnalyticsKpisResponseDTO
- AppointmentService
- org.springframework.transaction.annotation.Transactional
- MedicalRecordView.tsx
- ref_lucide_react
- Clínica Dermatológica y Estética — Sistema de Gestión de Turnos e Historias Clínicas
- cn
- org.springframework.stereotype.Service
- creationtimestamp
- UserDAO
- ref_react
- BookingWizard.tsx
- ServiceResponseDTO
- DermatologicService
- JwtAuthenticationFilter.java
- ClinicalEntry
- AgendaView.tsx
- ref_hookform_resolvers
- ClinicalEntryResponseDTO
- UserResponseDTO
- lombok
- AppointmentStatus
- CalendarBlockController.java
- GeminiChatRequestDTO
- AnalyticsService.java
- Stepper.tsx
- PasswordResetToken
- MedicalRecordController
- MedicalRecordController.java
- MedicalRecordDTO
- UserRole
- MedicalRecordService
- AntecedentePatologicoResponseDTO
- lombok.extern.slf4j.Slf4j
- jakarta.servlet.http.HttpServletRequest
- DashboardLayout.tsx
- HabitoResponseDTO
- Habito
- PaymentType
- lombok.RequiredArgsConstructor
- LandingPageView.tsx
- MedicalRecord
- DelegatedAccessDeniedHandler.java
- TimeSlotDTO
- Patient
- CalendarBlock
- BlurText.tsx
- ErrorBoundary.tsx
- org.springframework.http.ResponseEntity
- User
- AlergiaResponseDTO
- Appointment
- AlergiaId
- AntecedentePatologico
- notblank
- GlideSelect.tsx
- AnamnesisForm.tsx
- reactbits/index.ts
- AntecedentePatologicoId
- ClinicalImage
- ReminderNotificationModal.tsx
- TreatmentPhotos.tsx
- HabitoId
- ClinicalEntryRequestDTO
- notnull
- AlergiaId.java
- ClinicaDermatologicaApplication.java
- .register
- .register
- .register
- AlergiaRequestDTO
- BookAppointmentRequestDTO
- HabitoRequestDTO
- PaymentPreferenceResponseDTO
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

## Communities (81 total, 3 thin omitted)

### Community 0 - "SecurityConfig.java"
Cohesion: 0.05
Nodes (42): abstracthttpconfigurer, arraylist, arrays, MercadoPagoConfigBean, ConfiguracionBaseDeDatos, AesEncryptionService, SecurityConfig, base64 (+34 more)

### Community 1 - "Alergia"
Cohesion: 0.25
Nodes (8): Alergia, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table

### Community 2 - "api.ts"
Cohesion: 0.06
Nodes (39): AnalyticsDashboardView, GeminiChatbotWidget(), AnalyticsDashboardView(), ALERGIAS_MAPPING, analyticsApi, api, API_BASE_URL, calendarBlocksApi (+31 more)

### Community 3 - "V3__stored_procedures_and_triggers.sql"
Cohesion: 0.06
Nodes (72): alergia, antecedente_patologico, bloqueo_calendario, cita, entrada_hc, entrada_hc_audit, habito, historia_clinica (+64 more)

### Community 4 - "AnalyticsKpisResponseDTO"
Cohesion: 0.11
Nodes (27): AnalyticsService, ConexionBD, AnalyticsController, SystemStatusController, AiAssistantKpis, AnalyticsKpisResponseDTO, FinancialKpis, OperationalKpis (+19 more)

### Community 5 - "AppointmentService"
Cohesion: 0.18
Nodes (4): AppointmentService, Appointment, Appointment, HoldPolicy

### Community 6 - "org.springframework.transaction.annotation.Transactional"
Cohesion: 0.09
Nodes (21): PatientService, DeleteMapping, GetMapping, PostMapping, PutMapping, RequestMapping, RestController, PatientController (+13 more)

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

### Community 11 - "org.springframework.stereotype.Service"
Cohesion: 0.50
Nodes (3): BusinessRuleException, collectors, org.springframework.stereotype.Service

### Community 12 - "creationtimestamp"
Cohesion: 0.27
Nodes (3): creationtimestamp, persistence, updatetimestamp

### Community 13 - "UserDAO"
Cohesion: 0.21
Nodes (6): AuthService, User, EmailNotificationService, PasswordResetTokenDAO, UserDAO, org.springframework.security.crypto.password.PasswordEncoder

### Community 14 - "ref_react"
Cohesion: 0.06
Nodes (41): RFC-5322, AdminServicesView, AgendaView, BookingWizard, EditAppointmentView, MedicalRecordView, PageTransition(), PageTransitionProps (+33 more)

### Community 15 - "BookingWizard.tsx"
Cohesion: 0.11
Nodes (28): frontend_src_components_reactbits_index_glideselect, frontend_src_components_reactbits_index_stepper, ars(), BookingWizard(), formatCountdown(), formatDateTime(), Hold, Outcome (+20 more)

### Community 16 - "ServiceResponseDTO"
Cohesion: 0.11
Nodes (17): DermatologicServiceService, GetMapping, RequestMapping, RestController, ServiceCatalogController, AllArgsConstructor, Builder, Getter (+9 more)

### Community 17 - "DermatologicService"
Cohesion: 0.20
Nodes (10): GeminiChatbotService, DermatologicService, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter (+2 more)

### Community 18 - "JwtAuthenticationFilter.java"
Cohesion: 0.15
Nodes (11): Override, JwtAuthenticationFilter, JwtTokenProvider, jakarta.servlet.FilterChain, org.springframework.security.core.userdetails.UserDetails, org.springframework.web.filter.OncePerRequestFilter, securitycontextholder, servletexception (+3 more)

### Community 19 - "ClinicalEntry"
Cohesion: 0.11
Nodes (16): ClinicalEntry, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+8 more)

### Community 20 - "AgendaView.tsx"
Cohesion: 0.17
Nodes (27): addDays(), AgendaView(), AppointmentDetail(), ApptChip, ars(), computeRange(), ConfirmState, dayKey() (+19 more)

### Community 22 - "ClinicalEntryResponseDTO"
Cohesion: 0.16
Nodes (8): ClinicalEntry, GetMapping, ClinicalEntryResponseDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter

### Community 23 - "UserResponseDTO"
Cohesion: 0.09
Nodes (21): UserService, ResourceNotFoundException, GetMapping, PutMapping, RequestMapping, RestController, UserController, AllArgsConstructor (+13 more)

### Community 24 - "lombok"
Cohesion: 0.15
Nodes (6): bigdecimal, constraints, duration, instant, localdate, lombok

### Community 25 - "AppointmentStatus"
Cohesion: 0.22
Nodes (8): AppointmentStatus, ATTENDED, CANCELED, COMPLETED, CONFIRMED, NO_SHOW, PAYMENT_FAILED, PENDING_PAYMENT

### Community 26 - "CalendarBlockController.java"
Cohesion: 0.10
Nodes (20): CalendarBlockService, CalendarBlockController, DeleteMapping, GetMapping, PostMapping, RequestMapping, RestController, CalendarBlockRequestDTO (+12 more)

### Community 27 - "GeminiChatRequestDTO"
Cohesion: 0.09
Nodes (22): GeminiApiClientAdapter, GeminiChatbotController, PostMapping, RequestMapping, RestController, ChatMessageItemDTO, GeminiChatRequestDTO, AllArgsConstructor (+14 more)

### Community 28 - "AnalyticsService.java"
Cohesion: 0.08
Nodes (23): appointmentstatus, Appointment, PaymentConcept, User, PaymentConcept, BALANCE, DEPOSIT, FULL (+15 more)

### Community 29 - "Stepper.tsx"
Cohesion: 0.17
Nodes (6): SlideTransitionProps, StepContentWrapperProps, StepIndicatorProps, Stepper(), StepperProps, stepVariants

### Community 30 - "PasswordResetToken"
Cohesion: 0.06
Nodes (30): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, PasswordResetToken (+22 more)

### Community 31 - "MedicalRecordController"
Cohesion: 0.16
Nodes (7): DeleteMapping, PostMapping, PutMapping, RequestMapping, RestController, MedicalRecordController, org.springframework.security.core.Authentication

### Community 32 - "MedicalRecordController.java"
Cohesion: 0.40
Nodes (4): annotation, dto, org.springframework.http.HttpStatus, valid

### Community 33 - "MedicalRecordDTO"
Cohesion: 0.17
Nodes (7): MedicalRecord, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter, MedicalRecordDTO

### Community 34 - "UserRole"
Cohesion: 0.12
Nodes (16): UserRole, ADMIN, DOCTORA, SECRETARIA, AuthResponseDTO, AllArgsConstructor, Builder, Getter (+8 more)

### Community 35 - "MedicalRecordService"
Cohesion: 0.22
Nodes (14): MedicalRecordService, AlergiaDAO, AntecedentePatologicoDAO, ClinicalEntryAuditDAO, ClinicalEntryDAO, ClinicalImageDAO, HabitoDAO, MedicalRecordAuditDAO (+6 more)

### Community 36 - "AntecedentePatologicoResponseDTO"
Cohesion: 0.16
Nodes (12): AntecedentePatologicoRequestDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter, AntecedentePatologicoResponseDTO, AllArgsConstructor (+4 more)

### Community 37 - "lombok.extern.slf4j.Slf4j"
Cohesion: 0.09
Nodes (21): PaymentService, PaymentStrategyFactory, PaymentGatewayException, MercadoPagoPaymentAdapter, PostMapping, RequestMapping, RestController, PaymentWebhookController (+13 more)

### Community 38 - "jakarta.servlet.http.HttpServletRequest"
Cohesion: 0.13
Nodes (16): DuplicateResourceException, SlotUnavailableException, UnauthorizedAccessException, Override, GlobalExceptionHandler, ResponseEntity, exception, ExceptionHandler (+8 more)

### Community 39 - "DashboardLayout.tsx"
Cohesion: 0.17
Nodes (18): BottomNav(), BottomNavProps, ICONS, DashboardLayout(), pathToTab(), roleLanding, tabToPath(), ICONS (+10 more)

### Community 40 - "HabitoResponseDTO"
Cohesion: 0.29
Nodes (6): HabitoResponseDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter

### Community 41 - "Habito"
Cohesion: 0.25
Nodes (8): Habito, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table

### Community 42 - "PaymentType"
Cohesion: 0.08
Nodes (23): User, PaymentType, BANK_TRANSFER, CASH, MERCADOPAGO, FinalizePaymentRequestDTO, AllArgsConstructor, Builder (+15 more)

### Community 43 - "lombok.RequiredArgsConstructor"
Cohesion: 0.25
Nodes (11): PaymentType, PaymentRegistrationStrategy, BankTransferPaymentStrategy, CashPaymentStrategy, MercadoPagoPaymentStrategy, PaymentTransactionDAO, HoldExpirationScheduler, lombok.RequiredArgsConstructor (+3 more)

### Community 44 - "LandingPageView.tsx"
Cohesion: 0.16
Nodes (14): HumanFriendlyErrorFallback(), HumanFriendlyErrorFallbackProps, frontend_src_components_reactbits_index_aurora, frontend_src_components_reactbits_index_blurtext, frontend_src_components_reactbits_index_specularbutton, frontend_src_components_reactbits_index_spotlightcard, BOOKING_MESSAGE, serviceInquiryMessage() (+6 more)

### Community 45 - "MedicalRecord"
Cohesion: 0.12
Nodes (16): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, MedicalRecord (+8 more)

### Community 46 - "DelegatedAccessDeniedHandler.java"
Cohesion: 0.21
Nodes (12): DelegatedAccessDeniedHandler, DelegatedAuthenticationEntryPoint, Override, com.fasterxml.jackson.databind.ObjectMapper, ioexception, jakarta.servlet.http.HttpServletResponse, linkedhashmap, mediatype (+4 more)

### Community 47 - "TimeSlotDTO"
Cohesion: 0.33
Nodes (6): AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter, TimeSlotDTO

### Community 48 - "Patient"
Cohesion: 0.21
Nodes (9): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, Patient (+1 more)

### Community 49 - "CalendarBlock"
Cohesion: 0.20
Nodes (9): CalendarBlock, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+1 more)

### Community 50 - "BlurText.tsx"
Cohesion: 0.40
Nodes (5): AnimateBy, BlurText(), BlurTextProps, buildKeyframes(), Direction

### Community 51 - "ErrorBoundary.tsx"
Cohesion: 0.20
Nodes (5): App(), ErrorBoundary, ErrorBoundaryProps, State, frontend_src_index

### Community 52 - "org.springframework.http.ResponseEntity"
Cohesion: 0.14
Nodes (15): AppointmentController, GetMapping, PostMapping, RequestMapping, RestController, PostMapping, PutMapping, AppointmentResponseDTO (+7 more)

### Community 53 - "User"
Cohesion: 0.14
Nodes (14): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, User (+6 more)

### Community 54 - "AlergiaResponseDTO"
Cohesion: 0.29
Nodes (6): AlergiaResponseDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter

### Community 55 - "Appointment"
Cohesion: 0.20
Nodes (10): Appointment, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+2 more)

### Community 56 - "AlergiaId"
Cohesion: 0.29
Nodes (6): AlergiaId, AllArgsConstructor, Getter, NoArgsConstructor, Override, Setter

### Community 57 - "AntecedentePatologico"
Cohesion: 0.25
Nodes (8): AntecedentePatologico, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table

### Community 58 - "notblank"
Cohesion: 0.33
Nodes (3): email, notblank, size

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

### Community 63 - "ClinicalImage"
Cohesion: 0.11
Nodes (17): ClinicalImageService, ClinicalImage, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter (+9 more)

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

### Community 68 - "notnull"
Cohesion: 0.29
Nodes (4): decimalmin, max, min, notnull

### Community 69 - "AlergiaId.java"
Cohesion: 0.57
Nodes (4): column, jakarta.persistence.Embeddable, objects, serializable

### Community 70 - "ClinicaDermatologicaApplication.java"
Cohesion: 0.47
Nodes (4): ClinicaDermatologicaApplication, org.springframework.boot.autoconfigure.SpringBootApplication, org.springframework.scheduling.annotation.EnableScheduling, springapplication

### Community 71 - ".register"
Cohesion: 0.29
Nodes (5): Appointment, Override, PaymentConcept, PaymentType, User

### Community 72 - ".register"
Cohesion: 0.29
Nodes (5): Appointment, Override, PaymentConcept, PaymentType, User

### Community 73 - ".register"
Cohesion: 0.29
Nodes (5): Appointment, Override, PaymentConcept, PaymentType, User

### Community 74 - "AlergiaRequestDTO"
Cohesion: 0.33
Nodes (6): AlergiaRequestDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter

### Community 75 - "BookAppointmentRequestDTO"
Cohesion: 0.33
Nodes (6): BookAppointmentRequestDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter

### Community 76 - "HabitoRequestDTO"
Cohesion: 0.33
Nodes (6): HabitoRequestDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter

### Community 77 - "PaymentPreferenceResponseDTO"
Cohesion: 0.33
Nodes (6): AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter, PaymentPreferenceResponseDTO

## Knowledge Gaps
- **143 isolated node(s):** `PENDING_PAYMENT`, `CONFIRMED`, `ATTENDED`, `CANCELED`, `COMPLETED` (+138 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 588 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `SecurityConfig.java`, `MedicalRecordController.java`, `UserRole`, `MedicalRecordService`, `org.springframework.stereotype.Service`, `creationtimestamp`, `MedicalRecord`, `UserDAO`, `CalendarBlock`, `ClinicalEntry`, `UserResponseDTO`, `Appointment`, `CalendarBlockController.java`, `AnalyticsService.java`, `PasswordResetToken`, `MedicalRecordController`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `MedicalRecordService` connect `MedicalRecordService` to `SecurityConfig.java`, `MedicalRecordDTO`, `MedicalRecordController.java`, `AntecedentePatologicoResponseDTO`, `lombok.extern.slf4j.Slf4j`, `HabitoResponseDTO`, `lombok.RequiredArgsConstructor`, `org.springframework.stereotype.Service`, `MedicalRecord`, `UserDAO`, `DelegatedAccessDeniedHandler.java`, `Patient`, `Appointment`, `AlergiaResponseDTO`, `ClinicalEntryResponseDTO`, `MedicalRecordController`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `MedicalRecordDTO` connect `MedicalRecordDTO` to `notnull`, `AntecedentePatologicoResponseDTO`, `HabitoResponseDTO`, `AlergiaResponseDTO`, `MedicalRecordController`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `PENDING_PAYMENT`, `CONFIRMED`, `ATTENDED` to the rest of the system?**
  _143 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SecurityConfig.java` be split into smaller, more focused modules?**
  _Cohesion score 0.0512987012987013 - nodes in this community are weakly interconnected._
- **Should `api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05550416281221091 - nodes in this community are weakly interconnected._
- **Should `V3__stored_procedures_and_triggers.sql` be split into smaller, more focused modules?**
  _Cohesion score 0.05894736842105263 - nodes in this community are weakly interconnected._