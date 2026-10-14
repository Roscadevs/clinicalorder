# Graph Report - momento-de-epifania-inge2  (2026-10-14)

## Corpus Check
- 212 files · ~79,948 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: .css 6, (none) 4)

## Summary
- 1538 nodes · 4063 edges · 67 communities (39 shown, 28 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 174 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `90cc405f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SecurityConfig.java
- Alergia
- api.ts
- DashboardLayout.tsx
- AnalyticsKpisResponseDTO
- lombok.extern.slf4j.Slf4j
- PatientResponseDTO
- MedicalRecordView.tsx
- Button
- MedicalRecordService
- cn
- org.springframework.transaction.annotation.Transactional
- AppointmentController
- AppointmentService
- GeminiApiClientAdapter
- BookingWizard.tsx
- ServiceResponseDTO
- UpdatePasswordView.tsx
- AuthService.java
- ClinicalEntry
- AgendaView.tsx
- App.tsx
- org.springframework.http.ResponseEntity
- UserResponseDTO
- AppointmentStatus
- CalendarBlockResponseDTO
- ClinicalImageResponseDTO
- ClinicalImage
- User
- MedicalRecordDTO
- PasswordResetToken
- UserRole
- list
- PatientDAO
- GeminiChatResponseDTO
- jakarta.servlet.http.HttpServletRequest
- BottomNav.tsx
- Habito
- RegisterUserRequestDTO
- PaymentType
- AnalyticsService.java
- lombok.RequiredArgsConstructor
- MedicalRecord
- DelegatedAccessDeniedHandler.java
- AnamnesisForm.tsx
- GeminiChatRequestDTO
- ClinicalImageService
- CalendarBlockController
- ErrorBoundary.tsx
- LandingPageView.tsx
- CalendarBlockRequestDTO
- DermatologicService
- GlideSelect.tsx
- Stepper.tsx
- ref_react_router_dom
- notblank
- reactbits/index.ts
- ClinicalEntryRequestDTO
- ClinicaDermatologicaApplication.java
- AntecedentePatologicoRequestDTO
- vite-env.d.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 55 edges
2. `Button` - 46 edges
3. `MedicalRecordService` - 35 edges
4. `User` - 31 edges
5. `ClinicalEntry` - 28 edges
6. `Modal()` - 28 edges
7. `AppointmentService` - 27 edges
8. `UserDAO` - 27 edges
9. `PaymentTransaction` - 26 edges
10. `MedicalRecord` - 25 edges

## Surprising Connections (you probably didn't know these)
- `Patrones de diseño aplicados` --references--> `AppointmentDAO`  [INFERRED]
  README.md → backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/dao/AppointmentDAO.java
- `Nota sobre el acceso a datos (DAO)` --references--> `DermatologicServiceDAO`  [INFERRED]
  README.md → backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/dao/DermatologicServiceDAO.java
- `Nota sobre el acceso a datos (DAO)` --references--> `PatientDAO`  [INFERRED]
  README.md → backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/dao/PatientDAO.java
- `Patrones de diseño aplicados` --references--> `PatientDAO`  [INFERRED]
  README.md → backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/dao/PatientDAO.java
- `Nota sobre el acceso a datos (DAO)` --references--> `PaymentTransactionDAO`  [INFERRED]
  README.md → backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/dao/PaymentTransactionDAO.java

## Import Cycles
- None detected.

## Communities (67 total, 28 thin omitted)

### Community 0 - "SecurityConfig.java"
Cohesion: 0.05
Nodes (3): MercadoPagoConfigBean, AesEncryptionService, SecurityConfig

### Community 1 - "Alergia"
Cohesion: 0.07
Nodes (5): Alergia, AlergiaId, AlergiaRepository, AlergiaRepositoryAdapter, AlergiaResponseDTO

### Community 2 - "api.ts"
Cohesion: 0.06
Nodes (35): AnalyticsDashboardView(), ClinicalNoteModal(), ClinicalNoteModalProps, photoStore, TreatmentPhotos(), TreatmentPhotosProps, analyticsApi, api (+27 more)

### Community 3 - "DashboardLayout.tsx"
Cohesion: 0.23
Nodes (11): BottomNav(), DashboardLayout(), pathToTab(), roleLanding, tabToPath(), GeminiChatbotWidget(), Navbar(), PageTransition() (+3 more)

### Community 4 - "AnalyticsKpisResponseDTO"
Cohesion: 0.12
Nodes (9): AnalyticsService, ConexionBD, AnalyticsController, SystemStatusController, AiAssistantKpis, AnalyticsKpisResponseDTO, FinancialKpis, OperationalKpis (+1 more)

### Community 5 - "lombok.extern.slf4j.Slf4j"
Cohesion: 0.08
Nodes (5): PaymentService, PaymentStrategyFactory, PaymentGatewayException, MercadoPagoPaymentAdapter, PaymentWebhookController

### Community 6 - "PatientResponseDTO"
Cohesion: 0.08
Nodes (3): PatientController, PatientRequestDTO, PatientResponseDTO

### Community 7 - "MedicalRecordView.tsx"
Cohesion: 0.11
Nodes (37): RFC-7807, Badge, Card, Spinner(), toast, STATUS_STYLES, CollectBalanceModalProps, EditAppointmentView() (+29 more)

### Community 8 - "Button"
Cohesion: 0.11
Nodes (35): Button, Callout(), Modal(), Select, AdminServicesView(), AdminTab, ars(), ROLE_CONFIG (+27 more)

### Community 9 - "MedicalRecordService"
Cohesion: 0.10
Nodes (5): MedicalRecordService, AntecedentePatologico, AntecedentePatologicoId, AntecedentePatologicoRepository, AntecedentePatologicoRepositoryAdapter

### Community 10 - "cn"
Cohesion: 0.07
Nodes (31): ICONS, BadgeProps, BadgeSize, BadgeVariant, dotStyles, sizeStyles, variantStyles, ButtonProps (+23 more)

### Community 11 - "org.springframework.transaction.annotation.Transactional"
Cohesion: 0.22
Nodes (3): PatientService, BusinessRuleException, ResourceNotFoundException

### Community 12 - "AppointmentController"
Cohesion: 0.09
Nodes (3): AppointmentController, AppointmentResponseDTO, TimeSlotDTO

### Community 13 - "AppointmentService"
Cohesion: 0.06
Nodes (8): AppointmentService, Appointment, HoldPolicy, AppointmentDAO, CalendarBlockDAO, BookAppointmentRequestDTO, PaymentPreferenceResponseDTO, Nota sobre el acceso a datos (DAO)

### Community 15 - "BookingWizard.tsx"
Cohesion: 0.09
Nodes (33): Step(), Input, CLINIC, ars(), BookingWizard(), formatCountdown(), formatDateTime(), Hold (+25 more)

### Community 16 - "ServiceResponseDTO"
Cohesion: 0.11
Nodes (4): DermatologicServiceService, ServiceCatalogController, ServiceRequestDTO, ServiceResponseDTO

### Community 17 - "UpdatePasswordView.tsx"
Cohesion: 0.23
Nodes (6): RFC-5322, ForgotPasswordFormData, forgotPasswordSchema, UpdatePasswordFormData, updatePasswordSchema, supabase

### Community 18 - "AuthService.java"
Cohesion: 0.08
Nodes (6): AuthService, PasswordResetTokenRepository, EmailNotificationService, AuthController, ForgotPasswordRequestDTO, ResetPasswordRequestDTO

### Community 19 - "ClinicalEntry"
Cohesion: 0.06
Nodes (3): ClinicalEntry, ClinicalEntryAudit, ClinicalEntryResponseDTO

### Community 20 - "AgendaView.tsx"
Cohesion: 0.18
Nodes (26): addDays(), AgendaView(), AppointmentDetail(), ApptChip(), ars(), computeRange(), ConfirmState, dayKey() (+18 more)

### Community 21 - "App.tsx"
Cohesion: 0.19
Nodes (18): AdminServicesView, AgendaView, AnalyticsDashboardView, App(), BookingWizard, EditAppointmentView, FallbackLoader(), MedicalRecordView (+10 more)

### Community 23 - "UserResponseDTO"
Cohesion: 0.11
Nodes (4): UserService, UserController, UpdateUserRequestDTO, UserResponseDTO

### Community 25 - "AppointmentStatus"
Cohesion: 0.11
Nodes (13): AppointmentStatus, ATTENDED, CANCELED, COMPLETED, CONFIRMED, NO_SHOW, PAYMENT_FAILED, PENDING_PAYMENT (+5 more)

### Community 34 - "UserRole"
Cohesion: 0.10
Nodes (6): UserRole, ADMIN, DOCTORA, SECRETARIA, AuthRequestDTO, AuthResponseDTO

### Community 35 - "list"
Cohesion: 0.13
Nodes (12): ClinicalEntryRepository, ClinicalEntryRepositoryAdapter, UserDAO, JpaAlergiaRepository, JpaAntecedentePatologicoRepository, JpaClinicalEntryAuditRepository, JpaClinicalEntryRepository, JpaClinicalImageRepository (+4 more)

### Community 38 - "jakarta.servlet.http.HttpServletRequest"
Cohesion: 0.05
Nodes (19): DuplicateResourceException, SlotUnavailableException, UnauthorizedAccessException, JwtAuthenticationFilter, JwtTokenProvider, GlobalExceptionHandler, Arquitectura en capas, Clínica Dermatológica y Estética — Sistema de Gestión de Turnos e Historias Clínicas (+11 more)

### Community 39 - "BottomNav.tsx"
Cohesion: 0.29
Nodes (9): BottomNavProps, ICONS, NavbarProps, NAV_TABS, NavIcon, NavTab, RoleType, TabType (+1 more)

### Community 40 - "Habito"
Cohesion: 0.06
Nodes (6): Habito, HabitoId, HabitoRepository, HabitoRepositoryAdapter, HabitoRequestDTO, HabitoResponseDTO

### Community 42 - "PaymentType"
Cohesion: 0.10
Nodes (6): PaymentType, BANK_TRANSFER, CASH, MERCADOPAGO, FinalizePaymentRequestDTO, RegisterPaymentRequestDTO

### Community 43 - "AnalyticsService.java"
Cohesion: 0.09
Nodes (6): PaymentStatus, APPROVED, PENDING, REFUNDED, REJECTED, PaymentTransaction

### Community 44 - "lombok.RequiredArgsConstructor"
Cohesion: 0.18
Nodes (9): PaymentRegistrationStrategy, BankTransferPaymentStrategy, CashPaymentStrategy, MercadoPagoPaymentStrategy, PasswordResetTokenRepositoryAdapter, PaymentTransactionDAO, HoldExpirationScheduler, CustomUserDetailsService (+1 more)

### Community 45 - "MedicalRecord"
Cohesion: 0.10
Nodes (4): MedicalRecord, MedicalRecordAudit, MedicalRecordRepository, MedicalRecordRepositoryAdapter

### Community 47 - "AnamnesisForm.tsx"
Cohesion: 0.27
Nodes (9): ALERGIAS, AnamnesisForm(), AnamnesisFormProps, FITZ, PATOLOGIAS, ReadRow(), clinicalApi, MedicalRecord (+1 more)

### Community 51 - "ErrorBoundary.tsx"
Cohesion: 0.16
Nodes (5): ErrorBoundary, ErrorBoundaryProps, State, HumanFriendlyErrorFallback(), HumanFriendlyErrorFallbackProps

### Community 52 - "LandingPageView.tsx"
Cohesion: 0.17
Nodes (12): Aurora(), BlurText(), SpotlightCard(), SpotlightCardProps, Logo(), BOOKING_MESSAGE, serviceInquiryMessage(), WHATSAPP_NUMBER (+4 more)

### Community 54 - "DermatologicService"
Cohesion: 0.20
Nodes (3): GeminiChatbotService, DermatologicService, DermatologicServiceDAO

### Community 55 - "GlideSelect.tsx"
Cohesion: 0.24
Nodes (10): DEFAULT_OPTIONS, GlideSelect(), GlideSelectProps, MenuBox, norm(), OptionInput, Phase, SIZES (+2 more)

### Community 56 - "Stepper.tsx"
Cohesion: 0.24
Nodes (11): CheckIcon(), SlideTransition(), SlideTransitionProps, StepConnector(), StepContentWrapper(), StepContentWrapperProps, StepIndicator(), StepIndicatorProps (+3 more)

### Community 61 - "reactbits/index.ts"
Cohesion: 0.14
Nodes (10): AuroraProps, AnimateBy, BlurTextProps, buildKeyframes(), Direction, GlideOption, ButtonSize, SpecularButton() (+2 more)

## Knowledge Gaps
- **22 isolated node(s):** `PENDING_PAYMENT`, `CONFIRMED`, `ATTENDED`, `CANCELED`, `COMPLETED` (+17 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 564 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `SecurityConfig.java`, `PasswordResetToken`, `UserRole`, `list`, `org.springframework.security.access.prepost.PreAuthorize`, `jakarta.servlet.http.HttpServletRequest`, `org.springframework.transaction.annotation.Transactional`, `AnalyticsService.java`, `MedicalRecord`, `AppointmentService`, `lombok.RequiredArgsConstructor`, `AuthService.java`, `ClinicalEntry`, `org.springframework.http.ResponseEntity`, `UserResponseDTO`, `lombok`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **What connects `PENDING_PAYMENT`, `CONFIRMED`, `ATTENDED` to the rest of the system?**
  _22 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SecurityConfig.java` be split into smaller, more focused modules?**
  _Cohesion score 0.05241090146750524 - nodes in this community are weakly interconnected._
- **Why does `MedicalRecordService` connect `MedicalRecordService` to `SecurityConfig.java`, `Alergia`, `org.springframework.security.access.prepost.PreAuthorize`, `list`, `PatientDAO`, `lombok.extern.slf4j.Slf4j`, `Habito`, `org.springframework.transaction.annotation.Transactional`, `lombok.RequiredArgsConstructor`, `MedicalRecord`, `AppointmentService`, `DelegatedAccessDeniedHandler.java`, `ClinicalEntry`, `org.springframework.http.ResponseEntity`, `MedicalRecordDTO`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `Alergia` be split into smaller, more focused modules?**
  _Cohesion score 0.07419712070874862 - nodes in this community are weakly interconnected._
- **Why does `Appointment` connect `AppointmentService` to `list`, `AnalyticsKpisResponseDTO`, `PatientDAO`, `AnalyticsService.java`, `ClinicalEntry`, `DermatologicService`, `lombok`, `AppointmentStatus`, `User`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Should `api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.061224489795918366 - nodes in this community are weakly interconnected._