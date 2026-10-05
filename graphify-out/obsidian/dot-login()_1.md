---
source_file: "backend/src/main/java/com/clinicadermatologica/app/application/service/AuthService.java"
type: "code"
community: "UserRepository"
location: "L44"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/UserRepository
---

# .login()

## Connections
- [[dot-findByUsername()_2]] - `calls` [INFERRED]
- [[dot-generateToken()]] - `calls` [INFERRED]
- [[dot-login()]] - `calls` [INFERRED]
- [[dot-testLogin_InactiveAccount_ThrowsException()]] - `calls` [INFERRED]
- [[dot-testLogin_Success()]] - `calls` [INFERRED]
- [[dot-testLogin_WrongPassword_ThrowsException()]] - `calls` [INFERRED]
- [[AuthRequestDTO]] - `references` [EXTRACTED]
- [[AuthResponseDTO]] - `references` [EXTRACTED]
- [[AuthService]] - `method` [EXTRACTED]
- [[org.springframework.transaction.annotation.Transactional]] - `references` [EXTRACTED]

#graphify/code #graphify/INFERRED #community/UserRepository