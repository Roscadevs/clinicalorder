package com.clinicadermatologica.app.infrastructure.persistence.dao;

import com.clinicadermatologica.app.domain.model.MedicalRecordAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * PATRÓN DAO (Data Access Object) para la pista de auditoría de historias clínicas.
 *
 * Encapsula el acceso a datos del historial inmutable de cambios de las historias
 * clínicas mediante Spring Data JPA. Spring genera la implementación en tiempo de
 * ejecución; los servicios dependen directamente de este DAO.
 */
@Repository
public interface MedicalRecordAuditDAO extends JpaRepository<MedicalRecordAudit, Long> {

    /** Historial de cambios de una historia clínica, del más reciente al más antiguo. */
    List<MedicalRecordAudit> findByMedicalRecordIdOrderByUpdatedAtDesc(Long medicalRecordId);
}
