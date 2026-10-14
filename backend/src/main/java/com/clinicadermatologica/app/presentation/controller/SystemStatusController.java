package com.clinicadermatologica.app.presentation.controller;

import com.clinicadermatologica.app.infrastructure.persistence.ConexionBD;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

/**
 * Controlador REST de estado del sistema.
 *
 * Expone una verificación simple del estado de la base de datos utilizando el patrón
 * SINGLETON {@link ConexionBD}: obtiene la única instancia con {@code getInstance()} y
 * solicita una conexión mediante {@code obtenerConexion()}. Es un uso real del Singleton
 * como punto de acceso global a la conexión con la base de datos.
 *
 * Ruta: /api/v1/estado (prefijo /api/v1 configurado en server.servlet.context-path).
 */
@RestController
@RequestMapping("/estado")
public class SystemStatusController {

    /**
     * Verifica la conectividad con la base de datos a través del Singleton de conexión.
     *
     * @return estado del sistema y de la base de datos
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> estado() {
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("aplicacion", "clinica-dermatologica-backend");

        // Punto de acceso global a la conexión mediante el patrón Singleton
        ConexionBD conexion = ConexionBD.getInstance();
        try (Connection c = conexion.obtenerConexion()) {
            boolean activa = c != null && !c.isClosed();
            respuesta.put("baseDeDatos", activa ? "conectada" : "no disponible");
        } catch (Exception e) {
            respuesta.put("baseDeDatos", "no disponible");
        }

        return ResponseEntity.ok(respuesta);
    }
}
