package com.clinicadermatologica.app.application.service;

import com.clinicadermatologica.app.domain.exception.BusinessRuleException; // Excepción de negocio
import com.clinicadermatologica.app.domain.exception.ResourceNotFoundException; // Excepción de no encontrado
import com.clinicadermatologica.app.domain.model.ClinicalImage; // Entidad del dominio
import com.clinicadermatologica.app.domain.model.MedicalRecord; // Entidad de historia clínica
import com.clinicadermatologica.app.domain.repository.ClinicalImageRepository; // Repositorio de imágenes
import com.clinicadermatologica.app.domain.repository.MedicalRecordRepository; // Repositorio de historias
import com.clinicadermatologica.app.infrastructure.storage.SupabaseStorageAdapter; // Adaptador Supabase Storage
import com.clinicadermatologica.app.presentation.dto.ClinicalImageResponseDTO; // DTO de respuesta
import lombok.RequiredArgsConstructor; // Inyección por constructor
import lombok.extern.slf4j.Slf4j; // Logger
import org.springframework.stereotype.Service; // Servicio Spring
import org.springframework.transaction.annotation.Transactional; // Transacciones ACID
import org.springframework.web.multipart.MultipartFile; // Archivo multipart

import java.util.List; // Colección de lista
import java.util.stream.Collectors; // Streams

/**
 * Servicio de Aplicación para la gestión de fotografías médicas y estéticas del paciente.
 */
@Service // Componente de servicio Spring
@RequiredArgsConstructor // Inyección por constructor
@Slf4j // Logger
public class ClinicalImageService {

    private final ClinicalImageRepository imageRepository; // Repositorio de metadatos de imágenes
    private final MedicalRecordRepository medicalRecordRepository; // Repositorio de historias clínicas
    private final SupabaseStorageAdapter storageAdapter; // Adaptador de Supabase Storage

    /**
     * Sube una fotografía médica a Supabase Storage y persiste sus metadatos.
     */
    @Transactional // Transacción ACID
    public ClinicalImageResponseDTO uploadClinicalImage(Long medicalRecordId, MultipartFile file, String description) {
        MedicalRecord record = medicalRecordRepository.findById(medicalRecordId)
                .orElseThrow(() -> new ResourceNotFoundException("Historia clínica no encontrada"));

        // Valida que el archivo no esté vacío
        if (file.isEmpty()) {
            throw new BusinessRuleException("El archivo de imagen no puede estar vacío");
        }

        // Valida tamaño máximo permitido: 5 MB (5 * 1024 * 1024 bytes)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BusinessRuleException("El archivo excede el tamaño máximo permitido de 5 MB");
        }

        // Valida tipo MIME permitido
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png") && !contentType.equals("image/webp"))) {
            throw new BusinessRuleException("Formato de imagen no admitido. Solo se admiten archivos JPEG, PNG y WEBP.");
        }

        // Sube a Supabase Storage
        String objectPath = storageAdapter.uploadFile(record.getPatient().getId(), file);

        // Persiste metadatos en la tabla imagen_hc
        ClinicalImage image = ClinicalImage.builder()
                .medicalRecord(record)
                .filePath(objectPath)
                .originalFilename(file.getOriginalFilename() != null ? file.getOriginalFilename() : "foto.jpg")
                .contentType(contentType)
                .fileSize(file.getSize())
                .description(description)
                .build();

        image = imageRepository.save(image);

        return mapToDTO(image);
    }

    /**
     * Obtiene todas las fotografías médicas asociadas a una historia clínica.
     */
    @Transactional(readOnly = true) // Solo lectura
    public List<ClinicalImageResponseDTO> getImagesByMedicalRecord(Long medicalRecordId) {
        return imageRepository.findByMedicalRecordId(medicalRecordId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private ClinicalImageResponseDTO mapToDTO(ClinicalImage img) {
        return ClinicalImageResponseDTO.builder()
                .id(img.getId())
                .medicalRecordId(img.getMedicalRecord().getId())
                .filePath(img.getFilePath())
                .originalFilename(img.getOriginalFilename())
                .contentType(img.getContentType())
                .fileSize(img.getFileSize())
                .description(img.getDescription())
                .accessUrl(storageAdapter.getPublicUrl(img.getFilePath())) // Genera URL segura
                .uploadedAt(img.getUploadedAt())
                .build();
    }
}
