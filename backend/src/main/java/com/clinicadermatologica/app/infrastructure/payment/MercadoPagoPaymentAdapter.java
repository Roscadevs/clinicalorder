package com.clinicadermatologica.app.infrastructure.payment;

import com.mercadopago.MercadoPagoConfig; // Configuración global del SDK de MercadoPago
import com.mercadopago.client.payment.PaymentClient; // Cliente para consultar pagos
import com.mercadopago.client.preference.*; // Clientes y DTOs para crear preferencias de Checkout Pro
import com.mercadopago.resources.payment.Payment; // Recurso de pago devuelto por la API
import com.mercadopago.resources.preference.Preference; // Recurso de preferencia devuelto por la API
import lombok.extern.slf4j.Slf4j; // Logger de Lombok
import org.springframework.beans.factory.annotation.Value; // Inyección de properties
import org.springframework.stereotype.Component; // Componente Spring

import java.math.BigDecimal; // Precisión decimal
import java.time.OffsetDateTime; // Marcas de tiempo con offset horario
import java.util.Collections; // Listas inmutables

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
            MercadoPagoConfig.setAccessToken(accessToken);

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

            // Configura las URLs de retorno tras el proceso de pago
            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success(successUrl)
                    .failure(failureUrl)
                    .pending(pendingUrl)
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

            // Define expiración de 10 minutos para coordinar con el TTL del backend
            OffsetDateTime expirationDate = OffsetDateTime.now().plusMinutes(10);

            // Construye la solicitud completa de preferencia con descriptor bancario
            PreferenceRequest.PreferenceRequestBuilder preferenceRequestBuilder = PreferenceRequest.builder()
                    .items(Collections.singletonList(itemRequest))
                    .backUrls(backUrls)
                    .payer(payerRequest)
                    .statementDescriptor("CLINICA DERMA") // Texto visible en el resumen de tarjeta
                    .autoReturn("approved") // Redirección automática si el pago se aprueba
                    .expires(true) // Activa expiración
                    .dateOfExpiration(expirationDate) // Fecha de expiración (10 min)
                    .externalReference(String.valueOf(appointmentId)); // Identificador del turno para conciliación

            if (notificationUrl != null && !notificationUrl.isBlank()) {
                preferenceRequestBuilder.notificationUrl(notificationUrl);
            }

            PreferenceRequest preferenceRequest = preferenceRequestBuilder.build();

            // Ejecuta la llamada a MercadoPago y retorna la preferencia con el init_point
            PreferenceClient client = new PreferenceClient();
            return client.create(preferenceRequest);

        } catch (com.mercadopago.exceptions.MPApiException e) {
            log.error("Error al crear preferencia en MercadoPago para cita {}: HTTP Status {}, Respuesta: {}",
                    appointmentId, e.getStatusCode(), e.getApiResponse() != null ? e.getApiResponse().getContent() : e.getMessage());
            return null;
        } catch (Exception e) {
            log.error("Error al crear preferencia en MercadoPago para cita {}: {}", appointmentId, e.getMessage(), e);
            return null;
        }
    }

    /**
     * Consulta el estado de un pago directamente a la API de MercadoPago mediante su payment_id.
     */
    public Payment getPaymentDetails(Long paymentId) {
        try {
            MercadoPagoConfig.setAccessToken(accessToken);
            PaymentClient client = new PaymentClient();
            return client.get(paymentId); // Consulta el estado verificado del pago
        } catch (Exception e) {
            log.error("Error al consultar pago {} en MercadoPago: {}", paymentId, e.getMessage());
            return null;
        }
    }
}
