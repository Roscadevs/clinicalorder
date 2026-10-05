---
source_file: "backend/src/main/java/com/clinicadermatologica/app/domain/repository/AppointmentRepository.java"
type: "code"
community: "AppointmentService"
location: "L19"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/AppointmentService
---

# .findOverlappingAppointments()

## Connections
- [[dot-bookTemporaryHold()]] - `calls` [INFERRED]
- [[dot-testBookTemporaryHold_ExpiredOverlappingHold_IsReleased()]] - `calls` [INFERRED]
- [[dot-testBookTemporaryHold_SlotUnavailable_ThrowsException()]] - `calls` [INFERRED]
- [[dot-testBookTemporaryHold_Success()]] - `calls` [INFERRED]
- [[Appointment]] - `references` [EXTRACTED]
- [[AppointmentRepository]] - `method` [EXTRACTED]

#graphify/code #graphify/INFERRED #community/AppointmentService