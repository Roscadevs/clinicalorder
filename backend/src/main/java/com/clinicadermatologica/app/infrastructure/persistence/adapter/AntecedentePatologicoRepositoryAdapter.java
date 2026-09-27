package com.clinicadermatologica.app.infrastructure.persistence.adapter;

import com.clinicadermatologica.app.domain.model.AntecedentePatologico;
import com.clinicadermatologica.app.domain.model.AntecedentePatologicoId;
import com.clinicadermatologica.app.domain.repository.AntecedentePatologicoRepository;
import com.clinicadermatologica.app.infrastructure.persistence.jpa.JpaAntecedentePatologicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * PATRÓN DAO — Implementación concreta del contrato AntecedentePatologicoRepository.
 *
 * Este adaptador actúa como la capa DAO entre el dominio y la infraestructura de persistencia.
 * Traduce el contrato definido en AntecedentePatologicoRepository hacia operaciones Spring Data JPA,
 * manteniendo al dominio desacoplado de la tecnología de persistencia subyacente.
 */
@Component
@RequiredArgsConstructor
public class AntecedentePatologicoRepositoryAdapter implements AntecedentePatologicoRepository {

    private final JpaAntecedentePatologicoRepository jpaRepository;

    @Override
    public List<AntecedentePatologico> findByMedicalRecordId(Long medicalRecordId) {
        return jpaRepository.findByIdMedicalRecordId(medicalRecordId);
    }

    @Override
    public Optional<AntecedentePatologico> findById(AntecedentePatologicoId id) {
        return jpaRepository.findById(id);
    }

    @Override
    public AntecedentePatologico save(AntecedentePatologico antecedente) {
        return jpaRepository.save(antecedente);
    }

    @Override
    public void delete(AntecedentePatologicoId id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public boolean existsById(AntecedentePatologicoId id) {
        return jpaRepository.existsById(id);
    }
}
