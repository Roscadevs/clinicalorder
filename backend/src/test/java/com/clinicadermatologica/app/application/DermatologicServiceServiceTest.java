package com.clinicadermatologica.app.application;

import com.clinicadermatologica.app.application.service.DermatologicServiceService;
import com.clinicadermatologica.app.domain.exception.BusinessRuleException;
import com.clinicadermatologica.app.domain.exception.ResourceNotFoundException;
import com.clinicadermatologica.app.domain.model.DermatologicService;
import com.clinicadermatologica.app.domain.repository.DermatologicServiceRepository;
import com.clinicadermatologica.app.presentation.dto.ServiceRequestDTO;
import com.clinicadermatologica.app.presentation.dto.ServiceResponseDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Suite de pruebas unitarias para DermatologicServiceService con JUnit 5 y Mockito.
 */
@ExtendWith(MockitoExtension.class)
public class DermatologicServiceServiceTest {

    @Mock
    private DermatologicServiceRepository serviceRepository;

    @InjectMocks
    private DermatologicServiceService serviceService;

    private DermatologicService mockService1;
    private DermatologicService mockService2;

    @BeforeEach
    void setUp() {
        mockService1 = DermatologicService.builder()
                .id(1L)
                .name("Consulta Dermatológica")
                .description("Evaluación general de la piel y lunares")
                .durationMinutes(30)
                .basePrice(new BigDecimal("30000.00"))
                .depositPercentage(50)
                .followUpIntervalDays(0)
                .active(true)
                .build();

        mockService2 = DermatologicService.builder()
                .id(2L)
                .name("Peeling Químico Facial")
                .description("Renovación celular profunda")
                .durationMinutes(45)
                .basePrice(new BigDecimal("45000.00"))
                .depositPercentage(50)
                .followUpIntervalDays(21)
                .active(false)
                .build();
    }

    @Test
    @DisplayName("getAllActiveServices retorna exclusivamente servicios activos mapeados a DTO")
    void testGetAllActiveServices() {
        when(serviceRepository.findAllActive()).thenReturn(List.of(mockService1));

        List<ServiceResponseDTO> results = serviceService.getAllActiveServices();

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals("Consulta Dermatológica", results.get(0).getName());
        assertTrue(results.get(0).getActive());
        verify(serviceRepository, times(1)).findAllActive();
    }

