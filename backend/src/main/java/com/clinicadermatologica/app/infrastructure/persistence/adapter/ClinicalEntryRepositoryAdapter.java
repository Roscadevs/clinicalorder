package com.clinicadermatologica.app.infrastructure.persistence.adapter;

import com.clinicadermatologica.app.domain.model.ClinicalEntry;
import com.clinicadermatologica.app.domain.model.ClinicalEntryAudit;
import com.clinicadermatologica.app.domain.repository.ClinicalEntryRepository;
import com.clinicadermatologica.app.infrastructure.persistence.jpa.JpaClinicalEntryAuditRepository;
import com.clinicadermatologica.app.infrastructure.persistence.jpa.JpaClinicalEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * PATRÓN DAO — Implementación concreta del contrato ClinicalEntryRepository.
 *
 * Este adaptador actúa como la capa DAO entre el dominio y la infraestructura de persistencia.
 * Traduce el contrato definido en ClinicalEntryRepository hacia las operaciones de Spring Data JPA,
 * manteniendo al dominio completamente desacoplado de la tecnología de persistencia subyacente.
 */
@Component
@RequiredArgsConstructor
public class ClinicalEntryRepositoryAdapter implements ClinicalEntryRepository {

    private final JpaClinicalEntryRepository jpaEntryRepository;
    private final JpaClinicalEntryAuditRepository jpaAuditRepository;

    @Override
    public Optional<ClinicalEntry> findById(Long id) {
        return jpaEntryRepository.findById(id);
    }

    @Override
    public List<ClinicalEntry> findByPatientId(Long patientId) {
        return jpaEntryRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
    }

    @Override
    public Optional<ClinicalEntry> findByAppointmentId(Long appointmentId) {
        return jpaEntryRepository.findByAppointmentId(appointmentId);
    }

    @Override
    public ClinicalEntry save(ClinicalEntry entry) {
        return jpaEntryRepository.save(entry);
    }

    @Override
    public ClinicalEntryAudit saveAudit(ClinicalEntryAudit audit) {
        return jpaAuditRepository.save(audit);
    }

    @Override
    public List<ClinicalEntryAudit> findAuditByEntryId(Long entryId) {
        return jpaAuditRepository.findByClinicalEntryIdOrderByModifiedAtDesc(entryId);
    }
}
