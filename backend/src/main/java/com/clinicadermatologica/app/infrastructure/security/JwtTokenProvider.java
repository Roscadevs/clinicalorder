package com.clinicadermatologica.app.infrastructure.security;

import com.clinicadermatologica.app.domain.model.User; // Entidad User
import io.jsonwebtoken.*; // Biblioteca JJWT para manipulación de JSON Web Tokens
import io.jsonwebtoken.security.Keys; // Generación de claves criptográficas seguras
import org.springframework.beans.factory.annotation.Value; // Inyección de valores desde application.yml
import org.springframework.stereotype.Component; // Marca la clase como componente de Spring

import javax.crypto.SecretKey; // Clave simétrica de cifrado
import java.nio.charset.StandardCharsets; // Codificación UTF-8
import java.util.Date; // Fechas para JJWT

/**
 * Proveedor de servicios criptográficos para generación, firma y validación de tokens JWT Stateless.
 */
@Component // Componente Spring
public class JwtTokenProvider {

    private final SecretKey secretKey; // Clave secreta HMAC-SHA256
    private final long expirationTimeMs; // Milisegundos de validez del token

    public JwtTokenProvider(
            @Value("${security.jwt.secret-key}") String secret, // Inyecta el secret configurado
            @Value("${security.jwt.expiration-time-ms}") long expirationMs) { // Inyecta tiempo de expiración
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            try {
                java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
                keyBytes = md.digest(keyBytes);
            } catch (Exception ignored) {
            }
        }
        this.secretKey = Keys.hmacShaKeyFor(keyBytes); // Deriva clave segura HMAC-SHA
        this.expirationTimeMs = expirationMs;
    }

    /**
     * Genera un token JWT firmado conteniendo el username, ID y rol del usuario como claims.
     */
    public String generateToken(User user) {
        Date now = new Date(); // Fecha actual de emisión
        Date expiryDate = new Date(now.getTime() + expirationTimeMs); // Fecha de expiración

        return Jwts.builder() // Inicializa el builder de JJWT
                .subject(user.getUsername()) // Define el subject principal con el nombre de usuario
                .claim("userId", user.getId()) // Claim personalizado con el identificador numérico
                .claim("role", user.getRole().name()) // Claim personalizado con el rol RBAC
                .claim("fullName", user.getFullName()) // Claim personalizado con el nombre completo
                .issuedAt(now) // Marca temporal de emisión (iat)
                .expiration(expiryDate) // Marca temporal de expiración (exp)
                .signWith(secretKey, Jwts.SIG.HS256) // Firma digitalmente con algoritmo HMAC-SHA256
                .compact(); // Serializa el token a una cadena Base64URL
    }

    /**
     * Extrae el nombre de usuario (subject) contenido dentro del payload del token JWT.
     */
    public String getUsernameFromToken(String token) {
        return Jwts.parser() // Inicializa el parser de tokens
                .verifyWith(secretKey) // Configura la clave para verificar la firma
                .build()
                .parseSignedClaims(token) // Parsea y valida la firma
                .getPayload() // Obtiene los claims
                .getSubject(); // Retorna el subject
    }

    /**
     * Valida la firma criptográfica y la vigencia temporal del token JWT.
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);
            return true; // Token válido y no expirado
        } catch (JwtException | IllegalArgumentException e) {
            return false; // Token inválido, adulterado o expirado
        }
    }
}
