package com.clinicadermatologica.app.presentation.dto;

import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

/**
 * DTO de respuesta con los datos de un paciente.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientResponseDTO {
    private Long id;
    private String name;
    private String dni;
    private String phone;
    private String email;
    private LocalDate birthDate;
    private Boolean active;
    private Instant createdAt;
}
