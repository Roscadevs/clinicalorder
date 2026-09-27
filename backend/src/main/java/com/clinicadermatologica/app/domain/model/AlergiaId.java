package com.clinicadermatologica.app.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * Clave primaria compuesta para la entidad débil Alergia.
 * Identifica una alergia por la historia clínica a la que pertenece y el tipo de alergia.
 * No existe una clave sustituta (surrogate key): la identidad de la entidad débil
 * depende completamente de su entidad propietaria (MedicalRecord).
 */
@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AlergiaId implements Serializable {

    @Column(name = "historia_clinica_id")
    private Long medicalRecordId;

    @Column(name = "tipo", length = 100)
    private String tipo;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AlergiaId)) return false;
        AlergiaId that = (AlergiaId) o;
        return Objects.equals(medicalRecordId, that.medicalRecordId) &&
               Objects.equals(tipo, that.tipo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(medicalRecordId, tipo);
    }
}
