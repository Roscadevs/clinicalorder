package com.clinicadermatologica.app.presentation.controller;

import com.clinicadermatologica.app.application.service.DermatologicServiceService;
import com.clinicadermatologica.app.presentation.dto.ServiceRequestDTO;
import com.clinicadermatologica.app.presentation.dto.ServiceResponseDTO;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Pruebas unitarias para ServiceCatalogController.
 */
@ExtendWith(MockitoExtension.class)
class ServiceCatalogControllerTest {

    @Mock
    private DermatologicServiceService serviceService;

    @InjectMocks
    private ServiceCatalogController controller;

    @Test
    @DisplayName("getActiveServices debe retornar 200 OK con la lista de servicios activos")
    void getActiveServicesShouldReturnOk() {
        ServiceResponseDTO dto = ServiceResponseDTO.builder().id(1L).name("Consulta").active(true).build();
        when(serviceService.getAllActiveServices()).thenReturn(List.of(dto));

        ResponseEntity<List<ServiceResponseDTO>> response = controller.getActiveServices();

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(serviceService, times(1)).getAllActiveServices();
    }

    @Test
    @DisplayName("getAllServicesForAdmin debe retornar 200 OK con todos los servicios")
    void getAllServicesForAdminShouldReturnOk() {
        ServiceResponseDTO dto1 = ServiceResponseDTO.builder().id(1L).name("Consulta").active(true).build();
        ServiceResponseDTO dto2 = ServiceResponseDTO.builder().id(2L).name("Peeling").active(false).build();
        when(serviceService.getAllServicesForAdmin()).thenReturn(List.of(dto1, dto2));

        ResponseEntity<List<ServiceResponseDTO>> response = controller.getAllServicesForAdmin();

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        verify(serviceService, times(1)).getAllServicesForAdmin();
    }

    @Test
    @DisplayName("getServiceById debe retornar 200 OK con el detalle del servicio")
    void getServiceByIdShouldReturnOk() {
        ServiceResponseDTO dto = ServiceResponseDTO.builder().id(1L).name("Consulta").build();
        when(serviceService.getServiceById(1L)).thenReturn(dto);

        ResponseEntity<ServiceResponseDTO> response = controller.getServiceById(1L);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Consulta", response.getBody().getName());
        verify(serviceService, times(1)).getServiceById(1L);
    }

    @Test
    @DisplayName("createService debe retornar 201 CREATED con el servicio creado")
    void createServiceShouldReturnCreated() {
        ServiceRequestDTO request = ServiceRequestDTO.builder()
                .name("Toxina")
                .durationMinutes(30)
                .basePrice(new BigDecimal("50000.00"))
                .depositPercentage(50)
                .followUpIntervalDays(0)
                .build();
        ServiceResponseDTO dto = ServiceResponseDTO.builder().id(3L).name("Toxina").build();
        when(serviceService.createService(request)).thenReturn(dto);

        ResponseEntity<ServiceResponseDTO> response = controller.createService(request);

        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(3L, response.getBody().getId());
        verify(serviceService, times(1)).createService(request);
    }

    @Test
    @DisplayName("updateService debe retornar 200 OK con el servicio modificado")
    void updateServiceShouldReturnOk() {
        ServiceRequestDTO request = ServiceRequestDTO.builder()
                .name("Toxina Actualizada")
                .durationMinutes(45)
                .basePrice(new BigDecimal("60000.00"))
                .depositPercentage(50)
                .followUpIntervalDays(15)
                .build();
        ServiceResponseDTO dto = ServiceResponseDTO.builder().id(1L).name("Toxina Actualizada").build();
        when(serviceService.updateService(1L, request)).thenReturn(dto);

        ResponseEntity<ServiceResponseDTO> response = controller.updateService(1L, request);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Toxina Actualizada", response.getBody().getName());
        verify(serviceService, times(1)).updateService(1L, request);
    }
}
