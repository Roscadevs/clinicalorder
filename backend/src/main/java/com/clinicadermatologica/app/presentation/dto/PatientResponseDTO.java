package com.clinicadermatologica.app.presentation.dto;

import lombok.*; // Generadores Lombok

import java.time.Instant; // Tipos de tiempo UTC
import java.time.LocalDate; // Fecha de nacimiento

/**
 * DTO de respuesta con los datos de un paciente.
 */
@Getter // Genera getters
@Setter // Genera setters
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
public class PatientResponseDTO {
    private Long id;
    private String name;
    private String dni;
    private String phone;
    private String email;
    private LocalDate birthDate;
    private String profession;
    private Boolean active;
    private Instant createdAt;
}
