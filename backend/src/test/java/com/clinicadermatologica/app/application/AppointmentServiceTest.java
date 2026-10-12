package com.clinicadermatologica.app.application;

import com.clinicadermatologica.app.application.service.AppointmentService;
import com.clinicadermatologica.app.domain.exception.SlotUnavailableException;
import com.clinicadermatologica.app.domain.model.*;
import com.clinicadermatologica.app.domain.repository.*;
import com.clinicadermatologica.app.infrastructure.payment.MercadoPagoPaymentAdapter;
import com.clinicadermatologica.app.presentation.dto.BookAppointmentRequestDTO;
import com.clinicadermatologica.app.presentation.dto.PaymentPreferenceResponseDTO;
import com.clinicadermatologica.app.presentation.dto.TimeSlotDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Suite de pruebas unitarias para AppointmentService con JUnit 5 y Mockito.
 */
@ExtendWith(MockitoExtension.class)
public class AppointmentServiceTest {

    @Mock private AppointmentRepository appointmentRepository;
    @Mock private PatientRepository patientRepository;
    @Mock private DermatologicServiceRepository serviceRepository;
    @Mock private UserRepository userRepository;
    @Mock private PaymentTransactionRepository paymentTransactionRepository;
    @Mock private CalendarBlockRepository calendarBlockRepository;
    @Mock private MercadoPagoPaymentAdapter mercadoPagoAdapter;
    @Mock private com.clinicadermatologica.app.application.service.PaymentService paymentService;

    @InjectMocks
    private AppointmentService appointmentService;

    private Patient mockPatient;
    private DermatologicService mockService;
    private User mockUser;

    @BeforeEach
    void setUp() {
        mockPatient = Patient.builder()
                .id(1L)
                .name("Lucía Fernández")
                .dni("38456123")
                .phone("+5491145678901")
                .email("lucia@example.com")
                .active(true)
                .build();

        mockService = DermatologicService.builder()
                .id(10L)
                .name("Peeling Químico Médico")
                .durationMinutes(45)
                .basePrice(new BigDecimal("42000.00"))
                .depositPercentage(50) // Integer en el nuevo modelo
                .followUpIntervalDays(21)
                .active(true)
                .build();

        mockUser = User.builder()
                .id(1L)
                .username("admin")
                .role(UserRole.ADMIN)
                .build();
    }

    @Test
    @DisplayName("Debe bloquear turno y calcular seña según porcentaje del servicio")
    void testBookTemporaryHold_Success() {
        Instant startTime = Instant.now().plus(4, ChronoUnit.HOURS);
        BookAppointmentRequestDTO request = BookAppointmentRequestDTO.builder()
                .patientId(1L)
                .serviceId(10L)
                .startTime(startTime)
                .build();

        when(patientRepository.findById(1L)).thenReturn(Optional.of(mockPatient));
        when(serviceRepository.findById(10L)).thenReturn(Optional.of(mockService));
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        when(calendarBlockRepository.findOverlappingBlocks(any(), any())).thenReturn(Collections.emptyList());
        when(appointmentRepository.findOverlappingAppointments(any(), any())).thenReturn(Collections.emptyList());

        com.mercadopago.resources.preference.Preference mockPref = mock(com.mercadopago.resources.preference.Preference.class);
        when(mockPref.getId()).thenReturn("PREF-100");
        when(mercadoPagoAdapter.createDepositPreference(any(), any(), any(), any(), any(), any(), any())).thenReturn(mockPref);
        when(mercadoPagoAdapter.resolveInitPoint(mockPref)).thenReturn("https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=PREF-100");

        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(inv -> {
            Appointment appt = inv.getArgument(0);
            appt.setId(100L);
            return appt;
        });

        PaymentPreferenceResponseDTO result = appointmentService.bookTemporaryHold(request, 1L);

        assertNotNull(result);
        assertEquals(100L, result.getAppointmentId());
        // Seña esperada: $42.000 × 50% = $21.000
        assertEquals(new BigDecimal("21000.00"), result.getDepositAmount());
        // El bloqueo informa su vencimiento (10 minutos)
        assertNotNull(result.getHoldExpiresAt());
        assertTrue(result.getHoldExpiresAt().isAfter(Instant.now().plus(9, ChronoUnit.MINUTES)));

        verify(appointmentRepository, times(1)).save(any(Appointment.class));
        verify(paymentTransactionRepository, times(1)).save(any(PaymentTransaction.class));
    }

