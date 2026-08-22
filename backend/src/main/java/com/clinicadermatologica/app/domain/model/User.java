package com.clinicadermatologica.app.domain.model;

import jakarta.persistence.*; // Importa anotaciones estándar de JPA (Jakarta Persistence API)
import lombok.*; // Importa utilidades de generación de código Lombok
import org.hibernate.annotations.CreationTimestamp; // Anotación de Hibernate para fecha de creación automática
import org.hibernate.annotations.UpdateTimestamp; // Anotación de Hibernate para fecha de actualización automática

import java.time.Instant; // Tipo de dato inmutable para marcas de tiempo UTC

/**
 * Entidad de Dominio que representa a un usuario operador del sistema de la clínica.
 */
@Entity // Declara que esta clase es una entidad administrada por JPA y se mapea a una tabla
@Table(name = "usuario") // Mapea la entidad a la tabla relacional 'usuario' en Supabase PostgreSQL
@Getter // Genera automáticamente métodos accesores getter para todos los atributos
@Setter // Genera automáticamente métodos mutadores setter para todos los atributos
@Builder // Implementa el patrón de diseño Builder para instanciación fluida de objetos
@NoArgsConstructor // Genera un constructor sin argumentos requerido obligatoriamente por JPA/Hibernate
@AllArgsConstructor // Genera un constructor con todos los argumentos para el patrón Builder
public class User {

    @Id // Marca este campo como la Clave Primaria (Primary Key) de la tabla
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Estrategia autoincremental delegada en BIGSERIAL de PostgreSQL
    private Long id;

    @Column(name = "username", nullable = false, unique = true, length = 50) // Columna UNIQUE NOT NULL para login
    private String username;

    @Column(name = "password_hash", nullable = false, length = 255) // Hash de contraseña cifrado con BCrypt
    private String passwordHash;

    @Column(name = "email", nullable = false, unique = true, length = 100) // Correo electrónico de contacto único
    private String email;

    @Column(name = "full_name", nullable = false, length = 100) // Nombre completo del operador
    private String fullName;

    @Enumerated(EnumType.STRING) // Guarda el valor del Enum como texto ('ADMIN', 'PHYSICIAN', 'RECEPTIONIST')
    @Column(name = "role", nullable = false, length = 20) // Restricción de columna para el rol RBAC
    private UserRole role;

    @Column(name = "active", nullable = false) // Estado de la cuenta (activa o suspendida)
    @Builder.Default // Valor por defecto true para el patrón Builder de Lombok
    private Boolean active = true;

    @Column(name = "failed_login_attempts", nullable = false) // Contador para bloqueo contra ataques de fuerza bruta
    @Builder.Default // Inicializa en 0 por defecto al construir
    private Integer failedLoginAttempts = 0;

    @Column(name = "locked_until") // Fecha límite hasta la cual la cuenta permanece bloqueada temporalmente
    private Instant lockedUntil;

    @CreationTimestamp // Asigna la marca temporal actual de inserción en la base de datos
    @Column(name = "created_at", nullable = false, updatable = false) // No permite modificar el timestamp de creación
    private Instant createdAt;

    @UpdateTimestamp // Actualiza la marca temporal en cada modificación del registro
    @Column(name = "updated_at", nullable = false) // Columna NOT NULL de última actualización
    private Instant updatedAt;
}
