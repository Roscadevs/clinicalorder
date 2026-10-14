package com.clinicadermatologica.app.application;

import com.clinicadermatologica.app.application.service.AnalyticsService;
import com.clinicadermatologica.app.domain.model.*;
import com.clinicadermatologica.app.infrastructure.persistence.dao.AppointmentDAO;
import com.clinicadermatologica.app.infrastructure.persistence.dao.PaymentTransactionDAO;
import com.clinicadermatologica.app.presentation.dto.AnalyticsKpisResponseDTO;
import com.clinicadermatologica.app.presentation.dto.TreatmentRankingDTO;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

/**
 * Suite de pruebas unitarias para AnalyticsService.
 * Verifica cálculos financieros, desglose de canales de recaudación,
 * prevención de división por cero en tasa de asistencia,
 * ordenamiento del ranking de tratamientos y contingencia en base de datos limpia.
 */
@ExtendWith(MockitoExtension.class)
public class AnalyticsServiceTest {

    @Mock
    private PaymentTransactionDAO paymentTransactionRepository;

    @Mock
    private AppointmentDAO appointmentRepository;

    @InjectMocks
    private AnalyticsService analyticsService;

    @Test
    @DisplayName("Debe retornar datos de contingencia coherentes cuando la base de datos se encuentra limpia")
    void shouldReturnCoherentSeedKpisWhenDatabaseIsEmpty() {
        when(paymentTransactionRepository.findByStatus(PaymentStatus.APPROVED)).thenReturn(Collections.emptyList());
        when(appointmentRepository.findAll()).thenReturn(Collections.emptyList());

        AnalyticsKpisResponseDTO response = analyticsService.getKpis();

        assertNotNull(response);
        assertNotNull(response.getFinancial());
        assertEquals(new BigDecimal("5840000.00"), response.getFinancial().getTotalRevenue());
        assertEquals(new BigDecimal("2920000.00"), response.getFinancial().getOnlineDepositRevenue());
        assertEquals(new BigDecimal("2920000.00"), response.getFinancial().getCounterBalanceRevenue());
        assertEquals(24.5, response.getFinancial().getGrowthVsPreviousMonth());

        assertNotNull(response.getOperational());
        assertEquals(142L, response.getOperational().getTotalAppointments());
        assertEquals(136L, response.getOperational().getCompletedAppointments());
        assertEquals(0L, response.getOperational().getAttendedAppointments());
        assertEquals(6L, response.getOperational().getNoShowAppointments());
        assertEquals(95.8, response.getOperational().getAttendanceRate());
        assertEquals(4.2, response.getOperational().getNoShowRate());

        assertNotNull(response.getAiAssistant());
        assertEquals(389L, response.getAiAssistant().getTotalInquiries());
        assertEquals(250L, response.getAiAssistant().getConvertedToBooking());
        assertEquals(64.2, response.getAiAssistant().getConversionRate());

        assertNotNull(response.getTreatmentRankings());
        assertEquals(5, response.getTreatmentRankings().size());
        assertEquals("Peeling Químico Facial (Ácido Mandélico + Retinol)", response.getTreatmentRankings().get(0).getName());
        assertNotNull(response.getPeriod());
    }

