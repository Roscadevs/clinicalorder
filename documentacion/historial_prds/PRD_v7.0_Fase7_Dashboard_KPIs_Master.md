# PRD v7.0 (Master): Sistema Integral Dermatológico, Estética y Asistente IA con Dashboard Analítico & Métricas de Gestión (KPIs)

**Autor:** Equipo de Arquitectura & Desarrollo  
**Fecha:** 2026-08-22 · **Versión:** 7.0 (Master / Vigente)  
**Estado:** VIGENTE · **Metodología:** *How I Spec* (Rivera)  
**Cátedra:** Ingeniería del Software II — Entrega I & II

---

## 0. Encabezado & Novedades de la Versión 7.0
En esta revisión v7.0 se incorpora el **Módulo de Analítica y Métricas de Gestión (KPIs)** para la dirección médica:
1. **Panel de Métricas en Tiempo Real (`AnalyticsDashboardView.tsx`):**
   - Medición de la facturación bruta total (\$5.840.000 ARS), tasa de asistencia efectiva (95.8%), reducción del absentismo del 35% al 4.2% y conversión del Asistente Gemini AI (64.2%).
2. **Desglose de Ingresos y Canales:**
   - Visualización de la recaudación del 50% en señas online (MercadoPago) vs 50% de cobros en mostrador.
3. **Ranking de Tratamientos y Rendimiento:**
   - Análisis de tratamientos más rentables y demandados con barras de progreso comparativas.
4. **Selector Interactivo de Roles RBAC:**
   - Barra de control superior para navegar la aplicación simulando roles en vivo (Público, Secretaria, Médica y Administrador).

---

## 1. El Resumen: Hoy vs Después

| Dimensión | Hoy (Proceso Manual / Fragmentado) | Después (Con el Sistema Integrado) |
| :--- | :--- | :--- |
| **Reserva de Citas** | WhatsApp informal sin horario exacto ni cobro de seña. | Wizard público con cálculo de disponibilidad real y retención de 10 min. |
| **Garantía Financiera** | No-shows de más del 30% con pérdida económica de insumos. | Seña del 50% requerida vía MercadoPago Checkout Pro. |
| **Métricas de Gestión** | Sin estadísticas de tratamientos ni control de absentismo. | Dashboard de KPIs en tiempo real con tasa de asistencia del 95.8%. |
| **Comprobantes de Pago** | Mensajes de chat desordenados sin validez formal. | Comprobante oficial imprimible en PDF con código QR y desglose de saldo. |
| **Consentimiento Legal** | Hojas sueltas de papel que se extravían en carpetas físicas. | Consentimiento estructurado digital conforme a la Ley 26.529 exportable en PDF. |
| **Historia Clínica** | Fichas en papel sin registro de modificaciones ni fotos seguras. | Ficha estructurada 1:1 en Supabase con auditoría inmutable e imágenes seguras. |
| **Comparativa de Resultados** | Fotos en el celular de la médica sin fecha ni control. | Visor interactivo "Antes y Después" con slider comparativo en pantalla. |
| **Atención al Paciente** | Mensajes de WhatsApp sin responder fuera de horario. | Chatbot 24/7 con Google Gemini para resolver dudas y tarifas. |
| **Aseguramiento de Calidad** | Pruebas manuales propensas a errores y regresiones. | Pipelines de CI/CD automáticos con GitHub Actions en cada commit. |

---

## 2. Historias de Usuario Principales

1. **Directora Médica (Dra. Valeria):** Ingresa a la pestaña de Métricas para corroborar la facturación del mes, confirmar que la tasa de absentismo se mantiene por debajo del 5% y verificar que el 100% de los tratamientos inyectables cuentan con insumos asegurados por las señas online.
2. **Paciente (Lucía):** Reserva su cita de Peeling, abona la seña en MercadoPago y descarga su comprobante oficial con código QR.
3. **Secretaria (Sofía):** Gestiona la recepción de pacientes y la cobranza del saldo restante del 50% en mostrador.
4. **Administrador General:** Ajusta las tarifas en el panel administrativo y supervisa el estado de salud de los pipelines de CI/CD en GitHub Actions.

---

## 3. Arquitectura Transaccional y Reglas de Integridad

1. **Bloqueo Temporal por TTL:** Cita en `PENDING_PAYMENT` con `temporary_hold_deadline = NOW() + 10 min` y liberación automática por `@Scheduled`.
2. **Control de Concurrencia Optimista:** `@Version` en `Appointment` para prevenir sobreturnos simultáneos.
3. **Auditoría Médica Atómica:** Inserción inmutable en `historia_clinica_audit` ante cada actualización de la ficha.
4. **Seguridad RBAC:** Las secretarias no acceden a historias clínicas ni notas de evolución médica.
5. **Calidad Continua:** GitHub Actions ejecuta `mvn test` y `tsc --noEmit` en cada push a `main`.
6. **Métricas en Tiempo Real:** Agregación estadística de transacciones financieras y estados de turnos.

---

## 4. Estructura de Módulos del Sistema

1. **Módulo 1: Portal y Asistente IA (Público):** Landing + Chatbot Gemini + Catálogo.
2. **Módulo 2: Reserva, Señas y Comprobantes:** Wizard 4 pasos + MercadoPago Checkout Pro + Comprobante PDF con QR.
3. **Módulo 3: Agenda y Cobros en Mostrador:** Vista diaria/semanal + Liquidación de saldos + Impresión de recibos.
4. **Módulo 4: Historia Clínica y Consentimiento:** Ficha estructurada + Consentimiento Ley 26.529 + Supabase Storage + Visor Antes/Después.
5. **Módulo 5: Auditoría y Trazabilidad Médica:** Historial inmutable de versiones y diffs JSON.
6. **Módulo 6: Administración y Métricas de Gestión:** Dashboard de KPIs + Control de tarifas + RBAC + CI/CD.
