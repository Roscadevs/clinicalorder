package com.clinicadermatologica.app.application;

import com.clinicadermatologica.app.application.service.GeminiChatbotService;
import com.clinicadermatologica.app.domain.model.DermatologicService;
import com.clinicadermatologica.app.domain.repository.DermatologicServiceRepository;
import com.clinicadermatologica.app.infrastructure.ai.GeminiApiClientAdapter;
import com.clinicadermatologica.app.presentation.dto.GeminiChatRequestDTO;
import com.clinicadermatologica.app.presentation.dto.GeminiChatResponseDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GeminiChatbotServiceTest {

    @Mock
    private GeminiApiClientAdapter geminiApiClientAdapter;

    @Mock
    private DermatologicServiceRepository serviceRepository;

    @InjectMocks
    private GeminiChatbotService chatbotService;

    private List<DermatologicService> activeServices;

    @BeforeEach
    void setUp() {
        DermatologicService s1 = DermatologicService.builder()
                .id(1L)
                .name("Consulta Dermatológica General")
                .description("Evaluación médica de la piel")
                .durationMinutes(30)
                .basePrice(new BigDecimal("30000.00"))
                .active(true)
                .build();

        DermatologicService s2 = DermatologicService.builder()
                .id(2L)
                .name("Peeling Químico Médico")
                .description("Renovación celular profunda")
                .durationMinutes(45)
                .basePrice(new BigDecimal("42000.00"))
                .active(true)
                .build();

        activeServices = List.of(s1, s2);
    }

    @Test
    @DisplayName("Debe inyectar el catálogo de servicios activo con precios y señas al adaptador de Gemini")
    void shouldInjectActiveCatalogWithPricesAndDepositsToGeminiAdapter() {
        when(serviceRepository.findAllActive()).thenReturn(activeServices);

        GeminiChatResponseDTO mockResponse = GeminiChatResponseDTO.builder()
                .reply("Hola, disponemos de Consulta y Peeling.")
                .suggestedServices(List.of("Consulta Dermatológica General", "Peeling Químico Médico"))
                .bookingActionUrl("/turnos/reservar")
                .build();

        when(geminiApiClientAdapter.generateResponse(any(GeminiChatRequestDTO.class), anyString()))
                .thenReturn(mockResponse);

        GeminiChatRequestDTO request = GeminiChatRequestDTO.builder()
                .message("¿Cuánto cuesta el peeling?")
                .build();

        GeminiChatResponseDTO response = chatbotService.processUserMessage(request);

        assertThat(response).isNotNull();
        assertThat(response.getReply()).isEqualTo("Hola, disponemos de Consulta y Peeling.");

        ArgumentCaptor<String> catalogCaptor = ArgumentCaptor.forClass(String.class);
        verify(geminiApiClientAdapter).generateResponse(eq(request), catalogCaptor.capture());

        String capturedCatalog = catalogCaptor.getValue();
        assertThat(capturedCatalog).contains("Consulta Dermatológica General");
        assertThat(capturedCatalog).contains("Precio Base: $30000.00 ARS");
        assertThat(capturedCatalog).contains("Seña para reservar (50%): $15000.00 ARS");
        assertThat(capturedCatalog).contains("Peeling Químico Médico");
        assertThat(capturedCatalog).contains("Precio Base: $42000.00 ARS");
        assertThat(capturedCatalog).contains("Seña para reservar (50%): $21000.00 ARS");
    }
}
