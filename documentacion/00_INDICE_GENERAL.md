# Índice Maestro y Estructura de Documentación del Proyecto

**Proyecto:** Sistema Integral de Gestión Dermatológica, Estética y Asistente Virtual con IA  
**Cátedra:** Ingeniería del Software II — Trabajo Práctico Especial (TPE) / Proyecto Integrador  
**Organización:** Carpetas modulares por categoría, fases técnicas e historial de PRDs

---

## 🗂️ Estructura General de `documentacion/`

La carpeta se encuentra organizada en **categorías claras y concisas** para facilitar su navegación tanto a simple vista como en revisiones académicas y defensas orales:

```
documentacion/
│
├── 00_INDICE_GENERAL.md                                  # Este documento: Mapa y guía de lectura rápida
├── README.md                                             # Acceso directo al índice en visualizadores Git
├── GUIA_MAESTRA_ESTANDAR_INGENIERIA_Y_AGENTES_IA.md      # Manual de Arquitectura, Requisitos y Protocolo IA
├── implementation_plan.md                                # Plan técnico de implementación vigente
│
├── 🏗️ fases/                                             # Módulos técnicos y especificaciones por fase
│   ├── fase1_especificacion_y_diseno/                    # UML (Paquetes, Despliegue), MER/MR, ACID y Glosario
│   ├── fase2_backend_y_calidad/                          # Algoritmo de slots, Storage y Tests JUnit 5
│   ├── fase3_frontend_avanzado_y_devops/                 # UI/UX clínica, Visor Antes/Después y Docker
│   ├── fase4_bpmn_y_casos_de_uso/                        # Procesos BPMN 2.0 y Casos de Uso formales (CU-01..08)
│   ├── fase5_cicd_y_calidad_continua/                    # Pipelines GitHub Actions (Backend y Frontend)
│   ├── fase6_comprobantes_y_consentimientos_pdf/         # Comprobante Oficial con QR y Consentimiento Ley 26.529
│   ├── fase7_dashboard_metricas_y_kpis/                  # KPIs, absentismo, facturación y métricas de gestión
│   ├── fase8_recordatorios_y_calendario_sync/            # Sincronización Google Calendar, Apple iCal (.ics) y Push
│   ├── fase9_guia_de_defensa_y_pitch/                    # Estrategia de defensa oral, guión demo y preguntas críticas
│   ├── fase10_diseno_mobile_y_responsive/                # Diseño Mobile-First, BottomNav y Bottom Sheets
│   └── fase11_landing_y_enrutamiento/                    # Landing page pública, login y ruteo protegido
│
├── 📜 historial_prds/                                     # Bitácora cronológica inmutable de versiones PRD
│   ├── CHANGELOG_PRDS.md                                 # Registro de cambios, autores y versiones
│   ├── PRD_v1.0_Fase1_Inicial.md a PRD_v13.0...          # PRDs de ciclo mayor
│   └── PRD_Fase_14... a PRD_Fase_27...                   # PRDs de extensiones y funcionalidades puntuales
│
├── 📁 recursos_academicos_originales/                     # Materiales, consignas y diagramas originales de cátedra
│   ├── CasosDeUso - DetalleDiagrama.docx                 # Detalle original de casos de uso
│   ├── MER.drawio / ModeladoBD.drawio / modelos.drawio   # Diagramas conceptuales originales
│   ├── Realidad para TPE.docx                            # Universo de discurso inicial
│   └── Entrega I - 18_08.docx                            # Primera entrega del trabajo práctico
│
├── 🗄️ base_de_datos/                                      # Definiciones de esquema y transacciones SQL
│   └── supabase_mer_ddl_and_transactions.sql             # DDL del modelo entidad-relación y funciones
│
└── 🧪 reportes/                                           # Reportes automatizados de calidad y cobertura
    ├── mutation_report.md                                # Informe de testing de mutación (análisis de sobrevivientes)
    └── mutation_report.json                              # Métricas en crudo del mutation testing runner
```

---

## 🧭 Guía de Lectura y Referencias Rápidas

