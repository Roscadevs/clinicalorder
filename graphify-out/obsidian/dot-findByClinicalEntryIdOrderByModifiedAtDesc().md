---
source_file: "backend/src/main/java/com/clinicadermatologica/app/infrastructure/persistence/jpa/JpaClinicalEntryAuditRepository.java"
type: "code"
community: "ClinicalEntry"
location: "L14"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/ClinicalEntry
---

# .findByClinicalEntryIdOrderByModifiedAtDesc()

## Connections
- [[dot-findAuditByEntryId()]] - `calls` [INFERRED]
- [[ClinicalEntryAudit]] - `references` [EXTRACTED]
- [[JpaClinicalEntryAuditRepository]] - `method` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/ClinicalEntry