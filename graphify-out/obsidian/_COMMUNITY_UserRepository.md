---
type: community
members: 35
---

# UserRepository

**Members:** 35 nodes

## Members
- [[dot-JwtTokenProvider()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/JwtTokenProvider.java
- [[dot-existsByEmail()_5]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/UserRepository.java
- [[dot-existsByUsername()_2]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/UserRepository.java
- [[dot-findByEmail()_5]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/UserRepository.java
- [[dot-findByToken()_2]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/PasswordResetTokenRepository.java
- [[dot-findByUsername()_2]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/UserRepository.java
- [[dot-forgotPassword()_1]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AuthService.java
- [[dot-generateToken()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/JwtTokenProvider.java
- [[dot-login()_1]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AuthService.java
- [[dot-registerUser()]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AuthService.java
- [[dot-resetPassword()_1]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AuthService.java
- [[dot-save()_24]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/PasswordResetTokenRepository.java
- [[dot-save()_25]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/UserRepository.java
- [[dot-sendAppointmentConfirmationEmail()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/notification/EmailNotificationService.java
- [[dot-sendPasswordResetEmail()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/notification/EmailNotificationService.java
- [[dot-testForgotPassword_Success()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AuthServiceTest.java
- [[dot-testLogin_InactiveAccount_ThrowsException()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AuthServiceTest.java
- [[dot-testLogin_Success()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AuthServiceTest.java
- [[dot-testLogin_WrongPassword_ThrowsException()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AuthServiceTest.java
- [[dot-testResetPassword_AlreadyUsedToken_ThrowsException()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AuthServiceTest.java
- [[dot-testResetPassword_ExpiredToken_ThrowsException()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AuthServiceTest.java
- [[dot-testResetPassword_Success()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AuthServiceTest.java
- [[dot-validateToken()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/JwtTokenProvider.java
- [[AuthService]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AuthService.java
- [[AuthService.java]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AuthService.java
- [[AuthServiceTest]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AuthServiceTest.java
- [[AuthServiceTest.java]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AuthServiceTest.java
- [[EmailNotificationService]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/notification/EmailNotificationService.java
- [[EmailNotificationService.java]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/notification/EmailNotificationService.java
- [[JwtTokenProvider]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/JwtTokenProvider.java
- [[JwtTokenProvider.java]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/JwtTokenProvider.java
- [[PasswordResetTokenRepository]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/PasswordResetTokenRepository.java
- [[UserRepository]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/UserRepository.java
- [[javax.crypto.SecretKey]] - code
- [[org.springframework.security.crypto.password.PasswordEncoder]] - code

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/UserRepository
SORT file.name ASC
```

## Connections to other communities
- 19 edges to [[_COMMUNITY_org.junit.jupiter.api.DisplayName]]
- 12 edges to [[_COMMUNITY_org.springframework.transaction.annotation.Transactional]]
- 10 edges to [[_COMMUNITY_User]]
- 10 edges to [[_COMMUNITY_UserRole]]
- 8 edges to [[_COMMUNITY_MedicalRecordService]]
- 6 edges to [[_COMMUNITY_JwtAuthenticationFilter]]
- 6 edges to [[_COMMUNITY_lombok.RequiredArgsConstructor]]
- 5 edges to [[_COMMUNITY_lombok.extern.slf4j.Slf4j]]
- 3 edges to [[_COMMUNITY_PasswordResetToken]]
- 2 edges to [[_COMMUNITY_AppointmentService]]
- 2 edges to [[_COMMUNITY_SecurityConfig.java]]
- 1 edge to [[_COMMUNITY_CalendarBlockResponseDTO]]
- 1 edge to [[_COMMUNITY_org.springframework.http.ResponseEntity]]
- 1 edge to [[_COMMUNITY_dot-bookTemporaryHold]]

## Top bridge nodes
- [[UserRepository]] - degree 23, connects to 9 communities
- [[AuthService]] - degree 17, connects to 5 communities
- [[AuthServiceTest.java]] - degree 14, connects to 3 communities
- [[AuthService.java]] - degree 10, connects to 3 communities
- [[dot-registerUser()]] - degree 8, connects to 3 communities