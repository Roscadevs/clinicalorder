package com.clinicadermatologica.app.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Entidad de Dominio que representa un servicio o tratamiento dermatológico/estético ofrecido.
 */
@Entity
@Table(name = "servicio")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DermatologicService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "duration_minutes", nullable = false) // Entre 10 y 480 minutos (validado en DTO)
    private Integer durationMinutes;

    @Column(name = "base_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal basePrice;

    @Column(name = "deposit_percentage", nullable = false) // Porcentaje entero entre 1 y 100
    private Integer depositPercentage;

    @Column(name = "follow_up_interval_days", nullable = false)
    @Builder.Default // 0 = sin seguimiento recomendado
    private Integer followUpIntervalDays = 0;

    @Column(name = "active", nullable = false)
    @Builder.Default
    private Boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
