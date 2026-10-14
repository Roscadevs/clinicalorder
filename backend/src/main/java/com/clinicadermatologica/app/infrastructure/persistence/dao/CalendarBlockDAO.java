package com.clinicadermatologica.app.infrastructure.persistence.dao;

import com.clinicadermatologica.app.domain.model.CalendarBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

/**
 * PATRÓN DAO (Data Access Object) para los bloqueos de agenda.
 *
 * Encapsula el acceso a datos de la entidad CalendarBlock mediante Spring Data JPA.
 */
@Repository
public interface CalendarBlockDAO extends JpaRepository<CalendarBlock, Long> {

    @Query("SELECT b FROM CalendarBlock b WHERE b.startTime < :end AND b.endTime > :start")
    List<CalendarBlock> findOverlappingBlocks(@Param("start") Instant start, @Param("end") Instant end);

    @Query("SELECT b FROM CalendarBlock b WHERE b.startTime >= :start AND b.endTime <= :end ORDER BY b.startTime ASC")
    List<CalendarBlock> findByDateRange(@Param("start") Instant start, @Param("end") Instant end);
}
