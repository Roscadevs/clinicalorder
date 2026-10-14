package com.clinicadermatologica.app.application.service;

import com.clinicadermatologica.app.presentation.dto.CreatePatientRpcRequestDTO;
import com.clinicadermatologica.app.presentation.dto.PatientRpcResponseDTO;

/**
 * Contrato de servicio para el alta transaccional de pacientes mediante procedimientos PL/pgSQL en Supabase.
 */
public interface PatientRegistrationService {
    PatientRpcResponseDTO registerPatientViaRpc(CreatePatientRpcRequestDTO request);
}
