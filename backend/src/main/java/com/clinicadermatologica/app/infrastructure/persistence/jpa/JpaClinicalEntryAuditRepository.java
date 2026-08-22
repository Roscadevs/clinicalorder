package com.clinicadermatologica.app.infrastructure.persistence.jpa;

import com.clinicadermatologica.app.domain.model.ClinicalEntryAudit; // Entidad de auditoría
import org.springframework.data.jpa.repository.JpaRepository; // Spring Data JPA
import org.springframework.stereotype.Repository; // Componente de repositorio

import java.util.List; // Colección de lista

/**
 * Repositorio Spring Data JPA para la pista de auditoría de evoluciones clínicas.
 */
@Repository // Componente Spring Data
public interface JpaClinicalEntryAuditRepository extends JpaRepository<ClinicalEntryAudit, Long> {
    List<ClinicalEntryAudit> findByClinicalEntryIdOrderByModifiedAtDesc(Long clinicalEntryId); // Historial de cambios
}
