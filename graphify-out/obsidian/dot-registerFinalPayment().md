---
source_file: "backend/src/main/java/com/clinicadermatologica/app/application/service/PaymentService.java"
type: "code"
community: ".bookTemporaryHold"
location: "L410"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/bookTemporaryHold
---

# .registerFinalPayment()

## Connections
- [[dot-finalizePayment()]] - `calls` [INFERRED]
- [[dot-findById()_12]] - `calls` [INFERRED]
- [[dot-findById()_8]] - `calls` [INFERRED]
- [[dot-getStrategy()]] - `calls` [INFERRED]
- [[dot-save()_6]] - `calls` [INFERRED]
- [[dot-testRegisterFinalPayment_DelegatesToStrategy_CompletesAppointment()]] - `calls` [INFERRED]
- [[dot-testRegisterFinalPayment_NotAttended_ThrowsException()]] - `calls` [INFERRED]
- [[BusinessRuleException]] - `calls` [EXTRACTED]
- [[FinalizePaymentRequestDTO]] - `references` [EXTRACTED]
- [[PaymentService]] - `method` [EXTRACTED]
- [[org.springframework.transaction.annotation.Transactional]] - `references` [EXTRACTED]

#graphify/code #graphify/INFERRED #community/bookTemporaryHold