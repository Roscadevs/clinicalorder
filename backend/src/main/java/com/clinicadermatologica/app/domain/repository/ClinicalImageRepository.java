package com.clinicadermatologica.app.domain.repository;

import com.clinicadermatologica.app.domain.model.ClinicalImage; // Entidad ClinicalImage

import java.util.List; // Colección de lista
import java.util.Optional; // Contenedor opcional

/**
 * Contrato de repositorio para metadatos de fotografías médicas y estéticas.
 */
public interface ClinicalImageRepository {
    Optional<ClinicalImage> findById(Long id); // Búsqueda de foto por ID
    List<ClinicalImage> findByMedicalRecordId(Long medicalRecordId); // Fotos asociadas a una historia clínica
    ClinicalImage save(ClinicalImage image); // Guarda los metadatos de la fotografía
    void deleteById(Long id); // Elimina los metadatos de una foto
}
