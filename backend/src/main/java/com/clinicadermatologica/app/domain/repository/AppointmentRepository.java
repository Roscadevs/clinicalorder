package com.clinicadermatologica.app.domain.repository;

import com.clinicadermatologica.app.domain.model.Appointment;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Contrato de repositorio del dominio (DAO) para la gestión de turnos y agenda.
 *
 * PATRÓN DAO: Esta interfaz define el contrato de acceso a datos para Appointment.
 * Los servicios dependen únicamente de esta interfaz; nunca del adaptador ni del JPA directo.
 * La implementación concreta reside en AppointmentRepositoryAdapter.
 */
public interface AppointmentRepository {
    Optional<Appointment> findById(Long id);
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findOverlappingAppointments(Instant start, Instant end);
    List<Appointment> findByDateRange(Instant start, Instant end);
    /** Bloqueos temporales (PENDING_PAYMENT) creados antes del instante indicado, es decir, vencidos. */
    List<Appointment> findExpiredHolds(Instant createdBefore);
    Appointment save(Appointment appointment);
}
