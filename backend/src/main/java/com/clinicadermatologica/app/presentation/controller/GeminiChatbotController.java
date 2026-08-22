package com.clinicadermatologica.app.presentation.controller;

import com.clinicadermatologica.app.application.service.GeminiChatbotService; // Servicio de chatbot
import com.clinicadermatologica.app.presentation.dto.GeminiChatRequestDTO; // DTO entrada
import com.clinicadermatologica.app.presentation.dto.GeminiChatResponseDTO; // DTO respuesta
import jakarta.validation.Valid; // Validador
import lombok.RequiredArgsConstructor; // Inyección por constructor
import org.springframework.http.ResponseEntity; // Respuesta HTTP
import org.springframework.web.bind.annotation.*; // Anotaciones REST

/**
 * Controlador REST para el Chatbot con Google Gemini en el Landing público.
 */
@RestController // Controlador REST
@RequestMapping("/chat") // Ruta /api/v1/chat
@RequiredArgsConstructor // Inyección por constructor
public class GeminiChatbotController {

    private final GeminiChatbotService chatbotService; // Inyección del servicio

    /**
     * Endpoint público para conversar con la Asistente Virtual asistida por Gemini API.
     */
    @PostMapping("/gemini") // Mapea HTTP POST /api/v1/chat/gemini
    public ResponseEntity<GeminiChatResponseDTO> sendMessage(@Valid @RequestBody GeminiChatRequestDTO request) {
        return ResponseEntity.ok(chatbotService.processUserMessage(request));
    }
}
