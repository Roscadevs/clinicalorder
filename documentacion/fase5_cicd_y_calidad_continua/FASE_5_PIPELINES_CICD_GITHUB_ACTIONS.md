# Documento de Integración Continua y Calidad Automatizada (Fase 5)

**Proyecto:** Sistema Integral de Gestión Dermatológica, Estética y Asistente Virtual con IA  
**Cátedra:** Ingeniería del Software II — Entrega I & II / Trabajo Práctico Especial (TPE)  
**Fecha:** 2026-08-22 · **Versión:** 5.0.0  
**Herramienta:** GitHub Actions CI/CD Workflows

---

## 📑 1. Propósito y Estrategia de CI/CD

El objetivo de la **Fase 5** es blindar la calidad del software en cada iteración del desarrollo mediante la ejecución automática de pipelines de **Integración Continua (CI)** en GitHub.

### 🛡️ Beneficios de la Automatización:
1. **Detección Temprana de Regresiones:** Cada `git push` o `pull request` hacia la rama `main` dispara automáticamente la suite de pruebas unitarias en JUnit 5 y Mockito.
2. **Validación Estricta de Tipado:** Comprobación estática de contratos TypeScript en el Frontend antes de cualquier despliegue.
3. **Optimización de Tiempos de Build:** Estrategia de caché persistente para dependencias de Maven (`~/.m2`) y Node.js (`npm cache`).
4. **Artefactos Verificables:** Almacenamiento de reportes de pruebas JUnit (`surefire-reports`) y paquetes de distribución en producción.

---

## ⚙️ 2. Arquitectura de los Workflows de GitHub Actions

```
                                  GIT PUSH / PULL REQUEST
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       │                                           │
          [Rutas: backend/**]                         [Rutas: frontend/**]
                       ▼                                           ▼
         ┌───────────────────────────┐               ┌───────────────────────────┐
         │     backend-ci.yml        │               │     frontend-ci.yml       │
         │ ───────────────────────── │               │ ───────────────────────── │
         │ 1. Checkout del código    │               │ 1. Checkout del código    │
         │ 2. Setup JDK 17 (Temurin) │               │ 2. Setup Node.js 20       │
         │ 3. Restaurar caché Maven  │               │ 3. Restaurar caché npm    │
         │ 4. mvn test (JUnit 5)     │               │ 4. npm install            │
         │ 5. mvn package (JAR)      │               │ 5. tsc --noEmit (Types)   │
         │ 6. Subir reporte Surefire │               │ 6. vite build (Dist)      │
         └─────────────┬─────────────┘               └─────────────┬─────────────┘
                       │                                           │
                       ▼                                           ▼
             ✅ Backend Validado                         ✅ Frontend Validado
```

---

## 🛠️ 3. Detalle de los Pipelines

### 3.1. Pipeline de Backend (`.github/workflows/backend-ci.yml`)
- **Disparador:** Modificaciones en `backend/**` o en la configuración del workflow en rama `main`.
- **Entorno de Ejecución:** `ubuntu-latest`.
- **Pasos Críticos:**
  - **Setup JDK 17:** Distribución Eclipse Temurin LTS.
  - **Ejecución de Pruebas:** `mvn clean test -B` ejecuta los tests de:
    - `AppointmentServiceTest` (bloqueo de 10 min, cálculo del 50% de seña y concurrencia optimista).
    - `AuthServiceTest` (autenticación JWT, bloqueo por 5 intentos fallidos y reset de clave).
    - `PaymentServiceTest` (webhook de MercadoPago y cobro en mostrador).
    - `MedicalRecordServiceTest` (auditoría médica inmutable en PostgreSQL).
  - **Compilación del JAR:** `mvn package -DskipTests -B` para asegurar que no existan errores de empaquetado.

### 3.2. Pipeline de Frontend (`.github/workflows/frontend-ci.yml`)
- **Disparador:** Modificaciones en `frontend/**` o en la configuración del workflow en rama `main`.
- **Entorno de Ejecución:** `ubuntu-latest`.
- **Pasos Críticos:**
  - **Setup Node.js 20 LTS.**
  - **Instalación de Dependencias:** `npm install`.
  - **Chequeo de Tipos Estáticos:** `npx tsc --noEmit` valida la concordancia con las interfaces TypeScript.
  - **Compilación de Producción:** `npm run build` genera los archivos estáticos en `dist/` listos para Edge CDN en Vercel.

---

## 📊 4. Matriz de Control de Calidad en el Repositorio

| Capa | Herramienta | Verificación Automatizada | Criterio de Éxito |
| :--- | :--- | :--- | :--- |
| **Backend** | Maven + JUnit 5 + Mockito | `mvn test` | 100% de tests unitarios aprobados sin fallos. |
| **Backend** | Spring Boot Packaging | `mvn package` | Generación exitosa del `.jar` ejecutable. |
| **Frontend** | TypeScript Compiler (`tsc`) | `tsc --noEmit` | Cero errores de tipado o discrepancias con DTOs. |
| **Frontend** | Vite Build Engine | `vite build` | Bundle minificado y empaquetado sin advertencias. |
| **Seguridad** | Flyway Migrations | `V1`, `V2`, `V3` | Esquema DDL y DML reproducible en PostgreSQL. |
