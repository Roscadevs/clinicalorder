package com.clinicadermatologica.app.infrastructure.persistence.adapter;

import com.clinicadermatologica.app.domain.model.DermatologicService;
import com.clinicadermatologica.app.infrastructure.persistence.jpa.JpaDermatologicServiceRepository;
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
import static org.mockito.Mockito.*;

/**
 * Pruebas unitarias para DermatologicServiceRepositoryAdapter.
 */
@ExtendWith(MockitoExtension.class)
class DermatologicServiceRepositoryAdapterTest {

    @Mock
    private JpaDermatologicServiceRepository jpaRepository;

    @InjectMocks
    private DermatologicServiceRepositoryAdapter adapter;

    @Test
    @DisplayName("findById debe delegar a jpaRepository.findById")
    void findByIdShouldDelegate() {
        DermatologicService service = DermatologicService.builder().id(1L).name("Consulta").build();
        when(jpaRepository.findById(1L)).thenReturn(Optional.of(service));

        Optional<DermatologicService> result = adapter.findById(1L);

        assertTrue(result.isPresent());
        assertEquals("Consulta", result.get().getName());
        verify(jpaRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("findByName debe delegar a jpaRepository.findByName")
    void findByNameShouldDelegate() {
        DermatologicService service = DermatologicService.builder().id(1L).name("Peeling").build();
        when(jpaRepository.findByName("Peeling")).thenReturn(Optional.of(service));

        Optional<DermatologicService> result = adapter.findByName("Peeling");

        assertTrue(result.isPresent());
        assertEquals("Peeling", result.get().getName());
        verify(jpaRepository, times(1)).findByName("Peeling");
    }

    @Test
    @DisplayName("findAllActive debe delegar a jpaRepository.findByActiveTrue")
    void findAllActiveShouldDelegate() {
        DermatologicService service = DermatologicService.builder().id(1L).name("Activo").active(true).build();
        when(jpaRepository.findByActiveTrue()).thenReturn(List.of(service));

        List<DermatologicService> result = adapter.findAllActive();

        assertEquals(1, result.size());
        verify(jpaRepository, times(1)).findByActiveTrue();
    }

    @Test
    @DisplayName("findAll debe delegar a jpaRepository.findAll")
    void findAllShouldDelegate() {
        DermatologicService service1 = DermatologicService.builder().id(1L).name("S1").build();
        DermatologicService service2 = DermatologicService.builder().id(2L).name("S2").build();
        when(jpaRepository.findAll()).thenReturn(List.of(service1, service2));

        List<DermatologicService> result = adapter.findAll();

        assertEquals(2, result.size());
        verify(jpaRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("save debe delegar a jpaRepository.save")
    void saveShouldDelegate() {
        DermatologicService service = DermatologicService.builder().id(1L).name("Nuevo").build();
        when(jpaRepository.save(service)).thenReturn(service);

        DermatologicService result = adapter.save(service);

        assertNotNull(result);
        assertEquals("Nuevo", result.getName());
        verify(jpaRepository, times(1)).save(service);
    }

    @Test
    @DisplayName("existsByName debe delegar a jpaRepository.existsByName")
    void existsByNameShouldDelegate() {
        when(jpaRepository.existsByName("Toxina")).thenReturn(true);

        boolean exists = adapter.existsByName("Toxina");

        assertTrue(exists);
        verify(jpaRepository, times(1)).existsByName("Toxina");
    }

    @Test
    @DisplayName("existsByNameAndIdNot debe delegar a jpaRepository.existsByNameAndIdNot")
    void existsByNameAndIdNotShouldDelegate() {
        when(jpaRepository.existsByNameAndIdNot("Relleno", 2L)).thenReturn(false);

        boolean exists = adapter.existsByNameAndIdNot("Relleno", 2L);

        assertFalse(exists);
        verify(jpaRepository, times(1)).existsByNameAndIdNot("Relleno", 2L);
    }
}
