package com.clinicadermatologica.app.presentation.dto;

import com.clinicadermatologica.app.domain.model.AppointmentStatus; // Enum de estados
import lombok.*; // Generadores Lombok

import java.math.BigDecimal; // Precisión decimal
import java.time.Instant; // Tiempo UTC

/**
 * DTO de respuesta detallada de una cita o turno.
 */
@Getter // Genera getters
@Setter // Genera setters
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
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
    private Instant temporaryHoldDeadline;
    private Integer rescheduleCount;
    private Long version;
}