    @Test
    @DisplayName("getAllServicesForAdmin retorna todos los servicios sin filtrar por estado")
    void testGetAllServicesForAdmin() {
        when(serviceRepository.findAll()).thenReturn(List.of(mockService1, mockService2));

        List<ServiceResponseDTO> results = serviceService.getAllServicesForAdmin();

        assertNotNull(results);
        assertEquals(2, results.size());
        assertEquals("Consulta Dermatológica", results.get(0).getName());
        assertEquals("Peeling Químico Facial", results.get(1).getName());
        verify(serviceRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("getServiceById retorna el DTO del servicio cuando existe")
    void testGetServiceById_Success() {
        when(serviceRepository.findById(1L)).thenReturn(Optional.of(mockService1));

        ServiceResponseDTO result = serviceService.getServiceById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Consulta Dermatológica", result.getName());
        assertEquals(new BigDecimal("30000.00"), result.getBasePrice());
    }

    @Test
    @DisplayName("getServiceById arroja ResourceNotFoundException cuando no existe")
    void testGetServiceById_NotFound() {
        when(serviceRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> serviceService.getServiceById(999L));
    }

    @Test
    @DisplayName("createService crea un servicio exitosamente cuando el nombre no está duplicado")
    void testCreateService_Success() {
        ServiceRequestDTO request = ServiceRequestDTO.builder()
                .name("Toxina Botulínica")
                .description("Tratamiento de arrugas de expresión")
                .durationMinutes(45)
                .basePrice(new BigDecimal("120000.00"))
                .depositPercentage(50)
                .followUpIntervalDays(15)
                .active(true)
                .build();

        DermatologicService savedEntity = DermatologicService.builder()
                .id(3L)
                .name(request.getName())
                .description(request.getDescription())
                .durationMinutes(request.getDurationMinutes())
                .basePrice(request.getBasePrice())
                .depositPercentage(request.getDepositPercentage())
                .followUpIntervalDays(request.getFollowUpIntervalDays())
                .active(true)
                .build();

        when(serviceRepository.existsByName("Toxina Botulínica")).thenReturn(false);
        when(serviceRepository.save(any(DermatologicService.class))).thenReturn(savedEntity);

        ServiceResponseDTO response = serviceService.createService(request);

        assertNotNull(response);
        assertEquals(3L, response.getId());
        assertEquals("Toxina Botulínica", response.getName());
        assertEquals(new BigDecimal("120000.00"), response.getBasePrice());
        verify(serviceRepository, times(1)).existsByName("Toxina Botulínica");
        verify(serviceRepository, times(1)).save(any(DermatologicService.class));
    }

    @Test
    @DisplayName("createService rechaza la creación con BusinessRuleException si el nombre ya existe")
    void testCreateService_DuplicateName_ThrowsException() {
        ServiceRequestDTO request = ServiceRequestDTO.builder()
                .name("Consulta Dermatológica")
                .durationMinutes(30)
                .basePrice(new BigDecimal("30000.00"))
                .depositPercentage(50)
                .followUpIntervalDays(0)
                .build();

        when(serviceRepository.existsByName("Consulta Dermatológica")).thenReturn(true);

        BusinessRuleException ex = assertThrows(BusinessRuleException.class, () ->
                serviceService.createService(request));

        assertTrue(ex.getMessage().contains("Ya existe un servicio con el nombre Consulta Dermatológica"));
        verify(serviceRepository, never()).save(any());
    }

    @Test
    @DisplayName("updateService actualiza los campos exitosamente cuando el nombre es válido y no colisiona")
    void testUpdateService_Success() {
        ServiceRequestDTO request = ServiceRequestDTO.builder()
                .name("Consulta Dermatológica General")
                .description("Evaluación médica y dermatoscopía")
                .durationMinutes(40)
                .basePrice(new BigDecimal("35000.00"))
                .depositPercentage(50)
                .followUpIntervalDays(0)
                .active(true)
                .build();

        when(serviceRepository.findById(1L)).thenReturn(Optional.of(mockService1));
        when(serviceRepository.existsByNameAndIdNot("Consulta Dermatológica General", 1L)).thenReturn(false);
        when(serviceRepository.save(any(DermatologicService.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ServiceResponseDTO response = serviceService.updateService(1L, request);

        assertNotNull(response);
        assertEquals("Consulta Dermatológica General", response.getName());
        assertEquals("Evaluación médica y dermatoscopía", response.getDescription());
        assertEquals(40, response.getDurationMinutes());
        assertEquals(new BigDecimal("35000.00"), response.getBasePrice());
        verify(serviceRepository, times(1)).existsByNameAndIdNot("Consulta Dermatológica General", 1L);
        verify(serviceRepository, times(1)).save(mockService1);
    }

    @Test
    @DisplayName("updateService permite guardar manteniendo el mismo nombre del servicio actual")
    void testUpdateService_SameName_Success() {
        ServiceRequestDTO request = ServiceRequestDTO.builder()
                .name("Consulta Dermatológica")
                .description("Descripción actualizada")
                .durationMinutes(30)
                .basePrice(new BigDecimal("38000.00"))
                .depositPercentage(50)
                .followUpIntervalDays(0)
                .active(true)
                .build();

        when(serviceRepository.findById(1L)).thenReturn(Optional.of(mockService1));
        when(serviceRepository.existsByNameAndIdNot("Consulta Dermatológica", 1L)).thenReturn(false);
        when(serviceRepository.save(any(DermatologicService.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ServiceResponseDTO response = serviceService.updateService(1L, request);

        assertNotNull(response);
        assertEquals("Consulta Dermatológica", response.getName());
        assertEquals(new BigDecimal("38000.00"), response.getBasePrice());
        verify(serviceRepository, times(1)).existsByNameAndIdNot("Consulta Dermatológica", 1L);
    }

    @Test
    @DisplayName("updateService rechaza la actualización con BusinessRuleException si el nuevo nombre colisiona con otro servicio")
    void testUpdateService_DuplicateName_ThrowsException() {
        ServiceRequestDTO request = ServiceRequestDTO.builder()
                .name("Peeling Químico Facial") // Pertenece a mockService2 (ID 2)
                .description("Descripción")
                .durationMinutes(45)
                .basePrice(new BigDecimal("45000.00"))
                .depositPercentage(50)
                .followUpIntervalDays(21)
                .active(true)
                .build();

        when(serviceRepository.findById(1L)).thenReturn(Optional.of(mockService1));
        when(serviceRepository.existsByNameAndIdNot("Peeling Químico Facial", 1L)).thenReturn(true);

        BusinessRuleException ex = assertThrows(BusinessRuleException.class, () ->
                serviceService.updateService(1L, request));

        assertTrue(ex.getMessage().contains("Ya existe otro tratamiento registrado con el nombre Peeling Químico Facial"));
        verify(serviceRepository, never()).save(any());
    }

    @Test
    @DisplayName("updateService arroja ResourceNotFoundException si el ID del servicio no existe")
    void testUpdateService_NotFound_ThrowsException() {
        ServiceRequestDTO request = ServiceRequestDTO.builder()
                .name("Servicio Inexistente")
                .durationMinutes(30)
                .basePrice(new BigDecimal("20000.00"))
                .depositPercentage(50)
                .followUpIntervalDays(0)
                .build();

        when(serviceRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                serviceService.updateService(999L, request));

        verify(serviceRepository, never()).existsByNameAndIdNot(any(), any());
        verify(serviceRepository, never()).save(any());
    }

    @Test
    @DisplayName("createService crea un servicio inactivo con followUpIntervalDays por defecto en 0 si es nulo")
    void testCreateService_InactiveAndNullFollowUp_DefaultsCorrectly() {
        ServiceRequestDTO request = ServiceRequestDTO.builder()
                .name("Servicio Inactivo")
                .description("Prueba de estado inactivo")
                .durationMinutes(30)
                .basePrice(new BigDecimal("25000.00"))
                .depositPercentage(50)
                .followUpIntervalDays(null)
                .active(false)
                .build();

        when(serviceRepository.existsByName("Servicio Inactivo")).thenReturn(false);
        when(serviceRepository.save(any(DermatologicService.class))).thenAnswer(invocation -> {
            DermatologicService s = invocation.getArgument(0);
            s.setId(10L);
            return s;
        });

        ServiceResponseDTO response = serviceService.createService(request);

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertFalse(response.getActive());
        assertEquals(0, response.getFollowUpIntervalDays());
    }

    @Test
    @DisplayName("updateService desactiva un servicio y asigna followUpIntervalDays en 0 si es nulo")
    void testUpdateService_DeactivateAndNullFollowUp_Success() {
        ServiceRequestDTO request = ServiceRequestDTO.builder()
                .name("Consulta Dermatológica")
                .description("Actualizado a inactivo")
                .durationMinutes(30)
                .basePrice(new BigDecimal("30000.00"))
                .depositPercentage(50)
                .followUpIntervalDays(null)
                .active(false)
                .build();

        when(serviceRepository.findById(1L)).thenReturn(Optional.of(mockService1));
        when(serviceRepository.existsByNameAndIdNot("Consulta Dermatológica", 1L)).thenReturn(false);
        when(serviceRepository.save(any(DermatologicService.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ServiceResponseDTO response = serviceService.updateService(1L, request);

        assertNotNull(response);
        assertFalse(response.getActive());
        assertEquals(0, response.getFollowUpIntervalDays());
    }
}
