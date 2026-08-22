package com.clinicadermatologica.app.presentation.dto;

import jakarta.validation.constraints.NotBlank; // Valida no blanco
import lombok.*; // Generadores Lombok

import java.util.List; // Lista de mensajes de historial

/**
 * DTO para enviar una consulta al Chatbot asistido por Google Gemini en el Landing público.
 */
@Getter // Genera getters
@Setter // Genera setters
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
public class GeminiChatRequestDTO {

    @NotBlank(message = "El mensaje del usuario no puede estar vacío")
    private String message; // Pregunta del paciente (ej. '¿Cuánto sale el peeling y qué cuidados requiere?')

    private List<ChatMessageItemDTO> history; // Historial previo de la conversación para contexto

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChatMessageItemDTO {
        private String role; // 'user' o 'model'
        private String text; // Contenido del mensaje
    }
}
