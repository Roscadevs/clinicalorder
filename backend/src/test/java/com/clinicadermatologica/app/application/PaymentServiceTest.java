package com.clinicadermatologica.app.application;

import com.clinicadermatologica.app.application.service.PaymentService;
import com.clinicadermatologica.app.application.strategy.PaymentRegistrationStrategy;
import com.clinicadermatologica.app.application.strategy.PaymentStrategyFactory;
import com.clinicadermatologica.app.domain.exception.BusinessRuleException;
import com.clinicadermatologica.app.domain.model.*;
import com.clinicadermatologica.app.domain.repository.*;
import com.clinicadermatologica.app.infrastructure.payment.MercadoPagoPaymentAdapter;
import com.clinicadermatologica.app.presentation.dto.FinalizePaymentRequestDTO;
import com.clinicadermatologica.app.presentation.dto.PaymentReceiptDTO;
import com.clinicadermatologica.app.presentation.dto.RegisterPaymentRequestDTO;
import com.mercadopago.resources.payment.Payment;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Suite de pruebas unitarias para PaymentService (Patrón Strategy).
 * Verifica que PaymentService delega correctamente en las estrategias de pago
 * y que las transiciones de estado de la cita son correctas.
 */
@ExtendWith(MockitoExtension.class)
public class PaymentServiceTest {

    @Mock private PaymentTransactionRepository paymentTransactionRepository;
    @Mock private AppointmentRepository appointmentRepository;
    @Mock private UserRepository userRepository;
    @Mock private MercadoPagoPaymentAdapter mercadoPagoAdapter;
    @Mock private PaymentStrategyFactory paymentStrategyFactory;

    @InjectMocks
    private PaymentService paymentService;

    private Appointment mockAppointment;
    private User mockReceptionist;

    @BeforeEach
    void setUp() {
        mockAppointment = Appointment.builder()
                .id(100L)
                .status(AppointmentStatus.PENDING_PAYMENT)
                .agreedPrice(new BigDecimal("42000.00"))
                .build();

        mockReceptionist = User.builder()
                .id(3L)
                .username("sofia.recepcion")
                .role(UserRole.SECRETARIA)
                .build();
    }

    // ─── WEBHOOK TESTS ───────────────────────────────────────────────────────────

    @Test
    @DisplayName("Webhook approved con concepto DEPOSIT debe confirmar la cita")
    void testWebhook_Approved_Deposit_ConfirmsAppointment() {
        PaymentTransaction pendingTx = PaymentTransaction.builder()
                .id(1L)
                .appointment(mockAppointment)
                .paymentType(PaymentType.MERCADOPAGO)
                .paymentConcept(PaymentConcept.DEPOSIT)
                .amount(new BigDecimal("21000.00"))
                .status(PaymentStatus.PENDING)
                .mpPreferenceId("PREF-123")
                .build();

        Payment mpPayment = mock(Payment.class);
        when(mpPayment.getStatus()).thenReturn("approved");
        when(mpPayment.getExternalReference()).thenReturn("PREF-123");

        Map<String, Object> payload = Map.of(
                "type", "payment",
                "data", Map.of("id", "99")
        );

        when(mercadoPagoAdapter.getPaymentDetails(99L)).thenReturn(mpPayment);
        when(paymentTransactionRepository.findByMpPreferenceId("PREF-123"))
                .thenReturn(Optional.of(pendingTx));

        paymentService.processMercadoPagoWebhook(payload);

        assertEquals(AppointmentStatus.CONFIRMED, mockAppointment.getStatus());
        assertEquals(PaymentStatus.APPROVED, pendingTx.getStatus());
        verify(appointmentRepository).save(mockAppointment);
        verify(paymentTransactionRepository).save(pendingTx);
    }

