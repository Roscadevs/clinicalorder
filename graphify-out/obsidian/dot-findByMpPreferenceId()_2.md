---
source_file: "backend/src/main/java/com/clinicadermatologica/app/domain/repository/PaymentTransactionRepository.java"
type: "code"
community: "PaymentServiceTest"
location: "L14"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/PaymentServiceTest
---

# .findByMpPreferenceId()

## Connections
- [[dot-processMercadoPagoWebhook()]] - `calls` [INFERRED]
- [[dot-testWebhook_AlreadyApproved_IsIdempotent()]] - `calls` [INFERRED]
- [[dot-testWebhook_Approved_Deposit_ConfirmsAppointment()]] - `calls` [INFERRED]
- [[dot-testWebhook_Approved_Full_ConfirmsAppointment()]] - `calls` [INFERRED]
- [[dot-testWebhook_InProcess_MaintainsPendingAppointment()]] - `calls` [INFERRED]
- [[dot-testWebhook_QueryParams_Approved()]] - `calls` [INFERRED]
- [[dot-testWebhook_Rejected_MarksPaymentFailed()]] - `calls` [INFERRED]
- [[PaymentTransaction]] - `references` [EXTRACTED]
- [[PaymentTransactionRepository]] - `method` [EXTRACTED]

#graphify/code #graphify/INFERRED #community/PaymentServiceTest