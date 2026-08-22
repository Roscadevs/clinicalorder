package com.clinicadermatologica.app.presentation.dto;

import com.clinicadermatologica.app.domain.model.UserRole; // Enum de roles
import jakarta.validation.constraints.Email; // Validador de formato de email
import jakarta.validation.constraints.NotBlank; // Validador de no blanco
import jakarta.validation.constraints.NotNull; // Validador de no nulo
import jakarta.validation.constraints.Size; // Validador de tamaño
import lombok.*; // Generadores Lombok

/**
 * DTO para creación de un nuevo usuario operador por parte del administrador.
 */
@Getter // Genera getters
@Setter // Genera setters
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
public class RegisterUserRequestDTO {

    @NotBlank(message = "El nombre de usuario es obligatorio")
    @Size(min = 3, max = 50, message = "El nombre de usuario debe tener entre 3 y 50 caracteres")
    private String username;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String password;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El formato de correo electrónico no es válido")
    private String email;

    @NotBlank(message = "El nombre completo es obligatorio")
    private String fullName;

    @NotNull(message = "El rol es obligatorio")
    private UserRole role;
}