    @Test
    @DisplayName("Webhook approved con concepto FULL debe confirmar la cita directamente")
    void testWebhook_Approved_Full_ConfirmsAppointment() {
        PaymentTransaction fullTx = PaymentTransaction.builder()
                .id(2L)
                .appointment(mockAppointment)
                .paymentType(PaymentType.MERCADOPAGO)
                .paymentConcept(PaymentConcept.FULL)
                .amount(new BigDecimal("42000.00"))
                .status(PaymentStatus.PENDING)
                .mpPreferenceId("PREF-FULL-456")
                .build();

        Payment mpPayment = mock(Payment.class);
        when(mpPayment.getStatus()).thenReturn("approved");
        when(mpPayment.getExternalReference()).thenReturn("PREF-FULL-456");

        Map<String, Object> payload = Map.of(
                "type", "payment",
                "data", Map.of("id", "88")
        );

        when(mercadoPagoAdapter.getPaymentDetails(88L)).thenReturn(mpPayment);
        when(paymentTransactionRepository.findByMpPreferenceId("PREF-FULL-456"))
                .thenReturn(Optional.of(fullTx));

        paymentService.processMercadoPagoWebhook(payload);

        assertEquals(AppointmentStatus.CONFIRMED, mockAppointment.getStatus());
        assertEquals(PaymentStatus.APPROVED, fullTx.getStatus());
    }

    @Test
    @DisplayName("Webhook rejected debe marcar la cita como PAYMENT_FAILED")
    void testWebhook_Rejected_MarksPaymentFailed() {
        PaymentTransaction pendingTx = PaymentTransaction.builder()
                .id(3L)
                .appointment(mockAppointment)
                .paymentType(PaymentType.MERCADOPAGO)
                .paymentConcept(PaymentConcept.DEPOSIT)
                .amount(new BigDecimal("21000.00"))
                .status(PaymentStatus.PENDING)
                .mpPreferenceId("PREF-REJ-789")
                .build();

        Payment mpPayment = mock(Payment.class);
        when(mpPayment.getStatus()).thenReturn("rejected");
        when(mpPayment.getExternalReference()).thenReturn("PREF-REJ-789");

        Map<String, Object> payload = Map.of(
                "type", "payment",
                "data", Map.of("id", "77")
        );

        when(mercadoPagoAdapter.getPaymentDetails(77L)).thenReturn(mpPayment);
        when(paymentTransactionRepository.findByMpPreferenceId("PREF-REJ-789"))
                .thenReturn(Optional.of(pendingTx));

        paymentService.processMercadoPagoWebhook(payload);

        assertEquals(AppointmentStatus.PAYMENT_FAILED, mockAppointment.getStatus());
        assertEquals(PaymentStatus.REJECTED, pendingTx.getStatus());
    }

    @Test
    @DisplayName("Webhook con datos en query parameters debe procesarse igual")
    void testWebhook_QueryParams_Approved() {
        PaymentTransaction pendingTx = PaymentTransaction.builder()
                .id(4L)
                .appointment(mockAppointment)
                .paymentType(PaymentType.MERCADOPAGO)
                .paymentConcept(PaymentConcept.DEPOSIT)
                .amount(new BigDecimal("21000.00"))
                .status(PaymentStatus.PENDING)
                .mpPreferenceId("PREF-QP-321")
                .build();

        // MercadoPago puede notificar sin cuerpo JSON, pasando el recurso por la query string
        Map<String, String> queryParams = Map.of(
                "topic", "payment",
                "id", "987654321"
        );

        Payment mpPayment = mock(Payment.class);
        when(mpPayment.getStatus()).thenReturn("approved");
        when(mpPayment.getExternalReference()).thenReturn("PREF-QP-321");

        when(mercadoPagoAdapter.getPaymentDetails(987654321L)).thenReturn(mpPayment);
        when(paymentTransactionRepository.findByMpPreferenceId("PREF-QP-321"))
                .thenReturn(Optional.of(pendingTx));

        boolean processed = paymentService.processMercadoPagoWebhook(null, queryParams, null, null);

        assertTrue(processed);
        assertEquals(AppointmentStatus.CONFIRMED, mockAppointment.getStatus());
        assertEquals(PaymentStatus.APPROVED, pendingTx.getStatus());
        assertEquals("987654321", pendingTx.getMpPaymentId());
    }

