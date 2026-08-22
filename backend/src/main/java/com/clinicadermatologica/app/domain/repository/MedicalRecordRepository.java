package com.clinicadermatologica.app.domain.repository;

import com.clinicadermatologica.app.domain.model.MedicalRecord; // Entidad MedicalRecord
import com.clinicadermatologica.app.domain.model.MedicalRecordAudit; // Entidad de auditoría

import java.util.List; // Colección de lista
import java.util.Optional; // Contenedor opcional

/**
 * Contrato de repositorio del dominio para historias clínicas y su auditoría inmutable.
 */
public interface MedicalRecordRepository {
    Optional<MedicalRecord> findById(Long id); // Búsqueda por ID de historia clínica
    Optional<MedicalRecord> findByPatientId(Long patientId); // Búsqueda por ID de paciente (1:1)
    MedicalRecord save(MedicalRecord medicalRecord); // Guarda o actualiza la historia clínica
    MedicalRecordAudit saveAudit(MedicalRecordAudit audit); // Guarda el registro de auditoría inmutable
    List<MedicalRecordAudit> findAuditHistory(Long medicalRecordId); // Obtiene el historial de auditoría
}
