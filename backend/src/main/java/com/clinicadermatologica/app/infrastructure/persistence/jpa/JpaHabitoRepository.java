package com.clinicadermatologica.app.infrastructure.persistence.jpa;

import com.clinicadermatologica.app.domain.model.Habito;
import com.clinicadermatologica.app.domain.model.HabitoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio Spring Data JPA para la entidad débil Habito.
 * Delegado por HabitoRepositoryAdapter (DAO Implementation).
 */
@Repository
public interface JpaHabitoRepository extends JpaRepository<Habito, HabitoId> {

    List<Habito> findByIdMedicalRecordId(Long medicalRecordId);
}
