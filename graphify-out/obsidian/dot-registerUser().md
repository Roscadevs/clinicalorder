---
source_file: "backend/src/main/java/com/clinicadermatologica/app/application/service/AuthService.java"
type: "code"
community: "UserRepository"
location: "L122"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/UserRepository
---

# .registerUser()

## Connections
- [[dot-existsByEmail()_5]] - `calls` [INFERRED]
- [[dot-existsByUsername()_2]] - `calls` [INFERRED]
- [[dot-register()_2]] - `calls` [INFERRED]
- [[dot-save()_25]] - `calls` [INFERRED]
- [[AuthService]] - `method` [EXTRACTED]
- [[RegisterUserRequestDTO]] - `references` [EXTRACTED]
- [[User]] - `references` [EXTRACTED]
- [[org.springframework.transaction.annotation.Transactional]] - `references` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/UserRepository