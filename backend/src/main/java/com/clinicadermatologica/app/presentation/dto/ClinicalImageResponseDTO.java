package com.clinicadermatologica.app.presentation.dto;

import lombok.*;

import java.time.Instant;

/**
 * DTO con los metadatos y URL segura para visualizacion de fotos medicas.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClinicalImageResponseDTO {
    private Long id;
    private Long clinicalEntryId;  // Reemplaza medicalRecordId — imagen asociada a una entrada clinica
    private String filePath;
    private String originalFilename;
    private String contentType;
    private Long fileSize;
    private String description;
    private String accessUrl;
    private Instant uploadedAt;
}
