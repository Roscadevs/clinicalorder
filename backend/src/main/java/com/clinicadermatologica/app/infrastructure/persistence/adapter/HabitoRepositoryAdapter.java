package com.clinicadermatologica.app.infrastructure.persistence.adapter;

import com.clinicadermatologica.app.domain.model.Habito;
import com.clinicadermatologica.app.domain.model.HabitoId;
import com.clinicadermatologica.app.domain.repository.HabitoRepository;
import com.clinicadermatologica.app.infrastructure.persistence.jpa.JpaHabitoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * PATRÓN DAO — Implementación concreta del contrato HabitoRepository.
 *
 * Este adaptador actúa como la capa DAO entre el dominio y la infraestructura de persistencia.
 * Traduce el contrato definido en HabitoRepository hacia operaciones Spring Data JPA,
 * manteniendo al dominio desacoplado de la tecnología de persistencia subyacente.
 */
@Component
@RequiredArgsConstructor
public class HabitoRepositoryAdapter implements HabitoRepository {

    private final JpaHabitoRepository jpaRepository;

    @Override
    public List<Habito> findByMedicalRecordId(Long medicalRecordId) {
        return jpaRepository.findByIdMedicalRecordId(medicalRecordId);
    }

    @Override
    public Optional<Habito> findById(HabitoId id) {
        return jpaRepository.findById(id);
    }

    @Override
    public Habito save(Habito habito) {
        return jpaRepository.save(habito);
    }

    @Override
    public void delete(HabitoId id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public boolean existsById(HabitoId id) {
        return jpaRepository.existsById(id);
    }
}
