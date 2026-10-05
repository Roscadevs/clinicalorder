---
source_file: "backend/src/main/java/com/clinicadermatologica/app/domain/repository/PaymentTransactionRepository.java"
type: "code"
community: "org.springframework.stereotype.Component"
location: "L15"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/orgspringframeworkstereotypeComponent
---

# .findByAppointmentId()

## Connections
- [[dot-rejectPendingTransactions()_1]] - `calls` [INFERRED]
- [[dot-rejectPendingTransactions()]] - `calls` [INFERRED]
- [[dot-testRegisterDeposit_Cash_ConfirmsAppointment()]] - `calls` [INFERRED]
- [[dot-testReleaseExpiredHolds_CancelsAndRejectsPendingPayment()]] - `calls` [INFERRED]
- [[PaymentTransaction]] - `references` [EXTRACTED]
- [[PaymentTransactionRepository]] - `method` [EXTRACTED]

#graphify/code #graphify/INFERRED #community/orgspringframeworkstereotypeComponent