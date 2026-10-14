package com.clinicadermatologica.app.infrastructure.persistence;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * PATRÓN SINGLETON — Punto de acceso único a la conexión con la base de datos.
 *
 * Garantiza que exista una única instancia de administrador de conexión en toda la
 * aplicación y provee un punto de acceso global a ella mediante {@link #getInstance()}.
 *
 * Estructura clásica del patrón:
 *  - Constructor privado: impide instanciar la clase con {@code new} desde afuera.
 *  - Atributo privado y estático {@code instancia}: conserva la única instancia.
 *  - Método público y estático {@code getInstance()}: crea (de forma perezosa) y
 *    devuelve esa única instancia.
 *
 * Los datos de conexión (URL, usuario, contraseña) se toman de variables de entorno,
 * con los mismos valores por defecto que usa la configuración del proyecto para el
 * entorno local, de modo que coinciden con el DataSource gestionado por Spring.
 */
public final class ConexionBD {

    /** Única instancia de la clase (patrón Singleton). */
    private static ConexionBD instancia;

    /** Datos de conexión a la base de datos. */
    private final String url;
    private final String usuario;
    private final String password;

    /**
     * Constructor privado: nadie fuera de la clase puede instanciarla.
     * Lee los parámetros de conexión del entorno (con valores por defecto locales).
     */
    private ConexionBD() {
        this.url = System.getenv().getOrDefault(
                "SPRING_DATASOURCE_URL",
                "jdbc:postgresql://localhost:5432/clinica_dermatologica");
        this.usuario = System.getenv().getOrDefault("SPRING_DATASOURCE_USERNAME", "postgres");
        this.password = System.getenv().getOrDefault("SPRING_DATASOURCE_PASSWORD", "postgrespassword");
    }

    /**
     * Punto de acceso global a la única instancia (inicialización perezosa y segura
     * ante múltiples hilos).
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
     * Abre y devuelve una conexión JDBC a la base de datos usando los datos de la
     * instancia única.
     *
     * @return una conexión JDBC lista para usar
     * @throws SQLException si no se puede establecer la conexión
     */
    public Connection obtenerConexion() throws SQLException {
        return DriverManager.getConnection(url, usuario, password);
    }

    /** @return la URL de conexión configurada (sin exponer la contraseña). */
    public String getUrl() {
        return url;
    }
}
