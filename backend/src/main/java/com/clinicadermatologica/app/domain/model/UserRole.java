package com.clinicadermatologica.app.domain.model;

/**
 * Enumeración que define los roles de usuario en el sistema para control de acceso RBAC.
 */
public enum UserRole {
    ADMIN,      // Administrador general de la clínica y configuración de servicios
    DOCTORA,    // Médica dermatóloga con acceso completo a historias clínicas y auditoría médica
    SECRETARIA  // Secretaria recepcionista con acceso a turnos, cobros y pacientes (sin acceso clínico)
}
