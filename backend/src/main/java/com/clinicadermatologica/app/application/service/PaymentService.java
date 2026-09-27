package com.clinicadermatologica.app.application.service;

import com.clinicadermatologica.app.application.strategy.PaymentStrategyFactory;
import com.clinicadermatologica.app.domain.exception.*;
import com.clinicadermatologica.app.domain.model.*;
import com.clinicadermatologica.app.domain.repository.*;
import com.clinicadermatologica.app.infrastructure.payment.MercadoPagoPaymentAdapter;
import com.clinicadermatologica.app.presentation.dto.FinalizePaymentRequestDTO;
import com.clinicadermatologica.app.presentation.dto.PaymentReceiptDTO;
import com.clinicadermatologica.app.presentation.dto.RegisterPaymentRequestDTO;
import com.mercadopago.resources.payment.Payment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.Map;

/**
 * Servicio de Aplicación para procesamiento de pagos.
 *
 * PATRÓN DE DISEÑO: Strategy (delegación a PaymentStrategyFactory)
 * PaymentService no contiene ningún bloque if/else sobre el canal de pago (PaymentType).
 * En su lugar, delega en PaymentStrategyFactory.getStrategy(paymentType) para obtener
 * la implementación concreta (MercadoPago, Cash o BankTransfer) y llama a .register().
 *
 * WEBHOOK: Al procesar una notificación de MercadoPago, la transacción se busca por
 * mpPreferenceId (establecido al crear la preferencia). El concepto del pago (DEPOSIT/FULL)
 * ya fue definido en ese momento y determina la transición de estado de la cita.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final MercadoPagoPaymentAdapter mercadoPagoAdapter;
    private final PaymentStrategyFactory paymentStrategyFactory; // Patrón Strategy

    /**
     * Procesa la notificación asíncrona de webhook enviada por MercadoPago.
     *
     * Busca la transacción PENDING por mpPreferenceId — el concepto (DEPOSIT o FULL) fue
     * establecido al crear la preferencia y determina la transición del estado de la cita.
     */
    @Transactional
    public void processMercadoPagoWebhook(Map<String, Object> payload) {
        try {
            String type = (String) payload.get("type");
            if (!"payment".equals(type) || !payload.containsKey("data")) {
                log.info("Webhook recibido de tipo no payment: {}", type);
                return;
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> data = (Map<String, Object>) payload.get("data");
            if (data == null || !data.containsKey("id")) return;

            String paymentIdStr = String.valueOf(data.get("id"));
            Long paymentId = Long.parseLong(paymentIdStr);

            // Consulta el estado verificado a la API de MercadoPago (evita spoofing de webhooks)
            Payment mpPayment = mercadoPagoAdapter.getPaymentDetails(paymentId);
            if (mpPayment == null) {
                log.warn("No se pudo verificar el pago {} en MercadoPago", paymentId);
                return;
            }

            // Busca la transacción PENDING por preferenceId — el concepto ya está almacenado
            String preferenceId = mpPayment.getPreferenceId();
            if (preferenceId == null) {
                log.warn("El pago {} no tiene preferenceId asociado", paymentId);
                return;
            }

            PaymentTransaction transaction = paymentTransactionRepository
                    .findByMpPreferenceId(preferenceId)
                    .orElse(null);

            if (transaction == null) {
                log.warn("No se encontró transacción pendiente para preferenceId: {}", preferenceId);
                return;
            }

            Appointment appointment = transaction.getAppointment();
            String status = mpPayment.getStatus();

            if ("approved".equalsIgnoreCase(status)) {
                transaction.setStatus(PaymentStatus.APPROVED);
                transaction.setMpPaymentId(paymentIdStr);
                transaction.setPaymentDate(Instant.now());

                // DEPOSIT o FULL → confirmar cita; BALANCE → completar cita
                PaymentConcept concept = transaction.getPaymentConcept();
                if (concept == PaymentConcept.DEPOSIT || concept == PaymentConcept.FULL) {
                    if (appointment.getStatus() != AppointmentStatus.PENDING_PAYMENT) {
                        log.warn("Cita #{} no está en PENDING_PAYMENT para confirmar. Estado actual: {}",
                                appointment.getId(), appointment.getStatus());
                    } else {
                        appointment.setStatus(AppointmentStatus.CONFIRMED);
                        log.info("Cita #{} CONFIRMADA tras pago {} vía MercadoPago (concepto: {})",
                                appointment.getId(), paymentIdStr, concept);
                    }
                } else if (concept == PaymentConcept.BALANCE) {
                    appointment.setStatus(AppointmentStatus.COMPLETED);
                    log.info("Cita #{} COMPLETADA tras pago de saldo vía MercadoPago", appointment.getId());
                }

            } else if ("rejected".equalsIgnoreCase(status) || "cancelled".equalsIgnoreCase(status)) {
                transaction.setStatus(PaymentStatus.REJECTED);
                transaction.setMpPaymentId(paymentIdStr);
                appointment.setStatus(AppointmentStatus.PAYMENT_FAILED);
                log.warn("Pago rechazado para cita #{}. Estado: PAYMENT_FAILED.", appointment.getId());
            }

            paymentTransactionRepository.save(transaction);
            appointmentRepository.save(appointment);

        } catch (Exception e) {
            log.error("Error al procesar webhook de MercadoPago: {}", e.getMessage(), e);
        }
    }

    /**
     * Caso de uso "Registrar Pago" — seña de un turno reservado por el staff.
     *
     * Valida que el turno siga retenido (PENDING_PAYMENT y dentro de los 10 minutos), que el
     * medio sea manual (efectivo/transferencia) y que el monto cubra la seña sin superar el
     * precio acordado. Registra la transacción vía Strategy y confirma el turno.
     * Si el monto alcanza el precio total, el concepto es FULL; si no, DEPOSIT.
     *
     * E-2: ante una validación fallida se informa el error. Si el bloqueo venció, el turno se
     * cancela (y se libera el horario) aunque la operación termine con error: por eso no se
     * revierte la transacción ante BusinessRuleException.
     */
    @Transactional(noRollbackFor = BusinessRuleException.class)
    public PaymentReceiptDTO registerDepositPayment(Long appointmentId, RegisterPaymentRequestDTO request,
                                                    Long registeredByUserId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Turno no encontrado con ID " + appointmentId));

        if (appointment.getStatus() != AppointmentStatus.PENDING_PAYMENT) {
            throw new BusinessRuleException("El turno no está pendiente de pago (estado actual: "
                    + appointment.getStatus() + ")");
        }

        if (HoldPolicy.isExpired(appointment, Instant.now())) {
            appointment.setStatus(AppointmentStatus.CANCELED);
            appointmentRepository.save(appointment);
            rejectPendingTransactions(appointment, null);
            throw new BusinessRuleException("El tiempo para completar la operación expiró. "
                    + "El horario fue liberado; iniciá la reserva nuevamente.");
        }

        if (request.getPaymentType() == PaymentType.MERCADOPAGO) {
            throw new BusinessRuleException("El pago virtual se acredita automáticamente a través de MercadoPago");
        }

        BigDecimal agreedPrice = appointment.getAgreedPrice();
        BigDecimal deposit = agreedPrice
                .multiply(BigDecimal.valueOf(appointment.getService().getDepositPercentage()))
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        BigDecimal amount = request.getAmount();

        if (amount.compareTo(deposit) < 0) {
            throw new BusinessRuleException("El monto abonado ($" + amount.toPlainString()
                    + ") es menor a la seña requerida ($" + deposit.toPlainString() + ")");
        }
        if (amount.compareTo(agreedPrice) > 0) {
            throw new BusinessRuleException("El monto abonado supera el precio total del turno ($"
                    + agreedPrice.toPlainString() + ")");
        }

        User registeredBy = userRepository.findById(registeredByUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        PaymentConcept concept = amount.compareTo(agreedPrice) >= 0 ? PaymentConcept.FULL : PaymentConcept.DEPOSIT;

        // Patrón Strategy: el canal (efectivo/transferencia) define cómo se persiste el pago
        PaymentTransaction transaction = paymentStrategyFactory
                .getStrategy(request.getPaymentType())
                .register(appointment, amount, concept, registeredBy, null);

        // El link de MercadoPago generado al bloquear el horario ya no se usará
        rejectPendingTransactions(appointment, transaction);

        appointment.setStatus(AppointmentStatus.CONFIRMED);
        appointmentRepository.save(appointment);
        log.info("Cita #{} CONFIRMADA con pago {} ({}) registrado por {}",
                appointmentId, request.getPaymentType(), concept, registeredBy.getUsername());

        return PaymentReceiptDTO.builder()
                .appointmentId(appointmentId)
                .transactionId(transaction != null ? transaction.getId() : null)
                .paymentType(request.getPaymentType())
                .concept(concept)
                .amount(amount)
                .paymentDate(transaction != null && transaction.getPaymentDate() != null
                        ? transaction.getPaymentDate() : Instant.now())
                .appointmentStatus(appointment.getStatus())
                .build();
    }

    /** Marca como REJECTED las transacciones pendientes del turno, salvo la indicada. */
    private void rejectPendingTransactions(Appointment appointment, PaymentTransaction keep) {
        paymentTransactionRepository.findByAppointmentId(appointment.getId()).stream()
                .filter(tx -> tx != keep && tx.getStatus() == PaymentStatus.PENDING)
                .forEach(tx -> {
                    tx.setStatus(PaymentStatus.REJECTED);
                    paymentTransactionRepository.save(tx);
                });
    }

    /**
     * Registra el cobro del saldo final en mostrador y finaliza la cita.
     * Delega en la estrategia correspondiente al canal de pago indicado en el DTO.
     * Solo permitido cuando la cita está en estado CONFIRMED.
     */
    @Transactional
    public void registerFinalPayment(Long appointmentId, FinalizePaymentRequestDTO request, Long registeredByUserId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Turno no encontrado con ID " + appointmentId));

        if (appointment.getStatus() != AppointmentStatus.ATTENDED) {
            throw new BusinessRuleException("Solo se puede liquidar el saldo de turnos ya atendidos por el médico");
        }

        User registeredBy = userRepository.findById(registeredByUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // Patrón Strategy: delega en la estrategia del canal indicado sin if/else
        paymentStrategyFactory
                .getStrategy(request.getPaymentType())
                .register(appointment, request.getAmount(), PaymentConcept.BALANCE, registeredBy, null);

        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(appointment);
        log.info("Cita #{} COMPLETADA con cobro de saldo final ({}) por usuario {}",
                appointmentId, request.getPaymentType(), registeredBy.getUsername());
    }
}
