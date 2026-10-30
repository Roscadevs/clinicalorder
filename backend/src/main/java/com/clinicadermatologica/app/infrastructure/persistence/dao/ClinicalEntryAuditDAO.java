package com.clinicadermatologica.app.infrastructure.persistence.dao;

import com.clinicadermatologica.app.domain.model.ClinicalEntryAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * PATRÓN DAO (Data Access Object) para la pista de auditoría de evoluciones clínicas.
 *
 * Encapsula el acceso a datos del historial inmutable de cambios de las notas de
 * evolución clínica mediante Spring Data JPA. Spring genera la implementación en
 * tiempo de ejecución; los servicios dependen directamente de este DAO.
 */
@Repository
public interface ClinicalEntryAuditDAO extends JpaRepository<ClinicalEntryAudit, Long> {

    /** Historial de cambios de una evolución clínica, del más reciente al más antiguo. */
    List<ClinicalEntryAudit> findByClinicalEntryIdOrderByModifiedAtDesc(Long clinicalEntryId);
}
