package com.clinicadermatologica.app.domain.model;

import jakarta.persistence.*; // Importa anotaciones JPA estándar
import lombok.*; // Generadores de código Lombok
import org.hibernate.annotations.CreationTimestamp; // Marca temporal automática de creación
import org.hibernate.annotations.UpdateTimestamp; // Marca temporal automática de actualización

import java.math.BigDecimal; // Tipo numérico de alta precisión para valores monetarios
import java.time.Instant; // Representación de fecha y hora UTC

/**
 * Entidad de Dominio que representa un servicio o tratamiento dermatológico/estético ofrecido.
 */
@Entity // Entidad JPA mapeada a base de datos
@Table(name = "servicio") // Mapea a la tabla 'servicio' en PostgreSQL
@Getter // Getters automáticos
@Setter // Setters automáticos
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío para JPA
@AllArgsConstructor // Constructor completo
public class DermatologicService {

    @Id // Clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // BIGSERIAL autoincremental
    private Long id;

    @Column(name = "name", nullable = false, unique = true, length = 100) // Nombre único del tratamiento
    private String name;

    @Column(name = "description", length = 500) // Descripción del procedimiento y áreas de aplicación
    private String description;

    @Column(name = "duration_minutes", nullable = false) // Duración en minutos requerida en agenda
    private Integer durationMinutes;

    @Column(name = "base_price", nullable = false, precision = 12, scale = 2) // Precio base con 2 decimales
    private BigDecimal basePrice;

    @Column(name = "deposit_percentage", nullable = false, precision = 5, scale = 2) // % de seña exigido (ej. 50%)
    @Builder.Default // Valor por defecto 50.00%
    private BigDecimal depositPercentage = new BigDecimal("50.00");

    @Column(name = "follow_up_interval_days") // Días sugeridos para control o próxima sesión
    private Integer followUpIntervalDays;

    @Column(name = "active", nullable = false) // Estado de disponibilidad del servicio en catálogo
    @Builder.Default // Activo por defecto
    private Boolean active = true;

    @CreationTimestamp // Timestamp automático de alta
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp // Timestamp automático de actualización
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
