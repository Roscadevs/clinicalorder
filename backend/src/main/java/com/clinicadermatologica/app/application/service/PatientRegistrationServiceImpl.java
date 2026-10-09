package com.clinicadermatologica.app.application.service;

import com.clinicadermatologica.app.domain.exception.BusinessRuleException;
import com.clinicadermatologica.app.domain.exception.DuplicateResourceException;
import com.clinicadermatologica.app.infrastructure.persistence.jpa.JpaPatientRepository;
import com.clinicadermatologica.app.presentation.dto.CreatePatientRpcRequestDTO;
import com.clinicadermatologica.app.presentation.dto.PatientRpcResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

/**
 * Implementación de la integración transaccional con el procedimiento PL/pgSQL sp_alta_paciente en Supabase.
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class PatientRegistrationServiceImpl implements PatientRegistrationService {

    private final JpaPatientRepository jpaPatientRepository;

    @Value("${app.encryption.key}")
    private String encryptionKey;

    @Override
    @Transactional
    public PatientRpcResponseDTO registerPatientViaRpc(CreatePatientRpcRequestDTO request) {
        log.info("Iniciando alta transaccional de paciente DNI: {} asignado a doctor ID: {}", request.getDni(), request.getDoctorId());

        try {
            Long generatedPatientId = jpaPatientRepository.executeSpAltaPaciente(
                    request.getName(),
                    request.getDni(),
                    request.getPhone(),
                    request.getEmail(),
                    request.getBirthDate(),
                    request.getDoctorId(),
                    this.encryptionKey,
                    request.getFitzpatrickPhototype(),
                    request.getPhysicalExamination()
            );

            log.info("Paciente ID: {} e Historia Clínica creados exitosamente en Supabase vía RPC", generatedPatientId);

            return PatientRpcResponseDTO.builder()
                    .patientId(generatedPatientId)
                    .message("Paciente e Historia Clínica creados y vinculados exitosamente (ACID)")
                    .active(true)
                    .timestamp(Instant.now())
                    .build();

        } catch (DataIntegrityViolationException ex) {
            String rootMessage = ex.getMostSpecificCause().getMessage();
            log.error("Fallo de integridad referencial o colisión en Supabase: {}", rootMessage);

            if (rootMessage != null && rootMessage.contains("Colision 1:1")) {
                throw new DuplicateResourceException("El paciente ya posee una Historia Clínica asignada");
            }
            if (rootMessage != null && rootMessage.contains("dni")) {
                throw new DuplicateResourceException("Ya existe un paciente registrado con el DNI " + request.getDni());
            }
            if (rootMessage != null && rootMessage.contains("email")) {
                throw new DuplicateResourceException("Ya existe un paciente con el correo " + request.getEmail());
            }
            if (rootMessage != null && rootMessage.contains("phone")) {
                throw new DuplicateResourceException("Ya existe un paciente con el teléfono " + request.getPhone());
            }

            throw new BusinessRuleException("Error de restricción de base de datos: " + rootMessage);

        } catch (Exception ex) {
            String rootMessage = ex.getMessage();
            log.error("Excepción al invocar sp_alta_paciente: {}", rootMessage, ex);

            if (rootMessage != null && rootMessage.contains("Doctor responsable")) {
                throw new BusinessRuleException("El médico asignado no existe, está inactivo o no posee rol clínico");
            }

            throw new BusinessRuleException("No se pudo completar la transacción en base de datos: " + rootMessage);
        }
    }
}
