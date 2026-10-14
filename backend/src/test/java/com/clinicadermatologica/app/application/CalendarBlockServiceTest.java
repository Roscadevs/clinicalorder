package com.clinicadermatologica.app.application;

import com.clinicadermatologica.app.application.service.CalendarBlockService;
import com.clinicadermatologica.app.domain.exception.BusinessRuleException;
import com.clinicadermatologica.app.domain.exception.ResourceNotFoundException;
import com.clinicadermatologica.app.domain.model.CalendarBlock;
import com.clinicadermatologica.app.domain.model.User;
import com.clinicadermatologica.app.domain.model.UserRole;
import com.clinicadermatologica.app.infrastructure.persistence.dao.CalendarBlockDAO;
import com.clinicadermatologica.app.infrastructure.persistence.dao.UserDAO;
import com.clinicadermatologica.app.presentation.dto.CalendarBlockRequestDTO;
import com.clinicadermatologica.app.presentation.dto.CalendarBlockResponseDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Suite de pruebas unitarias para CalendarBlockService con JUnit 5 y Mockito.
 */
@ExtendWith(MockitoExtension.class)
class CalendarBlockServiceTest {

    @Mock
    private CalendarBlockDAO calendarBlockRepository;

    @Mock
    private UserDAO userRepository;

    @InjectMocks
    private CalendarBlockService calendarBlockService;

    private User mockUser;
    private Instant now;

    @BeforeEach
    void setUp() {
        now = Instant.now().truncatedTo(ChronoUnit.SECONDS);
        mockUser = User.builder()
                .id(1L)
                .username("doctora")
                .fullName("Dra. Valderrama")
                .email("dra@clinica.com")
                .role(UserRole.DOCTORA)
                .active(true)
                .build();
    }

    @Test
    @DisplayName("Debe crear un bloqueo de calendario exitosamente con userId provisto")
    void shouldCreateBlockSuccessfullyWithUserId() {
        Instant start = now.plus(1, ChronoUnit.DAYS);
        Instant end = start.plus(4, ChronoUnit.HOURS);
        CalendarBlockRequestDTO request = CalendarBlockRequestDTO.builder()
                .startTime(start)
                .endTime(end)
                .reason("Congreso de Dermatología")
                .build();

        CalendarBlock savedBlock = CalendarBlock.builder()
                .id(10L)
                .createdByUser(mockUser)
                .startTime(start)
                .endTime(end)
                .reason("Congreso de Dermatología")
                .createdAt(now)
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        when(calendarBlockRepository.save(any(CalendarBlock.class))).thenReturn(savedBlock);

        CalendarBlockResponseDTO response = calendarBlockService.createBlock(request, 1L);

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("Congreso de Dermatología", response.getReason());
        assertEquals(1L, response.getCreatedByUserId());
        assertEquals("Dra. Valderrama", response.getCreatedByUserFullName());
        assertEquals(start, response.getStartTime());
        assertEquals(end, response.getEndTime());
        verify(calendarBlockRepository, times(1)).save(any(CalendarBlock.class));
    }

    @Test
    @DisplayName("Debe crear un bloqueo recurriendo al usuario fallback cuando userId es nulo")
    void shouldCreateBlockWithFallbackUserWhenUserIdIsNull() {
        Instant start = now.plus(2, ChronoUnit.DAYS);
        Instant end = start.plus(8, ChronoUnit.HOURS);
        CalendarBlockRequestDTO request = CalendarBlockRequestDTO.builder()
                .startTime(start)
                .endTime(end)
                .reason("Mantenimiento de consultorio")
                .build();

        CalendarBlock savedBlock = CalendarBlock.builder()
                .id(11L)
                .createdByUser(mockUser)
                .startTime(start)
                .endTime(end)
                .reason("Mantenimiento de consultorio")
                .createdAt(now)
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        when(calendarBlockRepository.save(any(CalendarBlock.class))).thenReturn(savedBlock);

        CalendarBlockResponseDTO response = calendarBlockService.createBlock(request, null);

        assertNotNull(response);
        assertEquals(11L, response.getId());
        assertEquals("Mantenimiento de consultorio", response.getReason());
        assertEquals(1L, response.getCreatedByUserId());
        verify(userRepository).findById(1L);
    }

