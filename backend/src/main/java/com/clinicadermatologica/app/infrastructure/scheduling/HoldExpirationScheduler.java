package com.clinicadermatologica.app.infrastructure.scheduling;

import com.clinicadermatologica.app.application.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Libera periódicamente los bloqueos temporales de turnos vencidos (TTL de 10 minutos).
 *
 * El navegador no permite detectar de forma confiable que el usuario cerró la pestaña,
 * por eso la liberación del horario se garantiza del lado del servidor: si el pago no se
 * registra dentro del plazo, el turno pasa a CANCELED y el horario vuelve a estar disponible.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class HoldExpirationScheduler {

    private final AppointmentService appointmentService;

    @Scheduled(fixedDelayString = "${app.holds.expiration-check-ms:30000}")
    public void releaseExpiredHolds() {
        try {
            appointmentService.releaseExpiredHolds();
        } catch (Exception e) {
            log.error("Error al liberar bloqueos temporales vencidos: {}", e.getMessage(), e);
        }
    }
}
