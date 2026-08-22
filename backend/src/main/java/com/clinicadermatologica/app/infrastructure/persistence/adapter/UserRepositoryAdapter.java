package com.clinicadermatologica.app.infrastructure.persistence.adapter;

import com.clinicadermatologica.app.domain.model.User; // Entidad del dominio
import com.clinicadermatologica.app.domain.repository.UserRepository; // Interfaz del dominio
import com.clinicadermatologica.app.infrastructure.persistence.jpa.JpaUserRepository; // Repositorio JPA
import lombok.RequiredArgsConstructor; // Genera constructor con inyección de dependencias de campos 'final'
import org.springframework.stereotype.Component; // Componente administrado por el contenedor de Spring

import java.util.Optional; // Contenedor opcional

/**
 * Adaptador de infraestructura que implementa la interfaz de repositorio del dominio UserRepository.
 */
@Component // Componente Spring
@RequiredArgsConstructor // Inyección por constructor recomendada en Clean Architecture
public class UserRepositoryAdapter implements UserRepository {

    private final JpaUserRepository jpaUserRepository; // Dependencia del repositorio Spring Data JPA

    @Override
    public Optional<User> findById(Long id) {
        return jpaUserRepository.findById(id); // Delega la búsqueda al repositorio JPA
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return jpaUserRepository.findByUsername(username); // Delega la consulta por username
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return jpaUserRepository.findByEmail(email); // Delega la consulta por email
    }

    @Override
    public User save(User user) {
        return jpaUserRepository.save(user); // Persiste la entidad
    }

    @Override
    public boolean existsByUsername(String username) {
        return jpaUserRepository.existsByUsername(username); // Verifica unicidad
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpaUserRepository.existsByEmail(email); // Verifica unicidad
    }
}
