---
source_file: "backend/src/main/java/com/clinicadermatologica/app/application/service/PatientService.java"
type: "code"
community: "Patient"
location: "L28"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/Patient
---

# .createPatient()

## Connections
- [[dot-createPatient()_1]] - `calls` [INFERRED]
- [[dot-existsByDni()]] - `calls` [INFERRED]
- [[dot-existsByEmail()]] - `calls` [INFERRED]
- [[dot-existsByPhone()]] - `calls` [INFERRED]
- [[dot-mapToDTO()_4]] - `calls` [EXTRACTED]
- [[dot-save()_14]] - `calls` [INFERRED]
- [[PatientRequestDTO]] - `references` [EXTRACTED]
- [[PatientResponseDTO]] - `references` [EXTRACTED]
- [[PatientService]] - `method` [EXTRACTED]
- [[org.springframework.transaction.annotation.Transactional]] - `references` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/Patient