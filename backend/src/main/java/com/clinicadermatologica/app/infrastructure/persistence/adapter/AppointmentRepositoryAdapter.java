package com.clinicadermatologica.app.infrastructure.persistence.adapter;

import com.clinicadermatologica.app.domain.model.Appointment; // Entidad Appointment
import com.clinicadermatologica.app.domain.model.AppointmentStatus; // Enum de estados
import com.clinicadermatologica.app.domain.repository.AppointmentRepository; // Interfaz del dominio
import com.clinicadermatologica.app.infrastructure.persistence.jpa.JpaAppointmentRepository; // Repositorio JPA
import lombok.RequiredArgsConstructor; // Inyección por constructor
import org.springframework.stereotype.Component; // Componente Spring

import java.time.Instant; // Tipos de tiempo UTC
import java.util.List; // Colección de lista
import java.util.Optional; // Contenedor opcional

/**
 * Adaptador de persistencia para la gestión de turnos y control de concurrencia optimista.
 */
@Component // Componente Spring
@RequiredArgsConstructor // Inyección por constructor
public class AppointmentRepositoryAdapter implements AppointmentRepository {

    private final JpaAppointmentRepository jpaRepository; // Inyección del repositorio JPA

    @Override
    public Optional<Appointment> findById(Long id) {
        return jpaRepository.findById(id); // Delega la búsqueda
    }

    @Override
    public List<Appointment> findByPatientId(Long patientId) {
        return jpaRepository.findByPatientIdOrderByStartTimeDesc(patientId); // Historial por paciente
    }

    @Override
    public List<Appointment> findOverlappingAppointments(Instant start, Instant end) {
        return jpaRepository.findOverlappingActiveAppointments(start, end, Instant.now()); // Chequea colisión horaria
    }

    @Override
    public List<Appointment> findByDateRange(Instant start, Instant end) {
        return jpaRepository.findByDateRange(start, end); // Rango de agenda
    }

    @Override
    public List<Appointment> findByStatusAndTemporaryHoldDeadlineBefore(AppointmentStatus status, Instant now) {
        return jpaRepository.findByStatusAndTemporaryHoldDeadlineBefore(status, now); // Turnos vencidos
    }

    @Override
    public Appointment save(Appointment appointment) {
        return jpaRepository.save(appointment); // Guarda la cita (@Version actúa aquí)
    }

    @Override
    public int releaseExpiredHolds(Instant now) {
        return jpaRepository.releaseExpiredHolds(now); // Actualización masiva
    }
}
