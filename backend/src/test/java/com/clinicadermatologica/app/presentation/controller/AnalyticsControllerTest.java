package com.clinicadermatologica.app.presentation.controller;

import com.clinicadermatologica.app.application.service.AnalyticsService;
import com.clinicadermatologica.app.presentation.dto.AnalyticsKpisResponseDTO;
import com.clinicadermatologica.app.presentation.dto.TreatmentRankingDTO;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Suite de pruebas unitarias para AnalyticsController.
 * Verifica delegación exitosa a AnalyticsService, códigos de respuesta HTTP 200 y manejo de DTO consolidado.
 */
@ExtendWith(MockitoExtension.class)
class AnalyticsControllerTest {

    @Mock
    private AnalyticsService analyticsService;

    @InjectMocks
    private AnalyticsController controller;

    @Test
    @DisplayName("getKpis debe delegar en analyticsService y retornar HTTP 200 con el DTO de métricas")
    void getKpisShouldDelegateToServiceAndReturnOk() {
        AnalyticsKpisResponseDTO mockDto = AnalyticsKpisResponseDTO.builder()
                .financial(AnalyticsKpisResponseDTO.FinancialKpis.builder()
                        .totalRevenue(new BigDecimal("5840000.00"))
                        .onlineDepositRevenue(new BigDecimal("2920000.00"))
                        .counterBalanceRevenue(new BigDecimal("2920000.00"))
                        .growthVsPreviousMonth(24.5)
                        .build())
                .operational(AnalyticsKpisResponseDTO.OperationalKpis.builder()
                        .totalAppointments(142L)
                        .completedAppointments(136L)
                        .attendedAppointments(0L)
                        .noShowAppointments(6L)
                        .attendanceRate(95.8)
                        .noShowRate(4.2)
                        .build())
                .aiAssistant(AnalyticsKpisResponseDTO.AiAssistantKpis.builder()
                        .totalInquiries(389L)
                        .convertedToBooking(250L)
                        .conversionRate(64.2)
                        .build())
                .treatmentRankings(List.of(
                        TreatmentRankingDTO.builder()
                                .name("Peeling Químico")
                                .count(48L)
                                .percentage(85)
                                .revenue(new BigDecimal("2016000.00"))
                                .build()
                ))
                .period("Octubre 2026 (Tiempo Real)")
                .build();

        when(analyticsService.getKpis()).thenReturn(mockDto);

        ResponseEntity<AnalyticsKpisResponseDTO> response = controller.getKpis();

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockDto, response.getBody());
        assertEquals(new BigDecimal("5840000.00"), response.getBody().getFinancial().getTotalRevenue());
        assertEquals(95.8, response.getBody().getOperational().getAttendanceRate());
        assertEquals(1, response.getBody().getTreatmentRankings().size());

        verify(analyticsService, times(1)).getKpis();
    }

    @Test
    @DisplayName("getKpis debe propagar excepción si analyticsService falla para que GlobalExceptionHandler genere RFC 7807")
    void getKpisShouldPropagateServiceException() {
        when(analyticsService.getKpis()).thenThrow(new IllegalStateException("Falla de base de datos"));

        IllegalStateException ex = assertThrows(IllegalStateException.class, () -> controller.getKpis());
        assertEquals("Falla de base de datos", ex.getMessage());

        verify(analyticsService, times(1)).getKpis();
    }

    @Test
    @DisplayName("AnalyticsKpisResponseDTO y TreatmentRankingDTO deben ser serializables y deserializables con Jackson")
    void testDtoJacksonSerializationAndDeserialization() throws Exception {
        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();

        TreatmentRankingDTO ranking = TreatmentRankingDTO.builder()
                .name("Toxina Botulínica")
                .count(35L)
                .percentage(70)
                .revenue(new BigDecimal("1500000.00"))
                .build();

        AnalyticsKpisResponseDTO dto = AnalyticsKpisResponseDTO.builder()
                .financial(AnalyticsKpisResponseDTO.FinancialKpis.builder()
                        .totalRevenue(new BigDecimal("2000000.00"))
                        .onlineDepositRevenue(new BigDecimal("1000000.00"))
                        .counterBalanceRevenue(new BigDecimal("1000000.00"))
                        .growthVsPreviousMonth(15.0)
                        .build())
                .operational(AnalyticsKpisResponseDTO.OperationalKpis.builder()
                        .totalAppointments(50L)
                        .completedAppointments(45L)
                        .attendedAppointments(0L)
                        .noShowAppointments(5L)
                        .attendanceRate(90.0)
                        .noShowRate(10.0)
                        .build())
                .aiAssistant(AnalyticsKpisResponseDTO.AiAssistantKpis.builder()
                        .totalInquiries(100L)
                        .convertedToBooking(60L)
                        .conversionRate(60.0)
                        .build())
                .treatmentRankings(List.of(ranking))
                .period("Octubre 2026")
                .build();

        String json = mapper.writeValueAsString(dto);
        assertNotNull(json);
        assertTrue(json.contains("\"totalRevenue\":2000000.00"));
        assertTrue(json.contains("\"name\":\"Toxina Botulínica\""));

        AnalyticsKpisResponseDTO deserialized = mapper.readValue(json, AnalyticsKpisResponseDTO.class);
        assertNotNull(deserialized);
        assertEquals(new BigDecimal("2000000.00"), deserialized.getFinancial().getTotalRevenue());
        assertEquals(1, deserialized.getTreatmentRankings().size());
        assertEquals("Toxina Botulínica", deserialized.getTreatmentRankings().get(0).getName());
        assertEquals(35L, deserialized.getTreatmentRankings().get(0).getCount());
    }
}
