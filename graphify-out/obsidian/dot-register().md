---
source_file: "backend/src/main/java/com/clinicadermatologica/app/application/strategy/PaymentRegistrationStrategy.java"
type: "code"
community: "PaymentTransaction"
location: "L41"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/PaymentTransaction
---

# .register()

## Connections
- [[dot-testRegisterDeposit_Cash_ConfirmsAppointment()]] - `calls` [INFERRED]
- [[dot-testRegisterFinalPayment_DelegatesToStrategy_CompletesAppointment()]] - `calls` [INFERRED]
- [[Appointment_2]] - `references` [EXTRACTED]
- [[PaymentConcept_2]] - `references` [EXTRACTED]
- [[PaymentRegistrationStrategy]] - `method` [EXTRACTED]
- [[PaymentTransaction]] - `references` [EXTRACTED]
- [[User]] - `references` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/PaymentTransaction