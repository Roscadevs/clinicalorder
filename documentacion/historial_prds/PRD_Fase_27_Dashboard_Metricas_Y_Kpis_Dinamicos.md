# PRD Fase 27: Dashboard de Métricas y KPIs Dinámicos de Gestión Clínica y Financiera

**Proyecto:** Sistema Integral de Gestión Dermatológica, Estética y Asistente Virtual con IA  
**Cátedra:** Ingeniería del Software II — Entrega I & II / Trabajo Práctico Especial (TPE)  
**Fecha:** 2026-10-13 · **Versión:** 27.0 (Propuesto)  
**Autor:** Equipo de Arquitectura, Producto & Analítica  
**Estado:** PROPUESTO · **Metodología:** *How I Spec* (Rivera)  
**Módulos de Impacto:** `AnalyticsController`, `AnalyticsService`, `AnalyticsDashboardView.tsx`, `api.ts`

---

## 1. Encabezado y Resumen (Hoy vs. Después)

| Dimensión | Hoy (Estado Actual) | Después (Con Fase 27 Implementada) |
| :--- | :--- | :--- |
| **Origen de Datos del Dashboard** | Datos fijos/mockeados hardcodeados en el componente React (`AnalyticsDashboardView.tsx`). | Datos dinámicos calculados en tiempo real por el backend a partir de la base de datos PostgreSQL/Supabase. |
| **API Backend de Analítica** | Inexistente. No hay controlador ni servicio en Spring Boot para consultas agregadas. | Nuevo endpoint seguro `GET /api/v1/analytics/kpis` con RBAC restringido a perfiles `DOCTORA` y `ADMIN`. |
| **Cálculo de Facturación y Señas** | Cifra estática de \$5.840.000 ARS fija sin reflejar la actividad transaccional real. | Agregación dinámica de pagos aprobados (`PaymentTransaction`), desglosados en señas online (MercadoPago) y saldos en mostrador. |
| **Tasa de Asistencia y Absentismo** | Porcentaje estático (95.8%) sin correlación con los estados reales de las citas. | Cálculo automático de asistencia sobre el total de turnos (`ATTENDED` / `COMPLETED` vs. `NO_SHOW` / `CANCELED`). |
| **Ranking de Tratamientos** | Lista estática fija en el cliente. | Ranking dinámico ordenado por volumen de turnos y facturación por servicio (`DermatologicService`). |
| **Experiencia de Usuario (UX)** | Vista sin estados de carga ni manejo de fallos o modo sin conexión. | Integración con TanStack Query, soporte para estados de carga (*skeletons*), manejo de errores y fallback transparente. |

---

## 2. La Historia (Antes vs. Después, sin tecnicismos)

### Antes:
La Dra. Valeria Gómez y su equipo de administración acceden a la pestaña "Métricas" en la aplicación web, pero siempre observan los mismos números de facturación, turnos y absentismo correspondientes a un prototipo estático diseñado para la fase inicial. Si una paciente abona una seña por MercadoPago o se cobra un saldo en recepción, los números del panel no se enteran ni cambian. La dirección no dispone de visibilidad genuina sobre los tratamientos más requeridos ni sobre la recaudación diaria real sin recurrir a consultas manuales externas.

### Después:
Al ingresar a la pestaña "Métricas", el panel consulta de forma transparente y segura al servidor de la clínica. En una fracción de segundo, la pantalla cobra vida mostrando los totales recaudados en el período actual, cuántos turnos se atendieron, cuántos pacientes faltaron sin aviso y cuánto dinero ingresó por la pasarela de pagos virtual versus el efectivo en recepción. Los tratamientos con más demanda se ordenan de mayor a menor con base en las citas confirmadas reales. La dirección médica cuenta con un centro de control veraz, confiable e intuitivo para la toma de decisiones clínicas y financieras.

---

## 3. Objetivos y No-Objetivos

