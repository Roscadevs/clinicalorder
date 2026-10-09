---
type: community
members: 6
---

# AuthServiceTest

**Members:** 6 nodes

## Members
- [[dot-findByToken()]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/PasswordResetTokenRepository.java
- [[dot-resetPassword()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AuthService.java
- [[dot-testResetPassword_AlreadyUsedToken_ThrowsException()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AuthServiceTest.java
- [[dot-testResetPassword_ExpiredToken_ThrowsException()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AuthServiceTest.java
- [[dot-testResetPassword_Success()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AuthServiceTest.java
- [[AuthServiceTest]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AuthServiceTest.java

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/AuthServiceTest
SORT file.name ASC
```

## Connections to other communities
- 7 edges to [[_COMMUNITY_org.springframework.stereotype.Service]]
- 6 edges to [[_COMMUNITY_org.junit.jupiter.api.DisplayName]]
- 4 edges to [[_COMMUNITY_PasswordResetToken]]
- 3 edges to [[_COMMUNITY_MedicalRecordServiceTest]]
- 3 edges to [[_COMMUNITY_dot-login]]
- 1 edge to [[_COMMUNITY_GlobalExceptionHandler]]
- 1 edge to [[_COMMUNITY_User]]
- 1 edge to [[_COMMUNITY_dot-forgotPassword]]
- 1 edge to [[_COMMUNITY_ResetPasswordRequestDTO]]
- 1 edge to [[_COMMUNITY_org.springframework.transaction.annotation.Transactional]]
- 1 edge to [[_COMMUNITY_org.springframework.http.ResponseEntity]]

## Top bridge nodes
- [[AuthServiceTest]] - degree 18, connects to 7 communities
- [[dot-resetPassword()]] - degree 10, connects to 5 communities
- [[dot-findByToken()]] - degree 6, connects to 1 community
- [[dot-testResetPassword_AlreadyUsedToken_ThrowsException()]] - degree 5, connects to 1 community
- [[dot-testResetPassword_ExpiredToken_ThrowsException()]] - degree 5, connects to 1 community