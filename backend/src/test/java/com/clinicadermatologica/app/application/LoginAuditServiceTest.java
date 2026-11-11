package com.clinicadermatologica.app.application;

import com.clinicadermatologica.app.application.service.LoginAuditService;
import com.clinicadermatologica.app.domain.model.LoginAudit;
import com.clinicadermatologica.app.domain.model.User;
import com.clinicadermatologica.app.domain.model.UserRole;
import com.clinicadermatologica.app.infrastructure.persistence.dao.LoginAuditDAO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Suite de pruebas unitarias para LoginAuditService con JUnit 5 y Mockito.
 */
@ExtendWith(MockitoExtension.class)
public class LoginAuditServiceTest {

    @Mock
    private LoginAuditDAO loginAuditDAO;

    @InjectMocks
    private LoginAuditService loginAuditService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .id(1L)
                .username("admin")
                .email("admin@clinicadermatologica.com")
                .fullName("Administrador General")
                .role(UserRole.ADMIN)
                .active(true)
                .build();
    }

    @Test
    @DisplayName("Debe persistir auditoría de login exitoso con usuario vinculado y metadatos de red")
    void testRegistrarConexion_SuccessfulLogin() {
        when(loginAuditDAO.save(any(LoginAudit.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LoginAudit result = loginAuditService.registrarConexion(
                mockUser,
                "admin",
                true,
                "192.168.1.50",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
        );

        assertNotNull(result);
        assertEquals("admin", result.getUsername());
        assertTrue(result.getExitoso());
        assertEquals("192.168.1.50", result.getIpAddress());
        assertEquals("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", result.getUserAgent());
        assertEquals(mockUser, result.getUser());

        ArgumentCaptor<LoginAudit> captor = ArgumentCaptor.forClass(LoginAudit.class);
        verify(loginAuditDAO, times(1)).save(captor.capture());
        assertEquals("admin", captor.getValue().getUsername());
        assertTrue(captor.getValue().getExitoso());
    }

    @Test
    @DisplayName("Debe persistir auditoría de intento fallido con usuario null cuando el usuario no existe")
    void testRegistrarConexion_FailedLogin_NonExistentUser() {
        when(loginAuditDAO.save(any(LoginAudit.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LoginAudit result = loginAuditService.registrarConexion(
                null,
                "usuario_inexistente",
                false,
                "200.10.20.30",
                "Python-requests/2.28.1"
        );

        assertNotNull(result);
        assertEquals("usuario_inexistente", result.getUsername());
        assertFalse(result.getExitoso());
        assertEquals("200.10.20.30", result.getIpAddress());
        assertNull(result.getUser());

        verify(loginAuditDAO, times(1)).save(any(LoginAudit.class));
    }

    @Test
    @DisplayName("Debe truncar User-Agent que exceda 500 caracteres para evitar desborde en base de datos")
    void testRegistrarConexion_TruncatesLongUserAgent() {
        when(loginAuditDAO.save(any(LoginAudit.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String longUserAgent = "A".repeat(600);

        LoginAudit result = loginAuditService.registrarConexion(
                mockUser,
                "admin",
                true,
                "127.0.0.1",
                longUserAgent
        );

        assertNotNull(result);
        assertEquals(500, result.getUserAgent().length());
        assertEquals("A".repeat(500), result.getUserAgent());
    }

    @Test
    @DisplayName("Debe asignar 'desconocido' si el username es nulo o en blanco")
    void testRegistrarConexion_HandlesBlankUsername() {
        when(loginAuditDAO.save(any(LoginAudit.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LoginAudit result = loginAuditService.registrarConexion(
                null,
                "   ",
                false,
                "127.0.0.1",
                "Browser"
        );

        assertNotNull(result);
        assertEquals("desconocido", result.getUsername());
    }
}
