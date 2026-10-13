package com.clinicadermatologica.app.presentation.advice;

import com.clinicadermatologica.app.domain.exception.BusinessRuleException;
import com.clinicadermatologica.app.domain.exception.ResourceNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Pruebas unitarias para GlobalExceptionHandler verificando cumplimiento de RFC 7807 Problem Details.
 */
class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    @DisplayName("handleBusinessRule debe retornar status 400 y formato RFC 7807")
    void handleBusinessRuleShouldReturnRfc7807ProblemDetail() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/api/v1/servicios/1");

        BusinessRuleException ex = new BusinessRuleException("Ya existe otro tratamiento registrado con el nombre Peeling");

        ResponseEntity<Map<String, Object>> response = handler.handleBusinessRule(ex, request);

        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(MediaType.APPLICATION_PROBLEM_JSON, response.getHeaders().getContentType());

        Map<String, Object> body = response.getBody();
        assertNotNull(body);
        assertEquals("about:blank", body.get("type"));
        assertEquals("Bad Request", body.get("title"));
        assertEquals(400, body.get("status"));
        assertEquals("Ya existe otro tratamiento registrado con el nombre Peeling", body.get("detail"));
        assertEquals("/api/v1/servicios/1", body.get("instance"));
    }

    @Test
    @DisplayName("handleNotFound debe retornar status 404 y formato RFC 7807")
    void handleNotFoundShouldReturnRfc7807ProblemDetail() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/api/v1/servicios/999");

        ResourceNotFoundException ex = new ResourceNotFoundException("Servicio no encontrado con ID 999");

        ResponseEntity<Map<String, Object>> response = handler.handleNotFound(ex, request);

        assertNotNull(response);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(MediaType.APPLICATION_PROBLEM_JSON, response.getHeaders().getContentType());

        Map<String, Object> body = response.getBody();
        assertNotNull(body);
        assertEquals(404, body.get("status"));
        assertEquals("Servicio no encontrado con ID 999", body.get("detail"));
    }

    @Test
    @DisplayName("handleValidationErrors debe retornar status 400 con MediaType RFC 7807 y campo detail legible")
    void handleValidationErrorsShouldReturnRfc7807ProblemDetail() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/api/v1/servicios");

        MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
        BindingResult bindingResult = mock(BindingResult.class);
        FieldError fieldError = new FieldError("serviceRequestDTO", "durationMinutes", "La duración mínima es de 10 minutos");

        when(ex.getBindingResult()).thenReturn(bindingResult);
        when(bindingResult.getFieldErrors()).thenReturn(List.of(fieldError));

        ResponseEntity<Map<String, Object>> response = handler.handleValidationErrors(ex, request);

        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(MediaType.APPLICATION_PROBLEM_JSON, response.getHeaders().getContentType());

        Map<String, Object> body = response.getBody();
        assertNotNull(body);
        assertEquals("about:blank", body.get("type"));
        assertEquals(400, body.get("status"));
        assertEquals("La duración mínima es de 10 minutos", body.get("detail"));
        assertEquals("La duración mínima es de 10 minutos", body.get("message"));
        assertTrue(body.containsKey("details"));
        @SuppressWarnings("unchecked")
        Map<String, String> details = (Map<String, String>) body.get("details");
        assertEquals("La duración mínima es de 10 minutos", details.get("durationMinutes"));
    }
}
