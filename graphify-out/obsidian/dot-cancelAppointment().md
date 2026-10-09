---
source_file: "backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java"
type: "code"
community: "AppointmentService"
location: "L211"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/AppointmentService
---

# .cancelAppointment()

## Connections
- [[dot-cancelAppointment()_1]] - `calls` [INFERRED]
- [[dot-findByAppointmentId()_1]] - `calls` [INFERRED]
- [[dot-findById()_12]] - `calls` [INFERRED]
- [[dot-rejectPendingTransactions()_1]] - `calls` [EXTRACTED]
- [[dot-save()_6]] - `calls` [INFERRED]
- [[dot-testCancelAppointment_WithApprovedMercadoPagoPayment_TriggersRefund()]] - `calls` [INFERRED]
- [[AppointmentService]] - `method` [EXTRACTED]
- [[org.springframework.transaction.annotation.Transactional]] - `references` [EXTRACTED]

#graphify/code #graphify/INFERRED #community/AppointmentService