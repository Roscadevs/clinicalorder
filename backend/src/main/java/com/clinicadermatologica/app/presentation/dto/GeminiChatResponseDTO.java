package com.clinicadermatologica.app.presentation.dto;

import lombok.*; // Generadores Lombok

import java.util.List; // Lista de sugerencias

/**
 * DTO con la respuesta generada por Gemini API y sugerencias de acción para el paciente.
 */
@Getter // Genera getters
@Setter // Genera setters
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
public class GeminiChatResponseDTO {
    private String reply; // Respuesta médica-estética en lenguaje claro y empático
    private List<String> suggestedServices; // Servicios recomendados detectados en la consulta
    private String bookingActionUrl; // Enlace directo con preselección de servicio para agendar
}
