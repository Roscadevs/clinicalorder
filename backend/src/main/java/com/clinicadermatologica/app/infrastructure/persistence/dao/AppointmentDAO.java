package com.clinicadermatologica.app.infrastructure.persistence.dao;

import com.clinicadermatologica.app.domain.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

/**
 * PATRÓN DAO (Data Access Object) para la entidad Appointment (turnos / agenda).
 *
 * Encapsula el acceso a datos de los turnos mediante Spring Data JPA. Expone las
 * consultas que usan los servicios de la capa de aplicación.
 */
@Repository
public interface AppointmentDAO extends JpaRepository<Appointment, Long> {

    /** Turnos de un paciente, del más reciente al más antiguo. */
    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId ORDER BY a.startTime DESC")
    List<Appointment> findByPatientId(@Param("patientId") Long patientId);

    /** Turnos activos que se solapan con el rango dado (para control de disponibilidad). */
    @Query("SELECT a FROM Appointment a WHERE a.startTime < :end AND a.endTime > :start " +
           "AND a.status IN ('CONFIRMED', 'COMPLETED', 'PENDING_PAYMENT')")
    List<Appointment> findOverlappingAppointments(@Param("start") Instant start, @Param("end") Instant end);

    /** Turnos cuyo horario cae dentro del rango dado, ordenados por inicio. */
    @Query("SELECT a FROM Appointment a WHERE a.startTime >= :start AND a.endTime <= :end ORDER BY a.startTime ASC")
    List<Appointment> findByDateRange(@Param("start") Instant start, @Param("end") Instant end);

    /** Bloqueos temporales (PENDING_PAYMENT) creados antes del instante indicado, es decir, vencidos. */
    @Query("SELECT a FROM Appointment a WHERE a.status = 'PENDING_PAYMENT' AND a.createdAt < :createdBefore")
    List<Appointment> findExpiredHolds(@Param("createdBefore") Instant createdBefore);
}
