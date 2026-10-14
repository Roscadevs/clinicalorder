# Documento de Implementación y DevOps — Fase 3 (Frontend UI/UX y Despliegue)

**Proyecto:** Sistema Integral de Gestión Dermatológica y Estética con Inteligencia Artificial  
**Fase:** Fase 3 · **Fecha:** 2026-08-22  
**Objetivo:** Desarrollar las vistas avanzadas de experiencia de usuario (UI/UX) para la médica y el administrador, e implementar la infraestructura de contenedorización Docker y despliegue en Vercel.

---

## 1. Módulos de Frontend UI/UX Implementados

### 1.1. Visor Comparativo "Antes y Después" (`BeforeAfterSlider.tsx`)
- **Ubicación:** `frontend/src/features/clinical/BeforeAfterSlider.tsx`
- **Funcionalidad:**
  - Deslizador interactivo horizontal con control `input[type=range]` y superposición mediante capas con `clip-path` y `position: absolute`.
  - Permite a la médica contrastar el estado basal de la piel del paciente con el resultado clínico obtenido semanas posteriores.
  - Etiquetas flotantes con estética médica sobria para la sesión inicial y la sesión de seguimiento.

### 1.2. Línea de Tiempo de Auditoría Médico-Legal (`AuditTimelineView.tsx`)
- **Ubicación:** `frontend/src/features/clinical/AuditTimelineView.tsx`
- **Funcionalidad:**
  - Renderizado cronológico vertical con nodos visuales para cada cambio registrado en la base de datos PostgreSQL.
  - Resaltado de diferencias (*diffs*): fondo rojo para valores anteriores y fondo verde para valores actualizados.
  - Identificación del autor de la modificación (`authorFullName`), fecha/hora exacta y tipo de acción (`CREATION`, `UPDATE`).

### 1.3. Panel de Administración de Catálogo & Tarifas (`AdminServicesView.tsx`)
- **Ubicación:** `frontend/src/features/admin/AdminServicesView.tsx`
- **Funcionalidad:**
  - Tabla interactiva para modificar precios base y porcentajes de seña en tiempo real.
  - Modal para dar de alta nuevos tratamientos con nombre, descripción clínica, duración médica estimada y % de seña.

---

## 2. Infraestructura DevOps y Despliegue en la Nube

### 2.1. Backend Dockerfile Multi-Stage (`backend/Dockerfile`)
- **Stage 1 (Builder):** `maven:3.9.6-eclipse-temurin-17-alpine`
  - Descarga dependencias aprovechando la capa de caché de Docker (`mvn dependency:go-offline`).
  - Compila el paquete `.jar` optimizado.
- **Stage 2 (Runtime):** `eclipse-temurin:17-jre-alpine`
  - Imagen final ligera (< 150 MB).
  - Usuario de sistema no-root (`appuser`) para mitigar vulnerabilidades de seguridad.
  - Opciones de memoria JVM automáticas para contenedores (`-XX:MaxRAMPercentage=75.0`).

### 2.2. Configuración de Vercel para Frontend (`frontend/vercel.json`)
- Reglas de reescritura (*rewrites*) para garantizar que cualquier subruta de la SPA sea atendida por `index.html`.
- Cabeceras de seguridad estrictas: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`.

### 2.3. Orquestación Local con Docker Compose (`docker-compose.yml`)
- Levanta el Backend y el Frontend sincronizados con variables de entorno parametrizadas.
- Comando de ejecución en desarrollo:
  ```bash
  docker-compose up --build
  ```
