package com.clinicadermatologica.app.infrastructure.payment;

import com.mercadopago.MercadoPagoConfig;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración centralizada para el SDK oficial de MercadoPago.
 * Inicializa el Access Token de forma global al iniciar el contexto de Spring.
 */
@Configuration
@Slf4j
public class MercadoPagoConfigBean {

    @Value("${mercadopago.access-token:#{null}}")
    private String accessToken;

    @PostConstruct
    public void initializeMercadoPago() {
        if (accessToken != null && !accessToken.isBlank()) {
            MercadoPagoConfig.setAccessToken(accessToken);
            log.info("MercadoPago SDK inicializado con token configurado (prefijo: {})",
                    accessToken.length() > 8 ? accessToken.substring(0, 8) + "..." : "***");
        } else {
            log.warn("MercadoPago SDK: No se proveyó mercadopago.access-token. Las llamadas a la API fallarán si no se configuran las variables de entorno.");
        }
    }
}
