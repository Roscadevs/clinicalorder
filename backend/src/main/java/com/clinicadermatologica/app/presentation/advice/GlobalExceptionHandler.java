package com.clinicadermatologica.app.presentation.advice;

import com.clinicadermatologica.app.domain.exception.*; // Excepciones del dominio
import jakarta.servlet.http.HttpServletRequest; // Petición HTTP
import lombok.extern.slf4j.Slf4j; // Logger
import org.springframework.http.*; // Entidades y códigos HTTP
import org.springframework.security.access.AccessDeniedException; // Excepción de autorización
import org.springframework.validation.FieldError; // Errores de validación de campos
import org.springframework.web.bind.MethodArgumentNotValidException; // Captura de fallo de @Valid
import org.springframework.web.bind.annotation.*; // Anotaciones de controlador REST

import java.time.Instant; // Tiempo UTC
import java.util.*; // Colecciones

/**
 * Interceptor global de excepciones que unifica las respuestas de error en formato JSON estándar.
 */
@RestControllerAdvice // Marca la clase como capturadora transversal de errores para todos los controladores
@Slf4j // Logger
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class) // Captura recurso no encontrado
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
        return buildErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request.getRequestURI()); // HTTP 404
    }

    @ExceptionHandler(SlotUnavailableException.class) // Captura colisión o sobreturno
    public ResponseEntity<Map<String, Object>> handleSlotUnavailable(SlotUnavailableException ex, HttpServletRequest request) {
        return buildErrorResponse(HttpStatus.CONFLICT, ex.getMessage(), request.getRequestURI()); // HTTP 409 Conflict
    }

    @ExceptionHandler(DuplicateResourceException.class) // Captura recurso duplicado (ej. alergia, habito, antecedente)
    public ResponseEntity<Map<String, Object>> handleDuplicate(DuplicateResourceException ex, HttpServletRequest request) {
        return buildErrorResponse(HttpStatus.CONFLICT, ex.getMessage(), request.getRequestURI()); // HTTP 409 Conflict
    }

    @ExceptionHandler(BusinessRuleException.class) // Captura violación de regla de negocio
    public ResponseEntity<Map<String, Object>> handleBusinessRule(BusinessRuleException ex, HttpServletRequest request) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), request.getRequestURI()); // HTTP 400 Bad Request
    }

    @ExceptionHandler(UnauthorizedAccessException.class) // Captura intento no autorizado
    public ResponseEntity<Map<String, Object>> handleUnauthorized(UnauthorizedAccessException ex, HttpServletRequest request) {
        return buildErrorResponse(HttpStatus.FORBIDDEN, ex.getMessage(), request.getRequestURI()); // HTTP 403 Forbidden
    }

    @ExceptionHandler(AccessDeniedException.class) // Captura fallo de @PreAuthorize de Spring Security
    public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        return buildErrorResponse(HttpStatus.FORBIDDEN, "Acceso denegado: No cuenta con los privilegios requeridos", request.getRequestURI());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class) // Captura errores de validación de campos @Valid
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Error de Validación en los campos enviados");
        body.put("details", fieldErrors);
        body.put("path", request.getRequestURI());

        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(PaymentGatewayException.class)
    public ResponseEntity<Map<String, Object>> handlePaymentGateway(PaymentGatewayException ex, HttpServletRequest request) {
        log.error("Falla en pasarela de pagos al procesar {}: {}", request.getRequestURI(), ex.getMessage());
        return buildErrorResponse(HttpStatus.BAD_GATEWAY, ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(Exception.class) // Captura genérica de excepciones inesperadas
    public ResponseEntity<Map<String, Object>> handleGeneralException(Exception ex, HttpServletRequest request) {
        log.error("Error no controlado en {}: {}", request.getRequestURI(), ex.getMessage(), ex);
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Ha ocurrido un error interno en el servidor", request.getRequestURI());
    }

    private ResponseEntity<Map<String, Object>> buildErrorResponse(HttpStatus status, String message, String path) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        body.put("path", path);
        return ResponseEntity.status(status).body(body);
    }
}
