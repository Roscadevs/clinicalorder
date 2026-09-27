package com.clinicadermatologica.app.presentation.dto;

import com.clinicadermatologica.app.domain.model.AppointmentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * DTO de respuesta detallada de una cita o turno.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponseDTO {
    private Long id;
    private Long patientId;
    private String patientName;
    private String patientDni;
    private String patientPhone;
    private Long serviceId;
    private String serviceName;
    private Instant startTime;
    private Instant endTime;
    private AppointmentStatus status;
    private BigDecimal agreedPrice;
    private Long followUpToId; // ID de la cita de origen (null si es cita independiente)
}
