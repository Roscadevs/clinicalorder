package com.clinicadermatologica.app.infrastructure.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.RequestRejectedException;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Suite de pruebas unitarias para la infraestructura de seguridad:
 * Manejadores de error RFC 7807 (Problem Details) y StrictHttpFirewall perimetral.
 */
public class SecurityInfrastructureTest {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final DelegatedAuthenticationEntryPoint authenticationEntryPoint =
            new DelegatedAuthenticationEntryPoint(objectMapper);
    private final DelegatedAccessDeniedHandler accessDeniedHandler =
            new DelegatedAccessDeniedHandler(objectMapper);

    @Test
    @DisplayName("DelegatedAuthenticationEntryPoint genera respuesta RFC 7807 con status 401")
    void testAuthenticationEntryPoint_Rfc7807ProblemDetail() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/servicios/todos");
        MockHttpServletResponse response = new MockHttpServletResponse();

        authenticationEntryPoint.commence(request, response, new BadCredentialsException("Token inválido"));

        assertEquals(401, response.getStatus());
        assertEquals("application/problem+json", response.getContentType());

        String json = response.getContentAsString();
        assertTrue(json.contains("\"title\":\"No autenticado\""));
        assertTrue(json.contains("\"status\":401"));
        assertTrue(json.contains("\"instance\":\"/api/v1/servicios/todos\""));
        assertTrue(json.contains("\"detail\":\"Se requiere autenticación válida para acceder al recurso solicitado\""));
    }

    @Test
    @DisplayName("DelegatedAccessDeniedHandler genera respuesta RFC 7807 con status 403")
    void testAccessDeniedHandler_Rfc7807ProblemDetail() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/v1/historias-clinicas/paciente/1");
        MockHttpServletResponse response = new MockHttpServletResponse();

        accessDeniedHandler.handle(request, response, new AccessDeniedException("Rol insuficiente"));

        assertEquals(403, response.getStatus());
        assertEquals("application/problem+json", response.getContentType());

        String json = response.getContentAsString();
        assertTrue(json.contains("\"title\":\"Acceso denegado\""));
        assertTrue(json.contains("\"status\":403"));
        assertTrue(json.contains("\"instance\":\"/api/v1/historias-clinicas/paciente/1\""));
        assertTrue(json.contains("\"detail\":\"No cuenta con los privilegios requeridos para acceder a este recurso\""));
    }

    @Test
    @DisplayName("StrictHttpFirewall rechaza caracteres sospechosos de evasión y traversal")
    void testStrictHttpFirewall_RejectsSuspiciousCharacters() {
        SecurityConfig config = new SecurityConfig(null, authenticationEntryPoint, accessDeniedHandler);
        HttpFirewall firewall = config.httpFirewall();

        // 1. Petición válida estándar
        MockHttpServletRequest validRequest = new MockHttpServletRequest("GET", "/api/v1/servicios");
        assertDoesNotThrow(() -> firewall.getFirewalledRequest(validRequest));

        // 2. Rechazo de punto y coma (Matrix parameters)
        MockHttpServletRequest semicolonRequest = new MockHttpServletRequest("GET", "/api/v1/servicios;jsessionid=123");
        assertThrows(RequestRejectedException.class, () -> firewall.getFirewalledRequest(semicolonRequest));

        // 3. Rechazo de barra invertida (Backslash traversal)
        MockHttpServletRequest backslashRequest = new MockHttpServletRequest("GET", "/api/v1\\servicios");
        assertThrows(RequestRejectedException.class, () -> firewall.getFirewalledRequest(backslashRequest));
    }

    @Test
    @DisplayName("corsConfigurationSource autoriza orígenes permitidos de producción y comodines de subdominio")
    void testCorsConfigurationSource_ValidatesAllowedOrigins() {
        SecurityConfig config = new SecurityConfig(null, authenticationEntryPoint, accessDeniedHandler);
        org.springframework.test.util.ReflectionTestUtils.setField(
                config,
                "allowedOrigins",
                "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,https://clinicalorder.eliasdelcastillo.com,https://clinicalorder.onrender.com"
        );
        org.springframework.web.cors.CorsConfigurationSource source = config.corsConfigurationSource();

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/api/v1/chat/gemini");

        org.springframework.web.cors.CorsConfiguration corsConfig = source.getCorsConfiguration(request);
        assertNotNull(corsConfig);
        assertTrue(corsConfig.getAllowedOriginPatterns().contains("https://*.eliasdelcastillo.com"));
        assertTrue(corsConfig.getAllowedOriginPatterns().contains("https://clinicalorder.eliasdelcastillo.com"));
        assertTrue(corsConfig.getAllowCredentials());
    }
}
