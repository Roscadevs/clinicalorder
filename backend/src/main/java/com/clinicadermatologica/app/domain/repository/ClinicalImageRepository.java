package com.clinicadermatologica.app.domain.repository;

import com.clinicadermatologica.app.domain.model.ClinicalImage;

import java.util.List;
import java.util.Optional;

/**
 * PATRÓN DAO — Contrato de acceso a datos para metadatos de fotografías médicas y estéticas.
 *
 * Esta interfaz define el contrato de acceso a datos para ClinicalImage.
 * Los servicios dependen únicamente de esta interfaz; nunca del adaptador ni del JPA directo.
 * La implementación concreta reside en ClinicalImageRepositoryAdapter.
 */
public interface ClinicalImageRepository {
    Optional<ClinicalImage> findById(Long id);
    List<ClinicalImage> findByClinicalEntryId(Long clinicalEntryId); // Imágenes de una entrada clínica
    ClinicalImage save(ClinicalImage image);
    void deleteById(Long id);
}
