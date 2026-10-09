---
source_file: "backend/src/main/java/com/clinicadermatologica/app/domain/repository/PaymentTransactionRepository.java"
type: "code"
community: "AppointmentService"
location: "L15"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/AppointmentService
---

# .findByAppointmentId()

## Connections
- [[dot-cancelAppointment()]] - `calls` [INFERRED]
- [[dot-processMercadoPagoWebhook()]] - `calls` [INFERRED]
- [[dot-rejectPendingTransactions()]] - `calls` [INFERRED]
- [[dot-rejectPendingTransactions()_1]] - `calls` [INFERRED]
- [[dot-testCancelAppointment_WithApprovedMercadoPagoPayment_TriggersRefund()]] - `calls` [INFERRED]
- [[dot-testRegisterDeposit_Cash_ConfirmsAppointment()]] - `calls` [INFERRED]
- [[dot-testReleaseExpiredHolds_CancelsAndRejectsPendingPayment()]] - `calls` [INFERRED]
- [[PaymentTransaction]] - `references` [EXTRACTED]
- [[PaymentTransactionRepository]] - `method` [EXTRACTED]

#graphify/code #graphify/INFERRED #community/AppointmentService