package com.clinicadermatologica.app.application;

import com.clinicadermatologica.app.application.service.UserService;
import com.clinicadermatologica.app.domain.exception.BusinessRuleException;
import com.clinicadermatologica.app.domain.exception.ResourceNotFoundException;
import com.clinicadermatologica.app.domain.model.User;
import com.clinicadermatologica.app.domain.model.UserRole;
import com.clinicadermatologica.app.infrastructure.persistence.dao.UserDAO;
import com.clinicadermatologica.app.presentation.dto.UpdateUserRequestDTO;
import com.clinicadermatologica.app.presentation.dto.UserResponseDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Suite de pruebas unitarias para UserService con JUnit 5 y Mockito.
 */
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserDAO userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User mockUser1;
    private User mockUser2;

    @BeforeEach
    void setUp() {
        mockUser1 = User.builder()
                .id(1L)
                .username("admin")
                .passwordHash("$2a$12$adminHashedPass")
                .email("admin@clinica.com")
                .fullName("Dra. Paula Villa Fuhrmann")
                .role(UserRole.ADMIN)
                .active(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        mockUser2 = User.builder()
                .id(2L)
                .username("sofia.recepcion")
                .passwordHash("$2a$12$sofiaHashedPass")
                .email("sofia@clinica.com")
                .fullName("Sofía Martínez")
                .role(UserRole.SECRETARIA)
                .active(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    @Test
    @DisplayName("Debe listar todos los usuarios del staff ordenados por ID sin exponer contraseñas")
    void testGetAllUsers_Success() {
        when(userRepository.findAll()).thenReturn(List.of(mockUser2, mockUser1));

        List<UserResponseDTO> result = userService.getAllUsers();

        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getId()); // Ordenado por ID asc
        assertEquals("admin", result.get(0).getUsername());
        assertEquals(2L, result.get(1).getId());
        assertEquals("sofia.recepcion", result.get(1).getUsername());
    }

    @Test
    @DisplayName("Debe obtener un usuario por su ID correctamente")
    void testGetUserById_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser1));

        UserResponseDTO result = userService.getUserById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("admin", result.getUsername());
        assertEquals("admin@clinica.com", result.getEmail());
    }

    @Test
    @DisplayName("Debe lanzar ResourceNotFoundException si el usuario a consultar no existe")
    void testGetUserById_NotFound_ThrowsException() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(99L));
    }

    @Test
    @DisplayName("Debe actualizar los datos de usuario y codificar la contraseña si es suministrada")
    void testUpdateUser_Success_WithNewPassword() {
        UpdateUserRequestDTO request = UpdateUserRequestDTO.builder()
                .fullName("Sofía Gómez de Martínez")
                .username("sofia.nueva")
                .email("sofianueva@clinica.com")
                .role(UserRole.SECRETARIA)
                .password("NuevaClave2026!")
                .build();

        when(userRepository.findById(2L)).thenReturn(Optional.of(mockUser2));
        when(userRepository.existsByUsernameAndIdNot("sofia.nueva", 2L)).thenReturn(false);
        when(userRepository.existsByEmailAndIdNot("sofianueva@clinica.com", 2L)).thenReturn(false);
        when(passwordEncoder.encode("NuevaClave2026!")).thenReturn("$2a$12$newHashedKey");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponseDTO response = userService.updateUser(2L, request);

        assertNotNull(response);
        assertEquals("Sofía Gómez de Martínez", response.getFullName());
        assertEquals("sofia.nueva", response.getUsername());
        assertEquals("sofianueva@clinica.com", response.getEmail());
        assertEquals("$2a$12$newHashedKey", mockUser2.getPasswordHash());
        verify(passwordEncoder, times(1)).encode("NuevaClave2026!");
        verify(userRepository, times(1)).save(mockUser2);
    }

    @Test
    @DisplayName("Debe actualizar el usuario conservando la contraseña previa si el campo password es nulo o vacío")
    void testUpdateUser_Success_KeepExistingPassword_WhenNullOrBlank() {
        UpdateUserRequestDTO request = UpdateUserRequestDTO.builder()
                .fullName("Sofía Martínez")
                .username("sofia.recepcion")
                .email("sofia@clinica.com")
                .role(UserRole.DOCTORA)
                .password("") // Contraseña vacía
                .build();

        when(userRepository.findById(2L)).thenReturn(Optional.of(mockUser2));
        when(userRepository.existsByUsernameAndIdNot("sofia.recepcion", 2L)).thenReturn(false);
        when(userRepository.existsByEmailAndIdNot("sofia@clinica.com", 2L)).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponseDTO response = userService.updateUser(2L, request);

        assertEquals(UserRole.DOCTORA, response.getRole());
        assertEquals("$2a$12$sofiaHashedPass", mockUser2.getPasswordHash()); // Contraseña previa intacta
        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    @DisplayName("Debe rechazar actualización si el username ya está en uso por otro operador")
    void testUpdateUser_UsernameCollision_ThrowsException() {
        UpdateUserRequestDTO request = UpdateUserRequestDTO.builder()
                .fullName("Sofía Martínez")
                .username("admin") // Colisión con mockUser1
                .email("sofia@clinica.com")
                .role(UserRole.SECRETARIA)
                .build();

        when(userRepository.findById(2L)).thenReturn(Optional.of(mockUser2));
        when(userRepository.existsByUsernameAndIdNot("admin", 2L)).thenReturn(true);

        BusinessRuleException ex = assertThrows(BusinessRuleException.class, () -> userService.updateUser(2L, request));
        assertTrue(ex.getMessage().contains("nombre de usuario ya se encuentra registrado"));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Debe rechazar actualización si el correo ya está en uso por otro operador")
    void testUpdateUser_EmailCollision_ThrowsException() {
        UpdateUserRequestDTO request = UpdateUserRequestDTO.builder()
                .fullName("Sofía Martínez")
                .username("sofia.recepcion")
                .email("admin@clinica.com") // Colisión con mockUser1
                .role(UserRole.SECRETARIA)
                .build();

        when(userRepository.findById(2L)).thenReturn(Optional.of(mockUser2));
        when(userRepository.existsByUsernameAndIdNot("sofia.recepcion", 2L)).thenReturn(false);
        when(userRepository.existsByEmailAndIdNot("admin@clinica.com", 2L)).thenReturn(true);

        BusinessRuleException ex = assertThrows(BusinessRuleException.class, () -> userService.updateUser(2L, request));
        assertTrue(ex.getMessage().contains("correo electrónico ya se encuentra registrado"));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Debe rechazar actualización si la nueva contraseña tiene menos de 8 caracteres")
    void testUpdateUser_PasswordTooShort_ThrowsException() {
        UpdateUserRequestDTO request = UpdateUserRequestDTO.builder()
                .fullName("Sofía Martínez")
                .username("sofia.recepcion")
                .email("sofia@clinica.com")
                .role(UserRole.SECRETARIA)
                .password("12345") // Muy corta
                .build();

        when(userRepository.findById(2L)).thenReturn(Optional.of(mockUser2));
        when(userRepository.existsByUsernameAndIdNot("sofia.recepcion", 2L)).thenReturn(false);
        when(userRepository.existsByEmailAndIdNot("sofia@clinica.com", 2L)).thenReturn(false);

        BusinessRuleException ex = assertThrows(BusinessRuleException.class, () -> userService.updateUser(2L, request));
        assertTrue(ex.getMessage().contains("al menos 8 caracteres"));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Debe alternar el estado activo/suspendido de un usuario")
    void testToggleUserActive_Success() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(mockUser2));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponseDTO response = userService.toggleUserActive(2L, false, "admin");

        assertFalse(response.getActive());
        assertFalse(mockUser2.getActive());
        verify(userRepository, times(1)).save(mockUser2);
    }

    @Test
    @DisplayName("Debe impedir que el administrador en sesión se suspenda a sí mismo (anti-lockout)")
    void testToggleUserActive_SelfDeactivationBlocked_ThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser1));

        BusinessRuleException ex = assertThrows(BusinessRuleException.class,
                () -> userService.toggleUserActive(1L, false, "admin"));

        assertTrue(ex.getMessage().contains("No puede suspender su propia cuenta de administrador"));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Debe permitir que el administrador en sesión reactive su propia cuenta (regla anti-lockout aplica solo ante suspensión)")
    void testToggleUserActive_AdminSelfActivation_Allowed_KillsMutant() {
        mockUser1.setActive(false);
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser1));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponseDTO response = userService.toggleUserActive(1L, true, "admin");

        assertNotNull(response);
        assertTrue(response.getActive(), "La activación de la propia cuenta debe permitirse");
        assertTrue(mockUser1.getActive());
        verify(userRepository, times(1)).save(mockUser1);
    }
}
