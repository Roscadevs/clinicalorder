package com.clinicadermatologica.app.domain.repository;

import com.clinicadermatologica.app.domain.model.Alergia;
import com.clinicadermatologica.app.domain.model.AlergiaId;

import java.util.List;
import java.util.Optional;

/**
 * PATRÓN DAO — Contrato de acceso a datos para la entidad débil Alergia.
 *
 * Esta interfaz define el contrato de acceso a datos para Alergia.
 * Los servicios dependen únicamente de esta interfaz; nunca del adaptador ni del repositorio JPA.
 * La implementación concreta reside en AlergiaRepositoryAdapter.
 */
public interface AlergiaRepository {

    /** Retorna todas las alergias de una historia clínica. */
    List<Alergia> findByMedicalRecordId(Long medicalRecordId);

    /** Busca una alergia por su clave compuesta (historia_clinica_id, tipo). */
    Optional<Alergia> findById(AlergiaId id);

    /** Persiste o actualiza una alergia. */
    Alergia save(Alergia alergia);

    /** Elimina una alergia por su clave compuesta. */
    void delete(AlergiaId id);

    /** Verifica si existe una alergia con la clave compuesta dada. */
    boolean existsById(AlergiaId id);
}
