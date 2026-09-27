package com.clinicadermatologica.app.application.service;

import com.clinicadermatologica.app.domain.exception.BusinessRuleException;
import com.clinicadermatologica.app.domain.exception.ResourceNotFoundException;
import com.clinicadermatologica.app.domain.model.DermatologicService;
import com.clinicadermatologica.app.domain.repository.DermatologicServiceRepository;
import com.clinicadermatologica.app.presentation.dto.ServiceRequestDTO;
import com.clinicadermatologica.app.presentation.dto.ServiceResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio de Aplicación para el catálogo y administración de tarifas de servicios.
 */
@Service
@RequiredArgsConstructor
public class DermatologicServiceService {

    private final DermatologicServiceRepository serviceRepository;

    /**
     * Obtiene el catálogo de servicios activos para la vista pública y el chatbot.
     */
    @Transactional(readOnly = true)
    public List<ServiceResponseDTO> getAllActiveServices() {
        return serviceRepository.findAllActive().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene todos los servicios (activos e inactivos) para el panel de administración.
     */
    @Transactional(readOnly = true)
    public List<ServiceResponseDTO> getAllServicesForAdmin() {
        return serviceRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Consulta un servicio por su ID.
     */
    @Transactional(readOnly = true)
    public ServiceResponseDTO getServiceById(Long id) {
        return serviceRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Servicio no encontrado con ID " + id));
    }

    /**
     * Crea un nuevo servicio en el catálogo (solo Administrador).
     */
    @Transactional
    public ServiceResponseDTO createService(ServiceRequestDTO request) {
        if (serviceRepository.existsByName(request.getName())) {
            throw new BusinessRuleException("Ya existe un servicio con el nombre " + request.getName());
        }

        DermatologicService service = DermatologicService.builder()
                .name(request.getName())
                .description(request.getDescription())
                .durationMinutes(request.getDurationMinutes())
                .basePrice(request.getBasePrice())
                .depositPercentage(request.getDepositPercentage())
                .followUpIntervalDays(request.getFollowUpIntervalDays())
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        return mapToDTO(serviceRepository.save(service));
    }

    /**
     * Actualiza la tarifa o datos de un servicio. Los nuevos precios aplican solo a futuras reservas.
     */
    @Transactional
    public ServiceResponseDTO updateService(Long id, ServiceRequestDTO request) {
        DermatologicService service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Servicio no encontrado con ID " + id));

        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setDurationMinutes(request.getDurationMinutes());
        service.setBasePrice(request.getBasePrice());
        service.setDepositPercentage(request.getDepositPercentage());
        service.setFollowUpIntervalDays(request.getFollowUpIntervalDays());
        if (request.getActive() != null) {
            service.setActive(request.getActive());
        }

        return mapToDTO(serviceRepository.save(service));
    }

    private ServiceResponseDTO mapToDTO(DermatologicService s) {
        return ServiceResponseDTO.builder()
                .id(s.getId())
                .name(s.getName())
                .description(s.getDescription())
                .durationMinutes(s.getDurationMinutes())
                .basePrice(s.getBasePrice())
                .depositPercentage(s.getDepositPercentage())
                .followUpIntervalDays(s.getFollowUpIntervalDays())
                .active(s.getActive())
                .build();
    }
}
