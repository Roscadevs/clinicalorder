package com.clinicadermatologica.app.presentation.dto;

import lombok.*; // Generadores Lombok

import java.time.Instant; // Tiempo UTC

/**
 * DTO de respuesta con los datos de un bloqueo de calendario.
 */
@Getter // Genera getters
@Setter // Genera setters
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
public class CalendarBlockResponseDTO {
    private Long id;
    private Long createdByUserId;
    private String createdByUserFullName;
    private Instant startTime;
    private Instant endTime;
    private String reason;
    private Instant createdAt;
}
