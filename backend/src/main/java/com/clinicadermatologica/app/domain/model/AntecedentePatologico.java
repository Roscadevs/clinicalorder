package com.clinicadermatologica.app.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

/**
 * Entidad débil que representa un antecedente patológico registrado en la historia clínica.
 *
 * ENTIDAD DÉBIL: su existencia e identificación dependen de MedicalRecord.
 * La clave primaria es compuesta: (historia_clinica_id, tipo).
 * Ejemplos de tipo: "Hipertensión arterial", "Diabetes", "Glaucoma", "Anemia".
 *
 * Una historia clínica puede tener cero, uno o múltiples antecedentes patológicos.
 * No puede existir más de un antecedente del mismo tipo en la misma historia clínica.
 */
@Entity
@Table(name = "antecedente_patologico")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AntecedentePatologico {

    @EmbeddedId
    private AntecedentePatologicoId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("medicalRecordId")
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
