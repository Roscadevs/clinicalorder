package com.clinicadermatologica.app.domain.exception;

/**
 * Excepcion de Dominio lanzada cuando se intenta crear un recurso que ya existe
 * con la misma clave de identificacion (conflicto 409).
 *
 * Usada principalmente para entidades debiles (Alergia, AntecedentePatologico, Habito)
 * cuya clave primaria compuesta (historia_clinica_id, tipo) no admite duplicados.
 */
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}
