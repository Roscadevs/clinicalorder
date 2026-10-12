package com.clinicadermatologica.app.infrastructure.security;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Configuración central de Seguridad, Firewall Perimetral, CORS, Cabeceras HTTP,
 * Manejadores RFC 7807, Sesiones Stateless y Filtros JWT en Spring Security 6.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final DelegatedAuthenticationEntryPoint authenticationEntryPoint;
    private final DelegatedAccessDeniedHandler accessDeniedHandler;

    @Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,https://clinicalorder.eliasdelcastillo.com,https://clinicalorder.onrender.com}")
    private String allowedOrigins;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    /**
     * Cortafuegos HTTP estricto para mitigar desincronización de proxy y ataques de path traversal.
     * Bloquea terminaciones matriciales (;), barras codificadas (%2F), caracteres nulos y secuencias relativas.
     */
    @Bean
    public HttpFirewall httpFirewall() {
        StrictHttpFirewall firewall = new StrictHttpFirewall();
        firewall.setAllowUrlEncodedSlash(false);
        firewall.setAllowUrlEncodedPercent(false);
        firewall.setAllowSemicolon(false);
        firewall.setAllowBackSlash(false);
        firewall.setAllowUrlEncodedPeriod(false);
        return firewall;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint(authenticationEntryPoint)
                .accessDeniedHandler(accessDeniedHandler)
            )
            .headers(headers -> headers
                .frameOptions(HeadersConfigurer.FrameOptionsConfig::deny)
                .contentTypeOptions(Customizer.withDefaults())
                .xssProtection(Customizer.withDefaults())
                .referrerPolicy(referrer -> referrer.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
            )
            .authorizeHttpRequests(auth -> auth
                // 1. Endpoints Públicos de Autenticación
                .requestMatchers("/auth/**").permitAll()

                // 2. Endpoints Públicos para el Paciente (Landing, Catálogo y Turnos)
                .requestMatchers(HttpMethod.GET, "/servicios", "/servicios/{id:[0-9]+}").permitAll()
                .requestMatchers(HttpMethod.POST, "/citas/reservar-temporal").permitAll()
                .requestMatchers(HttpMethod.GET, "/citas/disponibilidad").permitAll()
                .requestMatchers(HttpMethod.GET, "/citas/{id:[0-9]+}/estado").permitAll()

                // 3. Endpoint Público del Asistente Virtual con Gemini API
                .requestMatchers(HttpMethod.POST, "/chat/gemini").permitAll()

                // 4. Webhook Público de MercadoPago (recibe notificaciones de pago con HMAC)
                .requestMatchers(HttpMethod.POST, "/pagos/webhook").permitAll()

                // 5. Restricción Estricta: Solo ADMINISTRADOR puede gestionar catálogo completo y administración
                .requestMatchers("/servicios/todos", "/servicios/admin/**", "/admin/**").hasRole("ADMIN")

                // 6. Restricción Estricta: Solo DOCTORA puede acceder a historias clínicas y auditoría médica
                .requestMatchers("/historias-clinicas/**").hasRole("DOCTORA")

                // 7. Endpoints Operativos de Staff (Agenda de Citas, Pacientes y Bloqueos de Calendario)
                .requestMatchers("/citas/**", "/pacientes/**", "/bloqueos/**").hasAnyRole("DOCTORA", "SECRETARIA", "ADMIN")

                // 8. Cualquier otra solicitud requiere autenticación JWT válida por defecto (Default Deny)
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();

        List<String> originPatterns = new ArrayList<>(origins);
        originPatterns.addAll(Arrays.asList(
                "http://localhost:*",
                "http://127.0.0.1:*",
                "https://*.eliasdelcastillo.com",
                "https://*.onrender.com",
                "https://*.vercel.app"
        ));

        configuration.setAllowedOriginPatterns(originPatterns);
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
