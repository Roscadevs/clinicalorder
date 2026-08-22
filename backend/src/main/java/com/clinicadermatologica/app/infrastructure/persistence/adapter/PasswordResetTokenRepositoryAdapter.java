package com.clinicadermatologica.app.infrastructure.persistence.adapter;

import com.clinicadermatologica.app.domain.model.PasswordResetToken; // Entidad del dominio
import com.clinicadermatologica.app.domain.repository.PasswordResetTokenRepository; // Interfaz del dominio
import com.clinicadermatologica.app.infrastructure.persistence.jpa.JpaPasswordResetTokenRepository; // JPA Repository
import lombok.RequiredArgsConstructor; // Inyección por constructor
import org.springframework.stereotype.Component; // Componente Spring

import java.util.Optional; // Contenedor opcional

/**
 * Adaptador de infraestructura para la persistencia de tokens de recuperación de contraseñas.
 */
@Component // Componente Spring
@RequiredArgsConstructor // Inyección por constructor
public class PasswordResetTokenRepositoryAdapter implements PasswordResetTokenRepository {

    private final JpaPasswordResetTokenRepository jpaRepository; // Inyección del repositorio JPA

    @Override
    public Optional<PasswordResetToken> findByToken(String token) {
        return jpaRepository.findByToken(token); // Delega la consulta
    }

    @Override
    public PasswordResetToken save(PasswordResetToken resetToken) {
        return jpaRepository.save(resetToken); // Persiste el token
    }
}
