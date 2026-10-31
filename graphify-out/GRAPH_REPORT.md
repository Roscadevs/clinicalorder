# Graph Report - momento-de-epifania-inge2  (2026-10-30)

## Corpus Check
- 196 files · ~79,202 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: .css 6, (none) 4, .example 1)

## Summary
- 1448 nodes · 3778 edges · 81 communities (34 shown, 47 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 141 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a341f647`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SecurityConfig.java
- AlergiaId
- api.ts
- DashboardLayout.tsx
- AnalyticsKpisResponseDTO
- PaymentReceiptDTO
- PatientDAO
- MedicalRecordView.tsx
- Button
- Clínica Dermatológica y Estética — Sistema de Gestión de Turnos e Historias Clínicas
- ref_react
- org.springframework.transaction.annotation.Transactional
- AppointmentResponseDTO
- MercadoPagoPaymentAdapter.java
- App.tsx
- BookingWizard.tsx
- ServiceResponseDTO
- AlergiaResponseDTO
- org.springframework.http.ResponseEntity
- ClinicalEntry
- AgendaView.tsx
- ref_lucide_react
- MedicalRecord
- UserResponseDTO
- AppointmentStatus
- CalendarBlockController.java
- GeminiChatRequestDTO
- PaymentTransaction
- Stepper.tsx
- lombok.extern.slf4j.Slf4j
- MedicalRecordDTO
- lombok.RequiredArgsConstructor
- PasswordResetToken
- UserRole
- MedicalRecordService
- Patient
- jakarta.servlet.http.HttpServletRequest
- Navbar.tsx
- HabitoResponseDTO
- .registerDepositPayment
- AnalyticsService.java
- AppointmentService
- DelegatedAccessDeniedHandler.java
- MedicalRecordAudit
- AesEncryptionService.java
- TimeSlotDTO
- JwtAuthenticationFilter.java
- Appointment
- BlurText.tsx
- ErrorBoundary.tsx
- AppointmentController
- Alergia
- Habito
- AntecedentePatologico
- GlideSelect.tsx
- AnamnesisForm.tsx
- LandingPageView.tsx
- AuthRequestDTO
- HabitoId
- ClinicalEntryResponseDTO
- ForgotPasswordRequestDTO
- value
- ClinicaDermatologicaApplication.java
- BookAppointmentRequestDTO
- ClinicalEntryRequestDTO
- .bookTemporaryHold
- RoleGuard.tsx
- DuplicateResourceException
- SlotUnavailableException
- UnauthorizedAccessException
- vite-env.d.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 55 edges
2. `Button` - 46 edges
3. `MedicalRecordService` - 38 edges
4. `User` - 31 edges
5. `Modal()` - 28 edges
6. `AppointmentService` - 27 edges
7. `UserDAO` - 27 edges
8. `PaymentTransaction` - 26 edges
9. `Appointment` - 24 edges
10. `App()` - 24 edges

## Surprising Connections (you probably didn't know these)
- `Nota sobre el acceso a datos (DAO)` --references--> `AppointmentDAO`  [INFERRED]
  README.md → backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/dao/AppointmentDAO.java
- `Patrones de diseño aplicados` --references--> `AppointmentDAO`  [INFERRED]
  README.md → backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/dao/AppointmentDAO.java
- `Nota sobre el acceso a datos (DAO)` --references--> `DermatologicServiceDAO`  [INFERRED]
  README.md → backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/dao/DermatologicServiceDAO.java
- `Nota sobre el acceso a datos (DAO)` --references--> `PatientDAO`  [INFERRED]
  README.md → backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/dao/PatientDAO.java
- `Patrones de diseño aplicados` --references--> `PatientDAO`  [INFERRED]
  README.md → backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/dao/PatientDAO.java

## Import Cycles
- None detected.

## Communities (81 total, 47 thin omitted)

### Community 2 - "api.ts"
Cohesion: 0.06
Nodes (39): StatusStyle, VisualStatus, CollectBalanceModalProps, EditAppointmentView(), formatDateTime(), localDate(), todayInAR(), AnalyticsDashboardView() (+31 more)

### Community 3 - "DashboardLayout.tsx"
Cohesion: 0.19
Nodes (14): BottomNav(), DashboardLayout(), pathToTab(), roleLanding, tabToPath(), GeminiChatbotWidget(), Navbar(), PageTransition() (+6 more)

### Community 4 - "AnalyticsKpisResponseDTO"
Cohesion: 0.11
Nodes (9): AnalyticsService, ConexionBD, AnalyticsController, SystemStatusController, AiAssistantKpis, AnalyticsKpisResponseDTO, FinancialKpis, OperationalKpis (+1 more)

### Community 6 - "PatientDAO"
Cohesion: 0.09
Nodes (5): PatientService, PatientDAO, PatientController, PatientRequestDTO, PatientResponseDTO

### Community 7 - "MedicalRecordView.tsx"
Cohesion: 0.14
Nodes (29): RFC-7807, Badge, Card, Spinner(), toast, getVisualStatus(), STATUS_STYLES, Highlight() (+21 more)

### Community 8 - "Button"
Cohesion: 0.12
Nodes (36): Button, Callout(), Input, Modal(), Select, AdminServicesView(), AdminTab, ars() (+28 more)

### Community 9 - "Clínica Dermatológica y Estética — Sistema de Gestión de Turnos e Historias Clínicas"
Cohesion: 0.15
Nodes (12): Arquitectura en capas, Clínica Dermatológica y Estética — Sistema de Gestión de Turnos e Historias Clínicas, Cómo ejecutarlo, Estructura del repositorio, Integración continua, Opción A — Docker Compose (todo en contenedores), Opción B — Ejecución manual, Pila tecnológica (+4 more)

### Community 10 - "ref_react"
Cohesion: 0.07
Nodes (29): BadgeProps, BadgeSize, BadgeVariant, dotStyles, sizeStyles, variantStyles, ButtonProps, ButtonSize (+21 more)

### Community 11 - "org.springframework.transaction.annotation.Transactional"
Cohesion: 0.12
Nodes (7): ClinicalImageService, DermatologicServiceService, BusinessRuleException, ResourceNotFoundException, ClinicalImageDAO, DermatologicServiceDAO, MedicalRecordController

### Community 14 - "App.tsx"
Cohesion: 0.17
Nodes (17): AdminServicesView, AgendaView, AnalyticsDashboardView, App(), BookingWizard, EditAppointmentView, FallbackLoader(), MedicalRecordView (+9 more)

### Community 15 - "BookingWizard.tsx"
Cohesion: 0.09
Nodes (33): Step(), CLINIC, ars(), BookingWizard(), formatCountdown(), formatDateTime(), Hold, Outcome (+25 more)

### Community 16 - "ServiceResponseDTO"
Cohesion: 0.07
Nodes (4): DermatologicService, ServiceCatalogController, ServiceRequestDTO, ServiceResponseDTO

### Community 19 - "ClinicalEntry"
Cohesion: 0.08
Nodes (3): ClinicalEntry, ClinicalEntryAudit, ClinicalImage

### Community 20 - "AgendaView.tsx"
Cohesion: 0.25
Nodes (22): addDays(), AgendaView(), AppointmentDetail(), ApptChip, ars(), computeRange(), ConfirmState, dayKey() (+14 more)

### Community 21 - "ref_lucide_react"
Cohesion: 0.19
Nodes (7): RFC-5322, ForgotPasswordFormData, forgotPasswordSchema, UpdatePasswordFormData, updatePasswordSchema, InformedConsentModalProps, supabase

### Community 25 - "AppointmentStatus"
Cohesion: 0.22
Nodes (8): AppointmentStatus, ATTENDED, CANCELED, COMPLETED, CONFIRMED, NO_SHOW, PAYMENT_FAILED, PENDING_PAYMENT

### Community 26 - "CalendarBlockController.java"
Cohesion: 0.07
Nodes (7): CalendarBlockService, CalendarBlock, CalendarBlockDAO, CalendarBlockController, CalendarBlockRequestDTO, CalendarBlockResponseDTO, Nota sobre el acceso a datos (DAO)

### Community 27 - "GeminiChatRequestDTO"
Cohesion: 0.07
Nodes (6): GeminiApiClientAdapter, SupabaseStorageAdapter, ClinicalImageResponseDTO, ChatMessageItemDTO, GeminiChatRequestDTO, GeminiChatResponseDTO

### Community 28 - "PaymentTransaction"
Cohesion: 0.13
Nodes (6): PaymentStatus, APPROVED, PENDING, REFUNDED, REJECTED, PaymentTransaction

### Community 29 - "Stepper.tsx"
Cohesion: 0.24
Nodes (11): CheckIcon(), SlideTransition(), SlideTransitionProps, StepConnector(), StepContentWrapper(), StepContentWrapperProps, StepIndicator(), StepIndicatorProps (+3 more)

### Community 30 - "lombok.extern.slf4j.Slf4j"
Cohesion: 0.10
Nodes (6): AuthService, UserService, User, EmailNotificationService, UserDAO, CustomUserDetailsService

### Community 32 - "lombok.RequiredArgsConstructor"
Cohesion: 0.13
Nodes (4): GeminiChatbotService, GeminiChatbotController, PaymentWebhookController, UserController

### Community 34 - "UserRole"
Cohesion: 0.12
Nodes (6): UserRole, ADMIN, DOCTORA, SECRETARIA, AuthResponseDTO, RegisterUserRequestDTO

### Community 35 - "MedicalRecordService"
Cohesion: 0.19
Nodes (9): MedicalRecordService, AlergiaDAO, AppointmentDAO, ClinicalEntryAuditDAO, ClinicalEntryDAO, HabitoDAO, MedicalRecordAuditDAO, MedicalRecordDAO (+1 more)

### Community 39 - "Navbar.tsx"
Cohesion: 0.25
Nodes (10): BottomNavProps, ICONS, ICONS, NavbarProps, NAV_TABS, NavIcon, NavTab, RoleType (+2 more)

### Community 42 - "AnalyticsService.java"
Cohesion: 0.14
Nodes (8): PaymentConcept, BALANCE, DEPOSIT, FULL, PaymentType, BANK_TRANSFER, CASH, MERCADOPAGO

### Community 43 - "AppointmentService"
Cohesion: 0.11
Nodes (11): AppointmentService, PaymentService, PaymentRegistrationStrategy, PaymentStrategyFactory, MercadoPagoPaymentAdapter, BankTransferPaymentStrategy, CashPaymentStrategy, MercadoPagoPaymentStrategy (+3 more)

### Community 48 - "JwtAuthenticationFilter.java"
Cohesion: 0.14
Nodes (3): JwtAuthenticationFilter, JwtTokenProvider, Seguridad y roles

### Community 50 - "BlurText.tsx"
Cohesion: 0.25
Nodes (5): PageTransitionProps, AnimateBy, BlurTextProps, buildKeyframes(), Direction

### Community 51 - "ErrorBoundary.tsx"
Cohesion: 0.20
Nodes (5): ErrorBoundary, ErrorBoundaryProps, State, HumanFriendlyErrorFallback(), HumanFriendlyErrorFallbackProps

### Community 57 - "AntecedentePatologico"
Cohesion: 0.07
Nodes (5): AntecedentePatologico, AntecedentePatologicoId, AntecedentePatologicoDAO, AntecedentePatologicoRequestDTO, AntecedentePatologicoResponseDTO

### Community 59 - "GlideSelect.tsx"
Cohesion: 0.21
Nodes (10): DEFAULT_OPTIONS, GlideSelect(), GlideSelectProps, MenuBox, norm(), OptionInput, Phase, SIZES (+2 more)

### Community 60 - "AnamnesisForm.tsx"
Cohesion: 0.12
Nodes (14): ALERGIAS, AnamnesisForm(), AnamnesisFormProps, FITZ, PATOLOGIAS, ReadRow(), ClinicalNoteModal(), photoStore (+6 more)

### Community 61 - "LandingPageView.tsx"
Cohesion: 0.11
Nodes (18): Aurora(), AuroraProps, BlurText(), GlideOption, ButtonSize, SpecularButton(), SpecularButtonProps, SpecularPropsSnapshot (+10 more)

## Knowledge Gaps
- **22 isolated node(s):** `PENDING_PAYMENT`, `CONFIRMED`, `ATTENDED`, `CANCELED`, `COMPLETED` (+17 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 561 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **47 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `lombok.extern.slf4j.Slf4j` to `JwtTokenProvider.java`, `PasswordResetToken`, `UserRole`, `MedicalRecordService`, `lombok.RequiredArgsConstructor`, `org.springframework.transaction.annotation.Transactional`, `MedicalRecordAudit`, `Appointment`, `ClinicalEntry`, `MedicalRecord`, `UserResponseDTO`, `lombok`, `CalendarBlockController.java`, `PaymentTransaction`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **What connects `PENDING_PAYMENT`, `CONFIRMED`, `ATTENDED` to the rest of the system?**
  _22 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SecurityConfig.java` be split into smaller, more focused modules?**
  _Cohesion score 0.10846560846560846 - nodes in this community are weakly interconnected._
- **Why does `MedicalRecordService` connect `MedicalRecordService` to `lombok.RequiredArgsConstructor`, `ClinicalEntryResponseDTO`, `PatientDAO`, `HabitoResponseDTO`, `org.springframework.transaction.annotation.Transactional`, `DelegatedAccessDeniedHandler.java`, `MedicalRecordAudit`, `AesEncryptionService.java`, `AlergiaResponseDTO`, `MedicalRecord`, `AntecedentePatologico`, `lombok.extern.slf4j.Slf4j`, `MedicalRecordDTO`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Should `api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06205673758865248 - nodes in this community are weakly interconnected._
- **Why does `Appointment` connect `Appointment` to `MedicalRecordService`, `AnalyticsKpisResponseDTO`, `Patient`, `AnalyticsService.java`, `AppointmentResponseDTO`, `ServiceResponseDTO`, `ClinicalEntry`, `lombok`, `AppointmentStatus`, `PaymentTransaction`, `lombok.extern.slf4j.Slf4j`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Should `AnalyticsKpisResponseDTO` be split into smaller, more focused modules?**
  _Cohesion score 0.11414141414141414 - nodes in this community are weakly interconnected._