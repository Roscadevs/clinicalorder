package com.clinicadermatologica.app.infrastructure.persistence.dao;

import com.clinicadermatologica.app.domain.model.DermatologicService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * PATRÓN DAO (Data Access Object) para los servicios del catálogo dermatológico.
 *
 * Encapsula el acceso a datos de la entidad DermatologicService mediante Spring Data JPA.
 */
@Repository
public interface DermatologicServiceDAO extends JpaRepository<DermatologicService, Long> {

    Optional<DermatologicService> findByName(String name);

    /** Listado de servicios activos del catálogo. */
    @Query("SELECT s FROM DermatologicService s WHERE s.active = true")
    List<DermatologicService> findAllActive();

    boolean existsByName(String name);
    boolean existsByNameAndIdNot(String name, Long id);
}
