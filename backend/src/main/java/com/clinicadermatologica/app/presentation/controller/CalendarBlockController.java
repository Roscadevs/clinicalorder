package com.clinicadermatologica.app.presentation.controller;

import com.clinicadermatologica.app.application.service.CalendarBlockService; // Servicio de bloqueos
import com.clinicadermatologica.app.presentation.dto.CalendarBlockRequestDTO; // DTO entrada
import com.clinicadermatologica.app.presentation.dto.CalendarBlockResponseDTO; // DTO salida
import jakarta.validation.Valid; // Validador
import lombok.RequiredArgsConstructor; // Inyección por constructor
import org.springframework.format.annotation.DateTimeFormat; // Formateador de fecha
import org.springframework.http.HttpStatus; // Códigos HTTP
import org.springframework.http.ResponseEntity; // Respuesta HTTP
import org.springframework.security.access.prepost.PreAuthorize; // Seguridad declarativa
import org.springframework.web.bind.annotation.*; // Anotaciones REST

import java.time.Instant; // Tiempo UTC
import java.util.List; // Listas

/**
 * Controlador REST para gestionar bloqueos de calendario (indisponibilidades de la clínica).
 */
@RestController // Controlador REST
@RequestMapping("/bloqueos") // Ruta /api/v1/bloqueos
@RequiredArgsConstructor // Inyección por constructor
@PreAuthorize("hasAnyRole('ADMIN', 'PHYSICIAN')") // Exige rol ADMIN o PHYSICIAN
public class CalendarBlockController {

    private final CalendarBlockService blockService; // Inyección del servicio

    @PostMapping // Mapea HTTP POST /api/v1/bloqueos
    public ResponseEntity<CalendarBlockResponseDTO> createBlock(
            @Valid @RequestBody CalendarBlockRequestDTO request,
            @RequestParam Long userId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(blockService.createBlock(request, userId));
    }

    @GetMapping // Mapea HTTP GET /api/v1/bloqueos?start=...&end=...
    public ResponseEntity<List<CalendarBlockResponseDTO>> getBlocks(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant end) {
        return ResponseEntity.ok(blockService.getBlocksByRange(start, end));
    }

    @DeleteMapping("/{id}") // Mapea HTTP DELETE /api/v1/bloqueos/{id}
    public ResponseEntity<Void> deleteBlock(@PathVariable Long id) {
        blockService.deleteBlock(id);
        return ResponseEntity.noContent().build();
    }
}
