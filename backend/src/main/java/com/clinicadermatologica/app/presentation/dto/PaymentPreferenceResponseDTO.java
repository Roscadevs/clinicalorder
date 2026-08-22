package com.clinicadermatologica.app.presentation.dto;

import lombok.*; // Generadores Lombok

import java.math.BigDecimal; // Precisión decimal
import java.time.Instant; // Tiempo UTC

/**
 * DTO retornado al cliente cuando se genera una reserva temporal con link de pago de MercadoPago.
 */
@Getter // Genera getters
@Setter // Genera setters
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
public class PaymentPreferenceResponseDTO {
    private Long appointmentId; // ID del turno generado en estado PENDING_PAYMENT
    private String preferenceId; // ID de preferencia de MercadoPago
    private String initPointUrl; // URL directa de Checkout Pro de MercadoPago
    private BigDecimal depositAmount; // Monto exacto del 50% de la seña
    private Instant holdExpiresAt; // Fecha y hora límite en que vence el bloqueo de 10 minutos
}
