package com.clinicadermatologica.app.presentation.controller;

import com.clinicadermatologica.app.application.service.PatientRegistrationService;
import com.clinicadermatologica.app.presentation.dto.CreatePatientRpcRequestDTO;
import com.clinicadermatologica.app.presentation.dto.PatientRpcResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST anoréxico para operaciones transaccionales de alta de pacientes en Supabase.
 */
@RestController
@RequestMapping("/pacientes/rpc")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('DOCTORA', 'ADMIN', 'SECRETARIA')")
public class PatientRpcController {

    private final PatientRegistrationService patientRegistrationService;

    @PostMapping("/alta")
    public ResponseEntity<PatientRpcResponseDTO> registerPatient(@Valid @RequestBody CreatePatientRpcRequestDTO request) {
        PatientRpcResponseDTO response = patientRegistrationService.registerPatientViaRpc(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
