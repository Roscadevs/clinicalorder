package com.clinicadermatologica.app.domain.model;

import jakarta.persistence.*; // Importa anotaciones JPA estándar
import lombok.*; // Importa generadores de código Lombok
import org.hibernate.annotations.CreationTimestamp; // Anotación de captura automática de fecha de creación
import org.hibernate.annotations.UpdateTimestamp; // Anotación de captura automática de fecha de actualización

import java.time.Instant; // Representación de tiempo UTC
import java.time.LocalDate; // Tipo para fechas de calendario sin hora (fecha de nacimiento)

/**
 * Entidad de Dominio que representa a un paciente de la clínica dermatológica y estética.
 */
@Entity // Declara la clase como entidad persistible en JPA
@Table(name = "paciente") // Mapea a la tabla 'paciente' en Supabase PostgreSQL
@Getter // Genera automáticamente métodos getters
@Setter // Genera automáticamente métodos setters
@Builder // Patrón Builder para construcción limpia de instancias
@NoArgsConstructor // Constructor sin parámetros requerido por el framework ORM
@AllArgsConstructor // Constructor completo para el builder
public class Patient {

    @Id // Clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Generación autoincremental por BIGSERIAL
    private Long id;

    @Column(name = "name", nullable = false, length = 100) // Nombre completo del paciente (NOT NULL)
    private String name;

    @Column(name = "dni", nullable = false, unique = true, length = 8) // DNI argentino de 7 a 8 dígitos (UNIQUE)
    private String dni;

    @Column(name = "phone", nullable = false, unique = true, length = 20) // Teléfono de contacto único
    private String phone;

    @Column(name = "email", nullable = false, unique = true, length = 100) // Correo electrónico único
    private String email;

    @Column(name = "birth_date") // Fecha de nacimiento (opcional)
    private LocalDate birthDate;

    @Column(name = "profession", length = 100) // Profesión u ocupación del paciente
    private String profession;

    @Column(name = "active", nullable = false) // Bandera de borrado lógico (soft delete)
    @Builder.Default // Valor por defecto true
    private Boolean active = true;

    @CreationTimestamp // Fecha y hora automática de alta en el sistema
    @Column(name = "created_at", nullable = false, updatable = false) // Inmutable tras creación
    private Instant createdAt;

    @UpdateTimestamp // Fecha y hora automática de última edición
    @Column(name = "updated_at", nullable = false) // NOT NULL
    private Instant updatedAt;
}
