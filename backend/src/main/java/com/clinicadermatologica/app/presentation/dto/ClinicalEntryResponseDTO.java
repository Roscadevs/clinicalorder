package com.clinicadermatologica.app.presentation.dto;

import lombok.*;

import java.time.Instant;

/**
 * DTO de respuesta con los datos de una entrada de evolución clínica.
 *
 * content se expone como String (texto en claro); MedicalRecordService descifra desde BYTEA antes
 * de poblar este DTO. La capa de presentación nunca manipula bytes cifrados.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClinicalEntryResponseDTO {
    private Long id;
    private Long patientId;        // FK directa al paciente (reemplaza medicalRecordId)
    private Long appointmentId;
    private String serviceName;    // Nombre del servicio del turno asociado (para listar por fecha/servicio)
    private Long authorUserId;
    private String authorFullName;
    private String content;        // Texto en claro (descifrado por MedicalRecordService)
    private Instant createdAt;
    private Instant updatedAt;
}
