package com.clinicadermatologica.app.presentation.dto;

import com.clinicadermatologica.app.domain.model.AppointmentStatus;
import com.clinicadermatologica.app.domain.model.PaymentConcept;
import com.clinicadermatologica.app.domain.model.PaymentType;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Resultado del registro de un pago. Contiene los datos que muestra el comprobante:
 * medio de pago, concepto, monto, fecha del pago y estado final del turno.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentReceiptDTO {
    private Long appointmentId;
    private Long transactionId;
    private PaymentType paymentType;
    private PaymentConcept concept;
    private BigDecimal amount;
    private Instant paymentDate;
    private AppointmentStatus appointmentStatus;
}
