---
source_file: "backend/src/main/java/com/clinicadermatologica/app/application/service/ClinicalImageService.java"
type: "code"
community: "ClinicalImageResponseDTO"
location: "L46"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/ClinicalImageResponseDTO
---

# .uploadClinicalImage()

## Connections
- [[dot-findById()_23]] - `calls` [INFERRED]
- [[dot-mapToDTO()_3]] - `calls` [EXTRACTED]
- [[dot-save()_16]] - `calls` [INFERRED]
- [[dot-uploadClinicalPhoto()]] - `calls` [INFERRED]
- [[dot-uploadFile()]] - `calls` [INFERRED]
- [[ClinicalImageResponseDTO]] - `references` [EXTRACTED]
- [[ClinicalImageService]] - `method` [EXTRACTED]
- [[ResourceNotFoundException]] - `calls` [EXTRACTED]
- [[org.springframework.transaction.annotation.Transactional]] - `references` [EXTRACTED]
- [[org.springframework.web.multipart.MultipartFile]] - `references` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/ClinicalImageResponseDTO