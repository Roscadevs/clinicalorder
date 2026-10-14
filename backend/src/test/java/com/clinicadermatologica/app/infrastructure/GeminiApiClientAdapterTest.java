package com.clinicadermatologica.app.infrastructure;

import com.clinicadermatologica.app.infrastructure.ai.GeminiApiClientAdapter;
import com.clinicadermatologica.app.presentation.dto.GeminiChatRequestDTO;
import com.clinicadermatologica.app.presentation.dto.GeminiChatResponseDTO;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class GeminiApiClientAdapterTest {

    @Test
    @DisplayName("Debe inicializar la cadena de modelos en cascada desde la propiedad coma-separada")
    void shouldInitializeModelsCascadeFromCommaSeparatedProperty() {
        String modelsConfig = "gemini-3.5-flash-lite, gemini-3.1-flash-lite, gemini-3-flash-preview, gemini-3.8-flash, gemini-3.7-flash, gemini-3.6-flash";
        GeminiApiClientAdapter adapter = new GeminiApiClientAdapter(
                "dummy-key",
                "https://dummy.base.url",
                "gemini-3.5-flash-lite",
                modelsConfig
        );

        List<String> cascade = adapter.getModelsCascade();
        assertThat(cascade).containsExactly(
                "gemini-3.5-flash-lite",
                "gemini-3.1-flash-lite",
                "gemini-3-flash-preview",
                "gemini-3.8-flash",
                "gemini-3.7-flash",
                "gemini-3.6-flash"
        );
    }

    @Test
    @DisplayName("Debe usar el modelo por defecto si modelsConfig es nulo o vacío")
    void shouldUseDefaultModelWhenConfigIsNull() {
        GeminiApiClientAdapter adapter = new GeminiApiClientAdapter(
                "dummy-key",
                "https://dummy.base.url",
                "gemini-3.5-flash-lite",
                null
        );

        List<String> cascade = adapter.getModelsCascade();
        assertThat(cascade).containsExactly("gemini-3.5-flash-lite");
    }

    @Test
    @DisplayName("Debe instanciarse de forma segura con propiedades nulas o vacías")
    void shouldInstantiateSafelyWithDefaultPlaceholders() {
        GeminiApiClientAdapter adapter = new GeminiApiClientAdapter("", "", null, null);
        assertThat(adapter).isNotNull();
        assertThat(adapter.getModelsCascade()).containsExactly("gemini-3.5-flash-lite");
    }

    @Test
    @DisplayName("Debe retornar una respuesta de contingencia neutra cuando todos los modelos fallan")
    void shouldReturnFallbackWhenAllModelsFail() {
        // Adaptador apuntando a URL inaccesible para forzar el fallo de toda la cascada
        GeminiApiClientAdapter adapter = new GeminiApiClientAdapter(
                "dummy-key",
                "http://127.0.0.1:59999", // Puerto no existente
                "gemini-3.5-flash-lite",
                "gemini-3.5-flash-lite, gemini-3.1-flash-lite"
        );

        GeminiChatRequestDTO request = GeminiChatRequestDTO.builder()
                .message("¿Cómo registro un pago?")
                .build();

        GeminiChatResponseDTO response = adapter.generateResponse(request, "Catalogo de prueba");

        // El asistente interno no sugiere servicios ni ofrece reservar turnos (eso era de cliente).
        assertThat(response).isNotNull();
        assertThat(response.getReply()).contains("asistente interno");
        assertThat(response.getBookingActionUrl()).isNull();
        assertThat(response.getSuggestedServices()).isEmpty();
    }

    @Test
    @DisplayName("Debe construir el System Instruction como manual de usuario interno con restricciones de privacidad")
    void shouldBuildSystemInstructionAsInternalUserManual() {
        GeminiApiClientAdapter adapter = new GeminiApiClientAdapter("dummy-key", "https://dummy.base.url", "gemini-3.5-flash-lite", null);
        String catalog = "- Servicio: Peeling Quimico\n  Descripcion: Renovacion celular\n  Duracion: 45 minutos\n";

        String instruction = adapter.buildSystemInstruction(catalog);

        // Rol: asistente interno para empleados (no asistente de clientes).
        assertThat(instruction).contains("Asistente Interno");
        assertThat(instruction).contains("EMPLEADO");
        // Debe poder explicar operaciones reales del sistema.
        assertThat(instruction).contains("turno");
        assertThat(instruction).contains("seña");
        // Debe prohibir explícitamente datos sensibles, métricas y código.
        assertThat(instruction).contains("historias clínicas");
        assertThat(instruction).contains("métricas");
        assertThat(instruction).contains("código");
        // El catálogo de servicios se inyecta como contexto (sin precios).
        assertThat(instruction).contains("Peeling Quimico");
    }
}
