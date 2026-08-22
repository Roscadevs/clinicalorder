package com.clinicadermatologica.app.domain.repository;

import com.clinicadermatologica.app.domain.model.CalendarBlock; // Entidad CalendarBlock

import java.time.Instant; // Tipos de tiempo UTC
import java.util.List; // Colección de lista
import java.util.Optional; // Contenedor opcional

/**
 * Contrato de repositorio del dominio para bloqueos de indisponibilidad de agenda.
 */
public interface CalendarBlockRepository {
    Optional<CalendarBlock> findById(Long id); // Búsqueda de bloqueo por ID
    List<CalendarBlock> findOverlappingBlocks(Instant start, Instant end); // Bloqueos que colisionan con el rango
    List<CalendarBlock> findByDateRange(Instant start, Instant end); // Bloqueos en un rango de fechas
    CalendarBlock save(CalendarBlock block); // Registra un nuevo bloqueo
    void deleteById(Long id); // Elimina un bloqueo
}
