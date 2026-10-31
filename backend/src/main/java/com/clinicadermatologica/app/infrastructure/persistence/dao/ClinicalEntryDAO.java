package com.clinicadermatologica.app.infrastructure.persistence.dao;

import com.clinicadermatologica.app.domain.model.ClinicalEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * PATRÓN DAO (Data Access Object) para la entidad ClinicalEntry (notas de evolución clínica).
 *
 * Encapsula el acceso a datos de las evoluciones clínicas mediante Spring Data JPA.
 * Spring genera la implementación en tiempo de ejecución; los servicios dependen
 * directamente de este DAO.
 */
@Repository
public interface ClinicalEntryDAO extends JpaRepository<ClinicalEntry, Long> {

    /** Evoluciones de un paciente ordenadas por fecha descendente. */
    List<ClinicalEntry> findByPatientIdOrderByCreatedAtDesc(Long patientId);

    /** Evolución ligada a una cita concreta. */
    Optional<ClinicalEntry> findByAppointmentId(Long appointmentId);
}
