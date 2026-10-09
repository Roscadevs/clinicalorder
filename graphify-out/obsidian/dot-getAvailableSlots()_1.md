---
source_file: "backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java"
type: "code"
community: ".getAvailableSlots"
location: "L42"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/getAvailableSlots
---

# .getAvailableSlots()

## Connections
- [[dot-findByDateRange()_4]] - `calls` [INFERRED]
- [[dot-findByDateRange()_5]] - `calls` [INFERRED]
- [[dot-findById()_10]] - `calls` [INFERRED]
- [[dot-getAvailableSlots()]] - `calls` [INFERRED]
- [[dot-isExpired()]] - `calls` [EXTRACTED]
- [[dot-testGetAvailableSlots()]] - `calls` [INFERRED]
- [[AppointmentService]] - `method` [EXTRACTED]
- [[TimeSlotDTO]] - `references` [EXTRACTED]
- [[org.springframework.transaction.annotation.Transactional]] - `references` [EXTRACTED]

#graphify/code #graphify/INFERRED #community/getAvailableSlots