    @Test
    @DisplayName("Debe calcular métricas financieras y operativas dinámicas con transacciones y citas reales")
    void shouldCalculateAccurateKpisWithRealData() {
        DermatologicService servicePeeling = DermatologicService.builder()
                .id(1L)
                .name("Peeling Químico")
                .basePrice(new BigDecimal("20000.00"))
                .build();

        DermatologicService serviceLimpieza = DermatologicService.builder()
                .id(2L)
                .name("Limpieza Facial")
                .basePrice(new BigDecimal("15000.00"))
                .build();

        Appointment appt1 = Appointment.builder()
                .id(1L)
                .service(servicePeeling)
                .status(AppointmentStatus.ATTENDED)
                .agreedPrice(new BigDecimal("20000.00"))
                .startTime(Instant.now())
                .endTime(Instant.now().plusSeconds(3600))
                .build();

        Appointment appt2 = Appointment.builder()
                .id(2L)
                .service(servicePeeling)
                .status(AppointmentStatus.COMPLETED)
                .agreedPrice(new BigDecimal("20000.00"))
                .startTime(Instant.now())
                .endTime(Instant.now().plusSeconds(3600))
                .build();

        Appointment appt3 = Appointment.builder()
                .id(3L)
                .service(serviceLimpieza)
                .status(AppointmentStatus.COMPLETED)
                .agreedPrice(new BigDecimal("15000.00"))
                .startTime(Instant.now())
                .endTime(Instant.now().plusSeconds(3600))
                .build();

        Appointment appt4 = Appointment.builder()
                .id(4L)
                .service(serviceLimpieza)
                .status(AppointmentStatus.NO_SHOW)
                .agreedPrice(new BigDecimal("15000.00"))
                .startTime(Instant.now())
                .endTime(Instant.now().plusSeconds(3600))
                .build();

        List<Appointment> appointments = List.of(appt1, appt2, appt3, appt4);

        PaymentTransaction tx1 = PaymentTransaction.builder()
                .id(101L)
                .amount(new BigDecimal("20000.00"))
                .paymentType(PaymentType.MERCADOPAGO)
                .paymentConcept(PaymentConcept.DEPOSIT)
                .status(PaymentStatus.APPROVED)
                .build();

        PaymentTransaction tx2 = PaymentTransaction.builder()
                .id(102L)
                .amount(new BigDecimal("30000.00"))
                .paymentType(PaymentType.CASH)
                .paymentConcept(PaymentConcept.BALANCE)
                .status(PaymentStatus.APPROVED)
                .build();

        PaymentTransaction tx3 = PaymentTransaction.builder()
                .id(103L)
                .amount(new BigDecimal("10000.00"))
                .paymentType(PaymentType.BANK_TRANSFER)
                .paymentConcept(PaymentConcept.BALANCE)
                .status(PaymentStatus.APPROVED)
                .build();

        List<PaymentTransaction> transactions = List.of(tx1, tx2, tx3);

        when(paymentTransactionRepository.findByStatus(PaymentStatus.APPROVED)).thenReturn(transactions);
        when(appointmentRepository.findAll()).thenReturn(appointments);

        AnalyticsKpisResponseDTO response = analyticsService.getKpis();

        assertNotNull(response);

        // Financiero: Total = 60000, Señas MP = 20000, Mostrador = 40000
        assertEquals(new BigDecimal("60000.00"), response.getFinancial().getTotalRevenue());
        assertEquals(new BigDecimal("20000.00"), response.getFinancial().getOnlineDepositRevenue());
        assertEquals(new BigDecimal("40000.00"), response.getFinancial().getCounterBalanceRevenue());

        // Operativo: Total = 4, Attended = 1, Completed = 2, NoShow = 1
        assertEquals(4L, response.getOperational().getTotalAppointments());
        assertEquals(1L, response.getOperational().getAttendedAppointments());
        assertEquals(2L, response.getOperational().getCompletedAppointments());
        assertEquals(1L, response.getOperational().getNoShowAppointments());

        // Tasa Asistencia: (1 + 2) / (1 + 2 + 1) = 3 / 4 = 75.0%
        assertEquals(75.0, response.getOperational().getAttendanceRate());
        assertEquals(25.0, response.getOperational().getNoShowRate());

        // Ranking: Peeling Químico (2 turnos, $40000) debe estar primero
        List<TreatmentRankingDTO> rankings = response.getTreatmentRankings();
        assertFalse(rankings.isEmpty());
        assertEquals("Peeling Químico", rankings.get(0).getName());
        assertEquals(2L, rankings.get(0).getCount());
        assertEquals(new BigDecimal("40000.00"), rankings.get(0).getRevenue());
        assertEquals(100, rankings.get(0).getPercentage());
    }

