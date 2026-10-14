package com.clinicadermatologica.app.infrastructure.payment;

import com.clinicadermatologica.app.domain.exception.PaymentGatewayException;
import com.mercadopago.MercadoPagoConfig; // Configuración global del SDK de MercadoPago
import com.mercadopago.client.payment.PaymentClient; // Cliente para consultar pagos
import com.mercadopago.client.payment.PaymentRefundClient; // Cliente para emitir reembolsos
import com.mercadopago.client.preference.*; // Clientes y DTOs para crear preferencias de Checkout Pro
import com.mercadopago.core.MPRequestOptions; // Opciones de request con cabeceras de idempotencia
import com.mercadopago.resources.payment.Payment; // Recurso de pago devuelto por la API
import com.mercadopago.resources.payment.PaymentRefund; // Recurso de reembolso
import com.mercadopago.resources.preference.Preference; // Recurso de preferencia devuelto por la API
import lombok.extern.slf4j.Slf4j; // Logger de Lombok
import org.springframework.beans.factory.annotation.Value; // Inyección de properties
import org.springframework.stereotype.Component; // Componente Spring

import java.math.BigDecimal; // Precisión decimal
import java.time.OffsetDateTime; // Marcas de tiempo con offset horario
import java.util.Collections; // Listas inmutables
import java.util.Map;

/**
 * Adaptador de infraestructura para la integración con el SDK oficial de MercadoPago (Checkout Pro).
 */
@Component // Componente Spring
@Slf4j // Logger
public class MercadoPagoPaymentAdapter {

    @Value("${mercadopago.access-token}") // Inyecta el token de acceso de MercadoPago
    private String accessToken;

    @Value("${mercadopago.back-urls.success}")
    private String successUrl;

    @Value("${mercadopago.back-urls.failure}")
    private String failureUrl;

    @Value("${mercadopago.back-urls.pending}")
    private String pendingUrl;

    @Value("${mercadopago.notification-url:#{null}}")
    private String notificationUrl;

    /**
     * Crea una preferencia de pago en MercadoPago por el 50% de la seña (compatibilidad básica).
     */
    public Preference createDepositPreference(Long appointmentId, String serviceTitle, BigDecimal depositAmount, String patientEmail) {
        return createDepositPreference(appointmentId, serviceTitle, depositAmount, patientEmail, null, null, null);
    }

    /**
     * Crea una preferencia de pago en MercadoPago con datos completos del comprador y servicio
     * cumpliendo el 100% de los estándares de Calidad y Homologación de Mercado Pago.
     */
    public Preference createDepositPreference(Long appointmentId, String serviceTitle, BigDecimal depositAmount,
                                             String patientEmail, String patientName, String patientDni, String patientPhone) {
        try {
            // Inicializa las credenciales de MercadoPago
            if (accessToken != null && !accessToken.isBlank()) {
                MercadoPagoConfig.setAccessToken(accessToken);
            }

            // Crea el ítem representativo del 50% de la seña con categoría y trazabilidad completa
            PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                    .id(String.valueOf(appointmentId)) // ID del recurso para conciliación
                    .title("Seña (50%): " + serviceTitle) // Título visible al paciente
                    .description("Reserva de turno dermatológico - Turno #" + appointmentId) // Descripción detallada
                    .categoryId("services") // Categoría para motor anti-fraude
                    .quantity(1) // Cantidad
                    .unitPrice(depositAmount) // Monto exacto de la seña (50%)
                    .currencyId("ARS") // Moneda local argentina
                    .build();

            // Configura los datos del pagador para maximizar la tasa de aprobación de pagos
            PreferencePayerRequest.PreferencePayerRequestBuilder payerBuilder = PreferencePayerRequest.builder()
                    .email(patientEmail);

            if (patientName != null && !patientName.isBlank()) {
                payerBuilder.name(patientName);
            }

            if (patientDni != null && !patientDni.isBlank()) {
                payerBuilder.identification(com.mercadopago.client.common.IdentificationRequest.builder()
                        .type("DNI")
                        .number(patientDni.trim())
                        .build());
            }

            if (patientPhone != null && !patientPhone.isBlank()) {
                payerBuilder.phone(com.mercadopago.client.common.PhoneRequest.builder()
                        .number(patientPhone.trim())
                        .build());
            }

            PreferencePayerRequest payerRequest = payerBuilder.build();

            // Excluye medios de pago offline (tickets como Rapipago/Pago Fácil) para turnos médicos
            PreferencePaymentMethodsRequest paymentMethods = PreferencePaymentMethodsRequest.builder()
                    .excludedPaymentTypes(Collections.singletonList(
                            PreferencePaymentTypeRequest.builder().id("ticket").build()
                    ))
                    .build();

            // Define expiración de 10 minutos para coordinar con el TTL del backend
            OffsetDateTime expirationDate = OffsetDateTime.now().plusMinutes(10);

            // Construye la solicitud completa de preferencia con descriptor bancario
            PreferenceRequest.PreferenceRequestBuilder preferenceRequestBuilder = PreferenceRequest.builder()
                    .items(Collections.singletonList(itemRequest))
                    .payer(payerRequest)
                    .paymentMethods(paymentMethods)
                    .statementDescriptor("CLINICA DERMA") // Texto visible en el resumen de tarjeta (13 chars max)
                    .expires(true) // Activa expiración
                    .dateOfExpiration(expirationDate) // Fecha de expiración (10 min)
                    .externalReference(String.valueOf(appointmentId)); // Identificador del turno para conciliación

            // Configura las URLs de retorno tras el proceso de pago si están disponibles
            if (successUrl != null && !successUrl.isBlank() && (successUrl.startsWith("http://") || successUrl.startsWith("https://"))) {
                PreferenceBackUrlsRequest.PreferenceBackUrlsRequestBuilder backUrlsBuilder = PreferenceBackUrlsRequest.builder()
                        .success(successUrl);
                if (failureUrl != null && !failureUrl.isBlank() && (failureUrl.startsWith("http://") || failureUrl.startsWith("https://"))) {
                    backUrlsBuilder.failure(failureUrl);
                }
                if (pendingUrl != null && !pendingUrl.isBlank() && (pendingUrl.startsWith("http://") || pendingUrl.startsWith("https://"))) {
                    backUrlsBuilder.pending(pendingUrl);
                }
                preferenceRequestBuilder.backUrls(backUrlsBuilder.build());

                // Mercado Pago exige HTTPS para autoReturn("approved")
                if (successUrl.startsWith("https://")) {
                    preferenceRequestBuilder.autoReturn("approved");
                }
            }

            if (notificationUrl != null && !notificationUrl.isBlank()) {
                preferenceRequestBuilder.notificationUrl(notificationUrl);
            }

            PreferenceRequest preferenceRequest = preferenceRequestBuilder.build();

            // Clave de idempotencia para prevenir preferencias duplicadas por problemas de red
            MPRequestOptions requestOptions = MPRequestOptions.builder()
                    .customHeaders(Collections.singletonMap("X-Idempotency-Key", "PREF-" + appointmentId + "-" + System.currentTimeMillis()))
                    .build();

            // Ejecuta la llamada a MercadoPago y retorna la preferencia con el init_point
            PreferenceClient client = new PreferenceClient();
            return client.create(preferenceRequest, requestOptions);

        } catch (com.mercadopago.exceptions.MPApiException e) {
            String errorDetail = e.getApiResponse() != null ? e.getApiResponse().getContent() : e.getMessage();
            log.error("Error de API MercadoPago al crear preferencia para cita {}: HTTP Status {}, Respuesta: {}",
                    appointmentId, e.getStatusCode(), errorDetail);
            throw new PaymentGatewayException("MercadoPago rechazó la creación de la preferencia (" + e.getStatusCode() + "): " + errorDetail, e);
        } catch (Exception e) {
            log.error("Error general al crear preferencia en MercadoPago para cita {}: {}", appointmentId, e.getMessage(), e);
            throw new PaymentGatewayException("Error de comunicación con la pasarela de pagos: " + e.getMessage(), e);
        }
    }

