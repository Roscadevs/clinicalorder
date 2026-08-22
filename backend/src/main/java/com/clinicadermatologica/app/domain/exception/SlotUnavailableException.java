package com.clinicadermatologica.app.domain.exception;

/**
 * Excepción de Dominio arrojada cuando se intenta reservar un horario ya ocupado o en bloqueo temporal.
 */
public class SlotUnavailableException extends RuntimeException {
    public SlotUnavailableException(String message) {
        super(message); // Transmite el mensaje a RuntimeException
    }
}
