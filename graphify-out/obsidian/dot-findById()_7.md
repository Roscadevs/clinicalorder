---
source_file: "backend/src/main/java/com/clinicadermatologica/app/domain/repository/PatientRepository.java"
type: "code"
community: ".bookTemporaryHold"
location: "L12"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/bookTemporaryHold
---

# .findById()

## Connections
- [[dot-bookTemporaryHold()]] - `calls` [INFERRED]
- [[dot-deactivatePatient()]] - `calls` [INFERRED]
- [[dot-getPatientById()]] - `calls` [INFERRED]
- [[dot-saveOrUpdateMedicalRecord()]] - `calls` [INFERRED]
- [[dot-testBookTemporaryHold_ExpiredOverlappingHold_IsReleased()]] - `calls` [INFERRED]
- [[dot-testBookTemporaryHold_SlotUnavailable_ThrowsException()]] - `calls` [INFERRED]
- [[dot-testBookTemporaryHold_Success()]] - `calls` [INFERRED]
- [[dot-testSaveInitialMedicalRecord_Success()]] - `calls` [INFERRED]
- [[dot-updatePatient()]] - `calls` [INFERRED]
- [[Patient]] - `references` [EXTRACTED]
- [[PatientRepository]] - `method` [EXTRACTED]

#graphify/code #graphify/INFERRED #community/bookTemporaryHold