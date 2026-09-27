package com.clinicadermatologica.app.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * Clave primaria compuesta para la entidad débil AntecedentePatologico.
 * Identifica un antecedente por la historia clínica propietaria y el tipo de patología.
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AntecedentePatologicoId implements Serializable {

    @Column(name = "historia_clinica_id")
    private Long medicalRecordId;

    @Column(name = "tipo", length = 100)
    private String tipo;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AntecedentePatologicoId)) return false;
        AntecedentePatologicoId that = (AntecedentePatologicoId) o;
        return Objects.equals(medicalRecordId, that.medicalRecordId) &&
               Objects.equals(tipo, that.tipo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(medicalRecordId, tipo);
    }
}
