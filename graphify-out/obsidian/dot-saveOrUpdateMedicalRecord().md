---
source_file: "backend/src/main/java/com/clinicadermatologica/app/application/service/MedicalRecordService.java"
type: "code"
community: "MedicalRecordService"
location: "L52"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/MedicalRecordService
---

# .saveOrUpdateMedicalRecord()

## Connections
- [[dot-applyDtoToEntity()]] - `calls` [EXTRACTED]
- [[dot-findById()_13]] - `calls` [INFERRED]
- [[dot-findById()_7]] - `calls` [INFERRED]
- [[dot-findByPatientId()_5]] - `calls` [INFERRED]
- [[dot-mapRecordToDTO()]] - `calls` [EXTRACTED]
- [[dot-save()_12]] - `calls` [INFERRED]
- [[dot-saveAudit()_1]] - `calls` [INFERRED]
- [[dot-saveMedicalRecord()]] - `calls` [INFERRED]
- [[dot-testSaveInitialMedicalRecord_Success()]] - `calls` [INFERRED]
- [[MedicalRecordDTO]] - `references` [EXTRACTED]
- [[MedicalRecordService]] - `method` [EXTRACTED]
- [[org.springframework.transaction.annotation.Transactional]] - `references` [EXTRACTED]

#graphify/code #graphify/INFERRED #community/MedicalRecordService