package com.clinicadermatologica.app.presentation.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

/**
 * DTO de entrada para la invocación del procedimiento de alta atómica de paciente e historia clínica en Supabase.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePatientRpcRequestDTO {

    @NotBlank(message = "El nombre del paciente es obligatorio")
    @Size(min = 1, max = 100, message = "El nombre debe contener entre 1 y 100 caracteres")
    private String name;

    @NotBlank(message = "El DNI es obligatorio")
    @Pattern(regexp = "^[0-9]{7,8}$", message = "El DNI debe contener 7 u 8 dígitos numéricos sin puntos")
    private String dni;

    @NotBlank(message = "El teléfono de contacto es obligatorio")
    @Size(min = 6, max = 20, message = "El teléfono debe contener entre 6 y 20 caracteres")
    private String phone;

    @NotBlank(message = "El correo electrónico es obligatorio")
    @Email(message = "Formato de correo electrónico inválido")
    private String email;

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    @PastOrPresent(message = "La fecha de nacimiento no puede ser una fecha futura")
    private LocalDate birthDate;

    @NotNull(message = "El ID del médico responsable de la historia clínica es obligatorio")
    private Long doctorId;

    @Min(value = 1, message = "El fototipo de Fitzpatrick mínimo es 1")
    @Max(value = 6, message = "El fototipo de Fitzpatrick máximo es 6")
    @Builder.Default
    private Integer fitzpatrickPhototype = 3;

    @Size(max = 2000, message = "El examen físico no puede superar los 2000 caracteres")
    private String physicalExamination;
}
