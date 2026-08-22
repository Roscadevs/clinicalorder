package com.clinicadermatologica.app.infrastructure.persistence.adapter;

import com.clinicadermatologica.app.domain.model.Patient; // Entidad Patient
import com.clinicadermatologica.app.domain.repository.PatientRepository; // Interfaz PatientRepository
import com.clinicadermatologica.app.infrastructure.persistence.jpa.JpaPatientRepository; // JPA Repository
import lombok.RequiredArgsConstructor; // Inyección por constructor
import org.springframework.stereotype.Component; // Componente Spring

import java.util.List; // Colección de lista
import java.util.Optional; // Contenedor opcional

/**
 * Adaptador de infraestructura para la persistencia de pacientes.
 */
@Component // Componente Spring
@RequiredArgsConstructor // Inyección por constructor
public class PatientRepositoryAdapter implements PatientRepository {

    private final JpaPatientRepository jpaPatientRepository; // Inyección del repositorio JPA

    @Override
    public Optional<Patient> findById(Long id) {
        return jpaPatientRepository.findById(id); // Delega la búsqueda
    }

    @Override
    public Optional<Patient> findByDni(String dni) {
        return jpaPatientRepository.findByDni(dni); // Búsqueda por DNI
    }

    @Override
    public Optional<Patient> findByEmail(String email) {
        return jpaPatientRepository.findByEmail(email); // Búsqueda por email
    }

    @Override
    public List<Patient> searchByNameOrDni(String query) {
        return jpaPatientRepository.searchByNameOrDni(query); // Búsqueda flexible
    }

    @Override
    public List<Patient> findAllActive() {
        return jpaPatientRepository.findByActiveTrue(); // Filtro de activos
    }

    @Override
    public Patient save(Patient patient) {
        return jpaPatientRepository.save(patient); // Persistencia
    }

    @Override
    public boolean existsByDni(String dni) {
        return jpaPatientRepository.existsByDni(dni); // Comprobación
    }

    @Override
    public boolean existsByPhone(String phone) {
        return jpaPatientRepository.existsByPhone(phone); // Comprobación
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpaPatientRepository.existsByEmail(email); // Comprobación
    }
}