    @Test
    @DisplayName("Debe lanzar SlotUnavailableException si la franja ya está ocupada")
    void testBookTemporaryHold_SlotUnavailable_ThrowsException() {
        Instant startTime = Instant.now().plus(4, ChronoUnit.HOURS);
        BookAppointmentRequestDTO request = BookAppointmentRequestDTO.builder()
                .patientId(1L)
                .serviceId(10L)
                .startTime(startTime)
                .build();

        when(patientRepository.findById(1L)).thenReturn(Optional.of(mockPatient));
        when(serviceRepository.findById(10L)).thenReturn(Optional.of(mockService));
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        when(calendarBlockRepository.findOverlappingBlocks(any(), any())).thenReturn(Collections.emptyList());

        Appointment existing = Appointment.builder().id(50L).status(AppointmentStatus.CONFIRMED).build();
        when(appointmentRepository.findOverlappingAppointments(any(), any())).thenReturn(List.of(existing));

        assertThrows(SlotUnavailableException.class, () -> appointmentService.bookTemporaryHold(request, 1L));
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    @DisplayName("Un bloqueo temporal vencido que se superpone se cancela y no impide la reserva")
    void testBookTemporaryHold_ExpiredOverlappingHold_IsReleased() {
        Instant startTime = Instant.now().plus(4, ChronoUnit.HOURS);
        BookAppointmentRequestDTO request = BookAppointmentRequestDTO.builder()
                .patientId(1L).serviceId(10L).startTime(startTime).build();

        Appointment staleHold = Appointment.builder()
                .id(60L)
                .status(AppointmentStatus.PENDING_PAYMENT)
                .createdAt(Instant.now().minus(15, ChronoUnit.MINUTES))
                .build();

        when(patientRepository.findById(1L)).thenReturn(Optional.of(mockPatient));
        when(serviceRepository.findById(10L)).thenReturn(Optional.of(mockService));
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        when(calendarBlockRepository.findOverlappingBlocks(any(), any())).thenReturn(Collections.emptyList());
        when(appointmentRepository.findOverlappingAppointments(any(), any())).thenReturn(List.of(staleHold));

        com.mercadopago.resources.preference.Preference mockPref = mock(com.mercadopago.resources.preference.Preference.class);
        when(mockPref.getId()).thenReturn("PREF-101");
        when(mercadoPagoAdapter.createDepositPreference(any(), any(), any(), any(), any(), any(), any())).thenReturn(mockPref);
        when(mercadoPagoAdapter.resolveInitPoint(mockPref)).thenReturn("https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=PREF-101");

        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(inv -> {
            Appointment appt = inv.getArgument(0);
            if (appt.getId() == null) appt.setId(101L);
            return appt;
        });

        PaymentPreferenceResponseDTO result = appointmentService.bookTemporaryHold(request, 1L);

        assertEquals(101L, result.getAppointmentId());
        assertEquals(AppointmentStatus.CANCELED, staleHold.getStatus());
    }

    @Test
    @DisplayName("markAsAttended pasa un turno CONFIRMED a ATTENDED")
    void testMarkAsAttended_ConfirmedToAttended() {
        Appointment appt = Appointment.builder().id(80L).status(AppointmentStatus.CONFIRMED).build();
        when(appointmentRepository.findById(80L)).thenReturn(Optional.of(appt));

        appointmentService.markAsAttended(80L);

        assertEquals(AppointmentStatus.ATTENDED, appt.getStatus());
        verify(appointmentRepository).save(appt);
    }

    @Test
    @DisplayName("markAsAttended rechaza turnos que no están confirmados")
    void testMarkAsAttended_NotConfirmed_Throws() {
        Appointment appt = Appointment.builder().id(81L).status(AppointmentStatus.PENDING_PAYMENT).build();
        when(appointmentRepository.findById(81L)).thenReturn(Optional.of(appt));

        assertThrows(com.clinicadermatologica.app.domain.exception.BusinessRuleException.class,
                () -> appointmentService.markAsAttended(81L));
        assertEquals(AppointmentStatus.PENDING_PAYMENT, appt.getStatus());
    }

    @Test
    @DisplayName("releaseExpiredHolds cancela los bloqueos vencidos y descarta su pago pendiente")
    void testReleaseExpiredHolds_CancelsAndRejectsPendingPayment() {
        Appointment expired = Appointment.builder()
                .id(70L)
                .status(AppointmentStatus.PENDING_PAYMENT)
                .createdAt(Instant.now().minus(12, ChronoUnit.MINUTES))
                .build();
        PaymentTransaction pendingTx = PaymentTransaction.builder()
                .id(5L).appointment(expired).status(PaymentStatus.PENDING).build();

        when(appointmentRepository.findExpiredHolds(any())).thenReturn(List.of(expired));
        when(paymentTransactionRepository.findByAppointmentId(70L)).thenReturn(List.of(pendingTx));

        int released = appointmentService.releaseExpiredHolds();

        assertEquals(1, released);
        assertEquals(AppointmentStatus.CANCELED, expired.getStatus());
        assertEquals(PaymentStatus.REJECTED, pendingTx.getStatus());
        verify(appointmentRepository).save(expired);
    }

    @Test
    @DisplayName("Debe calcular slots de disponibilidad descontando citas ocupadas")
    void testGetAvailableSlots() {
        LocalDate date = LocalDate.now().plusDays(2);
        when(serviceRepository.findById(10L)).thenReturn(Optional.of(mockService));
        when(appointmentRepository.findByDateRange(any(), any())).thenReturn(Collections.emptyList());
        when(calendarBlockRepository.findByDateRange(any(), any())).thenReturn(Collections.emptyList());

        List<TimeSlotDTO> slots = appointmentService.getAvailableSlots(date, 10L);

        assertNotNull(slots);
        assertFalse(slots.isEmpty());
        assertTrue(slots.stream().anyMatch(TimeSlotDTO::getAvailable));
    }

    @Test
    @DisplayName("cancelAppointment debe emitir reembolso si existe pago aprobado en MercadoPago")
    void testCancelAppointment_WithApprovedMercadoPagoPayment_TriggersRefund() {
        Appointment appt = Appointment.builder().id(200L).status(AppointmentStatus.CONFIRMED).build();
        when(appointmentRepository.findById(200L)).thenReturn(Optional.of(appt));

        PaymentTransaction approvedTx = PaymentTransaction.builder()
                .id(500L)
                .appointment(appt)
                .paymentType(PaymentType.MERCADOPAGO)
                .status(PaymentStatus.APPROVED)
                .mpPaymentId("123456789")
                .build();

        when(paymentTransactionRepository.findByAppointmentId(200L)).thenReturn(List.of(approvedTx));

        appointmentService.cancelAppointment(200L);

        assertEquals(AppointmentStatus.CANCELED, appt.getStatus());
        verify(paymentService, times(1)).refundPayment(approvedTx);
        verify(appointmentRepository).save(appt);
    }

    @Test
    @DisplayName("getAppointmentPublicStatus retorna información resumida del turno")
    void testGetAppointmentPublicStatus() {
        Appointment appt = Appointment.builder()
                .id(300L)
                .status(AppointmentStatus.CONFIRMED)
                .service(mockService)
                .startTime(Instant.now())
                .build();

        when(appointmentRepository.findById(300L)).thenReturn(Optional.of(appt));

        Map<String, Object> status = appointmentService.getAppointmentPublicStatus(300L);

        assertNotNull(status);
        assertEquals(300L, status.get("appointmentId"));
        assertEquals("CONFIRMED", status.get("status"));
        assertEquals("Peeling Químico Médico", status.get("serviceName"));
    }
}
