package com.clinicadermatologica.app.presentation.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.jackson.Jacksonized;

import java.math.BigDecimal;

/**
 * DTO inmutable que representa la posición de un tratamiento en el ranking de demanda y facturación.
 */
@Getter
@Builder
@Jacksonized
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class TreatmentRankingDTO {

    @JsonAlias("serviceName")
    private String name;

    @JsonAlias("appointmentsCount")
    private Long count;

    private Integer percentage;
    private BigDecimal revenue;

    @JsonIgnore
    public String getServiceName() {
        return name;
    }

    @JsonIgnore
    public Long getAppointmentsCount() {
        return count;
    }
}
