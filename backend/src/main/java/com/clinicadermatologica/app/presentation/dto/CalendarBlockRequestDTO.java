package com.clinicadermatologica.app.presentation.dto;

import jakarta.validation.constraints.NotBlank; // Valida no blanco
import jakarta.validation.constraints.NotNull; // Valida no nulo
import lombok.*; // Generadores Lombok

import java.time.Instant; // Tiempo UTC

/**
 * DTO para crear un bloqueo de indisponibilidad en la agenda.
 */
@Getter // Genera getters
@Setter // Genera setters
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
public class CalendarBlockRequestDTO {

    @NotNull(message = "La fecha y hora de inicio es obligatoria")
    private Instant startTime;

    @NotNull(message = "La fecha y hora de fin es obligatoria")
    private Instant endTime;

    @NotBlank(message = "El motivo del bloqueo es obligatorio")
    private String reason;
}
