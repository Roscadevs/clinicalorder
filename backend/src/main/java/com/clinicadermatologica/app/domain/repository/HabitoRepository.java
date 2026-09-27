package com.clinicadermatologica.app.domain.repository;

import com.clinicadermatologica.app.domain.model.Habito;
import com.clinicadermatologica.app.domain.model.HabitoId;

import java.util.List;
import java.util.Optional;

/**
 * PATRÓN DAO — Contrato de acceso a datos para la entidad débil Habito.
 *
 * Esta interfaz define el contrato de acceso a datos para Habito.
 * Los servicios dependen únicamente de esta interfaz; nunca del adaptador ni del repositorio JPA.
 * La implementación concreta reside en HabitoRepositoryAdapter.
 */
public interface HabitoRepository {

    List<Habito> findByMedicalRecordId(Long medicalRecordId);

    Optional<Habito> findById(HabitoId id);

    Habito save(Habito habito);

    void delete(HabitoId id);

    boolean existsById(HabitoId id);
}
