---
source_file: "backend/src/main/java/com/clinicadermatologica/app/application/service/MedicalRecordService.java"
type: "code"
community: "MedicalRecordController"
location: "L52"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/MedicalRecordController
---

# .saveOrUpdateMedicalRecord()

## Connections
- [[dot-applyDtoToEntity()]] - `calls` [EXTRACTED]
- [[dot-findById()_13]] - `calls` [INFERRED]
- [[dot-findById()_14]] - `calls` [INFERRED]
- [[dot-findByPatientId()_6]] - `calls` [INFERRED]
- [[dot-mapRecordToDTO()]] - `calls` [EXTRACTED]
- [[dot-save()_21]] - `calls` [INFERRED]
- [[dot-saveAudit()_3]] - `calls` [INFERRED]
- [[dot-saveMedicalRecord()]] - `calls` [INFERRED]
- [[dot-testSaveInitialMedicalRecord_Success()]] - `calls` [INFERRED]
- [[MedicalRecordDTO]] - `references` [EXTRACTED]
- [[MedicalRecordService]] - `method` [EXTRACTED]
- [[org.springframework.transaction.annotation.Transactional]] - `references` [EXTRACTED]

#graphify/code #graphify/INFERRED #community/MedicalRecordController