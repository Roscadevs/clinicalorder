package com.clinicadermatologica.app.presentation.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * DTO retornado al cliente cuando se genera una reserva con link de pago de MercadoPago.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentPreferenceResponseDTO {
    private Long appointmentId;  // ID del turno generado en estado PENDING_PAYMENT
    private String preferenceId; // ID de preferencia de MercadoPago
    private String initPointUrl; // URL de Checkout Pro de MercadoPago
    private BigDecimal depositAmount; // Monto de la seña o pago completo
    private Instant holdExpiresAt; // Vencimiento del bloqueo temporal (10 minutos)
}
