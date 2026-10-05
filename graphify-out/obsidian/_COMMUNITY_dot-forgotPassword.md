---
type: community
members: 12
---

# .forgotPassword

**Members:** 12 nodes

## Members
- [[dot-findByEmail()_5]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/UserRepository.java
- [[dot-forgotPassword()_1]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AuthService.java
- [[dot-save()_25]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/PasswordResetTokenRepository.java
- [[dot-sendPasswordResetEmail()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/notification/EmailNotificationService.java
- [[dot-testForgotPassword_Success()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AuthServiceTest.java
- [[AllArgsConstructor_47]] - code
- [[Builder_44]] - code
- [[ForgotPasswordRequestDTO]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/dto/ForgotPasswordRequestDTO.java
- [[ForgotPasswordRequestDTO.java]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/dto/ForgotPasswordRequestDTO.java
- [[Getter_47]] - code
- [[NoArgsConstructor_47]] - code
- [[Setter_47]] - code

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/forgotPassword
SORT file.name ASC
```

## Connections to other communities
- 5 edges to [[_COMMUNITY_lombok.extern.slf4j.Slf4j]]
- 2 edges to [[_COMMUNITY_AuthController]]
- 2 edges to [[_COMMUNITY_org.junit.jupiter.api.DisplayName]]
- 1 edge to [[_COMMUNITY_User]]
- 1 edge to [[_COMMUNITY_UserRepository]]
- 1 edge to [[_COMMUNITY_PasswordResetToken]]
- 1 edge to [[_COMMUNITY_org.springframework.transaction.annotation.Transactional]]

## Top bridge nodes
- [[dot-forgotPassword()_1]] - degree 8, connects to 3 communities
- [[dot-testForgotPassword_Success()]] - degree 5, connects to 2 communities
- [[dot-save()_25]] - degree 4, connects to 2 communities
- [[dot-findByEmail()_5]] - degree 4, connects to 2 communities
- [[ForgotPasswordRequestDTO]] - degree 8, connects to 1 community