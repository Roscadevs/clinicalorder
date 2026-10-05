---
source_file: "backend/src/main/resources/db/migration/V4__schema_redesign.sql"
type: "code"
community: "V4__schema_redesign.sql"
location: "L165"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/V4__schema_redesignsql
---

# historia_clinica

## Connections
- [[V4__schema_redesign.sql]] - `contains` [EXTRACTED]
- [[alergia_1]] - `references` [EXTRACTED]
- [[antecedente_patologico]] - `references` [EXTRACTED]
- [[habito_1]] - `references` [EXTRACTED]
- [[historia_clinica_audit]] - `references` [EXTRACTED]
- [[paciente]] - `references` [EXTRACTED]
- [[usuario]] - `references` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/V4__schema_redesignsql