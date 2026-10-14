package com.clinicadermatologica.app.presentation.dto;

import lombok.*;

import java.time.Instant;

/**
 * DTO de salida con el identificador del paciente creado y la confirmación transaccional de Supabase.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientRpcResponseDTO {

    private Long patientId;
    private String message;
    private Boolean active;
    private Instant timestamp;
}
