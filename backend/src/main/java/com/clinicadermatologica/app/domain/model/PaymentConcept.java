package com.clinicadermatologica.app.domain.model;

/**
 * Enumeración que define el concepto o propósito de una transacción de pago.
 * Se complementa con PaymentType (canal) para describir completamente un pago.
 *
 * DEPOSIT: Seña abonada para confirmar la reserva. Una vez aprobada, la cita pasa a CONFIRMED.
 * BALANCE: Saldo restante abonado al finalizar la sesión. Una vez aprobado, la cita pasa a COMPLETED.
 * FULL:    Pago total en una única transacción, equivalente a seña + saldo.
 *          Solo permitido cuando la cita está en estado PENDING_PAYMENT.
 *          Una vez aprobado, la cita pasa directamente a CONFIRMED.
 */
public enum PaymentConcept {
    DEPOSIT, // Seña requerida para confirmar la reserva
    BALANCE, // Saldo final abonado al concluir la sesión
    FULL     // Pago completo en una sola transacción (reemplaza seña + saldo)
}
