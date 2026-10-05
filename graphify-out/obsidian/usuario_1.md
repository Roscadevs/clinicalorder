---
source_file: "backend/src/main/resources/db/migration/V1__initial_schema.sql"
type: "code"
community: "V1__initial_schema.sql"
location: "L7"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/V1__initial_schemasql
---

# usuario

## Connections
- [[V1__initial_schema.sql]] - `contains` [EXTRACTED]
- [[bloqueo_calendario_1]] - `references` [EXTRACTED]
- [[cita_1]] - `references` [EXTRACTED]
- [[entrada_hc_1]] - `references` [EXTRACTED]
- [[historia_clinica_2]] - `references` [EXTRACTED]
- [[password_reset_token_1]] - `references` [EXTRACTED]
- [[transaccion_pago_2]] - `references` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/V1__initial_schemasql