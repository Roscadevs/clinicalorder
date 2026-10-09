---
type: community
members: 43
---

# GlobalExceptionHandler

**Members:** 43 nodes

## Members
- [[dot-DuplicateResourceException()]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/exception/DuplicateResourceException.java
- [[dot-JwtTokenProvider()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/JwtTokenProvider.java
- [[dot-PaymentGatewayException()]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/exception/PaymentGatewayException.java
- [[dot-UnauthorizedAccessException()]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/exception/UnauthorizedAccessException.java
- [[dot-buildErrorResponse()]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/advice/GlobalExceptionHandler.java
- [[dot-doFilterInternal()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/JwtAuthenticationFilter.java
- [[dot-getJwtFromRequest()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/JwtAuthenticationFilter.java
- [[dot-getUsernameFromToken()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/JwtTokenProvider.java
- [[dot-handleAccessDenied()]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/advice/GlobalExceptionHandler.java
- [[dot-handleBusinessRule()]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/advice/GlobalExceptionHandler.java
- [[dot-handleDuplicate()]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/advice/GlobalExceptionHandler.java
- [[dot-handleGeneralException()]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/advice/GlobalExceptionHandler.java
- [[dot-handleNotFound()]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/advice/GlobalExceptionHandler.java
- [[dot-handlePaymentGateway()]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/advice/GlobalExceptionHandler.java
- [[dot-handleSlotUnavailable()]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/advice/GlobalExceptionHandler.java
- [[dot-handleUnauthorized()]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/advice/GlobalExceptionHandler.java
- [[dot-handleValidationErrors()]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/advice/GlobalExceptionHandler.java
- [[dot-validateToken()]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/JwtTokenProvider.java
- [[DuplicateResourceException]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/exception/DuplicateResourceException.java
- [[DuplicateResourceException.java]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/exception/DuplicateResourceException.java
- [[ExceptionHandler]] - code
- [[GlobalExceptionHandler]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/advice/GlobalExceptionHandler.java
- [[GlobalExceptionHandler.java]] - code - backend/src/main/java/com/clinicadermatologica/app/presentation/advice/GlobalExceptionHandler.java
- [[HttpStatus]] - code
- [[JwtAuthenticationFilter]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/JwtAuthenticationFilter.java
- [[JwtAuthenticationFilter.java]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/JwtAuthenticationFilter.java
- [[JwtTokenProvider]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/JwtTokenProvider.java
- [[JwtTokenProvider.java]] - code - backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/JwtTokenProvider.java
- [[Override_11]] - code
- [[PaymentGatewayException]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/exception/PaymentGatewayException.java
- [[PaymentGatewayException.java]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/exception/PaymentGatewayException.java
- [[ResponseEntity]] - code
- [[RestControllerAdvice]] - code
- [[UnauthorizedAccessException]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/exception/UnauthorizedAccessException.java
- [[UnauthorizedAccessException.java]] - code - backend/src/main/java/com/clinicadermatologica/app/domain/exception/UnauthorizedAccessException.java
- [[jakarta.servlet.FilterChain]] - code
- [[jakarta.servlet.http.HttpServletRequest]] - code
- [[jakarta.servlet.http.HttpServletResponse]] - code
- [[javax.crypto.SecretKey]] - code
- [[org.springframework.security.access.AccessDeniedException]] - code
- [[org.springframework.security.core.userdetails.UserDetails]] - code
- [[org.springframework.web.bind.MethodArgumentNotValidException]] - code
- [[org.springframework.web.filter.OncePerRequestFilter]] - code

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/GlobalExceptionHandler
SORT file.name ASC
```

## Connections to other communities
- 4 edges to [[_COMMUNITY_AppointmentService]]
- 4 edges to [[_COMMUNITY_org.springframework.stereotype.Component]]
- 4 edges to [[_COMMUNITY_org.springframework.stereotype.Service]]
- 2 edges to [[_COMMUNITY_org.junit.jupiter.api.DisplayName]]
- 2 edges to [[_COMMUNITY_lombok.RequiredArgsConstructor]]
- 2 edges to [[_COMMUNITY_dot-login]]
- 2 edges to [[_COMMUNITY_org.springframework.transaction.annotation.Transactional]]
- 1 edge to [[_COMMUNITY_AuthServiceTest]]
- 1 edge to [[_COMMUNITY_MedicalRecordServiceTest]]
- 1 edge to [[_COMMUNITY_dot-bookTemporaryHold]]
- 1 edge to [[_COMMUNITY_SecurityConfig.java]]
- 1 edge to [[_COMMUNITY_User]]
- 1 edge to [[_COMMUNITY_AppointmentServiceTest.java]]

## Top bridge nodes
- [[JwtTokenProvider]] - degree 12, connects to 4 communities
- [[JwtAuthenticationFilter]] - degree 9, connects to 4 communities
- [[JwtAuthenticationFilter.java]] - degree 8, connects to 2 communities
- [[PaymentGatewayException]] - degree 6, connects to 2 communities
- [[JwtTokenProvider.java]] - degree 4, connects to 2 communities