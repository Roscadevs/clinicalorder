package com.clinicadermatologica.app.application.service;

import com.clinicadermatologica.app.domain.exception.BusinessRuleException;
import com.clinicadermatologica.app.domain.exception.ResourceNotFoundException;
import com.clinicadermatologica.app.domain.model.Patient;
import com.clinicadermatologica.app.domain.repository.PatientRepository;
import com.clinicadermatologica.app.presentation.dto.PatientRequestDTO;
import com.clinicadermatologica.app.presentation.dto.PatientResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio de Aplicación para la gestión y búsqueda de pacientes.
 */
@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    /**
     * Registra un nuevo paciente con validaciones de unicidad de DNI, teléfono y correo.
     */
    @Transactional
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
                .active(true)
                .build();

        return mapToDTO(patientRepository.save(patient));
    }

    /**
     * Obtiene los datos de un paciente por su clave primaria.
     */
    @Transactional(readOnly = true)
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
                .active(p.getActive())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
