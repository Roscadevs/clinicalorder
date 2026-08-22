package com.clinicadermatologica.app.application;

import com.clinicadermatologica.app.application.service.AuthService; // Servicio bajo prueba
import com.clinicadermatologica.app.domain.exception.BusinessRuleException; // Excepción esperada
import com.clinicadermatologica.app.domain.model.*; // Entidades del dominio
import com.clinicadermatologica.app.domain.repository.PasswordResetTokenRepository; // Repositorio simulado
import com.clinicadermatologica.app.domain.repository.UserRepository; // Repositorio simulado
import com.clinicadermatologica.app.infrastructure.notification.EmailNotificationService; // Notificador simulado
import com.clinicadermatologica.app.infrastructure.security.JwtTokenProvider; // Proveedor JWT simulado
import com.clinicadermatologica.app.presentation.dto.*; // DTOs
import org.junit.jupiter.api.BeforeEach; // Pre-test setup
import org.junit.jupiter.api.DisplayName; // Nombre de test
import org.junit.jupiter.api.Test; // Test JUnit 5
import org.junit.jupiter.api.extension.ExtendWith; // Extensión
import org.mockito.InjectMocks; // Inyección de mocks
import org.mockito.Mock; // Creación de mocks
import org.mockito.junit.jupiter.MockitoExtension; // Extensión Mockito
import org.springframework.security.crypto.password.PasswordEncoder; // Encoder simulado

import java.time.Instant; // Tiempo UTC
import java.time.temporal.ChronoUnit; // Unidades temporales
import java.util.Optional; // Opcional

import static org.junit.jupiter.api.Assertions.*; // Aserciones
import static org.mockito.ArgumentMatchers.any; // Matchers
import static org.mockito.Mockito.*; // Verificaciones

/**
 * Suite de pruebas unitarias para AuthService con JUnit 5 y Mockito.
 */
@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private EmailNotificationService emailService;

    @InjectMocks
    private AuthService authService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .id(1L)
                .username("dra.valeria")
                .passwordHash("$2a$12$hashedPassword")
                .email("valeria@clinicadermatologica.com")
                .fullName("Dra. Valeria Gómez")
                .role(UserRole.PHYSICIAN)
                .active(true)
                .failedLoginAttempts(0)
                .build();
    }

    @Test
    @DisplayName("Debe autenticar credenciales válidas y retornar DTO con JWT")
    void testLogin_Success() {
        AuthRequestDTO request = AuthRequestDTO.builder()
                .username("dra.valeria")
                .password("Password123!")
                .build();

        when(userRepository.findByUsername("dra.valeria")).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("Password123!", "$2a$12$hashedPassword")).thenReturn(true);
        when(jwtTokenProvider.generateToken(mockUser)).thenReturn("jwt.token.mock");

        AuthResponseDTO response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwt.token.mock", response.getToken());
        assertEquals("dra.valeria", response.getUsername());
        assertEquals(UserRole.PHYSICIAN, response.getRole());
        assertEquals(0, mockUser.getFailedLoginAttempts());
    }

    @Test
    @DisplayName("Debe incrementar contador de fallos y lanzar excepción si la contraseña es errónea")
    void testLogin_WrongPassword_IncrementsAttempts() {
        AuthRequestDTO request = AuthRequestDTO.builder()
                .username("dra.valeria")
                .password("ClaveEquivocada")
                .build();

        when(userRepository.findByUsername("dra.valeria")).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("ClaveEquivocada", "$2a$12$hashedPassword")).thenReturn(false);

        assertThrows(BusinessRuleException.class, () -> authService.login(request));

        // Verifica que se haya incrementado el contador de intentos fallidos
        assertEquals(1, mockUser.getFailedLoginAttempts());
        verify(userRepository, times(1)).save(mockUser);
    }

    @Test
    @DisplayName("Debe bloquear temporalmente la cuenta por 15 min al alcanzar 5 intentos fallidos")
    void testLogin_FiveFailedAttempts_LocksAccount() {
        mockUser.setFailedLoginAttempts(4); // Cuatro intentos previos
        AuthRequestDTO request = AuthRequestDTO.builder()
                .username("dra.valeria")
                .password("ClaveEquivocada")
                .build();

        when(userRepository.findByUsername("dra.valeria")).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("ClaveEquivocada", "$2a$12$hashedPassword")).thenReturn(false);

        assertThrows(BusinessRuleException.class, () -> authService.login(request));

        assertEquals(5, mockUser.getFailedLoginAttempts());
        assertNotNull(mockUser.getLockedUntil());
        assertTrue(mockUser.getLockedUntil().isAfter(Instant.now()));
    }

    @Test
    @DisplayName("Debe generar token temporal de 15 minutos en solicitud de recuperación de contraseña")
    void testForgotPassword_Success() {
        ForgotPasswordRequestDTO request = ForgotPasswordRequestDTO.builder()
                .email("valeria@clinicadermatologica.com")
                .build();

        when(userRepository.findByEmail("valeria@clinicadermatologica.com")).thenReturn(Optional.of(mockUser));

        authService.forgotPassword(request);

        verify(passwordResetTokenRepository, times(1)).save(any(PasswordResetToken.class));
        verify(emailService, times(1)).sendPasswordResetEmail(eq("valeria@clinicadermatologica.com"), anyString());
    }

    @Test
    @DisplayName("Debe actualizar contraseña con BCrypt y marcar token como usado en resetPassword")
    void testResetPassword_Success() {
        PasswordResetToken token = PasswordResetToken.builder()
                .id(1L)
                .user(mockUser)
                .token("crypto_token_123")
                .used(false)
                .expiresAt(Instant.now().plus(10, ChronoUnit.MINUTES))
                .build();

        ResetPasswordRequestDTO request = ResetPasswordRequestDTO.builder()
                .token("crypto_token_123")
                .newPassword("NuevaPasswordSegura2026!")
                .build();

        when(passwordResetTokenRepository.findByToken("crypto_token_123")).thenReturn(Optional.of(token));
        when(passwordEncoder.encode("NuevaPasswordSegura2026!")).thenReturn("$2a$12$newHashedPassword");

        authService.resetPassword(request);

        assertTrue(token.getUsed());
        assertEquals("$2a$12$newHashedPassword", mockUser.getPasswordHash());
        assertEquals(0, mockUser.getFailedLoginAttempts());
        verify(userRepository, times(1)).save(mockUser);
        verify(passwordResetTokenRepository, times(1)).save(token);
    }
}
