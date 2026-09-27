package com.clinicadermatologica.app.infrastructure;

import com.clinicadermatologica.app.infrastructure.security.AesEncryptionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import javax.crypto.AEADBadTagException;
import java.security.GeneralSecurityException;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Pruebas unitarias para AesEncryptionService (Patrón Singleton).
 * Verifican las propiedades de seguridad del cifrado AES-256-GCM:
 * - Corrección del ciclo encrypt → decrypt
 * - Unicidad de IV (misma entrada produce diferentes ciphertexts)
 * - Integridad: ciphertext manipulado lanza AEADBadTagException
 * - Validación de clave: clave de longitud incorrecta falla al iniciar
 */
class AesEncryptionServiceTest {

    // Clave de prueba: 32 bytes aleatorios codificados en Base64
    // NOTA: Esta clave es SOLO para pruebas unitarias — no es un secreto real.
    private static final String TEST_KEY_BASE64 =
            Base64.getEncoder().encodeToString(new byte[]{
                    0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
                    0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10,
                    0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
                    0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F, 0x20
            });

    private AesEncryptionService aesService;

    @BeforeEach
    void setUp() {
        aesService = new AesEncryptionService(TEST_KEY_BASE64);
    }

    @Test
    @DisplayName("Ciclo completo: decrypt(encrypt(text)) debe retornar el texto original")
    void testRoundTrip() throws GeneralSecurityException {
        String plaintext = "Contenido clínico sensible: paciente con HTA y alergia a anestésicos.";

        byte[] encrypted = aesService.encrypt(plaintext);
        String decrypted = aesService.decrypt(encrypted);

        assertEquals(plaintext, decrypted, "El texto descifrado debe ser idéntico al original");
    }

    @Test
    @DisplayName("Dos cifrados del mismo texto deben producir bytes diferentes (IV único por llamada)")
    void testUniqueIvPerEncryption() throws GeneralSecurityException {
        String plaintext = "Texto de prueba con IV único";

        byte[] encrypted1 = aesService.encrypt(plaintext);
        byte[] encrypted2 = aesService.encrypt(plaintext);

        assertNotEquals(
            Base64.getEncoder().encodeToString(encrypted1),
            Base64.getEncoder().encodeToString(encrypted2),
            "El mismo texto debe producir ciphertexts distintos gracias al IV aleatorio"
        );
        // Ambos deben descifrarse correctamente a pesar de ser distintos
        assertEquals(plaintext, aesService.decrypt(encrypted1));
        assertEquals(plaintext, aesService.decrypt(encrypted2));
    }

    @Test
    @DisplayName("Ciphertext manipulado debe lanzar AEADBadTagException (integridad GCM)")
    void testTamperedCiphertextThrows() throws GeneralSecurityException {
        byte[] encrypted = aesService.encrypt("Datos clínicos sensibles");

        // Altera un byte del ciphertext (después del IV de 12 bytes)
        encrypted[15] ^= 0xFF;

        assertThrows(
            AEADBadTagException.class,
            () -> aesService.decrypt(encrypted),
            "Un ciphertext manipulado debe lanzar AEADBadTagException"
        );
    }

    @Test
    @DisplayName("Clave con longitud incorrecta debe lanzar IllegalArgumentException al construir el servicio")
    void testInvalidKeyLengthThrows() {
        // Clave de 16 bytes (128 bits) en lugar de 32 bytes (256 bits)
        String shortKey = Base64.getEncoder().encodeToString(new byte[16]);

        assertThrows(
            IllegalArgumentException.class,
            () -> new AesEncryptionService(shortKey),
            "Una clave AES de longitud incorrecta debe ser rechazada al instanciar el servicio"
        );
    }

    @Test
    @DisplayName("Debe cifrar y descifrar correctamente textos con caracteres especiales y acentos")
    void testUnicodeContent() throws GeneralSecurityException {
        String clinicalText = "Paciente: Sofía García. Diagnóstico: dermatitis atópica moderada. " +
                "Plan: corticoides tópicos + emolientes. Próximo control: 30 días.";

        String decrypted = aesService.decrypt(aesService.encrypt(clinicalText));
        assertEquals(clinicalText, decrypted);
    }
}
