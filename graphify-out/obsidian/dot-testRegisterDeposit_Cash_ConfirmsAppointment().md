---
source_file: "backend/src/test/java/com/clinicadermatologica/app/application/PaymentServiceTest.java"
type: "code"
community: ".registerDepositPayment"
location: "L380"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/registerDepositPayment
---

# .testRegisterDeposit_Cash_ConfirmsAppointment()

## Connections
- [[dot-cash()]] - `calls` [EXTRACTED]
- [[dot-findByAppointmentId()_1]] - `calls` [INFERRED]
- [[dot-findById()_12]] - `calls` [INFERRED]
- [[dot-getStrategy()]] - `calls` [INFERRED]
- [[dot-prepareHold()]] - `calls` [EXTRACTED]
- [[dot-register()_4]] - `calls` [INFERRED]
- [[dot-registerDepositPayment()_1]] - `calls` [INFERRED]
- [[PaymentServiceTest]] - `method` [EXTRACTED]
- [[org.junit.jupiter.api.DisplayName]] - `references` [EXTRACTED]
- [[org.junit.jupiter.api.Test]] - `references` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/registerDepositPayment