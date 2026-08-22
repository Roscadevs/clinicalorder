package com.clinicadermatologica.app.domain.model;

import jakarta.persistence.*; // Importa anotaciones JPA estándar
import lombok.*; // Generadores de código Lombok
import org.hibernate.annotations.CreationTimestamp; // Fecha inmutable de auditoría

import java.time.Instant; // Representación de tiempo UTC

/**
 * Entidad de Auditoría Inmutable para cambios en las notas de evolución clínica.
 */
@Entity // Entidad JPA
@Table(name = "entrada_hc_audit") // Mapea a 'entrada_hc_audit'
@Getter // Getters automáticos
@Setter // Setters automáticos
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
public class ClinicalEntryAudit {

    @Id // Clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // BIGSERIAL autoincremental
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // Entrada clínica que fue editada
    @JoinColumn(name = "entrada_hc_id", nullable = false)
    private ClinicalEntry clinicalEntry;

    @ManyToOne(fetch = FetchType.LAZY) // Médica que efectuó la modificación
    @JoinColumn(name = "modified_by_user_id", nullable = false)
    private User modifiedByUser;

    @Column(name = "previous_content", nullable = false, columnDefinition = "TEXT") // Contenido anterior
    private String previousContent;

    @Column(name = "new_content", nullable = false, columnDefinition = "TEXT") // Contenido nuevo
    private String newContent;

    @CreationTimestamp // Marca temporal inmutable del evento de auditoría
    @Column(name = "modified_at", nullable = false, updatable = false)
    private Instant modifiedAt;
}
