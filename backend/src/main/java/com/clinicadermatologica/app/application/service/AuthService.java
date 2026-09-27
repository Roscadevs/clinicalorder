package com.clinicadermatologica.app.application.service;

import com.clinicadermatologica.app.domain.exception.*;
import com.clinicadermatologica.app.domain.model.*;
import com.clinicadermatologica.app.domain.repository.PasswordResetTokenRepository;
import com.clinicadermatologica.app.domain.repository.UserRepository;
import com.clinicadermatologica.app.infrastructure.notification.EmailNotificationService;
import com.clinicadermatologica.app.infrastructure.security.JwtTokenProvider;
import com.clinicadermatologica.app.presentation.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

/**
 * Servicio de Aplicación para autenticación, gestión de sesiones JWT y recuperación de contraseñas.
 *
 * SEGURIDAD aplicada en este servicio:
 * - Hashing de contraseñas: BCrypt (costo 12) vía PasswordEncoder. Nunca se almacena texto plano.
 * - Autenticación JWT stateless: tras login exitoso se emite un token firmado HMAC-SHA256 (JwtTokenProvider).
 * - Tokens de recuperación de contraseña: de uso único (usedAt != null) y con vencimiento de 15 minutos
 *   (expiresAt). Ambos controles son independientes y se validan en resetPassword().
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder; // BCrypt costo 12 — ver SecurityConfig.passwordEncoder()
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailNotificationService emailService;

    /**
     * Autentica credenciales y emite token JWT stateless.
     * Flujo: cargar usuario → verificar cuenta activa → comparar contraseña → emitir JWT.
     */
    @Transactional
    public AuthResponseDTO login(AuthRequestDTO request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BusinessRuleException("Credenciales no válidas"));

        if (!user.getActive()) {
            throw new BusinessRuleException("La cuenta de usuario se encuentra suspendida");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BusinessRuleException("Credenciales no válidas");
        }

        String token = jwtTokenProvider.generateToken(user);

        return AuthResponseDTO.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole())
                .expiresInMs(28800000L) // 8 horas
                .build();
    }

    /**
     * Genera un token temporal de restablecimiento de contraseña (15 min) y envía el correo.
     */
    @Transactional
    public void forgotPassword(ForgotPasswordRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("No existe usuario registrado con ese correo electrónico"));

        String tokenStr = UUID.randomUUID().toString().replace("-", "");

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .user(user)
                .token(tokenStr)
                .expiresAt(Instant.now().plus(15, ChronoUnit.MINUTES))
                .build();

        passwordResetTokenRepository.save(resetToken);
        emailService.sendPasswordResetEmail(user.getEmail(), tokenStr);
    }

    /**
     * Valida el token y actualiza la contraseña con nuevo hash BCrypt.
     *
     * SEGURIDAD: Dos controles independientes:
     * 1. usedAt != null → token ya fue consumido, no puede reutilizarse.
     * 2. Instant.now().isAfter(expiresAt) → token expirado (15 minutos de vigencia).
     */
    @Transactional
    public void resetPassword(ResetPasswordRequestDTO request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new BusinessRuleException("Token de recuperación inválido o inexistente"));

        if (resetToken.getUsedAt() != null) {
            throw new BusinessRuleException("Este token de recuperación ya ha sido utilizado");
        }

        if (Instant.now().isAfter(resetToken.getExpiresAt())) {
            throw new BusinessRuleException("El token de recuperación ha expirado. Solicite uno nuevo.");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsedAt(Instant.now()); // Invalida el token para un solo uso
        passwordResetTokenRepository.save(resetToken);
        log.info("Contraseña actualizada exitosamente para el usuario {}", user.getUsername());
    }

    /**
     * Registra un nuevo operador en el sistema (exclusivo para usuarios con rol ADMIN).
     */
    @Transactional
    public User registerUser(RegisterUserRequestDTO request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessRuleException("El nombre de usuario ya se encuentra registrado");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessRuleException("El correo electrónico ya se encuentra registrado");
        }

        User user = User.builder()
                .username(request.getUsername())
                .passwordHash(passwordEncoder.encode(request.getPassword())) // Hash BCrypt, nunca texto plano
                .email(request.getEmail())
                .fullName(request.getFullName())
                .role(request.getRole())
                .active(true)
                .build();

        return userRepository.save(user);
    }
}
