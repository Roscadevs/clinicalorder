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

    /**
     * Crea una preferencia de pago en MercadoPago por el 50% de la seña con vencimiento en 10 minutos.
     */
    public Preference createDepositPreference(Long appointmentId, String serviceTitle, BigDecimal depositAmount, String patientEmail) {
        try {
            // Inicializa las credenciales de MercadoPago
            MercadoPagoConfig.setAccessToken(accessToken);

            // Crea el ítem representativo del 50% de la seña
            PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                    .title("Seña (50%): " + serviceTitle) // Título visible al paciente
                    .description("Reserva de turno dermatológico - Turno #" + appointmentId) // Descripción
                    .quantity(1) // Cantidad
                    .unitPrice(depositAmount) // Monto del 50%
                    .currencyId("ARS") // Moneda local argentina
                    .build();

            // Configura las URLs de retorno tras el proceso de pago
            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success(successUrl)
                    .failure(failureUrl)
                    .pending(pendingUrl)
                    .build();

            // Configura los datos del pagador
            PreferencePayerRequest payerRequest = PreferencePayerRequest.builder()
                    .email(patientEmail)
                    .build();

            // Define expiración de 10 minutos para coordinar con el TTL del backend
            OffsetDateTime expirationDate = OffsetDateTime.now().plusMinutes(10);

            // Construye la solicitud completa de preferencia
            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(Collections.singletonList(itemRequest))
                    .backUrls(backUrls)
                    .payer(payerRequest)
                    .autoReturn("approved") // Redirección automática si el pago se aprueba
                    .expires(true) // Activa expiración
                    .dateOfExpiration(expirationDate) // Fecha de expiración (10 min)
                    .externalReference(String.valueOf(appointmentId)) // Identificador del turno para conciliación
                    .build();

            // Ejecuta la llamada a MercadoPago y retorna la preferencia con el init_point
            PreferenceClient client = new PreferenceClient();
            return client.create(preferenceRequest);

        } catch (Exception e) {
            log.error("Error al crear preferencia en MercadoPago para cita {}: {}", appointmentId, e.getMessage());
            // Retorna una preferencia simulada/mock para entornos de prueba sin credenciales productivas
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
