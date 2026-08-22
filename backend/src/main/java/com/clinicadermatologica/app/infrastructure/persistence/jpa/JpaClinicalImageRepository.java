package com.clinicadermatologica.app.infrastructure.persistence.jpa;

import com.clinicadermatologica.app.domain.model.ClinicalImage; // Entidad ClinicalImage
import org.springframework.data.jpa.repository.JpaRepository; // Spring Data JPA
import org.springframework.stereotype.Repository; // Componente de repositorio

import java.util.List; // Colección de lista

/**
 * Repositorio Spring Data JPA para la entidad ClinicalImage.
 */
@Repository // Componente Spring Data
public interface JpaClinicalImageRepository extends JpaRepository<ClinicalImage, Long> {
    List<ClinicalImage> findByMedicalRecordIdOrderByUploadedAtDesc(Long medicalRecordId); // Fotos ordenadas por fecha
}
