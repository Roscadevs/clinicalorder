package com.clinicadermatologica.app.presentation.dto;

import com.clinicadermatologica.app.domain.model.UserRole;
import lombok.*;

import java.time.Instant;

/**
 * DTO para transferir información de un usuario operador del staff hacia el frontend.
 * SEGURIDAD CRIPTOGRÁFICA: No expone el campo passwordHash bajo ninguna circunstancia.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private UserRole role;
    private Boolean active;
    private Instant createdAt;
    private Instant updatedAt;
}
