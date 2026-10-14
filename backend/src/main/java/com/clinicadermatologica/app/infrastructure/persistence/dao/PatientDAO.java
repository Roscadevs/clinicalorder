package com.clinicadermatologica.app.infrastructure.persistence.dao;

import com.clinicadermatologica.app.domain.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * PATRÓN DAO (Data Access Object) para la entidad Patient.
 *
 * Encapsula el acceso a datos de pacientes mediante Spring Data JPA.
 */
@Repository
public interface PatientDAO extends JpaRepository<Patient, Long> {

    Optional<Patient> findByDni(String dni);
    Optional<Patient> findByEmail(String email);

    /** Listado de pacientes activos (borrado lógico = true). */
    @Query("SELECT p FROM Patient p WHERE p.active = true")
    List<Patient> findAllActive();

    @Query("SELECT p FROM Patient p WHERE p.active = true AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%')) OR p.dni LIKE CONCAT('%', :q, '%'))")
    List<Patient> searchByNameOrDni(@Param("q") String query);

    boolean existsByDni(String dni);
    boolean existsByPhone(String phone);
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, Long id);
    boolean existsByPhoneAndIdNot(String phone, Long id);
}
