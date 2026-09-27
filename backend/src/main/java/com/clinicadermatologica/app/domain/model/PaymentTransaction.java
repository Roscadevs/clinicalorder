package com.clinicadermatologica.app.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Entidad de Dominio que representa una transacción de pago asociada a una cita.
 *
 * Contiene dos campos complementarios:
 * - paymentType:    canal utilizado (MERCADOPAGO, CASH, BANK_TRANSFER)
 * - paymentConcept: propósito del pago (DEPOSIT, BALANCE, FULL)
 *
 * Esta separación es la base del Patrón Strategy implementado en PaymentRegistrationStrategy:
 * el concepto determina el impacto en el estado de la cita; el tipo determina el canal de cobro.
 */
@Entity
@Table(name = "transaccion_pago")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cita_id", nullable = false)
    private Appointment appointment;

    @Column(name = "mp_preference_id", length = 100) // ID de preferencia generado en MercadoPago al crear la reserva
    private String mpPreferenceId;

    @Column(name = "mp_payment_id", unique = true, length = 100) // ID del pago procesado devuelto por MercadoPago
    private String mpPaymentId;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type", nullable = false, length = 20) // Canal de pago: MERCADOPAGO, CASH, BANK_TRANSFER
    private PaymentType paymentType;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_concept", nullable = false, length = 20) // Concepto: DEPOSIT, BALANCE, FULL
    private PaymentConcept paymentConcept;

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private PaymentStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registered_by_user_id") // Nulo para pagos automáticos vía MercadoPago
    private User registeredByUser;

    @Column(name = "payment_date")
    private Instant paymentDate;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
