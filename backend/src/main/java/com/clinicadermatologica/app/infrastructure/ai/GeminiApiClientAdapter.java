package com.clinicadermatologica.app.infrastructure.ai;

import com.clinicadermatologica.app.presentation.dto.GeminiChatRequestDTO; // DTO de entrada
import com.clinicadermatologica.app.presentation.dto.GeminiChatResponseDTO; // DTO de respuesta
import lombok.extern.slf4j.Slf4j; // Logger Lombok
import org.springframework.beans.factory.annotation.Value; // Inyección de properties
import org.springframework.http.MediaType; // Tipos de contenido HTTP
import org.springframework.stereotype.Component; // Componente Spring
import org.springframework.web.reactive.function.client.WebClient; // Cliente HTTP reactivo no bloqueante

import java.util.*; // Colecciones Java

/**
 * Adaptador de infraestructura para el Asistente Virtual Inteligente con Google Gemini API.
 */
@Component // Componente Spring
@Slf4j // Logger
public class GeminiApiClientAdapter {

    private final WebClient webClient; // Cliente WebClient para peticiones HTTP
    private final String apiKey; // Clave de acceso a Google AI Studio
    private final String model; // Modelo a utilizar (gemini-1.5-flash)

    public GeminiApiClientAdapter(
            @Value("${gemini.api.key}") String apiKey,
            @Value("${gemini.api.base-url}") String baseUrl,
            @Value("${gemini.api.model}") String model) {
        this.apiKey = apiKey;
        this.model = model;
        this.webClient = WebClient.builder()
                .baseUrl(baseUrl) // Configura la URL base oficial de Gemini API
                .build();
    }

    /**
     * Envía la consulta del paciente al modelo Gemini contextualizado con el catálogo de la clínica.
     */
    public GeminiChatResponseDTO generateResponse(GeminiChatRequestDTO request, String servicesCatalogContext) {
        try {
            // Prompt del sistema con rol, restricciones clínicas y catálogo de servicios
            String systemInstruction = "Eres la Asistente Virtual de la Clínica Dermatológica y Estética de la Dra. Valeria. " +
                    "Tu objetivo es brindar información clara, cálida y profesional sobre nuestros tratamientos, precios y cuidados de la piel. " +
                    "REGLAS OBLIGATORIAS: " +
                    "1. No emitas diagnósticos médicos definitivos ni recetes medicamentos; siempre aclara que se requiere consulta médica presencial. " +
                    "2. Utiliza exclusivamente la información del catálogo oficial que se te proporciona a continuación. " +
                    "3. Informa que para confirmar cualquier turno se abona una seña del 50% online vía MercadoPago y el 50% restante al finalizar la sesión. " +
                    "CATÁLOGO DE SERVICIOS Y PRECIOS:\n" + servicesCatalogContext;

            // Construcción del payload JSON esperado por la API de Google Gemini v1beta
            Map<String, Object> systemInstructionPart = Map.of("parts", List.of(Map.of("text", systemInstruction)));

            List<Map<String, Object>> contents = new ArrayList<>();

            // Agrega historial si existe
            if (request.getHistory() != null) {
                for (var item : request.getHistory()) {
                    contents.add(Map.of(
                            "role", "user".equalsIgnoreCase(item.getRole()) ? "user" : "model",
                            "parts", List.of(Map.of("text", item.getText()))
                    ));
                }
            }

            // Agrega el mensaje actual del usuario
            contents.add(Map.of(
                    "role", "user",
                    "parts", List.of(Map.of("text", request.getMessage()))
            ));

            Map<String, Object> requestBody = Map.of(
                    "system_instruction", systemInstructionPart,
                    "contents", contents
            );

            // Realiza la petición POST a la API de Gemini
            Map<?, ?> response = webClient.post()
                    .uri("/models/" + model + ":generateContent?key=" + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block(); // Bloqueo controlado en contexto síncrono del servicio

            // Extrae el texto generado de la respuesta de Gemini
            String generatedText = extractTextFromGeminiResponse(response);

            return GeminiChatResponseDTO.builder()
                    .reply(generatedText)
                    .suggestedServices(List.of("Consulta Dermatológica General", "Peeling Químico Médico", "Limpieza Facial Profunda"))
                    .bookingActionUrl("/turnos/reservar")
                    .build();

        } catch (Exception e) {
            log.error("Error al comunicarse con Gemini API: {}", e.getMessage());
            // Respuesta de contingencia si la API de Gemini no responde o la clave no está configurada
            return GeminiChatResponseDTO.builder()
                    .reply("¡Hola! Soy la asistente de la Clínica Dermatológica. En este momento estoy experimentando una breve intermitencia con el servidor de inteligencia artificial. Puedes explorar todos nuestros tratamientos disponibles en el menú de Servicios o reservar tu turno directamente seleccionando fecha y hora.")
                    .suggestedServices(List.of("Consulta Dermatológica", "Limpieza Facial"))
                    .bookingActionUrl("/turnos/reservar")
                    .build();
        }
    }

    @SuppressWarnings("unchecked")
    private String extractTextFromGeminiResponse(Map<?, ?> response) {
        if (response == null) return "No se recibió respuesta del modelo.";
        try {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    return (String) parts.get(0).get("text");
                }
            }
        } catch (Exception e) {
            log.warn("Formato inesperado en respuesta de Gemini: {}", e.getMessage());
        }
        return "Gracias por tu consulta. Puedes agendar tu turno desde nuestra web.";
    }
}
