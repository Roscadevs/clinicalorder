package com.clinicadermatologica.app.presentation.dto;

import jakarta.validation.constraints.Email; // Valida formato email
import jakarta.validation.constraints.NotBlank; // Valida no blanco
import jakarta.validation.constraints.Pattern; // Valida expresión regular
import jakarta.validation.constraints.Size; // Valida longitud
import lombok.*; // Generadores Lombok

import java.time.LocalDate; // Fecha sin hora

/**
 * DTO para creación o actualización de un paciente.
 */
@Getter // Genera getters
@Setter // Genera setters
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
public class PatientRequestDTO {

    @NotBlank(message = "El nombre del paciente es obligatorio")
    @Size(min = 1, max = 100, message = "El nombre debe tener entre 1 y 100 caracteres")
    private String name;

    @NotBlank(message = "El DNI es obligatorio")
    @Pattern(regexp = "^[0-9]{7,8}$", message = "El DNI debe contener 7 u 8 dígitos numéricos")
    private String dni;

    @NotBlank(message = "El teléfono es obligatorio")
    private String phone;

    @NotBlank(message = "El correo electrónico es obligatorio")
    @Email(message = "Formato de email inválido")
    private String email;

    private LocalDate birthDate; // Fecha de nacimiento (opcional)
    private String profession; // Profesión u ocupación (opcional)
}
