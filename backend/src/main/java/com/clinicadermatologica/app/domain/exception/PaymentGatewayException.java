package com.clinicadermatologica.app.domain.exception;

/**
 * Excepción arrojada cuando ocurre una falla en la comunicación, configuración
 * o procesamiento con la pasarela de pagos externa (Mercado Pago).
 */
public class PaymentGatewayException extends RuntimeException {
    public PaymentGatewayException(String message) {
        super(message);
    }

    public PaymentGatewayException(String message, Throwable cause) {
        super(message, cause);
    }
}
