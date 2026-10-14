package com.clinicadermatologica.app.infrastructure.ai;

import com.clinicadermatologica.app.presentation.dto.GeminiChatRequestDTO; // DTO de entrada
import com.clinicadermatologica.app.presentation.dto.GeminiChatResponseDTO; // DTO de respuesta
import lombok.extern.slf4j.Slf4j; // Logger Lombok
import org.springframework.beans.factory.annotation.Autowired; // Inyección explícita de dependencias
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
    private final List<String> modelsCascade; // Cadena de modelos ordenada para failover de cuota

    @Autowired // Constructor oficial único para el contenedor de Spring Boot
    public GeminiApiClientAdapter(
            @Value("${gemini.api.key:}") String apiKey,
            @Value("${gemini.api.base-url:https://generativelanguage.googleapis.com/v1beta}") String baseUrl,
            @Value("${gemini.api.model:gemini-3.5-flash-lite}") String defaultModel,
            @Value("${gemini.api.models:#{null}}") String modelsConfig) {
        this.apiKey = apiKey != null ? apiKey : "";
        this.webClient = WebClient.builder()
                .baseUrl(baseUrl != null && !baseUrl.isBlank() ? baseUrl : "https://generativelanguage.googleapis.com/v1beta")
                .build();
        if (modelsConfig != null && !modelsConfig.isBlank()) {
            this.modelsCascade = Arrays.stream(modelsConfig.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();
        } else {
            this.modelsCascade = List.of(defaultModel != null && !defaultModel.isBlank() ? defaultModel : "gemini-3.5-flash-lite");
        }
    }

    public List<String> getModelsCascade() {
        return Collections.unmodifiableList(modelsCascade);
    }

    public String buildSystemInstruction(String servicesCatalogContext) {
        return "Eres la Asistente Virtual de la Clínica Dermatológica y Estética de la Dra. Paula Villa Fuhrmann.\n" +
                "Tu objetivo es brindar asesoramiento cálido, claro, profesional y empático sobre los tratamientos, la salud de la piel y la reserva de turnos en nuestra clínica.\n\n" +
                "REGLAS ESTRICTAS DE SEGURIDAD Y BLINDAJE DE DOMINIO (ANTI-JAILBREAK):\n" +
                "1. ÁMBITO EXCLUSIVO: Tu único ámbito de conocimiento y respuesta es la clínica médica de la Dra. Paula Villa Fuhrmann, tratamientos dermatológicos/estéticos, cuidados de la piel y reserva de turnos.\n" +
                "2. CONSULTAS FUERA DE ÁMBITO: Si el usuario solicita generar código de programación (Python, Java, JavaScript, etc.), resolver operaciones o problemas matemáticos, redactar tareas/ensayos, o hablar sobre temas generales ajenos a la clínica, DEBES DECLINAR AMABLEMENTE en una sola oración cordial y redirigir inmediatamente la conversación hacia la clínica médica. Ejemplo: 'Como asistente de la Clínica de la Dra. Paula Villa Fuhrmann, me especializo exclusivamente en el cuidado de la piel y nuestros tratamientos médicos. ¿Te gustaría conocer nuestras opciones en dermatología o estética?'. NUNCA proporciones código informático ni cálculos matemáticos.\n\n" +
                "POLÍTICA FINANCIERA Y MODISMOS ARGENTINOS:\n" +
                "3. MEDIOS DE PAGO Y DINERO: Si el usuario consulta sobre 'plata', 'efectivo', 'transferencia', 'tarjetas', 'alias' o métodos de pago, interpreta siempre que consulta por opciones de abono y dinero. NUNCA asumas que 'plata' se refiere al metal precioso o mineral.\n" +
                "4. SEÑAS Y PAGOS: Para confirmar cualquier turno, se abona una seña del 50% de manera online a través de MercadoPago (tarjeta de débito, crédito o dinero en cuenta). El 50% restante se abona el día del turno directamente en la clínica médica (en efectivo, transferencia o tarjeta al finalizar la sesión).\n\n" +
                "FORMATO VISUAL Y CONSULTAS DE PRECIOS/SERVICIOS:\n" +
                "5. CONSULTAS GENERALES DE PRECIOS: Si el paciente pregunta de manera general por 'precios', 'lista de precios' o 'qué tratamientos hacen', NO vuelques todo el catálogo en una pared de texto desordenada con asteriscos excesivos. En su lugar, organiza tu respuesta de manera visual y sintetizada en estas 3 categorías principales invitándolo a elegir:\n" +
                "   • 🩺 Consultas Médicas y Diagnóstico (Evaluación médica integral, lunares, acné, rosácea)\n" +
                "   • ✨ Cuidado Facial y Renovación (Limpieza facial profunda, Peeling químico médico)\n" +
                "   • 💉 Armonización y Rejuvenecimiento (Botox, Ácido Hialurónico, Bioestimuladores de colágeno)\n" +
                "   Luego, invítalo cordialmente a indicarte cuál le interesa para detallarle el valor exacto, duración y costo de la seña.\n" +
                "6. CONSULTA POR TRATAMIENTO ESPECÍFICO: Si el usuario pregunta por un tratamiento puntual, brinda la información clara: nombre del tratamiento, breve beneficio, duración aproximada, precio total en $ ARS y valor de la seña (50%). Mantén el formato limpio, usando viñetas simples y evitando asteriscos excesivos o anidados.\n\n" +
                "RESPONSABILIDAD MÉDICA:\n" +
                "7. NO DIAGNÓSTICO: No emitas diagnósticos definitivos ni recetes medicamentos. Aclara siempre con amabilidad que todo diagnóstico e indicación terapéutica se realiza de forma presencial y personalizada con la Dra. Paula Villa Fuhrmann.\n\n" +
                "CATÁLOGO OFICIAL DE SERVICIOS Y TARIFAS VIGENTES:\n" + servicesCatalogContext;
    }

    /**
     * Envía la consulta del paciente iterando por la cadena de modelos en caso de cuota agotada o saturación.
     */
    public GeminiChatResponseDTO generateResponse(GeminiChatRequestDTO request, String servicesCatalogContext) {
        // Prompt del sistema con rol, blindaje de dominio, modismos y catálogo de servicios
        String systemInstruction = buildSystemInstruction(servicesCatalogContext);

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

        // Iteración sobre la cadena de modelos (Failover en Cascada)
        for (String currentModel : modelsCascade) {
            try {
                log.debug("Intentando consulta con modelo: {}", currentModel);
                Map<?, ?> response = webClient.post()
                        .uri("/models/" + currentModel + ":generateContent?key=" + apiKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(requestBody)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .block(); // Bloqueo controlado en contexto síncrono del servicio

                String generatedText = extractTextFromGeminiResponse(response);
                if (generatedText != null && !generatedText.isBlank()) {
                    log.info("Consulta del asistente resuelta exitosamente por modelo: {}", currentModel);
                    return GeminiChatResponseDTO.builder()
                            .reply(generatedText)
                            .suggestedServices(List.of("Consulta Dermatológica General", "Peeling Químico Médico", "Limpieza Facial Profunda"))
                            .bookingActionUrl("/turnos/reservar")
                            .build();
                }
            } catch (Exception e) {
                log.warn("Modelo {} no disponible o cuota agotada ({}). Conmutando al siguiente modelo en cascada...",
                        currentModel, e.getMessage());
            }
        }

        log.error("Todos los modelos configurados en la cascada ({}) fallaron o agotaron su cuota.", modelsCascade);
        // Respuesta de contingencia institucional si toda la cadena falla
        return GeminiChatResponseDTO.builder()
                .reply("¡Hola! Soy la asistente de la Clínica Dermatológica. En este momento estoy experimentando una breve intermitencia con el servidor de inteligencia artificial. Puedes explorar todos nuestros tratamientos disponibles en el menú de Servicios o reservar tu turno directamente seleccionando fecha y hora.")
                .suggestedServices(List.of("Consulta Dermatológica", "Limpieza Facial"))
                .bookingActionUrl("/turnos/reservar")
                .build();
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
