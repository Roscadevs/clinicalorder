package com.clinicadermatologica.app.presentation.dto;

import jakarta.validation.constraints.NotBlank; // Valida que no esté vacío
import jakarta.validation.constraints.Size; // Valida longitud mínima
import lombok.*; // Generadores Lombok

/**
 * DTO para ejecutar el cambio de contraseña enviando el token y la nueva clave.
 */
@Getter // Genera getters
@Setter // Genera setters
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
public class ResetPasswordRequestDTO {

    @NotBlank(message = "El token es obligatorio")
    private String token;

    @NotBlank(message = "La nueva contraseña es obligatoria")
    @Size(min = 8, message = "La nueva contraseña debe tener al menos 8 caracteres")
    private String newPassword;
}