### Objetivos:
1. **Endpoint REST Agregado:** Proveer `GET /api/v1/analytics/kpis` en Spring Boot, asegurado con autorización RBAC (roles `DOCTORA` y `ADMIN`).
2. **Servicio de Analítica Transaccional:** Implementar `AnalyticsService` con transacciones de solo lectura (`@Transactional(readOnly = true)`) para evitar contención o bloqueos en la agenda médica.
3. **Métricas Financieras Reales:**
   - Facturación bruta total basada en transacciones con estado `APPROVED`.
   - Desglose entre señas online (`DEPOSIT` / canal `MERCADOPAGO`) y saldos presenciales (`BALANCE` / canal `CASH` o mostrador).
4. **Métricas Operativas Reales:**
   - Tasa de asistencia porcentual ($\frac{\text{Atendidos + Completados}}{\text{Total de Citas Concluidas}} \times 100$).
   - Conteo de turnos gestionados en el período.
5. **Ranking de Tratamientos:**
   - Top de tratamientos más demandados, agrupados por servicio dermatológico, con volumen de citas y recaudación acumulada.
6. **Frontend Resiliente y Reactivo:**
   - Adaptar `AnalyticsDashboardView.tsx` para consumir el endpoint mediante TanStack Query / `api.ts`.
   - Implementar estados visuales de carga, indicadores de error y modo offline/fallback si la base de datos carece de registros históricos.
7. **Respeto a los Estándares del Proyecto:**
   - Cumplir RFC 7807 en respuestas de error.
   - Preservar inmutabilidad de tablas de auditoría y evitar cualquier impacto en `@Version`.

### No-Objetivos:
1. **Modificación de Historias Clínicas:** Esta fase no toca ni altera notas clínicas ni registros médicos de pacientes.
2. **Tablas o Migraciones Destructivas:** No se modificarán estructuras existentes de base de datos; la analítica consulta mediante proyecciones y agregaciones sobre las tablas ya existentes (`cita`, `transaccion_pago`, `servicio_dermatologico`).
3. **Exportación Masiva a Formatos BI Externos:** No se construirá un pipeline ETL hacia herramientas externas (PowerBI, Tableau) en esta iteración.
4. **Exposición de Datos Sensibles (PII):** Los datos devueltos por el endpoint son agregados numéricos consolidados y no revelan datos personales identificables de pacientes.

---

## 4. Cómo funciona hoy vs. después

### Flujo Hoy:
1. El usuario navega a `/app/analytics`.
2. El componente `AnalyticsDashboardView.tsx` se renderiza inmediatamente utilizando un conjunto de constantes estáticas escritas directamente en el código de React.
3. No se produce ninguna petición de red (`fetch` / `axios`) al backend.

### Flujo Después:
1. El usuario navega a `/app/analytics` con sesión activa como Médica o Administrador.
2. `AnalyticsDashboardView.tsx` dispara una consulta asíncrona mediante TanStack Query llamando a `analyticsApi.getKpis()`.
3. Mientras se obtienen los datos, la interfaz despliega indicadores de carga sutiles en las tarjetas de KPIs.
4. El backend en Spring Boot intercepta la petición, verifica los privilegios del usuario (RBAC) y delega a `AnalyticsService`.
5. `AnalyticsService` ejecuta consultas de agregación optimizadas sobre los repositorios de citas y transacciones en modo de solo lectura.
6. El backend construye el DTO consolidado `AnalyticsKpiResponseDTO` y lo retorna con código HTTP 200.
7. El componente frontend renderiza las tarjetas de KPIs, los gráficos de canales de recaudación y las barras comparativas de tratamientos con datos calculados en vivo.
8. Si el backend experimenta un retraso temporal o error, se muestra un mensaje informativo amigable con opción de reintentar sin romper la aplicación.

---

## 5. Los Datos (Triggers, candados lógicos, concurrencia)

### Fuentes de Datos:
* **`cita` (`Appointment`):** Estados de cita (`CONFIRMED`, `ATTENDED`, `COMPLETED`, `CANCELED`, `NO_SHOW`), fechas de inicio/fin y servicio asociado.
* **`transaccion_pago` (`PaymentTransaction`):** Importe (`amount`), concepto (`DEPOSIT`, `BALANCE`), tipo de canal (`MERCADOPAGO`, `CASH`, `BANK_TRANSFER`) y estado (`APPROVED`).
* **`servicio_dermatologico` (`DermatologicService`):** Nombre comercial y categoría para el ranking de tratamientos.

