---
source_file: "backend/src/main/resources/db/migration/V4__schema_redesign.sql"
type: "code"
community: "V4__schema_redesign.sql"
location: "L103"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/V4__schema_redesignsql
---

# cita

## Connections
- [[V4__schema_redesign.sql]] - `contains` [EXTRACTED]
- [[cita]] - `references` [EXTRACTED]
- [[entrada_hc]] - `references` [EXTRACTED]
- [[idx_cita_paciente]] - `indexes` [EXTRACTED]
- [[idx_cita_range]] - `indexes` [EXTRACTED]
- [[idx_cita_status]] - `indexes` [EXTRACTED]
- [[paciente]] - `references` [EXTRACTED]
- [[servicio]] - `references` [EXTRACTED]
- [[transaccion_pago]] - `references` [EXTRACTED]
- [[usuario]] - `references` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/V4__schema_redesignsql