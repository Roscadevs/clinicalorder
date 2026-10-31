package com.clinicadermatologica.app.infrastructure.persistence;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

/**
 * PATRÓN SINGLETON — Administrador único del pool de conexiones a la base de datos.
 *
 * Garantiza que en toda la aplicación exista UNA sola instancia de esta clase y, por lo
 * tanto, UN solo pool de conexiones a PostgreSQL. Todo el acceso a datos pasa por ese pool:
 * los DAO (a través de Spring Data JPA e Hibernate), las migraciones de Flyway y el
 * chequeo de estado del sistema.
 *
 * Estructura clásica del patrón:
 *  - Atributo privado y estático {@code instancia}: conserva la única instancia.
 *  - Constructor privado: impide crear la clase con {@code new} desde afuera.
 *  - Método público y estático {@link #getInstance()}: crea la instancia la primera vez
 *    que se pide (inicialización diferida) y luego devuelve siempre la misma.
 *
 * Qué es el pool: un conjunto de conexiones que se abren una vez y se reutilizan. Cuando
 * alguien necesita la base, toma una conexión libre del pool, la usa y la devuelve al
 * cerrarla. El pool se implementa con HikariCP, la librería que trae Spring Boot.
 *
 * Los datos de conexión se leen de variables de entorno, para que las credenciales nunca
 * queden escritas en el código ni en el repositorio.
 */
public final class ConexionBD {

    /** Única instancia de la clase (patrón Singleton). */
    private static ConexionBD instancia;

    /** Pool de conexiones administrado por la instancia única. */
    private final HikariDataSource pool;

    /**
     * Constructor privado: nadie fuera de la clase puede instanciarla.
     * Lee los datos de conexión del entorno y crea el pool.
     */
    private ConexionBD() {
        HikariConfig config = new HikariConfig();
        config.setPoolName("ClinicaPool");
        config.setDriverClassName("org.postgresql.Driver");

        // Datos de conexión (variables de entorno, con valores por defecto para el entorno local)
        config.setJdbcUrl(System.getenv().getOrDefault(
                "SPRING_DATASOURCE_URL",
                "jdbc:postgresql://localhost:5432/clinica_dermatologica?sslmode=prefer"));
        config.setUsername(System.getenv().getOrDefault("SPRING_DATASOURCE_USERNAME", "postgres"));
        config.setPassword(System.getenv().getOrDefault("SPRING_DATASOURCE_PASSWORD", "postgrespassword"));

        // Tamaño y tiempos del pool
        config.setMaximumPoolSize(10);       // como máximo 10 conexiones abiertas a la vez
        config.setMinimumIdle(2);            // siempre al menos 2 conexiones libres listas
        config.setConnectionTimeout(30_000); // espera máxima por una conexión libre: 30 s
        config.setIdleTimeout(300_000);      // cierra conexiones sin uso después de 5 min
        config.setMaxLifetime(600_000);      // renueva cada conexión cada 10 min
        config.setKeepaliveTime(60_000);     // verifica cada 60 s que las conexiones libres sigan vivas

        this.pool = new HikariDataSource(config);
    }

    /**
     * Punto de acceso global a la única instancia. Es {@code synchronized} para que, si dos
     * hilos lo llaman a la vez, no se creen dos instancias (ni dos pools).
     *
     * @return la instancia única de ConexionBD
     */
    public static synchronized ConexionBD getInstance() {
        if (instancia == null) {
            instancia = new ConexionBD();
        }
        return instancia;
    }

    /**
     * Devuelve el pool de conexiones. Lo usa Spring (ver {@link ConfiguracionBaseDeDatos})
     * para que Hibernate, los DAO y Flyway trabajen siempre con este mismo pool.
     *
     * @return el pool de conexiones único de la aplicación
     */
    public DataSource getPool() {
        return pool;
    }

    /**
     * Presta una conexión del pool. Quien la usa debe cerrarla (por ejemplo con
     * try-with-resources): al cerrarla no se corta, sino que vuelve al pool.
     *
     * @return una conexión JDBC lista para usar
     * @throws SQLException si no hay una conexión disponible dentro del tiempo de espera
     */
    public Connection obtenerConexion() throws SQLException {
        return pool.getConnection();
    }
}
