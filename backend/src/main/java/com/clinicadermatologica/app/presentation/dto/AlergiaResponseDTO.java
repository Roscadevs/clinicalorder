package com.clinicadermatologica.app.presentation.dto;

import lombok.*;

import java.time.Instant;

/**
 * DTO de respuesta con los datos de una alergia registrada en la historia clínica.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlergiaResponseDTO {
    private Long medicalRecordId;
    private String tipo;
    private String observaciones;
    private Instant createdAt;
    private Instant updatedAt;
}
