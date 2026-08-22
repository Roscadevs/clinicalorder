package com.clinicadermatologica.app.domain.model;

/**
 * Enumeración que define el tipo de pago de una cita.
 */
public enum PaymentType {
    DEPOSIT_50,       // Seña del 50% abonada online vía MercadoPago para confirmar la reserva
    FINAL_BALANCE_50, // Saldo restante del 50% abonado al concluir la sesión clínica
    FULL_PAYMENT      // Pago del 100% total en una única transacción
}
