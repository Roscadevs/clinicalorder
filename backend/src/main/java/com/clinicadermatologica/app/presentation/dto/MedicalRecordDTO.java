package com.clinicadermatologica.app.presentation.dto;

import jakarta.validation.constraints.NotBlank; // Valida texto no blanco
import jakarta.validation.constraints.Pattern; // Valida expresión regular
import lombok.*; // Generadores Lombok

import java.time.Instant; // Tiempo UTC

/**
 * DTO para lectura y actualización de la Historia Clínica Base estructurada.
 */
@Getter // Genera getters
@Setter // Genera setters
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
public class MedicalRecordDTO {
    private Long id;
    private Long patientId;
    private String patientName;
    private String patientDni;

    // Antecedentes patológicos
    private Boolean hasHta;
    private Boolean hasDbt;
    private Boolean hasHypothyroidism;
    private Boolean hasHyperthyroidism;
    private Boolean hasAnemia;
    private Boolean hasAutoimmuneDiseases;
    private Boolean hasGlaucoma;
    private Boolean hasCoagulationDisorders;
    private Boolean hasScarringAlterations;
    private String otherPathological;

    // Alergias
    private Boolean allergyAnesthesia;
    private Boolean allergyEgg;
    private Boolean allergyFish;
    private String otherAllergies;

    // Hábitos
    private Boolean habitTobacco;
    private Boolean habitAlcohol;
    private Boolean habitSunExposure;
    private Boolean habitSpfUse;

    // Quirúrgicos y medicación
    private String surgicalHistory;
    private String gynecologicalHistory;
    private String currentMedications;
    private String previousAestheticTreatments;

    // Evaluación
    @NotBlank(message = "El fototipo de Fitzpatrick es obligatorio")
    @Pattern(regexp = "^(I|II|III|IV|V|VI)$", message = "El fototipo debe ser un valor entre I y VI")
    private String fitzpatrickPhototype;

    private String physicalExamination;
    private String treatmentPlan;
    private Boolean informedConsentSigned;

    private Instant createdAt;
    private Instant updatedAt;
}
