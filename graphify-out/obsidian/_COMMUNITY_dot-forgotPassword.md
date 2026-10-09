---
type: community
members: 11
---

# .forgotPassword

**Members:** 11 nodes

## Members
- [[dot-findByEmail()]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/UserRepository.java
- [[dot-forgotPassword()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AuthService.java
- [[dot-sendPasswordResetEmail()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/notification/EmailNotificationService.java
- [[dot-testForgotPassword_Success()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AuthServiceTest.java
- [[AllArgsConstructor_13]] - code
- [[Builder_12]] - code
- [[ForgotPasswordRequestDTO]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/dto/ForgotPasswordRequestDTO.java
- [[ForgotPasswordRequestDTO.java]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/dto/ForgotPasswordRequestDTO.java
- [[Getter_13]] - code
- [[NoArgsConstructor_13]] - code
- [[Setter_13]] - code

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/forgotPassword
SORT file.name ASC
```

## Connections to other communities
- 3 edges to [[_COMMUNITY_org.springframework.stereotype.Service]]
- 2 edges to [[_COMMUNITY_org.springframework.http.ResponseEntity]]
- 2 edges to [[_COMMUNITY_org.junit.jupiter.api.DisplayName]]
- 1 edge to [[_COMMUNITY_AuthServiceTest]]
- 1 edge to [[_COMMUNITY_User]]
- 1 edge to [[_COMMUNITY_org.springframework.transaction.annotation.Transactional]]
- 1 edge to [[_COMMUNITY_PasswordResetToken]]

## Top bridge nodes
- [[dot-forgotPassword()]] - degree 8, connects to 4 communities
- [[dot-testForgotPassword_Success()]] - degree 5, connects to 2 communities
- [[dot-findByEmail()]] - degree 4, connects to 2 communities
- [[ForgotPasswordRequestDTO]] - degree 8, connects to 1 community
- [[dot-sendPasswordResetEmail()]] - degree 2, connects to 1 community