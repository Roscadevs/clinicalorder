package com.clinicadermatologica.app.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

/**
 * Entidad de Dominio que almacena los metadatos de fotografías médicas y estéticas del paciente.
 * Los archivos binarios residen en Supabase Storage (bucket S3-compatible).
 *
 * CAMBIO DE MODELO:
 * Las imágenes ahora están asociadas a una entrada clínica específica (ClinicalEntry)
 * en lugar de a la historia clínica general (MedicalRecord).
 * Esto refleja la regla del negocio: una imagen documenta lo ocurrido en una sesión concreta.
 */
@Entity
@Table(name = "imagen_hc")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClinicalImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entrada_hc_id", nullable = false) // FK a la entrada clínica de la sesión
    private ClinicalEntry clinicalEntry;

    @Column(name = "file_path", nullable = false, unique = true, length = 500) // Ruta en Supabase Storage
    private String filePath;

    @Column(name = "original_filename", nullable = false, length = 255)
    private String originalFilename;

    @Column(name = "content_type", nullable = false, length = 50) // Solo image/jpeg o image/png
    private String contentType;

    @Column(name = "file_size", nullable = false) // Tamaño en bytes; máximo 10 MB validado en servicio
    private Long fileSize;

    @Column(name = "description", length = 500)
    private String description;

    @CreationTimestamp
    @Column(name = "uploaded_at", nullable = false, updatable = false)
    private Instant uploadedAt;
}
