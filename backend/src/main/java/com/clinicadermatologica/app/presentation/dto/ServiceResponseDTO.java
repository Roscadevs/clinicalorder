package com.clinicadermatologica.app.presentation.dto;

import lombok.*; // Generadores Lombok

import java.math.BigDecimal; // Precisión decimal

/**
 * DTO de respuesta con los datos de un servicio del catálogo.
 */
@Getter // Genera getters
@Setter // Genera setters
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
public class ServiceResponseDTO {
    private Long id;
    private String name;
    private String description;
    private Integer durationMinutes;
    private BigDecimal basePrice;
    private BigDecimal depositPercentage;
    private Integer followUpIntervalDays;
    private Boolean active;
}
