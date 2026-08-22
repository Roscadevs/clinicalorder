package com.clinicadermatologica.app.presentation.dto;

import jakarta.validation.constraints.Email; // Validación de formato de email
import jakarta.validation.constraints.NotBlank; // Valida que no esté vacío
import lombok.*; // Generadores Lombok

/**
 * DTO para solicitar el restablecimiento de contraseña mediante correo.
 */
@Getter // Genera getters
@Setter // Genera setters
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
public class ForgotPasswordRequestDTO {

    @NotBlank(message = "El correo electrónico es obligatorio")
    @Email(message = "Formato de correo no válido")
    private String email;
}
