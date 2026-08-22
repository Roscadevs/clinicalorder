package com.clinicadermatologica.app.infrastructure.security;

import jakarta.servlet.FilterChain; // Cadena de filtros de Servlet
import jakarta.servlet.ServletException; // Excepción de servlet
import jakarta.servlet.http.HttpServletRequest; // Petición HTTP entrante
import jakarta.servlet.http.HttpServletResponse; // Respuesta HTTP saliente
import lombok.RequiredArgsConstructor; // Inyección por constructor
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; // Token de autenticación de Spring
import org.springframework.security.core.context.SecurityContextHolder; // Almacén del contexto de seguridad del thread actual
import org.springframework.security.core.userdetails.UserDetails; // Detalles del usuario autenticado
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource; // Detalles web de la petición
import org.springframework.stereotype.Component; // Componente Spring
import org.springframework.util.StringUtils; // Utilidad para verificar cadenas
import org.springframework.web.filter.OncePerRequestFilter; // Garantiza que el filtro se ejecute una sola vez por petición

import java.io.IOException; // Manejo de I/O

/**
 * Filtro HTTP interceptor que extrae y valida el token Bearer JWT en cada solicitud entrante.
 */
@Component // Componente Spring
@RequiredArgsConstructor // Inyección por constructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider; // Proveedor de validación y extracción JWT
    private final CustomUserDetailsService userDetailsService; // Servicio de carga de usuarios

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // Extrae el token JWT del encabezado Authorization
        String jwt = getJwtFromRequest(request);

        // Si el token existe y es válido, establece la autenticación en el SecurityContext
        if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
            String username = tokenProvider.getUsernameFromToken(jwt);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
            );
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // Guarda el usuario autenticado en el contexto de seguridad de Spring
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        // Continúa con el siguiente filtro en la cadena
        filterChain.doFilter(request, response);
    }

    /**
     * Extrae el Bearer token del header 'Authorization'.
     */
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization"); // Obtiene el valor del encabezado
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Retira el prefijo 'Bearer ' de 7 caracteres
        }
        return null;
    }
}
