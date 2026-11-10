package com.clinicadermatologica.app.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore; // Evita lazy initialization exceptions al serializar
import com.fasterxml.jackson.annotation.JsonProperty; // Expone campos calculados en JSON
import jakarta.persistence.*; // Importa anotaciones JPA estándar
import lombok.*; // Generadores de código Lombok
import org.hibernate.annotations.CreationTimestamp; // Fecha de creación inmutable
import org.hibernate.annotations.JdbcTypeCode; // Mapeo de tipos JDBC para Hibernate 6
import org.hibernate.type.SqlTypes; // Tipos SQL estándar para Hibernate

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

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY) // Historia clínica modificada
    @JoinColumn(name = "historia_clinica_id", nullable = false)
    private MedicalRecord medicalRecord;

    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "passwordHash"})
    @ManyToOne(fetch = FetchType.LAZY) // Médica responsable de la modificación
    @JoinColumn(name = "modified_by_user_id", nullable = false)
    private User modifiedByUser;

    @Column(name = "modified_section", nullable = false, length = 100) // Sección modificada (ej. 'ANTECEDENTES', 'ALERGIAS')
    private String modifiedSection;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "previous_values", nullable = false, columnDefinition = "jsonb") // Snapshot anterior en JSONB
    private String previousValues;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "new_values", nullable = false, columnDefinition = "jsonb") // Snapshot nuevo en JSONB
    private String newValues;

    @CreationTimestamp // Timestamp inmutable del evento de auditoría (columna HCA-updated_at según especificación)
    @Column(name = "updated_at", nullable = false, updatable = false)
    private Instant updatedAt;
}
