package com.clinicadermatologica.app.application.service;

import com.clinicadermatologica.app.domain.exception.*; // Excepciones de negocio
import com.clinicadermatologica.app.domain.model.*; // Entidades del dominio
import com.clinicadermatologica.app.domain.repository.*; // Repositorios del dominio
import com.clinicadermatologica.app.infrastructure.payment.MercadoPagoPaymentAdapter; // Adaptador MercadoPago
import com.clinicadermatologica.app.presentation.dto.FinalizePaymentRequestDTO; // DTO de liquidación final
import com.mercadopago.resources.payment.Payment; // Recurso devuelto por MercadoPago
import lombok.RequiredArgsConstructor; // Inyección por constructor
import lombok.extern.slf4j.Slf4j; // Logger
import org.springframework.stereotype.Service; // Servicio Spring
import org.springframework.transaction.annotation.Transactional; // Transacciones ACID

import java.time.Instant; // Tiempo UTC
import java.util.List; // Listas
import java.util.Map; // Mapas

/**
 * Servicio de Aplicación para procesamiento de pagos, webhooks de MercadoPago y cobro de saldos en mostrador.
 */
@Service // Componente de servicio Spring
@RequiredArgsConstructor // Inyección por constructor
@Slf4j // Logger
public class PaymentService {

    private final PaymentTransactionRepository paymentTransactionRepository; // Repositorio de pagos
    private final AppointmentRepository appointmentRepository; // Repositorio de citas
    private final UserRepository userRepository; // Repositorio de usuarios
    private final MercadoPagoPaymentAdapter mercadoPagoAdapter; // Adaptador MercadoPago

    /**
     * Procesa la notificación asíncrona de webhook enviada por MercadoPago.
     */
    @Transactional // Transacción ACID: actualiza atómicamente la transacción y el turno
    public void processMercadoPagoWebhook(Map<String, Object> payload) {
        try {
            String type = (String) payload.get("type");
            if (!"payment".equals(type) && !payload.containsKey("data")) {
                log.info("Webhook recibido de tipo no payment: {}", type);
                return;
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> data = (Map<String, Object>) payload.get("data");
            if (data == null || !data.containsKey("id")) {
                return;
            }

            String paymentIdStr = String.valueOf(data.get("id"));
            Long paymentId = Long.parseLong(paymentIdStr);

            // 1. Consulta el estado oficial a la API de MercadoPago para evitar manipulaciones externas
            Payment mpPayment = mercadoPagoAdapter.getPaymentDetails(paymentId);
            if (mpPayment == null) {
                log.warn("No se pudo verificar el pago {} en MercadoPago", paymentId);
                return;
            }

            String externalReference = mpPayment.getExternalReference();
            if (externalReference == null) return;

            Long appointmentId = Long.parseLong(externalReference);
            Appointment appointment = appointmentRepository.findById(appointmentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada para webhook: " + appointmentId));

            // 2. Busca la transacción de pago local
            List<PaymentTransaction> transactions = paymentTransactionRepository.findByAppointmentId(appointmentId);
            PaymentTransaction transaction = transactions.stream()
                    .filter(t -> t.getPaymentType() == PaymentType.DEPOSIT_50)
                    .findFirst()
                    .orElse(null);

            if (transaction == null) {
                transaction = PaymentTransaction.builder()
                        .appointment(appointment)
                        .paymentType(PaymentType.DEPOSIT_50)
                        .amount(mpPayment.getTransactionAmount())
                        .build();
            }

            // 3. Aplica cambios según el estado del pago
            String status = mpPayment.getStatus();
            if ("approved".equalsIgnoreCase(status)) {
                transaction.setStatus(PaymentStatus.APPROVED);
                transaction.setMpPaymentId(paymentIdStr);
                transaction.setPaymentDate(Instant.now());

                // Confirma el turno y retira la fecha límite de retención
                appointment.setStatus(AppointmentStatus.CONFIRMED);
                appointment.setTemporaryHoldDeadline(null);
                log.info("Turno #{} CONFIRMADO exitosamente tras pago de seña en MercadoPago", appointmentId);
            } else if ("rejected".equalsIgnoreCase(status) || "cancelled".equalsIgnoreCase(status)) {
                transaction.setStatus(PaymentStatus.REJECTED);
                transaction.setMpPaymentId(paymentIdStr);

                // Marca como pago fallido y libera la franja horaria inmediatamente
                appointment.setStatus(AppointmentStatus.PAYMENT_FAILED);
                appointment.setTemporaryHoldDeadline(Instant.now());
                log.warn("Pago rechazado para turno #{}. Franja liberada.", appointmentId);
            }

            paymentTransactionRepository.save(transaction);
            appointmentRepository.save(appointment);

        } catch (Exception e) {
            log.error("Error al procesar webhook de MercadoPago: {}", e.getMessage(), e);
        }
    }

    /**
     * Registra el cobro del 50% restante en mostrador (efectivo/tarjeta) y finaliza la cita.
     */
    @Transactional // Transacción ACID
    public void registerFinalPayment(Long appointmentId, FinalizePaymentRequestDTO request, Long receptionistUserId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Turno no encontrado con ID " + appointmentId));

        if (appointment.getStatus() != AppointmentStatus.CONFIRMED) {
            throw new BusinessRuleException("Solo se puede liquidar el saldo de citas previamente confirmadas");
        }

        User receptionist = userRepository.findById(receptionistUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario recepcionista no encontrado"));

        // Crea la transacción del saldo final
        PaymentTransaction finalTransaction = PaymentTransaction.builder()
                .appointment(appointment)
                .paymentType(PaymentType.FINAL_BALANCE_50)
                .amount(request.getAmount())
                .status(PaymentStatus.APPROVED)
                .registeredByUser(receptionist)
                .paymentDate(Instant.now())
                .build();

        paymentTransactionRepository.save(finalTransaction);

        // Actualiza el estado formal del turno a COMPLETADO
        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(appointment);
        log.info("Cita #{} COMPLETADA con cobro en mostrador por usuario {}", appointmentId, receptionist.getUsername());
    }
}
