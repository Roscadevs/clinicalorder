package com.clinicadermatologica.app.presentation.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.Instant;
import java.util.List;

/**
 * DTO para lectura y actualización de la Historia Clínica Base estructurada.
 *
 * physicalExamination: viaja como String en el DTO (texto en claro).
 * MedicalRecordService cifra antes de persistir y descifra al leer — la capa de presentación
 * nunca manipula bytes cifrados directamente.
 *
 * Las entidades débiles (alergias, antecedentes, hábitos) se incluyen en la lectura
 * como listas embebidas, pero su escritura se realiza mediante endpoints sub-recurso dedicados.
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecordDTO {

    private Long id;
    private Long patientId;
    private String patientName;
    private String patientDni;

    // --- FOTOTIPO DE PIEL ---
    @NotNull(message = "El fototipo de Fitzpatrick es obligatorio")
    @Min(value = 1, message = "El fototipo de Fitzpatrick debe estar entre 1 y 6")
    @Max(value = 6, message = "El fototipo de Fitzpatrick debe estar entre 1 y 6")
    private Integer fitzpatrickPhototype;

    // --- EXAMEN FÍSICO (texto en claro en el DTO; cifrado en BD) ---
    private String physicalExamination;

    // --- CONSENTIMIENTO INFORMADO ---
    private Boolean informedConsentSigned;

    // --- ANTECEDENTES EN TEXTO LIBRE ---
    private String gynecologicalHistory;
    private String surgicalHistory;
    private String currentMedications;
    private String previousAestheticTreatments;

    // --- ENTIDADES DÉBILES (solo lectura embebida; escritura via sub-recursos) ---
    private List<AlergiaResponseDTO> alergias;
    private List<AntecedentePatologicoResponseDTO> antecedentesPatologicos;
    private List<HabitoResponseDTO> habitos;

    private Instant createdAt;
    private Instant updatedAt;
}
