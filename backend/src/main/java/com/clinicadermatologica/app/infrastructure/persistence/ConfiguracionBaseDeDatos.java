package com.clinicadermatologica.app.infrastructure.persistence;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

/**
 * Conecta Spring con el Singleton {@link ConexionBD}.
 *
 * Al declarar este bean, Spring Boot NO crea su propio pool de conexiones: usa el que
 * administra la instancia única de ConexionBD. Así Hibernate, los DAO (Spring Data JPA) y
 * Flyway obtienen sus conexiones siempre del mismo pool.
 */
@Configuration
public class ConfiguracionBaseDeDatos {

    /**
     * Pool de conexiones de la aplicación, provisto por el Singleton.
     *
     * @return el pool único de ConexionBD
     */
    @Bean
    public DataSource dataSource() {
        return ConexionBD.getInstance().getPool();
    }
}
