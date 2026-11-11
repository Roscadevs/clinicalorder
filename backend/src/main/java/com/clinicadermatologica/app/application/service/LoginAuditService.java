package com.clinicadermatologica.app.application.service;

import com.clinicadermatologica.app.domain.model.LoginAudit;
import com.clinicadermatologica.app.domain.model.User;
import com.clinicadermatologica.app.infrastructure.persistence.dao.LoginAuditDAO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio de Aplicación para la auditoría de conexiones al sistema.
 *
 * Utiliza {@code Propagation.REQUIRES_NEW} para asegurar que el intento de conexión
 * se almacene en una transacción independiente y no sufra rollback si el proceso
 * de autenticación lanza una excepción de negocio (por ejemplo, credenciales erróneas
 * o cuenta inactiva).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class LoginAuditService {

    private final LoginAuditDAO loginAuditDAO;

    /**
     * Registra un evento de conexión (exitoso o fallido) en la base de datos.
     *
     * @param user       Entidad de usuario si existe en la base de datos, o null si no se encontró
     * @param username   Nombre de usuario provisto en la petición de login
     * @param exitoso    true si la autenticación fue correcta, false en caso contrario
     * @param ipAddress  Dirección IP de origen del cliente
     * @param userAgent  Encabezado User-Agent del navegador o cliente HTTP
     * @return Registro persistido de auditoría
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public LoginAudit registrarConexion(User user, String username, boolean exitoso, String ipAddress, String userAgent) {
        String safeUsername = (username != null && !username.isBlank()) ? username : "desconocido";
        if (safeUsername.length() > 50) {
            safeUsername = safeUsername.substring(0, 50);
        }

        String safeUserAgent = userAgent;
        if (safeUserAgent != null && safeUserAgent.length() > 500) {
            safeUserAgent = safeUserAgent.substring(0, 500);
        }

        LoginAudit audit = LoginAudit.builder()
                .user(user)
                .username(safeUsername)
                .exitoso(exitoso)
                .ipAddress(ipAddress)
                .userAgent(safeUserAgent)
                .build();

        log.info("Auditoría de conexión registrada: usuario='{}', exitoso={}, ip='{}'",
                safeUsername, exitoso, ipAddress);

        return loginAuditDAO.save(audit);
    }
}
