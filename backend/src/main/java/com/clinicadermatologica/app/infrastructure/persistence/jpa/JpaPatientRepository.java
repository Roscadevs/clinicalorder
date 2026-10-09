package com.clinicadermatologica.app.infrastructure.persistence.jpa;

import com.clinicadermatologica.app.domain.model.Patient; // Entidad Patient
import org.springframework.data.jpa.repository.JpaRepository; // Interfaz Spring Data JPA
import org.springframework.data.jpa.repository.Query; // Anotación para escribir consultas personalizadas en JPQL
import org.springframework.data.repository.query.Param; // Enlace de parámetros nombrados en JPQL
import org.springframework.stereotype.Repository; // Componente de repositorio

import java.util.List; // Colección de lista
import java.util.Optional; // Contenedor opcional

/**
 * Repositorio Spring Data JPA para la entidad Patient.
 */
@Repository // Componente JPA de Spring
public interface JpaPatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByDni(String dni); // Búsqueda por DNI
    Optional<Patient> findByEmail(String email); // Búsqueda por email
    List<Patient> findByActiveTrue(); // Filtra automáticamente los pacientes activos (borrado lógico = true)

    @Query("SELECT p FROM Patient p WHERE p.active = true AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%')) OR p.dni LIKE CONCAT('%', :q, '%'))")
    List<Patient> searchByNameOrDni(@Param("q") String query); // Búsqueda flexible insensible a mayúsculas

    boolean existsByDni(String dni); // Verifica duplicidad de DNI
    boolean existsByPhone(String phone); // Verifica duplicidad de teléfono
    boolean existsByEmail(String email); // Verifica duplicidad de email

    @Query(value = "SELECT sp_alta_paciente(:name, :dni, :phone, :email, :birthDate, :doctorId, :secretKey, :phototype, :physicalExam)", nativeQuery = true)
    Long executeSpAltaPaciente(
            @Param("name") String name,
            @Param("dni") String dni,
            @Param("phone") String phone,
            @Param("email") String email,
            @Param("birthDate") java.time.LocalDate birthDate,
            @Param("doctorId") Long doctorId,
            @Param("secretKey") String secretKey,
            @Param("phototype") Integer phototype,
            @Param("physicalExam") String physicalExam
    );
}
