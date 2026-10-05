---
source_file: "backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java"
type: "code"
community: "AppointmentService"
location: "L116"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/AppointmentService
---

# .bookTemporaryHold()

## Connections
- [[dot-bookTemporaryHold()_1]] - `calls` [INFERRED]
- [[dot-createDepositPreference()]] - `calls` [INFERRED]
- [[dot-expireHold()]] - `calls` [EXTRACTED]
- [[dot-expiresAt()]] - `calls` [EXTRACTED]
- [[dot-findById()_13]] - `calls` [INFERRED]
- [[dot-findById()_12]] - `calls` [INFERRED]
- [[dot-findById()_7]] - `calls` [INFERRED]
- [[dot-findOverlappingAppointments()_1]] - `calls` [INFERRED]
- [[dot-findOverlappingBlocks()_2]] - `calls` [INFERRED]
- [[dot-isExpired()]] - `calls` [EXTRACTED]
- [[dot-save()_10]] - `calls` [INFERRED]
- [[dot-save()]] - `calls` [INFERRED]
- [[dot-testBookTemporaryHold_ExpiredOverlappingHold_IsReleased()]] - `calls` [INFERRED]
- [[dot-testBookTemporaryHold_SlotUnavailable_ThrowsException()]] - `calls` [INFERRED]
- [[dot-testBookTemporaryHold_Success()]] - `calls` [INFERRED]
- [[AppointmentService]] - `method` [EXTRACTED]
- [[BookAppointmentRequestDTO]] - `references` [EXTRACTED]
- [[PaymentPreferenceResponseDTO]] - `references` [EXTRACTED]
- [[org.springframework.transaction.annotation.Transactional]] - `references` [EXTRACTED]

#graphify/code #graphify/INFERRED #community/AppointmentService