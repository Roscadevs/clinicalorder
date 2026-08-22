package com.clinicadermatologica.app.domain.model;

import jakarta.persistence.*; // Importa anotaciones JPA estándar
import lombok.*; // Generadores de código Lombok
import org.hibernate.annotations.CreationTimestamp; // Fecha de creación
import org.hibernate.annotations.UpdateTimestamp; // Fecha de actualización

import java.time.Instant; // Representación de tiempo UTC

/**
 * Entidad de Dominio que representa una Nota de Evolución Clínica de una sesión específica.
 */
@Entity // Entidad JPA
@Table(name = "entrada_hc") // Mapea a 'entrada_hc'
@Getter // Getters automáticos
@Setter // Setters automáticos
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
public class ClinicalEntry {

    @Id // Clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // BIGSERIAL autoincremental
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // Relación con la historia clínica general
    @JoinColumn(name = "historia_clinica_id", nullable = false)
    private MedicalRecord medicalRecord;

    @ManyToOne(fetch = FetchType.LAZY) // Relación con el turno correspondiente a la sesión
    @JoinColumn(name = "cita_id", nullable = false)
    private Appointment appointment;

    @ManyToOne(fetch = FetchType.LAZY) // Médica dermatóloga que redactó la evolución
    @JoinColumn(name = "author_user_id", nullable = false)
    private User authorUser;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT") // Contenido médico de evolución
    private String content;

    @CreationTimestamp // Fecha automática de redacción
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp // Fecha automática de última edición
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
