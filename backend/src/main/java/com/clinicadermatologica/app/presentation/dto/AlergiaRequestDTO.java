package com.clinicadermatologica.app.presentation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

/**
 * DTO de solicitud para registrar una alergia en la historia clínica de un paciente.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlergiaRequestDTO {

    @NotBlank(message = "El tipo de alergia es obligatorio")
    @Size(max = 100, message = "El tipo de alergia no puede superar los 100 caracteres")
    private String tipo;

    @Size(max = 500, message = "Las observaciones no pueden superar los 500 caracteres")
    private String observaciones;
}
