# Graph Report - momento-de-epifania-inge2  (2026-10-20)

## Corpus Check
- 195 files · ~78,906 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: .css 6, (none) 4, .example 1)

## Summary
- 1443 nodes · 3764 edges · 78 communities (33 shown, 45 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 140 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `11983f36`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SecurityConfig.java
- AlergiaId
- api.ts
- DashboardLayout.tsx
- AnalyticsKpisResponseDTO
- UserDAO
- PatientResponseDTO
- MedicalRecordView.tsx
- Button
- MedicalRecordService.java
- cn
- org.springframework.transaction.annotation.Transactional
- AppointmentService
- lombok.extern.slf4j.Slf4j
- App.tsx
- BookingWizard.tsx
- ServiceResponseDTO
- AlergiaResponseDTO
- AuthController
- ClinicalEntry
- AgendaView.tsx
- ref_react
- org.springframework.http.ResponseEntity
- UserResponseDTO
- AppointmentStatus
- CalendarBlockResponseDTO
- ClinicalImageService
- AnalyticsService.java
- ClinicalImage
- User
- MedicalRecordService
- lombok.RequiredArgsConstructor
- PasswordResetToken
- UserRole
- list
- PatientDAO
- GeminiChatResponseDTO
- jakarta.servlet.http.HttpServletRequest
- Navbar.tsx
- HabitoResponseDTO
- PaymentReceiptDTO
- bigdecimal
- PaymentRegistrationStrategy
- org.springframework.stereotype.Component
- MedicalRecord
- AesEncryptionService.java
- TimeSlotDTO
- JwtAuthenticationFilter.java
- Appointment
- AntecedentePatologicoId
- ErrorBoundary.tsx
- CalendarBlock
- ClinicalEntryAudit
- DermatologicService
- Alergia
- Habito
- AntecedentePatologicoResponseDTO
- GlideSelect.tsx
- AnamnesisForm.tsx
- LandingPageView.tsx
- AuthRequestDTO
- HabitoId
- JwtTokenProvider
- GeminiApiClientAdapter
- GeminiChatRequestDTO
- ClinicalEntryResponseDTO
- GeminiApiClientAdapter.java
- value
- ClinicaDermatologicaApplication.java
- BookAppointmentRequestDTO
- ClinicalEntryRequestDTO
- PaymentPreferenceResponseDTO
- ref_react_router_dom
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
- `Nota sobre el acceso a datos (DAO)` --references--> `CalendarBlockDAO`  [INFERRED]
  README.md → backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/dao/CalendarBlockDAO.java
- `Nota sobre el acceso a datos (DAO)` --references--> `PatientDAO`  [INFERRED]
  README.md → backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/dao/PatientDAO.java
- `Patrones de diseño aplicados` --references--> `PatientDAO`  [INFERRED]
  README.md → backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/dao/PatientDAO.java

## Import Cycles
- None detected.

## Communities (78 total, 45 thin omitted)

### Community 2 - "api.ts"
Cohesion: 0.07
Nodes (35): AnalyticsDashboardView(), CashOption, Method, RegisterPaymentStepProps, analyticsApi, api, API_BASE_URL, chatApi (+27 more)

### Community 3 - "DashboardLayout.tsx"
Cohesion: 0.23
Nodes (11): BottomNav(), DashboardLayout(), pathToTab(), roleLanding, tabToPath(), GeminiChatbotWidget(), Navbar(), PageTransition() (+3 more)

### Community 4 - "AnalyticsKpisResponseDTO"
Cohesion: 0.12
Nodes (9): AnalyticsService, ConexionBD, AnalyticsController, SystemStatusController, AiAssistantKpis, AnalyticsKpisResponseDTO, FinancialKpis, OperationalKpis (+1 more)

### Community 5 - "UserDAO"
Cohesion: 0.20
Nodes (3): AuthService, EmailNotificationService, UserDAO

### Community 6 - "PatientResponseDTO"
Cohesion: 0.10
Nodes (4): PatientService, PatientController, PatientRequestDTO, PatientResponseDTO

### Community 7 - "MedicalRecordView.tsx"
Cohesion: 0.11
Nodes (36): RFC-7807, Badge, Card, Spinner(), toast, getVisualStatus(), STATUS_STYLES, StatusStyle (+28 more)

### Community 8 - "Button"
Cohesion: 0.10
Nodes (42): Button, Callout(), Modal(), Select, AdminServicesView(), AdminTab, ars(), ROLE_CONFIG (+34 more)

### Community 10 - "cn"
Cohesion: 0.09
Nodes (18): BadgeProps, BadgeSize, BadgeVariant, dotStyles, sizeStyles, variantStyles, CardContent, CardDescription (+10 more)

### Community 12 - "AppointmentService"
Cohesion: 0.12
Nodes (3): AppointmentService, AppointmentController, AppointmentResponseDTO

### Community 13 - "lombok.extern.slf4j.Slf4j"
Cohesion: 0.10
Nodes (4): PaymentService, PaymentGatewayException, MercadoPagoPaymentAdapter, PaymentWebhookController

### Community 14 - "App.tsx"
Cohesion: 0.17
Nodes (19): AdminServicesView, AgendaView, AnalyticsDashboardView, App(), BookingWizard, EditAppointmentView, FallbackLoader(), MedicalRecordView (+11 more)

### Community 15 - "BookingWizard.tsx"
Cohesion: 0.08
Nodes (39): CheckIcon(), SlideTransition(), SlideTransitionProps, Step(), StepConnector(), StepContentWrapper(), StepContentWrapperProps, StepIndicator() (+31 more)

### Community 16 - "ServiceResponseDTO"
Cohesion: 0.10
Nodes (4): DermatologicServiceService, ServiceCatalogController, ServiceRequestDTO, ServiceResponseDTO

### Community 18 - "AuthController"
Cohesion: 0.12
Nodes (3): AuthController, ForgotPasswordRequestDTO, ResetPasswordRequestDTO

### Community 20 - "AgendaView.tsx"
Cohesion: 0.23
Nodes (23): addDays(), AgendaView(), AppointmentDetail(), ApptChip, ars(), computeRange(), ConfirmState, dayKey() (+15 more)

### Community 21 - "ref_react"
Cohesion: 0.08
Nodes (22): RFC-5322, ButtonProps, ButtonSize, ButtonVariant, sizeStyles, variantStyles, CalloutIntent, CalloutProps (+14 more)

### Community 23 - "UserResponseDTO"
Cohesion: 0.11
Nodes (4): UserService, UserController, UpdateUserRequestDTO, UserResponseDTO

### Community 25 - "AppointmentStatus"
Cohesion: 0.22
Nodes (8): AppointmentStatus, ATTENDED, CANCELED, COMPLETED, CONFIRMED, NO_SHOW, PAYMENT_FAILED, PENDING_PAYMENT

### Community 26 - "CalendarBlockResponseDTO"
Cohesion: 0.13
Nodes (3): CalendarBlockService, CalendarBlockRequestDTO, CalendarBlockResponseDTO

### Community 27 - "ClinicalImageService"
Cohesion: 0.18
Nodes (3): ClinicalImageService, ClinicalImageDAO, ClinicalImageResponseDTO

### Community 28 - "AnalyticsService.java"
Cohesion: 0.09
Nodes (11): PaymentConcept, BALANCE, DEPOSIT, FULL, PaymentStatus, APPROVED, PENDING, REFUNDED (+3 more)

### Community 34 - "UserRole"
Cohesion: 0.12
Nodes (6): UserRole, ADMIN, DOCTORA, SECRETARIA, AuthResponseDTO, RegisterUserRequestDTO

### Community 38 - "jakarta.servlet.http.HttpServletRequest"
Cohesion: 0.08
Nodes (16): DuplicateResourceException, SlotUnavailableException, UnauthorizedAccessException, GlobalExceptionHandler, Arquitectura en capas, Clínica Dermatológica y Estética — Sistema de Gestión de Turnos e Historias Clínicas, Cómo ejecutarlo, Estructura del repositorio (+8 more)

### Community 39 - "Navbar.tsx"
Cohesion: 0.25
Nodes (10): BottomNavProps, ICONS, ICONS, NavbarProps, NAV_TABS, NavIcon, NavTab, RoleType (+2 more)

### Community 42 - "bigdecimal"
Cohesion: 0.11
Nodes (6): PaymentType, BANK_TRANSFER, CASH, MERCADOPAGO, FinalizePaymentRequestDTO, RegisterPaymentRequestDTO

### Community 43 - "PaymentRegistrationStrategy"
Cohesion: 0.08
Nodes (6): PaymentRegistrationStrategy, PaymentStrategyFactory, BankTransferPaymentStrategy, CashPaymentStrategy, MercadoPagoPaymentStrategy, Patrones de diseño aplicados

### Community 44 - "org.springframework.stereotype.Component"
Cohesion: 0.18
Nodes (3): HoldExpirationScheduler, DelegatedAccessDeniedHandler, DelegatedAuthenticationEntryPoint

### Community 45 - "MedicalRecord"
Cohesion: 0.12
Nodes (3): MedicalRecord, MedicalRecordAudit, MedicalRecordAuditDAO

### Community 51 - "ErrorBoundary.tsx"
Cohesion: 0.16
Nodes (5): ErrorBoundary, ErrorBoundaryProps, State, HumanFriendlyErrorFallback(), HumanFriendlyErrorFallbackProps

### Community 54 - "DermatologicService"
Cohesion: 0.18
Nodes (4): GeminiChatbotService, DermatologicService, DermatologicServiceDAO, Nota sobre el acceso a datos (DAO)

### Community 59 - "GlideSelect.tsx"
Cohesion: 0.24
Nodes (10): DEFAULT_OPTIONS, GlideSelect(), GlideSelectProps, MenuBox, norm(), OptionInput, Phase, SIZES (+2 more)

### Community 60 - "AnamnesisForm.tsx"
Cohesion: 0.25
Nodes (8): ALERGIAS, AnamnesisForm(), AnamnesisFormProps, FITZ, PATOLOGIAS, ReadRow(), MedicalRecord, currentUserId()

### Community 61 - "LandingPageView.tsx"
Cohesion: 0.09
Nodes (21): Aurora(), AuroraProps, AnimateBy, BlurText(), BlurTextProps, buildKeyframes(), Direction, GlideOption (+13 more)

## Knowledge Gaps
- **22 isolated node(s):** `PENDING_PAYMENT`, `CONFIRMED`, `ATTENDED`, `CANCELED`, `COMPLETED` (+17 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 562 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **45 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `JwtTokenProvider`, `PasswordResetToken`, `UserRole`, `list`, `lombok.RequiredArgsConstructor`, `UserDAO`, `org.springframework.transaction.annotation.Transactional`, `MedicalRecord`, `Appointment`, `ClinicalEntry`, `CalendarBlock`, `ClinicalEntryAudit`, `org.springframework.http.ResponseEntity`, `UserResponseDTO`, `lombok`, `AnalyticsService.java`, `AuthRequestDTO`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **What connects `PENDING_PAYMENT`, `CONFIRMED`, `ATTENDED` to the rest of the system?**
  _22 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SecurityConfig.java` be split into smaller, more focused modules?**
  _Cohesion score 0.10846560846560846 - nodes in this community are weakly interconnected._
- **Why does `MedicalRecordService` connect `MedicalRecordService` to `AlergiaId`, `UserDAO`, `MedicalRecordService.java`, `org.springframework.transaction.annotation.Transactional`, `lombok.extern.slf4j.Slf4j`, `AlergiaResponseDTO`, `ClinicalEntry`, `org.springframework.http.ResponseEntity`, `lombok.RequiredArgsConstructor`, `list`, `PatientDAO`, `HabitoResponseDTO`, `org.springframework.stereotype.Component`, `MedicalRecord`, `AesEncryptionService.java`, `Appointment`, `AntecedentePatologicoId`, `ClinicalEntryAudit`, `Alergia`, `Habito`, `AntecedentePatologicoResponseDTO`, `HabitoId`, `ClinicalEntryResponseDTO`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Why does `Appointment` connect `Appointment` to `list`, `AnalyticsKpisResponseDTO`, `PatientDAO`, `TimeSlotDTO`, `ClinicalEntry`, `DermatologicService`, `lombok`, `AppointmentStatus`, `AnalyticsService.java`, `User`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Should `AnalyticsKpisResponseDTO` be split into smaller, more focused modules?**
  _Cohesion score 0.12311265969802555 - nodes in this community are weakly interconnected._