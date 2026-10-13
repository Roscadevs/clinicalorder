package com.clinicadermatologica.app.presentation.controller;

import com.clinicadermatologica.app.application.service.CalendarBlockService;
import com.clinicadermatologica.app.domain.model.User;
import com.clinicadermatologica.app.domain.repository.UserRepository;
import com.clinicadermatologica.app.presentation.dto.CalendarBlockRequestDTO;
import com.clinicadermatologica.app.presentation.dto.CalendarBlockResponseDTO;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Suite de pruebas unitarias para CalendarBlockController.
 */
@ExtendWith(MockitoExtension.class)
class CalendarBlockControllerTest {

    @Mock
    private CalendarBlockService blockService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private CalendarBlockController controller;

    @Test
    @DisplayName("createBlock debe utilizar el userId provisto directamente sin consultar Authentication")
    void createBlockShouldUseProvidedUserId() {
        CalendarBlockRequestDTO request = CalendarBlockRequestDTO.builder()
                .startTime(Instant.now())
                .endTime(Instant.now().plusSeconds(3600))
                .reason("Reunión")
                .build();
        CalendarBlockResponseDTO expectedResponse = CalendarBlockResponseDTO.builder()
                .id(1L)
                .createdByUserId(5L)
                .reason("Reunión")
                .build();

        when(blockService.createBlock(request, 5L)).thenReturn(expectedResponse);

        ResponseEntity<CalendarBlockResponseDTO> response = controller.createBlock(request, 5L, authentication);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(expectedResponse, response.getBody());
        verifyNoInteractions(userRepository);
        verify(blockService).createBlock(request, 5L);
    }

    @Test
    @DisplayName("createBlock debe resolver el ID del usuario desde Authentication cuando userId es nulo")
    void createBlockShouldResolveUserIdFromAuthentication() {
        CalendarBlockRequestDTO request = CalendarBlockRequestDTO.builder()
                .startTime(Instant.now())
                .endTime(Instant.now().plusSeconds(3600))
                .reason("Cirugía")
                .build();
        User user = User.builder().id(7L).username("dra.valderrama").build();
        CalendarBlockResponseDTO expectedResponse = CalendarBlockResponseDTO.builder()
                .id(2L)
                .createdByUserId(7L)
                .reason("Cirugía")
                .build();

        when(authentication.getName()).thenReturn("dra.valderrama");
        when(userRepository.findByUsername("dra.valderrama")).thenReturn(Optional.of(user));
        when(blockService.createBlock(request, 7L)).thenReturn(expectedResponse);

        ResponseEntity<CalendarBlockResponseDTO> response = controller.createBlock(request, null, authentication);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(expectedResponse, response.getBody());
        verify(userRepository).findByUsername("dra.valderrama");
        verify(blockService).createBlock(request, 7L);
    }

    @Test
    @DisplayName("createBlock debe pasar null a blockService si userId es nulo y authentication es nulo")
    void createBlockShouldPassNullWhenAuthenticationIsNull() {
        CalendarBlockRequestDTO request = CalendarBlockRequestDTO.builder()
                .startTime(Instant.now())
                .endTime(Instant.now().plusSeconds(3600))
                .reason("Asueto")
                .build();
        CalendarBlockResponseDTO expectedResponse = CalendarBlockResponseDTO.builder()
                .id(3L)
                .createdByUserId(1L)
                .reason("Asueto")
                .build();

        when(blockService.createBlock(request, null)).thenReturn(expectedResponse);

        ResponseEntity<CalendarBlockResponseDTO> response = controller.createBlock(request, null, null);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(expectedResponse, response.getBody());
        verifyNoInteractions(userRepository);
        verify(blockService).createBlock(request, null);
    }

    @Test
    @DisplayName("createBlock debe pasar null a blockService si el usuario de Authentication no existe en la base de datos")
    void createBlockShouldPassNullWhenUserNotFoundByAuthentication() {
        CalendarBlockRequestDTO request = CalendarBlockRequestDTO.builder()
                .startTime(Instant.now())
                .endTime(Instant.now().plusSeconds(3600))
                .reason("Cierre extraordinario")
                .build();
        CalendarBlockResponseDTO expectedResponse = CalendarBlockResponseDTO.builder()
                .id(4L)
                .createdByUserId(1L)
                .reason("Cierre extraordinario")
                .build();

        when(authentication.getName()).thenReturn("usuario.inexistente");
        when(userRepository.findByUsername("usuario.inexistente")).thenReturn(Optional.empty());
        when(blockService.createBlock(request, null)).thenReturn(expectedResponse);

        ResponseEntity<CalendarBlockResponseDTO> response = controller.createBlock(request, null, authentication);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(expectedResponse, response.getBody());
        verify(userRepository).findByUsername("usuario.inexistente");
        verify(blockService).createBlock(request, null);
    }

    @Test
    @DisplayName("getBlocks debe delegar a blockService y responder HTTP 200")
    void getBlocksShouldDelegateToService() {
        Instant start = Instant.now();
        Instant end = start.plusSeconds(7200);
        List<CalendarBlockResponseDTO> blocks = List.of(
                CalendarBlockResponseDTO.builder().id(1L).reason("Bloqueo 1").build()
        );

        when(blockService.getBlocksByRange(start, end)).thenReturn(blocks);

        ResponseEntity<List<CalendarBlockResponseDTO>> response = controller.getBlocks(start, end);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(blocks, response.getBody());
        verify(blockService).getBlocksByRange(start, end);
    }

    @Test
    @DisplayName("deleteBlock debe delegar a blockService y responder HTTP 204")
    void deleteBlockShouldDelegateToService() {
        Long blockId = 15L;

        ResponseEntity<Void> response = controller.deleteBlock(blockId);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(blockService).deleteBlock(blockId);
    }
}
