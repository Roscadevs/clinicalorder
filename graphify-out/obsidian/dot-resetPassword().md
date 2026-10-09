---
source_file: "backend/src/main/java/com/clinicadermatologica/app/application/service/AuthService.java"
type: "code"
community: "AuthServiceTest"
location: "L97"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/AuthServiceTest
---

# .resetPassword()

## Connections
- [[dot-findByToken()]] - `calls` [INFERRED]
- [[dot-resetPassword()_1]] - `calls` [INFERRED]
- [[dot-save()_25]] - `calls` [INFERRED]
- [[dot-save()_23]] - `calls` [INFERRED]
- [[dot-testResetPassword_AlreadyUsedToken_ThrowsException()]] - `calls` [INFERRED]
- [[dot-testResetPassword_ExpiredToken_ThrowsException()]] - `calls` [INFERRED]
- [[dot-testResetPassword_Success()]] - `calls` [INFERRED]
- [[AuthService]] - `method` [EXTRACTED]
- [[ResetPasswordRequestDTO]] - `references` [EXTRACTED]
- [[org.springframework.transaction.annotation.Transactional]] - `references` [EXTRACTED]

#graphify/code #graphify/INFERRED #community/AuthServiceTest