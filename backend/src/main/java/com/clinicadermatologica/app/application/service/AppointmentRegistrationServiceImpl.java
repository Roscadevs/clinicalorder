package com.clinicadermatologica.app.application.service;

import com.clinicadermatologica.app.domain.exception.BusinessRuleException;
import com.clinicadermatologica.app.domain.exception.DuplicateResourceException;
import com.clinicadermatologica.app.domain.exception.ResourceNotFoundException;
import com.clinicadermatologica.app.infrastructure.persistence.jpa.JpaAppointmentRepository;
import com.clinicadermatologica.app.infrastructure.persistence.jpa.JpaPaymentTransactionRepository;
import com.clinicadermatologica.app.presentation.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

/**
 * Implementación de la integración transaccional para Citas y Pagos vía Supabase RPC.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class AppointmentRegistrationServiceImpl implements AppointmentRegistrationService {

    private final JpaAppointmentRepository jpaAppointmentRepository;
    private final JpaPaymentTransactionRepository jpaPaymentTransactionRepository;

    @Override
    @Transactional
    public AppointmentRpcResponseDTO registerAppointmentViaRpc(CreateAppointmentRpcRequestDTO request) {
        log.info("Iniciando alta transaccional de cita en Supabase para paciente ID: {}, servicio ID: {}",
                request.getPacienteId(), request.getServicioId());

        if (request.getEndTime().isBefore(request.getStartTime()) || request.getEndTime().equals(request.getStartTime())) {
            throw new BusinessRuleException("La fecha de fin debe ser posterior a la fecha de inicio");
        }

        try {
            Long generatedCitaId = jpaAppointmentRepository.executeSpAltaCita(
                    request.getPacienteId(),
                    request.getServicioId(),
                    request.getCreatedByUserId(),
                    request.getStartTime(),
                    request.getEndTime(),
                    request.getAgreedPrice(),
                    request.getDoctorId(),
                    request.getFollowUpToId()
            );

            log.info("Cita ID: {} creada exitosamente en Supabase vía RPC", generatedCitaId);

            return AppointmentRpcResponseDTO.builder()
                    .citaId(generatedCitaId)
                    .pacienteId(request.getPacienteId())
                    .servicioId(request.getServicioId())
                    .doctorId(request.getDoctorId())
                    .startTime(request.getStartTime())
                    .endTime(request.getEndTime())
                    .status("PENDING_PAYMENT")
                    .agreedPrice(request.getAgreedPrice())
                    .followUpToId(request.getFollowUpToId())
                    .message("Cita reservada exitosamente en estado PENDING_PAYMENT")
                    .timestamp(Instant.now())
                    .build();

        } catch (DataIntegrityViolationException ex) {
            String rootMessage = ex.getMostSpecificCause().getMessage();
            log.error("Fallo de integridad referencial al agendar cita: {}", rootMessage);

            if (rootMessage != null && rootMessage.contains("seguimiento vinculado")) {
                throw new DuplicateResourceException("La cita origen ya cuenta con un turno de seguimiento asignado");
            }
            throw new BusinessRuleException("Error de restricción de base de datos al crear cita: " + rootMessage);

        } catch (Exception ex) {
            String rootMessage = ex.getMessage();
            log.error("Excepción al invocar sp_alta_cita: {}", rootMessage, ex);

            if (rootMessage != null && rootMessage.contains("Paciente")) {
                throw new ResourceNotFoundException("El paciente especificado no existe o se encuentra inactivo");
            }
            if (rootMessage != null && rootMessage.contains("Servicio")) {
                throw new ResourceNotFoundException("El servicio especificado no existe o se encuentra inactivo");
            }
            if (rootMessage != null && rootMessage.contains("Doctor")) {
                throw new ResourceNotFoundException("El médico asignado no existe o no cuenta con rol DOCTORA");
            }
            if (rootMessage != null && rootMessage.contains("Usuario creador")) {
                throw new ResourceNotFoundException("El usuario operador no existe o se encuentra inactivo");
            }

            throw new BusinessRuleException("No se pudo completar la reserva de la cita: " + rootMessage);
        }
    }

    @Override
    @Transactional
    public PaymentRpcResponseDTO registerPaymentViaRpc(RegisterPaymentRpcRequestDTO request) {
        log.info("Iniciando registro transaccional de pago para cita ID: {}, monto: {}, concepto: {}",
                request.getCitaId(), request.getAmount(), request.getPaymentConcept());

        try {
            Long generatedPaymentId = jpaPaymentTransactionRepository.executeSpAltaTransaccionPago(
                    request.getCitaId(),
                    request.getPaymentType(),
                    request.getPaymentConcept(),
                    request.getAmount(),
                    request.getStatus(),
                    request.getRegisteredByUserId(),
                    request.getMpPreferenceId(),
                    request.getMpPaymentId()
            );

            log.info("Transacción de pago ID: {} registrada exitosamente en Supabase vía RPC", generatedPaymentId);

            String statusMessage = "APPROVED".equalsIgnoreCase(request.getStatus()) && "DEPOSIT".equalsIgnoreCase(request.getPaymentConcept())
                    ? "Pago aprobado: Seña acreditada y Cita confirmada automáticamente (CONFIRMED)"
                    : "Transacción de pago registrada en estado " + request.getStatus();

            return PaymentRpcResponseDTO.builder()
                    .paymentId(generatedPaymentId)
                    .citaId(request.getCitaId())
                    .amount(request.getAmount())
                    .status(request.getStatus())
                    .message(statusMessage)
                    .timestamp(Instant.now())
                    .build();

        } catch (DataIntegrityViolationException ex) {
            String rootMessage = ex.getMostSpecificCause().getMessage();
            log.error("Fallo de integridad referencial al registrar pago: {}", rootMessage);

            if (rootMessage != null && rootMessage.contains("mp_payment_id")) {
                throw new DuplicateResourceException("El identificador de pago de MercadoPago ya fue procesado");
            }
            throw new BusinessRuleException("Error de restricción al registrar pago: " + rootMessage);

        } catch (Exception ex) {
            String rootMessage = ex.getMessage();
            log.error("Excepción al invocar sp_alta_transaccion_pago: {}", rootMessage, ex);

            if (rootMessage != null && rootMessage.contains("Cita")) {
                throw new ResourceNotFoundException("La cita asociada al pago no existe");
            }

            throw new BusinessRuleException("No se pudo procesar el pago en base de datos: " + rootMessage);
        }
    }
}
