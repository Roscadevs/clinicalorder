package com.clinicadermatologica.app.infrastructure.persistence.dao;

import com.clinicadermatologica.app.domain.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * PATRÓN DAO (Data Access Object) para la entidad PasswordResetToken.
 *
 * Encapsula el acceso a datos de los tokens de recuperación de contraseña mediante
 * Spring Data JPA. Spring genera la implementación en tiempo de ejecución; los
 * servicios dependen directamente de este DAO.
 */
@Repository
public interface PasswordResetTokenDAO extends JpaRepository<PasswordResetToken, Long> {

    /** Busca un token de recuperación por su cadena criptográfica. */
    Optional<PasswordResetToken> findByToken(String token);
}