    /**
     * Determina la URL de redirección adecuada (producción vs sandbox) para el pagador.
     * En producción (credencial APP_USR-), utiliza siempre init_point.
     * En modo de prueba (credencial TEST-), prioriza sandbox_init_point.
     */
    public String resolveInitPoint(Preference preference) {
        if (preference == null) {
            return null;
        }
        boolean isProduction = accessToken != null && accessToken.trim().startsWith("APP_USR-");
        if (isProduction) {
            return preference.getInitPoint();
        }
        return (preference.getSandboxInitPoint() != null && !preference.getSandboxInitPoint().isBlank())
                ? preference.getSandboxInitPoint()
                : preference.getInitPoint();
    }

    /**
     * Consulta el estado de un pago directamente a la API de MercadoPago mediante su payment_id.
     */
    public Payment getPaymentDetails(Long paymentId) {
        try {
            if (accessToken != null && !accessToken.isBlank()) {
                MercadoPagoConfig.setAccessToken(accessToken);
            }
            PaymentClient client = new PaymentClient();
            return client.get(paymentId); // Consulta el estado verificado del pago
        } catch (Exception e) {
            log.error("Error al consultar pago {} en MercadoPago: {}", paymentId, e.getMessage());
            return null;
        }
    }

    /**
     * Emite un reembolso total de un pago procesado a través de MercadoPago.
     */
    public PaymentRefund refundPayment(Long paymentId) {
        try {
            if (accessToken != null && !accessToken.isBlank()) {
                MercadoPagoConfig.setAccessToken(accessToken);
            }
            PaymentRefundClient refundClient = new PaymentRefundClient();
            MPRequestOptions requestOptions = MPRequestOptions.builder()
                    .customHeaders(Collections.singletonMap("X-Idempotency-Key", "REFUND-" + paymentId + "-" + System.currentTimeMillis()))
                    .build();
            return refundClient.refund(paymentId, requestOptions);
        } catch (com.mercadopago.exceptions.MPApiException e) {
            String errorDetail = e.getApiResponse() != null ? e.getApiResponse().getContent() : e.getMessage();
            log.error("Error de API MercadoPago al reembolsar pago {}: HTTP Status {}, Respuesta: {}",
                    paymentId, e.getStatusCode(), errorDetail);
            throw new PaymentGatewayException("MercadoPago no pudo procesar el reembolso (" + e.getStatusCode() + "): " + errorDetail, e);
        } catch (Exception e) {
            log.error("Error al procesar reembolso para pago {}: {}", paymentId, e.getMessage(), e);
            throw new PaymentGatewayException("Error de comunicación al procesar el reembolso en MercadoPago: " + e.getMessage(), e);
        }
    }
}
