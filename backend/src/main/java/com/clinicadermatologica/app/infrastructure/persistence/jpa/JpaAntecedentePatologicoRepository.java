package com.clinicadermatologica.app.infrastructure.persistence.jpa;

import com.clinicadermatologica.app.domain.model.AntecedentePatologico;
import com.clinicadermatologica.app.domain.model.AntecedentePatologicoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio Spring Data JPA para la entidad débil AntecedentePatologico.
 * Delegado por AntecedentePatologicoRepositoryAdapter (DAO Implementation).
 */
@Repository
public interface JpaAntecedentePatologicoRepository
        extends JpaRepository<AntecedentePatologico, AntecedentePatologicoId> {

    List<AntecedentePatologico> findByIdMedicalRecordId(Long medicalRecordId);
}
