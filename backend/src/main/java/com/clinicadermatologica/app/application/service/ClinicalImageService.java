package com.clinicadermatologica.app.application.service;

import com.clinicadermatologica.app.domain.exception.BusinessRuleException;
import com.clinicadermatologica.app.domain.exception.ResourceNotFoundException;
import com.clinicadermatologica.app.domain.model.ClinicalEntry;
import com.clinicadermatologica.app.domain.model.ClinicalImage;
import com.clinicadermatologica.app.domain.repository.ClinicalEntryRepository;
import com.clinicadermatologica.app.domain.repository.ClinicalImageRepository;
import com.clinicadermatologica.app.infrastructure.storage.SupabaseStorageAdapter;
import com.clinicadermatologica.app.presentation.dto.ClinicalImageResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio de Aplicacion para la gestion de fotografias medicas y esteticas del paciente.
 *
 * Las imagenes ahora se asocian a una entrada clinica especifica (ClinicalEntry),
 * no a la historia clinica general. La ruta de almacenamiento en Supabase Storage se
 * deriva de clinicalEntry → appointment → patient.
 *
 * Restricciones validadas aqui:
 * - Tipos MIME permitidos: image/jpeg, image/png unicamente (no WEBP).
 * - Tamano maximo: 10 MB.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ClinicalImageService {

    private static final long MAX_FILE_SIZE_BYTES = 10L * 1024 * 1024; // 10 MB

    private final ClinicalImageRepository imageRepository;
    private final ClinicalEntryRepository clinicalEntryRepository;
    private final SupabaseStorageAdapter storageAdapter;

    /**
     * Sube una fotografia medica a Supabase Storage y persiste sus metadatos,
     * asociandola a la entrada clinica indicada.
     */
    @Transactional
    public ClinicalImageResponseDTO uploadClinicalImage(Long clinicalEntryId,
                                                        MultipartFile file,
                                                        String description) {
        ClinicalEntry entry = clinicalEntryRepository.findById(clinicalEntryId)
                .orElseThrow(() -> new ResourceNotFoundException("Entrada clinica no encontrada"));

        if (file.isEmpty()) {
            throw new BusinessRuleException("El archivo de imagen no puede estar vacio");
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new BusinessRuleException("El archivo excede el tamano maximo permitido de 10 MB");
        }

        String contentType = file.getContentType();
        if (contentType == null ||
                (!contentType.equals("image/jpeg") && !contentType.equals("image/png"))) {
            throw new BusinessRuleException(
                    "Formato de imagen no admitido. Solo se aceptan archivos JPEG o PNG.");
        }

        // Ruta de almacenamiento derivada via entry → appointment → patient
        Long patientId = entry.getAppointment().getPatient().getId();
        String objectPath = storageAdapter.uploadFile(patientId, file);

        ClinicalImage image = ClinicalImage.builder()
                .clinicalEntry(entry)
                .filePath(objectPath)
                .originalFilename(file.getOriginalFilename() != null ? file.getOriginalFilename() : "foto.jpg")
                .contentType(contentType)
                .fileSize(file.getSize())
                .description(description)
                .build();

        image = imageRepository.save(image);
        log.info("Imagen #{} subida para entrada clinica #{}", image.getId(), clinicalEntryId);
        return mapToDTO(image);
    }

    /**
     * Obtiene todas las fotografias medicas asociadas a una entrada clinica.
     */
    @Transactional(readOnly = true)
    public List<ClinicalImageResponseDTO> getImagesByClinicalEntry(Long clinicalEntryId) {
        return imageRepository.findByClinicalEntryId(clinicalEntryId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private ClinicalImageResponseDTO mapToDTO(ClinicalImage img) {
        return ClinicalImageResponseDTO.builder()
                .id(img.getId())
                .clinicalEntryId(img.getClinicalEntry().getId())
                .filePath(img.getFilePath())
                .originalFilename(img.getOriginalFilename())
                .contentType(img.getContentType())
                .fileSize(img.getFileSize())
                .description(img.getDescription())
                .accessUrl(storageAdapter.getPublicUrl(img.getFilePath()))
                .uploadedAt(img.getUploadedAt())
                .build();
    }
}
