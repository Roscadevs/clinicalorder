---
source_file: "backend/src/main/java/com/clinicadermatologica/app/application/service/AppointmentService.java"
type: "code"
community: ".bookTemporaryHold"
location: "L117"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/bookTemporaryHold
---

# .bookTemporaryHold()

## Connections
- [[dot-bookTemporaryHold()_1]] - `calls` [INFERRED]
- [[dot-createDepositPreference()]] - `calls` [INFERRED]
- [[dot-expireHold()]] - `calls` [EXTRACTED]
- [[dot-expiresAt()]] - `calls` [EXTRACTED]
- [[dot-findById()_7]] - `calls` [INFERRED]
- [[dot-findById()_6]] - `calls` [INFERRED]
- [[dot-findById()_8]] - `calls` [INFERRED]
- [[dot-findOverlappingAppointments()_1]] - `calls` [INFERRED]
- [[dot-findOverlappingBlocks()_2]] - `calls` [INFERRED]
- [[dot-isExpired()]] - `calls` [EXTRACTED]
- [[dot-resolveInitPoint()]] - `calls` [INFERRED]
- [[dot-save()_6]] - `calls` [INFERRED]
- [[dot-save()_7]] - `calls` [INFERRED]
- [[dot-testBookTemporaryHold_ExpiredOverlappingHold_IsReleased()]] - `calls` [INFERRED]
- [[dot-testBookTemporaryHold_SlotUnavailable_ThrowsException()]] - `calls` [INFERRED]
- [[dot-testBookTemporaryHold_Success()]] - `calls` [INFERRED]
- [[AppointmentService]] - `method` [EXTRACTED]
- [[BookAppointmentRequestDTO]] - `references` [EXTRACTED]
- [[PaymentPreferenceResponseDTO]] - `references` [EXTRACTED]
- [[org.springframework.transaction.annotation.Transactional]] - `references` [EXTRACTED]

#graphify/code #graphify/INFERRED #community/bookTemporaryHold