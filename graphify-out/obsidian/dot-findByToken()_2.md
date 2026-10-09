---
source_file: "backend/src/main/java/com/clinicadermatologica/app/domain/repository/PasswordResetTokenRepository.java"
type: "code"
community: "UserRepository"
location: "L11"
tags:
  - graphify/code
  - graphify/INFERRED
  - community/UserRepository
---

# .findByToken()

## Connections
- [[dot-resetPassword()_1]] - `calls` [INFERRED]
- [[dot-testResetPassword_AlreadyUsedToken_ThrowsException()]] - `calls` [INFERRED]
- [[dot-testResetPassword_ExpiredToken_ThrowsException()]] - `calls` [INFERRED]
- [[dot-testResetPassword_Success()]] - `calls` [INFERRED]
- [[PasswordResetToken]] - `references` [EXTRACTED]
- [[PasswordResetTokenRepository]] - `method` [EXTRACTED]

#graphify/code #graphify/INFERRED #community/UserRepository