    @Test
    @DisplayName("Webhook debe ser idempotente si la transacción ya fue APPROVED previamente")
    void testWebhook_AlreadyApproved_IsIdempotent() {
        PaymentTransaction approvedTx = PaymentTransaction.builder()
                .id(5L)
                .appointment(mockAppointment)
                .paymentType(PaymentType.MERCADOPAGO)
                .paymentConcept(PaymentConcept.DEPOSIT)
                .amount(new BigDecimal("21000.00"))
                .status(PaymentStatus.APPROVED)
                .mpPreferenceId("PREF-ALREADY-APPROVED")
                .build();

        Payment mpPayment = mock(Payment.class);
        when(mpPayment.getExternalReference()).thenReturn("PREF-ALREADY-APPROVED");

        Map<String, Object> payload = Map.of(
                "type", "payment",
                "data", Map.of("id", "66")
        );

        when(mercadoPagoAdapter.getPaymentDetails(66L)).thenReturn(mpPayment);
        when(paymentTransactionRepository.findByMpPreferenceId("PREF-ALREADY-APPROVED"))
                .thenReturn(Optional.of(approvedTx));

        boolean processed = paymentService.processMercadoPagoWebhook(payload);

        assertTrue(processed);
        // No se debe llamar a save si ya estaba aprobada
        verify(paymentTransactionRepository, never()).save(approvedTx);
    }

    @Test
    @DisplayName("Webhook in_process debe mantener la cita en reserva activa")
    void testWebhook_InProcess_MaintainsPendingAppointment() {
        PaymentTransaction pendingTx = PaymentTransaction.builder()
                .id(6L)
                .appointment(mockAppointment)
                .paymentType(PaymentType.MERCADOPAGO)
                .paymentConcept(PaymentConcept.DEPOSIT)
                .amount(new BigDecimal("21000.00"))
                .status(PaymentStatus.PENDING)
                .mpPreferenceId("PREF-IN-PROCESS")
                .build();

        Payment mpPayment = mock(Payment.class);
        when(mpPayment.getStatus()).thenReturn("in_process");
        when(mpPayment.getExternalReference()).thenReturn("PREF-IN-PROCESS");

        Map<String, Object> payload = Map.of(
                "type", "payment",
                "data", Map.of("id", "55")
        );

        when(mercadoPagoAdapter.getPaymentDetails(55L)).thenReturn(mpPayment);
        when(paymentTransactionRepository.findByMpPreferenceId("PREF-IN-PROCESS"))
                .thenReturn(Optional.of(pendingTx));

        boolean processed = paymentService.processMercadoPagoWebhook(payload);

        assertTrue(processed);
        assertEquals(AppointmentStatus.PENDING_PAYMENT, mockAppointment.getStatus());
        assertEquals("55", pendingTx.getMpPaymentId());
        verify(paymentTransactionRepository).save(pendingTx);
    }

    @Test
    @DisplayName("isValidSignature valida correctamente la firma HMAC SHA-256")
    void testIsValidSignature_SuccessAndFailure() throws Exception {
        String secret = "mi_secreto_super_seguro_mp";
        org.springframework.test.util.ReflectionTestUtils.setField(paymentService, "webhookSecret", secret);

        String dataId = "123456";
        String requestId = "req-abc-789";
        String ts = "1742505638000";

        // manifest: id:123456;request-id:req-abc-789;ts:1742505638000;
        String manifest = "id:" + dataId + ";request-id:" + requestId + ";ts:" + ts + ";";
        javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
        mac.init(new javax.crypto.spec.SecretKeySpec(secret.getBytes(), "HmacSHA256"));
        byte[] hash = mac.doFinal(manifest.getBytes());
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        String validV1 = hexString.toString();
        String validXSignature = "ts=" + ts + ",v1=" + validV1;

        // Firma válida
        assertTrue(paymentService.isValidSignature(validXSignature, requestId, dataId));

        // Firma alterada
        String invalidXSignature = "ts=" + ts + ",v1=invalidhash123456789";
        assertFalse(paymentService.isValidSignature(invalidXSignature, requestId, dataId));

        // Sin firma
        assertFalse(paymentService.isValidSignature(null, requestId, dataId));
    }

    @Test
    @DisplayName("refundPayment emite reembolso a través del adaptador y marca la transacción como REFUNDED")
    void testRefundPayment_Success() {
        PaymentTransaction tx = PaymentTransaction.builder()
                .id(7L)
                .paymentType(PaymentType.MERCADOPAGO)
                .mpPaymentId("99887766")
                .status(PaymentStatus.APPROVED)
                .build();

        paymentService.refundPayment(tx);

        assertEquals(PaymentStatus.REFUNDED, tx.getStatus());
        verify(mercadoPagoAdapter).refundPayment(99887766L);
        verify(paymentTransactionRepository).save(tx);
    }

