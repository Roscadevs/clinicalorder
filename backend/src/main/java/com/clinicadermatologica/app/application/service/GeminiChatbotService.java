package com.clinicadermatologica.app.application.service;

import com.clinicadermatologica.app.domain.model.DermatologicService; // Entidad del dominio
import com.clinicadermatologica.app.infrastructure.persistence.dao.DermatologicServiceDAO; // DAO de servicios
import com.clinicadermatologica.app.infrastructure.ai.GeminiApiClientAdapter; // Adaptador Gemini
import com.clinicadermatologica.app.presentation.dto.GeminiChatRequestDTO; // DTO entrada
import com.clinicadermatologica.app.presentation.dto.GeminiChatResponseDTO; // DTO respuesta
import lombok.RequiredArgsConstructor; // Inyección por constructor
import org.springframework.stereotype.Service; // Servicio Spring
import org.springframework.transaction.annotation.Transactional; // Transacciones

import java.util.List; // Listas

/**
 * Servicio de Aplicación para el Asistente Interno con IA: un manual de usuario conversacional
 * para los empleados autenticados del sistema (ADMINISTRADOR, DOCTORA, SECRETARIA).
 */
@Service // Componente de servicio Spring
@RequiredArgsConstructor // Inyección por constructor
public class GeminiChatbotService {

    private final GeminiApiClientAdapter geminiApiClientAdapter; // Adaptador de llamada a Gemini API
    private final DermatologicServiceDAO serviceRepository; // DAO para obtener catálogo fresco

    /**
     * Procesa la consulta del usuario inyectando el catálogo de servicios activo en el System Prompt.
     */
    @Transactional(readOnly = true) // Solo lectura del catálogo
    public GeminiChatResponseDTO processUserMessage(GeminiChatRequestDTO request) {
        // 1. Obtiene la lista actualizada de servicios y tarifas
        List<DermatologicService> activeServices = serviceRepository.findAllActive();

        StringBuilder catalogBuilder = new StringBuilder();
        for (DermatologicService s : activeServices) {
            // Solo nombre, descripción y duración. Sin precios ni señas: el asistente es un manual
            // de uso para empleados, no una herramienta de venta.
            catalogBuilder.append("- Servicio: ").append(s.getName()).append("\n")
                    .append("  Descripción: ").append(s.getDescription()).append("\n")
                    .append("  Duración: ").append(s.getDurationMinutes()).append(" minutos\n\n");
        }

        // 2. Invoca al modelo Gemini con el listado de servicios (sin datos de dinero) como contexto
        return geminiApiClientAdapter.generateResponse(request, catalogBuilder.toString());
    }
}
