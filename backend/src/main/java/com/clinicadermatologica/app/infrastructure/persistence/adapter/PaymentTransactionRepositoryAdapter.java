package com.clinicadermatologica.app.infrastructure.persistence.adapter;

import com.clinicadermatologica.app.domain.model.PaymentTransaction; // Entidad PaymentTransaction
import com.clinicadermatologica.app.domain.repository.PaymentTransactionRepository; // Interfaz PaymentTransactionRepository
import com.clinicadermatologica.app.infrastructure.persistence.jpa.JpaPaymentTransactionRepository; // Repositorio JPA
import lombok.RequiredArgsConstructor; // Inyección por constructor
import org.springframework.stereotype.Component; // Componente Spring

import java.util.List; // Colección de lista
import java.util.Optional; // Contenedor opcional

/**
 * Adaptador de infraestructura para las transacciones de pago.
 */
@Component // Componente Spring
@RequiredArgsConstructor // Inyección por constructor
public class PaymentTransactionRepositoryAdapter implements PaymentTransactionRepository {

    private final JpaPaymentTransactionRepository jpaRepository; // Inyección del repositorio JPA

    @Override
    public Optional<PaymentTransaction> findById(Long id) {
        return jpaRepository.findById(id); // Delega la búsqueda
    }

    @Override
    public Optional<PaymentTransaction> findByMpPaymentId(String mpPaymentId) {
        return jpaRepository.findByMpPaymentId(mpPaymentId); // Búsqueda por ID de MercadoPago
    }

    @Override
    public Optional<PaymentTransaction> findByMpPreferenceId(String mpPreferenceId) {
        return jpaRepository.findByMpPreferenceId(mpPreferenceId); // Búsqueda por ID de preferencia
    }

    @Override
    public List<PaymentTransaction> findByAppointmentId(Long appointmentId) {
        return jpaRepository.findByAppointmentIdOrderByCreatedAtAsc(appointmentId); // Historial de pagos
    }

    @Override
    public PaymentTransaction save(PaymentTransaction transaction) {
        return jpaRepository.save(transaction); // Persistencia de la transacción
    }
}
