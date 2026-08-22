package com.clinicadermatologica.app.infrastructure.persistence.adapter;

import com.clinicadermatologica.app.domain.model.DermatologicService; // Entidad DermatologicService
import com.clinicadermatologica.app.domain.repository.DermatologicServiceRepository; // Interfaz del dominio
import com.clinicadermatologica.app.infrastructure.persistence.jpa.JpaDermatologicServiceRepository; // JPA Repository
import lombok.RequiredArgsConstructor; // Inyección por constructor
import org.springframework.stereotype.Component; // Componente Spring

import java.util.List; // Colección de lista
import java.util.Optional; // Contenedor opcional

/**
 * Adaptador de infraestructura para los servicios del catálogo.
 */
@Component // Componente Spring
@RequiredArgsConstructor // Inyección por constructor
public class DermatologicServiceRepositoryAdapter implements DermatologicServiceRepository {

    private final JpaDermatologicServiceRepository jpaRepository; // Inyección del repositorio JPA

    @Override
    public Optional<DermatologicService> findById(Long id) {
        return jpaRepository.findById(id); // Delega la búsqueda
    }

    @Override
    public Optional<DermatologicService> findByName(String name) {
        return jpaRepository.findByName(name); // Delega búsqueda por nombre
    }

    @Override
    public List<DermatologicService> findAllActive() {
        return jpaRepository.findByActiveTrue(); // Servicios activos
    }

    @Override
    public List<DermatologicService> findAll() {
        return jpaRepository.findAll(); // Todos los servicios
    }

    @Override
    public DermatologicService save(DermatologicService service) {
        return jpaRepository.save(service); // Persiste el servicio
    }

    @Override
    public boolean existsByName(String name) {
        return jpaRepository.existsByName(name); // Verifica existencia
    }
}
