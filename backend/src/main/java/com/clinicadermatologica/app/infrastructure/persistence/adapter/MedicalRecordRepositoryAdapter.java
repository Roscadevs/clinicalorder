package com.clinicadermatologica.app.infrastructure.persistence.adapter;

import com.clinicadermatologica.app.domain.model.MedicalRecord; // Entidad MedicalRecord
import com.clinicadermatologica.app.domain.model.MedicalRecordAudit; // Entidad de auditoría
import com.clinicadermatologica.app.domain.repository.MedicalRecordRepository; // Interfaz del dominio
import com.clinicadermatologica.app.infrastructure.persistence.jpa.JpaMedicalRecordAuditRepository; // JPA Audit Repository
import com.clinicadermatologica.app.infrastructure.persistence.jpa.JpaMedicalRecordRepository; // JPA Repository
import lombok.RequiredArgsConstructor; // Inyección por constructor
import org.springframework.stereotype.Component; // Componente Spring

import java.util.List; // Colección de lista
import java.util.Optional; // Contenedor opcional

/**
 * Adaptador de infraestructura para Historias Clínicas y su auditoría inmutable.
 */
@Component // Componente Spring
@RequiredArgsConstructor // Inyección por constructor
public class MedicalRecordRepositoryAdapter implements MedicalRecordRepository {

    private final JpaMedicalRecordRepository jpaMedicalRecordRepository; // Repositorio JPA de historia clínica
    private final JpaMedicalRecordAuditRepository jpaAuditRepository; // Repositorio JPA de auditoría

    @Override
    public Optional<MedicalRecord> findById(Long id) {
        return jpaMedicalRecordRepository.findById(id); // Delega la búsqueda
    }

    @Override
    public Optional<MedicalRecord> findByPatientId(Long patientId) {
        return jpaMedicalRecordRepository.findByPatientId(patientId); // Búsqueda 1:1 por paciente
    }

    @Override
    public MedicalRecord save(MedicalRecord medicalRecord) {
        return jpaMedicalRecordRepository.save(medicalRecord); // Persiste la historia clínica
    }

    @Override
    public MedicalRecordAudit saveAudit(MedicalRecordAudit audit) {
        return jpaAuditRepository.save(audit); // Guarda el registro inmutable de auditoría
    }

    @Override
    public List<MedicalRecordAudit> findAuditHistory(Long medicalRecordId) {
        return jpaAuditRepository.findByMedicalRecordIdOrderByModifiedAtDesc(medicalRecordId); // Historial de auditoría
    }
}
