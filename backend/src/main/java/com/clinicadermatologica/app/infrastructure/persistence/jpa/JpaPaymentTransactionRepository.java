package com.clinicadermatologica.app.infrastructure.persistence.jpa;

import com.clinicadermatologica.app.domain.model.PaymentTransaction; // Entidad PaymentTransaction
import org.springframework.data.jpa.repository.JpaRepository; // Spring Data JPA
import org.springframework.stereotype.Repository; // Componente de repositorio

import java.util.List; // Colección de lista
import java.util.Optional; // Contenedor opcional

/**
 * Repositorio Spring Data JPA para transacciones de pago.
 */
@Repository // Componente Spring Data
public interface JpaPaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    Optional<PaymentTransaction> findByMpPaymentId(String mpPaymentId); // Búsqueda por ID de pago de MercadoPago
    Optional<PaymentTransaction> findByMpPreferenceId(String mpPreferenceId); // Búsqueda por ID de preferencia
    List<PaymentTransaction> findByAppointmentIdOrderByCreatedAtAsc(Long appointmentId); // Historial de pagos de la cita
}
