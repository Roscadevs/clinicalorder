# PRD v9.0 (Master Final): Sistema Integral Dermatológico, Estética y Asistente IA — Especificación Maestra Completa & Guía de Defensa

**Autor:** Equipo de Arquitectura & Desarrollo  
**Fecha:** 2026-08-22 · **Versión:** 9.0 (Master Final / Vigente)  
**Estado:** VIGENTE & CONSOLIDADO · **Metodología:** *How I Spec* (Rivera)  
**Cátedra:** Ingeniería del Software II — Entrega I & II / Trabajo Práctico Especial (TPE)

---

## 0. Encabezado & Novedades de la Versión 9.0 (Master Final)
Esta versión consolida el ciclo de vida completo de ingeniería de software del sistema:
1. **Guía Estratégica de Defensa Oral & Pitch:**
   - Guión de demostración en vivo cronometrado (7 min) cubriendo los roles de Paciente, Secretaria, Médica y Administrador con el Simulador de Roles RBAC en vivo.
2. **Banco de Respuestas Técnicas:**
   - Justificación de decisiones arquitectónicas clave: Concurrencia optimista (`@Version`), transacciones ACID, 3FN / BCNF, Secreto Médico (Ley 26.529), Idempotencia de Webhooks y Monolito Modular vs Microservicios.
3. **Módulos Clínicos, Financieros y Operacionales Integrados:**
   - Wizard de turnos con retención de 10 min por TTL y 50% de seña en MercadoPago.
   - Sincronización en 1 clic con Google Calendar y estándar iCalendar (.ics RFC 5545).
   - Comprobantes oficiales con código QR y Consentimiento Informado legal.
   - Historia clínica 1:1 con fototipo Fitzpatrick, visor Antes/Después y auditoría inmutable atómica.
   - Dashboard de KPIs en tiempo real (reducción de absentismo del 35% al 4.2%).
   - Asistente virtual 24/7 asistido por Google Gemini 1.5 Flash.
   - Pipelines de CI/CD automáticos con GitHub Actions.

---

## 1. El Resumen: Hoy vs Después

| Dimensión | Hoy (Proceso Manual / Fragmentado) | Después (Con el Sistema Integrado) |
| :--- | :--- | :--- |
| **Reserva de Citas** | WhatsApp informal sin horario exacto ni cobro de seña. | Wizard público con cálculo de disponibilidad real y retención de 10 min. |
| **Garantía Financiera** | No-shows de más del 30% con pérdida económica de insumos. | Seña del 50% requerida vía MercadoPago Checkout Pro. |
| **Calendario del Paciente** | El paciente debe anotar la fecha manualmente arriesgando olvidos. | Agendado en 1 clic en Google Calendar o Apple Calendar con alarmas -24h y -2h. |
| **Recordatorios** | La secretaria debe enviar mensajes uno por uno manualmente. | Simulador y generador automático de avisos WhatsApp / Push con confirmación. |
| **Métricas de Gestión** | Sin estadísticas de tratamientos ni control de absentismo. | Dashboard de KPIs en tiempo real con tasa de asistencia del 95.8%. |
| **Comprobantes de Pago** | Mensajes de chat desordenados sin validez formal. | Comprobante oficial imprimible en PDF con código QR y desglose de saldo. |
| **Consentimiento Legal** | Hojas sueltas de papel que se extravían en carpetas físicas. | Consentimiento estructurado digital conforme a la Ley 26.529 exportable en PDF. |
| **Historia Clínica** | Fichas en papel sin registro de modificaciones ni fotos seguras. | Ficha estructurada 1:1 en Supabase con auditoría inmutable e imágenes seguras. |
| **Comparativa de Resultados** | Fotos en el celular de la médica sin fecha ni control. | Visor interactivo "Antes y Después" con slider comparativo en pantalla. |
| **Atención al Paciente** | Mensajes de WhatsApp sin responder fuera de horario. | Chatbot 24/7 con Google Gemini para resolver dudas y tarifas. |
| **Aseguramiento de Calidad** | Pruebas manuales propensas a errores y regresiones. | Pipelines de CI/CD automáticos con GitHub Actions en cada commit. |

---

## 2. Historias de Usuario Principales

1. **Paciente (Lucía):** Consulta dudas con el Chatbot Gemini, reserva su turno de Peeling, paga la seña del 50% en MercadoPago, agenda en Google Calendar y descarga su comprobante con QR.
2. **Secretaria (Sofía):** Gestiona la recepción de pacientes, envía el recordatorio por WhatsApp con 1 clic, valida la seña y liquida el saldo en mostrador.
3. **Médica (Dra. Valeria):** Revisa la historia clínica 1:1, fototipo Fitzpatrick, antecedentes y alergias, emite el Consentimiento Informado, compara fotografías en el visor Antes/Después y guarda evoluciones auditadas.
4. **Administrador General:** Evalúa la facturación mensual y KPIs en el Dashboard y mantiene los pipelines de CI/CD en GitHub.

---

## 3. Arquitectura Transaccional y Reglas de Integridad

1. **Bloqueo Temporal por TTL:** Cita en `PENDING_PAYMENT` con `temporary_hold_deadline = NOW() + 10 min` y liberación automática por `@Scheduled`.
2. **Control de Concurrencia Optimista:** `@Version` en `Appointment` para prevenir sobreturnos simultáneos.
3. **Auditoría Médica Atómica:** Inserción inmutable en `historia_clinica_audit` ante cada actualización de la ficha.
4. **Estándar iCalendar (RFC 5545):** Compatibilidad multiplataforma con Google, Apple, Android y Windows Outlook.
5. **Seguridad RBAC:** Las secretarias no acceden a historias clínicas ni notas de evolución médica.
6. **Calidad Continua:** GitHub Actions ejecuta `mvn test` y `tsc --noEmit` en cada push a `main`.

---

## 4. Estructura de Módulos del Sistema

1. **Módulo 1: Portal y Asistente IA (Público):** Landing + Chatbot Gemini + Catálogo.
2. **Módulo 2: Reserva, Señas y Comprobantes:** Wizard 4 pasos + MercadoPago Checkout Pro + Comprobante PDF con QR.
3. **Módulo 3: Sincronización de Calendarios & Recordatorios:** Google Calendar URL + Archivo .ics (RFC 5545) + WhatsApp/Push.
4. **Módulo 4: Agenda y Cobros en Mostrador:** Vista diaria/semanal + Liquidación de saldos + Envío de avisos.
5. **Módulo 5: Historia Clínica y Consentimiento:** Ficha estructurada + Consentimiento Ley 26.529 + Supabase Storage + Visor Antes/Después.
6. **Módulo 6: Auditoría y Trazabilidad Médica:** Historial inmutable de versiones y diffs JSON.
7. **Módulo 7: Administración y Métricas de Gestión:** Dashboard de KPIs + Control de tarifas + RBAC + CI/CD.
8. **Módulo 8: Estrategia de Defensa Académica:** Pitch, guión cronometrado y respuestas técnicas fundamentadas.
