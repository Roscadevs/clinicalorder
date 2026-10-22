package com.clinicadermatologica.app.presentation.controller;

import com.clinicadermatologica.app.application.service.AppointmentService; // Servicio de citas
import com.clinicadermatologica.app.application.service.PaymentService; // Servicio de pagos
import com.clinicadermatologica.app.presentation.dto.*; // DTOs
import jakarta.validation.Valid; // Validador
import lombok.RequiredArgsConstructor; // Inyección por constructor
import org.springframework.format.annotation.DateTimeFormat; // Formato de fecha
import org.springframework.http.HttpStatus; // Códigos HTTP
import org.springframework.http.ResponseEntity; // Wrapper de respuesta
import org.springframework.security.access.prepost.PreAuthorize; // Seguridad declarativa
import org.springframework.web.bind.annotation.*; // Anotaciones REST

import java.time.Instant; // Tiempo UTC
import java.time.LocalDate; // Fecha
import java.util.List; // Listas

/**
 * Controlador REST para la gestión de turnos, disponibilidad en tiempo real y liquidación de saldos.
 */
@RestController // Controlador REST
@RequestMapping("/citas") // Ruta /api/v1/citas
@RequiredArgsConstructor // Inyección por constructor
public class AppointmentController {

    private final AppointmentService appointmentService; // Servicio de citas
    private final PaymentService paymentService; // Servicio de pagos

    /**
     * Endpoint público para consultar franjas horarias disponibles en tiempo real.
     */
    @GetMapping("/disponibilidad") // Mapea HTTP GET /api/v1/citas/disponibilidad?fecha=YYYY-MM-DD&servicioId=X
    public ResponseEntity<List<TimeSlotDTO>> getAvailableSlots(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
            @RequestParam Long servicioId) {
        return ResponseEntity.ok(appointmentService.getAvailableSlots(fecha, servicioId));
    }

    /**
     * Endpoint público que bloquea el turno por 10 minutos y retorna el link de Checkout Pro de MercadoPago.
     */
    @PostMapping("/reservar-temporal") // Mapea HTTP POST /api/v1/citas/reservar-temporal
    public ResponseEntity<PaymentPreferenceResponseDTO> bookTemporaryHold(
            @Valid @RequestBody BookAppointmentRequestDTO request,
            @RequestParam(required = false) Long userId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(appointmentService.bookTemporaryHold(request, userId));
    }

    /**
     * Consulta la agenda de turnos en un rango de fechas (para Médica y Secretaria).
     */
    @GetMapping("/agenda") // Mapea HTTP GET /api/v1/citas/agenda?start=...&end=...
    @PreAuthorize("hasAnyRole('DOCTORA', 'SECRETARIA', 'ADMIN')")
    public ResponseEntity<List<AppointmentResponseDTO>> getAgenda(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant end) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByRange(start, end));
    }

    /**
     * Consulta el detalle de una cita específica por su identificador.
     */
    @GetMapping("/{id}") // Mapea HTTP GET /api/v1/citas/{id}
    @PreAuthorize("hasAnyRole('DOCTORA', 'SECRETARIA', 'ADMIN')")
    public ResponseEntity<AppointmentResponseDTO> getAppointmentById(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(id));
    }

    /**
     * Endpoint público para verificar el estado de acreditación de un turno tras pagar en Mercado Pago.
     */
    @GetMapping("/{id}/estado") // Mapea HTTP GET /api/v1/citas/{id}/estado
    public ResponseEntity<java.util.Map<String, Object>> getAppointmentStatus(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.getAppointmentPublicStatus(id));
    }

    /**
     * Cancela un turno previamente agendado.
     */
    @PostMapping("/{id}/cancelar") // Mapea HTTP POST /api/v1/citas/{id}/cancelar
    @PreAuthorize("hasAnyRole('DOCTORA', 'SECRETARIA', 'ADMIN')")
    public ResponseEntity<Void> cancelAppointment(@PathVariable Long id) {
        appointmentService.cancelAppointment(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Registra el cobro final en mostrador y finaliza la cita.
     */
    @PostMapping("/{id}/liquidar-saldo") // Mapea HTTP POST /api/v1/citas/{id}/liquidar-saldo
    @PreAuthorize("hasAnyRole('SECRETARIA', 'ADMIN', 'DOCTORA')")
    public ResponseEntity<PaymentReceiptDTO> finalizePayment(
            @PathVariable Long id,
            @Valid @RequestBody FinalizePaymentRequestDTO request,
            @RequestParam Long receptionistUserId) {
        PaymentReceiptDTO receipt = paymentService.registerFinalPayment(id, request, receptionistUserId);
        return ResponseEntity.ok(receipt);
    }

    /**
     * Marca un turno como atendido (acto clínico). Sólo la médica o el administrador.
     * El turno pasa de CONFIRMED a ATTENDED; el cobro del saldo es posterior.
     */
    @PostMapping("/{id}/atender") // Mapea HTTP POST /api/v1/citas/{id}/atender
    @PreAuthorize("hasAnyRole('DOCTORA', 'ADMIN')")
    public ResponseEntity<Void> markAsAttended(@PathVariable Long id) {
        appointmentService.markAsAttended(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Caso de uso "Registrar Pago": registra la seña (efectivo o transferencia) de un turno
     * bloqueado temporalmente y lo confirma. Devuelve los datos para el comprobante.
     */
    @PostMapping("/{id}/registrar-pago") // Mapea HTTP POST /api/v1/citas/{id}/registrar-pago
    @PreAuthorize("hasAnyRole('SECRETARIA', 'ADMIN', 'DOCTORA')")
    public ResponseEntity<PaymentReceiptDTO> registerDepositPayment(
            @PathVariable Long id,
            @Valid @RequestBody RegisterPaymentRequestDTO request,
            @RequestParam Long userId) {
        return ResponseEntity.ok(paymentService.registerDepositPayment(id, request, userId));
    }
}
