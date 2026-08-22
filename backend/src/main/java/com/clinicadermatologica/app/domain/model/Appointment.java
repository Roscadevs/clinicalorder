package com.clinicadermatologica.app.domain.model;

import jakarta.persistence.*; // Importa anotaciones JPA estándar
import lombok.*; // Generadores de código Lombok
import org.hibernate.annotations.CreationTimestamp; // Marca de tiempo de creación
import org.hibernate.annotations.UpdateTimestamp; // Marca de tiempo de actualización

import java.math.BigDecimal; // Tipo monetario de alta precisión
import java.time.Instant; // Representación de tiempo UTC

/**
 * Entidad de Dominio que representa una Cita / Turno dermatológico en la agenda.
 * Implementa control de concurrencia optimista con @Version para evitar dobles reservas.
 */
@Entity // Entidad administrada por JPA
@Table(name = "cita") // Mapea a la tabla 'cita' en PostgreSQL
@Getter // Genera getters automáticos
@Setter // Genera setters automáticos
@Builder // Habilita patrón de diseño Builder
@NoArgsConstructor // Constructor sin argumentos para JPA
@AllArgsConstructor // Constructor con todos los campos
public class Appointment {

    @Id // Clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Autoincremento BIGSERIAL
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // Carga perezosa para evitar JOINs innecesarios en memoria
    @JoinColumn(name = "paciente_id", nullable = false) // Clave foránea al paciente
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY) // Carga perezosa
    @JoinColumn(name = "servicio_id", nullable = false) // Clave foránea al servicio solicitado
    private DermatologicService service;

    @ManyToOne(fetch = FetchType.LAZY) // Carga perezosa
    @JoinColumn(name = "created_by_user_id", nullable = false) // Usuario operador que inició la reserva
    private User createdByUser;

    @Column(name = "start_time", nullable = false) // Fecha y hora de inicio de la sesión
    private Instant startTime;

    @Column(name = "end_time", nullable = false) // Fecha y hora de finalización prevista
    private Instant endTime;

    @Enumerated(EnumType.STRING) // Mapea el estado como texto legible ('PENDING_PAYMENT', 'CONFIRMED', etc.)
    @Column(name = "status", nullable = false, length = 30) // Columna NOT NULL para estado
    private AppointmentStatus status;

    @Column(name = "agreed_price", nullable = false, precision = 12, scale = 2) // Precio congelado al reservar
    private BigDecimal agreedPrice;

    @ManyToOne(fetch = FetchType.LAZY) // Referencia opcional a una cita anterior si es control o seguimiento
    @JoinColumn(name = "follow_up_to_id")
    private Appointment followUpTo;

    @Column(name = "temporary_hold_deadline") // Límite de 10 min para completar el pago de la seña
    private Instant temporaryHoldDeadline;

    @Column(name = "reschedule_count", nullable = false) // Contador de reprogramaciones realizadas
    @Builder.Default // Valor por defecto 0
    private Integer rescheduleCount = 0;

    @Column(name = "original_start_time", nullable = false) // Horario original de la primera reserva
    private Instant originalStartTime;

    @Version // CONTROL DE CONCURRENCIA OPTIMISTA: Previene colisiones y dobles reservas simultáneas
    @Column(name = "version", nullable = false)
    @Builder.Default
    private Long version = 0L;

    @CreationTimestamp // Fecha automática de alta
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp // Fecha automática de última modificación
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
