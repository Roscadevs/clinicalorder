package com.clinicadermatologica.app.infrastructure.persistence.adapter;

import com.clinicadermatologica.app.domain.model.CalendarBlock; // Entidad CalendarBlock
import com.clinicadermatologica.app.domain.repository.CalendarBlockRepository; // Interfaz CalendarBlockRepository
import com.clinicadermatologica.app.infrastructure.persistence.jpa.JpaCalendarBlockRepository; // Repositorio JPA
import lombok.RequiredArgsConstructor; // Inyección por constructor
import org.springframework.stereotype.Component; // Componente Spring

import java.time.Instant; // Tipos de tiempo UTC
import java.util.List; // Colección de lista
import java.util.Optional; // Contenedor opcional

/**
 * Adaptador de infraestructura para bloqueos de calendario.
 */
@Component // Componente Spring
@RequiredArgsConstructor // Inyección por constructor
public class CalendarBlockRepositoryAdapter implements CalendarBlockRepository {

    private final JpaCalendarBlockRepository jpaRepository; // Inyección del repositorio JPA

    @Override
    public Optional<CalendarBlock> findById(Long id) {
        return jpaRepository.findById(id); // Delega la búsqueda
    }

    @Override
    public List<CalendarBlock> findOverlappingBlocks(Instant start, Instant end) {
        return jpaRepository.findOverlappingBlocks(start, end); // Detecta solapamiento
    }

    @Override
    public List<CalendarBlock> findByDateRange(Instant start, Instant end) {
        return jpaRepository.findByDateRange(start, end); // Rango de agenda
    }

    @Override
    public CalendarBlock save(CalendarBlock block) {
        return jpaRepository.save(block); // Persiste el bloqueo
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id); // Elimina el bloqueo por ID
    }
}
