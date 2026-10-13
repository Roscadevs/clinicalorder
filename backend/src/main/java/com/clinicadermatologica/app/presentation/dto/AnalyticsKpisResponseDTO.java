package com.clinicadermatologica.app.presentation.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.jackson.Jacksonized;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO inmutable consolidado que representa los indicadores clave de rendimiento (KPIs)
 * clínicos, financieros y operativos para el dashboard directivo.
 */
@Getter
@Builder
@Jacksonized
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AnalyticsKpisResponseDTO {

    private FinancialKpis financial;
    private OperationalKpis operational;
    private AiAssistantKpis aiAssistant;
    private List<TreatmentRankingDTO> treatmentRankings;
    private String period;

    @Getter
    @Builder
    @Jacksonized
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class FinancialKpis {
        private BigDecimal totalRevenue;
        private BigDecimal onlineDepositRevenue;
        private BigDecimal counterBalanceRevenue;
        private Double growthVsPreviousMonth;
    }

    @Getter
    @Builder
    @Jacksonized
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class OperationalKpis {
        private Long totalAppointments;
        private Long completedAppointments;
        private Long attendedAppointments;
        private Long noShowAppointments;
        private Double attendanceRate;
        private Double noShowRate;
    }

    @Getter
    @Builder
    @Jacksonized
    @AllArgsConstructor
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AiAssistantKpis {
        private Long totalInquiries;
        private Long convertedToBooking;
        private Double conversionRate;
    }
}
