package com.clinicadermatologica.app.presentation.dto;

import lombok.*; // Generadores Lombok

import java.time.Instant; // Tiempo UTC

/**
 * DTO que representa una franja horaria calculada para reserva de turnos.
 */
@Getter // Genera getters
@Setter // Genera setters
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
public class TimeSlotDTO {
    private Instant startTime; // Hora de inicio del slot
    private Instant endTime; // Hora de fin del slot según duración del servicio
    private String timeDisplay; // Formato legible de hora (ej. '15:00 hs')
    private Boolean available; // Disponibilidad real calculada (true si no colisiona)
}
