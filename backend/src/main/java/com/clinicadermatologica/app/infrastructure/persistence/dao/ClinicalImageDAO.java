package com.clinicadermatologica.app.infrastructure.persistence.dao;

import com.clinicadermatologica.app.domain.model.ClinicalImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * PATRÓN DAO (Data Access Object) para la entidad ClinicalImage (fotos clínicas).
 *
 * Encapsula el acceso a datos de las fotografías clínicas mediante Spring Data JPA.
 * Spring genera la implementación en tiempo de ejecución; los servicios dependen
 * directamente de este DAO.
 */
@Repository
public interface ClinicalImageDAO extends JpaRepository<ClinicalImage, Long> {

    /** Fotografías asociadas a una entrada clínica concreta, ordenadas por fecha de carga descendente. */
    List<ClinicalImage> findByClinicalEntryIdOrderByUploadedAtDesc(Long clinicalEntryId);
}
