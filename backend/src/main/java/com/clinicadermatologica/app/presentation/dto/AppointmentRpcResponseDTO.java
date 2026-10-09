package com.clinicadermatologica.app.presentation.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * DTO de salida con los datos del turno programado en Supabase vía RPC.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentRpcResponseDTO {

    private Long citaId;
    private Long pacienteId;
    private Long servicioId;
    private Long doctorId;
    private Instant startTime;
    private Instant endTime;
    private String status;
    private BigDecimal agreedPrice;
    private Long followUpToId;
    private String message;
    private Instant timestamp;
}
