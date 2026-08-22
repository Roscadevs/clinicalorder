package com.clinicadermatologica.app.infrastructure.notification;

import lombok.extern.slf4j.Slf4j; // Logger
import org.springframework.stereotype.Service; // Servicio Spring

import java.time.Instant; // Tiempo UTC

/**
 * Servicio desacoplado para el envío de notificaciones por correo electrónico transaccionales.
 */
@Service // Componente de servicio Spring
@Slf4j // Logger
public class EmailNotificationService {

    @org.springframework.beans.factory.annotation.Value("${FRONTEND_BASE_URL:http://localhost:5173}")
    private String frontendBaseUrl;

    /**
     * Envía comprobante de confirmación de turno con los detalles de la cita.
     */
    public void sendAppointmentConfirmationEmail(String toEmail, String patientName, String serviceName, Instant startTime) {
        log.info("📧 [EMAIL SERVICE] Enviando confirmación de turno a {}: Hola {}, tu turno para '{}' ha sido confirmado para {}.",
                toEmail, patientName, serviceName, startTime);
    }

    /**
     * Envía el enlace con el token criptográfico para restablecer la contraseña.
     */
    public void sendPasswordResetEmail(String toEmail, String token) {
        String resetUrl = frontendBaseUrl + "/auth/reset-password?token=" + token;
        log.info("📧 [EMAIL SERVICE] Enviando enlace de recuperación a {}: Restablece tu contraseña ingresando a: {} (Válido por 15 minutos)",
                toEmail, resetUrl);
    }
}
