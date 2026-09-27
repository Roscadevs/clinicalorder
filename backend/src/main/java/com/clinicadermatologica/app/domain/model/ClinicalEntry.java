package com.clinicadermatologica.app.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

/**
 * Entidad de Dominio que representa una Nota de Evolución Clínica de una sesión específica.
 *
 * CAMBIO DE MODELO:
 * - FK historia_clinica_id eliminada. La historia clínica se navega vía appointment → patient → medicalRecord.
 * - FK paciente_id añadida directamente para representar la relación es_sujeto_de (Paciente → Entrada_HC).
 *   El servicio garantiza que appointment.patient == entry.patient al crear la entrada.
 *
 * SEGURIDAD: content se almacena cifrado (AES-256-GCM) como BYTEA.
 * El cifrado/descifrado es responsabilidad exclusiva de MedicalRecordService vía AesEncryptionService.
 */
@Entity
@Table(name = "entrada_hc")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClinicalEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false) // FK directa al paciente (relación es_sujeto_de)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cita_id", nullable = false)
    private Appointment appointment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_user_id", nullable = false)
    private User authorUser;

    @Column(name = "content", nullable = false, columnDefinition = "BYTEA") // Cifrado AES-256-GCM
    private byte[] content;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
