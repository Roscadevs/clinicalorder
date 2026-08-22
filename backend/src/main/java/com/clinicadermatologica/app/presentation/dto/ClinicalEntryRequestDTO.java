package com.clinicadermatologica.app.presentation.dto;

import jakarta.validation.constraints.NotBlank; // Valida texto no blanco
import jakarta.validation.constraints.NotNull; // Valida no nulo
import lombok.*; // Generadores Lombok

/**
 * DTO para redactar o actualizar una nota de evolución médica de una sesión.
 */
@Getter // Genera getters
@Setter // Genera setters
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
public class ClinicalEntryRequestDTO {

    @NotNull(message = "El ID de la historia clínica es obligatorio")
    private Long medicalRecordId;

    @NotNull(message = "El ID de la cita asociada es obligatorio")
    private Long appointmentId;

    @NotBlank(message = "El contenido clínico de evolución es obligatorio")
    private String content; // Descripción de procedimiento, dosis, zonas y cuidados
}
