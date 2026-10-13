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
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import com.clinicadermatologica.app.domain.exception.ResourceNotFoundException;

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

    @Test
    @DisplayName("updateClinicalEntry debe cifrar el nuevo contenido y crear registro inmutable en entrada_hc_audit")
    void testUpdateClinicalEntry_Success_CreatesEncryptedAuditRecord_KillsMutant() throws GeneralSecurityException {
        byte[] prevEncrypted = "previous-encrypted-content".getBytes();
        byte[] newEncrypted = "new-encrypted-content".getBytes();

        Appointment mockAppt = Appointment.builder().id(200L).patient(mockPatient).build();
        ClinicalEntry existingEntry = ClinicalEntry.builder()
                .id(100L)
                .patient(mockPatient)
                .appointment(mockAppt)
                .authorUser(mockPhysician)
                .content(prevEncrypted)
                .build();

        when(clinicalEntryRepository.findById(100L)).thenReturn(Optional.of(existingEntry));
        when(userRepository.findById(2L)).thenReturn(Optional.of(mockPhysician));
        when(aesEncryptionService.encrypt("Nueva evolución dermatológica")).thenReturn(newEncrypted);
        when(aesEncryptionService.decrypt(newEncrypted)).thenReturn("Nueva evolución dermatológica");
        when(clinicalEntryRepository.save(any(ClinicalEntry.class))).thenAnswer(inv -> inv.getArgument(0));

        ClinicalEntryResponseDTO response = medicalRecordService.updateClinicalEntry(
                100L, "Nueva evolución dermatológica", 2L);

        assertNotNull(response);
        assertEquals("Nueva evolución dermatológica", response.getContent());

        // Verificación estricta de auditoría médica legal
        ArgumentCaptor<ClinicalEntryAudit> auditCaptor = ArgumentCaptor.forClass(ClinicalEntryAudit.class);
        verify(clinicalEntryRepository, times(1)).saveAudit(auditCaptor.capture());
        ClinicalEntryAudit capturedAudit = auditCaptor.getValue();
        assertNotNull(capturedAudit);
        assertEquals(100L, capturedAudit.getClinicalEntry().getId());
        assertEquals(mockPhysician, capturedAudit.getModifiedByUser());
        assertArrayEquals(prevEncrypted, capturedAudit.getPreviousContent(),
                "La instantánea previa debe conservar estrictamente el contenido original cifrado");
        assertArrayEquals(newEncrypted, capturedAudit.getNewContent(),
                "La nueva versión debe ser cifrada antes de guardarse en auditoría");

        verify(aesEncryptionService, times(1)).encrypt("Nueva evolución dermatológica");
        verify(clinicalEntryRepository, times(1)).save(existingEntry);
    }

    @Test
    @DisplayName("updateClinicalEntry debe lanzar ResourceNotFoundException si la médica autora no existe")
    void testUpdateClinicalEntry_AuthorNotFound_ThrowsException_KillsMutant() {
        ClinicalEntry existingEntry = ClinicalEntry.builder()
                .id(100L)
                .content("contenido".getBytes())
                .build();
        when(clinicalEntryRepository.findById(100L)).thenReturn(Optional.of(existingEntry));
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> medicalRecordService.updateClinicalEntry(100L, "texto", 999L));
        verify(clinicalEntryRepository, never()).saveAudit(any());
    }

    @Test
    @DisplayName("addClinicalEntry debe lanzar ResourceNotFoundException si la médica autora no existe")
    void testAddClinicalEntry_AuthorNotFound_ThrowsException_KillsMutant() {
        Appointment mockAppt = Appointment.builder().id(200L).patient(mockPatient).build();
        ClinicalEntryRequestDTO request = ClinicalEntryRequestDTO.builder()
                .appointmentId(200L)
                .content("Evolución de prueba")
                .build();

        when(appointmentRepository.findById(200L)).thenReturn(Optional.of(mockAppt));
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> medicalRecordService.addClinicalEntry(request, 999L));
        verify(clinicalEntryRepository, never()).save(any());
    }

    @Test
    @DisplayName("saveOrUpdateMedicalRecord en ruta de actualización debe registrar auditoría y cifrar examen físico")
    void testSaveOrUpdateMedicalRecord_UpdatePath_CreatesAuditRecord_KillsMutant() throws GeneralSecurityException {
        byte[] fakeEncPhysical = "enc-physical-exam".getBytes();
        MedicalRecord existingRecord = MedicalRecord.builder()
                .id(10L)
                .patient(mockPatient)
                .createdByUser(mockPhysician)
                .fitzpatrickPhototype(2)
                .informedConsentSigned(false)
                .build();

        MedicalRecordDTO updateDto = MedicalRecordDTO.builder()
                .fitzpatrickPhototype(3)
                .informedConsentSigned(true)
                .physicalExamination("Piel con lesiones eritematosas en zona malar")
                .build();

        when(patientRepository.findById(1L)).thenReturn(Optional.of(mockPatient));
        when(userRepository.findById(2L)).thenReturn(Optional.of(mockPhysician));
        when(medicalRecordRepository.findByPatientId(1L)).thenReturn(Optional.of(existingRecord));
        when(aesEncryptionService.encrypt("Piel con lesiones eritematosas en zona malar")).thenReturn(fakeEncPhysical);
        when(aesEncryptionService.decrypt(fakeEncPhysical)).thenReturn("Piel con lesiones eritematosas en zona malar");
        when(alergiaRepository.findByMedicalRecordId(anyLong())).thenReturn(List.of());
        when(antecedentePatologicoRepository.findByMedicalRecordId(anyLong())).thenReturn(List.of());
        when(habitoRepository.findByMedicalRecordId(anyLong())).thenReturn(List.of());
        when(medicalRecordRepository.save(any(MedicalRecord.class))).thenAnswer(inv -> inv.getArgument(0));

        MedicalRecordDTO result = medicalRecordService.saveOrUpdateMedicalRecord(1L, updateDto, 2L);

        assertNotNull(result);
        assertEquals(3, result.getFitzpatrickPhototype());
        assertEquals("Piel con lesiones eritematosas en zona malar", result.getPhysicalExamination());

        ArgumentCaptor<MedicalRecordAudit> auditCaptor = ArgumentCaptor.forClass(MedicalRecordAudit.class);
        verify(medicalRecordRepository, times(1)).saveAudit(auditCaptor.capture());
        MedicalRecordAudit audit = auditCaptor.getValue();
        assertNotNull(audit);
        assertEquals("ACTUALIZACION_GENERAL", audit.getModifiedSection());
        assertEquals(mockPhysician, audit.getModifiedByUser());
        assertNotNull(audit.getPreviousValues());
        assertNotNull(audit.getNewValues());

        verify(aesEncryptionService, atLeastOnce()).encrypt("Piel con lesiones eritematosas en zona malar");
    }

    @Test
    @DisplayName("saveOrUpdateMedicalRecord debe lanzar BusinessRuleException ante falla de serialización de auditoría")
    void testSaveOrUpdateMedicalRecord_AuditSerializationFailure_ThrowsBusinessRuleException_KillsMutant() throws Exception {
        MedicalRecord existingRecord = MedicalRecord.builder()
                .id(10L)
                .patient(mockPatient)
                .createdByUser(mockPhysician)
                .fitzpatrickPhototype(2)
                .build();

        MedicalRecordDTO updateDto = MedicalRecordDTO.builder()
                .fitzpatrickPhototype(4)
                .build();

        when(patientRepository.findById(1L)).thenReturn(Optional.of(mockPatient));
        when(userRepository.findById(2L)).thenReturn(Optional.of(mockPhysician));
        when(medicalRecordRepository.findByPatientId(1L)).thenReturn(Optional.of(existingRecord));
        when(alergiaRepository.findByMedicalRecordId(anyLong())).thenReturn(List.of());
        when(antecedentePatologicoRepository.findByMedicalRecordId(anyLong())).thenReturn(List.of());
        when(habitoRepository.findByMedicalRecordId(anyLong())).thenReturn(List.of());

        doThrow(new RuntimeException("Simulated JSON serialization failure"))
                .when(objectMapper).writeValueAsString(any());

        assertThrows(BusinessRuleException.class,
                () -> medicalRecordService.saveOrUpdateMedicalRecord(1L, updateDto, 2L));
        verify(medicalRecordRepository, never()).saveAudit(any());
    }
}
