package com.clinicadermatologica.app.presentation.dto;

import com.clinicadermatologica.app.domain.model.PaymentType; // Enum de tipo de pago
import jakarta.validation.constraints.DecimalMin; // Validación de valor decimal mínimo
import jakarta.validation.constraints.NotNull; // Validación de no nulo
import lombok.*; // Generadores Lombok

import java.math.BigDecimal; // Precisión decimal

/**
 * DTO para registrar la liquidación final del saldo en mostrador (efectivo, POS, transferencia).
 */
@Getter // Genera getters
@Setter // Genera setters
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
public class FinalizePaymentRequestDTO {

    @NotNull(message = "El tipo de pago es obligatorio")
    private PaymentType paymentType;

    @NotNull(message = "El monto abonado es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a cero")
    private BigDecimal amount;
}
