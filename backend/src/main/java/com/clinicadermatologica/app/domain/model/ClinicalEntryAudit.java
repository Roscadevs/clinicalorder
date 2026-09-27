package com.clinicadermatologica.app.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

/**
 * Entidad de Auditoría Inmutable para cambios en las notas de evolución clínica.
 *
 * SEGURIDAD: previousContent y newContent almacenan el contenido cifrado (AES-256-GCM) como BYTEA,
 * exactamente como se almacena en ClinicalEntry.content. El contenido nunca se guarda en texto plano
 * en ninguna tabla de la base de datos.
 *
 * Los registros de auditoría son históricos: no se modifican ni eliminan una vez generados.
 */
@Entity
@Table(name = "entrada_hc_audit")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClinicalEntryAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entrada_hc_id", nullable = false)
    private ClinicalEntry clinicalEntry;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "modified_by_user_id", nullable = false)
    private User modifiedByUser;

    @Column(name = "previous_content", nullable = false, columnDefinition = "BYTEA") // Cifrado AES-256-GCM
    private byte[] previousContent;

    @Column(name = "new_content", nullable = false, columnDefinition = "BYTEA") // Cifrado AES-256-GCM
    private byte[] newContent;

    @CreationTimestamp
    @Column(name = "modified_at", nullable = false, updatable = false)
    private Instant modifiedAt;
}
