---
source_file: "backend/src/main/java/com/clinicadermatologica/app/application/service/AuthService.java"
type: "code"
community: "UserRepository"
location: "L97"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/UserRepository
---

# .resetPassword()

## Connections
- [[dot-findByToken()_2]] - `calls` [INFERRED]
- [[dot-resetPassword()]] - `calls` [INFERRED]
- [[dot-save()_25]] - `calls` [INFERRED]
- [[dot-save()_24]] - `calls` [INFERRED]
- [[dot-testResetPassword_AlreadyUsedToken_ThrowsException()]] - `calls` [INFERRED]
- [[dot-testResetPassword_ExpiredToken_ThrowsException()]] - `calls` [INFERRED]
- [[dot-testResetPassword_Success()]] - `calls` [INFERRED]
- [[AuthService]] - `method` [EXTRACTED]
- [[ResetPasswordRequestDTO]] - `references` [EXTRACTED]
- [[org.springframework.transaction.annotation.Transactional]] - `references` [EXTRACTED]

#graphify/code #graphify/INFERRED #community/UserRepository