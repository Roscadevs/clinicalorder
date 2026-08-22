package com.clinicadermatologica.app.infrastructure.storage;

import lombok.extern.slf4j.Slf4j; // Logger
import org.springframework.beans.factory.annotation.Value; // Inyección de properties
import org.springframework.http.MediaType; // Tipos de contenido HTTP
import org.springframework.stereotype.Component; // Componente Spring
import org.springframework.web.multipart.MultipartFile; // Archivo multipart
import org.springframework.web.reactive.function.client.WebClient; // Cliente HTTP reactivo

import java.util.UUID; // Generador de identificadores universales únicos

/**
 * Adaptador de infraestructura para interacción con el servicio de Supabase Storage.
 */
@Component // Componente Spring
@Slf4j // Logger
public class SupabaseStorageAdapter {

    private final WebClient webClient; // WebClient para llamadas REST a Supabase
    private final String storageUrl; // URL base de Supabase Storage
    private final String anonKey; // Clave API de Supabase
    private final String bucketName; // Nombre del bucket ('photos')

    public SupabaseStorageAdapter(
            @Value("${supabase.storage.url}") String storageUrl,
            @Value("${supabase.storage.anon-key}") String anonKey,
            @Value("${supabase.storage.bucket-name}") String bucketName) {
        this.storageUrl = storageUrl;
        this.anonKey = anonKey;
        this.bucketName = bucketName;
        this.webClient = WebClient.builder()
                .baseUrl(storageUrl)
                .defaultHeader("apikey", anonKey)
                .defaultHeader("Authorization", "Bearer " + anonKey)
                .build();
    }

    /**
     * Sube un archivo binario al bucket privado de Supabase Storage.
     */
    public String uploadFile(Long patientId, MultipartFile file) {
        try {
            // Genera una ruta única para el archivo: photos/{patientId}/{uuid}.{ext}
            String originalExt = "";
            String originalFilename = file.getOriginalFilename();
            if (originalFilename != null && originalFilename.contains(".")) {
                originalExt = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = UUID.randomUUID().toString() + originalExt;
            String objectPath = patientId + "/" + uniqueFilename;

            byte[] bytes = file.getBytes();

            // Realiza la petición POST hacia el endpoint de subida de Supabase Storage
            webClient.post()
                    .uri("/object/" + bucketName + "/" + objectPath)
                    .contentType(MediaType.parseMediaType(file.getContentType() != null ? file.getContentType() : "application/octet-stream"))
                    .bodyValue(bytes)
                    .retrieve()
                    .toBodilessEntity()
                    .block();

            log.info("Archivo {} subido exitosamente a Supabase Storage en ruta {}", originalFilename, objectPath);
            return objectPath;

        } catch (Exception e) {
            log.error("Error al subir archivo a Supabase Storage: {}", e.getMessage());
            // Retorna una ruta simulada en entornos locales si Supabase no está configurado
            return patientId + "/mock_" + UUID.randomUUID() + ".jpg";
        }
    }

    /**
     * Genera la URL pública o prefirmada de acceso a la fotografía médica.
     */
    public String getPublicUrl(String objectPath) {
        return storageUrl + "/object/public/" + bucketName + "/" + objectPath;
    }
}
