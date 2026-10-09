---
source_file: "backend/src/main/java/com/clinicadermatologica/app/application/service/MedicalRecordService.java"
type: "code"
community: "MedicalRecordDTO"
location: "L52"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/MedicalRecordDTO
---

# .saveOrUpdateMedicalRecord()

## Connections
- [[dot-applyDtoToEntity()]] - `calls` [EXTRACTED]
- [[dot-findById()_11]] - `calls` [INFERRED]
- [[dot-findById()_12]] - `calls` [INFERRED]
- [[dot-findByPatientId()_4]] - `calls` [INFERRED]
- [[dot-mapRecordToDTO()]] - `calls` [EXTRACTED]
- [[dot-save()_12]] - `calls` [INFERRED]
- [[dot-saveAudit()_1]] - `calls` [INFERRED]
- [[dot-saveMedicalRecord()]] - `calls` [INFERRED]
- [[dot-testSaveInitialMedicalRecord_Success()]] - `calls` [INFERRED]
- [[MedicalRecordDTO]] - `references` [EXTRACTED]
- [[MedicalRecordService]] - `method` [EXTRACTED]
- [[org.springframework.transaction.annotation.Transactional]] - `references` [EXTRACTED]

#graphify/code #graphify/INFERRED #community/MedicalRecordDTO