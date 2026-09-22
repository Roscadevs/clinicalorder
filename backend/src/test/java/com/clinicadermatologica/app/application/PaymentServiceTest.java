package com.clinicadermatologica.app.application;

import com.clinicadermatologica.app.application.service.PaymentService; // Servicio bajo prueba
import com.clinicadermatologica.app.domain.model.*; // Entidades de dominio
import com.clinicadermatologica.app.domain.repository.AppointmentRepository; // Repositorio simulado
import com.clinicadermatologica.app.domain.repository.PaymentTransactionRepository; // Repositorio simulado
import com.clinicadermatologica.app.domain.repository.UserRepository; // Repositorio simulado
import com.clinicadermatologica.app.infrastructure.payment.MercadoPagoPaymentAdapter; // Adaptador simulado
import com.clinicadermatologica.app.presentation.dto.FinalizePaymentRequestDTO; // DTO
import com.mercadopago.resources.payment.Payment; // Recurso MercadoPago
import org.junit.jupiter.api.BeforeEach; // Pre-test setup
import org.junit.jupiter.api.DisplayName; // Nombre de test
import org.junit.jupiter.api.Test; // Test JUnit 5
import org.junit.jupiter.api.extension.ExtendWith; // Extensión
import org.mockito.InjectMocks; // Inyección de mocks
import org.mockito.Mock; // Mock
import org.mockito.junit.jupiter.MockitoExtension; // Extensión Mockito

import java.math.BigDecimal; // Precisión decimal
import java.util.*; // Colecciones

import static org.junit.jupiter.api.Assertions.*; // Aserciones
import static org.mockito.ArgumentMatchers.any; // Matchers
import static org.mockito.Mockito.*; // Verificaciones

/**
 * Suite de pruebas unitarias para PaymentService con JUnit 5 y Mockito.
 */
@ExtendWith(MockitoExtension.class)
public class PaymentServiceTest {

    @Mock
    private PaymentTransactionRepository paymentTransactionRepository;

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private MercadoPagoPaymentAdapter mercadoPagoAdapter;

    @InjectMocks
    private PaymentService paymentService;

    private Appointment mockAppointment;
    private PaymentTransaction mockTransaction;
    private User mockReceptionist;

    @BeforeEach
    void setUp() {
        mockAppointment = Appointment.builder()
                .id(100L)
                .status(AppointmentStatus.PENDING_PAYMENT)
                .agreedPrice(new BigDecimal("42000.00"))
                .build();

        mockTransaction = PaymentTransaction.builder()
                .id(1L)
                .appointment(mockAppointment)
                .paymentType(PaymentType.DEPOSIT_50)
                .amount(new BigDecimal("21000.00"))
                .status(PaymentStatus.PENDING)
                .build();

        mockReceptionist = User.builder()
                .id(3L)
                .username("sofia.recepcion")
                .role(UserRole.RECEPTIONIST)
                .build();
    }

    @Test
    @DisplayName("Debe confirmar el turno cuando el webhook de MercadoPago informa estado 'approved'")
    void testProcessWebhook_Approved_ConfirmsAppointment() {
        // GIVEN: Simulación de notificación de webhook
        Map<String, Object> payload = Map.of(
                "type", "payment",
                "data", Map.of("id", 123456789L)
        );

        Payment mockMpPayment = mock(Payment.class);
        when(mockMpPayment.getStatus()).thenReturn("approved");
        when(mockMpPayment.getExternalReference()).thenReturn("100");
        when(mercadoPagoAdapter.getPaymentDetails(123456789L)).thenReturn(mockMpPayment);

        when(appointmentRepository.findById(100L)).thenReturn(Optional.of(mockAppointment));
        when(paymentTransactionRepository.findByAppointmentId(100L)).thenReturn(List.of(mockTransaction));

        // WHEN: Procesa el webhook
        paymentService.processMercadoPagoWebhook(payload);

        // THEN: Comprueba que el turno pasó a CONFIRMED
        assertEquals(AppointmentStatus.CONFIRMED, mockAppointment.getStatus());
        assertNull(mockAppointment.getTemporaryHoldDeadline()); // Candado liberado
        assertEquals(PaymentStatus.APPROVED, mockTransaction.getStatus());
        assertEquals("123456789", mockTransaction.getMpPaymentId());

        verify(appointmentRepository, times(1)).save(mockAppointment);
        verify(paymentTransactionRepository, times(1)).save(mockTransaction);
    }

    @Test
    @DisplayName("Debe procesar webhook cuando los datos vienen vía query parameters")
    void testProcessWebhook_QueryParams_Approved() {
        Map<String, String> queryParams = Map.of(
                "topic", "payment",
                "id", "987654321"
        );

        Payment mockMpPayment = mock(Payment.class);
        when(mockMpPayment.getStatus()).thenReturn("approved");
        when(mockMpPayment.getExternalReference()).thenReturn("100");
        when(mercadoPagoAdapter.getPaymentDetails(987654321L)).thenReturn(mockMpPayment);

        when(appointmentRepository.findById(100L)).thenReturn(Optional.of(mockAppointment));
        when(paymentTransactionRepository.findByAppointmentId(100L)).thenReturn(List.of(mockTransaction));

        boolean processed = paymentService.processMercadoPagoWebhook(null, queryParams, null, null);

        assertTrue(processed);
        assertEquals(AppointmentStatus.CONFIRMED, mockAppointment.getStatus());
        assertEquals(PaymentStatus.APPROVED, mockTransaction.getStatus());
        assertEquals("987654321", mockTransaction.getMpPaymentId());
    }

    @Test
    @DisplayName("Debe marcar el turno como PAYMENT_FAILED cuando el pago es rechazado")
    void testProcessWebhook_Rejected_FailsAppointment() {
        Map<String, Object> payload = Map.of(
                "type", "payment",
                "data", Map.of("id", 123456789L)
        );

        Payment mockMpPayment = mock(Payment.class);
        when(mockMpPayment.getStatus()).thenReturn("rejected");
        when(mockMpPayment.getExternalReference()).thenReturn("100");
        when(mercadoPagoAdapter.getPaymentDetails(123456789L)).thenReturn(mockMpPayment);

        when(appointmentRepository.findById(100L)).thenReturn(Optional.of(mockAppointment));
        when(paymentTransactionRepository.findByAppointmentId(100L)).thenReturn(List.of(mockTransaction));

        paymentService.processMercadoPagoWebhook(payload);

        assertEquals(AppointmentStatus.PAYMENT_FAILED, mockAppointment.getStatus());
        assertEquals(PaymentStatus.REJECTED, mockTransaction.getStatus());
    }

    @Test
    @DisplayName("Debe registrar cobro en mostrador y marcar la cita como COMPLETED")
    void testRegisterFinalPayment_Success() {
        mockAppointment.setStatus(AppointmentStatus.CONFIRMED); // Cita previamente confirmada
        FinalizePaymentRequestDTO request = FinalizePaymentRequestDTO.builder()
                .paymentType(PaymentType.FINAL_BALANCE_50)
                .amount(new BigDecimal("21000.00"))
                .build();

        when(appointmentRepository.findById(100L)).thenReturn(Optional.of(mockAppointment));
        when(userRepository.findById(3L)).thenReturn(Optional.of(mockReceptionist));

        paymentService.registerFinalPayment(100L, request, 3L);

        assertEquals(AppointmentStatus.COMPLETED, mockAppointment.getStatus());
        verify(paymentTransactionRepository, times(1)).save(any(PaymentTransaction.class));
        verify(appointmentRepository, times(1)).save(mockAppointment);
    }
}

