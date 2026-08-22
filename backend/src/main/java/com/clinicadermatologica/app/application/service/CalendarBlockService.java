package com.clinicadermatologica.app.application.service;

import com.clinicadermatologica.app.domain.exception.BusinessRuleException; // Excepción de regla de negocio
import com.clinicadermatologica.app.domain.exception.ResourceNotFoundException; // Excepción de no encontrado
import com.clinicadermatologica.app.domain.model.CalendarBlock; // Entidad CalendarBlock
import com.clinicadermatologica.app.domain.model.User; // Entidad User
import com.clinicadermatologica.app.domain.repository.CalendarBlockRepository; // Repositorio de bloqueos
import com.clinicadermatologica.app.domain.repository.UserRepository; // Repositorio de usuarios
import com.clinicadermatologica.app.presentation.dto.CalendarBlockRequestDTO; // DTO de entrada
import com.clinicadermatologica.app.presentation.dto.CalendarBlockResponseDTO; // DTO de salida
import lombok.RequiredArgsConstructor; // Inyección por constructor
import org.springframework.stereotype.Service; // Servicio Spring
import org.springframework.transaction.annotation.Transactional; // Transacciones ACID

import java.time.Instant; // Tiempo UTC
import java.util.List; // Colección de lista
import java.util.stream.Collectors; // Streams

/**
 * Servicio de Aplicación para administrar períodos de indisponibilidad en la agenda.
 */
@Service // Componente de servicio Spring
@RequiredArgsConstructor // Inyección por constructor
public class CalendarBlockService {

    private final CalendarBlockRepository calendarBlockRepository; // Repositorio de bloqueos
    private final UserRepository userRepository; // Repositorio de usuarios

    /**
     * Crea un nuevo bloqueo de calendario (vacaciones, feriados o cierres de consultorio).
     */
    @Transactional // Transacción ACID
    public CalendarBlockResponseDTO createBlock(CalendarBlockRequestDTO request, Long createdByUserId) {
        if (request.getEndTime().isBefore(request.getStartTime())) {
            throw new BusinessRuleException("La fecha de fin debe ser posterior a la fecha de inicio");
        }

        User user = userRepository.findById(createdByUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        CalendarBlock block = CalendarBlock.builder()
                .createdByUser(user)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .reason(request.getReason())
                .build();

        return mapToDTO(calendarBlockRepository.save(block));
    }

    /**
     * Obtiene los bloqueos de calendario en un rango de fechas.
     */
    @Transactional(readOnly = true)
    public List<CalendarBlockResponseDTO> getBlocksByRange(Instant start, Instant end) {
        return calendarBlockRepository.findByDateRange(start, end).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Elimina un bloqueo de calendario.
     */
    @Transactional
    public void deleteBlock(Long id) {
        calendarBlockRepository.deleteById(id);
    }

    private CalendarBlockResponseDTO mapToDTO(CalendarBlock b) {
        return CalendarBlockResponseDTO.builder()
                .id(b.getId())
                .createdByUserId(b.getCreatedByUser().getId())
                .createdByUserFullName(b.getCreatedByUser().getFullName())
                .startTime(b.getStartTime())
                .endTime(b.getEndTime())
                .reason(b.getReason())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
