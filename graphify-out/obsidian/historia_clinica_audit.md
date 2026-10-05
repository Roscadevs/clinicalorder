---
source_file: "backend/src/main/resources/db/migration/V4__schema_redesign.sql"
type: "code"
community: "V4__schema_redesign.sql"
location: "L254"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/V4__schema_redesignsql
---

# historia_clinica_audit

## Connections
- [[V4__schema_redesign.sql]] - `contains` [EXTRACTED]
- [[historia_clinica]] - `references` [EXTRACTED]
- [[idx_hc_audit_date]] - `indexes` [EXTRACTED]
- [[idx_hc_audit_record]] - `indexes` [EXTRACTED]
- [[idx_hc_audit_user]] - `indexes` [EXTRACTED]
- [[usuario]] - `references` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/V4__schema_redesignsql