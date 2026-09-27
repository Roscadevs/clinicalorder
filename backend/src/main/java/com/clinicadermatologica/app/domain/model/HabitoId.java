package com.clinicadermatologica.app.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * Clave primaria compuesta para la entidad débil Habito.
 * Identifica un hábito por la historia clínica propietaria y el tipo de hábito.
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HabitoId implements Serializable {

    @Column(name = "historia_clinica_id")
    private Long medicalRecordId;

    @Column(name = "tipo", length = 100)
    private String tipo;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof HabitoId)) return false;
        HabitoId that = (HabitoId) o;
        return Objects.equals(medicalRecordId, that.medicalRecordId) &&
               Objects.equals(tipo, that.tipo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(medicalRecordId, tipo);
    }
}
