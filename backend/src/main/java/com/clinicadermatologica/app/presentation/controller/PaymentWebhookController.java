package com.clinicadermatologica.app.presentation.controller;

import com.clinicadermatologica.app.application.service.PaymentService; // Servicio de pagos
import lombok.RequiredArgsConstructor; // Inyección por constructor
import lombok.extern.slf4j.Slf4j; // Logger
import org.springframework.http.ResponseEntity; // Respuesta HTTP
import org.springframework.web.bind.annotation.*; // Anotaciones REST

import java.util.Map; // Mapa de payload JSON

/**
 * Controlador REST para recibir notificaciones asíncronas de webhook de MercadoPago.
 */
@RestController // Controlador REST
@RequestMapping("/pagos") // Ruta /api/v1/pagos
@RequiredArgsConstructor // Inyección por constructor
@Slf4j // Logger
public class PaymentWebhookController {

    private final PaymentService paymentService; // Inyección del servicio

    /**
     * Endpoint público que recibe el webhook HTTP POST de MercadoPago.
     * Soporta validación de firma HMAC (x-signature), query parameters y payload JSON.
     */
    @PostMapping("/webhook") // Mapea HTTP POST /api/v1/pagos/webhook
    public ResponseEntity<Void> handleMercadoPagoWebhook(
            @RequestBody(required = false) Map<String, Object> payload,
            @RequestParam(required = false) Map<String, String> queryParams,
            @RequestHeader(value = "x-signature", required = false) String xSignature,
            @RequestHeader(value = "x-request-id", required = false) String xRequestId) {
        
        log.info("Webhook recibido de MercadoPago. Payload: {}, QueryParams: {}, xRequestId: {}", payload, queryParams, xRequestId);
        
        boolean success = paymentService.processMercadoPagoWebhook(payload, queryParams, xSignature, xRequestId);
        if (!success) {
            log.warn("Firma inválida o fallo de procesamiento en webhook de MercadoPago");
        }
        
        // Retorna HTTP 200 OK inmediatamente (requerido por MercadoPago dentro de los 22 segundos)
        return ResponseEntity.ok().build();
    }
}
