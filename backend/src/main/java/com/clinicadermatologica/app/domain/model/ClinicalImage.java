package com.clinicadermatologica.app.domain.model;

import jakarta.persistence.*; // Importa anotaciones JPA estándar
import lombok.*; // Generadores de código Lombok
import org.hibernate.annotations.CreationTimestamp; // Fecha de creación

import java.time.Instant; // Representación de tiempo UTC

/**
 * Entidad de Dominio que almacena los metadatos de fotografías médicas y estéticas del paciente.
 * Los archivos binarios residen en Supabase Storage (S3-compatible bucket).
 */
@Entity // Entidad JPA
@Table(name = "imagen_hc") // Mapea a 'imagen_hc'
@Getter // Getters automáticos
@Setter // Setters automáticos
@Builder // Habilita Builder
@NoArgsConstructor // Constructor vacío
@AllArgsConstructor // Constructor completo
public class ClinicalImage {

    @Id // Clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // BIGSERIAL autoincremental
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // Historia clínica a la que pertenece la foto
    @JoinColumn(name = "historia_clinica_id", nullable = false)
    private MedicalRecord medicalRecord;

    @Column(name = "file_path", nullable = false, unique = true, length = 255) // Ruta en el bucket de Supabase Storage
    private String filePath;

    @Column(name = "original_filename", nullable = false, length = 255) // Nombre original del archivo adjuntado
    private String originalFilename;

    @Column(name = "content_type", nullable = false, length = 50) // Formato MIME (image/jpeg, image/png)
    private String contentType;

    @Column(name = "file_size", nullable = false) // Tamaño en bytes de la imagen
    private Long fileSize;

    @Column(name = "description", length = 255) // Descripción clínica (ej. 'Evolución post-sesión 2 toxina')
    private String description;

    @CreationTimestamp // Fecha automática de carga
    @Column(name = "uploaded_at", nullable = false, updatable = false)
    private Instant uploadedAt;
}
