package com.clinicadermatologica.app.infrastructure.persistence.dao;

import com.clinicadermatologica.app.domain.model.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * PATRÓN DAO (Data Access Object) para la entidad MedicalRecord (historia clínica).
 *
 * Encapsula el acceso a datos de las historias clínicas mediante Spring Data JPA.
 * Spring genera la implementación en tiempo de ejecución; los servicios dependen
 * directamente de este DAO.
 */
@Repository
public interface MedicalRecordDAO extends JpaRepository<MedicalRecord, Long> {

    /** Busca la historia clínica de un paciente (relación 1:1). */
    Optional<MedicalRecord> findByPatientId(Long patientId);
}
