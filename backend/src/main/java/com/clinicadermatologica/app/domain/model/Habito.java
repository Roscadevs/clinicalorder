package com.clinicadermatologica.app.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

/**
 * Entidad débil que representa un hábito registrado en la historia clínica de un paciente.
 *
 * ENTIDAD DÉBIL: su existencia e identificación dependen de MedicalRecord.
 * La clave primaria es compuesta: (historia_clinica_id, tipo).
 * Ejemplos de tipo: "Tabaquismo", "Consumo de alcohol", "Exposición solar", "Uso de SPF".
 *
 * Una historia clínica puede tener cero, uno o múltiples hábitos registrados.
 * No puede existir más de un hábito del mismo tipo en la misma historia clínica.
 */
@Entity
@Table(name = "habito")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Habito {

    @EmbeddedId
    private HabitoId id;

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