    @Test
    @DisplayName("Debe prevenir división por cero cuando no existen citas cerradas y devolver tasa del 100%")
    void shouldSafelyHandleDivisionByZeroWhenNoClosedAppointments() {
        Appointment confirmedAppt = Appointment.builder()
                .id(1L)
                .status(AppointmentStatus.CONFIRMED)
                .agreedPrice(new BigDecimal("35000.00"))
                .build();

        PaymentTransaction tx = PaymentTransaction.builder()
                .id(10L)
                .amount(new BigDecimal("17500.00"))
                .paymentType(PaymentType.MERCADOPAGO)
                .paymentConcept(PaymentConcept.DEPOSIT)
                .status(PaymentStatus.APPROVED)
                .build();

        when(paymentTransactionRepository.findByStatus(PaymentStatus.APPROVED)).thenReturn(List.of(tx));
        when(appointmentRepository.findAll()).thenReturn(List.of(confirmedAppt));

        AnalyticsKpisResponseDTO response = analyticsService.getKpis();

        assertNotNull(response);
        assertEquals(100.0, response.getOperational().getAttendanceRate());
        assertEquals(0.0, response.getOperational().getNoShowRate());
        assertEquals(1L, response.getOperational().getTotalAppointments());
        assertEquals(0L, response.getOperational().getCompletedAppointments());
        assertEquals(0L, response.getOperational().getAttendedAppointments());
        assertEquals(0L, response.getOperational().getNoShowAppointments());
    }

    @Test
    @DisplayName("Debe clasificar correctamente el desglose de canales para señas online vs mostrador")
    void shouldCorrectlyDifferentiateChannels() {
        PaymentTransaction mpDeposit = PaymentTransaction.builder()
                .id(1L).amount(new BigDecimal("15000.00"))
                .paymentType(PaymentType.MERCADOPAGO).paymentConcept(PaymentConcept.DEPOSIT)
                .status(PaymentStatus.APPROVED).build();

        PaymentTransaction mpFull = PaymentTransaction.builder()
                .id(2L).amount(new BigDecimal("25000.00"))
                .paymentType(PaymentType.MERCADOPAGO).paymentConcept(PaymentConcept.FULL)
                .status(PaymentStatus.APPROVED).build();

        PaymentTransaction cashBalance = PaymentTransaction.builder()
                .id(3L).amount(new BigDecimal("10000.00"))
                .paymentType(PaymentType.CASH).paymentConcept(PaymentConcept.BALANCE)
                .status(PaymentStatus.APPROVED).build();

        PaymentTransaction cashDeposit = PaymentTransaction.builder()
                .id(4L).amount(new BigDecimal("5000.00"))
                .paymentType(PaymentType.CASH).paymentConcept(PaymentConcept.DEPOSIT)
                .status(PaymentStatus.APPROVED).build();

        when(paymentTransactionRepository.findByStatus(PaymentStatus.APPROVED))
                .thenReturn(List.of(mpDeposit, mpFull, cashBalance, cashDeposit));
        when(appointmentRepository.findAll()).thenReturn(Collections.emptyList());

        AnalyticsKpisResponseDTO response = analyticsService.getKpis();

        assertNotNull(response);
        assertEquals(new BigDecimal("55000.00"), response.getFinancial().getTotalRevenue());
        assertEquals(new BigDecimal("40000.00"), response.getFinancial().getOnlineDepositRevenue());
        assertEquals(new BigDecimal("15000.00"), response.getFinancial().getCounterBalanceRevenue());
    }

