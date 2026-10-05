---
source_file: "backend/src/main/java/com/clinicadermatologica/app/application/service/PaymentService.java"
type: "code"
community: "org.junit.jupiter.api.DisplayName"
location: "L255"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/orgjunitjupiterapiDisplayName
---

# .registerDepositPayment()

## Connections
- [[dot-findById()_8]] - `calls` [INFERRED]
- [[dot-findById()_7]] - `calls` [INFERRED]
- [[dot-getStrategy()]] - `calls` [INFERRED]
- [[dot-isExpired()]] - `calls` [EXTRACTED]
- [[dot-registerDepositPayment()_1]] - `calls` [INFERRED]
- [[dot-rejectPendingTransactions()]] - `calls` [EXTRACTED]
- [[dot-save()_10]] - `calls` [INFERRED]
- [[dot-testRegisterDeposit_AmountBelowDeposit_Throws()]] - `calls` [INFERRED]
- [[dot-testRegisterDeposit_Cash_ConfirmsAppointment()]] - `calls` [INFERRED]
- [[dot-testRegisterDeposit_ExpiredHold_CancelsAppointment()]] - `calls` [INFERRED]
- [[dot-testRegisterDeposit_MercadoPago_Throws()]] - `calls` [INFERRED]
- [[BusinessRuleException]] - `calls` [EXTRACTED]
- [[PaymentReceiptDTO]] - `references` [EXTRACTED]
- [[PaymentService]] - `method` [EXTRACTED]
- [[RegisterPaymentRequestDTO]] - `references` [EXTRACTED]
- [[org.springframework.transaction.annotation.Transactional]] - `references` [EXTRACTED]

#graphify/code #graphify/INFERRED #community/orgjunitjupiterapiDisplayName