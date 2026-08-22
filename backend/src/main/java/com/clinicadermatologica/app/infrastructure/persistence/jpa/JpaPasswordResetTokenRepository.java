package com.clinicadermatologica.app.infrastructure.persistence.jpa;

import com.clinicadermatologica.app.domain.model.PasswordResetToken; // Entidad PasswordResetToken
import org.springframework.data.jpa.repository.JpaRepository; // Spring Data JPA
import org.springframework.stereotype.Repository; // Componente de repositorio

import java.util.Optional; // Contenedor opcional

/**
 * Repositorio Spring Data JPA para tokens de restablecimiento de contraseña.
 */
@Repository // Componente Spring Data
public interface JpaPasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token); // Consulta: SELECT t FROM PasswordResetToken t WHERE t.token = :token
}
