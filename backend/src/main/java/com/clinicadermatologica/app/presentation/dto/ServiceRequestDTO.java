package com.clinicadermatologica.app.presentation.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * DTO para la creación o actualización de un servicio dermatológico/estético.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceRequestDTO {

    @NotBlank(message = "El nombre del servicio es obligatorio")
    @Size(max = 100, message = "Máximo 100 caracteres")
    private String name;

    @Size(max = 500, message = "Máximo 500 caracteres")
    private String description;

    @NotNull(message = "La duración en minutos es obligatoria")
    @Min(value = 10, message = "La duración mínima es de 10 minutos")
    @Max(value = 480, message = "La duración máxima es de 480 minutos")
    private Integer durationMinutes;

    @NotNull(message = "El precio base es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a cero")
    private BigDecimal basePrice;

    @NotNull(message = "El porcentaje de seña es obligatorio")
    @Min(value = 1, message = "El porcentaje mínimo de seña es 1")
    @Max(value = 100, message = "El porcentaje máximo de seña es 100")
    private Integer depositPercentage;

    @NotNull(message = "El intervalo de seguimiento es obligatorio")
    @Min(value = 0, message = "El intervalo de seguimiento no puede ser negativo")
    private Integer followUpIntervalDays; // 0 = sin seguimiento recomendado

    private Boolean active;
}
