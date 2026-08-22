package com.clinicadermatologica.app.infrastructure.persistence.jpa;

import com.clinicadermatologica.app.domain.model.ClinicalEntry; // Entidad ClinicalEntry
import org.springframework.data.jpa.repository.JpaRepository; // Spring Data JPA
import org.springframework.stereotype.Repository; // Componente de repositorio

import java.util.List; // Colección de lista
import java.util.Optional; // Contenedor opcional

/**
 * Repositorio Spring Data JPA para las notas de evolución clínica.
 */
@Repository // Componente Spring Data
public interface JpaClinicalEntryRepository extends JpaRepository<ClinicalEntry, Long> {
    List<ClinicalEntry> findByMedicalRecordIdOrderByCreatedAtDesc(Long medicalRecordId); // Evoluciones por historia
    Optional<ClinicalEntry> findByAppointmentId(Long appointmentId); // Evolución ligada a una cita
}