### Reglas de Negocio y Candados Lógicos:
1. **Filtro de Estado de Pagos:** Solo las transacciones con estado `APPROVED` computan para la facturación. Transacciones en estado `PENDING`, `REJECTED` o `REFUNDED` quedan excluidas del cómputo de ingresos.
2. **Fórmula de Tasa de Asistencia:**
   $$\text{Tasa de Asistencia} = \frac{\text{Citas Atendidas (`ATTENDED`) + Completadas (`COMPLETED`)}}{\text{Citas Atendidas + Completadas + Inasistencias (`NO_SHOW`)}} \times 100$$
   *(Si no hay citas concluidas en el período, la tasa se reporta como 100.0% para evitar divisiones por cero).*
3. **Concurrencia y Aislamiento:** Todas las operaciones de analítica se ejecutan bajo `@Transactional(readOnly = true)`. De este modo:
   - No se adquieren candados exclusivos de fila ni de tabla.
   - No interfiere con las transacciones de reserva de turnos ni con el control de concurrencia optimista (`@Version`).
4. **Blindaje de Auditoría Clínica:** La lectura de métricas no invoca ningún método de `MedicalRecordService` ni genera eventos en `historia_clinica_audit` ni `entrada_hc_audit`, garantizando la pureza inmutable de los expedientes de salud.

---

## 6. Pseudo-código (El acuerdo en lenguaje natural)

### Lógica del Backend (`AnalyticsService`):
```text
AL RECIBIR solicitud de KPIs de gestión:
    VERIFICAR que el usuario autenticado posea rol DOCTORA o ADMIN.
    
    OBTENER todas las transacciones de pago con estado APROBADO en el sistema.
    CALCULAR facturación total = suma de montos de transacciones aprobadas.
    CALCULAR recaudación de señas online = suma de montos donde canal sea MERCADOPAGO y concepto sea SEÑA.
    CALCULAR recaudación de saldos mostrador = suma de montos donde canal sea EFECTIVO o TRANSFERENCIA o concepto sea SALDO.
    
    OBTENER citas registradas en el sistema.
    CONTAR total de citas gestionadas.
    CONTAR citas asistidas (estado ATENDIDA o COMPLETADA).
    CONTAR citas con inasistencia (estado NO_SHOW).
    
    CALCULAR tasa de asistencia porcentual:
        SI (citas asistidas + citas no_show) > 0:
            tasa = (citas asistidas / (citas asistidas + citas no_show)) * 100
        SINO:
            tasa = 100.0
            
    AGRUPAR citas por tratamiento estético:
        PARA CADA tratamiento:
            CONTAR cantidad de citas confirmadas o completadas.
            SUMAR facturación imputada.
        ORDENAR tratamientos descendentemente por cantidad de citas.
        TOMAR los primeros 5 tratamientos para el ranking.
        
    RETORNAR DTO con facturación, porcentajes de canales, tasa de asistencia, totales y lista del ranking.
```

### Lógica del Frontend (`AnalyticsDashboardView`):
```text
AL MONTAR el componente de analítica:
    DISPARAR useQuery consultando el servicio de analítica.
    
    SI la consulta está cargando:
        MOSTRAR esqueletos de carga visuales en las tarjetas de KPIs y gráficos.
        
    SI la consulta finaliza con éxito:
        ACTUALIZAR tarjetas con:
            - Facturación formateada en moneda nacional (ARS).
            - Tasa de asistencia con porcentaje real.
            - Total de citas gestionadas.
            - Métricas del asistente virtual.
        ACTUALIZAR barras de progreso del ranking con las proporciones y recaudaciones devueltas.
        ACTUALIZAR desglose de canales (Señas online vs. Mostrador).
        
    SI la consulta falla:
        MOSTRAR mensaje de aviso accesible sin bloquear la navegación.
        PERMITIR reintentar la carga con un botón de acción.
```
