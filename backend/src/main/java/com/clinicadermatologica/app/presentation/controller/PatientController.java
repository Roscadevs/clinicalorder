package com.clinicadermatologica.app.presentation.controller;

import com.clinicadermatologica.app.application.service.PatientService; // Servicio de pacientes
import com.clinicadermatologica.app.presentation.dto.PatientRequestDTO; // DTO entrada
import com.clinicadermatologica.app.presentation.dto.PatientResponseDTO; // DTO respuesta
import jakarta.validation.Valid; // Validador
import lombok.RequiredArgsConstructor; // Inyección por constructor
import org.springframework.http.HttpStatus; // Códigos HTTP
import org.springframework.http.ResponseEntity; // Respuesta HTTP
import org.springframework.security.access.prepost.PreAuthorize; // Control RBAC
import org.springframework.web.bind.annotation.*; // Anotaciones REST

import java.util.List; // Listas

/**
 * Controlador REST para la gestión de pacientes.
 * Accesible por Médicas y Secretarias.
 */
@RestController // Controlador REST
@RequestMapping("/pacientes") // Ruta /api/v1/pacientes
@RequiredArgsConstructor // Inyección por constructor
@PreAuthorize("hasAnyRole('PHYSICIAN', 'RECEPTIONIST', 'ADMIN')") // Accesible por todos los roles autenticados
public class PatientController {

    private final PatientService patientService; // Servicio

    @PostMapping // Mapea HTTP POST /api/v1/pacientes
    public ResponseEntity<PatientResponseDTO> createPatient(@Valid @RequestBody PatientRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(patientService.createPatient(request));
    }

    @GetMapping("/{id}") // Mapea HTTP GET /api/v1/pacientes/{id}
    public ResponseEntity<PatientResponseDTO> getPatientById(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    @GetMapping // Mapea HTTP GET /api/v1/pacientes?search=...
    public ResponseEntity<List<PatientResponseDTO>> getPatients(
            @RequestParam(required = false) String search) {
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(patientService.searchPatients(search));
        }
        return ResponseEntity.ok(patientService.getAllActivePatients());
    }

    @PutMapping("/{id}") // Mapea HTTP PUT /api/v1/pacientes/{id}
    public ResponseEntity<PatientResponseDTO> updatePatient(
            @PathVariable Long id,
            @Valid @RequestBody PatientRequestDTO request) {
        return ResponseEntity.ok(patientService.updatePatient(id, request));
    }

    @DeleteMapping("/{id}") // Mapea HTTP DELETE /api/v1/pacientes/{id}
    public ResponseEntity<Void> deactivatePatient(@PathVariable Long id) {
        patientService.deactivatePatient(id);
        return ResponseEntity.noContent().build(); // Retorna HTTP 204 No Content
    }
}
