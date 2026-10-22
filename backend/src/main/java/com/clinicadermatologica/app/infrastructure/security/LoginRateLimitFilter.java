package com.clinicadermatologica.app.infrastructure.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Filtro de rate limiting para el endpoint POST /api/v1/auth/login.
 * Permite máximo 5 intentos de inicio de sesión por IP cada 15 minutos.
 * Los intentos que superen el límite reciben HTTP 429 Too Many Requests.
 */
@Component
@Slf4j
public class LoginRateLimitFilter extends OncePerRequestFilter {

    // Un bucket por IP, instanciados bajo demanda
    private static final ConcurrentHashMap<String, Bucket> BUCKETS = new ConcurrentHashMap<>();

    private static final String LOGIN_PATH = "/api/v1/auth/login";
    private static final String POST_METHOD = "POST";

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // Solo intercepta POST /api/v1/auth/login; deja pasar todo lo demás sin tocar
        if (!POST_METHOD.equalsIgnoreCase(request.getMethod())
                || !LOGIN_PATH.equals(request.getRequestURI())) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = resolveClientIp(request);
        Bucket bucket = BUCKETS.computeIfAbsent(clientIp, ip -> buildBucket());

        if (bucket.tryConsume(1)) {
            // Token disponible → deja continuar la petición normalmente
            filterChain.doFilter(request, response);
        } else {
            // Sin tokens → respuesta 429
            log.warn("Rate limit alcanzado para IP={} en {}", clientIp, Instant.now());
            response.setStatus(429);
            response.setHeader("Retry-After", "900");
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write(
                    "{\"error\": \"Demasiados intentos de inicio de sesión. Intentá nuevamente en 15 minutos.\"}"
            );
        }
    }

    /**
     * Construye un bucket con capacidad de 5 tokens, recargando 5 tokens cada 15 minutos.
     */
    private Bucket buildBucket() {
        return Bucket.builder()
                .addLimit(Bandwidth.builder()
                        .capacity(5)
                        .refillIntervally(5, Duration.ofMinutes(15))
                        .build())
                .build();
    }

    /**
     * Resuelve la IP real del cliente considerando proxies (X-Forwarded-For).
     */
    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            // X-Forwarded-For puede contener una lista "ip1, ip2, ..." → se toma la primera
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
