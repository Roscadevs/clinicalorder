package com.clinicadermatologica.app.infrastructure.persistence.jpa;

import com.clinicadermatologica.app.domain.model.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
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

    @Query(value = "SELECT sp_alta_transaccion_pago(:citaId, :paymentType, :paymentConcept, :amount, :status, :registeredByUserId, :mpPreferenceId, :mpPaymentId)", nativeQuery = true)
    Long executeSpAltaTransaccionPago(
            @Param("citaId") Long citaId,
            @Param("paymentType") String paymentType,
            @Param("paymentConcept") String paymentConcept,
            @Param("amount") BigDecimal amount,
            @Param("status") String status,
            @Param("registeredByUserId") Long registeredByUserId,
            @Param("mpPreferenceId") String mpPreferenceId,
            @Param("mpPaymentId") String mpPaymentId
    );
}
