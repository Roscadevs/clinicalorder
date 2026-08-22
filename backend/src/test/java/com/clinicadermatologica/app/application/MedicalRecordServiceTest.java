package com.clinicadermatologica.app.application;

import com.clinicadermatologica.app.application.service.MedicalRecordService; // Servicio bajo prueba
import com.clinicadermatologica.app.domain.model.*; // Entidades de dominio
import com.clinicadermatologica.app.domain.repository.*; // Repositorios simulados
import com.clinicadermatologica.app.presentation.dto.*; // DTOs
import com.fasterxml.jackson.databind.ObjectMapper; // Serializador
import org.junit.jupiter.api.BeforeEach; // Pre-test setup
import org.junit.jupiter.api.DisplayName; // Nombre del test
import org.junit.jupiter.api.Test; // Test JUnit 5
import org.junit.jupiter.api.extension.ExtendWith; // Extensión
import org.mockito.InjectMocks; // Inyección de mocks
import org.mockito.Mock; // Mock
import org.mockito.Spy; // Spy para ObjectMapper real
import org.mockito.junit.jupiter.MockitoExtension; // Extensión Mockito

import java.util.*; // Colecciones

import static org.junit.jupiter.api.Assertions.*; // Aserciones
import static org.mockito.ArgumentMatchers.any; // Matchers
import static org.mockito.Mockito.*; // Verificaciones

/**
 * Suite de pruebas unitarias para MedicalRecordService con JUnit 5 y Mockito.
 */
@ExtendWith(MockitoExtension.class)
public class MedicalRecordServiceTest {

    @Mock
    private MedicalRecordRepository medicalRecordRepository;

    @Mock
    private ClinicalEntryRepository clinicalEntryRepository;

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private UserRepository userRepository;

    @Spy // Utiliza una instancia real de ObjectMapper para serializar snapshots JSON de auditoría
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private MedicalRecordService medicalRecordService;

    private Patient mockPatient;
    private User mockPhysician;
    private MedicalRecord mockRecord;

    @BeforeEach
    void setUp() {
        mockPatient = Patient.builder()
                .id(1L)
                .name("Lucía Fernández")
                .dni("38456123")
                .build();

        mockPhysician = User.builder()
                .id(2L)
                .username("dra.valeria")
                .role(UserRole.PHYSICIAN)
                .fullName("Dra. Valeria Gómez")
                .build();

        mockRecord = MedicalRecord.builder()
                .id(10L)
                .patient(mockPatient)
                .createdByUser(mockPhysician)
                .fitzpatrickPhototype("III")
                .hasHta(false)
                .hasHypothyroidism(true)
                .allergyAnesthesia(true)
                .build();
    }

    @Test
    @DisplayName("Debe crear la ficha médica inicial asociada al paciente")
    void testSaveInitialMedicalRecord_Success() {
        MedicalRecordDTO dto = MedicalRecordDTO.builder()
                .fitzpatrickPhototype("II")
                .hasHta(false)
                .hasDbt(false)
                .informedConsentSigned(true)
                .build();

        when(patientRepository.findById(1L)).thenReturn(Optional.of(mockPatient));
        when(userRepository.findById(2L)).thenReturn(Optional.of(mockPhysician));
        when(medicalRecordRepository.findByPatientId(1L)).thenReturn(Optional.empty()); // No existía ficha previa
        when(medicalRecordRepository.save(any(MedicalRecord.class))).thenAnswer(inv -> {
            MedicalRecord rec = inv.getArgument(0);
            rec.setId(10L);
            return rec;
        });

        MedicalRecordDTO result = medicalRecordService.saveOrUpdateMedicalRecord(1L, dto, 2L);

        assertNotNull(result);
        assertEquals(10L, result.getId());
        assertEquals("II", result.getFitzpatrickPhototype());
        verify(medicalRecordRepository, times(1)).save(any(MedicalRecord.class));
        // En creación inicial no se inserta fila en tabla de auditoría
        verify(medicalRecordRepository, never()).saveAudit(any(MedicalRecordAudit.class));
    }

    @Test
    @DisplayName("Debe actualizar ficha médica y registrar snapshot JSON inmutable en historia_clinica_audit")
    void testUpdateMedicalRecord_GeneratesAuditRecord() {
        MedicalRecordDTO dto = MedicalRecordDTO.builder()
                .fitzpatrickPhototype("III")
                .hasHta(true) // Modificación de HTA false -> true
                .hasHypothyroidism(true)
                .allergyAnesthesia(true)
                .build();

        when(patientRepository.findById(1L)).thenReturn(Optional.of(mockPatient));
        when(userRepository.findById(2L)).thenReturn(Optional.of(mockPhysician));
        when(medicalRecordRepository.findByPatientId(1L)).thenReturn(Optional.of(mockRecord)); // Ficha ya existente
        when(medicalRecordRepository.save(any(MedicalRecord.class))).thenReturn(mockRecord);

        MedicalRecordDTO result = medicalRecordService.saveOrUpdateMedicalRecord(1L, dto, 2L);

        assertNotNull(result);
        // Verifica que se haya guardado el registro inmutable en auditoría
        verify(medicalRecordRepository, times(1)).saveAudit(any(MedicalRecordAudit.class));
        verify(medicalRecordRepository, times(1)).save(mockRecord);
    }

    @Test
    @DisplayName("Debe redactar una nueva nota de evolución clínica vinculada a la cita")
    void testAddClinicalEntry_Success() {
        Appointment mockAppt = Appointment.builder().id(100L).build();
        ClinicalEntryRequestDTO request = ClinicalEntryRequestDTO.builder()
                .medicalRecordId(10L)
                .appointmentId(100L)
                .content("Sesión 1 de Peeling Médico. Buena tolerancia cutánea.")
                .build();

        when(medicalRecordRepository.findById(10L)).thenReturn(Optional.of(mockRecord));
        when(appointmentRepository.findById(100L)).thenReturn(Optional.of(mockAppt));
        when(userRepository.findById(2L)).thenReturn(Optional.of(mockPhysician));

        when(clinicalEntryRepository.save(any(ClinicalEntry.class))).thenAnswer(inv -> {
            ClinicalEntry e = inv.getArgument(0);
            e.setId(500L);
            return e;
        });

        ClinicalEntryResponseDTO response = medicalRecordService.addClinicalEntry(request, 2L);

        assertNotNull(response);
        assertEquals(500L, response.getId());
        assertEquals("Sesión 1 de Peeling Médico. Buena tolerancia cutánea.", response.getContent());
        verify(clinicalEntryRepository, times(1)).save(any(ClinicalEntry.class));
    }
}
