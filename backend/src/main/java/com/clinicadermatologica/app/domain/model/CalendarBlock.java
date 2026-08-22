package com.clinicadermatologica.app.domain.model;

import jakarta.persistence.*; // Importa anotaciones JPA estándar
import lombok.*; // Generadores de código Lombok
import org.hibernate.annotations.CreationTimestamp; // Captura de fecha de creación

import java.time.Instant; // Representación de tiempo UTC

/**
 * Entidad de Dominio que representa un bloqueo de agenda por vacaciones, congresos o feriados.
 */
@Entity // Entidad JPA
@Table(name = "bloqueo_calendario") // Mapea a 'bloqueo_calendario'
@Getter // Getters automáticos
@Setter // Setters automáticos
@Builder // Patrón Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
public class CalendarBlock {

    @Id // Clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // BIGSERIAL autoincremental
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // Usuario operador o médico que solicitó el bloqueo
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private User createdByUser;

    @Column(name = "start_time", nullable = false) // Fecha y hora de inicio de la indisponibilidad
    private Instant startTime;

    @Column(name = "end_time", nullable = false) // Fecha y hora de finalización
    private Instant endTime;

    @Column(name = "reason", nullable = false, length = 255) // Motivo del bloqueo
    private String reason;

    @CreationTimestamp // Fecha automática de alta
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
