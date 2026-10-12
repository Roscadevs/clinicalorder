package com.clinicadermatologica.app.infrastructure.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Manejador perimetral de accesos no autorizados (403) conforme al estándar RFC 7807 (Problem Details).
 */
@Component
@RequiredArgsConstructor
public class DelegatedAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "about:blank");
        body.put("title", "Acceso denegado");
        body.put("status", HttpStatus.FORBIDDEN.value());
        body.put("detail", "No cuenta con los privilegios requeridos para acceder a este recurso");
        body.put("message", "No cuenta con los privilegios requeridos para acceder a este recurso");
        body.put("error", "Forbidden");
        body.put("instance", request.getRequestURI());
        body.put("timestamp", Instant.now().toString());

        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
