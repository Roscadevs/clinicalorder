package com.clinicadermatologica.app.presentation.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * DTO de salida tras registrar un pago en Supabase vía RPC.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRpcResponseDTO {

    private Long paymentId;
    private Long citaId;
    private BigDecimal amount;
    private String status;
    private String message;
    private Instant timestamp;
}
