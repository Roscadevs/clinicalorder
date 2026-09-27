package com.clinicadermatologica.app.infrastructure.security;

import lombok.RequiredArgsConstructor; // Genera constructor con dependencias final
import org.springframework.context.annotation.Bean; // Declara un método que produce un Bean administrado por Spring
import org.springframework.context.annotation.Configuration; // Marca la clase como archivo de configuración de Spring
import org.springframework.http.HttpMethod; // Enum de métodos HTTP
import org.springframework.security.authentication.AuthenticationManager; // Gestor de autenticación
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration; // Configuración de auth
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity; // Habilita @PreAuthorize
import org.springframework.security.config.annotation.web.builders.HttpSecurity; // Builder de reglas de seguridad HTTP
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity; // Habilita Spring Security web
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer; // Desactiva configuraciones por defecto
import org.springframework.security.config.http.SessionCreationPolicy; // Políticas de gestión de sesiones
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Encriptador de contraseñas BCrypt
import org.springframework.security.crypto.password.PasswordEncoder; // Interfaz de hashing de contraseñas
import org.springframework.security.web.SecurityFilterChain; // Cadena de filtros de seguridad
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // Filtro estándar de Spring
import org.springframework.web.cors.*; // Configuración de CORS

import java.util.Arrays; // Utilidad de arreglos
import java.util.List; // Utilidad de listas

/**
 * Configuración central de Seguridad, CORS, CSRF, Sesiones Stateless y Filtros JWT en Spring Security 6.
 */
@Configuration // Clase de configuración de Spring
@EnableWebSecurity // Habilita la seguridad web personalizada
@EnableMethodSecurity(prePostEnabled = true) // Activa la seguridad a nivel de métodos con @PreAuthorize
@RequiredArgsConstructor // Inyección de dependencias por constructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter; // Filtro interceptor JWT

    @Bean // Expone el bean PasswordEncoder para cifrado seguro
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); // BCrypt con factor de costo 12 (alta seguridad contra ataques por GPU)
    }

    @Bean // Expone el AuthenticationManager estándar
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean // Configura la cadena principal de filtros de seguridad HTTP
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Aplica política CORS para Vercel
            .csrf(AbstractHttpConfigurer::disable) // Deshabilita CSRF al ser una API REST Stateless con JWT
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Sin sesiones HTTP en memoria
            .authorizeHttpRequests(auth -> auth
                // Endpoints Públicos de Autenticación
                .requestMatchers("/auth/login", "/auth/forgot-password", "/auth/reset-password").permitAll()
                // Endpoints Públicos para el Paciente (Landing, Catálogo y Turnos)
                .requestMatchers(HttpMethod.GET, "/servicios", "/servicios/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/citas/reservar-temporal").permitAll()
                .requestMatchers(HttpMethod.GET, "/citas/disponibilidad").permitAll()
                // Endpoint Público del Asistente Virtual con Gemini API
                .requestMatchers(HttpMethod.POST, "/chat/gemini").permitAll()
                // Webhook Público de MercadoPago (recibe notificaciones de pago)
                .requestMatchers(HttpMethod.POST, "/pagos/webhook").permitAll()
                // Restricción Estricta: Solo DOCTORA puede acceder a historias clínicas y auditoría
                .requestMatchers("/historias-clinicas/**").hasRole("DOCTORA")
                // Restricción: Solo ADMINISTRADOR puede gestionar usuarios y servicios
                .requestMatchers("/admin/**").hasRole("ADMIN")
                // Cualquier otra solicitud requiere autenticación JWT válida
                .anyRequest().authenticated()
            )
            // Agrega nuestro filtro JWT antes del filtro de usuario/contraseña estándar de Spring
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean // Configuración de CORS permitiendo llamadas desde el Frontend en Vercel y entorno local Vite
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*")); // Permite peticiones desde cualquier origen (Vercel, localhost)
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")); // Métodos HTTP permitidos
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin")); // Cabeceras permitidas
        configuration.setExposedHeaders(List.of("Authorization")); // Expone cabecera Authorization al cliente
        configuration.setAllowCredentials(true); // Permite credenciales y cookies si fueran necesarias

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Aplica la configuración a todas las rutas
        return source;
    }
}
