---
source_file: "backend/src/main/java/com/clinicadermatologica/app/application/service/PaymentService.java"
type: "code"
community: ".registerDepositPayment"
location: "L327"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/registerDepositPayment
---

# .registerDepositPayment()

## Connections
- [[dot-findById()_13]] - `calls` [INFERRED]
- [[dot-findById()_12]] - `calls` [INFERRED]
- [[dot-getStrategy()]] - `calls` [INFERRED]
- [[dot-isExpired()]] - `calls` [EXTRACTED]
- [[dot-registerDepositPayment()]] - `calls` [INFERRED]
- [[dot-rejectPendingTransactions()_1]] - `calls` [EXTRACTED]
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

#graphify/code #graphify/INFERRED #community/registerDepositPayment