package com.clinicadermatologica.app.domain.model;

import jakarta.persistence.*; // Importa anotaciones JPA estándar
import lombok.*; // Generadores de código Lombok
import org.hibernate.annotations.CreationTimestamp; // Captura de fecha de creación

import java.math.BigDecimal; // Precisión decimal para moneda
import java.time.Instant; // Representación de tiempo UTC

/**
 * Entidad de Dominio que representa una transacción de pago (MercadoPago o mostrador).
 */
@Entity // Entidad administrada por JPA
@Table(name = "transaccion_pago") // Mapea a la tabla 'transaccion_pago' en PostgreSQL
@Getter // Getters automáticos
@Setter // Setters automáticos
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío para JPA
@AllArgsConstructor // Constructor completo
public class PaymentTransaction {

    @Id // Clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // BIGSERIAL autoincremental
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // Relación muchos a uno con cita
    @JoinColumn(name = "cita_id", nullable = false) // Clave foránea referenciando a 'cita'
    private Appointment appointment;

    @Column(name = "mp_preference_id", length = 100) // Identificador de la preferencia en MercadoPago
    private String mpPreferenceId;

    @Column(name = "mp_payment_id", unique = true, length = 100) // ID de pago verificado en MercadoPago
    private String mpPaymentId;

    @Enumerated(EnumType.STRING) // Mapea como texto ('DEPOSIT_50', 'FINAL_BALANCE_50', etc.)
    @Column(name = "payment_type", nullable = false, length = 20) // Columna NOT NULL
    private PaymentType paymentType;

    @Column(name = "amount", nullable = false, precision = 12, scale = 2) // Monto de la transacción
    private BigDecimal amount;

    @Enumerated(EnumType.STRING) // Mapea como texto ('PENDING', 'APPROVED', etc.)
    @Column(name = "status", nullable = false, length = 20) // Estado del pago
    private PaymentStatus status;

    @ManyToOne(fetch = FetchType.LAZY) // Usuario operador que registró el pago si fue cobrado en mostrador
    @JoinColumn(name = "registered_by_user_id")
    private User registeredByUser;

    @Column(name = "payment_date", nullable = false) // Fecha y hora efectiva de cobro
    @Builder.Default
    private Instant paymentDate = Instant.now();

    @CreationTimestamp // Fecha automática de inserción
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
