package com.clinicadermatologica.app.infrastructure.persistence.dao;

import com.clinicadermatologica.app.domain.model.Habito;
import com.clinicadermatologica.app.domain.model.HabitoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * PATRÓN DAO (Data Access Object) para la entidad débil Habito.
 *
 * Encapsula el acceso a datos de los hábitos de una historia clínica mediante
 * Spring Data JPA. La clave primaria es compuesta (HabitoId). Spring genera la
 * implementación en tiempo de ejecución; los servicios dependen directamente de este DAO.
 */
@Repository
public interface HabitoDAO extends JpaRepository<Habito, HabitoId> {

    /** Retorna todos los hábitos de una historia clínica por el componente medicalRecordId de la PK compuesta. */
    List<Habito> findByIdMedicalRecordId(Long medicalRecordId);
}
