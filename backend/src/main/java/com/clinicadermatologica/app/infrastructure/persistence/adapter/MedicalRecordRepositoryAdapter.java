package com.clinicadermatologica.app.infrastructure.persistence.adapter;

import com.clinicadermatologica.app.domain.model.MedicalRecord;
import com.clinicadermatologica.app.domain.model.MedicalRecordAudit;
import com.clinicadermatologica.app.domain.repository.MedicalRecordRepository;
import com.clinicadermatologica.app.infrastructure.persistence.jpa.JpaMedicalRecordAuditRepository;
import com.clinicadermatologica.app.infrastructure.persistence.jpa.JpaMedicalRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * PATRÓN DAO — Implementación concreta del contrato MedicalRecordRepository.
 *
 * Este adaptador actúa como la capa DAO entre el dominio y la infraestructura de persistencia.
 * Traduce el contrato definido en MedicalRecordRepository hacia las operaciones de Spring Data JPA,
 * manteniendo al dominio completamente desacoplado de la tecnología de persistencia subyacente.
 * MedicalRecordService solo conoce MedicalRecordRepository (interfaz); nunca este adaptador ni el JPA directo.
 */
@Component
@RequiredArgsConstructor
public class MedicalRecordRepositoryAdapter implements MedicalRecordRepository {

    private final JpaMedicalRecordRepository jpaMedicalRecordRepository;
    private final JpaMedicalRecordAuditRepository jpaAuditRepository;

    @Override
    public Optional<MedicalRecord> findById(Long id) {
        return jpaMedicalRecordRepository.findById(id);
    }

    @Override
    public Optional<MedicalRecord> findByPatientId(Long patientId) {
        return jpaMedicalRecordRepository.findByPatientId(patientId);
    }

    @Override
    public MedicalRecord save(MedicalRecord medicalRecord) {
        return jpaMedicalRecordRepository.save(medicalRecord);
    }

    @Override
    public MedicalRecordAudit saveAudit(MedicalRecordAudit audit) {
        return jpaAuditRepository.save(audit);
    }

    @Override
    public List<MedicalRecordAudit> findAuditHistory(Long medicalRecordId) {
        return jpaAuditRepository.findByMedicalRecordIdOrderByUpdatedAtDesc(medicalRecordId);
    }
}
