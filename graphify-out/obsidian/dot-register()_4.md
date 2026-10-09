---
source_file: "backend/src/main/java/com/clinicadermatologica/app/application/strategy/PaymentRegistrationStrategy.java"
type: "code"
community: ".register"
location: "L41"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/register
---

# .register()

## Connections
- [[dot-testRegisterDeposit_Cash_ConfirmsAppointment()]] - `calls` [INFERRED]
- [[dot-testRegisterFinalPayment_DelegatesToStrategy_CompletesAppointment()]] - `calls` [INFERRED]
- [[Appointment_8]] - `references` [EXTRACTED]
- [[PaymentConcept_5]] - `references` [EXTRACTED]
- [[PaymentRegistrationStrategy]] - `method` [EXTRACTED]
- [[PaymentTransaction]] - `references` [EXTRACTED]
- [[User]] - `references` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/register