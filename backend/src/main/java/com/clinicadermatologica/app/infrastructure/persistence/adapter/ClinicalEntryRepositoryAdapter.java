package com.clinicadermatologica.app.infrastructure.persistence.adapter;

import com.clinicadermatologica.app.domain.model.ClinicalEntry; // Entidad ClinicalEntry
import com.clinicadermatologica.app.domain.model.ClinicalEntryAudit; // Entidad de auditoría
import com.clinicadermatologica.app.domain.repository.ClinicalEntryRepository; // Interfaz ClinicalEntryRepository
import com.clinicadermatologica.app.infrastructure.persistence.jpa.JpaClinicalEntryAuditRepository; // JPA Audit
import com.clinicadermatologica.app.infrastructure.persistence.jpa.JpaClinicalEntryRepository; // JPA Repository
import lombok.RequiredArgsConstructor; // Inyección por constructor
import org.springframework.stereotype.Component; // Componente Spring

import java.util.List; // Colección de lista
import java.util.Optional; // Contenedor opcional

/**
 * Adaptador de infraestructura para las notas de evolución clínica y su auditoría.
 */
@Component // Componente Spring
@RequiredArgsConstructor // Inyección por constructor
public class ClinicalEntryRepositoryAdapter implements ClinicalEntryRepository {

    private final JpaClinicalEntryRepository jpaEntryRepository; // Inyección de JPA Repository
    private final JpaClinicalEntryAuditRepository jpaAuditRepository; // Inyección de JPA Audit Repository

    @Override
    public Optional<ClinicalEntry> findById(Long id) {
        return jpaEntryRepository.findById(id); // Delega la búsqueda
    }

    @Override
    public List<ClinicalEntry> findByMedicalRecordId(Long medicalRecordId) {
        return jpaEntryRepository.findByMedicalRecordIdOrderByCreatedAtDesc(medicalRecordId); // Evoluciones por historia
    }

    @Override
    public Optional<ClinicalEntry> findByAppointmentId(Long appointmentId) {
        return jpaEntryRepository.findByAppointmentId(appointmentId); // Evolución ligada al turno
    }

    @Override
    public ClinicalEntry save(ClinicalEntry entry) {
        return jpaEntryRepository.save(entry); // Persiste la nota clínica
    }

    @Override
    public ClinicalEntryAudit saveAudit(ClinicalEntryAudit audit) {
        return jpaAuditRepository.save(audit); // Guarda el registro de auditoría
    }

    @Override
    public List<ClinicalEntryAudit> findAuditByEntryId(Long entryId) {
        return jpaAuditRepository.findByClinicalEntryIdOrderByModifiedAtDesc(entryId); // Historial de cambios
    }
}
