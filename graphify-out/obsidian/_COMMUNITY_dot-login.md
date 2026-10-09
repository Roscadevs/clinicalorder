---
type: community
members: 9
---

# .login

**Members:** 9 nodes

## Members
- [[dot-findByUsername()_2]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/UserRepository.java
- [[dot-generateToken()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/JwtTokenProvider.java
- [[dot-loadUserByUsername()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/CustomUserDetailsService.java
- [[dot-login()_1]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AuthService.java
- [[dot-testLogin_InactiveAccount_ThrowsException()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AuthServiceTest.java
- [[dot-testLogin_Success()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AuthServiceTest.java
- [[dot-testLogin_WrongPassword_ThrowsException()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AuthServiceTest.java
- [[Override_17]] - code
- [[UserDetails]] - code

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/login
SORT file.name ASC
```

## Connections to other communities
- 6 edges to [[_COMMUNITY_org.junit.jupiter.api.DisplayName]]
- 4 edges to [[_COMMUNITY_org.springframework.stereotype.Service]]
- 3 edges to [[_COMMUNITY_AuthServiceTest]]
- 3 edges to [[_COMMUNITY_User]]
- 2 edges to [[_COMMUNITY_GlobalExceptionHandler]]
- 1 edge to [[_COMMUNITY_AuthRequestDTO]]
- 1 edge to [[_COMMUNITY_UserRole]]
- 1 edge to [[_COMMUNITY_org.springframework.http.ResponseEntity]]
- 1 edge to [[_COMMUNITY_org.springframework.transaction.annotation.Transactional]]

## Top bridge nodes
- [[dot-login()_1]] - degree 10, connects to 5 communities
- [[dot-loadUserByUsername()]] - degree 6, connects to 3 communities
- [[dot-findByUsername()_2]] - degree 7, connects to 2 communities
- [[dot-testLogin_Success()]] - degree 6, connects to 2 communities
- [[dot-testLogin_InactiveAccount_ThrowsException()]] - degree 5, connects to 2 communities