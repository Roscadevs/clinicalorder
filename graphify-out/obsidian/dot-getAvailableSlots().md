---
source_file: "backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java"
type: "code"
community: "AppointmentService"
location: "L41"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/AppointmentService
---

# .getAvailableSlots()

## Connections
- [[dot-findByDateRange()_4]] - `calls` [INFERRED]
- [[dot-findByDateRange()_5]] - `calls` [INFERRED]
- [[dot-findById()_11]] - `calls` [INFERRED]
- [[dot-getAvailableSlots()_1]] - `calls` [INFERRED]
- [[dot-isExpired()]] - `calls` [EXTRACTED]
- [[dot-testGetAvailableSlots()]] - `calls` [INFERRED]
- [[AppointmentService]] - `method` [EXTRACTED]
- [[TimeSlotDTO]] - `references` [EXTRACTED]
- [[org.springframework.transaction.annotation.Transactional]] - `references` [EXTRACTED]

#graphify/code #graphify/INFERRED #community/AppointmentService