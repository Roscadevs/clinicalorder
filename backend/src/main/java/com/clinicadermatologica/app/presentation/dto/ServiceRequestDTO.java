package com.clinicadermatologica.app.presentation.dto;

import jakarta.validation.constraints.*; // Importa validaciones estándar
import lombok.*; // Generadores Lombok

import java.math.BigDecimal; // Precisión decimal

/**
 * DTO para la creación o actualización de un servicio dermatológico/estético.
 */
@Getter // Genera getters
@Setter // Genera setters
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
public class ServiceRequestDTO {

    @NotBlank(message = "El nombre del servicio es obligatorio")
    @Size(max = 100, message = "Máximo 100 caracteres")
    private String name;

    @Size(max = 500, message = "Máximo 500 caracteres")
    private String description;

    @NotNull(message = "La duración en minutos es obligatoria")
    @Min(value = 15, message = "La duración mínima es de 15 minutos")
    @Max(value = 240, message = "La duración máxima es de 240 minutos")
    private Integer durationMinutes;

    @NotNull(message = "El precio base es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a cero")
    private BigDecimal basePrice;

    @NotNull(message = "El porcentaje de seña es obligatorio")
    @DecimalMin(value = "0.00", message = "El porcentaje mínimo es 0")
    @DecimalMax(value = "100.00", message = "El porcentaje máximo es 100")
    private BigDecimal depositPercentage;

    private Integer followUpIntervalDays; // Intervalo de control recomendado (opcional)
    private Boolean active; // Estado activo (opcional)
}
