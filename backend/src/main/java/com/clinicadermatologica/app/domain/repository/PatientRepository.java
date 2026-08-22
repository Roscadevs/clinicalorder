package com.clinicadermatologica.app.domain.repository;

import com.clinicadermatologica.app.domain.model.Patient; // Importa la entidad Patient del dominio

import java.util.List; // Colección de lista
import java.util.Optional; // Contenedor opcional

/**
 * Contrato de repositorio del dominio para la gestión de pacientes.
 */
public interface PatientRepository {
    Optional<Patient> findById(Long id); // Búsqueda de paciente por ID
    Optional<Patient> findByDni(String dni); // Búsqueda por DNI argentino
    Optional<Patient> findByEmail(String email); // Búsqueda por email
    List<Patient> searchByNameOrDni(String query); // Búsqueda por coincidencia en nombre o DNI
    List<Patient> findAllActive(); // Listado de todos los pacientes activos (sin baja lógica)
    Patient save(Patient patient); // Guarda o actualiza la ficha del paciente
    boolean existsByDni(String dni); // Verifica si ya existe el DNI
    boolean existsByPhone(String phone); // Verifica si ya existe el teléfono
    boolean existsByEmail(String email); // Verifica si ya existe el email
}
