# Graph Report - TP  (2026-10-14)

## Corpus Check
- 212 files · ~80,093 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: .css 6, (none) 4, .example 1)

## Summary
- 1608 nodes · 4004 edges · 69 communities (61 shown, 6 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 155 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `33115cb9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- SecurityConfig.java
- Alergia
- api.ts
- ref_motion
- AnalyticsKpisResponseDTO
- MedicalRecordService
- PatientResponseDTO
- MedicalRecordView.tsx
- AdminServicesView.tsx
- AntecedentePatologico
- cn
- ClinicalImageService.java
- org.springframework.http.ResponseEntity
- MercadoPagoPaymentAdapter.java
- V4__schema_redesign.sql
- BookingWizard.tsx
- ServiceResponseDTO
- ref_hookform_resolvers
- AuthController
- ClinicalEntry
- AgendaView.tsx
- App.tsx
- MedicalRecordController
- UserDAO
- lombok
- AnalyticsService.java
- CalendarBlockResponseDTO
- ClinicalImageResponseDTO
- org.springframework.transaction.annotation.Transactional
- ClinicalImage
- User
- MedicalRecordDTO
- lombok.RequiredArgsConstructor
- PasswordResetToken
- UserRole
- org.springframework.data.jpa.repository.JpaRepository
- Patient
- GeminiChatRequestDTO
- jakarta.servlet.http.HttpServletRequest
- DashboardLayout.tsx
- Habito
- SystemStatusController.java
- PaymentType
- PaymentTransaction
- list
- MedicalRecord
- V1__initial_schema.sql
- AppointmentResponseDTO
- Clínica Dermatológica y Estética — Sistema de Gestión de Turnos e Historias Clínicas
- Appointment
- AntecedentePatologicoId
- LandingPageView.tsx
- CalendarBlock
- ClinicalEntryAudit
- DermatologicService
- V2__audit_triggers_and_tables.sql
- MedicalRecordAudit
- .addAntecedentePatologico
- notblank
- idx_hc_audit_date
- GlideSelect.tsx
- historia_clinica
- transaccion_pago
- ClinicalEntryResponseDTO
- ClinicaDermatologicaApplication.java
- AntecedentePatologicoRequestDTO
- vite-env.d.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 55 edges
2. `MedicalRecordService` - 35 edges
3. `User` - 31 edges
4. `ClinicalEntry` - 28 edges
5. `AppointmentService` - 27 edges
6. `PaymentTransaction` - 26 edges
7. `UserDAO` - 26 edges
8. `MedicalRecord` - 25 edges
9. `Appointment` - 24 edges
10. `MedicalRecordController` - 23 edges

## Surprising Connections (you probably didn't know these)
- `AnalyticsDashboardView()` --calls--> `cn()`  [EXTRACTED]
  frontend/src/features/analytics/AnalyticsDashboardView.tsx → frontend/src/utils/cn.ts
- `ReadRow()` --calls--> `cn()`  [EXTRACTED]
  frontend/src/features/clinical/AnamnesisForm.tsx → frontend/src/utils/cn.ts
- `MedicalRecordView()` --calls--> `isMedicalStaff()`  [EXTRACTED]
  frontend/src/features/clinical/MedicalRecordView.tsx → frontend/src/utils/session.ts
- `AnalyticsService` --references--> `AppointmentDAO`  [EXTRACTED]
  backend/src/main/java/com/clinicadermatologica/app/application/service/AnalyticsService.java → backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/dao/AppointmentDAO.java
- `AnalyticsService` --references--> `PaymentTransactionDAO`  [EXTRACTED]
  backend/src/main/java/com/clinicadermatologica/app/application/service/AnalyticsService.java → backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/dao/PaymentTransactionDAO.java

## Import Cycles
- None detected.

## Communities (69 total, 6 thin omitted)

### Community 0 - "SecurityConfig.java"
Cohesion: 0.05
Nodes (41): abstracthttpconfigurer, arraylist, arrays, MercadoPagoConfigBean, AesEncryptionService, SecurityConfig, base64, bcryptpasswordencoder (+33 more)

### Community 1 - "Alergia"
Cohesion: 0.06
Nodes (33): Alergia, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+25 more)

### Community 2 - "api.ts"
Cohesion: 0.05
Nodes (47): AnalyticsDashboardView, GeminiChatbotWidget(), AnalyticsDashboardView(), ALERGIAS, AnamnesisForm(), AnamnesisFormProps, FITZ, PATOLOGIAS (+39 more)

### Community 4 - "AnalyticsKpisResponseDTO"
Cohesion: 0.27
Nodes (14): AnalyticsService, AiAssistantKpis, AnalyticsKpisResponseDTO, FinancialKpis, OperationalKpis, TreatmentRankingDTO, com.fasterxml.jackson.annotation.JsonIgnore, com.fasterxml.jackson.annotation.JsonIgnoreProperties (+6 more)

### Community 5 - "MedicalRecordService"
Cohesion: 0.11
Nodes (21): AuthService, ClinicalImageService, MedicalRecordService, ClinicalEntryRepository, EmailNotificationService, MercadoPagoPaymentAdapter, SupabaseStorageAdapter, chronounit (+13 more)

### Community 6 - "PatientResponseDTO"
Cohesion: 0.10
Nodes (20): PatientService, DeleteMapping, GetMapping, PostMapping, PutMapping, RequestMapping, RestController, PatientController (+12 more)

### Community 7 - "MedicalRecordView.tsx"
Cohesion: 0.09
Nodes (29): RFC-7807, PatientDirectoryView, frontend_src_components_ui_index_badge, frontend_src_components_ui_index_card, toast, Toaster(), PatientSearch(), PatientSearchProps (+21 more)

### Community 8 - "AdminServicesView.tsx"
Cohesion: 0.08
Nodes (39): Callout(), frontend_src_components_ui_index_callout, frontend_src_components_ui_index_modal, frontend_src_components_ui_index_select, Modal(), Select, AdminServicesView(), AdminTab (+31 more)

### Community 9 - "AntecedentePatologico"
Cohesion: 0.18
Nodes (10): AntecedentePatologico, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+2 more)

### Community 10 - "cn"
Cohesion: 0.07
Nodes (38): EditAppointmentView, Badge, BadgeProps, BadgeSize, BadgeVariant, dotStyles, sizeStyles, variantStyles (+30 more)

### Community 11 - "ClinicalImageService.java"
Cohesion: 0.26
Nodes (4): DermatologicServiceService, BusinessRuleException, ResourceNotFoundException, collectors

### Community 12 - "org.springframework.http.ResponseEntity"
Cohesion: 0.29
Nodes (7): AppointmentController, GetMapping, PostMapping, RequestMapping, RestController, org.springframework.http.ResponseEntity, org.springframework.security.access.prepost.PreAuthorize

### Community 13 - "MercadoPagoPaymentAdapter.java"
Cohesion: 0.07
Nodes (22): PaymentGatewayException, HoldPolicy, BookAppointmentRequestDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter (+14 more)

### Community 14 - "V4__schema_redesign.sql"
Cohesion: 0.13
Nodes (32): alergia, antecedente_patologico, bloqueo_calendario, cita, entrada_hc, entrada_hc_audit, habito, historia_clinica (+24 more)

### Community 15 - "BookingWizard.tsx"
Cohesion: 0.10
Nodes (33): frontend_src_components_reactbits_index_glideselect, frontend_src_components_reactbits_index_stepper, ars(), BookingWizard(), formatCountdown(), formatDateTime(), Hold, Outcome (+25 more)

### Community 16 - "ServiceResponseDTO"
Cohesion: 0.10
Nodes (18): GetMapping, PostMapping, PutMapping, RequestMapping, RestController, ServiceCatalogController, AllArgsConstructor, Builder (+10 more)

### Community 18 - "AuthController"
Cohesion: 0.18
Nodes (10): AuthController, PostMapping, RequestMapping, RestController, ForgotPasswordRequestDTO, AllArgsConstructor, Builder, Getter (+2 more)

### Community 19 - "ClinicalEntry"
Cohesion: 0.16
Nodes (11): ClinicalEntry, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+3 more)

### Community 20 - "AgendaView.tsx"
Cohesion: 0.17
Nodes (27): addDays(), AgendaView(), AppointmentDetail(), ApptChip, ars(), computeRange(), ConfirmState, dayKey() (+19 more)

### Community 21 - "App.tsx"
Cohesion: 0.07
Nodes (37): RFC-5322, AdminServicesView, AgendaView, BookingWizard, MedicalRecordView, PageTransition(), PageTransitionProps, RoleGuardProps (+29 more)

### Community 22 - "MedicalRecordController"
Cohesion: 0.19
Nodes (6): DeleteMapping, GetMapping, PostMapping, RequestMapping, RestController, MedicalRecordController

### Community 23 - "UserDAO"
Cohesion: 0.11
Nodes (17): User, UserService, UserDAO, GetMapping, PutMapping, RequestMapping, RestController, UserController (+9 more)

### Community 24 - "lombok"
Cohesion: 0.18
Nodes (5): creationtimestamp, instant, lombok, persistence, updatetimestamp

### Community 25 - "AnalyticsService.java"
Cohesion: 0.08
Nodes (23): appointmentstatus, AppointmentStatus, ATTENDED, CANCELED, COMPLETED, CONFIRMED, NO_SHOW, PAYMENT_FAILED (+15 more)

### Community 26 - "CalendarBlockResponseDTO"
Cohesion: 0.10
Nodes (19): CalendarBlockService, CalendarBlockController, DeleteMapping, GetMapping, PostMapping, RequestMapping, RestController, CalendarBlockRequestDTO (+11 more)

### Community 27 - "ClinicalImageResponseDTO"
Cohesion: 0.18
Nodes (7): ClinicalImageResponseDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter, org.springframework.web.multipart.MultipartFile

### Community 28 - "org.springframework.transaction.annotation.Transactional"
Cohesion: 0.11
Nodes (12): AppointmentService, Appointment, Appointment, User, PaymentService, HoldExpirationScheduler, PostMapping, RequestMapping (+4 more)

### Community 29 - "ClinicalImage"
Cohesion: 0.15
Nodes (12): ClinicalImage, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+4 more)

### Community 30 - "User"
Cohesion: 0.14
Nodes (13): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, User (+5 more)

### Community 31 - "MedicalRecordDTO"
Cohesion: 0.14
Nodes (8): MedicalRecord, MedicalRecordRepository, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter, MedicalRecordDTO

### Community 32 - "lombok.RequiredArgsConstructor"
Cohesion: 0.15
Nodes (19): annotation, GeminiChatbotService, DelegatedAccessDeniedHandler, DelegatedAuthenticationEntryPoint, GeminiChatbotController, RequestMapping, RestController, com.fasterxml.jackson.databind.ObjectMapper (+11 more)

### Community 33 - "PasswordResetToken"
Cohesion: 0.16
Nodes (12): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, PasswordResetToken (+4 more)

### Community 34 - "UserRole"
Cohesion: 0.09
Nodes (22): UserRole, ADMIN, DOCTORA, SECRETARIA, AuthResponseDTO, AllArgsConstructor, Builder, Getter (+14 more)

### Community 35 - "org.springframework.data.jpa.repository.JpaRepository"
Cohesion: 0.31
Nodes (7): JpaAlergiaRepository, JpaAntecedentePatologicoRepository, JpaHabitoRepository, JpaMedicalRecordRepository, org.springframework.data.jpa.repository.JpaRepository, org.springframework.stereotype.Repository, param

### Community 36 - "Patient"
Cohesion: 0.14
Nodes (9): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, Patient (+1 more)

### Community 37 - "GeminiChatRequestDTO"
Cohesion: 0.11
Nodes (17): GeminiApiClientAdapter, PostMapping, ChatMessageItemDTO, GeminiChatRequestDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor (+9 more)

### Community 38 - "jakarta.servlet.http.HttpServletRequest"
Cohesion: 0.07
Nodes (28): DuplicateResourceException, SlotUnavailableException, UnauthorizedAccessException, Override, Override, Override, JwtAuthenticationFilter, JwtTokenProvider (+20 more)

### Community 39 - "DashboardLayout.tsx"
Cohesion: 0.14
Nodes (21): BottomNav(), BottomNavProps, ICONS, DashboardLayout(), pathToTab(), roleLanding, tabToPath(), ICONS (+13 more)

### Community 40 - "Habito"
Cohesion: 0.07
Nodes (29): Habito, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+21 more)

### Community 41 - "SystemStatusController.java"
Cohesion: 0.19
Nodes (10): ConexionBD, AnalyticsController, SystemStatusController, drivermanager, hashmap, java.sql.Connection, org.springframework.web.bind.annotation.GetMapping, org.springframework.web.bind.annotation.RequestMapping (+2 more)

### Community 42 - "PaymentType"
Cohesion: 0.10
Nodes (20): PaymentType, BANK_TRANSFER, CASH, MERCADOPAGO, FinalizePaymentRequestDTO, AllArgsConstructor, Builder, Getter (+12 more)

### Community 43 - "PaymentTransaction"
Cohesion: 0.05
Nodes (31): Appointment, PaymentConcept, User, PaymentStatus, APPROVED, PENDING, REFUNDED, REJECTED (+23 more)

### Community 44 - "list"
Cohesion: 0.15
Nodes (11): PaymentType, PaymentRegistrationStrategy, PaymentStrategyFactory, BankTransferPaymentStrategy, CashPaymentStrategy, MercadoPagoPaymentStrategy, PaymentTransactionDAO, list (+3 more)

### Community 45 - "MedicalRecord"
Cohesion: 0.18
Nodes (10): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, MedicalRecord (+2 more)

### Community 46 - "V1__initial_schema.sql"
Cohesion: 0.25
Nodes (17): bloqueo_calendario, cita, entrada_hc, historia_clinica, idx_cita_hold_deadline, idx_cita_paciente, idx_cita_range, idx_cita_status (+9 more)

### Community 47 - "AppointmentResponseDTO"
Cohesion: 0.12
Nodes (12): AppointmentResponseDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter, AllArgsConstructor, Builder (+4 more)

### Community 48 - "Clínica Dermatológica y Estética — Sistema de Gestión de Turnos e Historias Clínicas"
Cohesion: 0.12
Nodes (15): Arquitectura en capas, Clínica Dermatológica y Estética — Sistema de Gestión de Turnos e Historias Clínicas, Cómo ejecutarlo, Estructura del repositorio, Integración continua, Nota sobre el acceso a datos (DAO), Opción A — Docker Compose (todo en contenedores), Opción B — Ejecución manual (+7 more)

### Community 49 - "Appointment"
Cohesion: 0.22
Nodes (10): Appointment, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+2 more)

### Community 50 - "AntecedentePatologicoId"
Cohesion: 0.22
Nodes (7): AntecedentePatologicoId, AllArgsConstructor, Getter, NoArgsConstructor, Override, Setter, AntecedentePatologicoRepository

### Community 51 - "LandingPageView.tsx"
Cohesion: 0.09
Nodes (21): App(), ErrorBoundary, ErrorBoundaryProps, State, HumanFriendlyErrorFallback(), HumanFriendlyErrorFallbackProps, frontend_src_components_reactbits_index_aurora, frontend_src_components_reactbits_index_blurtext (+13 more)

### Community 52 - "CalendarBlock"
Cohesion: 0.21
Nodes (9): CalendarBlock, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+1 more)

### Community 53 - "ClinicalEntryAudit"
Cohesion: 0.20
Nodes (9): ClinicalEntryAudit, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+1 more)

### Community 54 - "DermatologicService"
Cohesion: 0.21
Nodes (9): DermatologicService, AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table (+1 more)

### Community 55 - "V2__audit_triggers_and_tables.sql"
Cohesion: 0.27
Nodes (11): entrada_hc_audit, historia_clinica_audit, idx_entrada_audit_date, idx_entrada_audit_entry, idx_entrada_audit_user, idx_hc_audit_date, idx_hc_audit_record, idx_hc_audit_user (+3 more)

### Community 56 - "MedicalRecordAudit"
Cohesion: 0.22
Nodes (9): AllArgsConstructor, Builder, Entity, Getter, NoArgsConstructor, Setter, Table, MedicalRecordAudit (+1 more)

### Community 57 - ".addAntecedentePatologico"
Cohesion: 0.25
Nodes (6): AntecedentePatologicoResponseDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter

### Community 58 - "notblank"
Cohesion: 0.11
Nodes (15): AuthRequestDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter, AllArgsConstructor, Builder (+7 more)

### Community 61 - "GlideSelect.tsx"
Cohesion: 0.05
Nodes (33): Aurora(), AuroraProps, AnimateBy, BlurText(), BlurTextProps, buildKeyframes(), Direction, DEFAULT_OPTIONS (+25 more)

### Community 67 - "ClinicalEntryResponseDTO"
Cohesion: 0.11
Nodes (14): ClinicalEntry, PutMapping, ClinicalEntryRequestDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter (+6 more)

### Community 70 - "ClinicaDermatologicaApplication.java"
Cohesion: 0.47
Nodes (4): ClinicaDermatologicaApplication, org.springframework.boot.autoconfigure.SpringBootApplication, org.springframework.scheduling.annotation.EnableScheduling, springapplication

### Community 71 - "AntecedentePatologicoRequestDTO"
Cohesion: 0.33
Nodes (6): AntecedentePatologicoRequestDTO, AllArgsConstructor, Builder, Getter, NoArgsConstructor, Setter

## Knowledge Gaps
- **136 isolated node(s):** `PENDING_PAYMENT`, `CONFIRMED`, `ATTENDED`, `CANCELED`, `COMPLETED` (+131 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 587 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `SecurityConfig.java`, `PasswordResetToken`, `UserRole`, `org.springframework.data.jpa.repository.JpaRepository`, `lombok.RequiredArgsConstructor`, `MedicalRecordService`, `jakarta.servlet.http.HttpServletRequest`, `ClinicalImageService.java`, `PaymentTransaction`, `MedicalRecord`, `Appointment`, `ClinicalEntry`, `CalendarBlock`, `ClinicalEntryAudit`, `UserDAO`, `MedicalRecordAudit`, `lombok`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `MedicalRecordService` connect `MedicalRecordService` to `SecurityConfig.java`, `Alergia`, `lombok.RequiredArgsConstructor`, `ClinicalEntryResponseDTO`, `Patient`, `Habito`, `Appointment`, `AntecedentePatologicoId`, `MedicalRecordController`, `UserDAO`, `.addAntecedentePatologico`, `MedicalRecordDTO`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `Appointment` connect `Appointment` to `AnalyticsKpisResponseDTO`, `Patient`, `PaymentTransaction`, `MercadoPagoPaymentAdapter.java`, `AppointmentResponseDTO`, `ClinicalEntry`, `DermatologicService`, `lombok`, `AnalyticsService.java`, `User`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `PENDING_PAYMENT`, `CONFIRMED`, `ATTENDED` to the rest of the system?**
  _136 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `SecurityConfig.java` be split into smaller, more focused modules?**
  _Cohesion score 0.05241090146750524 - nodes in this community are weakly interconnected._
- **Should `Alergia` be split into smaller, more focused modules?**
  _Cohesion score 0.0602322206095791 - nodes in this community are weakly interconnected._
- **Should `api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04918032786885246 - nodes in this community are weakly interconnected._