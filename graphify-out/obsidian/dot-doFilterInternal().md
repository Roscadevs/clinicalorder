---
source_file: "backend/src/main/java/com/clinicadermatologica/app/infrastructure/security/JwtAuthenticationFilter.java"
type: "code"
community: "JwtAuthenticationFilter"
location: "L28"
tags:
  - graphify/code
  - graphify/EXTRACTED
  - community/JwtAuthenticationFilter
---

# .doFilterInternal()

## Connections
- [[dot-getJwtFromRequest()]] - `calls` [EXTRACTED]
- [[dot-getUsernameFromToken()]] - `calls` [INFERRED]
- [[dot-loadUserByUsername()]] - `calls` [INFERRED]
- [[dot-validateToken()]] - `calls` [INFERRED]
- [[JwtAuthenticationFilter]] - `method` [EXTRACTED]
- [[Override_19]] - `references` [EXTRACTED]
- [[jakarta.servlet.FilterChain]] - `references` [EXTRACTED]
- [[jakarta.servlet.http.HttpServletRequest]] - `references` [EXTRACTED]
- [[jakarta.servlet.http.HttpServletResponse]] - `references` [EXTRACTED]

#graphify/code #graphify/EXTRACTED #community/JwtAuthenticationFilter