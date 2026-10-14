package com.clinicadermatologica.app.presentation.controller;

import com.clinicadermatologica.app.application.service.UserService;
import com.clinicadermatologica.app.presentation.dto.UpdateUserRequestDTO;
import com.clinicadermatologica.app.presentation.dto.UserResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para administración de usuarios del staff.
 * Acceso restringido exclusivamente a administradores (ADMIN).
 */
@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    /**
     * Lista todos los operadores del staff registrados en la clínica.
     */
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /**
     * Obtiene el detalle de un usuario por su identificador único.
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    /**
     * Actualiza la información de un operador existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequestDTO request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    /**
     * Alterna el estado activo/suspendido de un operador.
     */
    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<UserResponseDTO> toggleUserActive(
            @PathVariable Long id,
            @RequestParam boolean active,
            Authentication authentication) {
        String currentUsername = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(userService.toggleUserActive(id, active, currentUsername));
    }
}
