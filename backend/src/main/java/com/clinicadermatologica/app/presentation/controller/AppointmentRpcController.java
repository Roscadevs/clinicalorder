package com.clinicadermatologica.app.presentation.controller;

import com.clinicadermatologica.app.application.service.AppointmentRegistrationService;
import com.clinicadermatologica.app.presentation.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST anoréxico para operaciones transaccionales de Citas y Pagos vía Supabase RPC.
 */
@RestController
@RequestMapping("/citas/rpc")
@RequiredArgsConstructor
public class AppointmentRpcController {

    private final AppointmentRegistrationService appointmentRegistrationService;

    @PostMapping("/reservar")
    @PreAuthorize("hasAnyRole('DOCTORA', 'ADMIN', 'SECRETARIA')")
    public ResponseEntity<AppointmentRpcResponseDTO> registerAppointment(
            @Valid @RequestBody CreateAppointmentRpcRequestDTO request) {
        AppointmentRpcResponseDTO response = appointmentRegistrationService.registerAppointmentViaRpc(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/pagos")
    @PreAuthorize("hasAnyRole('DOCTORA', 'ADMIN', 'SECRETARIA')")
    public ResponseEntity<PaymentRpcResponseDTO> registerPayment(
            @Valid @RequestBody RegisterPaymentRpcRequestDTO request) {
        PaymentRpcResponseDTO response = appointmentRegistrationService.registerPaymentViaRpc(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
