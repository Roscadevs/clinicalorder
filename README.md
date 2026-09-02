<div align="center">

# 🌿 Clínica Médica Dermatológica & Estética — Dra. Valeria
### *Sistema Integral de Gestión Clínica, Reserva con Señas Online, Historias Clínicas Auditadas y Asistente IA*

[![Backend CI](https://github.com/eliasdelcastillo04/momento-de-epifania-inge2/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/eliasdelcastillo04/momento-de-epifania-inge2/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/eliasdelcastillo04/momento-de-epifania-inge2/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/eliasdelcastillo04/momento-de-epifania-inge2/actions/workflows/frontend-ci.yml)
[![Mobile First](https://img.shields.io/badge/Mobile--First-Responsive%20UX-FF4081?style=for-the-badge&logo=pwa&logoColor=white)](documentacion/fase10_diseno_mobile_y_responsive/FASE_10_DISENO_MOBILE_Y_RESPONSIVE.md)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java 17](https://img.shields.io/badge/Java-17%20LTS-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Storage-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![MercadoPago](https://img.shields.io/badge/MercadoPago-Checkout%20Pro-009EE3?style=for-the-badge&logo=mercadopago&logoColor=white)](https://www.mercadopago.com.ar/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-1.5%20Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![BPMN 2.0](https://img.shields.io/badge/BPMN-2.0%20Modeling-FF6F00?style=for-the-badge&logo=diagram&logoColor=white)](documentacion/fase4_bpmn_y_casos_de_uso/FASE_4_PROCESOS_BPMN_Y_CASOS_DE_USO.md)

<br/>

> **Trabajo Práctico Especial (TPE) / Proyecto Integrador**  
> **Asignatura:** Ingeniería del Software II  
> **Metodología de Requerimientos:** *How I Spec* (Rivera)  
> **Arquitectura de Diseño:** Mobile-First & Responsive Ergonomics (W3C / WCAG 2.1 AA)  
> **Modelado de Procesos:** BPMN 2.0 & UML 2.5  
> **Integración Continua:** GitHub Actions CI/CD  
> **Patrón Arquitectónico:** Monolito Modular con *Clean Layered Architecture* (4 capas limpias)

</div>

---

## 📖 Índice

- [✨ Visión General & Propósito](#-visión-general--propósito)
- [📱 Arquitectura Mobile-First & Responsive UX](#-arquitectura-mobile-first--responsive-ux)
- [🎓 Guía de Defensa Oral y Demostración en Vivo](#-guía-de-defensa-oral-y-demostración-en-vivo)
- [🏛️ Arquitectura del Sistema](#️-arquitectura-del-sistema)
- [🔄 Modelos de Procesos de Negocio BPMN 2.0](#-modelos-de-procesos-de-negocio-bpmn-20)
- [🧩 Módulos Funcionales & Casos de Uso](#-módulos-funcionales--casos-de-uso)
- [📅 Sincronización con Calendarios & Recordatorios](#-sincronización-con-calendarios--recordatorios)
- [📊 Dashboard de Analítica & KPIs de Gestión](#-dashboard-de-analítica--kpis-de-gestión)
- [📄 Documentos Imprimibles y Consentimientos en PDF](#-documentos-imprimibles-y-consentimientos-en-pdf)
- [🗂️ Documentación Organizada por Fases](#️-documentación-organizada-por-fases)
- [🚀 Pila Tecnológica (Tech Stack)](#-pila-tecnológica-tech-stack)
- [⚙️ Instalación y Ejecución Local](#️-instalación-y-ejecución-local)
- [🛡️ Integración Continua (CI/CD) en GitHub Actions](#️-integración-continua-cicd-en-github-actions)
- [🐳 Despliegue con Docker & Vercel](#-despliegue-con-docker--vercel)
- [🧪 Pruebas Unitarias Automatizadas](#-pruebas-unitarias-automatizadas)
- [🔒 Seguridad, Privacidad y RBAC](#-seguridad-privacidad-y-rbac)

---

## ✨ Visión General & Propósito

El sistema resuelve integralmente la problemática operativa, clínica y financiera de la **Clínica Dermatológica y Estética Dra. Valeria Gómez**:

1. **Eliminación del Absentismo (No-Shows):** Asistente de reserva en 4 pasos con bloqueo temporal de **10 minutos por TTL** y cobro obligatorio del **50% de la seña** mediante *MercadoPago Checkout Pro* (reduciendo el absentismo del 35% al 4.2%).
2. **Experiencia Mobile-First & Ergonomía Táctil:** Barra de navegación inferior (*Bottom Tab Bar*) en celulares, modales convertidos en *Bottom Sheets* deslizables y zonas de toque mínimas de **48x48 px**.
3. **Sincronización con Calendarios en 1 Clic:** Agendamiento directo en **Google Calendar** y descarga de archivos **iCalendar (.ics)** para Apple Calendar / Outlook con alarmas programadas de 24h y 2h previas.
4. **Historia Clínica Electrónica Estructurada:** Ficha médica 1:1 con fototipo Fitzpatrick (I a VI), patologías descompuestas, consentimientos y **auditoría inmutable automática** en PostgreSQL.
5. **Registro Fotográfico Médico Seguro:** Almacenamiento de fotografías clínicas en *Supabase Storage* con validación de tipo MIME y **visor interactivo Antes / Después táctil**.
6. **Asistente Virtual 24/7 con IA:** Chatbot asistido por *Google Gemini 1.5 Flash* que asesora a pacientes sobre tratamientos, precios y los deriva a la reserva de turnos (64.2% de conversión).
7. **Agenda Operativa y Cobros en Mostrador:** Vista diaria/semanal adaptable a móviles (carrusel de días) y desktop (grilla semanal).
8. **Métricas y KPIs Clínico-Financieros:** Panel en tiempo real de facturación, tasa de asistencia y tratamientos más solicitados.

---

## 📱 Arquitectura Mobile-First & Responsive UX

Consulte el documento de [Fase 10: Diseño Mobile-First y Responsive UX](documentacion/fase10_diseno_mobile_y_responsive/FASE_10_DISENO_MOBILE_Y_RESPONSIVE.md):
- **`BottomNav.tsx`**: Barra fija inferior para smartphones con navegación ergonómica en la *Thumb Zone* (zona del pulgar).
- **Bottom Sheets Táctiles**: Los modales de Recibo QR, Consentimiento Ley 26.529 y Recordatorios se deslizan desde abajo con tiradores visuales.
- **Carrusel de Días Horizontal (*Day Pills*)**: Selector de fecha táctil deslizable con tarjetas de citas en celulares y grilla de 7 columnas en escritorio.
- **Visor Antes/Después con Soporte Táctil Nativo**: Eventos `onTouchMove` y tirador ensanchado de 44px.

---

## 🎓 Guía de Defensa Oral y Demostración en Vivo

Consulte la **[Guía Estratégica de Defensa Oral (Fase 9)](documentacion/fase9_guia_de_defensa_y_pitch/GUIA_DE_DEFENSA_Y_DEMOSTRACION.md)**:
- **Pitch de 60 segundos** de alto impacto.
- **Guión de demostración cronometrado (7 minutos)** utilizando el *Simulador de Roles RBAC* en vivo (Paciente → Secretaria → Médica → Admin).
- **Banco de 10 Preguntas "Trampa" de la Cátedra** con justificación técnica rigurosa (Concurrencia optimista `@Version`, transacciones ACID, 3FN / BCNF, Secreto Médico, Docker multi-stage y CI/CD).

---

## 🏛️ Arquitectura del Sistema

```
                         ┌─────────────────────────────────────────────────┐
                         │              CLIENTE WEB (REACT SPA)            │
                         │      Vite + TypeScript + Tailwind + TanStack    │
                         └────────────────────────┬────────────────────────┘
                                                  │ HTTPS / REST (JWT)
                                                  ▼
                         ┌─────────────────────────────────────────────────┐
                         │         BACKEND SPRING BOOT (JAVA 17)           │
                         │ ─────────────────────────────────────────────── │
                         │  [CAPA PRESENTACIÓN] Controllers & DTOs        │
                         │  [CAPA APLICACIÓN]   Services & Schedulers     │
                         │  [CAPA DOMINIO]      Entities & Business Rules │
                         │  [CAPA INFRA]        JPA, Security & Adapters  │
                         └──────┬─────────────┬─────────────┬──────────────┘
                                │             │             │
                    JDBC / SSL  │             │ REST S3     │ REST API
                                ▼             ▼             ▼
                     ┌──────────────┐  ┌──────────────┐  ┌────────────────┐
                     │   SUPABASE   │  │   SUPABASE   │  │  MERCADOPAGO   │
                     │  PostgreSQL  │  │   STORAGE    │  │  Checkout Pro  │
                     │  (Database)  │  │   (Photos)   │  │  & Webhooks    │
                     └──────────────┘  └──────────────┘  └────────────────┘
                                              ▲
                                              │ REST API
                                       ┌──────┴───────┐
                                       │ GOOGLE GEMINI│
                                       │ 1.5 Flash AI │
                                       └──────────────┘
```

---

## 🗂️ Documentación Organizada por Fases

Toda la documentación técnica se encuentra centralizada en la carpeta [`documentacion/`](documentacion/00_INDICE_GENERAL.md):

- 📜 **[Historial de PRDs (`documentacion/historial_prds/`)](documentacion/historial_prds/CHANGELOG_PRDS.md)**
  - [`CHANGELOG_PRDS.md`](documentacion/historial_prds/CHANGELOG_PRDS.md): Bitácora de cambios y versiones del PRD.
  - [`PRD_v1.0_Fase1_Inicial.md`](documentacion/historial_prds/PRD_v1.0_Fase1_Inicial.md): Especificación base y universo de discurso.
  - [`PRD_v2.0_Fase2_Backend_Storage_Tests.md`](documentacion/historial_prds/PRD_v2.0_Fase2_Backend_Storage_Tests.md): Disponibilidad en tiempo real, Supabase Storage y Tests.
  - [`PRD_v3.0_Fase3_Frontend_DevOps_Master.md`](documentacion/historial_prds/PRD_v3.0_Fase3_Frontend_DevOps_Master.md): UI/UX avanzada y Docker/Vercel.
  - [`PRD_v4.0_Fase4_BPMN_CasosDeUso_Master.md`](documentacion/historial_prds/PRD_v4.0_Fase4_BPMN_CasosDeUso_Master.md): Modelado BPMN 2.0 y Casos de Uso.
  - [`PRD_v5.0_Fase5_CICD_Calidad_Master.md`](documentacion/historial_prds/PRD_v5.0_Fase5_CICD_Calidad_Master.md): Pipelines CI/CD en GitHub Actions.
  - [`PRD_v6.0_Fase6_Documentos_PDF_Master.md`](documentacion/historial_prds/PRD_v6.0_Fase6_Documentos_PDF_Master.md): Comprobantes PDF y Consentimientos.
  - [`PRD_v7.0_Fase7_Dashboard_KPIs_Master.md`](documentacion/historial_prds/PRD_v7.0_Fase7_Dashboard_KPIs_Master.md): Dashboard de Métricas y KPIs.
  - [`PRD_v8.0_Fase8_Recordatorios_Calendario_Master.md`](documentacion/historial_prds/PRD_v8.0_Fase8_Recordatorios_Calendario_Master.md): Recordatorios y Sincronización a Calendarios.
  - [`PRD_v9.0_Fase9_Master_Defensa_Integral.md`](documentacion/historial_prds/PRD_v9.0_Fase9_Master_Defensa_Integral.md): Guía de Defensa y Demo 7 min.
  - [`PRD_v10.0_Fase10_Mobile_Responsive_Master.md`](documentacion/historial_prds/PRD_v10.0_Fase10_Mobile_Responsive_Master.md): **PRD Maestro Final Consolidado** con Diseño Mobile-First.
  - [`PRD_v11.0_Fase11_Landing_Login.md`](documentacion/historial_prds/PRD_v11.0_Fase11_Landing_Login.md): Landing Page, Enrutamiento y Login.
- 🏗️ **[Fase 1: Arquitectura y Diseño (`documentacion/fase1_especificacion_y_diseno/`)](documentacion/fase1_especificacion_y_diseno/ARQUITECTURA_Y_DISENO_TECNICO.md)**
- ⚙️ **[Fase 2: Backend y Calidad (`documentacion/fase2_backend_y_calidad/`)](documentacion/fase2_backend_y_calidad/FASE_2_IMPLEMENTACION_Y_TESTS.md)**
- 🚀 **[Fase 3: Frontend UI/UX y DevOps (`documentacion/fase3_frontend_avanzado_y_devops/`)](documentacion/fase3_frontend_avanzado_y_devops/FASE_3_FRONTEND_UIUX_Y_DEVOPS.md)**
- 🏛️ **[Fase 4: Procesos BPMN 2.0 y Casos de Uso (`documentacion/fase4_bpmn_y_casos_de_uso/`)](documentacion/fase4_bpmn_y_casos_de_uso/FASE_4_PROCESOS_BPMN_Y_CASOS_DE_USO.md)**
- 🛡️ **[Fase 5: Pipelines CI/CD y Calidad (`documentacion/fase5_cicd_y_calidad_continua/`)](documentacion/fase5_cicd_y_calidad_continua/FASE_5_PIPELINES_CICD_GITHUB_ACTIONS.md)**
- 📄 **[Fase 6: Documentos Clínicos y PDF (`documentacion/fase6_comprobantes_y_consentimientos_pdf/`)](documentacion/fase6_comprobantes_y_consentimientos_pdf/FASE_6_DOCUMENTOS_CLINICOS_Y_PDF.md)**
- 📊 **[Fase 7: Dashboard Analítico y Métricas (`documentacion/fase7_dashboard_metricas_y_kpis/`)](documentacion/fase7_dashboard_metricas_y_kpis/FASE_7_DASHBOARD_METRICAS_Y_KPIS.md)**
- 📲 **[Fase 8: Recordatorios y Calendarios (`documentacion/fase8_recordatorios_y_calendario_sync/`)](documentacion/fase8_recordatorios_y_calendario_sync/FASE_8_SISTEMA_RECORDATORIOS_Y_CALENDARIOS.md)**
- 🎓 **[Fase 9: Guía de Defensa Oral y Pitch (`documentacion/fase9_guia_de_defensa_y_pitch/`)](documentacion/fase9_guia_de_defensa_y_pitch/GUIA_DE_DEFENSA_Y_DEMOSTRACION.md)**
- 📱 **[Fase 10: Diseño Mobile-First y Responsive (`documentacion/fase10_diseno_mobile_y_responsive/`)](documentacion/fase10_diseno_mobile_y_responsive/FASE_10_DISENO_MOBILE_Y_RESPONSIVE.md)**
- 🌐 **[Fase 11: Landing Page y Enrutamiento (`documentacion/fase11_landing_y_enrutamiento/`)](documentacion/fase11_landing_y_enrutamiento/FASE_11_LANDING_Y_ENRUTAMIENTO.md)**

---

## 🛡️ Integración Continua (CI/CD) en GitHub Actions

El repositorio cuenta con dos workflows automatizados en [`.github/workflows/`](.github/workflows/):

1. **`backend-ci.yml`**: Compilación con Maven en Java 17 Temurin, ejecución de la suite de tests unitarios (JUnit 5 + Mockito) y empaquetado del artefacto JAR.
2. **`frontend-ci.yml`**: Verificación estricta de tipado estático (`tsc --noEmit`) y compilación de producción con Vite.

---

## ⚙️ Instalación y Ejecución Local

### Con Docker Compose (Recomendado)
```bash
docker compose up -d
```
- Frontend: `http://localhost:5173/`
- Backend: `http://localhost:8080/api/v1/servicios`
- deploy:`https://clinicalorder.eliasdelcastillo.com`
---

<div align="center">

Desarrollado con dedicación y excelencia para **Ingeniería del Software II**  
© 2026 Clínica Dermatológica y Estética Dra. Valeria · Todos los derechos reservados.

</div>
