---
source_file: "backend/src/main/java/com/clinicadermatologica/app/application/service/PaymentService.java"
type: "code"
community: "AppointmentService"
location: "L402"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/AppointmentService
---

# .rejectPendingTransactions()

## Connections
- [[dot-findByAppointmentId()_2]] - `calls` [INFERRED]
- [[dot-registerDepositPayment()]] - `calls` [EXTRACTED]
- [[dot-save()_11]] - `calls` [INFERRED]
- [[Appointment_8]] - `references` [EXTRACTED]
- [[PaymentService]] - `method` [EXTRACTED]
- [[PaymentTransaction]] - `references` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/AppointmentService