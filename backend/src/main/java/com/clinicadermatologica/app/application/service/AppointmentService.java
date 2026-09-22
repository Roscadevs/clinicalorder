package com.clinicadermatologica.app.application.service;

import com.clinicadermatologica.app.domain.exception.*; // Excepciones de negocio
import com.clinicadermatologica.app.domain.model.*; // Entidades de dominio
import com.clinicadermatologica.app.domain.repository.*; // Repositorios del dominio
import com.clinicadermatologica.app.infrastructure.payment.MercadoPagoPaymentAdapter; // Adaptador MercadoPago
import com.clinicadermatologica.app.presentation.dto.*; // DTOs
import com.mercadopago.resources.preference.Preference; // Recurso de MercadoPago
import lombok.RequiredArgsConstructor; // Inyección por constructor
import lombok.extern.slf4j.Slf4j; // Logger
import org.springframework.scheduling.annotation.Scheduled; // Tareas periódicas
import org.springframework.stereotype.Service; // Servicio Spring
import org.springframework.transaction.annotation.Transactional; // Transacciones ACID

import java.math.BigDecimal; // Precisión decimal
import java.math.RoundingMode; // Modo de redondeo
import java.time.*; // Tipos de fecha/hora de Java 8+
import java.time.format.DateTimeFormatter; // Formato de fecha
import java.time.temporal.ChronoUnit; // Unidades temporales
import java.util.*; // Colecciones Java
import java.util.stream.Collectors; // Streams

/**
 * Servicio de Aplicación para gestión de turnos, cálculo de disponibilidad y TTL de 10 minutos.
 */
@Service // Componente de servicio Spring
@RequiredArgsConstructor // Inyección por constructor
@Slf4j // Logger
public class AppointmentService {

    private final AppointmentRepository appointmentRepository; // Repositorio de citas
    private final PatientRepository patientRepository; // Repositorio de pacientes
    private final DermatologicServiceRepository serviceRepository; // Repositorio de servicios
    private final UserRepository userRepository; // Repositorio de usuarios
    private final PaymentTransactionRepository paymentTransactionRepository; // Repositorio de pagos
    private final CalendarBlockRepository calendarBlockRepository; // Repositorio de bloqueos
    private final MercadoPagoPaymentAdapter mercadoPagoAdapter; // Adaptador MercadoPago

    /**
     * Calcula dinámicamente las franjas horarias disponibles para una fecha y servicio determinados.
     */
    @Transactional(readOnly = true) // Consulta optimizada de solo lectura
    public List<TimeSlotDTO> getAvailableSlots(LocalDate date, Long serviceId) {
        DermatologicService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Servicio no encontrado"));

        int duration = service.getDurationMinutes();

        // Rango de horario de atención: 09:00 a 19:00 hs (Zona horaria de la clínica)
        ZoneId zone = ZoneId.of("America/Argentina/Buenos_Aires");
        ZonedDateTime dayStart = date.atTime(9, 0).atZone(zone);
        ZonedDateTime dayEnd = date.atTime(19, 0).atZone(zone);

        Instant startInstant = dayStart.toInstant();
        Instant endInstant = dayEnd.toInstant();

        // Obtiene todas las citas activas y bloqueos de calendario para la fecha consultada
        List<Appointment> existingAppointments = appointmentRepository.findByDateRange(startInstant, endInstant);
        List<CalendarBlock> calendarBlocks = calendarBlockRepository.findByDateRange(startInstant, endInstant);

        List<TimeSlotDTO> slots = new ArrayList<>();
        ZonedDateTime current = dayStart;
        Instant nowPlus2Hours = Instant.now().plus(2, ChronoUnit.HOURS); // Antelación mínima de 2 horas
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        while (current.plusMinutes(duration).isBefore(dayEnd) || current.plusMinutes(duration).isEqual(dayEnd)) {
            Instant slotStart = current.toInstant();
            Instant slotEnd = current.plusMinutes(duration).toInstant();

            boolean isAvailable = true;

            // 1. Valida si la franja cae en el pasado o antes del plazo de antelación
            if (slotStart.isBefore(nowPlus2Hours)) {
                isAvailable = false;
            }

            // 2. Valida colisión con citas activas o bloqueos temporales vigentes (<10 min)
            if (isAvailable) {
                for (Appointment appt : existingAppointments) {
                    if (appt.getStatus() == AppointmentStatus.CONFIRMED || appt.getStatus() == AppointmentStatus.COMPLETED) {
                        if (appt.getStartTime().isBefore(slotEnd) && appt.getEndTime().isAfter(slotStart)) {
                            isAvailable = false;
                            break;
                        }
                    } else if (appt.getStatus() == AppointmentStatus.PENDING_PAYMENT) {
                        if (appt.getTemporaryHoldDeadline() != null && appt.getTemporaryHoldDeadline().isAfter(Instant.now())) {
                            if (appt.getStartTime().isBefore(slotEnd) && appt.getEndTime().isAfter(slotStart)) {
                                isAvailable = false;
                                break;
                            }
                        }
                    }
                }
            }

            // 3. Valida colisión con bloqueos de calendario
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

            // Avanza en intervalos de 30 minutos
            current = current.plusMinutes(30);
        }

        return slots;
    }

