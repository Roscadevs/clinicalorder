package com.clinicadermatologica.app.application.service;

import com.clinicadermatologica.app.domain.exception.*;
import com.clinicadermatologica.app.domain.model.*;
import com.clinicadermatologica.app.domain.repository.*;
import com.clinicadermatologica.app.infrastructure.payment.MercadoPagoPaymentAdapter;
import com.clinicadermatologica.app.presentation.dto.*;
import com.mercadopago.resources.preference.Preference;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Servicio de Aplicación para gestión de turnos y cálculo de disponibilidad.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DermatologicServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final CalendarBlockRepository calendarBlockRepository;
    private final MercadoPagoPaymentAdapter mercadoPagoAdapter;

    /**
     * Calcula dinámicamente las franjas horarias disponibles para una fecha y servicio.
     */
    @Transactional(readOnly = true)
    public List<TimeSlotDTO> getAvailableSlots(LocalDate date, Long serviceId) {
        DermatologicService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Servicio no encontrado"));

        int duration = service.getDurationMinutes();

        ZoneId zone = ZoneId.of("America/Argentina/Buenos_Aires");
        ZonedDateTime dayStart = date.atTime(9, 0).atZone(zone);
        ZonedDateTime dayEnd = date.atTime(19, 0).atZone(zone);

        Instant startInstant = dayStart.toInstant();
        Instant endInstant = dayEnd.toInstant();

        List<Appointment> existingAppointments = appointmentRepository.findByDateRange(startInstant, endInstant);
        List<CalendarBlock> calendarBlocks = calendarBlockRepository.findByDateRange(startInstant, endInstant);

        List<TimeSlotDTO> slots = new ArrayList<>();
        ZonedDateTime current = dayStart;
        Instant nowPlus2Hours = Instant.now().plus(2, ChronoUnit.HOURS);
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        while (current.plusMinutes(duration).isBefore(dayEnd) || current.plusMinutes(duration).isEqual(dayEnd)) {
            Instant slotStart = current.toInstant();
            Instant slotEnd = current.plusMinutes(duration).toInstant();

            boolean isAvailable = true;

            if (slotStart.isBefore(nowPlus2Hours)) {
                isAvailable = false;
            }

            if (isAvailable) {
                Instant now = Instant.now();
                for (Appointment appt : existingAppointments) {
                    AppointmentStatus s = appt.getStatus();
                    // Un bloqueo temporal vencido ya no retiene el horario (aunque el job aún no lo haya cancelado)
                    if (HoldPolicy.isExpired(appt, now)) continue;
                    if (s == AppointmentStatus.CONFIRMED || s == AppointmentStatus.COMPLETED
                            || s == AppointmentStatus.ATTENDED || s == AppointmentStatus.PENDING_PAYMENT) {
                        if (appt.getStartTime().isBefore(slotEnd) && appt.getEndTime().isAfter(slotStart)) {
                            isAvailable = false;
                            break;
                        }
                    }
                }
            }

            if (isAvailable) {
                for (CalendarBlock block : calendarBlocks) {
                    if (block.getStartTime().isBefore(slotEnd) && block.getEndTime().isAfter(slotStart)) {
                        isAvailable = false;
                        break;
                    }
                }
            }

            slots.add(TimeSlotDTO.builder()
                    .startTime(slotStart)
                    .endTime(slotEnd)
                    .timeDisplay(current.format(timeFormatter) + " hs")
                    .available(isAvailable)
                    .build());

            current = current.plusMinutes(30);
        }

        return slots;
    }

    /**
     * Bloquea un turno y genera la preferencia de pago en MercadoPago.
     * La transacción de pago (PENDING) con paymentConcept=DEPOSIT se crea aquí para que
     * el webhook pueda encontrarla por mpPreferenceId y actualizar su estado.
     */
    @Transactional
    public PaymentPreferenceResponseDTO bookTemporaryHold(BookAppointmentRequestDTO request, Long createdByUserId) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado"));

        DermatologicService service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Servicio no encontrado"));

        if (!service.getActive()) {
            throw new BusinessRuleException("El servicio seleccionado no se encuentra activo");
        }

        User creator = userRepository.findById(createdByUserId != null ? createdByUserId : 1L)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Instant startTime = request.getStartTime();
        Instant endTime = startTime.plus(service.getDurationMinutes(), ChronoUnit.MINUTES);

        if (startTime.isBefore(Instant.now())) {
            throw new BusinessRuleException("No es posible reservar un turno en una fecha u hora pasada");
        }

        List<CalendarBlock> blocks = calendarBlockRepository.findOverlappingBlocks(startTime, endTime);
        if (!blocks.isEmpty()) {
            throw new SlotUnavailableException("El horario seleccionado está bloqueado"
                    + (blocks.get(0).getReason() != null ? ": " + blocks.get(0).getReason() : ""));
        }

        // Los bloqueos vencidos que se superponen se cancelan en el momento y no impiden la reserva
        Instant now = Instant.now();
        List<Appointment> overlapping = new ArrayList<>();
        for (Appointment appt : appointmentRepository.findOverlappingAppointments(startTime, endTime)) {
            if (HoldPolicy.isExpired(appt, now)) {
                expireHold(appt);
            } else {
                overlapping.add(appt);
            }
        }
        if (!overlapping.isEmpty()) {
            throw new SlotUnavailableException("La franja horaria seleccionada ya se encuentra reservada o en proceso de pago");
        }

        BigDecimal agreedPrice = service.getBasePrice();
        BigDecimal depositAmount = agreedPrice
                .multiply(new BigDecimal(service.getDepositPercentage()))
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .service(service)
                .createdByUser(creator)
                .startTime(startTime)
                .endTime(endTime)
                .status(AppointmentStatus.PENDING_PAYMENT)
                .agreedPrice(agreedPrice)
                .build();

        appointment = appointmentRepository.save(appointment);

        Preference preference = mercadoPagoAdapter.createDepositPreference(
                appointment.getId(),
                service.getName(),
                depositAmount,
                patient.getEmail()
        );

        String preferenceId = preference != null ? preference.getId() : "MOCK-PREF-" + UUID.randomUUID();
        String initPointUrl = preference != null ? preference.getInitPoint()
                : "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=" + preferenceId;

        // Crea transacción PENDING con concepto DEPOSIT; el webhook la buscará por mpPreferenceId
        PaymentTransaction transaction = PaymentTransaction.builder()
                .appointment(appointment)
                .mpPreferenceId(preferenceId)
                .paymentType(PaymentType.MERCADOPAGO)
                .paymentConcept(PaymentConcept.DEPOSIT)
                .amount(depositAmount)
                .status(PaymentStatus.PENDING)
                .build();

        paymentTransactionRepository.save(transaction);

        return PaymentPreferenceResponseDTO.builder()
                .appointmentId(appointment.getId())
                .preferenceId(preferenceId)
                .initPointUrl(initPointUrl)
                .depositAmount(depositAmount)
                .holdExpiresAt(HoldPolicy.expiresAt(appointment))
                .build();
    }

    @Transactional
    public void cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Turno no encontrado con ID " + appointmentId));

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new BusinessRuleException("No se puede cancelar un turno que ya ha sido completado");
        }

        appointment.setStatus(AppointmentStatus.CANCELED);
        appointmentRepository.save(appointment);
        rejectPendingTransactions(appointment);
    }

    /**
     * Marca el turno como atendido (acto clínico realizado por el médico).
     * Sólo un turno CONFIRMED puede pasar a ATTENDED. El cobro del saldo
     * (ATTENDED -> COMPLETED) es un paso posterior de negocio.
     */
    @Transactional
    public void markAsAttended(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Turno no encontrado con ID " + appointmentId));

        if (appointment.getStatus() == AppointmentStatus.ATTENDED) {
            return; // idempotente: ya estaba marcado como atendido
        }
        if (appointment.getStatus() != AppointmentStatus.CONFIRMED) {
            throw new BusinessRuleException("Sólo se puede marcar como atendido un turno confirmado (estado actual: "
                    + appointment.getStatus() + ")");
        }

        appointment.setStatus(AppointmentStatus.ATTENDED);
        appointmentRepository.save(appointment);
        log.info("Cita #{} marcada como ATENDIDA; pendiente de cobro del saldo", appointmentId);
    }

    /**
     * Cancela los bloqueos temporales cuyo plazo de 10 minutos venció sin registrarse el pago,
     * liberando el horario. La ejecuta periódicamente HoldExpirationScheduler.
     *
     * @return cantidad de bloqueos liberados
     */
    @Transactional
    public int releaseExpiredHolds() {
        List<Appointment> expired = appointmentRepository.findExpiredHolds(Instant.now().minus(HoldPolicy.TTL));
        expired.forEach(this::expireHold);
        if (!expired.isEmpty()) {
            log.info("Bloqueos temporales vencidos liberados: {}", expired.size());
        }
        return expired.size();
    }

    /** Un bloqueo vencido pasa a CANCELED y su intento de pago pendiente se descarta. */
    private void expireHold(Appointment appointment) {
        appointment.setStatus(AppointmentStatus.CANCELED);
        appointmentRepository.save(appointment);
        rejectPendingTransactions(appointment);
        log.info("Cita #{} CANCELADA: venció el bloqueo temporal de {} minutos",
                appointment.getId(), HoldPolicy.TTL.toMinutes());
    }

    private void rejectPendingTransactions(Appointment appointment) {
        paymentTransactionRepository.findByAppointmentId(appointment.getId()).stream()
                .filter(tx -> tx.getStatus() == PaymentStatus.PENDING)
                .forEach(tx -> {
                    tx.setStatus(PaymentStatus.REJECTED);
                    paymentTransactionRepository.save(tx);
                });
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponseDTO> getAppointmentsByRange(Instant start, Instant end) {
        return appointmentRepository.findByDateRange(start, end).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AppointmentResponseDTO getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Turno no encontrado"));
    }

    public AppointmentResponseDTO mapToDTO(Appointment a) {
        return AppointmentResponseDTO.builder()
                .id(a.getId())
                .patientId(a.getPatient().getId())
                .patientName(a.getPatient().getName())
                .patientDni(a.getPatient().getDni())
                .patientPhone(a.getPatient().getPhone())
                .serviceId(a.getService().getId())
                .serviceName(a.getService().getName())
                .startTime(a.getStartTime())
                .endTime(a.getEndTime())
                .status(a.getStatus())
                .agreedPrice(a.getAgreedPrice())
                .followUpToId(a.getFollowUpTo() != null ? a.getFollowUpTo().getId() : null)
                .build();
    }
}
