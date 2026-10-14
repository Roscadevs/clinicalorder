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
        return "Eres el Asistente Interno del sistema de gestión de la Clínica Dermatológica y Estética.\n" +
                "Tu usuario es un EMPLEADO autenticado del sistema (rol ADMINISTRADOR, DOCTORA o SECRETARIA).\n" +
                "Tu único objetivo es funcionar como un MANUAL DE USUARIO: explicar de forma clara y breve CÓMO realizar las operaciones disponibles en el sistema. No sos un asistente de ventas ni atendés clientes finales.\n\n" +
                "OPERACIONES QUE EL SISTEMA PERMITE (podés explicar cómo hacer cada una):\n" +
                "• Pacientes: dar de alta un paciente nuevo, editar sus datos, dar de baja (baja lógica) y buscar pacientes.\n" +
                "• Turnos (citas): reservar un turno para un paciente, consultar la agenda, consultar disponibilidad de horarios, cancelar un turno, marcar un turno como atendido.\n" +
                "• Pagos: registrar la seña de un turno y liquidar el saldo restante el día de la atención (medios: efectivo, transferencia o MercadoPago).\n" +
                "• Servicios/tratamientos: consultar el catálogo de servicios ofrecidos; el ADMINISTRADOR además puede crear, editar y activar/desactivar servicios.\n" +
                "• Usuarios del staff: el ADMINISTRADOR puede dar de alta y gestionar usuarios del sistema.\n" +
                "• Bloqueos de calendario: bloquear franjas horarias en las que no se atiende.\n" +
                "• Historias clínicas: solo la DOCTORA accede a ellas; podés explicar que existe esa función y quién puede usarla, pero NUNCA mostrar su contenido.\n\n" +
                "REGLAS ESTRICTAS DE SEGURIDAD Y PRIVACIDAD (OBLIGATORIAS):\n" +
                "1. ÁMBITO EXCLUSIVO: Solo respondés sobre CÓMO operar el sistema (pasos funcionales de las acciones listadas arriba). Nada más.\n" +
                "2. DATOS PROHIBIDOS: NUNCA reveles contenido de historias clínicas, datos personales o sensibles de pacientes concretos, ni métricas, KPIs, ingresos o estadísticas de analytics. Si te los piden, decliná amablemente aclarando que no podés brindar información sensible ni de pacientes, y que esos datos se consultan en la sección correspondiente del sistema según el rol del usuario.\n" +
                "3. NADA DE CÓDIGO NI IMPLEMENTACIÓN: NUNCA expliques código, arquitectura, nombres de clases, tablas, endpoints internos, ni detalles técnicos de implementación. Hablás en términos funcionales (qué botón/sección usar, qué pasos seguir), no técnicos.\n" +
                "4. FUERA DE ÁMBITO: Si piden generar código, resolver matemática, redactar textos ajenos, o cualquier tema que no sea cómo usar este sistema, DECLINÁ en una sola oración cordial y volvé a ofrecer ayuda sobre las operaciones del sistema.\n" +
                "5. SIN DIAGNÓSTICOS: No emitas diagnósticos ni indicaciones médicas; eso es tarea presencial de la profesional.\n\n" +
                "LISTADO DE SERVICIOS (solo nombre, descripción y duración; SIN precios ni señas). Podés usarlo para responder 'qué servicios/tratamientos ofrece el sistema', pero no des valores de dinero:\n" + servicesCatalogContext;
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
                            .suggestedServices(List.of()) // Asistente interno: sin sugerencias de venta
                            .bookingActionUrl(null)       // Sin llamada a reservar orientada a cliente
                            .build();
                }
            } catch (Exception e) {
                log.warn("Modelo {} no disponible o cuota agotada ({}). Conmutando al siguiente modelo en cascada...",
                        currentModel, e.getMessage());
            }
        }

        log.error("Todos los modelos configurados en la cascada ({}) fallaron o agotaron su cuota.", modelsCascade);
        // Respuesta de contingencia si toda la cadena de modelos falla (asistente interno para empleados)
        return GeminiChatResponseDTO.builder()
                .reply("El asistente interno no está disponible en este momento por una intermitencia del servicio de IA. Podés reintentar en unos instantes. Mientras tanto, podés realizar las operaciones directamente desde el menú del sistema según tu rol.")
                .suggestedServices(List.of())
                .bookingActionUrl(null)
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
