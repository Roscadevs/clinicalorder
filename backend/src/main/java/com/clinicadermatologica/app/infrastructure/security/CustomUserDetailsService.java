package com.clinicadermatologica.app.infrastructure.security;

import com.clinicadermatologica.app.domain.model.User;
import com.clinicadermatologica.app.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * Servicio que implementa UserDetailsService para cargar las credenciales y roles del usuario desde la BD.
 *
 * SEGURIDAD (RBAC):
 * - El rol del usuario se prefija con 'ROLE_' según la convención de Spring Security.
 * - La cuenta se considera activa/inactiva según el campo User.active.
 * - No existen campos de bloqueo temporal; la habilitación de la cuenta depende únicamente de User.active.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPasswordHash(),
                user.getActive(), // enabled — cuenta activa o suspendida
                true,             // accountNonExpired
                true,             // credentialsNonExpired
                true,             // accountNonLocked — el bloqueo temporal fue eliminado de la especificación
                Collections.singletonList(authority)
        );
    }
}
