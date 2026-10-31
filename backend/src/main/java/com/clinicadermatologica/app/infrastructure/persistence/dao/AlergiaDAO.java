package com.clinicadermatologica.app.infrastructure.persistence.dao;

import com.clinicadermatologica.app.domain.model.Alergia;
import com.clinicadermatologica.app.domain.model.AlergiaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * PATRÓN DAO (Data Access Object) para la entidad débil Alergia.
 *
 * Encapsula el acceso a datos de las alergias de una historia clínica mediante
 * Spring Data JPA. La clave primaria es compuesta (AlergiaId). Spring genera la
 * implementación (CRUD + consultas derivadas) en tiempo de ejecución; los servicios
 * dependen directamente de este DAO.
 */
@Repository
public interface AlergiaDAO extends JpaRepository<Alergia, AlergiaId> {

    /** Retorna todas las alergias de una historia clínica por el componente medicalRecordId de la PK compuesta. */
    List<Alergia> findByIdMedicalRecordId(Long medicalRecordId);
}
