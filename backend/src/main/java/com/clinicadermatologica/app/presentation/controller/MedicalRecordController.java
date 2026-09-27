package com.clinicadermatologica.app.presentation.controller;

import com.clinicadermatologica.app.application.service.ClinicalImageService;
import com.clinicadermatologica.app.application.service.MedicalRecordService;
import com.clinicadermatologica.app.domain.model.MedicalRecordAudit;
import com.clinicadermatologica.app.domain.repository.MedicalRecordRepository;
import com.clinicadermatologica.app.presentation.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Controlador REST para Historias Clinicas, Evoluciones, Fotografias, Auditoria
 * y sub-recursos de entidades debiles (Alergias, Antecedentes Patologicos, Habitos).
 *
 * SEGURIDAD (RBAC):
 * - Lectura de historia clinica: DOCTORA
 * - Escritura de historia clinica y entradas clinicas: DOCTORA
 * - Escritura de sub-recursos (alergias, antecedentes, habitos): DOCTORA
 * - Carga y lectura de fotografias: DOCTORA
 * - Auditoria: DOCTORA
 */
@RestController
@RequestMapping("/historias-clinicas")
@RequiredArgsConstructor
@PreAuthorize("hasRole('DOCTORA')")  // Rol actualizado: PHYSICIAN -> DOCTORA
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;
    private final ClinicalImageService imageService;
    private final MedicalRecordRepository medicalRecordRepository;

    // ─── HISTORIA CLINICA ───────────────────────────────────────────────────────

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<MedicalRecordDTO> getMedicalRecordByPatient(@PathVariable Long pacienteId) {
        MedicalRecordDTO record = medicalRecordService.getMedicalRecordByPatientId(pacienteId);
        return record == null ? ResponseEntity.noContent().build() : ResponseEntity.ok(record);
    }

    @PostMapping("/paciente/{pacienteId}")
    public ResponseEntity<MedicalRecordDTO> saveMedicalRecord(
            @PathVariable Long pacienteId,
            @Valid @RequestBody MedicalRecordDTO dto,
            @RequestParam Long physicianUserId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(medicalRecordService.saveOrUpdateMedicalRecord(pacienteId, dto, physicianUserId));
    }

    // ─── ENTRADAS CLINICAS ──────────────────────────────────────────────────────

    /** Redacta una nueva nota de evolucion clinica para una sesion. */
    @PostMapping("/entradas")
    public ResponseEntity<ClinicalEntryResponseDTO> addClinicalEntry(
            @Valid @RequestBody ClinicalEntryRequestDTO request,
            @RequestParam Long physicianUserId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(medicalRecordService.addClinicalEntry(request, physicianUserId));
    }

    /** Edita una nota de evolucion previa con registro automatico de auditoria. */
    @PutMapping("/entradas/{entryId}")
    public ResponseEntity<ClinicalEntryResponseDTO> updateClinicalEntry(
            @PathVariable Long entryId,
            @RequestBody String newContent,
            @RequestParam Long physicianUserId) {
        return ResponseEntity.ok(
                medicalRecordService.updateClinicalEntry(entryId, newContent, physicianUserId));
    }

    /** Lista todas las entradas clinicas de un paciente. */
    @GetMapping("/paciente/{pacienteId}/entradas")
    public ResponseEntity<List<ClinicalEntryResponseDTO>> getClinicalEntriesByPatient(
            @PathVariable Long pacienteId) {
        return ResponseEntity.ok(medicalRecordService.getClinicalEntriesByPatient(pacienteId));
    }

    // ─── FOTOGRAFIAS (ahora asociadas a la entrada clinica) ─────────────────────

    /** Sube una fotografia medica asociada a una entrada clinica especifica. */
    @PostMapping(value = "/entradas/{clinicalEntryId}/fotos",
                 consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ClinicalImageResponseDTO> uploadClinicalPhoto(
            @PathVariable Long clinicalEntryId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "description", required = false) String description) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(imageService.uploadClinicalImage(clinicalEntryId, file, description));
    }

    /** Lista todas las fotografias de una entrada clinica. */
    @GetMapping("/entradas/{clinicalEntryId}/fotos")
    public ResponseEntity<List<ClinicalImageResponseDTO>> getClinicalPhotos(
            @PathVariable Long clinicalEntryId) {
        return ResponseEntity.ok(imageService.getImagesByClinicalEntry(clinicalEntryId));
    }

    // ─── AUDITORIA ───────────────────────────────────────────────────────────────

    @GetMapping("/{medicalRecordId}/auditoria")
    public ResponseEntity<List<MedicalRecordAudit>> getAuditHistory(
            @PathVariable Long medicalRecordId) {
        return ResponseEntity.ok(medicalRecordRepository.findAuditHistory(medicalRecordId));
    }

    // ─── SUB-RECURSOS: ALERGIAS ──────────────────────────────────────────────────

    /** Registra una alergia en la historia clinica. Devuelve 409 si el tipo ya existe. */
    @PostMapping("/{medicalRecordId}/alergias")
    public ResponseEntity<AlergiaResponseDTO> addAlergia(
            @PathVariable Long medicalRecordId,
            @Valid @RequestBody AlergiaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(medicalRecordService.addAlergia(medicalRecordId, dto));
    }

    /** Elimina una alergia de la historia clinica por su tipo. */
    @DeleteMapping("/{medicalRecordId}/alergias/{tipo}")
    public ResponseEntity<Void> removeAlergia(
            @PathVariable Long medicalRecordId,
            @PathVariable String tipo) {
        medicalRecordService.removeAlergia(medicalRecordId, tipo);
        return ResponseEntity.noContent().build();
    }

    // ─── SUB-RECURSOS: ANTECEDENTES PATOLOGICOS ──────────────────────────────────

    /** Registra un antecedente patologico. Devuelve 409 si el tipo ya existe. */
    @PostMapping("/{medicalRecordId}/antecedentes")
    public ResponseEntity<AntecedentePatologicoResponseDTO> addAntecedentePatologico(
            @PathVariable Long medicalRecordId,
            @Valid @RequestBody AntecedentePatologicoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(medicalRecordService.addAntecedentePatologico(medicalRecordId, dto));
    }

    /** Elimina un antecedente patologico por su tipo. */
    @DeleteMapping("/{medicalRecordId}/antecedentes/{tipo}")
    public ResponseEntity<Void> removeAntecedentePatologico(
            @PathVariable Long medicalRecordId,
            @PathVariable String tipo) {
        medicalRecordService.removeAntecedentePatologico(medicalRecordId, tipo);
        return ResponseEntity.noContent().build();
    }

    // ─── SUB-RECURSOS: HABITOS ────────────────────────────────────────────────────

    /** Registra un habito en la historia clinica. Devuelve 409 si el tipo ya existe. */
    @PostMapping("/{medicalRecordId}/habitos")
    public ResponseEntity<HabitoResponseDTO> addHabito(
            @PathVariable Long medicalRecordId,
            @Valid @RequestBody HabitoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(medicalRecordService.addHabito(medicalRecordId, dto));
    }

    /** Elimina un habito por su tipo. */
    @DeleteMapping("/{medicalRecordId}/habitos/{tipo}")
    public ResponseEntity<Void> removeHabito(
            @PathVariable Long medicalRecordId,
            @PathVariable String tipo) {
        medicalRecordService.removeHabito(medicalRecordId, tipo);
        return ResponseEntity.noContent().build();
    }
}
