---
source_file: "backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java"
type: "code"
community: ".registerDepositPayment"
location: "L366"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/registerDepositPayment
---

# .prepareHold()

## Connections
- [[dot-findById()_13]] - `calls` [INFERRED]
- [[dot-testRegisterDeposit_AmountBelowDeposit_Throws()]] - `calls` [EXTRACTED]
- [[dot-testRegisterDeposit_Cash_ConfirmsAppointment()]] - `calls` [EXTRACTED]
- [[dot-testRegisterDeposit_ExpiredHold_CancelsAppointment()]] - `calls` [EXTRACTED]
- [[dot-testRegisterDeposit_MercadoPago_Throws()]] - `calls` [EXTRACTED]
- [[PaymentServiceTest]] - `method` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/registerDepositPayment