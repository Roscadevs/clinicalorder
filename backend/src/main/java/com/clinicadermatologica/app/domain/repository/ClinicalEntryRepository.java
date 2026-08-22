package com.clinicadermatologica.app.domain.repository;

import com.clinicadermatologica.app.domain.model.ClinicalEntry; // Entidad ClinicalEntry
import com.clinicadermatologica.app.domain.model.ClinicalEntryAudit; // Entidad de auditoría

import java.util.List; // Colección de lista
import java.util.Optional; // Contenedor opcional

/**
 * Contrato de repositorio del dominio para notas de evolución clínica y su pista de auditoría.
 */
public interface ClinicalEntryRepository {
    Optional<ClinicalEntry> findById(Long id); // Búsqueda de nota por ID
    List<ClinicalEntry> findByMedicalRecordId(Long medicalRecordId); // Todas las evoluciones de una historia
    Optional<ClinicalEntry> findByAppointmentId(Long appointmentId); // Evolución ligada a un turno
    ClinicalEntry save(ClinicalEntry entry); // Guarda o actualiza la nota de evolución
    ClinicalEntryAudit saveAudit(ClinicalEntryAudit audit); // Guarda el registro de auditoría de la nota
    List<ClinicalEntryAudit> findAuditByEntryId(Long entryId); // Historial de ediciones de una nota
}
