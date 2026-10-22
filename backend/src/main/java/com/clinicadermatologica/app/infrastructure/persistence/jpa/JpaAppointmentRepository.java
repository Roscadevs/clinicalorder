package com.clinicadermatologica.app.infrastructure.persistence.jpa;

import com.clinicadermatologica.app.domain.model.Appointment;
import com.clinicadermatologica.app.domain.model.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

/**
 * Repositorio Spring Data JPA para la entidad Appointment.
 * Delegado por AppointmentRepositoryAdapter (DAO Implementation).
 */
@Repository
public interface JpaAppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientIdOrderByStartTimeDesc(Long patientId);

    // Bloqueos temporales vencidos: turnos en un estado dado creados antes del instante límite
    List<Appointment> findByStatusAndCreatedAtBefore(AppointmentStatus status, Instant createdBefore);

    @Query("SELECT a FROM Appointment a WHERE a.startTime < :end AND a.endTime > :start " +
           "AND a.status IN ('CONFIRMED', 'COMPLETED', 'PENDING_PAYMENT')")
    List<Appointment> findOverlappingActiveAppointments(
            @Param("start") Instant start,
            @Param("end") Instant end);

    @Query("SELECT a FROM Appointment a WHERE a.startTime >= :start AND a.endTime <= :end ORDER BY a.startTime ASC")
    List<Appointment> findByDateRange(@Param("start") Instant start, @Param("end") Instant end);

    @Query(value = "SELECT sp_alta_cita(:pacienteId, :servicioId, :createdById, :startTime, :endTime, :agreedPrice, :doctorId, :followUpToId)", nativeQuery = true)
    Long executeSpAltaCita(
            @Param("pacienteId") Long pacienteId,
            @Param("servicioId") Long servicioId,
            @Param("createdById") Long createdById,
            @Param("startTime") Instant startTime,
            @Param("endTime") Instant endTime,
            @Param("agreedPrice") java.math.BigDecimal agreedPrice,
            @Param("doctorId") Long doctorId,
            @Param("followUpToId") Long followUpToId
    );
}
