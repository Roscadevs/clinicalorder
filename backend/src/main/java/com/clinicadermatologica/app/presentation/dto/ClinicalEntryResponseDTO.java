package com.clinicadermatologica.app.presentation.dto;

import lombok.*; // Generadores Lombok

import java.time.Instant; // Tiempo UTC

/**
 * DTO de respuesta con los datos de una entrada de evolución clínica.
 */
@Getter // Genera getters
@Setter // Genera setters
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
public class ClinicalEntryResponseDTO {
    private Long id;
    private Long medicalRecordId;
    private Long appointmentId;
    private Long authorUserId;
    private String authorFullName;
    private String content;
    private Instant createdAt;
    private Instant updatedAt;
}
