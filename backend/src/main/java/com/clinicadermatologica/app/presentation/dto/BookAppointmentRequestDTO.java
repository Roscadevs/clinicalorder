package com.clinicadermatologica.app.presentation.dto;

import jakarta.validation.constraints.NotNull; // Validación de no nulo
import lombok.*; // Generadores Lombok

import java.time.Instant; // Tiempo UTC

/**
 * DTO para solicitar la reserva de un turno con bloqueo temporal de 10 minutos.
 */
@Getter // Genera getters
@Setter // Genera setters
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
public class BookAppointmentRequestDTO {

    @NotNull(message = "El ID del paciente es obligatorio")
    private Long patientId;

    @NotNull(message = "El ID del servicio es obligatorio")
    private Long serviceId;

    @NotNull(message = "La fecha y hora de inicio del turno es obligatoria")
    private Instant startTime;

    private Long followUpToId; // ID de cita previa en caso de ser control (opcional)
}
