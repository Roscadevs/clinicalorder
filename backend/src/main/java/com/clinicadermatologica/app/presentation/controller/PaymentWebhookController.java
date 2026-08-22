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
     */
    @PostMapping("/webhook") // Mapea HTTP POST /api/v1/pagos/webhook
    public ResponseEntity<Void> handleMercadoPagoWebhook(@RequestBody Map<String, Object> payload) {
        log.info("Webhook recibido de MercadoPago: {}", payload);
        paymentService.processMercadoPagoWebhook(payload);
        return ResponseEntity.ok().build(); // Retorna HTTP 200 OK inmediatamente a MercadoPago
    }
}
