package com.clinicadermatologica.app.infrastructure.persistence.adapter;

import com.clinicadermatologica.app.domain.model.ClinicalImage;
import com.clinicadermatologica.app.domain.repository.ClinicalImageRepository;
import com.clinicadermatologica.app.infrastructure.persistence.jpa.JpaClinicalImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * PATRÓN DAO — Implementación concreta del contrato ClinicalImageRepository.
 *
 * Este adaptador actúa como la capa DAO entre el dominio y la infraestructura de persistencia.
 * Traduce el contrato definido en ClinicalImageRepository hacia las operaciones de Spring Data JPA,
 * manteniendo al dominio completamente desacoplado de la tecnología de persistencia subyacente.
 */
@Component
@RequiredArgsConstructor
public class ClinicalImageRepositoryAdapter implements ClinicalImageRepository {

    private final JpaClinicalImageRepository jpaRepository;

    @Override
    public Optional<ClinicalImage> findById(Long id) {
        return jpaRepository.findById(id);
    }

    @Override
    public List<ClinicalImage> findByClinicalEntryId(Long clinicalEntryId) {
        return jpaRepository.findByClinicalEntryIdOrderByUploadedAtDesc(clinicalEntryId);
    }

    @Override
    public ClinicalImage save(ClinicalImage image) {
        return jpaRepository.save(image);
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }
}
