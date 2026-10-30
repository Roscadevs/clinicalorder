package com.clinicadermatologica.app.infrastructure.persistence.dao;

import com.clinicadermatologica.app.domain.model.AntecedentePatologico;
import com.clinicadermatologica.app.domain.model.AntecedentePatologicoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * PATRÓN DAO (Data Access Object) para la entidad débil AntecedentePatologico.
 *
 * Encapsula el acceso a datos de los antecedentes patológicos de una historia clínica
 * mediante Spring Data JPA. La clave primaria es compuesta (AntecedentePatologicoId).
 * Spring genera la implementación en tiempo de ejecución; los servicios dependen
 * directamente de este DAO.
 */
@Repository
public interface AntecedentePatologicoDAO extends JpaRepository<AntecedentePatologico, AntecedentePatologicoId> {

    /** Retorna todos los antecedentes de una historia clínica por el componente medicalRecordId de la PK compuesta. */
    List<AntecedentePatologico> findByIdMedicalRecordId(Long medicalRecordId);
}
