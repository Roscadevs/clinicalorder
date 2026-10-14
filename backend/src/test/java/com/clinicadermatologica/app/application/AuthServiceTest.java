package com.clinicadermatologica.app.application;

import com.clinicadermatologica.app.application.service.AuthService;
import com.clinicadermatologica.app.domain.exception.BusinessRuleException;
import com.clinicadermatologica.app.domain.model.*;
import com.clinicadermatologica.app.domain.repository.PasswordResetTokenRepository;
import com.clinicadermatologica.app.infrastructure.persistence.dao.UserDAO;
import com.clinicadermatologica.app.infrastructure.notification.EmailNotificationService;
import com.clinicadermatologica.app.infrastructure.security.JwtTokenProvider;
import com.clinicadermatologica.app.presentation.dto.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Suite de pruebas unitarias para AuthService con JUnit 5 y Mockito.
 */
@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock private UserDAO userRepository;
    @Mock private PasswordResetTokenRepository passwordResetTokenRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtTokenProvider jwtTokenProvider;
    @Mock private EmailNotificationService emailService;

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
                .role(UserRole.DOCTORA)
                .active(true)
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
        assertEquals(UserRole.DOCTORA, response.getRole());
    }

    @Test
    @DisplayName("Debe lanzar excepción si la contraseña es errónea")
    void testLogin_WrongPassword_ThrowsException() {
        AuthRequestDTO request = AuthRequestDTO.builder()
                .username("dra.valeria")
                .password("ClaveEquivocada")
                .build();

        when(userRepository.findByUsername("dra.valeria")).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches("ClaveEquivocada", "$2a$12$hashedPassword")).thenReturn(false);

        assertThrows(BusinessRuleException.class, () -> authService.login(request));
    }

    @Test
    @DisplayName("Debe lanzar excepción si la cuenta está inactiva")
    void testLogin_InactiveAccount_ThrowsException() {
        mockUser.setActive(false);
        AuthRequestDTO request = AuthRequestDTO.builder()
                .username("dra.valeria")
                .password("Password123!")
                .build();

        when(userRepository.findByUsername("dra.valeria")).thenReturn(Optional.of(mockUser));

        assertThrows(BusinessRuleException.class, () -> authService.login(request));
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
    @DisplayName("Debe actualizar contraseña con BCrypt y marcar usedAt al consumir token válido")
    void testResetPassword_Success() {
        PasswordResetToken token = PasswordResetToken.builder()
                .id(1L)
                .user(mockUser)
                .token("crypto_token_123")
                .expiresAt(Instant.now().plus(10, ChronoUnit.MINUTES))
                .build(); // usedAt es null por defecto

        ResetPasswordRequestDTO request = ResetPasswordRequestDTO.builder()
                .token("crypto_token_123")
                .newPassword("NuevaPasswordSegura2026!")
                .build();

        when(passwordResetTokenRepository.findByToken("crypto_token_123")).thenReturn(Optional.of(token));
        when(passwordEncoder.encode("NuevaPasswordSegura2026!")).thenReturn("$2a$12$newHashedPassword");

        authService.resetPassword(request);

        assertNotNull(token.getUsedAt()); // Token consumido
        assertEquals("$2a$12$newHashedPassword", mockUser.getPasswordHash());
        verify(userRepository, times(1)).save(mockUser);
        verify(passwordResetTokenRepository, times(1)).save(token);
    }

    @Test
    @DisplayName("Debe rechazar token ya utilizado (usedAt != null)")
    void testResetPassword_AlreadyUsedToken_ThrowsException() {
        PasswordResetToken token = PasswordResetToken.builder()
                .id(1L)
                .user(mockUser)
                .token("used_token")
                .usedAt(Instant.now().minus(5, ChronoUnit.MINUTES)) // ya fue consumido
                .expiresAt(Instant.now().plus(5, ChronoUnit.MINUTES))
                .build();

        ResetPasswordRequestDTO request = ResetPasswordRequestDTO.builder()
                .token("used_token")
                .newPassword("NuevaPassword!")
                .build();

        when(passwordResetTokenRepository.findByToken("used_token")).thenReturn(Optional.of(token));

        assertThrows(BusinessRuleException.class, () -> authService.resetPassword(request));
    }

    @Test
    @DisplayName("Debe rechazar token expirado")
    void testResetPassword_ExpiredToken_ThrowsException() {
        PasswordResetToken token = PasswordResetToken.builder()
                .id(1L)
                .user(mockUser)
                .token("expired_token")
                .expiresAt(Instant.now().minus(1, ChronoUnit.MINUTES)) // expirado
                .build(); // usedAt es null

        ResetPasswordRequestDTO request = ResetPasswordRequestDTO.builder()
                .token("expired_token")
                .newPassword("NuevaPassword!")
                .build();

        when(passwordResetTokenRepository.findByToken("expired_token")).thenReturn(Optional.of(token));

        assertThrows(BusinessRuleException.class, () -> authService.resetPassword(request));
    }

    @Test
    @DisplayName("registerUser debe cifrar la contraseña con BCrypt y persistir el usuario")
    void testRegisterUser_Success_HashesPasswordWithBCrypt_KillsMutant() {
        RegisterUserRequestDTO request = RegisterUserRequestDTO.builder()
                .username("operador.nuevo")
                .password("SecureP@ssword2026")
                .email("operador@clinica.com")
                .fullName("Operador Nuevo")
                .role(UserRole.SECRETARIA)
                .build();

        when(userRepository.existsByUsername("operador.nuevo")).thenReturn(false);
        when(userRepository.existsByEmail("operador@clinica.com")).thenReturn(false);
        when(passwordEncoder.encode("SecureP@ssword2026")).thenReturn("$2a$12$hashedPasswordSample");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User result = authService.registerUser(request);

        assertNotNull(result);
        assertEquals("operador.nuevo", result.getUsername());
        assertEquals("operador@clinica.com", result.getEmail());
        assertTrue(result.getActive());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository, times(1)).save(userCaptor.capture());
        User savedUser = userCaptor.getValue();

        verify(passwordEncoder, times(1)).encode("SecureP@ssword2026");
        assertNotEquals("SecureP@ssword2026", savedUser.getPasswordHash(),
                "La contraseña nunca debe persistirse en texto plano");
        assertEquals("$2a$12$hashedPasswordSample", savedUser.getPasswordHash());
    }

    @Test
    @DisplayName("registerUser debe lanzar BusinessRuleException ante nombre de usuario duplicado")
    void testRegisterUser_DuplicateUsername_ThrowsBusinessRule_KillsMutant() {
        RegisterUserRequestDTO request = RegisterUserRequestDTO.builder()
                .username("dra.valeria")
                .password("Password123!")
                .email("otra@clinica.com")
                .fullName("Dra. Valeria Gómez")
                .role(UserRole.DOCTORA)
                .build();

        when(userRepository.existsByUsername("dra.valeria")).thenReturn(true);

        BusinessRuleException ex = assertThrows(BusinessRuleException.class,
                () -> authService.registerUser(request));

        assertTrue(ex.getMessage().contains("ya se encuentra registrado"),
                "Debe advertir que el nombre de usuario ya existe");
        verify(passwordEncoder, never()).encode(any());
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("registerUser debe lanzar BusinessRuleException ante email duplicado")
    void testRegisterUser_DuplicateEmail_ThrowsBusinessRule_KillsMutant() {
        RegisterUserRequestDTO request = RegisterUserRequestDTO.builder()
                .username("nuevo.usuario")
                .password("Password123!")
                .email("valeria@clinicadermatologica.com")
                .fullName("Nuevo Usuario")
                .role(UserRole.SECRETARIA)
                .build();

        when(userRepository.existsByUsername("nuevo.usuario")).thenReturn(false);
        when(userRepository.existsByEmail("valeria@clinicadermatologica.com")).thenReturn(true);

        BusinessRuleException ex = assertThrows(BusinessRuleException.class,
                () -> authService.registerUser(request));

        assertTrue(ex.getMessage().contains("correo electrónico ya se encuentra registrado"),
                "Debe advertir que el correo ya existe");
        verify(passwordEncoder, never()).encode(any());
        verify(userRepository, never()).save(any());
    }
}
