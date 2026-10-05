---
source_file: "backend/src/main/resources/db/migration/V4__schema_redesign.sql"
type: "code"
community: "V4__schema_redesign.sql"
location: "L272"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/V4__schema_redesignsql
---

# entrada_hc_audit

## Connections
- [[V4__schema_redesign.sql]] - `contains` [EXTRACTED]
- [[entrada_hc]] - `references` [EXTRACTED]
- [[idx_entrada_audit_date]] - `indexes` [EXTRACTED]
- [[idx_entrada_audit_entry]] - `indexes` [EXTRACTED]
- [[idx_entrada_audit_user]] - `indexes` [EXTRACTED]
- [[usuario]] - `references` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/V4__schema_redesignsql