    @Test
    @DisplayName("Debe lanzar BusinessRuleException cuando endTime es anterior a startTime")
    void shouldThrowBusinessRuleExceptionWhenEndTimeIsBeforeStartTime() {
        Instant start = now.plus(1, ChronoUnit.DAYS);
        Instant end = start.minus(1, ChronoUnit.HOURS);
        CalendarBlockRequestDTO request = CalendarBlockRequestDTO.builder()
                .startTime(start)
                .endTime(end)
                .reason("Horario inválido")
                .build();

        BusinessRuleException ex = assertThrows(BusinessRuleException.class, () ->
                calendarBlockService.createBlock(request, 1L));

        assertTrue(ex.getMessage().contains("La fecha de fin debe ser posterior a la fecha de inicio"));
        verifyNoInteractions(calendarBlockRepository);
    }

    @Test
    @DisplayName("Debe lanzar BusinessRuleException cuando endTime es idéntico a startTime (duración cero)")
    void shouldThrowBusinessRuleExceptionWhenEndTimeIsEqualToStartTime() {
        Instant start = now.plus(1, ChronoUnit.DAYS);
        CalendarBlockRequestDTO request = CalendarBlockRequestDTO.builder()
                .startTime(start)
                .endTime(start)
                .reason("Bloqueo de 0 segundos inválido")
                .build();

        BusinessRuleException ex = assertThrows(BusinessRuleException.class, () ->
                calendarBlockService.createBlock(request, 1L));

        assertTrue(ex.getMessage().contains("La fecha de fin debe ser posterior a la fecha de inicio"));
        verifyNoInteractions(calendarBlockRepository);
    }

    @Test
    @DisplayName("Debe lanzar ResourceNotFoundException cuando no existen usuarios en el sistema")
    void shouldThrowResourceNotFoundExceptionWhenNoUsersExist() {
        Instant start = now.plus(1, ChronoUnit.DAYS);
        Instant end = start.plus(2, ChronoUnit.HOURS);
        CalendarBlockRequestDTO request = CalendarBlockRequestDTO.builder()
                .startTime(start)
                .endTime(end)
                .reason("Cirugía")
                .build();

        when(userRepository.findById(999L)).thenReturn(Optional.empty());
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                calendarBlockService.createBlock(request, 999L));

        verify(calendarBlockRepository, never()).save(any());
    }

    @Test
    @DisplayName("Debe retornar lista de bloqueos en el rango especificado")
    void shouldGetBlocksByRange() {
        Instant start = now;
        Instant end = now.plus(7, ChronoUnit.DAYS);

        CalendarBlock block1 = CalendarBlock.builder()
                .id(1L)
                .createdByUser(mockUser)
                .startTime(start.plus(1, ChronoUnit.DAYS))
                .endTime(start.plus(1, ChronoUnit.DAYS).plus(4, ChronoUnit.HOURS))
                .reason("Feriado Nacional")
                .createdAt(now)
                .build();

        CalendarBlock block2 = CalendarBlock.builder()
                .id(2L)
                .createdByUser(mockUser)
                .startTime(start.plus(3, ChronoUnit.DAYS))
                .endTime(start.plus(3, ChronoUnit.DAYS).plus(8, ChronoUnit.HOURS))
                .reason("Capacitación Médica")
                .createdAt(now)
                .build();

        when(calendarBlockRepository.findByDateRange(start, end)).thenReturn(List.of(block1, block2));

        List<CalendarBlockResponseDTO> results = calendarBlockService.getBlocksByRange(start, end);

        assertNotNull(results);
        assertEquals(2, results.size());
        assertEquals("Feriado Nacional", results.get(0).getReason());
        assertEquals("Capacitación Médica", results.get(1).getReason());
        verify(calendarBlockRepository).findByDateRange(start, end);
    }

    @Test
    @DisplayName("Debe delegar la eliminación de un bloqueo por ID al repositorio")
    void shouldDeleteBlockById() {
        Long blockId = 42L;

        calendarBlockService.deleteBlock(blockId);

        verify(calendarBlockRepository, times(1)).deleteById(blockId);
    }
}
