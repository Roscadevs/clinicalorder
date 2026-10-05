---
source_file: "backend/src/main/resources/db/migration/V4__schema_redesign.sql"
type: "code"
community: "V4__schema_redesign.sql"
location: "L64"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/V4__schema_redesignsql
---

# paciente

## Connections
- [[V4__schema_redesign.sql]] - `contains` [EXTRACTED]
- [[cita]] - `references` [EXTRACTED]
- [[entrada_hc]] - `references` [EXTRACTED]
- [[historia_clinica]] - `references` [EXTRACTED]
- [[idx_paciente_dni]] - `indexes` [EXTRACTED]
- [[idx_paciente_email]] - `indexes` [EXTRACTED]
- [[idx_paciente_name]] - `indexes` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/V4__schema_redesignsql