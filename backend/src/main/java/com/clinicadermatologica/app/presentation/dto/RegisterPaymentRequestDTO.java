package com.clinicadermatologica.app.presentation.dto;

import com.clinicadermatologica.app.domain.model.PaymentType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

/**
 * DTO del caso de uso "Registrar Pago" para la seña de un turno reservado por el staff.
 * El medio de pago manual es CASH o BANK_TRANSFER; el pago virtual (MERCADOPAGO) se
 * acredita automáticamente por webhook y no se registra por este endpoint.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterPaymentRequestDTO {

    @NotNull(message = "El medio de pago es obligatorio")
    private PaymentType paymentType;

    @NotNull(message = "El monto abonado es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a cero")
    private BigDecimal amount;
}