    // ─── FINAL PAYMENT TESTS ─────────────────────────────────────────────────────

    @Test
    @DisplayName("registerFinalPayment delega en la estrategia correcta y completa la cita")
    void testRegisterFinalPayment_DelegatesToStrategy_CompletesAppointment() {
        mockAppointment.setStatus(AppointmentStatus.ATTENDED);

        FinalizePaymentRequestDTO request = FinalizePaymentRequestDTO.builder()
                .paymentType(PaymentType.CASH)
                .amount(new BigDecimal("21000.00"))
                .build();

        PaymentRegistrationStrategy mockStrategy = mock(PaymentRegistrationStrategy.class);
        when(paymentStrategyFactory.getStrategy(PaymentType.CASH)).thenReturn(mockStrategy);
        when(mockStrategy.register(any(), any(), any(), any(), any()))
                .thenReturn(mock(PaymentTransaction.class));
        when(appointmentRepository.findById(100L)).thenReturn(Optional.of(mockAppointment));
        when(userRepository.findById(3L)).thenReturn(Optional.of(mockReceptionist));

        paymentService.registerFinalPayment(100L, request, 3L);

        assertEquals(AppointmentStatus.COMPLETED, mockAppointment.getStatus());
        // Verifica que se delegó en la estrategia — no hay if/else en el servicio
        verify(paymentStrategyFactory).getStrategy(PaymentType.CASH);
        verify(mockStrategy).register(eq(mockAppointment), eq(new BigDecimal("21000.00")),
                eq(PaymentConcept.BALANCE), eq(mockReceptionist), isNull());
        verify(appointmentRepository).save(mockAppointment);
    }

    @Test
    @DisplayName("registerFinalPayment lanza excepción si la cita no está ATTENDED")
    void testRegisterFinalPayment_NotAttended_ThrowsException() {
        // mockAppointment ya está en PENDING_PAYMENT (setUp)
        FinalizePaymentRequestDTO request = FinalizePaymentRequestDTO.builder()
                .paymentType(PaymentType.CASH)
                .amount(new BigDecimal("21000.00"))
                .build();

        when(appointmentRepository.findById(100L)).thenReturn(Optional.of(mockAppointment));

        assertThrows(BusinessRuleException.class,
                () -> paymentService.registerFinalPayment(100L, request, 3L));
        verify(paymentStrategyFactory, never()).getStrategy(any());
    }

    // ─── REGISTRAR PAGO (SEÑA) TESTS ─────────────────────────────────────────────

    private void prepareHold(Instant createdAt) {
        mockAppointment.setCreatedAt(createdAt);
        mockAppointment.setService(DermatologicService.builder()
                .id(10L).name("Peeling").depositPercentage(50).basePrice(new BigDecimal("42000.00")).build());
        when(appointmentRepository.findById(100L)).thenReturn(Optional.of(mockAppointment));
    }

    private RegisterPaymentRequestDTO cash(String amount) {
        return RegisterPaymentRequestDTO.builder()
                .paymentType(PaymentType.CASH)
                .amount(new BigDecimal(amount))
                .build();
    }

    @Test
    @DisplayName("registerDepositPayment en efectivo confirma el turno con concepto DEPOSIT")
    void testRegisterDeposit_Cash_ConfirmsAppointment() {
        prepareHold(Instant.now().minus(2, ChronoUnit.MINUTES));
        PaymentTransaction pendingMp = PaymentTransaction.builder()
                .id(7L).appointment(mockAppointment).paymentType(PaymentType.MERCADOPAGO)
                .paymentConcept(PaymentConcept.DEPOSIT).status(PaymentStatus.PENDING).build();
        PaymentTransaction cashTx = PaymentTransaction.builder()
                .id(8L).paymentType(PaymentType.CASH).status(PaymentStatus.APPROVED).build();

        PaymentRegistrationStrategy cashStrategy = mock(PaymentRegistrationStrategy.class);
        when(paymentStrategyFactory.getStrategy(PaymentType.CASH)).thenReturn(cashStrategy);
        when(cashStrategy.register(any(), any(), any(), any(), any())).thenReturn(cashTx);
        when(userRepository.findById(3L)).thenReturn(Optional.of(mockReceptionist));
        when(paymentTransactionRepository.findByAppointmentId(100L)).thenReturn(List.of(pendingMp));

        PaymentReceiptDTO receipt = paymentService.registerDepositPayment(100L, cash("21000.00"), 3L);

        assertEquals(AppointmentStatus.CONFIRMED, mockAppointment.getStatus());
        assertEquals(PaymentConcept.DEPOSIT, receipt.getConcept());
        assertEquals(PaymentType.CASH, receipt.getPaymentType());
        assertEquals(new BigDecimal("21000.00"), receipt.getAmount());
        assertEquals(PaymentStatus.REJECTED, pendingMp.getStatus()); // el link de MP ya no se usa
        verify(cashStrategy).register(eq(mockAppointment), eq(new BigDecimal("21000.00")),
                eq(PaymentConcept.DEPOSIT), eq(mockReceptionist), isNull());
    }

