---
source_file: "backend/src/main/java/com/clinicadermatologica/app/domain/model/PaymentStatus.java"
type: "code"
community: "PaymentTransaction"
location: "L6"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/PaymentTransaction
---

# PaymentStatus

## Connections
- [[APPROVED]] - `case_of` [EXTRACTED]
- [[PENDING]] - `case_of` [EXTRACTED]
- [[PaymentStatus.java]] - `contains` [EXTRACTED]
- [[PaymentTransaction]] - `references` [EXTRACTED]
- [[REFUNDED]] - `case_of` [EXTRACTED]
- [[REJECTED]] - `case_of` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/PaymentTransaction