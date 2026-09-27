package com.clinicadermatologica.app.domain.model;

/**
 * Enumeración que define el tipo (canal) de pago utilizado en una transacción.
 *
 * Se complementa con PaymentConcept (propósito del pago: DEPOSIT, BALANCE, FULL).
 * PaymentType describe CÓMO se paga; PaymentConcept describe PARA QUÉ se paga.
 */
public enum PaymentType {
    MERCADOPAGO,    // Pago procesado en línea a través de la plataforma MercadoPago (billetera digital)
    CASH,           // Pago en efectivo registrado manualmente en el mostrador
    BANK_TRANSFER   // Pago por transferencia bancaria registrado manualmente en el mostrador
}
