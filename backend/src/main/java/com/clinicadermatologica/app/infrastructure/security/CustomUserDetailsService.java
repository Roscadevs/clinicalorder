package com.clinicadermatologica.app.infrastructure.security;

import com.clinicadermatologica.app.domain.model.User; // Entidad User del dominio
import com.clinicadermatologica.app.domain.repository.UserRepository; // Interfaz UserRepository
import lombok.RequiredArgsConstructor; // Inyección por constructor
import org.springframework.security.core.authority.SimpleGrantedAuthority; // Representa un rol/autoridad en Spring Security
import org.springframework.security.core.userdetails.*; // Interfaces estándar de Spring Security para autenticación
import org.springframework.stereotype.Service; // Anotación de servicio Spring

import java.util.Collections; // Utilidad de colecciones

/**
 * Servicio que implementa UserDetailsService para cargar las credenciales y roles del usuario desde la BD.
 */
@Service // Componente de servicio Spring
@RequiredArgsConstructor // Inyección por constructor de dependencias
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository; // Inyección del repositorio de usuarios

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Busca al usuario en la base de datos Supabase
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con nombre de usuario: " + username));

        // Asigna el rol con el prefijo obligatorio 'ROLE_' requerido por Spring Security
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());

        // Retorna la instancia de UserDetails estándar de Spring Security
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPasswordHash(),
                user.getActive(), // enabled
                true, // accountNonExpired
                true, // credentialsNonExpired
                user.getLockedUntil() == null || java.time.Instant.now().isAfter(user.getLockedUntil()), // accountNonLocked
                Collections.singletonList(authority) // Lista con el rol del usuario
        );
    }
}
