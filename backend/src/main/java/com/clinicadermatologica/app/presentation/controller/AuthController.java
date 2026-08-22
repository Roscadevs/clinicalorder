package com.clinicadermatologica.app.presentation.controller;

import com.clinicadermatologica.app.application.service.AuthService; // Servicio de autenticación
import com.clinicadermatologica.app.domain.model.User; // Entidad User
import com.clinicadermatologica.app.presentation.dto.*; // DTOs
import jakarta.validation.Valid; // Dispara validación de DTOs
import lombok.RequiredArgsConstructor; // Inyección por constructor
import org.springframework.http.HttpStatus; // Códigos HTTP
import org.springframework.http.ResponseEntity; // Wrapper de respuesta HTTP
import org.springframework.security.access.prepost.PreAuthorize; // Seguridad declarativa
import org.springframework.web.bind.annotation.*; // Anotaciones REST

/**
 * Controlador REST para inicio de sesión, registro y recuperación de contraseñas de operadores.
 */
@RestController // Controlador REST con serialización JSON automática
@RequestMapping("/auth") // Ruta base /api/v1/auth
@RequiredArgsConstructor // Inyección por constructor
public class AuthController {

    private final AuthService authService; // Inyección del servicio

    /**
     * Endpoint público para iniciar sesión y obtener token JWT.
     */
    @PostMapping("/login") // Mapea HTTP POST /api/v1/auth/login
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody AuthRequestDTO request) {
        return ResponseEntity.ok(authService.login(request)); // Retorna HTTP 200 con el token
    }

    /**
     * Endpoint público para solicitar enlace de recuperación de contraseña con token temporal.
     */
    @PostMapping("/forgot-password") // Mapea HTTP POST /api/v1/auth/forgot-password
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDTO request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok().build(); // Retorna HTTP 200 OK
    }

    /**
     * Endpoint público para restablecer la contraseña utilizando el token criptográfico.
     */
    @PostMapping("/reset-password") // Mapea HTTP POST /api/v1/auth/reset-password
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequestDTO request) {
        authService.resetPassword(request);
        return ResponseEntity.ok().build(); // Retorna HTTP 200 OK
    }

    /**
     * Endpoint protegido exclusivo para Administradores para dar de alta nuevos operadores.
     */
    @PostMapping("/register") // Mapea HTTP POST /api/v1/auth/register
    @PreAuthorize("hasRole('ADMIN')") // Exige rol ADMIN
    public ResponseEntity<User> register(@Valid @RequestBody RegisterUserRequestDTO request) {
        User createdUser = authService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser); // Retorna HTTP 201 Created
    }
}
