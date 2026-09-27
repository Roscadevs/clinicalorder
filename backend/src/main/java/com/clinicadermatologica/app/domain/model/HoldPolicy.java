package com.clinicadermatologica.app.domain.model;

import java.time.Duration;
import java.time.Instant;

/**
 * Regla de negocio del bloqueo temporal de turnos.
 *
 * Al elegir fecha y horario, el turno queda en PENDING_PAYMENT durante {@link #TTL}.
 * Mientras el bloqueo está vigente nadie más puede reservar ese horario (control de
 * concurrencia, como en la venta de pasajes). Si vence sin registrarse el pago, el
 * turno pasa a CANCELED y el horario se libera.
 */
public final class HoldPolicy {

    public static final Duration TTL = Duration.ofMinutes(10);

    private HoldPolicy() {
    }

    /** Instante en que vence el bloqueo del turno. */
    public static Instant expiresAt(Appointment appointment) {
        Instant created = appointment.getCreatedAt() != null ? appointment.getCreatedAt() : Instant.now();
        return created.plus(TTL);
    }

    /** true si el turno es un bloqueo temporal cuyo plazo ya venció. */
    public static boolean isExpired(Appointment appointment, Instant now) {
        return appointment.getStatus() == AppointmentStatus.PENDING_PAYMENT
                && appointment.getCreatedAt() != null
                && !now.isBefore(expiresAt(appointment));
    }
}
