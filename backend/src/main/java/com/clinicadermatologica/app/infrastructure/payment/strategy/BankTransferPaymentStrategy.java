package com.clinicadermatologica.app.infrastructure.payment.strategy;

import com.clinicadermatologica.app.application.strategy.PaymentRegistrationStrategy;
import com.clinicadermatologica.app.domain.model.*;
import com.clinicadermatologica.app.domain.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * PATRÓN DE DISEÑO: Strategy — Implementación concreta para pagos por transferencia bancaria.
 *
 * Al igual que el efectivo, la transferencia se verifica manualmente por el personal
 * antes de registrarla, por lo que se persiste directamente como APPROVED.
 * El campo registeredBy es obligatorio para trazabilidad del personal responsable.
 */
@Component
@RequiredArgsConstructor
public class BankTransferPaymentStrategy implements PaymentRegistrationStrategy {

    private final PaymentTransactionRepository paymentTransactionRepository;

    @Override
    public PaymentType supportedType() {
        return PaymentType.BANK_TRANSFER;
    }

    @Override
    public PaymentTransaction register(Appointment appointment,
                                       BigDecimal amount,
                                       PaymentConcept concept,
                                       User registeredBy,
                                       String preferenceId) {
        PaymentTransaction transaction = PaymentTransaction.builder()
                .appointment(appointment)
                .paymentType(PaymentType.BANK_TRANSFER)
                .paymentConcept(concept)
                .amount(amount)
                .status(PaymentStatus.APPROVED) // Transferencia verificada manualmente antes del registro
                .registeredByUser(registeredBy)
                .paymentDate(Instant.now())
                .build();

        return paymentTransactionRepository.save(transaction);
    }
}
