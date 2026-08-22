<div align="center">

# 🌿 Clínica Médica Dermatológica & Estética — Dra. Valeria
### *Sistema Integral de Gestión Clínica, Reserva con Señas Online, Historias Clínicas Auditadas y Asistente IA*

[![Backend CI](https://github.com/eliasdelcastillo04/momento-de-epifania-inge2/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/eliasdelcastillo04/momento-de-epifania-inge2/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/eliasdelcastillo04/momento-de-epifania-inge2/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/eliasdelcastillo04/momento-de-epifania-inge2/actions/workflows/frontend-ci.yml)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java 17](https://img.shields.io/badge/Java-17%20LTS-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Storage-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![MercadoPago](https://img.shields.io/badge/MercadoPago-Checkout%20Pro-009EE3?style=for-the-badge&logo=mercadopago&logoColor=white)](https://www.mercadopago.com.ar/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-1.5%20Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![BPMN 2.0](https://img.shields.io/badge/BPMN-2.0%20Modeling-FF6F00?style=for-the-badge&logo=diagram&logoColor=white)](documentacion/fase4_bpmn_y_casos_de_uso/FASE_4_PROCESOS_BPMN_Y_CASOS_DE_USO.md)
[![Vercel](https://img.shields.io/badge/Vercel-Frontend%20Edge-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<br/>

> **Trabajo Práctico Especial (TPE) / Proyecto Integrador**  
> **Asignatura:** Ingeniería del Software II  
> **Metodología de Requerimientos:** *How I Spec* (Rivera)  
> **Modelado de Procesos:** BPMN 2.0 & UML 2.5  
> **Integración Continua:** GitHub Actions CI/CD  
> **Patrón Arquitectónico:** Monolito Modular con *Clean Layered Architecture* (4 capas limpias)

</div>

---

## 📖 Índice

- [✨ Visión General & Propósito](#-visión-general--propósito)
- [🏛️ Arquitectura del Sistema](#️-arquitectura-del-sistema)
- [🔄 Modelos de Procesos de Negocio BPMN 2.0](#-modelos-de-procesos-de-negocio-bpmn-20)
- [🧩 Módulos Funcionales & Casos de Uso](#-módulos-funcionales--casos-de-uso)
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

1. **Eliminación del Absentismo (No-Shows):** Asistente de reserva en 4 pasos con bloqueo temporal de **10 minutos por TTL** y cobro obligatorio del **50% de la seña** mediante *MercadoPago Checkout Pro*.
2. **Historia Clínica Electrónica Estructurada:** Ficha médica 1:1 con fototipo Fitzpatrick (I a VI), patologías descompuestas, consentimientos y **auditoría inmutable automática** en PostgreSQL.
3. **Registro Fotográfico Médico Seguro:** Almacenamiento de fotografías clínicas en *Supabase Storage* con validación de tipo MIME y **visor interactivo Antes / Después** con slider deslizante.
4. **Asistente Virtual 24/7 con IA:** Chatbot asistido por *Google Gemini 1.5 Flash* que asesora a pacientes sobre tratamientos, precios y los deriva a la reserva de turnos.
5. **Agenda Operativa y Cobros en Mostrador:** Gestión visual para la secretaria con liquidación del 50% restante en mostrador (efectivo/tarjeta).

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

## 🔄 Modelos de Procesos de Negocio BPMN 2.0

El sistema cuenta con el modelado formal de 5 procesos de negocio en estándar **BPMN 2.0**:

- **`PR-01`:** Reserva de Turno Online, Retención de 10 min por TTL, Seña en MercadoPago y Notificación por Email.
- **`PR-02`:** Consulta Médica, Registro Fotográfico en Supabase Storage, Evolución Clínica y Auditoría Inmutable.
- **`PR-03`:** Recepción, Verificación de Asistencia, Liquidación de Saldo Restante (50%) en Mostrador y Cierre.
- **`PR-04`:** Asesoramiento Automatizado con Google Gemini AI y Derivación al Catálogo.
- **`PR-05`:** Recuperación Segura de Contraseña mediante Tokens Criptográficos de 15 minutos.

*Consulte los diagramas detallados en [Fase 4: BPMN y Casos de Uso](documentacion/fase4_bpmn_y_casos_de_uso/FASE_4_PROCESOS_BPMN_Y_CASOS_DE_USO.md).*

---

## 🧩 Módulos Funcionales & Casos de Uso

| Módulo | Casos de Uso Asociados | Descripción | Rol de Acceso |
| :--- | :--- | :--- | :--- |
| **1. Portal & Chatbot IA** | `CU-01` | Asesoramiento en lenguaje natural sobre tratamientos y precios mediante Gemini API. | Público |
| **2. Reserva & Señas Online** | `CU-02`, `CU-03`, `CU-04` | Wizard de reserva, cálculo de slots disponibles (09-19h) y pasarela de pago MercadoPago. | Paciente / Público |
| **3. Agenda & Cobros** | `CU-05` | Vista de turnos diarios/semanales, cancelación y liquidación del saldo restante del 50%. | Secretaria / Médica |
| **4. Historia Clínica Digital** | `CU-06` | Ficha médica estructurada (Fitzpatrick I-VI, alergias, patologías, evoluciones). | Médica (`PHYSICIAN`) |
| **5. Registro Fotográfico** | `CU-07` | Subida de imágenes a Supabase Storage y visor comparativo *Antes y Después*. | Médica (`PHYSICIAN`) |
| **6. Auditoría Legal** | `CU-08` | Línea de tiempo de cambios inmutables con diffs JSON previos y nuevos. | Médica (`PHYSICIAN`) |
| **7. Administración & Tarifas** | `CU-09` | CRUD de catálogo de tratamientos, ajuste de precios base y porcentaje de seña. | Administrador (`ADMIN`) |
| **8. Seguridad de Accesos** | `CU-10` | Inicio de sesión JWT, protección de fuerza bruta (5 intentos) y reset de password. | Todos los roles |

---

## 🗂️ Documentación Organizada por Fases

Toda la documentación técnica se encuentra centralizada en la carpeta [`documentacion/`](documentacion/00_INDICE_GENERAL.md):

- 📜 **[Historial de PRDs (`documentacion/historial_prds/`)](documentacion/historial_prds/CHANGELOG_PRDS.md)**
  - [`CHANGELOG_PRDS.md`](documentacion/historial_prds/CHANGELOG_PRDS.md): Bitácora de cambios y versiones del PRD.
  - [`PRD_v1.0_Fase1_Inicial.md`](documentacion/historial_prds/PRD_v1.0_Fase1_Inicial.md): Especificación base y universo de discurso.
  - [`PRD_v2.0_Fase2_Backend_Storage_Tests.md`](documentacion/historial_prds/PRD_v2.0_Fase2_Backend_Storage_Tests.md): Disponibilidad en tiempo real, Supabase Storage y Tests.
  - [`PRD_v3.0_Fase3_Frontend_DevOps_Master.md`](documentacion/historial_prds/PRD_v3.0_Fase3_Frontend_DevOps_Master.md): UI/UX avanzada y Docker/Vercel.
  - [`PRD_v4.0_Fase4_BPMN_CasosDeUso_Master.md`](documentacion/historial_prds/PRD_v4.0_Fase4_BPMN_CasosDeUso_Master.md): Modelado BPMN 2.0 y Casos de Uso.
  - [`PRD_v5.0_Fase5_CICD_Calidad_Master.md`](documentacion/historial_prds/PRD_v5.0_Fase5_CICD_Calidad_Master.md): **PRD Maestro Vigente** con CI/CD en GitHub Actions.
- 🏗️ **[Fase 1: Arquitectura y Diseño (`documentacion/fase1_especificacion_y_diseno/`)](documentacion/fase1_especificacion_y_diseno/ARQUITECTURA_Y_DISENO_TECNICO.md)**
  - [`ARQUITECTURA_Y_DISENO_TECNICO.md`](documentacion/fase1_especificacion_y_diseno/ARQUITECTURA_Y_DISENO_TECNICO.md): Diagramas UML, MER/MR, 1FN/2FN/3FN y transacciones ACID.
  - [`GLOSARIO_TECNICO_Y_METODOS.md`](documentacion/fase1_especificacion_y_diseno/GLOSARIO_TECNICO_Y_METODOS.md): Glosario exhaustivo de anotaciones Spring Boot, métodos de negocio y hooks.
- ⚙️ **[Fase 2: Backend y Calidad (`documentacion/fase2_backend_y_calidad/`)](documentacion/fase2_backend_y_calidad/FASE_2_IMPLEMENTACION_Y_TESTS.md)**
  - [`FASE_2_IMPLEMENTACION_Y_TESTS.md`](documentacion/fase2_backend_y_calidad/FASE_2_IMPLEMENTACION_Y_TESTS.md): Detalle técnico de disponibilidad y tests unitarios.
- 🚀 **[Fase 3: Frontend UI/UX y DevOps (`documentacion/fase3_frontend_avanzado_y_devops/`)](documentacion/fase3_frontend_avanzado_y_devops/FASE_3_FRONTEND_UIUX_Y_DEVOPS.md)**
  - [`FASE_3_FRONTEND_UIUX_Y_DEVOPS.md`](documentacion/fase3_frontend_avanzado_y_devops/FASE_3_FRONTEND_UIUX_Y_DEVOPS.md): Visor Antes/Después, Timeline de Auditoría y Docker.
- 🏛️ **[Fase 4: Procesos BPMN 2.0 y Casos de Uso (`documentacion/fase4_bpmn_y_casos_de_uso/`)](documentacion/fase4_bpmn_y_casos_de_uso/FASE_4_PROCESOS_BPMN_Y_CASOS_DE_USO.md)**
  - [`FASE_4_PROCESOS_BPMN_Y_CASOS_DE_USO.md`](documentacion/fase4_bpmn_y_casos_de_uso/FASE_4_PROCESOS_BPMN_Y_CASOS_DE_USO.md): 5 Procesos BPMN 2.0 (PR-01 a PR-05), 8 Casos de Uso Formales (CU-01 a CU-08) y Matriz de Trazabilidad.
- 🛡️ **[Fase 5: Pipelines CI/CD y Calidad (`documentacion/fase5_cicd_y_calidad_continua/`)](documentacion/fase5_cicd_y_calidad_continua/FASE_5_PIPELINES_CICD_GITHUB_ACTIONS.md)**
  - [`FASE_5_PIPELINES_CICD_GITHUB_ACTIONS.md`](documentacion/fase5_cicd_y_calidad_continua/FASE_5_PIPELINES_CICD_GITHUB_ACTIONS.md): Workflows automatizados de GitHub Actions (Backend Java 17 y Frontend React).

---

## 🛡️ Integración Continua (CI/CD) en GitHub Actions

El repositorio cuenta con dos workflows automatizados en [`.github/workflows/`](.github/workflows/):

1. **`backend-ci.yml`**: Compilación con Maven en Java 17 Temurin, ejecución de la suite de tests unitarios (JUnit 5 + Mockito) y empaquetado del artefacto JAR.
2. **`frontend-ci.yml`**: Verificación estricta de tipado estático (`tsc --noEmit`) y compilación de producción con Vite.

---

## 🚀 Pila Tecnológica (Tech Stack)

### Backend
- **Lenguaje:** Java 17 LTS
- **Framework:** Spring Boot 3.2.3
- **Seguridad:** Spring Security 6 + JJWT (HMAC-SHA256) + BCrypt (costo 12)
- **Persistencia:** Spring Data JPA + Hibernate 6 (`@Version` para bloqueo optimista)
- **Migraciones:** Flyway Database Migrations (V1, V2, V3)
- **Integraciones:** MercadoPago SDK Java + Google Gemini API (WebClient) + Supabase Storage REST
- **Testing:** JUnit 5 + Mockito + AssertJ
- **CI/CD:** GitHub Actions

### Frontend
- **Framework:** React 18 + Vite 5 + TypeScript 5
- **Estilos:** Tailwind CSS + Lucide Icons
- **Gestión de Estado & HTTP:** TanStack React Query v5 + Axios (interceptores JWT)
- **Formularios & Validación:** React Hook Form + Zod
- **CI/CD:** GitHub Actions

---

## ⚙️ Instalación y Ejecución Local

### Prerrequisitos
- **Java 17 JDK** o superior
- **Node.js 18+** y **npm**
- **Maven 3.9+** (o usar `./mvnw`)
- Cuenta en **Supabase** (PostgreSQL) o PostgreSQL local

### 1. Clonar el Repositorio
```bash
git clone https://github.com/eliasdelcastillo04/momento-de-epifania-inge2.git
cd momento-de-epifania-inge2
```

### 2. Configurar Variables de Entorno
Copia las plantillas y completa tus claves:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 3. Ejecutar el Backend
```bash
cd backend
mvn clean spring-boot:run
```
*El backend iniciará en `http://localhost:8080` aplicando automáticamente las migraciones Flyway.*

### 4. Ejecutar el Frontend
```bash
cd frontend
npm install
npm run dev
```
*El frontend estará disponible en `http://localhost:5173`.*

---

## 🐳 Despliegue con Docker & Vercel

### Levantar todo el Stack con Docker Compose
```bash
docker-compose up --build
```

### Despliegue en Vercel (Frontend)
El proyecto incluye [`frontend/vercel.json`](frontend/vercel.json) configurado para enrutamiento SPA y cabeceras de seguridad. Solo importa el repositorio en tu dashboard de Vercel configurando el Root Directory en `frontend`.

---

## 🧪 Pruebas Unitarias Automatizadas

Ejecuta la suite completa de pruebas unitarias en el backend:
```bash
cd backend
mvn test
```

### Cobertura de Tests Incluida:
- ✅ **`AppointmentServiceTest`**: Reserva temporal, cálculo de seña del 50%, prevención de colisiones (`SlotUnavailableException`), cálculo dinámico de franjas y liberación automática por Scheduler.
- ✅ **`AuthServiceTest`**: Autenticación JWT, bloqueo de cuenta tras 5 intentos fallidos, generación de tokens de 15 min y reset de clave con BCrypt.
- ✅ **`PaymentServiceTest`**: Procesamiento de webhooks de MercadoPago (confirmación automática) y cobro en mostrador.
- ✅ **`MedicalRecordServiceTest`**: Creación de historia clínica 1:1, auditoría inmutable atómica JSON y evoluciones clínicas.

---

## 🔒 Seguridad, Privacidad y RBAC

- **Control de Acceso Basado en Roles (RBAC):**
  - `ADMIN`: Control total de usuarios, médicos, secretarias y catálogo de tarifas.
  - `PHYSICIAN` (Médica): Acceso exclusivo a historias clínicas, fotos médicas y auditoría legal.
  - `RECEPTIONIST` (Secretaria): Gestión de agenda, asistencia y cobros en mostrador (bloqueada de historias clínicas).
- **Control de Fuerza Bruta:** Bloqueo automático de 15 minutos al superar 5 intentos fallidos.
- **Secreto Médico:** Cumplimiento estricto con la Ley de Derechos del Paciente y Protección de Datos Personales (auditoría inmutable de cada consulta o modificación).

---

<div align="center">

Desarrollado con dedicación y excelencia para **Ingeniería del Software II**  
© 2026 Clínica Dermatológica y Estética Dra. Valeria · Todos los derechos reservados.

</div>
