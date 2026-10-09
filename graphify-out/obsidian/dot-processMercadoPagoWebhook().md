---
source_file: "backend/src/main/java/com/clinicadermatologica/app/application/service/PaymentService.java"
type: "code"
community: "org.junit.jupiter.api.DisplayName"
location: "L53"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/orgjunitjupiterapiDisplayName
---

# .processMercadoPagoWebhook()

## Connections
- [[dot-findByAppointmentId()_1]] - `calls` [INFERRED]
- [[dot-findByMpPreferenceId()_2]] - `calls` [INFERRED]
- [[dot-getPaymentDetails()]] - `calls` [INFERRED]
- [[dot-handleMercadoPagoWebhook()]] - `calls` [INFERRED]
- [[dot-isValidSignature()]] - `calls` [EXTRACTED]
- [[dot-processMercadoPagoWebhook()]] - `calls` [EXTRACTED]
- [[dot-save()_7]] - `calls` [INFERRED]
- [[dot-save()_6]] - `calls` [INFERRED]
- [[dot-testWebhook_AlreadyApproved_IsIdempotent()]] - `calls` [INFERRED]
- [[dot-testWebhook_Approved_Deposit_ConfirmsAppointment()]] - `calls` [INFERRED]
- [[dot-testWebhook_Approved_Full_ConfirmsAppointment()]] - `calls` [INFERRED]
- [[dot-testWebhook_InProcess_MaintainsPendingAppointment()]] - `calls` [INFERRED]
- [[dot-testWebhook_QueryParams_Approved()]] - `calls` [INFERRED]
- [[dot-testWebhook_Rejected_MarksPaymentFailed()]] - `calls` [INFERRED]
- [[PaymentService]] - `method` [EXTRACTED]
- [[org.springframework.transaction.annotation.Transactional]] - `references` [EXTRACTED]

#graphify/code #graphify/INFERRED #community/orgjunitjupiterapiDisplayName