package com.clinicadermatologica.app.infrastructure.persistence.jpa;

import com.clinicadermatologica.app.domain.model.DermatologicService; // Entidad DermatologicService
import org.springframework.data.jpa.repository.JpaRepository; // Spring Data JPA
import org.springframework.stereotype.Repository; // Anotación de repositorio

import java.util.List; // Colección de lista
import java.util.Optional; // Contenedor opcional

/**
 * Repositorio Spring Data JPA para los servicios del catálogo.
 */
@Repository // Componente Spring Data
public interface JpaDermatologicServiceRepository extends JpaRepository<DermatologicService, Long> {
    Optional<DermatologicService> findByName(String name); // Búsqueda por nombre único
    List<DermatologicService> findByActiveTrue(); // Listado de servicios activos disponibles
    boolean existsByName(String name); // Verificación de nombre único
}
