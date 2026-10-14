package com.clinicadermatologica.app.application;

import com.clinicadermatologica.app.application.service.PatientService;
import com.clinicadermatologica.app.domain.exception.BusinessRuleException;
import com.clinicadermatologica.app.domain.exception.ResourceNotFoundException;
import com.clinicadermatologica.app.domain.model.Patient;
import com.clinicadermatologica.app.infrastructure.persistence.dao.PatientDAO;
import com.clinicadermatologica.app.presentation.dto.PatientRequestDTO;
import com.clinicadermatologica.app.presentation.dto.PatientResponseDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Suite de pruebas unitarias para PatientService con JUnit 5 y Mockito.
 */
@ExtendWith(MockitoExtension.class)
public class PatientServiceTest {

    @Mock
    private PatientDAO patientRepository;

    @InjectMocks
    private PatientService patientService;

    private Patient mockPatient;
    private PatientRequestDTO validRequest;

    @BeforeEach
    void setUp() {
        mockPatient = Patient.builder()
                .id(1L)
                .name("Lucía Fernández")
                .dni("38456123")
                .phone("+5491145678901")
                .email("lucia@example.com")
                .birthDate(LocalDate.of(1995, 5, 14))
                .active(true)
                .build();

        validRequest = PatientRequestDTO.builder()
                .name("Lucía Valentina Fernández")
                .dni("38456123")
                .phone("+5491199998888")
                .email("lucia.nueva@example.com")
                .birthDate(LocalDate.of(1995, 5, 14))
                .build();
    }

    @Test
    @DisplayName("updatePatient: Actualización exitosa de datos demográficos")
    void updatePatient_Success() {
        when(patientRepository.findById(1L)).thenReturn(Optional.of(mockPatient));
        when(patientRepository.existsByEmailAndIdNot(validRequest.getEmail(), 1L)).thenReturn(false);
        when(patientRepository.existsByPhoneAndIdNot(validRequest.getPhone(), 1L)).thenReturn(false);
        when(patientRepository.save(any(Patient.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PatientResponseDTO response = patientService.updatePatient(1L, validRequest);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Lucía Valentina Fernández", response.getName());
        assertEquals("+5491199998888", response.getPhone());
        assertEquals("lucia.nueva@example.com", response.getEmail());
        assertTrue(response.getActive());
        verify(patientRepository).save(mockPatient);
    }

    @Test
    @DisplayName("updatePatient: Lanza ResourceNotFoundException si el paciente no existe")
    void updatePatient_NotFound_ThrowsException() {
        when(patientRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> patientService.updatePatient(99L, validRequest));
        verify(patientRepository, never()).save(any());
    }

    @Test
    @DisplayName("updatePatient: Lanza BusinessRuleException si el email ya pertenece a otro paciente")
    void updatePatient_EmailCollision_ThrowsBusinessRuleException() {
        when(patientRepository.findById(1L)).thenReturn(Optional.of(mockPatient));
        when(patientRepository.existsByEmailAndIdNot(validRequest.getEmail(), 1L)).thenReturn(true);

        BusinessRuleException exception = assertThrows(BusinessRuleException.class, () -> patientService.updatePatient(1L, validRequest));
        assertTrue(exception.getMessage().contains("Ya existe otro paciente con el correo"));
        verify(patientRepository, never()).save(any());
    }

    @Test
    @DisplayName("updatePatient: Lanza BusinessRuleException si el teléfono ya pertenece a otro paciente")
    void updatePatient_PhoneCollision_ThrowsBusinessRuleException() {
        when(patientRepository.findById(1L)).thenReturn(Optional.of(mockPatient));
        when(patientRepository.existsByEmailAndIdNot(validRequest.getEmail(), 1L)).thenReturn(false);
        when(patientRepository.existsByPhoneAndIdNot(validRequest.getPhone(), 1L)).thenReturn(true);

        BusinessRuleException exception = assertThrows(BusinessRuleException.class, () -> patientService.updatePatient(1L, validRequest));
        assertTrue(exception.getMessage().contains("Ya existe otro paciente con el teléfono"));
        verify(patientRepository, never()).save(any());
    }

    @Test
    @DisplayName("deactivatePatient: Realiza baja lógica (soft delete) exitosa")
    void deactivatePatient_Success() {
        when(patientRepository.findById(1L)).thenReturn(Optional.of(mockPatient));
        when(patientRepository.save(any(Patient.class))).thenAnswer(invocation -> invocation.getArgument(0));

        patientService.deactivatePatient(1L);

        assertFalse(mockPatient.getActive());
        verify(patientRepository).save(mockPatient);
    }

    @Test
    @DisplayName("deactivatePatient: Lanza ResourceNotFoundException si paciente no existe")
    void deactivatePatient_NotFound_ThrowsException() {
        when(patientRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> patientService.deactivatePatient(99L));
        verify(patientRepository, never()).save(any());
    }
}
