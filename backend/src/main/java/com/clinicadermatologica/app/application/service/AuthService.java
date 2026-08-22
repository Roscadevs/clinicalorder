package com.clinicadermatologica.app.application.service;

import com.clinicadermatologica.app.domain.exception.*; // Excepciones de negocio
import com.clinicadermatologica.app.domain.model.*; // Entidades del dominio
import com.clinicadermatologica.app.domain.repository.PasswordResetTokenRepository; // Repositorio de tokens
import com.clinicadermatologica.app.domain.repository.UserRepository; // Repositorio de usuarios
import com.clinicadermatologica.app.infrastructure.notification.EmailNotificationService; // Servicio de emails
import com.clinicadermatologica.app.infrastructure.security.JwtTokenProvider; // Proveedor JWT
import com.clinicadermatologica.app.presentation.dto.*; // DTOs
import lombok.RequiredArgsConstructor; // Inyección por constructor
import lombok.extern.slf4j.Slf4j; // Logger
import org.springframework.security.crypto.password.PasswordEncoder; // BCrypt encoder
import org.springframework.stereotype.Service; // Anotación de servicio Spring
import org.springframework.transaction.annotation.Transactional; // Transacciones ACID

import java.time.Instant; // Tipos de tiempo UTC
import java.time.temporal.ChronoUnit; // Unidades temporales
import java.util.UUID; // Generador de tokens aleatorios

/**
 * Servicio de Aplicación para autenticación, gestión de sesiones JWT y recuperación de contraseñas.
 */
@Service // Componente de servicio Spring
@RequiredArgsConstructor // Inyección por constructor de dependencias
@Slf4j // Logger
public class AuthService {

    private final UserRepository userRepository; // Repositorio de usuarios
    private final PasswordResetTokenRepository passwordResetTokenRepository; // Repositorio de tokens
    private final PasswordEncoder passwordEncoder; // Comparador BCrypt (costo 12)
    private final JwtTokenProvider jwtTokenProvider; // Generador de tokens JWT
    private final EmailNotificationService emailService; // Notificaciones

    /**
     * Autentica credenciales y emite token JWT con control de ataques de fuerza bruta.
     */
    @Transactional // Transacción ACID para actualizar intentos fallidos
    public AuthResponseDTO login(AuthRequestDTO request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BusinessRuleException("Credenciales no válidas"));

        if (!user.getActive()) {
            throw new BusinessRuleException("La cuenta de usuario se encuentra suspendida");
        }

        if (user.getLockedUntil() != null && Instant.now().isBefore(user.getLockedUntil())) {
            throw new BusinessRuleException("La cuenta está temporalmente bloqueada por reiterados intentos fallidos. Intente más tarde.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            int attempts = user.getFailedLoginAttempts() + 1;
            user.setFailedLoginAttempts(attempts);

            if (attempts >= 5) {
                user.setLockedUntil(Instant.now().plus(15, ChronoUnit.MINUTES));
                log.warn("Usuario {} bloqueado temporalmente por 5 intentos fallidos", user.getUsername());
            }
            userRepository.save(user);
            throw new BusinessRuleException("Credenciales no válidas");
        }

        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        userRepository.save(user);

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
    @Transactional // Transacción ACID
    public void forgotPassword(ForgotPasswordRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("No existe usuario registrado con ese correo electrónico"));

        // Genera una cadena aleatoria criptográfica
        String tokenStr = UUID.randomUUID().toString().replace("-", "");

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .user(user)
                .token(tokenStr)
                .used(false)
                .expiresAt(Instant.now().plus(15, ChronoUnit.MINUTES)) // 15 minutos de validez
                .build();

        passwordResetTokenRepository.save(resetToken);
        emailService.sendPasswordResetEmail(user.getEmail(), tokenStr);
    }

    /**
     * Valida el token y actualiza la contraseña con nuevo hash BCrypt.
     */
    @Transactional // Transacción ACID
    public void resetPassword(ResetPasswordRequestDTO request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new BusinessRuleException("Token de recuperación inválido o inexistente"));

        if (resetToken.getUsed()) {
            throw new BusinessRuleException("Este token de recuperación ya ha sido utilizado");
        }

        if (Instant.now().isAfter(resetToken.getExpiresAt())) {
            throw new BusinessRuleException("El token de recuperación ha expirado. Solicite uno nuevo.");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword())); // Cifra nueva clave
        user.setFailedLoginAttempts(0); // Desbloquea la cuenta
        user.setLockedUntil(null);
        userRepository.save(user);

        resetToken.setUsed(true); // Invalida el token para un solo uso
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
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .fullName(request.getFullName())
                .role(request.getRole())
                .active(true)
                .failedLoginAttempts(0)
                .build();

        return userRepository.save(user);
    }
}
