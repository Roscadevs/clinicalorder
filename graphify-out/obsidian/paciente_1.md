---
source_file: "backend/src/main/resources/db/migration/V1__initial_schema.sql"
type: "code"
community: "V1__initial_schema.sql"
location: "L32"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/V1__initial_schemasql
---

# paciente

## Connections
- [[V1__initial_schema.sql]] - `contains` [EXTRACTED]
- [[cita_1]] - `references` [EXTRACTED]
- [[historia_clinica_2]] - `references` [EXTRACTED]
- [[idx_paciente_dni_1]] - `indexes` [EXTRACTED]
- [[idx_paciente_email_1]] - `indexes` [EXTRACTED]
- [[idx_paciente_name_1]] - `indexes` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/V1__initial_schemasql