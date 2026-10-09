package com.clinicadermatologica.app.application.service;

import com.clinicadermatologica.app.presentation.dto.*;

/**
 * Contrato de servicio para el agendamiento y pago de citas mediante procedimientos PL/pgSQL en Supabase.
 */
public interface AppointmentRegistrationService {

    AppointmentRpcResponseDTO registerAppointmentViaRpc(CreateAppointmentRpcRequestDTO request);

    PaymentRpcResponseDTO registerPaymentViaRpc(RegisterPaymentRpcRequestDTO request);
}
