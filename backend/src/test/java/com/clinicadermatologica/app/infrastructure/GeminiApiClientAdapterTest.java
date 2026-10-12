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
    @DisplayName("Debe retornar la respuesta de contingencia institucional cuando todos los modelos fallan")
    void shouldReturnInstitutionalFallbackWhenAllModelsFail() {
        // Adaptador apuntando a URL inaccesible para forzar el fallo de toda la cascada
        GeminiApiClientAdapter adapter = new GeminiApiClientAdapter(
                "dummy-key",
                "http://127.0.0.1:59999", // Puerto no existente
                "gemini-3.5-flash-lite",
                "gemini-3.5-flash-lite, gemini-3.1-flash-lite"
        );

        GeminiChatRequestDTO request = GeminiChatRequestDTO.builder()
                .message("Hola, ¿tienen turnos disponibles?")
                .build();

        GeminiChatResponseDTO response = adapter.generateResponse(request, "Catalogo de prueba");

        assertThat(response).isNotNull();
        assertThat(response.getReply()).contains("intermitencia con el servidor de inteligencia artificial");
        assertThat(response.getBookingActionUrl()).isEqualTo("/turnos/reservar");
        assertThat(response.getSuggestedServices()).isNotEmpty();
    }
}