    @Test
    @DisplayName("Debe ordenar los tratamientos descendentemente por cantidad y facturación acumulada")
    void shouldOrderTreatmentsDescendingByVolumeAndRevenue() {
        DermatologicService s1 = DermatologicService.builder().id(1L).name("Botox").basePrice(new BigDecimal("120000.00")).build();
        DermatologicService s2 = DermatologicService.builder().id(2L).name("Hialurónico").basePrice(new BigDecimal("150000.00")).build();
        DermatologicService s3 = DermatologicService.builder().id(3L).name("Limpieza").basePrice(new BigDecimal("35000.00")).build();

        // 3 citas de Botox
        Appointment a1 = Appointment.builder().id(1L).service(s1).status(AppointmentStatus.COMPLETED).agreedPrice(new BigDecimal("120000.00")).build();
        Appointment a2 = Appointment.builder().id(2L).service(s1).status(AppointmentStatus.COMPLETED).agreedPrice(new BigDecimal("120000.00")).build();
        Appointment a3 = Appointment.builder().id(3L).service(s1).status(AppointmentStatus.ATTENDED).agreedPrice(new BigDecimal("120000.00")).build();

        // 5 citas de Hialurónico
        Appointment a4 = Appointment.builder().id(4L).service(s2).status(AppointmentStatus.COMPLETED).agreedPrice(new BigDecimal("150000.00")).build();
        Appointment a5 = Appointment.builder().id(5L).service(s2).status(AppointmentStatus.COMPLETED).agreedPrice(new BigDecimal("150000.00")).build();
        Appointment a6 = Appointment.builder().id(6L).service(s2).status(AppointmentStatus.COMPLETED).agreedPrice(new BigDecimal("150000.00")).build();
        Appointment a7 = Appointment.builder().id(7L).service(s2).status(AppointmentStatus.COMPLETED).agreedPrice(new BigDecimal("150000.00")).build();
        Appointment a8 = Appointment.builder().id(8L).service(s2).status(AppointmentStatus.ATTENDED).agreedPrice(new BigDecimal("150000.00")).build();

        // 1 cita de Limpieza
        Appointment a9 = Appointment.builder().id(9L).service(s3).status(AppointmentStatus.COMPLETED).agreedPrice(new BigDecimal("35000.00")).build();

        PaymentTransaction tx = PaymentTransaction.builder()
                .id(100L).amount(new BigDecimal("1145000.00"))
                .paymentType(PaymentType.CASH).paymentConcept(PaymentConcept.BALANCE)
                .status(PaymentStatus.APPROVED).build();

        when(paymentTransactionRepository.findByStatus(PaymentStatus.APPROVED)).thenReturn(List.of(tx));
        when(appointmentRepository.findAll()).thenReturn(List.of(a1, a2, a3, a4, a5, a6, a7, a8, a9));

        AnalyticsKpisResponseDTO response = analyticsService.getKpis();

        List<TreatmentRankingDTO> rankings = response.getTreatmentRankings();
        assertEquals(3, rankings.size());

        // Hialurónico tiene 5 citas -> #1 con 100% de barra
        assertEquals("Hialurónico", rankings.get(0).getName());
        assertEquals(5L, rankings.get(0).getCount());
        assertEquals(new BigDecimal("750000.00"), rankings.get(0).getRevenue());
        assertEquals(100, rankings.get(0).getPercentage());

        // Botox tiene 3 citas -> #2 con 60% de barra (3/5 = 60%)
        assertEquals("Botox", rankings.get(1).getName());
        assertEquals(3L, rankings.get(1).getCount());
        assertEquals(new BigDecimal("360000.00"), rankings.get(1).getRevenue());
        assertEquals(60, rankings.get(1).getPercentage());

        // Limpieza tiene 1 cita -> #3 con 20% de barra (1/5 = 20%)
        assertEquals("Limpieza", rankings.get(2).getName());
        assertEquals(1L, rankings.get(2).getCount());
        assertEquals(new BigDecimal("35000.00"), rankings.get(2).getRevenue());
        assertEquals(20, rankings.get(2).getPercentage());
    }

    @Test
    @DisplayName("Debe manejar listas con elementos nulos o nulos de repositorio sin lanzar NullPointerException")
    void shouldHandleNullListsAndNullEntitiesWithoutThrowingNpe() {
        java.util.List<PaymentTransaction> txListWithNulls = new java.util.ArrayList<>();
        txListWithNulls.add(null);
        txListWithNulls.add(PaymentTransaction.builder()
                .id(1L)
                .amount(new BigDecimal("10000.00"))
                .paymentType(PaymentType.MERCADOPAGO)
                .paymentConcept(PaymentConcept.DEPOSIT)
                .status(PaymentStatus.APPROVED)
                .build());
        txListWithNulls.add(null);

        java.util.List<Appointment> apptListWithNulls = new java.util.ArrayList<>();
        apptListWithNulls.add(null);
        apptListWithNulls.add(Appointment.builder()
                .id(1L)
                .status(AppointmentStatus.COMPLETED)
                .agreedPrice(new BigDecimal("10000.00"))
                .build());
        apptListWithNulls.add(null);

        when(paymentTransactionRepository.findByStatus(PaymentStatus.APPROVED)).thenReturn(txListWithNulls);
        when(appointmentRepository.findAll()).thenReturn(apptListWithNulls);

        AnalyticsKpisResponseDTO response = analyticsService.getKpis();

        assertNotNull(response);
        assertEquals(new BigDecimal("10000.00"), response.getFinancial().getTotalRevenue());
        assertEquals(1L, response.getOperational().getTotalAppointments());
        assertEquals(100.0, response.getOperational().getAttendanceRate());
    }

