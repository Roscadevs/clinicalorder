package com.clinicadermatologica.app.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

/**
 * Entidad de Dominio que representa la Historia Clínica Base (Ficha Anamnesis) del Paciente.
 * Relación 1:1 estricta con el Paciente.
 *
 * Los antecedentes patológicos, alergias y hábitos ya NO se almacenan como columnas booleanas.
 * Se modelan como entidades débiles independientes (Alergia, AntecedentePatologico, Habito)
 * con clave compuesta (historia_clinica_id, tipo), accesibles vía sus respectivos DAOs.
 *
 * SEGURIDAD: physicalExamination se almacena cifrado (AES-256-GCM) como BYTEA.
 * El cifrado/descifrado es responsabilidad exclusiva de MedicalRecordService vía AesEncryptionService.
 */
@Entity
@Table(name = "historia_clinica")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paciente_id", nullable = false, unique = true)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private User createdByUser;

    // --- FOTOTIPO DE PIEL ---
    @Column(name = "fitzpatrick_phototype", nullable = false) // Valores 1 a 6 (validado en DTO)
    private Integer fitzpatrickPhototype;

    // --- EXAMEN FÍSICO CIFRADO ---
    @Column(name = "physical_examination", columnDefinition = "BYTEA")
    private byte[] physicalExamination; // Cifrado AES-256-GCM; null si no se ha completado

    // --- CONSENTIMIENTO INFORMADO ---
    @Column(name = "informed_consent_signed", nullable = false)
    @Builder.Default
    private Boolean informedConsentSigned = false;

    // --- ANTECEDENTES EN TEXTO LIBRE (longitudes acotadas según especificación) ---
    @Column(name = "gynecological_history", length = 500)
    private String gynecologicalHistory; // FUM, embarazo, lactancia (VARCHAR 500)

    @Column(name = "surgical_history", length = 1000)
    private String surgicalHistory; // Cirugías previas (VARCHAR 1000)

    @Column(name = "current_medications", length = 1000)
    private String currentMedications; // Medicación habitual (VARCHAR 1000)

    @Column(name = "previous_aesthetic_treatments", length = 1000)
    private String previousAestheticTreatments; // Tratamientos estéticos previos (VARCHAR 1000)

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
