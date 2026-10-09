package com.clinicadermatologica.app.presentation.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * DTO de entrada para registrar un pago atómico asociado a una cita vía Supabase RPC.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterPaymentRpcRequestDTO {

    @NotNull(message = "El ID de la cita es obligatorio")
    private Long citaId;

    @NotBlank(message = "El tipo de pago es obligatorio")
    @Pattern(regexp = "^(MERCADOPAGO|CASH|BANK_TRANSFER)$", message = "Tipo de pago inválido. Permitidos: MERCADOPAGO, CASH, BANK_TRANSFER")
    private String paymentType;

    @NotBlank(message = "El concepto de pago es obligatorio")
    @Pattern(regexp = "^(DEPOSIT|BALANCE|FULL)$", message = "Concepto de pago inválido. Permitidos: DEPOSIT, BALANCE, FULL")
    private String paymentConcept;

    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a cero")
    private BigDecimal amount;

    @NotBlank(message = "El estado del pago es obligatorio")
    @Pattern(regexp = "^(PENDING|APPROVED|REJECTED|REFUNDED)$", message = "Estado inválido. Permitidos: PENDING, APPROVED, REJECTED, REFUNDED")
    private String status;

    private Long registeredByUserId;
    private String mpPreferenceId;
    private String mpPaymentId;
}
