package com.clinicadermatologica.app.domain.model;

/**
 * Enumeración con los estados del ciclo de vida de una cita (Turno).
 */
public enum AppointmentStatus {
    PENDING_PAYMENT, // Bloqueado temporalmente (10 min) esperando el pago de la seña del 50%
    CONFIRMED,       // Seña abonada y confirmada exitosamente en MercadoPago
    CANCELLED,       // Turno cancelado por el paciente o la clínica antes de la atención
    COMPLETED,       // Atención médica y cobro del saldo final concluidos con éxito
    PAYMENT_FAILED,  // Expiró el plazo de 10 minutos o el pago fue rechazado por la pasarela
    NO_SHOW          // El paciente no asistió al turno reservado
}
