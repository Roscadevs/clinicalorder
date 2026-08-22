package com.clinicadermatologica.app.infrastructure.persistence.jpa;

import com.clinicadermatologica.app.domain.model.MedicalRecordAudit; // Entidad de auditoría
import org.springframework.data.jpa.repository.JpaRepository; // Spring Data JPA
import org.springframework.stereotype.Repository; // Componente de repositorio

import java.util.List; // Colección de lista

/**
 * Repositorio Spring Data JPA para la pista de auditoría de historias clínicas.
 */
@Repository // Componente Spring Data
public interface JpaMedicalRecordAuditRepository extends JpaRepository<MedicalRecordAudit, Long> {
    List<MedicalRecordAudit> findByMedicalRecordIdOrderByModifiedAtDesc(Long medicalRecordId); // Auditoría cronológica inversa
}
