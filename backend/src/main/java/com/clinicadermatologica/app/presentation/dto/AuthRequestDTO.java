package com.clinicadermatologica.app.presentation.dto;

import jakarta.validation.constraints.NotBlank; // Valida que el texto no sea nulo ni vacío
import jakarta.validation.constraints.Size; // Valida tamaño de cadena
import lombok.*; // Lombok getters, setters, builder

/**
 * DTO para la solicitud de inicio de sesión.
 */
@Getter // Genera getters
@Setter // Genera setters
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
public class AuthRequestDTO {

    @NotBlank(message = "El nombre de usuario es obligatorio") // Restricción de validación
    private String username;

    @NotBlank(message = "La contraseña es obligatoria") // Restricción de validación
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres") // Longitud mínima
    private String password;
}
