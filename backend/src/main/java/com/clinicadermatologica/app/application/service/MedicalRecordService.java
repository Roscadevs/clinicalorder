package com.clinicadermatologica.app.application.service;

import com.clinicadermatologica.app.domain.exception.*;
import com.clinicadermatologica.app.domain.model.*;
import com.clinicadermatologica.app.domain.repository.*;
import com.clinicadermatologica.app.infrastructure.security.AesEncryptionService;
import com.clinicadermatologica.app.presentation.dto.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.GeneralSecurityException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio de Aplicacion para Historias Clinicas, Entradas Clinicas y Auditoria Inmutable.
 * Exclusivo para Doctoras (rol DOCTORA).
 *
 * SEGURIDAD:
 * - physicalExamination y ClinicalEntry.content se cifran con AES-256-GCM antes de persistir.
 * - El descifrado ocurre exclusivamente en este servicio; DTOs y controladores solo manejan texto en claro.
 * - Los snapshots de auditoria en ClinicalEntryAudit tambien se almacenan cifrados.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final ClinicalEntryRepository clinicalEntryRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final AlergiaRepository alergiaRepository;
    private final AntecedentePatologicoRepository antecedentePatologicoRepository;
    private final HabitoRepository habitoRepository;
    private final AesEncryptionService aesEncryptionService; // Singleton — AES-256-GCM
    private final ObjectMapper objectMapper;

    // ─── HISTORIA CLINICA ───────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public MedicalRecordDTO getMedicalRecordByPatientId(Long patientId) {
        return medicalRecordRepository.findByPatientId(patientId)
                .map(this::mapRecordToDTO)
                .orElse(null);
    }

    @Transactional
    public MedicalRecordDTO saveOrUpdateMedicalRecord(Long patientId, MedicalRecordDTO dto, Long physicianUserId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado"));

        User physician = userRepository.findById(physicianUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Medica no encontrada"));

        MedicalRecord record = medicalRecordRepository.findByPatientId(patientId).orElse(null);

        if (record == null) {
            record = MedicalRecord.builder()
                    .patient(patient)
                    .createdByUser(physician)
                    .build();
            applyDtoToEntity(dto, record);
            record = medicalRecordRepository.save(record);
            log.info("Historia clinica #{} creada para paciente #{}", record.getId(), patientId);
        } else {
            try {
                String previousJson = objectMapper.writeValueAsString(mapRecordToDTO(record));
                applyDtoToEntity(dto, record);
                String newJson = objectMapper.writeValueAsString(mapRecordToDTO(record));

                MedicalRecordAudit audit = MedicalRecordAudit.builder()
                        .medicalRecord(record)
                        .modifiedByUser(physician)
                        .modifiedSection("ACTUALIZACION_GENERAL")
                        .previousValues(previousJson)
                        .newValues(newJson)
                        .build();

                medicalRecordRepository.saveAudit(audit);
                record = medicalRecordRepository.save(record);
                log.info("Historia clinica #{} actualizada con auditoria", record.getId());
            } catch (Exception e) {
                log.error("Error al serializar auditoria de historia clinica: {}", e.getMessage());
                throw new BusinessRuleException("Error al generar registro de auditoria clinica");
            }
        }

        return mapRecordToDTO(record);
    }

    // ─── ENTRADAS CLINICAS ──────────────────────────────────────────────────────

    @Transactional
    public ClinicalEntryResponseDTO addClinicalEntry(ClinicalEntryRequestDTO request, Long physicianUserId) {
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Turno no encontrado"));

        User author = userRepository.findById(physicianUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Medica autora no encontrada"));

        // El paciente se deriva del turno — no se acepta un patientId externo
        Patient patient = appointment.getPatient();

        byte[] encryptedContent = encrypt(request.getContent());

        ClinicalEntry entry = ClinicalEntry.builder()
                .patient(patient)
                .appointment(appointment)
                .authorUser(author)
                .content(encryptedContent)
                .build();

        return mapEntryToDTO(clinicalEntryRepository.save(entry));
    }

    @Transactional
    public ClinicalEntryResponseDTO updateClinicalEntry(Long entryId, String newContent, Long physicianUserId) {
        ClinicalEntry entry = clinicalEntryRepository.findById(entryId)
                .orElseThrow(() -> new ResourceNotFoundException("Nota clinica no encontrada con ID " + entryId));

        User physician = userRepository.findById(physicianUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Medica no encontrada"));

        byte[] encryptedNew = encrypt(newContent);

        // Auditoria: ambos snapshots almacenados cifrados
        ClinicalEntryAudit audit = ClinicalEntryAudit.builder()
                .clinicalEntry(entry)
                .modifiedByUser(physician)
                .previousContent(entry.getContent()) // ya cifrado
                .newContent(encryptedNew)
                .build();

        clinicalEntryRepository.saveAudit(audit);
        entry.setContent(encryptedNew);
        return mapEntryToDTO(clinicalEntryRepository.save(entry));
    }

    @Transactional(readOnly = true)
    public List<ClinicalEntryResponseDTO> getClinicalEntriesByPatient(Long patientId) {
        return clinicalEntryRepository.findByPatientId(patientId).stream()
                .map(this::mapEntryToDTO)
                .collect(Collectors.toList());
    }

    // ─── ALERGIAS ────────────────────────────────────────────────────────────────

    @Transactional
    public AlergiaResponseDTO addAlergia(Long medicalRecordId, AlergiaRequestDTO dto) {
        MedicalRecord record = medicalRecordRepository.findById(medicalRecordId)
                .orElseThrow(() -> new ResourceNotFoundException("Historia clinica no encontrada"));

        AlergiaId id = new AlergiaId(medicalRecordId, dto.getTipo().trim());
        if (alergiaRepository.existsById(id)) {
            throw new DuplicateResourceException(
                    "Ya existe una alergia de tipo '" + dto.getTipo() + "' en esta historia clinica");
        }

        Alergia alergia = Alergia.builder()
                .id(id)
                .medicalRecord(record)
                .observaciones(dto.getObservaciones())
                .build();

        return mapAlergiaToDTO(alergiaRepository.save(alergia));
    }

    @Transactional
    public void removeAlergia(Long medicalRecordId, String tipo) {
        AlergiaId id = new AlergiaId(medicalRecordId, tipo.trim());
        if (!alergiaRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Alergia de tipo '" + tipo + "' no encontrada en esta historia clinica");
        }
        alergiaRepository.delete(id);
    }

    // ─── ANTECEDENTES PATOLOGICOS ────────────────────────────────────────────────

    @Transactional
    public AntecedentePatologicoResponseDTO addAntecedentePatologico(Long medicalRecordId,
                                                                      AntecedentePatologicoRequestDTO dto) {
        MedicalRecord record = medicalRecordRepository.findById(medicalRecordId)
                .orElseThrow(() -> new ResourceNotFoundException("Historia clinica no encontrada"));

        AntecedentePatologicoId id = new AntecedentePatologicoId(medicalRecordId, dto.getTipo().trim());
        if (antecedentePatologicoRepository.existsById(id)) {
            throw new DuplicateResourceException(
                    "Ya existe un antecedente de tipo '" + dto.getTipo() + "' en esta historia clinica");
        }

        AntecedentePatologico ap = AntecedentePatologico.builder()
                .id(id)
                .medicalRecord(record)
                .observaciones(dto.getObservaciones())
                .build();

        return mapAntecedenteToDTO(antecedentePatologicoRepository.save(ap));
    }

    @Transactional
    public void removeAntecedentePatologico(Long medicalRecordId, String tipo) {
        AntecedentePatologicoId id = new AntecedentePatologicoId(medicalRecordId, tipo.trim());
        if (!antecedentePatologicoRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Antecedente de tipo '" + tipo + "' no encontrado en esta historia clinica");
        }
        antecedentePatologicoRepository.delete(id);
    }

    // ─── HABITOS ─────────────────────────────────────────────────────────────────

    @Transactional
    public HabitoResponseDTO addHabito(Long medicalRecordId, HabitoRequestDTO dto) {
        MedicalRecord record = medicalRecordRepository.findById(medicalRecordId)
                .orElseThrow(() -> new ResourceNotFoundException("Historia clinica no encontrada"));

        HabitoId id = new HabitoId(medicalRecordId, dto.getTipo().trim());
        if (habitoRepository.existsById(id)) {
            throw new DuplicateResourceException(
                    "Ya existe un habito de tipo '" + dto.getTipo() + "' en esta historia clinica");
        }

        Habito habito = Habito.builder()
                .id(id)
                .medicalRecord(record)
                .observaciones(dto.getObservaciones())
                .build();

        return mapHabitoToDTO(habitoRepository.save(habito));
    }

    @Transactional
    public void removeHabito(Long medicalRecordId, String tipo) {
        HabitoId id = new HabitoId(medicalRecordId, tipo.trim());
        if (!habitoRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Habito de tipo '" + tipo + "' no encontrado en esta historia clinica");
        }
        habitoRepository.delete(id);
    }

    // ─── HELPERS DE CIFRADO ──────────────────────────────────────────────────────

    private byte[] encrypt(String plaintext) {
        try {
            return aesEncryptionService.encrypt(plaintext);
        } catch (GeneralSecurityException e) {
            log.error("Error al cifrar contenido clinico: {}", e.getMessage());
            throw new BusinessRuleException("Error interno al procesar contenido clinico");
        }
    }

    private String decrypt(byte[] ciphertext) {
        if (ciphertext == null) return null;
        try {
            return aesEncryptionService.decrypt(ciphertext);
        } catch (GeneralSecurityException e) {
            log.error("Error al descifrar contenido clinico: {}", e.getMessage());
            throw new BusinessRuleException("Error interno al recuperar contenido clinico");
        }
    }

    // ─── MAPPERS ─────────────────────────────────────────────────────────────────

    private void applyDtoToEntity(MedicalRecordDTO dto, MedicalRecord r) {
        r.setFitzpatrickPhototype(dto.getFitzpatrickPhototype());
        r.setPhysicalExamination(
                dto.getPhysicalExamination() != null ? encrypt(dto.getPhysicalExamination()) : null);
        r.setInformedConsentSigned(dto.getInformedConsentSigned() != null ? dto.getInformedConsentSigned() : false);
        r.setGynecologicalHistory(dto.getGynecologicalHistory());
        r.setSurgicalHistory(dto.getSurgicalHistory());
        r.setCurrentMedications(dto.getCurrentMedications());
        r.setPreviousAestheticTreatments(dto.getPreviousAestheticTreatments());
    }

    private MedicalRecordDTO mapRecordToDTO(MedicalRecord r) {
        List<AlergiaResponseDTO> alergias = alergiaRepository
                .findByMedicalRecordId(r.getId()).stream()
                .map(this::mapAlergiaToDTO)
                .collect(Collectors.toList());

        List<AntecedentePatologicoResponseDTO> antecedentes = antecedentePatologicoRepository
                .findByMedicalRecordId(r.getId()).stream()
                .map(this::mapAntecedenteToDTO)
                .collect(Collectors.toList());

        List<HabitoResponseDTO> habitos = habitoRepository
                .findByMedicalRecordId(r.getId()).stream()
                .map(this::mapHabitoToDTO)
                .collect(Collectors.toList());

        return MedicalRecordDTO.builder()
                .id(r.getId())
                .patientId(r.getPatient().getId())
                .patientName(r.getPatient().getName())
                .patientDni(r.getPatient().getDni())
                .fitzpatrickPhototype(r.getFitzpatrickPhototype())
                .physicalExamination(decrypt(r.getPhysicalExamination()))
                .informedConsentSigned(r.getInformedConsentSigned())
                .gynecologicalHistory(r.getGynecologicalHistory())
                .surgicalHistory(r.getSurgicalHistory())
                .currentMedications(r.getCurrentMedications())
                .previousAestheticTreatments(r.getPreviousAestheticTreatments())
                .alergias(alergias)
                .antecedentesPatologicos(antecedentes)
                .habitos(habitos)
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
                .build();
    }

    private ClinicalEntryResponseDTO mapEntryToDTO(ClinicalEntry e) {
        return ClinicalEntryResponseDTO.builder()
                .id(e.getId())
                .patientId(e.getPatient().getId())
                .appointmentId(e.getAppointment().getId())
                .serviceName(e.getAppointment().getService() != null ? e.getAppointment().getService().getName() : null)
                .authorUserId(e.getAuthorUser().getId())
                .authorFullName(e.getAuthorUser().getFullName())
                .content(decrypt(e.getContent()))
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }

    private AlergiaResponseDTO mapAlergiaToDTO(Alergia a) {
        return AlergiaResponseDTO.builder()
                .medicalRecordId(a.getId().getMedicalRecordId())
                .tipo(a.getId().getTipo())
                .observaciones(a.getObservaciones())
                .createdAt(a.getCreatedAt())
                .updatedAt(a.getUpdatedAt())
                .build();
    }

    private AntecedentePatologicoResponseDTO mapAntecedenteToDTO(AntecedentePatologico ap) {
        return AntecedentePatologicoResponseDTO.builder()
                .medicalRecordId(ap.getId().getMedicalRecordId())
                .tipo(ap.getId().getTipo())
                .observaciones(ap.getObservaciones())
                .createdAt(ap.getCreatedAt())
                .updatedAt(ap.getUpdatedAt())
                .build();
    }

    private HabitoResponseDTO mapHabitoToDTO(Habito h) {
        return HabitoResponseDTO.builder()
                .medicalRecordId(h.getId().getMedicalRecordId())
                .tipo(h.getId().getTipo())
                .observaciones(h.getObservaciones())
                .createdAt(h.getCreatedAt())
                .updatedAt(h.getUpdatedAt())
                .build();
    }
}
