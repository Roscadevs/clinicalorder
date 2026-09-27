package com.clinicadermatologica.app.infrastructure.payment.strategy;

import com.clinicadermatologica.app.application.strategy.PaymentRegistrationStrategy;
import com.clinicadermatologica.app.domain.model.*;
import com.clinicadermatologica.app.domain.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * PATRÓN DE DISEÑO: Strategy — Implementación concreta para pagos vía MercadoPago.
 *
 * Registra la transacción indicando que el canal es MERCADOPAGO.
 * El mpPreferenceId se incluye para que el webhook pueda encontrar esta transacción
 * y actualizar su estado cuando MercadoPago notifique el resultado del pago.
 * La transacción se crea en estado PENDING ya que el resultado es asíncrono.
 */
@Component
@RequiredArgsConstructor
public class MercadoPagoPaymentStrategy implements PaymentRegistrationStrategy {

    private final PaymentTransactionRepository paymentTransactionRepository;

    @Override
    public PaymentType supportedType() {
        return PaymentType.MERCADOPAGO;
    }

    @Override
    public PaymentTransaction register(Appointment appointment,
                                       BigDecimal amount,
                                       PaymentConcept concept,
                                       User registeredBy,
                                       String preferenceId) {
        PaymentTransaction transaction = PaymentTransaction.builder()
                .appointment(appointment)
                .mpPreferenceId(preferenceId) // Necesario para lookup en el webhook
                .paymentType(PaymentType.MERCADOPAGO)
                .paymentConcept(concept)
                .amount(amount)
                .status(PaymentStatus.PENDING) // El estado se actualiza cuando MercadoPago notifica
                .build();

        return paymentTransactionRepository.save(transaction);
    }
}
