package com.clinicadermatologica.app.domain.model;

/**
 * Enumeración con los estados del ciclo de vida de una cita (Turno).
 */
public enum AppointmentStatus {
    PENDING_PAYMENT, // Esperando el pago de la seña para confirmar la reserva
    CONFIRMED,       // Seña abonada y confirmada exitosamente
    ATTENDED,        // El médico atendió al paciente (acto clínico); pendiente de cobro del saldo
    CANCELED,        // Turno cancelado por el paciente o la clínica antes de la atención
    COMPLETED,       // Atención médica y cobro del saldo final concluidos con éxito
    PAYMENT_FAILED,  // El pago fue rechazado o no se completó
    NO_SHOW          // El paciente no asistió al turno reservado
}
