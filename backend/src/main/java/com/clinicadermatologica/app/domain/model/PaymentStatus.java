package com.clinicadermatologica.app.domain.model;

/**
 * Enumeración con los estados de una transacción de pago.
 */
public enum PaymentStatus {
    PENDING,  // Pago iniciado y pendiente de procesamiento
    APPROVED, // Pago aprobado y acreditado satisfactoriamente
    REJECTED, // Pago denegado o rechazado por fondos insuficientes o fraude
    REFUNDED  // Pago reembolsado al paciente tras una cancelación
}
