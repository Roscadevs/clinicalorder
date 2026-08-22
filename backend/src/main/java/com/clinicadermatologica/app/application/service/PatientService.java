package com.clinicadermatologica.app.application.service;

import com.clinicadermatologica.app.domain.exception.BusinessRuleException; // Excepción de negocio
import com.clinicadermatologica.app.domain.exception.ResourceNotFoundException; // Excepción de no encontrado
import com.clinicadermatologica.app.domain.model.Patient; // Entidad Patient
import com.clinicadermatologica.app.domain.repository.PatientRepository; // Repositorio de pacientes
import com.clinicadermatologica.app.presentation.dto.PatientRequestDTO; // DTO de entrada
import com.clinicadermatologica.app.presentation.dto.PatientResponseDTO; // DTO de respuesta
import lombok.RequiredArgsConstructor; // Inyección por constructor
import org.springframework.stereotype.Service; // Servicio Spring
import org.springframework.transaction.annotation.Transactional; // Transacciones ACID

import java.util.List; // Listas
import java.util.stream.Collectors; // Streams de Java

/**
 * Servicio de Aplicación para la gestión y búsqueda de pacientes.
 */
@Service // Componente de servicio Spring
@RequiredArgsConstructor // Inyección por constructor
public class PatientService {

    private final PatientRepository patientRepository; // Inyección del repositorio

    /**
     * Registra un nuevo paciente con validaciones de unicidad de DNI, teléfono y correo.
     */
    @Transactional // Transacción ACID
    public PatientResponseDTO createPatient(PatientRequestDTO request) {
        if (patientRepository.existsByDni(request.getDni())) {
            throw new BusinessRuleException("Ya existe un paciente registrado con el DNI " + request.getDni());
        }
        if (patientRepository.existsByEmail(request.getEmail())) {
            throw new BusinessRuleException("Ya existe un paciente con el correo " + request.getEmail());
        }
        if (patientRepository.existsByPhone(request.getPhone())) {
            throw new BusinessRuleException("Ya existe un paciente con el teléfono " + request.getPhone());
        }

        Patient patient = Patient.builder()
                .name(request.getName())
                .dni(request.getDni())
                .phone(request.getPhone())
                .email(request.getEmail())
                .birthDate(request.getBirthDate())
                .profession(request.getProfession())
                .active(true)
                .build();

        return mapToDTO(patientRepository.save(patient));
    }

    /**
     * Obtiene los datos de un paciente por su clave primaria.
     */
    @Transactional(readOnly = true) // Transacción de solo lectura optimizada
    public PatientResponseDTO getPatientById(Long id) {
        return patientRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado con ID " + id));
    }

    /**
     * Búsqueda dinámica de pacientes por DNI o Nombre.
     */
    @Transactional(readOnly = true)
    public List<PatientResponseDTO> searchPatients(String query) {
        return patientRepository.searchByNameOrDni(query).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Listado completo de pacientes activos.
     */
    @Transactional(readOnly = true)
    public List<PatientResponseDTO> getAllActivePatients() {
        return patientRepository.findAllActive().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Modifica los datos de un paciente existente.
     */
    @Transactional
    public PatientResponseDTO updatePatient(Long id, PatientRequestDTO request) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado con ID " + id));

        patient.setName(request.getName());
        patient.setPhone(request.getPhone());
        patient.setEmail(request.getEmail());
        patient.setBirthDate(request.getBirthDate());
        patient.setProfession(request.getProfession());

        return mapToDTO(patientRepository.save(patient));
    }

    /**
     * Realiza la baja lógica (soft delete) del paciente.
     */
    @Transactional
    public void deactivatePatient(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente no encontrado con ID " + id));
        patient.setActive(false);
        patientRepository.save(patient);
    }

    private PatientResponseDTO mapToDTO(Patient p) {
        return PatientResponseDTO.builder()
                .id(p.getId())
                .name(p.getName())
                .dni(p.getDni())
                .phone(p.getPhone())
                .email(p.getEmail())
                .birthDate(p.getBirthDate())
                .profession(p.getProfession())
                .active(p.getActive())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
