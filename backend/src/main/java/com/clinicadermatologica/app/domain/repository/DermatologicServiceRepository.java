package com.clinicadermatologica.app.domain.repository;

import com.clinicadermatologica.app.domain.model.DermatologicService; // Entidad del dominio

import java.util.List; // Colección de lista
import java.util.Optional; // Contenedor opcional

/**
 * Contrato de repositorio del dominio para el catálogo de servicios dermatológicos y estéticos.
 */
public interface DermatologicServiceRepository {
    Optional<DermatologicService> findById(Long id); // Búsqueda de servicio por clave primaria
    Optional<DermatologicService> findByName(String name); // Búsqueda por nombre único del servicio
    List<DermatologicService> findAllActive(); // Listado de servicios activos visibles al público
    List<DermatologicService> findAll(); // Listado completo para el panel de administración
    DermatologicService save(DermatologicService service); // Guarda o actualiza un servicio
    boolean existsByName(String name); // Valida unicidad de nombre de servicio
}
