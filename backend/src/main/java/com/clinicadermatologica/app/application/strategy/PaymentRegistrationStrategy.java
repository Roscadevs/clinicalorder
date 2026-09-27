package com.clinicadermatologica.app.application.strategy;

import com.clinicadermatologica.app.domain.model.*;

import java.math.BigDecimal;

/**
 * PATRÓN DE DISEÑO: Strategy
 *
 * Define el contrato para el registro de una transacción de pago.
 * Cada tipo de pago (MERCADOPAGO, CASH, BANK_TRANSFER) tiene un comportamiento
 * diferente al procesar y persistir el pago, pero todos cumplen este mismo contrato.
 *
 * El patrón Strategy permite a PaymentService seleccionar y delegar en la estrategia
 * correcta en tiempo de ejecución a través del PaymentStrategyFactory, sin necesidad
 * de bloques if/else sobre el PaymentType en el servicio.
 *
 * Cada implementación concreta reside en infrastructure/payment/strategy/:
 * - MercadoPagoPaymentStrategy  → pagos online a través de la pasarela
 * - CashPaymentStrategy         → pagos en efectivo registrados en mostrador
 * - BankTransferPaymentStrategy → pagos por transferencia bancaria registrados en mostrador
 */
public interface PaymentRegistrationStrategy {

    /**
     * Retorna el PaymentType que esta estrategia implementa.
     * Utilizado por PaymentStrategyFactory para seleccionar la estrategia correcta.
     */
    PaymentType supportedType();

    /**
     * Registra la transacción de pago para la cita indicada.
     *
     * @param appointment   cita a la que corresponde el pago
     * @param amount        monto de la transacción
     * @param concept       concepto del pago (DEPOSIT, BALANCE, FULL)
     * @param registeredBy  usuario que registra el pago; null para pagos automáticos via MercadoPago
     * @param preferenceId  ID de preferencia de MercadoPago; null para pagos manuales
     * @return la transacción persistida
     */
    PaymentTransaction register(Appointment appointment,
                                BigDecimal amount,
                                PaymentConcept concept,
                                User registeredBy,
                                String preferenceId);
}
