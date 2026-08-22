package com.clinicadermatologica.app.domain.model;

import jakarta.persistence.*; // Importa anotaciones JPA estándar
import lombok.*; // Generadores de código Lombok
import org.hibernate.annotations.CreationTimestamp; // Fecha de creación inmutable

import java.time.Instant; // Representación de tiempo UTC

/**
 * Entidad de Auditoría Inmutable para cambios en la Ficha Médica Base.
 */
@Entity // Entidad JPA
@Table(name = "historia_clinica_audit") // Mapea a 'historia_clinica_audit'
@Getter // Getters automáticos
@Setter // Setters automáticos
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
public class MedicalRecordAudit {

    @Id // Clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // BIGSERIAL autoincremental
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // Historia clínica modificada
    @JoinColumn(name = "historia_clinica_id", nullable = false)
    private MedicalRecord medicalRecord;

    @ManyToOne(fetch = FetchType.LAZY) // Médica responsable de la modificación
    @JoinColumn(name = "modified_by_user_id", nullable = false)
    private User modifiedByUser;

    @Column(name = "modified_section", nullable = false, length = 100) // Sección modificada (ej. 'ANTECEDENTES', 'ALERGIAS')
    private String modifiedSection;

    @Column(name = "previous_values", nullable = false, columnDefinition = "jsonb") // Snapshot anterior en JSONB
    private String previousValues;

    @Column(name = "new_values", nullable = false, columnDefinition = "jsonb") // Snapshot nuevo en JSONB
    private String newValues;

    @CreationTimestamp // Timestamp inmutable del evento de auditoría
    @Column(name = "modified_at", nullable = false, updatable = false)
    private Instant modifiedAt;
}
