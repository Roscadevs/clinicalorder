# Original User Request

## Initial Request — 2026-08-10T22:35:34Z

# Teamwork Project Prompt — Draft

> Status: Ready for launch — awaiting user approval
> Goal: Craft prompt → get user approval → delegate to teamwork_preview

Implementar una suite completa de pruebas (unitarias, integración y mutación) tanto para el frontend como para el backend del Sistema de Gestión Dermatológica, para asegurar la calidad del código.

Working directory: /Users/eliasignaciodelcastillogodoy/Desktop/E/UNIVERSIDAD/clases-material/2026-2do/ingenieria-2/TP
Integrity mode: development

## Requirements

### R1. Pruebas Unitarias y de Integración
Configurar e implementar pruebas unitarias y de integración en las carpetas `backend` y `frontend` cubriendo la lógica principal de la aplicación.

### R2. Pruebas de Mutación
Configurar e implementar una herramienta de pruebas de mutación (ej. Stryker) en ambos entornos para evaluar la calidad de las pruebas creadas (mutation score).

### R3. Casos de Uso Representativos
Desarrollar pruebas que validen los flujos más importantes del sistema, leyendo el código actual y los modelos definidos.

## Acceptance Criteria

### Ejecución de Pruebas
- [ ] Ejecutar exitosamente el comando de pruebas unitarias/integración en el backend y que todas pasen.
- [ ] Ejecutar exitosamente el comando de pruebas unitarias/integración en el frontend y que todas pasen.

### Ejecución de Pruebas de Mutación
- [ ] Ejecutar el comando de pruebas de mutación en el backend, generar un reporte y alcanzar al menos un 70% de mutantes eliminados (killed) en los archivos testeados.
- [ ] Ejecutar el comando de pruebas de mutación en el frontend, generar un reporte y alcanzar al menos un 70% de mutantes eliminados en los archivos testeados.