    /**
     * Bloquea temporalmente un turno durante 10 minutos y genera la preferencia de pago en MercadoPago.
     */
    @Transactional // Transacción ACID
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
            throw new SlotUnavailableException("El horario seleccionado está bloqueado por: " + blocks.get(0).getReason());
        }

        List<Appointment> overlapping = appointmentRepository.findOverlappingAppointments(startTime, endTime);
        if (!overlapping.isEmpty()) {
            throw new SlotUnavailableException("La franja horaria seleccionada ya se encuentra reservada o en proceso de pago");
        }

        BigDecimal agreedPrice = service.getBasePrice();
        BigDecimal depositPercentage = service.getDepositPercentage();
        BigDecimal depositAmount = agreedPrice.multiply(depositPercentage).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);

        Instant holdDeadline = Instant.now().plus(10, ChronoUnit.MINUTES);

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .service(service)
                .createdByUser(creator)
                .startTime(startTime)
                .endTime(endTime)
                .status(AppointmentStatus.PENDING_PAYMENT)
                .agreedPrice(agreedPrice)
                .temporaryHoldDeadline(holdDeadline)
                .originalStartTime(startTime)
                .rescheduleCount(0)
                .version(0L)
                .build();

        appointment = appointmentRepository.save(appointment);

        Preference preference = mercadoPagoAdapter.createDepositPreference(
                appointment.getId(),
                service.getName(),
                depositAmount,
                patient.getEmail(),
                patient.getName(),
                patient.getDni(),
                patient.getPhone()
        );

        String preferenceId = preference != null ? preference.getId() : "MOCK-PREF-" + UUID.randomUUID();
        String initPointUrl;
        if (preference != null) {
            initPointUrl = (preference.getSandboxInitPoint() != null && !preference.getSandboxInitPoint().isBlank())
                    ? preference.getSandboxInitPoint()
                    : preference.getInitPoint();
        } else {
            initPointUrl = "https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=" + preferenceId;
        }

        PaymentTransaction transaction = PaymentTransaction.builder()
                .appointment(appointment)
                .mpPreferenceId(preferenceId)
                .paymentType(PaymentType.DEPOSIT_50)
                .amount(depositAmount)
                .status(PaymentStatus.PENDING)
                .paymentDate(Instant.now())
                .build();

        paymentTransactionRepository.save(transaction);

        return PaymentPreferenceResponseDTO.builder()
                .appointmentId(appointment.getId())
                .preferenceId(preferenceId)
                .initPointUrl(initPointUrl)
                .depositAmount(depositAmount)
                .holdExpiresAt(holdDeadline)
                .build();
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void releaseExpiredHoldsScheduler() {
        Instant now = Instant.now();
        int releasedCount = appointmentRepository.releaseExpiredHolds(now);
        if (releasedCount > 0) {
            log.info("Tarea programada: Se liberaron {} turnos vencidos con estado PENDING_PAYMENT", releasedCount);
        }
    }

    @Transactional
    public void cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Turno no encontrado con ID " + appointmentId));

        if (appointment.getStatus() == AppointmentStatus.COMPLETED) {
            throw new BusinessRuleException("No se puede cancelar un turno que ya ha sido completado");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
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
                .temporaryHoldDeadline(a.getTemporaryHoldDeadline())
                .rescheduleCount(a.getRescheduleCount())
                .version(a.getVersion())
                .build();
    }
}
