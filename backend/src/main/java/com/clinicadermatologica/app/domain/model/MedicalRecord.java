package com.clinicadermatologica.app.domain.model;

import jakarta.persistence.*; // Importa anotaciones JPA estándar
import lombok.*; // Generadores de código Lombok
import org.hibernate.annotations.CreationTimestamp; // Fecha de creación
import org.hibernate.annotations.UpdateTimestamp; // Fecha de actualización

import java.time.Instant; // Representación de tiempo UTC

/**
 * Entidad de Dominio que representa la Historia Clínica Base (Ficha Anamnesis) del Paciente.
 * Mantiene una relación 1:1 estricta con el Paciente.
 */
@Entity // Entidad JPA
@Table(name = "historia_clinica") // Mapea a 'historia_clinica'
@Getter // Getters automáticos
@Setter // Setters automáticos
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
public class MedicalRecord {

    @Id // Clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // BIGSERIAL autoincremental
    private Long id;

    @OneToOne(fetch = FetchType.LAZY) // Relación uno a uno estricta con el paciente
    @JoinColumn(name = "paciente_id", nullable = false, unique = true) // Clave foránea única
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY) // Médica que confeccionó la ficha médica inicial
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private User createdByUser;

    // --- ANTECEDENTES PATOLÓGICOS (Banderas booleanas atómicas según heurística 1FN) ---
    @Column(name = "has_hta", nullable = false) // Hipertensión arterial
    @Builder.Default
    private Boolean hasHta = false;

    @Column(name = "has_dbt", nullable = false) // Diabetes
    @Builder.Default
    private Boolean hasDbt = false;

    @Column(name = "has_hypothyroidism", nullable = false) // Hipotiroidismo
    @Builder.Default
    private Boolean hasHypothyroidism = false;

    @Column(name = "has_hyperthyroidism", nullable = false) // Hipertiroidismo
    @Builder.Default
    private Boolean hasHyperthyroidism = false;

    @Column(name = "has_anemia", nullable = false) // Anemia
    @Builder.Default
    private Boolean hasAnemia = false;

    @Column(name = "has_autoimmune_diseases", nullable = false) // Enfermedades autoinmunes
    @Builder.Default
    private Boolean hasAutoimmuneDiseases = false;

    @Column(name = "has_glaucoma", nullable = false) // Glaucoma
    @Builder.Default
    private Boolean hasGlaucoma = false;

    @Column(name = "has_coagulation_disorders", nullable = false) // Trastornos de coagulación
    @Builder.Default
    private Boolean hasCoagulationDisorders = false;

    @Column(name = "has_scarring_alterations", nullable = false) // Alteraciones de cicatrización
    @Builder.Default
    private Boolean hasScarringAlterations = false;

    @Column(name = "other_pathological", columnDefinition = "TEXT") // Detalle de otras patologías
    private String otherPathological;

    // --- ALERGIAS ---
    @Column(name = "allergy_anesthesia", nullable = false) // Alergia a anestésicos locales
    @Builder.Default
    private Boolean allergyAnesthesia = false;

    @Column(name = "allergy_egg", nullable = false) // Alergia al huevo
    @Builder.Default
    private Boolean allergyEgg = false;

    @Column(name = "allergy_fish", nullable = false) // Alergia al pescado
    @Builder.Default
    private Boolean allergyFish = false;

    @Column(name = "other_allergies", columnDefinition = "TEXT") // Detalle de otras alergias
    private String otherAllergies;

    // --- TÓXICOS Y HÁBITOS ---
    @Column(name = "habit_tobacco", nullable = false) // Tabaquismo
    @Builder.Default
    private Boolean habitTobacco = false;

    @Column(name = "habit_alcohol", nullable = false) // Consumo de alcohol
    @Builder.Default
    private Boolean habitAlcohol = false;

    @Column(name = "habit_sun_exposure", nullable = false) // Exposición solar
    @Builder.Default
    private Boolean habitSunExposure = false;

    @Column(name = "habit_spf_use", nullable = false) // Uso regular de protector solar
    @Builder.Default
    private Boolean habitSpfUse = false;

    // --- ANTECEDENTES QUIRÚRGICOS, GINECOLÓGICOS Y ESTÉTICOS ---
    @Column(name = "surgical_history", columnDefinition = "TEXT") // Cirugías previas
    private String surgicalHistory;

    @Column(name = "gynecological_history", columnDefinition = "TEXT") // FUM, embarazo, lactancia
    private String gynecologicalHistory;

    @Column(name = "current_medications", columnDefinition = "TEXT") // Medicación habitual
    private String currentMedications;

    @Column(name = "previous_aesthetic_treatments", columnDefinition = "TEXT") // Tratamientos estéticos previos
    private String previousAestheticTreatments;

    // --- EVALUACIÓN CLÍNICA INICIAL ---
    @Column(name = "fitzpatrick_phototype", nullable = false, length = 10) // Fototipo Fitzpatrick ('I' a 'VI')
    private String fitzpatrickPhototype;

    @Column(name = "physical_examination", columnDefinition = "TEXT") // Examen físico facial y corporal
    private String physicalExamination;

    @Column(name = "treatment_plan", columnDefinition = "TEXT") // Plan de tratamiento propuesto
    private String treatmentPlan;

    @Column(name = "informed_consent_signed", nullable = false) // Consentimiento informado firmado
    @Builder.Default
    private Boolean informedConsentSigned = false;

    @CreationTimestamp // Fecha automática de alta
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp // Fecha automática de última edición
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
