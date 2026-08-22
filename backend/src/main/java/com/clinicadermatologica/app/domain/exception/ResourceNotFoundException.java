package com.clinicadermatologica.app.domain.exception;

/**
 * Excepción de Dominio arrojada cuando un recurso solicitado por ID no existe en el sistema.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message); // Pasa el mensaje descriptivo a la clase base RuntimeException
    }
}
