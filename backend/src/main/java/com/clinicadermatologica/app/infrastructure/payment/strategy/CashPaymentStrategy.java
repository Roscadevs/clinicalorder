package com.clinicadermatologica.app.infrastructure.payment.strategy;

import com.clinicadermatologica.app.application.strategy.PaymentRegistrationStrategy;
import com.clinicadermatologica.app.domain.model.*;
import com.clinicadermatologica.app.domain.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * PATRÓN DE DISEÑO: Strategy — Implementación concreta para pagos en efectivo.
 *
 * El pago en efectivo se registra directamente como APPROVED ya que el personal
 * de mostrador confirma el cobro físicamente en el momento del registro.
 * El campo registeredBy es obligatorio para trazabilidad del personal responsable.
 */
@Component
@RequiredArgsConstructor
public class CashPaymentStrategy implements PaymentRegistrationStrategy {

    private final PaymentTransactionRepository paymentTransactionRepository;

    @Override
    public PaymentType supportedType() {
        return PaymentType.CASH;
    }

    @Override
    public PaymentTransaction register(Appointment appointment,
                                       BigDecimal amount,
                                       PaymentConcept concept,
                                       User registeredBy,
                                       String preferenceId) {
        PaymentTransaction transaction = PaymentTransaction.builder()
                .appointment(appointment)
                .paymentType(PaymentType.CASH)
                .paymentConcept(concept)
                .amount(amount)
                .status(PaymentStatus.APPROVED) // Cobro confirmado de inmediato por el personal de mostrador
                .registeredByUser(registeredBy)
                .paymentDate(Instant.now())
                .build();

        return paymentTransactionRepository.save(transaction);
    }
}