| Necesidad / Objetivo | Documento Recomendado | Ubicación |
| :--- | :--- | :--- |
| **📘 Manual Maestro de Ingeniería & Agentes IA** | [Guía Maestra de Ingeniería](./GUIA_MAESTRA_ESTANDAR_INGENIERIA_Y_AGENTES_IA.md) | `documentacion/` |
| **Plan Técnico Vigente** | [Implementation Plan](./implementation_plan.md) | `documentacion/` |
| **Historial de Requisitos (PRDs)** | [Changelog de PRDs](./historial_prds/CHANGELOG_PRDS.md) | `historial_prds/` |
| **Diagramas UML, MER y Transacciones** | [Arquitectura y Diseño Técnico](./fases/fase1_especificacion_y_diseno/ARQUITECTURA_Y_DISENO_TECNICO.md) | `fases/fase1_especificacion_y_diseno/` |
| **Glosario de Anotaciones y Métodos** | [Glosario Técnico y Métodos](./fases/fase1_especificacion_y_diseno/GLOSARIO_TECNICO_Y_METODOS.md) | `fases/fase1_especificacion_y_diseno/` |
| **Backend, Storage y Tests** | [Fase 2: Implementación y Tests](./fases/fase2_backend_y_calidad/FASE_2_IMPLEMENTACION_Y_TESTS.md) | `fases/fase2_backend_y_calidad/` |
| **Frontend UI/UX y Docker** | [Fase 3: UI/UX y DevOps](./fases/fase3_frontend_avanzado_y_devops/FASE_3_FRONTEND_UIUX_Y_DEVOPS.md) | `fases/fase3_frontend_avanzado_y_devops/` |
| **Diagramas BPMN 2.0 y Casos de Uso** | [Fase 4: BPMN y Casos de Uso](./fases/fase4_bpmn_y_casos_de_uso/FASE_4_PROCESOS_BPMN_Y_CASOS_DE_USO.md) | `fases/fase4_bpmn_y_casos_de_uso/` |
| **Pipelines CI/CD & GitHub Actions** | [Fase 5: CI/CD y Calidad](./fases/fase5_cicd_y_calidad_continua/FASE_5_PIPELINES_CICD_GITHUB_ACTIONS.md) | `fases/fase5_cicd_y_calidad_continua/` |
| **Comprobantes y Consentimientos en PDF** | [Fase 6: Documentos y PDF](./fases/fase6_comprobantes_y_consentimientos_pdf/FASE_6_DOCUMENTOS_CLINICOS_Y_PDF.md) | `fases/fase6_comprobantes_y_consentimientos_pdf/` |
| **Dashboard y KPIs de Gestión** | [Fase 7: Dashboard y KPIs](./fases/fase7_dashboard_metricas_y_kpis/FASE_7_DASHBOARD_METRICAS_Y_KPIS.md) | `fases/fase7_dashboard_metricas_y_kpis/` |
| **Recordatorios & Sincronización Calendarios** | [Fase 8: Calendarios y Avisos](./fases/fase8_recordatorios_y_calendario_sync/FASE_8_SISTEMA_RECORDATORIOS_Y_CALENDARIOS.md) | `fases/fase8_recordatorios_y_calendario_sync/` |
| **Guía de Defensa Oral y Demo 7 min** | [Fase 9: Guía de Defensa](./fases/fase9_guia_de_defensa_y_pitch/GUIA_DE_DEFENSA_Y_DEMOSTRACION.md) | `fases/fase9_guia_de_defensa_y_pitch/` |
| **Diseño Mobile-First y Responsive UX** | [Fase 10: Diseño Mobile](./fases/fase10_diseno_mobile_y_responsive/FASE_10_DISENO_MOBILE_Y_RESPONSIVE.md) | `fases/fase10_diseno_mobile_y_responsive/` |
| **Landing Page Pública y Ruteo** | [Fase 11: Landing y Enrutamiento](./fases/fase11_landing_y_enrutamiento/FASE_11_LANDING_Y_ENRUTAMIENTO.md) | `fases/fase11_landing_y_enrutamiento/` |
| **Reportes de Mutation Testing** | [Reporte de Mutación](./reportes/mutation_report.md) | `reportes/` |
| **Esquema de Base de Datos SQL** | [DDL y Transacciones](./base_de_datos/supabase_mer_ddl_and_transactions.sql) | `base_de_datos/` |
| **Materiales Originales de la Cátedra** | [Recursos de Cátedra](./recursos_academicos_originales/) | `recursos_academicos_originales/` |
