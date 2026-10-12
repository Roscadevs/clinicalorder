package com.clinicadermatologica.app.infrastructure.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Manejador perimetral de fallos de autenticación (401) conforme al estándar RFC 7807 (Problem Details).
 */
@Component
@RequiredArgsConstructor
public class DelegatedAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "about:blank");
        body.put("title", "No autenticado");
        body.put("status", HttpStatus.UNAUTHORIZED.value());
        body.put("detail", "Se requiere autenticación válida para acceder al recurso solicitado");
        body.put("message", "Se requiere autenticación válida para acceder al recurso solicitado");
        body.put("error", "Unauthorized");
        body.put("instance", request.getRequestURI());
        body.put("timestamp", Instant.now().toString());

        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
