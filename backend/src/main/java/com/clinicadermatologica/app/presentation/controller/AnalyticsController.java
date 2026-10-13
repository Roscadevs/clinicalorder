package com.clinicadermatologica.app.presentation.controller;

import com.clinicadermatologica.app.application.service.AnalyticsService;
import com.clinicadermatologica.app.presentation.dto.AnalyticsKpisResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador REST para la consulta de métricas de gestión y KPIs dinámicos del dashboard.
 * Ruta: /api/v1/analytics/kpis (prefijo /api/v1 configurado globalmente en server.servlet.context-path).
 */
@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    /**
     * Retorna los indicadores consolidados de gestión clínica y financiera.
     * Restringido a usuarios con rol DOCTORA o ADMIN.
     */
    @GetMapping("/kpis")
    @PreAuthorize("hasAnyRole('DOCTORA', 'ADMIN')")
    public ResponseEntity<AnalyticsKpisResponseDTO> getKpis() {
        return ResponseEntity.ok(analyticsService.getKpis());
    }
}
