package com.clinicadermatologica.app.domain.repository;

import com.clinicadermatologica.app.domain.model.PasswordResetToken; // Entidad del dominio

import java.util.Optional; // Contenedor opcional

/**
 * Contrato de repositorio para tokens de recuperación de contraseñas.
 */
public interface PasswordResetTokenRepository {
    Optional<PasswordResetToken> findByToken(String token); // Búsqueda de token por cadena criptográfica
    PasswordResetToken save(PasswordResetToken resetToken); // Guarda o actualiza el token
}
