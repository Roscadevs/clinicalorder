package com.clinicadermatologica.app.application.service;

import com.clinicadermatologica.app.domain.exception.*; // Excepciones de negocio
import com.clinicadermatologica.app.domain.model.*; // Entidades del dominio
import com.clinicadermatologica.app.domain.repository.*; // Repositorios del dominio
import com.clinicadermatologica.app.presentation.dto.*; // DTOs
import com.fasterxml.jackson.databind.ObjectMapper; // Serializador JSON para snapshots de auditoría
import lombok.RequiredArgsConstructor; // Inyección por constructor
import lombok.extern.slf4j.Slf4j; // Logger
import org.springframework.stereotype.Service; // Servicio Spring
import org.springframework.transaction.annotation.Transactional; // Transacciones ACID

import java.util.List; // Colección de lista
import java.util.stream.Collectors; // Streams

/**
 * Servicio de Aplicación para Historias Clínicas, Notas de Evolución y Auditoría Inmutable.
 * Exclusivo para Médicas (Physicians).
 */
@Service // Componente de servicio Spring
@RequiredArgsConstructor // Inyección por constructor
@Slf4j // Logger
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository; // Repositorio de historias
    private final ClinicalEntryRepository clinicalEntryRepository; // Repositorio de evoluciones
    private final PatientRepository patientRepository; // Repositorio de pacientes
    private final AppointmentRepository appointmentRepository; // Repositorio de turnos
    private final UserRepository userRepository; // Repositorio de usuarios
    private final ObjectMapper objectMapper; // Serializador JSON Jackson

    /**
     * Consulta la historia clínica completa de un paciente por su ID.
     */
    @Transactional(readOnly = true) // Solo lectura
    public MedicalRecordDTO getMedicalRecordByPatientId(Long patientId) {
        return medicalRecordRepository.findByPatientId(patientId)
                .map(this::mapRecordToDTO)
                .orElse(null); // Retorna null si es la primera consulta y aún no tiene ficha creada
    }

    /**
     * Crea o actualiza la ficha médica general, registrando automáticamente la auditoría de cambios.
     */
    @Transactional // Transacción ACID: la actualización y la auditoría ocurren atómicamente
    public MedicalRecordDTO saveOrUpdateMedicalRecord(Long patientId, MedicalRecordDTO dto, Long physicianUserId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado"));

        User physician = userRepository.findById(physicianUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Médica no encontrada"));

        MedicalRecord record = medicalRecordRepository.findByPatientId(patientId).orElse(null);

        if (record == null) {
            // Creación inicial de la historia clínica
            record = MedicalRecord.builder()
                    .patient(patient)
                    .createdByUser(physician)
                    .build();
            applyDtoToEntity(dto, record);
            record = medicalRecordRepository.save(record);
            log.info("Historia clínica #{} creada para paciente #{} por médica {}", record.getId(), patientId, physician.getUsername());
        } else {
            // Modificación: Captura el estado previo para la tabla de auditoría
            try {
                String previousJson = objectMapper.writeValueAsString(mapRecordToDTO(record));
                applyDtoToEntity(dto, record);
                String newJson = objectMapper.writeValueAsString(mapRecordToDTO(record));

                // Registra la fila inmutable en historia_clinica_audit
                MedicalRecordAudit audit = MedicalRecordAudit.builder()
                        .medicalRecord(record)
                        .modifiedByUser(physician)
                        .modifiedSection("ACTUALIZACION_GENERAL")
                        .previousValues(previousJson)
                        .newValues(newJson)
                        .build();

                medicalRecordRepository.saveAudit(audit);
                record = medicalRecordRepository.save(record);
                log.info("Historia clínica #{} actualizada con auditoría por médica {}", record.getId(), physician.getUsername());
            } catch (Exception e) {
                log.error("Error al serializar auditoría de historia clínica: {}", e.getMessage());
                throw new BusinessRuleException("Error al generar registro de auditoría clínica");
            }
        }

        return mapRecordToDTO(record);
    }

    /**
     * Redacta una nueva nota de evolución clínica para una sesión/turno específico.
     */
    @Transactional // Transacción ACID
    public ClinicalEntryResponseDTO addClinicalEntry(ClinicalEntryRequestDTO request, Long physicianUserId) {
        MedicalRecord record = medicalRecordRepository.findById(request.getMedicalRecordId())
                .orElseThrow(() -> new ResourceNotFoundException("Historia clínica no encontrada"));

        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Turno no encontrado"));

        User author = userRepository.findById(physicianUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Médica autora no encontrada"));

        ClinicalEntry entry = ClinicalEntry.builder()
                .medicalRecord(record)
                .appointment(appointment)
                .authorUser(author)
                .content(request.getContent())
                .build();

        return mapEntryToDTO(clinicalEntryRepository.save(entry));
    }

    /**
     * Edita una nota de evolución previa, registrando atómicamente la auditoría del cambio.
     */
    @Transactional // Transacción ACID
    public ClinicalEntryResponseDTO updateClinicalEntry(Long entryId, String newContent, Long physicianUserId) {
        ClinicalEntry entry = clinicalEntryRepository.findById(entryId)
                .orElseThrow(() -> new ResourceNotFoundException("Nota clínica no encontrada con ID " + entryId));

        User physician = userRepository.findById(physicianUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Médica no encontrada"));

        // Guarda el snapshot de auditoría con el texto original
        ClinicalEntryAudit audit = ClinicalEntryAudit.builder()
                .clinicalEntry(entry)
                .modifiedByUser(physician)
                .previousContent(entry.getContent())
                .newContent(newContent)
                .build();

        clinicalEntryRepository.saveAudit(audit);

        // Actualiza el contenido de la nota
        entry.setContent(newContent);
        return mapEntryToDTO(clinicalEntryRepository.save(entry));
    }

    /**
     * Consulta todas las notas de evolución médica de una historia clínica.
     */
    @Transactional(readOnly = true)
    public List<ClinicalEntryResponseDTO> getClinicalEntries(Long medicalRecordId) {
        return clinicalEntryRepository.findByMedicalRecordId(medicalRecordId).stream()
                .map(this::mapEntryToDTO)
                .collect(Collectors.toList());
    }

    private void applyDtoToEntity(MedicalRecordDTO dto, MedicalRecord r) {
        r.setHasHta(dto.getHasHta() != null ? dto.getHasHta() : false);
        r.setHasDbt(dto.getHasDbt() != null ? dto.getHasDbt() : false);
        r.setHasHypothyroidism(dto.getHasHypothyroidism() != null ? dto.getHasHypothyroidism() : false);
        r.setHasHyperthyroidism(dto.getHasHyperthyroidism() != null ? dto.getHasHyperthyroidism() : false);
        r.setHasAnemia(dto.getHasAnemia() != null ? dto.getHasAnemia() : false);
        r.setHasAutoimmuneDiseases(dto.getHasAutoimmuneDiseases() != null ? dto.getHasAutoimmuneDiseases() : false);
        r.setHasGlaucoma(dto.getHasGlaucoma() != null ? dto.getHasGlaucoma() : false);
        r.setHasCoagulationDisorders(dto.getHasCoagulationDisorders() != null ? dto.getHasCoagulationDisorders() : false);
        r.setHasScarringAlterations(dto.getHasScarringAlterations() != null ? dto.getHasScarringAlterations() : false);
        r.setOtherPathological(dto.getOtherPathological());

        r.setAllergyAnesthesia(dto.getAllergyAnesthesia() != null ? dto.getAllergyAnesthesia() : false);
        r.setAllergyEgg(dto.getAllergyEgg() != null ? dto.getAllergyEgg() : false);
        r.setAllergyFish(dto.getAllergyFish() != null ? dto.getAllergyFish() : false);
        r.setOtherAllergies(dto.getOtherAllergies());

        r.setHabitTobacco(dto.getHabitTobacco() != null ? dto.getHabitTobacco() : false);
        r.setHabitAlcohol(dto.getHabitAlcohol() != null ? dto.getHabitAlcohol() : false);
        r.setHabitSunExposure(dto.getHabitSunExposure() != null ? dto.getHabitSunExposure() : false);
        r.setHabitSpfUse(dto.getHabitSpfUse() != null ? dto.getHabitSpfUse() : false);

        r.setSurgicalHistory(dto.getSurgicalHistory());
        r.setGynecologicalHistory(dto.getGynecologicalHistory());
        r.setCurrentMedications(dto.getCurrentMedications());
        r.setPreviousAestheticTreatments(dto.getPreviousAestheticTreatments());

        r.setFitzpatrickPhototype(dto.getFitzpatrickPhototype());
        r.setPhysicalExamination(dto.getPhysicalExamination());
        r.setTreatmentPlan(dto.getTreatmentPlan());
        r.setInformedConsentSigned(dto.getInformedConsentSigned() != null ? dto.getInformedConsentSigned() : false);
    }

    private MedicalRecordDTO mapRecordToDTO(MedicalRecord r) {
        return MedicalRecordDTO.builder()
                .id(r.getId())
                .patientId(r.getPatient().getId())
                .patientName(r.getPatient().getName())
                .patientDni(r.getPatient().getDni())
                .hasHta(r.getHasHta())
                .hasDbt(r.getHasDbt())
                .hasHypothyroidism(r.getHasHypothyroidism())
                .hasHyperthyroidism(r.getHasHyperthyroidism())
                .hasAnemia(r.getHasAnemia())
                .hasAutoimmuneDiseases(r.getHasAutoimmuneDiseases())
                .hasGlaucoma(r.getHasGlaucoma())
                .hasCoagulationDisorders(r.getHasCoagulationDisorders())
                .hasScarringAlterations(r.getHasScarringAlterations())
                .otherPathological(r.getOtherPathological())
                .allergyAnesthesia(r.getAllergyAnesthesia())
                .allergyEgg(r.getAllergyEgg())
                .allergyFish(r.getAllergyFish())
                .otherAllergies(r.getOtherAllergies())
                .habitTobacco(r.getHabitTobacco())
                .habitAlcohol(r.getHabitAlcohol())
                .habitSunExposure(r.getHabitSunExposure())
                .habitSpfUse(r.getHabitSpfUse())
                .surgicalHistory(r.getSurgicalHistory())
                .gynecologicalHistory(r.getGynecologicalHistory())
                .currentMedications(r.getCurrentMedications())
                .previousAestheticTreatments(r.getPreviousAestheticTreatments())
                .fitzpatrickPhototype(r.getFitzpatrickPhototype())
                .physicalExamination(r.getPhysicalExamination())
                .treatmentPlan(r.getTreatmentPlan())
                .informedConsentSigned(r.getInformedConsentSigned())
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
                .build();
    }

    private ClinicalEntryResponseDTO mapEntryToDTO(ClinicalEntry e) {
        return ClinicalEntryResponseDTO.builder()
                .id(e.getId())
                .medicalRecordId(e.getMedicalRecord().getId())
                .appointmentId(e.getAppointment().getId())
                .authorUserId(e.getAuthorUser().getId())
                .authorFullName(e.getAuthorUser().getFullName())
                .content(e.getContent())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }
}
