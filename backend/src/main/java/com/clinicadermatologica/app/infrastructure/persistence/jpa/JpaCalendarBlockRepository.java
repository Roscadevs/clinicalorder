package com.clinicadermatologica.app.infrastructure.persistence.jpa;

import com.clinicadermatologica.app.domain.model.CalendarBlock; // Entidad CalendarBlock
import org.springframework.data.jpa.repository.JpaRepository; // Spring Data JPA
import org.springframework.data.jpa.repository.Query; // Consulta JPQL
import org.springframework.data.repository.query.Param; // Parámetros JPQL
import org.springframework.stereotype.Repository; // Componente de repositorio

import java.time.Instant; // Tipos de tiempo UTC
import java.util.List; // Colección de lista

/**
 * Repositorio Spring Data JPA para bloqueos de calendario.
 */
@Repository // Componente Spring Data
public interface JpaCalendarBlockRepository extends JpaRepository<CalendarBlock, Long> {

    @Query("SELECT b FROM CalendarBlock b WHERE b.startTime < :end AND b.endTime > :start")
    List<CalendarBlock> findOverlappingBlocks(@Param("start") Instant start, @Param("end") Instant end); // Solapamientos

    @Query("SELECT b FROM CalendarBlock b WHERE b.startTime >= :start AND b.endTime <= :end ORDER BY b.startTime ASC")
    List<CalendarBlock> findByDateRange(@Param("start") Instant start, @Param("end") Instant end); // Rango de agenda
}
