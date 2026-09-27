package com.clinicadermatologica.app.infrastructure.persistence.adapter;

import com.clinicadermatologica.app.domain.model.Alergia;
import com.clinicadermatologica.app.domain.model.AlergiaId;
import com.clinicadermatologica.app.domain.repository.AlergiaRepository;
import com.clinicadermatologica.app.infrastructure.persistence.jpa.JpaAlergiaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * PATRÓN DAO — Implementación concreta del contrato AlergiaRepository.
 *
 * Este adaptador actúa como la capa DAO entre el dominio y la infraestructura de persistencia.
 * Traduce el contrato definido en AlergiaRepository hacia las operaciones de Spring Data JPA,
 * manteniendo al dominio completamente desacoplado de la tecnología de persistencia subyacente.
 * MedicalRecordService solo conoce AlergiaRepository (interfaz); nunca este adaptador ni JpaAlergiaRepository.
 */
@Component
@RequiredArgsConstructor
public class AlergiaRepositoryAdapter implements AlergiaRepository {

    private final JpaAlergiaRepository jpaRepository;

    @Override
    public List<Alergia> findByMedicalRecordId(Long medicalRecordId) {
        return jpaRepository.findByIdMedicalRecordId(medicalRecordId);
    }

    @Override
    public Optional<Alergia> findById(AlergiaId id) {
        return jpaRepository.findById(id);
    }

    @Override
    public Alergia save(Alergia alergia) {
        return jpaRepository.save(alergia);
    }

    @Override
    public void delete(AlergiaId id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public boolean existsById(AlergiaId id) {
        return jpaRepository.existsById(id);
    }
}
