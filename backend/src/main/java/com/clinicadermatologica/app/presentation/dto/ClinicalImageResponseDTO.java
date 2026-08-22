package com.clinicadermatologica.app.presentation.dto;

import lombok.*; // Generadores Lombok

import java.time.Instant; // Tiempo UTC

/**
 * DTO con los metadatos y URL segura para visualización de fotos médicas.
 */
@Getter // Genera getters
@Setter // Genera setters
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
public class ClinicalImageResponseDTO {
    private Long id;
    private Long medicalRecordId;
    private String filePath;
    private String originalFilename;
    private String contentType;
    private Long fileSize;
    private String description;
    private String accessUrl; // URL firmada o pública para renderizado en frontend
    private Instant uploadedAt;
}
