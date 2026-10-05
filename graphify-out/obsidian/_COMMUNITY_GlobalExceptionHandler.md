---
type: community
members: 53
---

# GlobalExceptionHandler

**Members:** 53 nodes

## Members
- [[dot-DuplicateResourceException()]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/exception/DuplicateResourceException.java
- [[dot-SlotUnavailableException()]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/exception/SlotUnavailableException.java
- [[dot-UnauthorizedAccessException()]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/exception/UnauthorizedAccessException.java
- [[dot-authenticationManager()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/SecurityConfig.java
- [[dot-buildErrorResponse()]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/advice/GlobalExceptionHandler.java
- [[dot-corsConfigurationSource()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/SecurityConfig.java
- [[dot-doFilterInternal()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/JwtAuthenticationFilter.java
- [[dot-getJwtFromRequest()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/JwtAuthenticationFilter.java
- [[dot-getUsernameFromToken()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/JwtTokenProvider.java
- [[dot-handleAccessDenied()]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/advice/GlobalExceptionHandler.java
- [[dot-handleBusinessRule()]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/advice/GlobalExceptionHandler.java
- [[dot-handleDuplicate()]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/advice/GlobalExceptionHandler.java
- [[dot-handleGeneralException()]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/advice/GlobalExceptionHandler.java
- [[dot-handleNotFound()]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/advice/GlobalExceptionHandler.java
- [[dot-handleSlotUnavailable()]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/advice/GlobalExceptionHandler.java
- [[dot-handleUnauthorized()]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/advice/GlobalExceptionHandler.java
- [[dot-handleValidationErrors()]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/advice/GlobalExceptionHandler.java
- [[dot-passwordEncoder()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/SecurityConfig.java
- [[dot-securityFilterChain()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/SecurityConfig.java
- [[dot-validateToken()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/JwtTokenProvider.java
- [[CorsConfigurationSource]] - code
- [[DuplicateResourceException]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/exception/DuplicateResourceException.java
- [[DuplicateResourceException.java]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/exception/DuplicateResourceException.java
- [[ExceptionHandler]] - code
- [[GlobalExceptionHandler]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/advice/GlobalExceptionHandler.java
- [[GlobalExceptionHandler.java]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/advice/GlobalExceptionHandler.java
- [[HttpStatus]] - code
- [[JwtAuthenticationFilter]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/JwtAuthenticationFilter.java
- [[JwtAuthenticationFilter.java]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/JwtAuthenticationFilter.java
- [[Override_11]] - code
- [[ResponseEntity]] - code
- [[RestControllerAdvice]] - code
- [[SecurityConfig]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/SecurityConfig.java
- [[SecurityConfig.java]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/SecurityConfig.java
- [[SlotUnavailableException]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/exception/SlotUnavailableException.java
- [[SlotUnavailableException.java]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/exception/SlotUnavailableException.java
- [[UnauthorizedAccessException]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/exception/UnauthorizedAccessException.java
- [[UnauthorizedAccessException.java]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/exception/UnauthorizedAccessException.java
- [[jakarta.servlet.FilterChain]] - code
- [[jakarta.servlet.http.HttpServletRequest]] - code
- [[jakarta.servlet.http.HttpServletResponse]] - code
- [[org.springframework.context.annotation.Bean]] - code
- [[org.springframework.context.annotation.Configuration]] - code
- [[org.springframework.security.access.AccessDeniedException]] - code
- [[org.springframework.security.authentication.AuthenticationManager]] - code
- [[org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration]] - code
- [[org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity]] - code
- [[org.springframework.security.config.annotation.web.builders.HttpSecurity]] - code
- [[org.springframework.security.config.annotation.web.configuration.EnableWebSecurity]] - code
- [[org.springframework.security.core.userdetails.UserDetails]] - code
- [[org.springframework.security.web.SecurityFilterChain]] - code
- [[org.springframework.web.bind.MethodArgumentNotValidException]] - code
- [[org.springframework.web.filter.OncePerRequestFilter]] - code

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/GlobalExceptionHandler
SORT file.name ASC
```

## Connections to other communities
- 7 edges to [[_COMMUNITY_lombok.extern.slf4j.Slf4j]]
- 4 edges to [[_COMMUNITY_lombok.RequiredArgsConstructor]]
- 2 edges to [[_COMMUNITY_org.springframework.stereotype.Component]]
- 2 edges to [[_COMMUNITY_UserRepository]]
- 2 edges to [[_COMMUNITY_org.springframework.transaction.annotation.Transactional]]
- 1 edge to [[_COMMUNITY_MedicalRecordService]]
- 1 edge to [[_COMMUNITY_AppointmentServiceTest.java]]

## Top bridge nodes
- [[JwtAuthenticationFilter]] - degree 9, connects to 4 communities
- [[SecurityConfig.java]] - degree 11, connects to 2 communities
- [[JwtAuthenticationFilter.java]] - degree 8, connects to 2 communities
- [[GlobalExceptionHandler]] - degree 12, connects to 1 community
- [[SecurityConfig]] - degree 10, connects to 1 community