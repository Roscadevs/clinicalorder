package com.clinicadermatologica.app.presentation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

/**
 * DTO para redactar o actualizar una nota de evolución médica de una sesión.
 *
 * medicalRecordId eliminado: el servicio resuelve la historia clínica a través de
 * appointment → patient → medicalRecord, eliminando el riesgo de inconsistencia entre FKs.
 *
 * content viaja como String en el DTO (texto en claro).
 * MedicalRecordService cifra con AES-256-GCM antes de persistir.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClinicalEntryRequestDTO {

    @NotNull(message = "El ID de la cita asociada es obligatorio")
    private Long appointmentId;

    @NotBlank(message = "El contenido clínico de evolución es obligatorio")
    private String content; // Texto en claro; cifrado por MedicalRecordService antes de persistir
}
