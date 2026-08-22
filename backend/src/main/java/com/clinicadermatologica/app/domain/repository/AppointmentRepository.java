package com.clinicadermatologica.app.domain.repository;

import com.clinicadermatologica.app.domain.model.Appointment; // Entidad Appointment del dominio
import com.clinicadermatologica.app.domain.model.AppointmentStatus; // Enum de estados

import java.time.Instant; // Tipos de fecha/hora UTC
import java.util.List; // Colección de lista
import java.util.Optional; // Contenedor opcional

/**
 * Contrato de repositorio del dominio para la gestión de turnos y agenda.
 */
public interface AppointmentRepository {
    Optional<Appointment> findById(Long id); // Búsqueda de cita por ID
    List<Appointment> findByPatientId(Long patientId); // Historial de turnos de un paciente
    List<Appointment> findOverlappingAppointments(Instant start, Instant end); // Turnos que colisionan en horario
    List<Appointment> findByDateRange(Instant start, Instant end); // Turnos en un rango de fechas para la agenda
    List<Appointment> findByStatusAndTemporaryHoldDeadlineBefore(AppointmentStatus status, Instant now); // Turnos vencidos
    Appointment save(Appointment appointment); // Guarda la cita (aplica @Version para concurrencia optimista)
    int releaseExpiredHolds(Instant now); // Actualiza masivamente a PAYMENT_FAILED los turnos con deadline vencido
}
