package com.clinicadermatologica.app.presentation.dto;

import lombok.*;

import java.math.BigDecimal;

/**
 * DTO de respuesta con los datos de un servicio del catálogo.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceResponseDTO {
    private Long id;
    private String name;
    private String description;
    private Integer durationMinutes;
    private BigDecimal basePrice;
    private Integer depositPercentage;
    private Integer followUpIntervalDays;
    private Boolean active;
}
