package com.clinicadermatologica.app.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

/**
 * Entidad de Dominio para la auditoría de conexiones e inicios de sesión al sistema.
 *
 * Mapea a la tabla relacional 'registro_conexion'.
 * Registra tanto inicios de sesión exitosos como intentos fallidos (credenciales erróneas,
 * cuentas inactivas o usuarios inexistentes), junto con la IP y el User-Agent del cliente.
 */
@Entity
@Table(name = "registro_conexion")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "passwordHash"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "username", nullable = false, length = 50)
    private String username;

    @Column(name = "exitoso", nullable = false)
    private Boolean exitoso;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @CreationTimestamp
    @Column(name = "fecha_conexion", nullable = false, updatable = false)
    private Instant fechaConexion;
}
