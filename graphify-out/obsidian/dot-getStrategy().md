---
source_file: "backend/src/main/java/com/clinicadermatologica/app/application/strategy/PaymentStrategyFactory.java"
type: "code"
community: "PaymentServiceTest.java"
location: "L47"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/PaymentServiceTestjava
---

# .getStrategy()

## Connections
- [[dot-registerDepositPayment()_1]] - `calls` [INFERRED]
- [[dot-registerFinalPayment()]] - `calls` [INFERRED]
- [[dot-testRegisterDeposit_Cash_ConfirmsAppointment()]] - `calls` [INFERRED]
- [[dot-testRegisterFinalPayment_DelegatesToStrategy_CompletesAppointment()]] - `calls` [INFERRED]
- [[dot-testStrategyFactory_ReturnsCorrectStrategy()]] - `calls` [INFERRED]
- [[dot-testStrategyFactory_UnknownType_ThrowsException()]] - `calls` [INFERRED]
- [[PaymentRegistrationStrategy]] - `references` [EXTRACTED]
- [[PaymentStrategyFactory]] - `method` [EXTRACTED]
- [[PaymentType]] - `references` [EXTRACTED]

#graphify/code #graphify/INFERRED #community/PaymentServiceTestjava