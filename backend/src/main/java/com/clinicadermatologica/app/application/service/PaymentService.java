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

    @org.springframework.beans.factory.annotation.Value("${mercadopago.webhook-secret:test_webhook_secret}")
    private String webhookSecret;

    /**
     * Procesa la notificación asíncrona de webhook enviada por MercadoPago (compatibilidad básica).
     */
    @Transactional
    public void processMercadoPagoWebhook(Map<String, Object> payload) {
        processMercadoPagoWebhook(payload, null, null, null);
    }

    /**
     * Procesa la notificación asíncrona de webhook enviada por MercadoPago con validación de firma HMAC SHA-256.
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

            // 1. Consulta el estado oficial a la API de MercadoPago para evitar manipulaciones externas
            Payment mpPayment = mercadoPagoAdapter.getPaymentDetails(paymentId);
            if (mpPayment == null) {
                log.warn("No se pudo verificar el pago {} en MercadoPago", paymentId);
                return true;
            }

            String externalReference = mpPayment.getExternalReference();
            if (externalReference == null) return true;

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
