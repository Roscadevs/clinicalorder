package com.clinicadermatologica.app.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

/**
 * Entidad débil que representa una alergia registrada en la historia clínica de un paciente.
 *
 * ENTIDAD DÉBIL: su existencia e identificación dependen de MedicalRecord.
 * La clave primaria es compuesta: (historia_clinica_id, tipo).
 * No posee clave sustituta (surrogate key).
 *
 * Una historia clínica puede tener cero, una o múltiples alergias.
 * No puede existir más de una alergia del mismo tipo en la misma historia clínica
 * (garantizado por la clave primaria compuesta).
 */
@Entity
@Table(name = "alergia")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Alergia {

    @EmbeddedId
    private AlergiaId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("medicalRecordId") // Mapea la parte medicalRecordId del EmbeddedId
    @JoinColumn(name = "historia_clinica_id")
    private MedicalRecord medicalRecord;

    @Column(name = "observaciones", length = 500)
    private String observaciones;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
