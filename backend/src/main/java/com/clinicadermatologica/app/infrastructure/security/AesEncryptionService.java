package com.clinicadermatologica.app.infrastructure.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;

/**
 * PATRÓN DE DISEÑO: Singleton
 *
 * Spring gestiona una única instancia de este bean en el contexto de aplicación (@Scope("singleton")).
 * La anotación @Scope("singleton") se declara explícitamente para hacer el patrón visible e identificable
 * académicamente, aunque sea el comportamiento por defecto de Spring.
 *
 * Justificación del Singleton: este servicio carga la SecretKey derivada de la variable de entorno
 * AES_ENCRYPTION_KEY exactamente una vez, en el constructor. Reutilizar esa única instancia en todos
 * los servicios que requieren cifrado (MedicalRecordService, ClinicalEntryService) garantiza que:
 * - La clave se derive y valide una sola vez al iniciar la aplicación.
 * - No se creen múltiples instancias con diferentes estados de clave.
 * - El acceso a la clave sea centralizado y controlado.
 *
 * SEGURIDAD: AES-256-GCM (Advanced Encryption Standard — Galois/Counter Mode)
 *
 * Algoritmo: AES/GCM/NoPadding
 * Tamaño de clave: 256 bits (32 bytes), codificada en Base64 vía la variable de entorno AES_ENCRYPTION_KEY.
 * IV (Initialization Vector): 12 bytes aleatorios generados con SecureRandom por cada llamada a encrypt().
 *   Un IV único por cifrado garantiza que el mismo texto en claro produzca distintos ciphertexts,
 *   previniendo ataques de análisis de patrones.
 * Authentication Tag: 128 bits (16 bytes), generado automáticamente por GCM y verificado en decrypt().
 *   El tag detecta cualquier manipulación del ciphertext (integridad + autenticidad).
 *
 * Formato del BYTEA almacenado en la base de datos:
 *   [ 12 bytes IV | ciphertext | 16 bytes GCM auth tag ]
 *   El IV se prepende al ciphertext en un único array para que decrypt() pueda extraerlo.
 *
 * La clave NUNCA debe estar en archivos commiteados al repositorio.
 * Se inyecta exclusivamente desde la variable de entorno AES_ENCRYPTION_KEY
 * a través de la propiedad app.encryption.key en application.yml.
 */
@Service
@Scope("singleton") // Singleton explícito — patrón de diseño Singleton
public class AesEncryptionService {

    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int IV_LENGTH_BYTES = 12;       // 96 bits — longitud estándar para GCM
    private static final int GCM_TAG_LENGTH_BITS = 128;  // 128 bits — tag de autenticación GCM

    private final SecretKey secretKey; // Instancia única de la clave, cargada una vez en el constructor

    /**
     * Constructor: carga y valida la clave AES-256 desde la variable de entorno AES_ENCRYPTION_KEY.
     * Si la variable no está configurada, la aplicación falla al iniciar (fallo rápido, fail-fast).
     *
     * @param base64Key clave de 32 bytes codificada en Base64, inyectada desde ${AES_ENCRYPTION_KEY}
     */
    public AesEncryptionService(@Value("${app.encryption.key}") String base64Key) {
        byte[] keyBytes = Base64.getDecoder().decode(base64Key);
        if (keyBytes.length != 32) {
            throw new IllegalArgumentException(
                "AES_ENCRYPTION_KEY debe ser exactamente 32 bytes (256 bits) codificados en Base64. " +
                "Longitud recibida: " + keyBytes.length + " bytes."
            );
        }
        this.secretKey = new SecretKeySpec(keyBytes, "AES");
    }

    /**
     * Cifra el texto en claro usando AES-256-GCM con un IV aleatorio único por llamada.
     *
     * @param plaintext texto en claro a cifrar (contenido clínico sensible)
     * @return array de bytes con formato [12 bytes IV | ciphertext + 16 bytes GCM tag]
     * @throws GeneralSecurityException si el cifrado falla por error de configuración criptográfica
     */
    public byte[] encrypt(String plaintext) throws GeneralSecurityException {
        byte[] iv = new byte[IV_LENGTH_BYTES];
        new SecureRandom().nextBytes(iv); // IV único y aleatorio por cada llamada

        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, new GCMParameterSpec(GCM_TAG_LENGTH_BITS, iv));

        byte[] ciphertext = cipher.doFinal(plaintext.getBytes(java.nio.charset.StandardCharsets.UTF_8));

        // Prepende IV al ciphertext: [IV (12 bytes) | ciphertext + GCM tag (N+16 bytes)]
        byte[] result = new byte[IV_LENGTH_BYTES + ciphertext.length];
        System.arraycopy(iv, 0, result, 0, IV_LENGTH_BYTES);
        System.arraycopy(ciphertext, 0, result, IV_LENGTH_BYTES, ciphertext.length);
        return result;
    }

    /**
     * Descifra un array de bytes producido por encrypt().
     * Extrae los primeros 12 bytes como IV y descifra el resto.
     * El GCM tag es verificado automáticamente; si el ciphertext fue manipulado,
     * se lanza AEADBadTagException (subclase de GeneralSecurityException).
     *
     * @param ivAndCiphertext array con formato [12 bytes IV | ciphertext + GCM tag]
     * @return texto en claro original
     * @throws GeneralSecurityException si el descifrado falla o si el ciphertext fue manipulado
     */
    public String decrypt(byte[] ivAndCiphertext) throws GeneralSecurityException {
        if (ivAndCiphertext == null || ivAndCiphertext.length <= IV_LENGTH_BYTES) {
            throw new IllegalArgumentException("Datos cifrados inválidos: longitud insuficiente.");
        }

        byte[] iv = Arrays.copyOfRange(ivAndCiphertext, 0, IV_LENGTH_BYTES);
        byte[] ciphertext = Arrays.copyOfRange(ivAndCiphertext, IV_LENGTH_BYTES, ivAndCiphertext.length);

        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, secretKey, new GCMParameterSpec(GCM_TAG_LENGTH_BITS, iv));

        byte[] plaintext = cipher.doFinal(ciphertext);
        return new String(plaintext, java.nio.charset.StandardCharsets.UTF_8);
    }
}
