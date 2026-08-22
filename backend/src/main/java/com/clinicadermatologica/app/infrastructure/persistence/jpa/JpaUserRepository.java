package com.clinicadermatologica.app.infrastructure.persistence.jpa;

import com.clinicadermatologica.app.domain.model.User; // Entidad User
import org.springframework.data.jpa.repository.JpaRepository; // Interfaz base de Spring Data JPA con métodos CRUD
import org.springframework.stereotype.Repository; // Marca la interfaz como componente de persistencia

import java.util.Optional; // Contenedor opcional

/**
 * Repositorio Spring Data JPA para la entidad User.
 */
@Repository // Componente de acceso a datos administrado por Spring Data
public interface JpaUserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username); // Genera automáticamente query: SELECT u FROM User u WHERE u.username = :username
    Optional<User> findByEmail(String email); // Genera automáticamente query por email
    boolean existsByUsername(String username); // Query eficiente de verificación de existencia por username
    boolean existsByEmail(String email); // Query eficiente de verificación de existencia por email
}
