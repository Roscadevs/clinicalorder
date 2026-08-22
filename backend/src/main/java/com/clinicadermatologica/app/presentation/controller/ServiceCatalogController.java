package com.clinicadermatologica.app.presentation.controller;

import com.clinicadermatologica.app.application.service.DermatologicServiceService; // Servicio de catálogo
import com.clinicadermatologica.app.presentation.dto.ServiceRequestDTO; // DTO entrada
import com.clinicadermatologica.app.presentation.dto.ServiceResponseDTO; // DTO salida
import jakarta.validation.Valid; // Validador
import lombok.RequiredArgsConstructor; // Inyección por constructor
import org.springframework.http.HttpStatus; // Códigos HTTP
import org.springframework.http.ResponseEntity; // Respuesta HTTP
import org.springframework.security.access.prepost.PreAuthorize; // Seguridad declarativa
import org.springframework.web.bind.annotation.*; // Anotaciones REST

import java.util.List; // Listas

/**
 * Controlador REST para el catálogo de servicios dermatológicos y estéticos.
 */
@RestController // Controlador REST
@RequestMapping("/servicios") // Ruta /api/v1/servicios
@RequiredArgsConstructor // Inyección por constructor
public class ServiceCatalogController {

    private final DermatologicServiceService serviceService; // Servicio

    /**
     * Endpoint público para listar tratamientos activos en el landing y chatbot.
     */
    @GetMapping // Mapea HTTP GET /api/v1/servicios
    public ResponseEntity<List<ServiceResponseDTO>> getActiveServices() {
        return ResponseEntity.ok(serviceService.getAllActiveServices());
    }

    /**
     * Endpoint público para consultar el detalle de un tratamiento.
     */
    @GetMapping("/{id}") // Mapea HTTP GET /api/v1/servicios/{id}
    public ResponseEntity<ServiceResponseDTO> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceService.getServiceById(id));
    }

    /**
     * Endpoint protegido para crear un servicio (solo ADMIN).
     */
    @PostMapping // Mapea HTTP POST /api/v1/servicios
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServiceResponseDTO> createService(@Valid @RequestBody ServiceRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(serviceService.createService(request));
    }

    /**
     * Endpoint protegido para actualizar precios y configuración de servicios (solo ADMIN).
     */
    @PutMapping("/{id}") // Mapea HTTP PUT /api/v1/servicios/{id}
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ServiceResponseDTO> updateService(
            @PathVariable Long id,
            @Valid @RequestBody ServiceRequestDTO request) {
        return ResponseEntity.ok(serviceService.updateService(id, request));
    }
}
