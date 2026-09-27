package com.clinicadermatologica.app.domain.repository;

import com.clinicadermatologica.app.domain.model.ClinicalEntry;
import com.clinicadermatologica.app.domain.model.ClinicalEntryAudit;

import java.util.List;
import java.util.Optional;

/**
 * PATRÓN DAO — Contrato de acceso a datos para notas de evolución clínica y su pista de auditoría.
 *
 * Esta interfaz define el contrato de acceso a datos para ClinicalEntry.
 * Los servicios dependen únicamente de esta interfaz; nunca del adaptador ni del JPA directo.
 * La implementación concreta reside en ClinicalEntryRepositoryAdapter.
 */
public interface ClinicalEntryRepository {
    Optional<ClinicalEntry> findById(Long id);
    List<ClinicalEntry> findByPatientId(Long patientId);       // Entradas por paciente (reemplaza findByMedicalRecordId)
    Optional<ClinicalEntry> findByAppointmentId(Long appointmentId);
    ClinicalEntry save(ClinicalEntry entry);
    ClinicalEntryAudit saveAudit(ClinicalEntryAudit audit);
    List<ClinicalEntryAudit> findAuditByEntryId(Long entryId);
}
