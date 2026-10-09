---
source_file: "backend/src/main/java/com/clinicadermatologica/app/infrastructure/payment/MercadoPagoPaymentAdapter.java"
type: "code"
community: "AppointmentService"
location: "L46"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/AppointmentService
---

# .createDepositPreference()

## Connections
- [[dot-bookTemporaryHold()]] - `calls` [INFERRED]
- [[dot-createDepositPreference()]] - `calls` [EXTRACTED]
- [[dot-testBookTemporaryHold_ExpiredOverlappingHold_IsReleased()]] - `calls` [INFERRED]
- [[dot-testBookTemporaryHold_Success()]] - `calls` [INFERRED]
- [[MercadoPagoPaymentAdapter]] - `method` [EXTRACTED]
- [[PaymentGatewayException]] - `calls` [EXTRACTED]
- [[com.mercadopago.resources.preference.Preference]] - `references` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/AppointmentService