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
│   ├── PRD_v3.0_Fase3_Frontend_DevOps_Master.md          # Versión 3.0 (UI/UX avanzada y Docker/Vercel)
│   ├── PRD_v4.0_Fase4_BPMN_CasosDeUso_Master.md          # Versión 4.0 (Modelado BPMN 2.0 y Casos de Uso)
│   ├── PRD_v5.0_Fase5_CICD_Calidad_Master.md             # Versión 5.0 (Pipelines CI/CD en GitHub Actions)
│   ├── PRD_v6.0_Fase6_Documentos_PDF_Master.md           # Versión 6.0 (Comprobantes PDF y Consentimiento Ley 26.529)
│   ├── PRD_v7.0_Fase7_Dashboard_KPIs_Master.md           # Versión 7.0 (Dashboard de KPIs y Métricas)
│   ├── PRD_v8.0_Fase8_Recordatorios_Calendario_Master.md # Versión 8.0 (Recordatorios y Sincronización Calendarios)
│   └── PRD_v9.0_Fase9_Master_Defensa_Integral.md         # Versión 9.0 (Master Final con Guía de Defensa y Demo)
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
├── 🏛️ fase4_bpmn_y_casos_de_uso/                          # Fase 4: Procesos BPMN 2.0 y Casos de Uso Formales
│   └── FASE_4_PROCESOS_BPMN_Y_CASOS_DE_USO.md            # Diagramas BPMN (PR-01 a PR-05) y Casos de Uso (CU-01 a CU-08)
│
├── 🛡️ fase5_cicd_y_calidad_continua/                      # Fase 5: Pipelines CI/CD y Calidad Automatizada
│   └── FASE_5_PIPELINES_CICD_GITHUB_ACTIONS.md           # Workflows de GitHub Actions (Backend y Frontend)
│
├── 📄 fase6_comprobantes_y_consentimientos_pdf/           # Fase 6: Documentos Clínicos, Comprobantes y PDF
│   └── FASE_6_DOCUMENTOS_CLINICOS_Y_PDF.md               # Comprobante Oficial con QR y Consentimiento Ley 26.529
│
├── 📊 fase7_dashboard_metricas_y_kpis/                    # Fase 7: Dashboard Analítico y KPIs de Gestión
│   └── FASE_7_DASHBOARD_METRICAS_Y_KPIS.md               # Indicadores de absentismo, facturación y tratamientos
│
├── 📲 fase8_recordatorios_y_calendario_sync/              # Fase 8: Sincronización de Calendarios y Recordatorios
│   └── FASE_8_SISTEMA_RECORDATORIOS_Y_CALENDARIOS.md     # Google Calendar, Apple/Outlook iCal (.ics) y Push
│
├── 🎓 fase9_guia_de_defensa_y_pitch/                      # Fase 9: Estrategia de Defensa Oral, Pitch y Preguntas
│   └── GUIA_DE_DEFENSA_Y_DEMOSTRACION.md                 # Guión de demo 7 min y banco de 10 preguntas críticas
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
| **PRD Vigente Completo (How I Spec)** | [PRD v9.0 Master Final](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/historial_prds/PRD_v9.0_Fase9_Master_Defensa_Integral.md) | `historial_prds/` |
| **Guía de Defensa Oral y Demo 7 min** | [Fase 9: Guía de Defensa](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/fase9_guia_de_defensa_y_pitch/GUIA_DE_DEFENSA_Y_DEMOSTRACION.md) | `fase9_guia_de_defensa_y_pitch/` |
| **Historial de Revisiones del PRD** | [Changelog de PRDs](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/historial_prds/CHANGELOG_PRDS.md) | `historial_prds/` |
| **Recordatorios & Sincronización Calendarios** | [Fase 8: Calendarios y Avisos](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/fase8_recordatorios_y_calendario_sync/FASE_8_SISTEMA_RECORDATORIOS_Y_CALENDARIOS.md) | `fase8_recordatorios_y_calendario_sync/` |
| **Dashboard y KPIs de Gestión** | [Fase 7: Dashboard y KPIs](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/fase7_dashboard_metricas_y_kpis/FASE_7_DASHBOARD_METRICAS_Y_KPIS.md) | `fase7_dashboard_metricas_y_kpis/` |
| **Comprobantes y Consentimientos en PDF** | [Fase 6: Documentos y PDF](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/fase6_comprobantes_y_consentimientos_pdf/FASE_6_DOCUMENTOS_CLINICOS_Y_PDF.md) | `fase6_comprobantes_y_consentimientos_pdf/` |
| **Pipelines CI/CD & GitHub Actions** | [Fase 5: CI/CD y Calidad](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/fase5_cicd_y_calidad_continua/FASE_5_PIPELINES_CICD_GITHUB_ACTIONS.md) | `fase5_cicd_y_calidad_continua/` |
| **Diagramas de Procesos BPMN 2.0 y Casos de Uso** | [Fase 4: BPMN y Casos de Uso](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/fase4_bpmn_y_casos_de_uso/FASE_4_PROCESOS_BPMN_Y_CASOS_DE_USO.md) | `fase4_bpmn_y_casos_de_uso/` |
| **Diagramas UML, MER y Transacciones** | [Arquitectura y Diseño Técnico](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/fase1_especificacion_y_diseno/ARQUITECTURA_Y_DISENO_TECNICO.md) | `fase1_especificacion_y_diseno/` |
| **Glosario de Anotaciones y Métodos** | [Glosario Técnico y Métodos](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/fase1_especificacion_y_diseno/GLOSARIO_TECNICO_Y_METODOS.md) | `fase1_especificacion_y_diseno/` |
| **Detalle de Tests y Módulos Fase 2** | [Fase 2: Implementación y Tests](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/fase2_backend_y_calidad/FASE_2_IMPLEMENTACION_Y_TESTS.md) | `fase2_backend_y_calidad/` |
| **Frontend UI/UX y DevOps** | [Fase 3: UI/UX y DevOps](file:///Users/eliasignaciodelcastillogodoy/Desktop/ProyectoIntegrador/documentacion/fase3_frontend_avanzado_y_devops/FASE_3_FRONTEND_UIUX_Y_DEVOPS.md) | `fase3_frontend_avanzado_y_devops/` |
| **Archivos Originales de la Cátedra** | Recursos Académicos Base | `recursos_academicos_originales/` |
