package com.clinicadermatologica.app.domain.exception;

/**
 * Excepción de Dominio arrojada ante el incumplimiento de una regla de negocio médica o administrativa.
 */
public class BusinessRuleException extends RuntimeException {
    public BusinessRuleException(String message) {
        super(message); // Transmite el mensaje a RuntimeException
    }
}