    @Test
    @DisplayName("Debe ignorar citas canceladas para el ranking de tratamientos y retornar contingencia limpia")
    void shouldExcludeCanceledAndPendingAppointmentsFromTreatmentRankings() {
        DermatologicService service = DermatologicService.builder()
                .id(1L).name("Tratamiento Cancelado").basePrice(new BigDecimal("50000.00")).build();

        Appointment canceled1 = Appointment.builder()
                .id(1L).service(service).status(AppointmentStatus.CANCELED).agreedPrice(new BigDecimal("50000.00")).build();
        Appointment canceled2 = Appointment.builder()
                .id(2L).service(service).status(AppointmentStatus.CANCELED).agreedPrice(new BigDecimal("50000.00")).build();

        when(paymentTransactionRepository.findByStatus(PaymentStatus.APPROVED)).thenReturn(Collections.emptyList());
        when(appointmentRepository.findAll()).thenReturn(List.of(canceled1, canceled2));

        AnalyticsKpisResponseDTO response = analyticsService.getKpis();

        assertNotNull(response);
        assertEquals(2L, response.getOperational().getTotalAppointments());
        assertEquals(0L, response.getOperational().getCompletedAppointments());
        assertEquals(0L, response.getOperational().getAttendedAppointments());
        assertEquals(0L, response.getOperational().getNoShowAppointments());
        assertEquals(100.0, response.getOperational().getAttendanceRate());

        // Al no haber citas CONFIRMED/ATTENDED/COMPLETED, no debe inventar ingresos del servicio cancelado
        List<TreatmentRankingDTO> rankings = response.getTreatmentRankings();
        assertFalse(rankings.isEmpty());
        assertFalse(rankings.stream().anyMatch(r -> "Tratamiento Cancelado".equals(r.getName())));
    }

    @Test
    @DisplayName("Debe computar recaudación correctamente cuando hay transacciones aprobadas pero citas está vacío")
    void shouldCalculateRevenueWhenAppointmentsAreEmpty() {
        PaymentTransaction tx = PaymentTransaction.builder()
                .id(1L).amount(new BigDecimal("25000.00"))
                .paymentType(PaymentType.MERCADOPAGO).paymentConcept(PaymentConcept.DEPOSIT)
                .status(PaymentStatus.APPROVED).build();

        when(paymentTransactionRepository.findByStatus(PaymentStatus.APPROVED)).thenReturn(List.of(tx));
        when(appointmentRepository.findAll()).thenReturn(Collections.emptyList());

        AnalyticsKpisResponseDTO response = analyticsService.getKpis();

        assertNotNull(response);
        assertEquals(new BigDecimal("25000.00"), response.getFinancial().getTotalRevenue());
        assertEquals(new BigDecimal("25000.00"), response.getFinancial().getOnlineDepositRevenue());
        assertEquals(BigDecimal.ZERO.setScale(2), response.getFinancial().getCounterBalanceRevenue());
        assertEquals(0L, response.getOperational().getTotalAppointments());
        assertEquals(100.0, response.getOperational().getAttendanceRate());
        assertFalse(response.getTreatmentRankings().isEmpty());
    }

    @Test
    @DisplayName("Debe computar turnos con facturación cero cuando hay citas pero no hay transacciones aprobadas")
    void shouldCalculateAppointmentsWhenTransactionsAreEmpty() {
        DermatologicService service = DermatologicService.builder()
                .id(1L).name("Consulta").basePrice(new BigDecimal("15000.00")).build();

        Appointment appt = Appointment.builder()
                .id(1L).service(service).status(AppointmentStatus.COMPLETED)
                .agreedPrice(new BigDecimal("15000.00")).build();

        when(paymentTransactionRepository.findByStatus(PaymentStatus.APPROVED)).thenReturn(Collections.emptyList());
        when(appointmentRepository.findAll()).thenReturn(List.of(appt));

        AnalyticsKpisResponseDTO response = analyticsService.getKpis();

        assertNotNull(response);
        assertEquals(BigDecimal.ZERO.setScale(2), response.getFinancial().getTotalRevenue());
        assertEquals(1L, response.getOperational().getTotalAppointments());
        assertEquals(1L, response.getOperational().getCompletedAppointments());
        assertEquals(100.0, response.getOperational().getAttendanceRate());
        assertEquals(1, response.getTreatmentRankings().size());
        assertEquals("Consulta", response.getTreatmentRankings().get(0).getName());
    }
}
