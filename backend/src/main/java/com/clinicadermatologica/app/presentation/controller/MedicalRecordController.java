package com.clinicadermatologica.app.presentation.controller;

import com.clinicadermatologica.app.application.service.ClinicalImageService; // Servicio de imágenes
import com.clinicadermatologica.app.application.service.MedicalRecordService; // Servicio de historia clínica
import com.clinicadermatologica.app.domain.model.MedicalRecordAudit; // Entidad de auditoría
import com.clinicadermatologica.app.domain.repository.MedicalRecordRepository; // Repositorio para historial
import com.clinicadermatologica.app.presentation.dto.*; // DTOs
import jakarta.validation.Valid; // Validador
import lombok.RequiredArgsConstructor; // Inyección por constructor
import org.springframework.http.HttpStatus; // Códigos HTTP
import org.springframework.http.MediaType; // Tipos de contenido
import org.springframework.http.ResponseEntity; // Respuesta HTTP
import org.springframework.security.access.prepost.PreAuthorize; // Control estricto de acceso RBAC
import org.springframework.web.bind.annotation.*; // Anotaciones REST
import org.springframework.web.multipart.MultipartFile; // Archivos multipart

import java.util.List; // Listas

/**
 * Controlador REST para Historias Clínicas, Evoluciones, Fotografías y Auditoría Médica.
 * RESTRICCIÓN DE SEGURIDAD: Exclusivo para usuarios con rol 'PHYSICIAN' (Médica).
 */
@RestController // Controlador REST
@RequestMapping("/historias-clinicas") // Ruta /api/v1/historias-clinicas
@RequiredArgsConstructor // Inyección por constructor
@PreAuthorize("hasRole('PHYSICIAN')") // Exige rol PHYSICIAN en todos los endpoints
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService; // Servicio de historias clínicas
    private final ClinicalImageService imageService; // Servicio de fotos médicas
    private final MedicalRecordRepository medicalRecordRepository; // Repositorio para auditoría

    /**
     * Consulta la historia clínica completa de un paciente.
     */
    @GetMapping("/paciente/{pacienteId}") // Mapea HTTP GET /api/v1/historias-clinicas/paciente/{pacienteId}
    public ResponseEntity<MedicalRecordDTO> getMedicalRecordByPatient(@PathVariable Long pacienteId) {
        MedicalRecordDTO record = medicalRecordService.getMedicalRecordByPatientId(pacienteId);
        if (record == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(record);
    }

    /**
     * Crea o actualiza la ficha médica general con auditoría automática.
     */
    @PostMapping("/paciente/{pacienteId}") // Mapea HTTP POST /api/v1/historias-clinicas/paciente/{pacienteId}
    public ResponseEntity<MedicalRecordDTO> saveMedicalRecord(
            @PathVariable Long pacienteId,
            @Valid @RequestBody MedicalRecordDTO dto,
            @RequestParam Long physicianUserId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(medicalRecordService.saveOrUpdateMedicalRecord(pacienteId, dto, physicianUserId));
    }

    /**
     * Agrega una nota de evolución médica para una sesión/turno completado.
     */
    @PostMapping("/entradas") // Mapea HTTP POST /api/v1/historias-clinicas/entradas
    public ResponseEntity<ClinicalEntryResponseDTO> addClinicalEntry(
            @Valid @RequestBody ClinicalEntryRequestDTO request,
            @RequestParam Long physicianUserId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(medicalRecordService.addClinicalEntry(request, physicianUserId));
    }

    /**
     * Edita una nota de evolución médica previa, registrando el cambio en auditoría.
     */
    @PutMapping("/entradas/{entryId}") // Mapea HTTP PUT /api/v1/historias-clinicas/entradas/{entryId}
    public ResponseEntity<ClinicalEntryResponseDTO> updateClinicalEntry(
            @PathVariable Long entryId,
            @RequestBody String newContent,
            @RequestParam Long physicianUserId) {
        return ResponseEntity.ok(medicalRecordService.updateClinicalEntry(entryId, newContent, physicianUserId));
    }

    /**
     * Consulta el listado de evoluciones clínicas de una historia.
     */
    @GetMapping("/{medicalRecordId}/entradas") // Mapea HTTP GET /api/v1/historias-clinicas/{id}/entradas
    public ResponseEntity<List<ClinicalEntryResponseDTO>> getClinicalEntries(@PathVariable Long medicalRecordId) {
        return ResponseEntity.ok(medicalRecordService.getClinicalEntries(medicalRecordId));
    }

    /**
     * Sube una fotografía médica a Supabase Storage asociada a la historia clínica.
     */
    @PostMapping(value = "/{medicalRecordId}/fotos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ClinicalImageResponseDTO> uploadClinicalPhoto(
            @PathVariable Long medicalRecordId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "description", required = false) String description) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(imageService.uploadClinicalImage(medicalRecordId, file, description));
    }

    /**
     * Obtiene el listado de fotos médicas asociadas a la historia clínica.
     */
    @GetMapping("/{medicalRecordId}/fotos")
    public ResponseEntity<List<ClinicalImageResponseDTO>> getClinicalPhotos(@PathVariable Long medicalRecordId) {
        return ResponseEntity.ok(imageService.getImagesByMedicalRecord(medicalRecordId));
    }

    /**
     * Consulta el historial completo de auditoría inmutable de una historia clínica.
     */
    @GetMapping("/{medicalRecordId}/auditoria")
    public ResponseEntity<List<MedicalRecordAudit>> getAuditHistory(@PathVariable Long medicalRecordId) {
        return ResponseEntity.ok(medicalRecordRepository.findAuditHistory(medicalRecordId));
    }
}
