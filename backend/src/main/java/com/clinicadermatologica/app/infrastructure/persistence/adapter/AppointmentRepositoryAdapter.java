package com.clinicadermatologica.app.infrastructure.persistence.adapter;

import com.clinicadermatologica.app.domain.model.Appointment;
import com.clinicadermatologica.app.domain.model.AppointmentStatus;
import com.clinicadermatologica.app.domain.repository.AppointmentRepository;
import com.clinicadermatologica.app.infrastructure.persistence.jpa.JpaAppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * PATRÓN DAO — Implementación concreta del contrato AppointmentRepository.
 *
 * Este adaptador actúa como la capa DAO entre el dominio y la infraestructura de persistencia.
 * Traduce el contrato definido en la interfaz AppointmentRepository hacia las operaciones
 * específicas de Spring Data JPA (JpaAppointmentRepository), manteniendo al dominio
 * completamente desacoplado de la tecnología de persistencia subyacente.
 */
@Component
@RequiredArgsConstructor
public class AppointmentRepositoryAdapter implements AppointmentRepository {

    private final JpaAppointmentRepository jpaRepository;

    @Override
    public Optional<Appointment> findById(Long id) {
        return jpaRepository.findById(id);
    }

    @Override
    public List<Appointment> findByPatientId(Long patientId) {
        return jpaRepository.findByPatientIdOrderByStartTimeDesc(patientId);
    }

    @Override
    public List<Appointment> findOverlappingAppointments(Instant start, Instant end) {
        return jpaRepository.findOverlappingActiveAppointments(start, end);
    }

    @Override
    public List<Appointment> findByDateRange(Instant start, Instant end) {
        return jpaRepository.findByDateRange(start, end);
    }

    @Override
    public List<Appointment> findExpiredHolds(Instant createdBefore) {
        return jpaRepository.findByStatusAndCreatedAtBefore(AppointmentStatus.PENDING_PAYMENT, createdBefore);
    }

    @Override
    public Appointment save(Appointment appointment) {
        return jpaRepository.save(appointment);
    }
}
