package com.clinicadermatologica.app.presentation.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * DTO de entrada para la reserva y alta transaccional de citas vía Supabase RPC.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateAppointmentRpcRequestDTO {

    @NotNull(message = "El ID del paciente es obligatorio")
    private Long pacienteId;

    @NotNull(message = "El ID del servicio es obligatorio")
    private Long servicioId;

    @NotNull(message = "El ID del usuario creador/operador es obligatorio")
    private Long createdByUserId;

    @NotNull(message = "La fecha y hora de inicio es obligatoria")
    private Instant startTime;

    @NotNull(message = "La fecha y hora de fin es obligatoria")
    private Instant endTime;

    @NotNull(message = "El precio acordado es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio acordado debe ser mayor a cero")
    private BigDecimal agreedPrice;

    private Long doctorId; // Opcional: si es nulo se asigna automáticamente la doctora en planta

    private Long followUpToId; // Opcional: ID de la cita origen si es una consulta de seguimiento
}
