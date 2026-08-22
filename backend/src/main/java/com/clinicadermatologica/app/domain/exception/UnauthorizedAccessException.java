package com.clinicadermatologica.app.domain.exception;

/**
 * Excepción arrojada cuando un usuario intenta acceder a una sección confidencial sin el rol adecuado (ej. Secretaria a Historia Clínica).
 */
public class UnauthorizedAccessException extends RuntimeException {
    public UnauthorizedAccessException(String message) {
        super(message); // Transmite el mensaje a RuntimeException
    }
}
