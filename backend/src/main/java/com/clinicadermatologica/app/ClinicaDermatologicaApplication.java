package com.clinicadermatologica.app;

import org.springframework.boot.SpringApplication; // Clase principal para inicializar el contenedor Spring Boot
import org.springframework.boot.autoconfigure.SpringBootApplication; // Anotación combinada (@Configuration, @EnableAutoConfiguration, @ComponentScan)
import org.springframework.scheduling.annotation.EnableScheduling; // Habilita la ejecución de tareas programadas en segundo plano (@Scheduled)

/**
 * Clase principal de inicio del Backend de la Clínica Dermatológica y Estética.
 */
@SpringBootApplication // Configura el escaneo automático de componentes y auto-configuraciones de Spring
@EnableScheduling // Activa el programador de tareas para la liberación automática de turnos vencidos (TTL 10 min)
public class ClinicaDermatologicaApplication {

    public static void main(String[] args) {
        // Ejecuta el arranque del servidor Tomcat embebido y levanta el contexto de Spring Boot
        SpringApplication.run(ClinicaDermatologicaApplication.class, args);
    }
}
