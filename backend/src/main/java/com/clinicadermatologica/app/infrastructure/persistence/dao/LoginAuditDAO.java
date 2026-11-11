package com.clinicadermatologica.app.infrastructure.persistence.dao;

import com.clinicadermatologica.app.domain.model.LoginAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * PATRÓN DAO (Data Access Object) para la entidad LoginAudit.
 *
 * Encapsula la persistencia y consulta de los registros de auditoría de conexión
 * de los usuarios del sistema. Spring Data JPA genera la implementación automática.
 */
@Repository
public interface LoginAuditDAO extends JpaRepository<LoginAudit, Long> {

    /**
     * Obtiene el historial de conexiones para un nombre de usuario específico,
     * ordenado cronológicamente del más reciente al más antiguo.
     */
    List<LoginAudit> findByUsernameOrderByFechaConexionDesc(String username);

    /**
     * Obtiene el historial de conexiones asociadas a un ID de usuario registrado.
     */
    List<LoginAudit> findByUserIdOrderByFechaConexionDesc(Long userId);
}
