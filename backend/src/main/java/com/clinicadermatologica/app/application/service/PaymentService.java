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
import java.util.List;
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

    @org.springframework.beans.factory.annotation.Value("${mercadopago.webhook-secret:test_webhook_secret}")
    private String webhookSecret;

    /**
     * Procesa la notificación asíncrona de webhook enviada por MercadoPago
     * sin validación de firma (compatibilidad con invocaciones internas y pruebas).
     */
    @Transactional
    public void processMercadoPagoWebhook(Map<String, Object> payload) {
        processMercadoPagoWebhook(payload, null, null, null);
    }

    /**
     * Procesa la notificación asíncrona de webhook enviada por MercadoPago con
     * validación de firma HMAC SHA-256.
     *
     * Busca la transacción PENDING por mpPreferenceId — el concepto (DEPOSIT, BALANCE o
     * FULL) fue establecido al crear la preferencia y determina la transición de estado
     * de la cita.
     *
     * @return false si la firma es inválida o el procesamiento falló; true en caso
     *         contrario, incluidos los webhooks que se descartan por no ser de pago.
     */
    @Transactional // Transacción ACID: actualiza atómicamente la transacción y el turno
    public boolean processMercadoPagoWebhook(Map<String, Object> payload, Map<String, String> queryParams, String xSignature, String xRequestId) {
        try {
            // Extrae dataId del payload o de los query parameters
            String paymentIdStr = null;
            String type = null;

            if (payload != null) {
                type = (String) payload.get("type");
                if (type == null) {
                    type = (String) payload.get("topic");
                }

                if (payload.get("data") instanceof Map<?, ?> dataMap) {
                    if (dataMap.containsKey("id")) {
                        paymentIdStr = String.valueOf(dataMap.get("id"));
                    }
                } else if (payload.containsKey("id")) {
                    paymentIdStr = String.valueOf(payload.get("id"));
                }
            }

            if (paymentIdStr == null && queryParams != null) {
                if (queryParams.containsKey("data.id")) {
                    paymentIdStr = queryParams.get("data.id");
                } else if (queryParams.containsKey("id")) {
                    paymentIdStr = queryParams.get("id");
                }
                if (type == null) {
                    type = queryParams.get("type") != null ? queryParams.get("type") : queryParams.get("topic");
                }
            }

            if (paymentIdStr == null) {
                log.info("Webhook recibido sin identificador de recurso o ID de pago");
                return true;
            }

            // Validar firma HMAC si está presente
            if (!isValidSignature(xSignature, xRequestId, paymentIdStr)) {
                log.warn("Firma de webhook MercadoPago inválida para pago ID: {}", paymentIdStr);
                return false;
            }

            // Solo procesamos tópicos relacionados a 'payment'
            if (type != null && !"payment".equalsIgnoreCase(type) && !"payments".equalsIgnoreCase(type)) {
                log.info("Webhook recibido para tópico no payment: {}", type);
                return true;
            }

            Long paymentId = Long.parseLong(paymentIdStr);

            // Consulta el estado verificado a la API de MercadoPago (evita spoofing de webhooks)
            Payment mpPayment = mercadoPagoAdapter.getPaymentDetails(paymentId);
            if (mpPayment == null) {
                log.warn("No se pudo verificar el pago {} en MercadoPago", paymentId);
                return true;
            }

            // Busca la transacción PENDING por externalReference (preferenceId o appointmentId)
            String externalReference = mpPayment.getExternalReference();
            if (externalReference == null || externalReference.isBlank()) {
                log.warn("El pago {} no tiene externalReference asociado", paymentId);
                return true;
            }

            PaymentTransaction transaction = paymentTransactionRepository
                    .findByMpPreferenceId(externalReference)
                    .orElse(null);

            if (transaction == null) {
                try {
                    Long appointmentId = Long.parseLong(externalReference.trim());
                    List<PaymentTransaction> txs = paymentTransactionRepository.findByAppointmentId(appointmentId);
                    transaction = txs.stream()
                            .filter(t -> t.getPaymentType() == PaymentType.MERCADOPAGO && t.getStatus() == PaymentStatus.PENDING)
                            .findFirst()
                            .orElse(null);
                } catch (NumberFormatException ignored) {
                }
            }

            if (transaction == null) {
                log.warn("No se encontró transacción pendiente para externalReference: {}", externalReference);
                return true;
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
            return true;

        } catch (Exception e) {
            log.error("Error al procesar webhook de MercadoPago: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Valida la firma HMAC SHA-256 enviada en el header x-signature de MercadoPago.
     */
    public boolean isValidSignature(String xSignature, String xRequestId, String dataId) {
        // En entornos locales o si no se ha configurado un secret específico, omitir para permitir pruebas
        if (webhookSecret == null || webhookSecret.isBlank() || "test_webhook_secret".equalsIgnoreCase(webhookSecret)) {
            return true;
        }
        if (xSignature == null || xSignature.isBlank()) {
            return false;
        }
        try {
            String ts = null;
            String v1 = null;
            for (String part : xSignature.split(",")) {
                String[] kv = part.split("=", 2);
                if (kv.length == 2) {
                    if ("ts".equalsIgnoreCase(kv[0].trim())) {
                        ts = kv[1].trim();
                    } else if ("v1".equalsIgnoreCase(kv[0].trim())) {
                        v1 = kv[1].trim();
                    }
                }
            }
            if (ts == null || v1 == null) {
                return false;
            }

            // Construir template manifest según especificación oficial de MercadoPago:
            // id:[data.id_url];request-id:[x-request-id_header];ts:[ts_header];
            StringBuilder manifest = new StringBuilder();
            if (dataId != null && !dataId.isBlank()) {
                manifest.append("id:").append(dataId.toLowerCase().trim()).append(";");
            }
            if (xRequestId != null && !xRequestId.isBlank()) {
                manifest.append("request-id:").append(xRequestId.trim()).append(";");
            }
            manifest.append("ts:").append(ts).append(";");

            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
            javax.crypto.spec.SecretKeySpec secretKey = new javax.crypto.spec.SecretKeySpec(
                    webhookSecret.getBytes(java.nio.charset.StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(manifest.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8));

            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }

            return hexString.toString().equalsIgnoreCase(v1);
        } catch (Exception e) {
            log.error("Error al validar firma HMAC de webhook MercadoPago: {}", e.getMessage());
            return false;
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
