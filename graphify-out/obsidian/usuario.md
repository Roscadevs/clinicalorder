---
source_file: "backend/src/main/resources/db/migration/V4__schema_redesign.sql"
type: "code"
community: "V4__schema_redesign.sql"
location: "L36"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/V4__schema_redesignsql
---

# usuario

## Connections
- [[V4__schema_redesign.sql]] - `contains` [EXTRACTED]
- [[bloqueo_calendario]] - `references` [EXTRACTED]
- [[cita]] - `references` [EXTRACTED]
- [[entrada_hc]] - `references` [EXTRACTED]
- [[entrada_hc_audit]] - `references` [EXTRACTED]
- [[historia_clinica]] - `references` [EXTRACTED]
- [[historia_clinica_audit]] - `references` [EXTRACTED]
- [[password_reset_token]] - `references` [EXTRACTED]
- [[transaccion_pago]] - `references` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/V4__schema_redesignsql