# Índice Maestro y Estructura de Documentación del Proyecto

**Proyecto:** Sistema Integral de Gestión Dermatológica, Estética y Asistente Virtual con IA  
**Cátedra:** Ingeniería del Software II — Trabajo Práctico Especial (TPE) / Proyecto Integrador  
**Organización:** Carpetas Modulares por Fases e Historial de PRDs

---

## 🗂️ Estructura Completa de Subcarpetas en `documentacion/`

```
documentacion/
│
├── 00_INDICE_GENERAL.md                                  # Este documento: Mapa y guía de lectura
│
├── 📜 historial_prds/                                     # Historial cronológico de versiones del PRD
│   ├── CHANGELOG_PRDS.md                                 # Registro de cambios, autores y versiones
│   ├── PRD_v1.0_Fase1_Inicial.md                         # Versión 1.0 (Especificación base y alcance)
│   ├── PRD_v2.0_Fase2_Backend_Storage_Tests.md           # Versión 2.0 (Disponibilidad, Storage y Tests)
│   └── PRD_v3.0_Fase3_Frontend_DevOps_Master.md          # Versión 3.0 (Master / Vigente con UI/UX y DevOps)
│
├── 🏗️ fase1_especificacion_y_diseno/                      # Fase 1: Arquitectura base y Modelado
│   ├── ARQUITECTURA_Y_DISENO_TECNICO.md                  # Diagramas UML (Paquetes, Despliegue), MER/MR, ACID
│   └── GLOSARIO_TECNICO_Y_METODOS.md                     # Catálogo de anotaciones, métodos de negocio y hooks
│
├── ⚙️ fase2_backend_y_calidad/                            # Fase 2: Backend avanzado, Storage y Calidad
│   └── FASE_2_IMPLEMENTACION_Y_TESTS.md                  # Algoritmo de slots, Supabase Storage y Tests JUnit 5
│
├── 🚀 fase3_frontend_avanzado_y_devops/                   # Fase 3: UI/UX médica y Automatización DevOps
│   └── FASE_3_FRONTEND_UIUX_Y_DEVOPS.md                  # Visor Antes/Después, Timeline de Auditoría y Docker
│
└── 📁 recursos_academicos_originales/                     # Materiales y diagramas base entregados por la cátedra
    ├── 2.- Microservicios y RestSimplificado.pdf
    ├── CasosDeUso - DetalleDiagrama.docx
    ├── CasosDeUso.drawio.png
    ├── Entrega I - 18_08.docx
    ├── HISTORIA CLÍNICA MODELO.pdf
    ├── Ingeniería del Software II - borrador.docx
    ├── MER.drawio
    ├── ModeladoBD.drawio
    ├── Modelo de Datos - Sistema de Gestión Dermatológica.docx
    ├── Realidad para TPE (Trabajo Práctico Especial).docx
    └── modelos.drawio
```

---

## 🧭 Guía de Lectura y Referencias Rápidas

| Necesidad / Objetivo | Documento Recomendado | Ubicación |
| :--- | :--- | :--- |
| **PRD Vigente Completo (How I Spec)** | [PRD v3.0 Master](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/historial_prds/PRD_v3.0_Fase3_Frontend_DevOps_Master.md) | `historial_prds/` |
| **Historial de Revisiones del PRD** | [Changelog de PRDs](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/historial_prds/CHANGELOG_PRDS.md) | `historial_prds/` |
| **Diagramas UML, MER y Transacciones** | [Arquitectura y Diseño Técnico](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/fase1_especificacion_y_diseno/ARQUITECTURA_Y_DISENO_TECNICO.md) | `fase1_especificacion_y_diseno/` |
| **Glosario de Anotaciones y Métodos** | [Glosario Técnico y Métodos](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/fase1_especificacion_y_diseno/GLOSARIO_TECNICO_Y_METODOS.md) | `fase1_especificacion_y_diseno/` |
| **Detalle de Tests y Módulos Fase 2** | [Fase 2: Implementación y Tests](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/fase2_backend_y_calidad/FASE_2_IMPLEMENTACION_Y_TESTS.md) | `fase2_backend_y_calidad/` |
| **Archivos Originales de la Cátedra** | Recursos Academicos | `recursos_academicos_originales/` |
