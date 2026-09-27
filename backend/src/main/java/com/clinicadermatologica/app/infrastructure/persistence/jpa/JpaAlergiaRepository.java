package com.clinicadermatologica.app.infrastructure.persistence.jpa;

import com.clinicadermatologica.app.domain.model.Alergia;
import com.clinicadermatologica.app.domain.model.AlergiaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio Spring Data JPA para la entidad débil Alergia.
 * Delegado por AlergiaRepositoryAdapter (DAO Implementation).
 */
@Repository
public interface JpaAlergiaRepository extends JpaRepository<Alergia, AlergiaId> {

    /** Obtiene todas las alergias de una historia clínica por el componente medicalRecordId de la PK compuesta. */
    List<Alergia> findByIdMedicalRecordId(Long medicalRecordId);
}
