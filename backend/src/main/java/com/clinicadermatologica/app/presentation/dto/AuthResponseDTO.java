package com.clinicadermatologica.app.presentation.dto;

import com.clinicadermatologica.app.domain.model.UserRole; // Enum de roles de usuario
import lombok.*; // Generadores Lombok

/**
 * DTO de respuesta con token JWT y datos de sesión tras un login exitoso.
 */
@Getter // Genera getters
@Setter // Genera setters
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
public class AuthResponseDTO {

    private String token; // Token JWT firmado para incluir en cabecera Authorization Bearer
    private String tokenType; // Tipo de token ('Bearer')
    private Long userId; // Identificador único del usuario
    private String username; // Nombre de usuario
    private String fullName; // Nombre completo para mostrar en la interfaz
    private UserRole role; // Rol RBAC asignado (ADMIN, DOCTORA, SECRETARIA)
    private Long expiresInMs; // Milisegundos de vigencia del token
}
