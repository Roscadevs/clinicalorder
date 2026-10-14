package com.clinicadermatologica.app.infrastructure.persistence.dao;

import com.clinicadermatologica.app.domain.model.PaymentStatus;
import com.clinicadermatologica.app.domain.model.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * PATRÓN DAO (Data Access Object) para las transacciones de pago.
 *
 * Encapsula el acceso a datos de la entidad PaymentTransaction mediante Spring Data JPA.
 */
@Repository
public interface PaymentTransactionDAO extends JpaRepository<PaymentTransaction, Long> {

    Optional<PaymentTransaction> findByMpPaymentId(String mpPaymentId);
    Optional<PaymentTransaction> findByMpPreferenceId(String mpPreferenceId);
    List<PaymentTransaction> findByStatus(PaymentStatus status);

    /** Historial de pagos de una cita, ordenado cronológicamente por fecha de creación. */
    @Query("SELECT t FROM PaymentTransaction t WHERE t.appointment.id = :appointmentId ORDER BY t.createdAt ASC")
    List<PaymentTransaction> findByAppointmentId(@Param("appointmentId") Long appointmentId);
}
