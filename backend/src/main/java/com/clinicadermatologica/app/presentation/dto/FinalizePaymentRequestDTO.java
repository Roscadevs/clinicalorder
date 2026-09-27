package com.clinicadermatologica.app.presentation.dto;

import com.clinicadermatologica.app.domain.model.PaymentType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

/**
 * DTO para registrar la liquidación final del saldo en mostrador.
 * El campo paymentType indica el canal utilizado (CASH, BANK_TRANSFER o MERCADOPAGO).
 * El concepto del pago (BALANCE) es siempre implícito en la operación de liquidación final.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinalizePaymentRequestDTO {

    @NotNull(message = "El tipo de pago es obligatorio")
    private PaymentType paymentType; // Canal: CASH, BANK_TRANSFER, MERCADOPAGO

    @NotNull(message = "El monto abonado es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a cero")
    private BigDecimal amount;
}
