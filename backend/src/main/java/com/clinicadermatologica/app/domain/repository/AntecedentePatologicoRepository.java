package com.clinicadermatologica.app.domain.repository;

import com.clinicadermatologica.app.domain.model.AntecedentePatologico;
import com.clinicadermatologica.app.domain.model.AntecedentePatologicoId;

import java.util.List;
import java.util.Optional;

/**
 * PATRÓN DAO — Contrato de acceso a datos para la entidad débil AntecedentePatologico.
 *
 * Esta interfaz define el contrato de acceso a datos para AntecedentePatologico.
 * Los servicios dependen únicamente de esta interfaz; nunca del adaptador ni del repositorio JPA.
 * La implementación concreta reside en AntecedentePatologicoRepositoryAdapter.
 */
public interface AntecedentePatologicoRepository {

    List<AntecedentePatologico> findByMedicalRecordId(Long medicalRecordId);

    Optional<AntecedentePatologico> findById(AntecedentePatologicoId id);

    AntecedentePatologico save(AntecedentePatologico antecedente);

    void delete(AntecedentePatologicoId id);

    boolean existsById(AntecedentePatologicoId id);
}
