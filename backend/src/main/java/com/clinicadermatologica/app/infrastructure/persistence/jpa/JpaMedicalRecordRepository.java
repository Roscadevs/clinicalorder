package com.clinicadermatologica.app.infrastructure.persistence.jpa;

import com.clinicadermatologica.app.domain.model.MedicalRecord; // Entidad MedicalRecord
import org.springframework.data.jpa.repository.JpaRepository; // Spring Data JPA
import org.springframework.stereotype.Repository; // Componente de repositorio

import java.util.Optional; // Contenedor opcional

/**
 * Repositorio Spring Data JPA para la ficha médica base.
 */
@Repository // Componente Spring Data
public interface JpaMedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    Optional<MedicalRecord> findByPatientId(Long patientId); // Búsqueda por ID de paciente (1:1)
}
