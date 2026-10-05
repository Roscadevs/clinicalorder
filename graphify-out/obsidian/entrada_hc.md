---
source_file: "backend/src/main/resources/db/migration/V4__schema_redesign.sql"
type: "code"
community: "V4__schema_redesign.sql"
location: "L221"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/V4__schema_redesignsql
---

# entrada_hc

## Connections
- [[V4__schema_redesign.sql]] - `contains` [EXTRACTED]
- [[cita]] - `references` [EXTRACTED]
- [[entrada_hc_audit]] - `references` [EXTRACTED]
- [[idx_entrada_hc_cita]] - `indexes` [EXTRACTED]
- [[idx_entrada_hc_paciente]] - `indexes` [EXTRACTED]
- [[imagen_hc]] - `references` [EXTRACTED]
- [[paciente]] - `references` [EXTRACTED]
- [[usuario]] - `references` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/V4__schema_redesignsql