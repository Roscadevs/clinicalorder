---
type: community
members: 13
---

# .login

**Members:** 13 nodes

## Members
- [[dot-findByUsername()_2]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/repository/UserRepository.java
- [[dot-generateToken()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/JwtTokenProvider.java
- [[dot-login()_1]] - code - backend/src/main/java/com/clinicadermatologica/app/application/service/AuthService.java
- [[dot-testLogin_InactiveAccount_ThrowsException()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AuthServiceTest.java
- [[dot-testLogin_Success()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AuthServiceTest.java
- [[dot-testLogin_WrongPassword_ThrowsException()]] - code - backend/src/test/java/com/clinicadermatologica/app/application/AuthServiceTest.java
- [[AllArgsConstructor_46]] - code
- [[AuthRequestDTO]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/dto/AuthRequestDTO.java
- [[AuthRequestDTO.java]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/dto/AuthRequestDTO.java
- [[Builder_43]] - code
- [[Getter_46]] - code
- [[NoArgsConstructor_46]] - code
- [[Setter_46]] - code

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/login
SORT file.name ASC
```

## Connections to other communities
- 6 edges to [[_COMMUNITY_org.junit.jupiter.api.DisplayName]]
- 5 edges to [[_COMMUNITY_lombok.extern.slf4j.Slf4j]]
- 2 edges to [[_COMMUNITY_User]]
- 2 edges to [[_COMMUNITY_UserRepository]]
- 2 edges to [[_COMMUNITY_AuthController]]
- 1 edge to [[_COMMUNITY_UserRole]]
- 1 edge to [[_COMMUNITY_org.springframework.transaction.annotation.Transactional]]

## Top bridge nodes
- [[dot-login()_1]] - degree 10, connects to 4 communities
- [[dot-findByUsername()_2]] - degree 7, connects to 2 communities
- [[dot-testLogin_Success()]] - degree 6, connects to 2 communities
- [[dot-testLogin_InactiveAccount_ThrowsException()]] - degree 5, connects to 2 communities
- [[dot-testLogin_WrongPassword_ThrowsException()]] - degree 5, connects to 2 communities