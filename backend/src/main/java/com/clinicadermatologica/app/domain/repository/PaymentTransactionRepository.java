package com.clinicadermatologica.app.domain.repository;

import com.clinicadermatologica.app.domain.model.PaymentTransaction; // Entidad PaymentTransaction

import java.util.List; // Colección de lista
import java.util.Optional; // Contenedor opcional

/**
 * Contrato de repositorio del dominio para transacciones de pago (MercadoPago y mostrador).
 */
public interface PaymentTransactionRepository {
    Optional<PaymentTransaction> findById(Long id); // Búsqueda por ID interno
    Optional<PaymentTransaction> findByMpPaymentId(String mpPaymentId); // Búsqueda por ID de pago de MercadoPago
    Optional<PaymentTransaction> findByMpPreferenceId(String mpPreferenceId); // Búsqueda por ID de preferencia
    List<PaymentTransaction> findByAppointmentId(Long appointmentId); // Pagos vinculados a una cita
    PaymentTransaction save(PaymentTransaction transaction); // Guarda la transacción
}
