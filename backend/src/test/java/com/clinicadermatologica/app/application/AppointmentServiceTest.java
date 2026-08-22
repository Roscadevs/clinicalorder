package com.clinicadermatologica.app.application;

import com.clinicadermatologica.app.application.service.AppointmentService; // Servicio bajo prueba
import com.clinicadermatologica.app.domain.exception.SlotUnavailableException; // Excepción esperada
import com.clinicadermatologica.app.domain.model.*; // Entidades del dominio
import com.clinicadermatologica.app.domain.repository.*; // Repositorios simulados
import com.clinicadermatologica.app.infrastructure.payment.MercadoPagoPaymentAdapter; // Adaptador simulado
import com.clinicadermatologica.app.presentation.dto.BookAppointmentRequestDTO; // DTO de prueba
import com.clinicadermatologica.app.presentation.dto.PaymentPreferenceResponseDTO; // DTO respuesta
import com.clinicadermatologica.app.presentation.dto.TimeSlotDTO; // DTO slots
import org.junit.jupiter.api.BeforeEach; // Ejecuta configuración previa a cada test
import org.junit.jupiter.api.DisplayName; // Etiqueta descriptiva del test
import org.junit.jupiter.api.Test; // Anotación de método de prueba JUnit 5
import org.junit.jupiter.api.extension.ExtendWith; // Habilita extensiones de JUnit 5
import org.mockito.InjectMocks; // Inyecta los mocks simulados en la clase bajo prueba
import org.mockito.Mock; // Crea un mock simulado de Mockito
import org.mockito.junit.jupiter.MockitoExtension; // Extensión de Mockito para JUnit 5

import java.math.BigDecimal; // Precisión decimal
import java.time.Instant; // Tiempo UTC
import java.time.LocalDate; // Fecha
import java.time.temporal.ChronoUnit; // Unidades temporales
import java.util.*; // Colecciones

import static org.junit.jupiter.api.Assertions.*; // Aserciones de JUnit 5
import static org.mockito.ArgumentMatchers.any; // Matchers de Mockito
import static org.mockito.Mockito.*; // Métodos de verificación y stubbing de Mockito

/**
 * Suite de pruebas unitarias para AppointmentService con JUnit 5 y Mockito.
 */
@ExtendWith(MockitoExtension.class) // Inicializa el entorno de mocks de Mockito
public class AppointmentServiceTest {

    @Mock // Mock simulado del repositorio de citas
    private AppointmentRepository appointmentRepository;

    @Mock // Mock simulado del repositorio de pacientes
    private PatientRepository patientRepository;

    @Mock // Mock simulado del repositorio de servicios
    private DermatologicServiceRepository serviceRepository;

    @Mock // Mock simulado del repositorio de usuarios
    private UserRepository userRepository;

    @Mock // Mock simulado del repositorio de transacciones
    private PaymentTransactionRepository paymentTransactionRepository;

    @Mock // Mock simulado del repositorio de bloqueos
    private CalendarBlockRepository calendarBlockRepository;

    @Mock // Mock simulado del adaptador de MercadoPago
    private MercadoPagoPaymentAdapter mercadoPagoAdapter;

    @InjectMocks // Instancia el servicio inyectando automáticamente los mocks declarados arriba
    private AppointmentService appointmentService;

    private Patient mockPatient;
    private DermatologicService mockService;
    private User mockUser;

    @BeforeEach // Configura los datos de prueba antes de cada caso de test
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
                .depositPercentage(new BigDecimal("50.00"))
                .active(true)
                .build();

        mockUser = User.builder()
                .id(1L)
                .username("admin")
                .role(UserRole.ADMIN)
                .build();
    }

    @Test // Declara un test unitario
    @DisplayName("Debe bloquear turno temporalmente por 10 min y calcular seña del 50%")
    void testBookTemporaryHold_Success() {
        // GIVEN: Preparación de datos y simulación de respuestas de repositorios
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

        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(inv -> {
            Appointment appt = inv.getArgument(0);
            appt.setId(100L);
            return appt;
        });

        // WHEN: Ejecución del caso de uso
        PaymentPreferenceResponseDTO result = appointmentService.bookTemporaryHold(request, 1L);

        // THEN: Verificación de resultados esperados
        assertNotNull(result);
        assertEquals(100L, result.getAppointmentId());
        // Seña esperada: $42.000 * 50% = $21.000
        assertEquals(new BigDecimal("21000.00"), result.getDepositAmount());
        assertNotNull(result.getHoldExpiresAt());
        assertTrue(result.getHoldExpiresAt().isAfter(Instant.now()));

        // Verifica que se haya persistido la cita y la transacción de pago
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

        // Simula que ya existe una cita confirmada en ese horario
        Appointment existing = Appointment.builder().id(50L).status(AppointmentStatus.CONFIRMED).build();
        when(appointmentRepository.findOverlappingAppointments(any(), any())).thenReturn(List.of(existing));

        // Verifica que se arroje la excepción de negocio esperada
        assertThrows(SlotUnavailableException.class, () -> {
            appointmentService.bookTemporaryHold(request, 1L);
        });

        // Verifica que NUNCA se guarde una cita colisionada
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }

    @Test
    @DisplayName("Debe liberar turnos vencidos mediante la tarea programada Scheduler")
    void testReleaseExpiredHoldsScheduler() {
        when(appointmentRepository.releaseExpiredHolds(any(Instant.class))).thenReturn(3);

        appointmentService.releaseExpiredHoldsScheduler();

        // Verifica que se ejecute la consulta masiva de liberación de slots
        verify(appointmentRepository, times(1)).releaseExpiredHolds(any(Instant.class));
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
        // Comprueba que los slots calculados para una fecha futura estén marcados como disponibles
        assertTrue(slots.stream().anyMatch(TimeSlotDTO::getAvailable));
    }
}
