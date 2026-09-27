package com.clinicadermatologica.app.application;

import com.clinicadermatologica.app.application.service.MedicalRecordService;
import com.clinicadermatologica.app.domain.exception.BusinessRuleException;
import com.clinicadermatologica.app.domain.exception.DuplicateResourceException;
import com.clinicadermatologica.app.domain.model.*;
import com.clinicadermatologica.app.domain.repository.*;
import com.clinicadermatologica.app.infrastructure.security.AesEncryptionService;
import com.clinicadermatologica.app.presentation.dto.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.security.GeneralSecurityException;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MedicalRecordServiceTest {

    @Mock private MedicalRecordRepository medicalRecordRepository;
    @Mock private ClinicalEntryRepository clinicalEntryRepository;
    @Mock private PatientRepository patientRepository;
    @Mock private AppointmentRepository appointmentRepository;
    @Mock private UserRepository userRepository;
    @Mock private AlergiaRepository alergiaRepository;
    @Mock private AntecedentePatologicoRepository antecedentePatologicoRepository;
    @Mock private HabitoRepository habitoRepository;
    @Mock private AesEncryptionService aesEncryptionService;

    @Spy
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
                .name("Lucia Fernandez")
                .dni("38456123")
                .birthDate(LocalDate.of(1994, 5, 14))
                .build();

        mockPhysician = User.builder()
                .id(2L)
                .username("dra.valeria")
                .role(UserRole.DOCTORA)
                .fullName("Dra. Valeria Gomez")
                .build();

        mockRecord = MedicalRecord.builder()
                .id(10L)
                .patient(mockPatient)
                .createdByUser(mockPhysician)
                .fitzpatrickPhototype(3)
                .informedConsentSigned(false)
                .build();
    }

    @Test
    @DisplayName("Debe crear la historia clinica inicial y no generar registro de auditoria")
    void testSaveInitialMedicalRecord_Success() throws GeneralSecurityException {
        MedicalRecordDTO dto = MedicalRecordDTO.builder()
                .fitzpatrickPhototype(2)
                .informedConsentSigned(true)
                .build();

        when(patientRepository.findById(1L)).thenReturn(Optional.of(mockPatient));
        when(userRepository.findById(2L)).thenReturn(Optional.of(mockPhysician));
        when(medicalRecordRepository.findByPatientId(1L)).thenReturn(Optional.empty());
        when(medicalRecordRepository.save(any(MedicalRecord.class))).thenAnswer(inv -> {
            MedicalRecord rec = inv.getArgument(0);
            rec.setId(10L);
            return rec;
        });
        // Las listas de entidades debiles estan vacias en una ficha nueva
        when(alergiaRepository.findByMedicalRecordId(anyLong())).thenReturn(List.of());
        when(antecedentePatologicoRepository.findByMedicalRecordId(anyLong())).thenReturn(List.of());
        when(habitoRepository.findByMedicalRecordId(anyLong())).thenReturn(List.of());

        MedicalRecordDTO result = medicalRecordService.saveOrUpdateMedicalRecord(1L, dto, 2L);

        assertNotNull(result);
        assertEquals(10L, result.getId());
        assertEquals(2, result.getFitzpatrickPhototype());
        verify(medicalRecordRepository, times(1)).save(any(MedicalRecord.class));
        verify(medicalRecordRepository, never()).saveAudit(any(MedicalRecordAudit.class));
    }

    @Test
    @DisplayName("addClinicalEntry debe cifrar el contenido antes de persistir")
    void testAddClinicalEntry_EncryptsContent() throws GeneralSecurityException {
        Appointment mockAppt = Appointment.builder()
                .id(100L)
                .patient(mockPatient)
                .build();

        ClinicalEntryRequestDTO request = ClinicalEntryRequestDTO.builder()
                .appointmentId(100L)
                .content("Sesion 1 de Peeling Medico. Buena tolerancia cutanea.")
                .build();

        byte[] fakeEncrypted = "encrypted-bytes".getBytes();
        when(appointmentRepository.findById(100L)).thenReturn(Optional.of(mockAppt));
        when(userRepository.findById(2L)).thenReturn(Optional.of(mockPhysician));
        when(aesEncryptionService.encrypt("Sesion 1 de Peeling Medico. Buena tolerancia cutanea."))
                .thenReturn(fakeEncrypted);
        when(aesEncryptionService.decrypt(fakeEncrypted)).thenReturn("Sesion 1 de Peeling Medico. Buena tolerancia cutanea.");
        when(clinicalEntryRepository.save(any(ClinicalEntry.class))).thenAnswer(inv -> {
            ClinicalEntry e = inv.getArgument(0);
            e.setId(500L);
            return e;
        });

        ClinicalEntryResponseDTO response = medicalRecordService.addClinicalEntry(request, 2L);

        assertNotNull(response);
        assertEquals(500L, response.getId());
        // Verifica que el contenido fue cifrado antes de persistir
        verify(aesEncryptionService, times(1)).encrypt(any(String.class));
        // El DTO expone texto en claro (descifrado por mapEntryToDTO)
        assertEquals("Sesion 1 de Peeling Medico. Buena tolerancia cutanea.", response.getContent());
    }

    @Test
    @DisplayName("addAlergia debe lanzar excepcion si el tipo ya existe en la historia clinica")
    void testAddAlergia_DuplicateTipo_Throws() {
        AlergiaId existingId = new AlergiaId(10L, "Polen");
        when(medicalRecordRepository.findById(10L)).thenReturn(Optional.of(mockRecord));
        when(alergiaRepository.existsById(existingId)).thenReturn(true);

        AlergiaRequestDTO dto = AlergiaRequestDTO.builder().tipo("Polen").build();

        assertThrows(DuplicateResourceException.class,
                () -> medicalRecordService.addAlergia(10L, dto));
        verify(alergiaRepository, never()).save(any());
    }

    @Test
    @DisplayName("addAlergia debe persistir correctamente una alergia nueva")
    void testAddAlergia_Success() {
        AlergiaId newId = new AlergiaId(10L, "Anestesia");
        when(medicalRecordRepository.findById(10L)).thenReturn(Optional.of(mockRecord));
        when(alergiaRepository.existsById(newId)).thenReturn(false);
        when(alergiaRepository.save(any(Alergia.class))).thenAnswer(inv -> inv.getArgument(0));

        AlergiaRequestDTO dto = AlergiaRequestDTO.builder()
                .tipo("Anestesia")
                .observaciones("Alergia a anestesicos locales tipo articaina")
                .build();

        AlergiaResponseDTO result = medicalRecordService.addAlergia(10L, dto);

        assertEquals("Anestesia", result.getTipo());
        assertEquals(10L, result.getMedicalRecordId());
        verify(alergiaRepository, times(1)).save(any(Alergia.class));
    }

    @Test
    @DisplayName("removeAlergia debe lanzar excepcion si el tipo no existe")
    void testRemoveAlergia_NotFound_Throws() {
        AlergiaId id = new AlergiaId(10L, "Inexistente");
        when(alergiaRepository.existsById(id)).thenReturn(false);

        assertThrows(com.clinicadermatologica.app.domain.exception.ResourceNotFoundException.class,
                () -> medicalRecordService.removeAlergia(10L, "Inexistente"));
        verify(alergiaRepository, never()).delete(any());
    }
}
