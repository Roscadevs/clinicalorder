package com.clinicadermatologica.app.infrastructure.persistence.jpa;

import com.clinicadermatologica.app.domain.model.ClinicalEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio Spring Data JPA para las notas de evolución clínica.
 * Delegado por ClinicalEntryRepositoryAdapter (DAO Implementation).
 */
@Repository
public interface JpaClinicalEntryRepository extends JpaRepository<ClinicalEntry, Long> {

    /** Evoluciones de un paciente ordenadas por fecha descendente. */
    List<ClinicalEntry> findByPatientIdOrderByCreatedAtDesc(Long patientId);

    /** Evolución ligada a una cita concreta. */
    Optional<ClinicalEntry> findByAppointmentId(Long appointmentId);
}