    @Test
    @DisplayName("registerDepositPayment rechaza un monto menor a la seña (E-2) sin confirmar")
    void testRegisterDeposit_AmountBelowDeposit_Throws() {
        prepareHold(Instant.now().minus(1, ChronoUnit.MINUTES));

        assertThrows(BusinessRuleException.class,
                () -> paymentService.registerDepositPayment(100L, cash("100.00"), 3L));
        assertEquals(AppointmentStatus.PENDING_PAYMENT, mockAppointment.getStatus());
        verify(paymentStrategyFactory, never()).getStrategy(any());
    }

    @Test
    @DisplayName("registerDepositPayment con el bloqueo vencido cancela el turno y lanza excepción")
    void testRegisterDeposit_ExpiredHold_CancelsAppointment() {
        prepareHold(Instant.now().minus(11, ChronoUnit.MINUTES));

        assertThrows(BusinessRuleException.class,
                () -> paymentService.registerDepositPayment(100L, cash("21000.00"), 3L));
        assertEquals(AppointmentStatus.CANCELED, mockAppointment.getStatus());
        verify(appointmentRepository).save(mockAppointment);
        verify(paymentStrategyFactory, never()).getStrategy(any());
    }

    @Test
    @DisplayName("registerDepositPayment no acepta MercadoPago (se acredita por webhook)")
    void testRegisterDeposit_MercadoPago_Throws() {
        prepareHold(Instant.now());
        RegisterPaymentRequestDTO request = RegisterPaymentRequestDTO.builder()
                .paymentType(PaymentType.MERCADOPAGO).amount(new BigDecimal("21000.00")).build();

        assertThrows(BusinessRuleException.class,
                () -> paymentService.registerDepositPayment(100L, request, 3L));
        assertEquals(AppointmentStatus.PENDING_PAYMENT, mockAppointment.getStatus());
    }

    // ─── STRATEGY FACTORY TESTS ──────────────────────────────────────────────────

    @Test
    @DisplayName("PaymentStrategyFactory.getStrategy debe retornar excepción para tipo no registrado")
    void testStrategyFactory_UnknownType_ThrowsException() {
        // Crear factory con lista vacía (sin estrategias registradas)
        PaymentStrategyFactory emptyFactory = new PaymentStrategyFactory(List.of());
        assertThrows(com.clinicadermatologica.app.domain.exception.BusinessRuleException.class,
                () -> emptyFactory.getStrategy(PaymentType.CASH));
    }

    @Test
    @DisplayName("PaymentStrategyFactory debe retornar la estrategia correcta por PaymentType")
    void testStrategyFactory_ReturnsCorrectStrategy() {
        PaymentRegistrationStrategy cashStrategy = mock(PaymentRegistrationStrategy.class);
        when(cashStrategy.supportedType()).thenReturn(PaymentType.CASH);

        PaymentRegistrationStrategy mpStrategy = mock(PaymentRegistrationStrategy.class);
        when(mpStrategy.supportedType()).thenReturn(PaymentType.MERCADOPAGO);

        PaymentStrategyFactory factory = new PaymentStrategyFactory(List.of(cashStrategy, mpStrategy));

        assertSame(cashStrategy, factory.getStrategy(PaymentType.CASH));
        assertSame(mpStrategy, factory.getStrategy(PaymentType.MERCADOPAGO));
    }
}

