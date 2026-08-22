package com.clinicadermatologica.app.infrastructure.persistence.jpa;

import com.clinicadermatologica.app.domain.model.Appointment; // Entidad Appointment
import com.clinicadermatologica.app.domain.model.AppointmentStatus; // Enum de estados
import org.springframework.data.jpa.repository.JpaRepository; // Spring Data JPA
import org.springframework.data.jpa.repository.Modifying; // Anotación para indicar que la consulta modifica datos (UPDATE/DELETE)
import org.springframework.data.jpa.repository.Query; // Anotación JPQL
import org.springframework.data.repository.query.Param; // Parámetros nombrados
import org.springframework.stereotype.Repository; // Componente de repositorio

import java.time.Instant; // Tipos de tiempo UTC
import java.util.List; // Colección de lista

/**
 * Repositorio Spring Data JPA para la gestión de turnos y prevención de sobreturnos.
 */
@Repository // Componente Spring Data
public interface JpaAppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientIdOrderByStartTimeDesc(Long patientId); // Historial cronológico del paciente

    @Query("SELECT a FROM Appointment a WHERE a.startTime < :end AND a.endTime > :start " +
           "AND a.status IN ('CONFIRMED', 'COMPLETED', 'PENDING_PAYMENT') " +
           "AND (a.status != 'PENDING_PAYMENT' OR a.temporaryHoldDeadline > :now)")
    List<Appointment> findOverlappingActiveAppointments(@Param("start") Instant start, 
                                                       @Param("end") Instant end, 
                                                       @Param("now") Instant now); // Detecta solapamiento

    @Query("SELECT a FROM Appointment a WHERE a.startTime >= :start AND a.endTime <= :end ORDER BY a.startTime ASC")
    List<Appointment> findByDateRange(@Param("start") Instant start, @Param("end") Instant end); // Rango de agenda

    List<Appointment> findByStatusAndTemporaryHoldDeadlineBefore(AppointmentStatus status, Instant now); // Turnos vencidos

    @Modifying // Indica que ejecuta una sentencia DML de modificación directa en la BD
    @Query("UPDATE Appointment a SET a.status = 'PAYMENT_FAILED', a.updatedAt = :now " +
           "WHERE a.status = 'PENDING_PAYMENT' AND a.temporaryHoldDeadline < :now")
    int releaseExpiredHolds(@Param("now") Instant now); // Actualización masiva de turnos expirados
}
