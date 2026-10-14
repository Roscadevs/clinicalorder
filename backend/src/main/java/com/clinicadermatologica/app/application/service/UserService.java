package com.clinicadermatologica.app.application.service;

import com.clinicadermatologica.app.domain.exception.BusinessRuleException;
import com.clinicadermatologica.app.domain.exception.ResourceNotFoundException;
import com.clinicadermatologica.app.domain.model.User;
import com.clinicadermatologica.app.infrastructure.persistence.dao.UserDAO;
import com.clinicadermatologica.app.presentation.dto.UpdateUserRequestDTO;
import com.clinicadermatologica.app.presentation.dto.UserResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

/**
 * Servicio de Aplicación para administración y ciclo de vida de usuarios del staff.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserDAO userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Obtiene todos los operadores del staff registrados en el sistema.
     */
    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .sorted(Comparator.comparing(User::getId))
                .map(this::toResponseDTO)
                .toList();
    }

    /**
     * Obtiene el detalle de un usuario por su identificador.
     */
    @Transactional(readOnly = true)
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
        return toResponseDTO(user);
    }

    /**
     * Actualiza los datos de filiación, rol y opcionalmente credenciales de un operador.
     */
    @Transactional
    public UserResponseDTO updateUser(Long id, UpdateUserRequestDTO request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        String sanitizedUsername = request.getUsername().trim();
        String sanitizedEmail = request.getEmail().trim();
        String sanitizedFullName = request.getFullName().trim();

        if (userRepository.existsByUsernameAndIdNot(sanitizedUsername, id)) {
            throw new BusinessRuleException("El nombre de usuario ya se encuentra registrado por otro operador");
        }

        if (userRepository.existsByEmailAndIdNot(sanitizedEmail, id)) {
            throw new BusinessRuleException("El correo electrónico ya se encuentra registrado por otro operador");
        }

        user.setFullName(sanitizedFullName);
        user.setUsername(sanitizedUsername);
        user.setEmail(sanitizedEmail);
        user.setRole(request.getRole());

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            String newPassword = request.getPassword().trim();
            if (newPassword.length() < 8) {
                throw new BusinessRuleException("La contraseña debe tener al menos 8 caracteres");
            }
            user.setPasswordHash(passwordEncoder.encode(newPassword));
            log.info("Contraseña actualizada para el usuario {}", user.getUsername());
        }

        User updatedUser = userRepository.save(user);
        log.info("Usuario con ID {} ({}) actualizado exitosamente", updatedUser.getId(), updatedUser.getUsername());
        return toResponseDTO(updatedUser);
    }

    /**
     * Modifica el estado activo/suspendido de un operador con protección anti-lockout.
     */
    @Transactional
    public UserResponseDTO toggleUserActive(Long id, boolean active, String currentUsername) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        if (!active && currentUsername != null && user.getUsername().equalsIgnoreCase(currentUsername.trim())) {
            throw new BusinessRuleException("No puede suspender su propia cuenta de administrador en sesión");
        }

        user.setActive(active);
        User savedUser = userRepository.save(user);
        log.info("Estado de usuario {} modificado a active={}", savedUser.getUsername(), active);
        return toResponseDTO(savedUser);
    }

    /**
     * Mapea de forma segura una entidad User a su DTO sin exponer passwordHash.
     */
    public UserResponseDTO toResponseDTO(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .active(user.getActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
