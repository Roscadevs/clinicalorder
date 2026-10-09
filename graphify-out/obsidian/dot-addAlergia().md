---
source_file: "backend/src/main/java/com/clinicadermatologica/app/application/service/MedicalRecordService.java"
type: "code"
community: "MedicalRecordServiceTest"
location: "L153"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/MedicalRecordServiceTest
---

# .addAlergia()

## Connections
- [[dot-addAlergia()_1]] - `calls` [INFERRED]
- [[dot-existsById()_4]] - `calls` [INFERRED]
- [[dot-findById()_20]] - `calls` [INFERRED]
- [[dot-mapAlergiaToDTO()]] - `calls` [EXTRACTED]
- [[dot-save()_17]] - `calls` [INFERRED]
- [[dot-testAddAlergia_DuplicateTipo_Throws()]] - `calls` [INFERRED]
- [[dot-testAddAlergia_Success()]] - `calls` [INFERRED]
- [[AlergiaId]] - `calls` [INFERRED]
- [[AlergiaRequestDTO]] - `references` [EXTRACTED]
- [[AlergiaResponseDTO]] - `references` [EXTRACTED]
- [[MedicalRecordService]] - `method` [EXTRACTED]
- [[org.springframework.transaction.annotation.Transactional]] - `references` [EXTRACTED]

#graphify/code #graphify/INFERRED #community/MedicalRecordServiceTest