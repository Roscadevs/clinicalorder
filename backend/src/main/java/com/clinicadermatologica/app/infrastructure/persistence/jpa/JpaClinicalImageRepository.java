package com.clinicadermatologica.app.infrastructure.persistence.jpa;

import com.clinicadermatologica.app.domain.model.ClinicalImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio Spring Data JPA para la entidad ClinicalImage.
 * Delegado por ClinicalImageRepositoryAdapter (DAO Implementation).
 */
@Repository
public interface JpaClinicalImageRepository extends JpaRepository<ClinicalImage, Long> {

    /** Fotografías asociadas a una entrada clínica concreta, ordenadas por fecha de carga descendente. */
    List<ClinicalImage> findByClinicalEntryIdOrderByUploadedAtDesc(Long clinicalEntryId);
}
