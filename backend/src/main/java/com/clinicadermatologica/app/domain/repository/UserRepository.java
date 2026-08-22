package com.clinicadermatologica.app.domain.repository;

import com.clinicadermatologica.app.domain.model.User; // Importa la entidad User del dominio

import java.util.Optional; // Contenedor opcional para prevenir NullPointerException

/**
 * Contrato de repositorio del dominio para la gestión de usuarios operadores.
 */
public interface UserRepository {
    Optional<User> findById(Long id); // Busca usuario por su clave primaria
    Optional<User> findByUsername(String username); // Busca usuario por nombre de usuario único
    Optional<User> findByEmail(String email); // Busca usuario por correo electrónico único
    User save(User user); // Persiste o actualiza un usuario en la base de datos
    boolean existsByUsername(String username); // Verifica existencia previa de username
    boolean existsByEmail(String email); // Verifica existencia previa de email
}
