package com.clinicadermatologica.app.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

/**
 * Entidad que representa un token criptográfico temporal para restablecer contraseñas de operadores.
 *
 * SEGURIDAD:
 * - El token es de uso único: una vez consumido, usedAt se establece con la marca temporal de uso.
 * - El token tiene vigencia limitada: expiresAt define el vencimiento (15 minutos desde la creación).
 * - Ambos controles (usedAt != null y Instant.now().isAfter(expiresAt)) se verifican en AuthService.resetPassword().
 */
@Entity
@Table(name = "password_reset_token")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "token", nullable = false, unique = true, length = 255) // Cadena aleatoria criptográfica única
    private String token;

    @Column(name = "used_at") // NULL mientras no haya sido utilizado; se establece con Instant.now() al consumirse
    private Instant usedAt;

    @Column(name = "expires_at", nullable = false) // Fecha y hora de vencimiento (15 minutos desde creación)
    private Instant expiresAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
