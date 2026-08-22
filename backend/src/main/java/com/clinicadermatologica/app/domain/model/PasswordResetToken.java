package com.clinicadermatologica.app.domain.model;

import jakarta.persistence.*; // Importa anotaciones JPA estándar
import lombok.*; // Importa generadores de código Lombok
import org.hibernate.annotations.CreationTimestamp; // Anotación de Hibernate para captura de fecha de inserción

import java.time.Instant; // Representación inmutable de instante en el tiempo UTC

/**
 * Entidad que representa un token criptográfico temporal para restablecer contraseñas de operadores.
 */
@Entity // Entidad administrada por el contexto de persistencia JPA
@Table(name = "password_reset_token") // Mapea a la tabla 'password_reset_token' en PostgreSQL
@Getter // Genera getters automáticos
@Setter // Genera setters automáticos
@Builder // Habilita patrón Builder
@NoArgsConstructor // Constructor vacío para JPA
@AllArgsConstructor // Constructor completo
public class PasswordResetToken {

    @Id // Clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // BIGSERIAL autoincremental
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // Relación muchos a uno con carga perezosa (lazy) para optimizar memoria
    @JoinColumn(name = "user_id", nullable = false) // Clave foránea referenciando a la tabla 'usuario'
    private User user;

    @Column(name = "token", nullable = false, unique = true, length = 255) // Cadena aleatoria criptográfica única
    private String token;

    @Column(name = "used", nullable = false) // Bandera para invalidar el token una vez consumido
    @Builder.Default // Valor por defecto false
    private Boolean used = false;

    @Column(name = "expires_at", nullable = false) // Fecha y hora de vencimiento (15 minutos desde creación)
    private Instant expiresAt;

    @CreationTimestamp // Timestamp asignado automáticamente al insertar
    @Column(name = "created_at", nullable = false, updatable = false) // Inmutable tras creación
    private Instant createdAt;
}
