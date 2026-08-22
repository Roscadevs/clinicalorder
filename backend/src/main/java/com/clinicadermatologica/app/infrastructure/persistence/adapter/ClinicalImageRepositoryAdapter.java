package com.clinicadermatologica.app.infrastructure.persistence.adapter;

import com.clinicadermatologica.app.domain.model.ClinicalImage; // Entidad del dominio
import com.clinicadermatologica.app.domain.repository.ClinicalImageRepository; // Interfaz del dominio
import com.clinicadermatologica.app.infrastructure.persistence.jpa.JpaClinicalImageRepository; // JPA Repository
import lombok.RequiredArgsConstructor; // Inyección por constructor
import org.springframework.stereotype.Component; // Componente Spring

import java.util.List; // Colección de lista
import java.util.Optional; // Contenedor opcional

/**
 * Adaptador de infraestructura para los metadatos de fotografías médicas.
 */
@Component // Componente Spring
@RequiredArgsConstructor // Inyección por constructor
public class ClinicalImageRepositoryAdapter implements ClinicalImageRepository {

    private final JpaClinicalImageRepository jpaRepository; // Inyección del repositorio JPA

    @Override
    public Optional<ClinicalImage> findById(Long id) {
        return jpaRepository.findById(id); // Delega la búsqueda por ID
    }

    @Override
    public List<ClinicalImage> findByMedicalRecordId(Long medicalRecordId) {
        return jpaRepository.findByMedicalRecordIdOrderByUploadedAtDesc(medicalRecordId); // Fotos por historia
    }

    @Override
    public ClinicalImage save(ClinicalImage image) {
        return jpaRepository.save(image); // Persiste los metadatos de la imagen
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id); // Elimina los metadatos
    }
}
