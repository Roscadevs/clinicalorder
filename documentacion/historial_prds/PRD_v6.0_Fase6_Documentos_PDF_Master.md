# PRD v6.0 (Master): Sistema Integral Dermatológico, Estética y Asistente IA con Comprobantes Imprimibles & Consentimiento Médico-Legal

**Autor:** Equipo de Arquitectura & Desarrollo  
**Fecha:** 2026-08-22 · **Versión:** 6.0 (Master / Vigente)  
**Estado:** VIGENTE · **Metodología:** *How I Spec* (Rivera)  
**Cátedra:** Ingeniería del Software II — Entrega I & II

---

## 0. Encabezado & Novedades de la Versión 6.0
En esta revisión v6.0 se integran los requerimientos médico-legales y documentales de exportación en PDF:
1. **Generador de Comprobantes Oficiales de Turno e Impresión PDF (`AppointmentReceiptModal.tsx`):**
   - Membrete oficial de la clínica, datos completos del paciente, fecha/hora, código QR de verificación, desglose del 50% de seña acreditada online y saldo restante en mostrador, e indicaciones médicas pre-turno.
2. **Consentimiento Informado Médico-Legal (`InformedConsentModal.tsx`):**
   - Marco regulatorio bajo la Ley Nacional N° 26.529, declaración jurada de antecedentes médicos y alergias, riesgos informados, compromiso de fotoprotección y campos de firma para paciente y médica.
3. **Integración con Workflows de CI/CD:**
   - Verificación continua en GitHub Actions con 100% de tests unitarios aprobados y compilación de producción.

---

## 1. El Resumen: Hoy vs Después

| Dimensión | Hoy (Proceso Manual / Fragmentado) | Después (Con el Sistema Integrado) |
| :--- | :--- | :--- |
| **Reserva de Citas** | WhatsApp informal sin horario exacto ni cobro de seña. | Wizard público con cálculo de disponibilidad real y retención de 10 min. |
| **Garantía Financiera** | No-shows de más del 30% con pérdida económica de insumos. | Seña del 50% requerida vía MercadoPago Checkout Pro. |
| **Comprobantes de Pago** | Mensajes de chat desordenados sin validez formal. | Comprobante oficial imprimible en PDF con código QR y desglose de saldo. |
| **Consentimiento Legal** | Hojas sueltas de papel que se extravían en carpetas físicas. | Consentimiento estructurado digital conforme a la Ley 26.529 exportable en PDF. |
| **Historia Clínica** | Fichas en papel sin registro de modificaciones ni fotos seguras. | Ficha estructurada 1:1 en Supabase con auditoría inmutable e imágenes seguras. |
| **Comparativa de Resultados** | Fotos en el celular de la médica sin fecha ni control. | Visor interactivo "Antes y Después" con slider comparativo en pantalla. |
| **Atención al Paciente** | Mensajes de WhatsApp sin responder fuera de horario. | Chatbot 24/7 con Google Gemini para resolver dudas y tarifas. |
| **Aseguramiento de Calidad** | Pruebas manuales propensas a errores y regresiones. | Pipelines de CI/CD automáticos con GitHub Actions en cada commit. |

---

## 2. Historias de Usuario Principales

1. **Paciente (Lucía):** Reserva su turno de Peeling, paga la seña en MercadoPago, descarga su comprobante oficial en PDF con las indicaciones previas al turno y presenta su código QR en recepción el día de la cita.
2. **Secretaria (Sofía):** Escanea el comprobante de Lucía, valida la acreditación previa del 50% de la seña, le cobra el saldo restante en mostrador y emite el recibo final de cancelación.
3. **Médica (Dra. Valeria):** Abre la historia clínica de Lucía, genera el documento de Consentimiento Informado personalizado con su fototipo Fitzpatrick III, registra la aceptación y procede con el tratamiento.
4. **Administrador General:** Supervisa el catálogo oficial, las tarifas y la salud de los pipelines de integración continua en GitHub.

---

## 3. Arquitectura Transaccional y Reglas de Integridad

1. **Bloqueo Temporal por TTL:** Cita en `PENDING_PAYMENT` con `temporary_hold_deadline = NOW() + 10 min` y liberación automática por `@Scheduled`.
2. **Control de Concurrencia Optimista:** `@Version` en `Appointment` para prevenir sobreturnos simultáneos.
3. **Auditoría Médica Atómica:** Inserción inmutable en `historia_clinica_audit` ante cada actualización de la ficha.
4. **Seguridad RBAC:** Las secretarias no acceden a historias clínicas ni notas de evolución médica.
5. **Calidad Continua:** GitHub Actions ejecuta `mvn test` y `tsc --noEmit` en cada push a `main`.
6. **Validez Legal:** Comprobantes y consentimientos diseñados con tipografía médica sobria y soporte `@media print` para exportación fiel a PDF.

---

## 4. Estructura de Módulos del Sistema

1. **Módulo 1: Portal y Asistente IA (Público):** Landing + Chatbot Gemini + Catálogo.
2. **Módulo 2: Reserva, Señas y Comprobantes:** Wizard 4 pasos + MercadoPago Checkout Pro + Comprobante PDF con QR.
3. **Módulo 3: Agenda y Cobros en Mostrador:** Vista diaria/semanal + Liquidación de saldos + Impresión de recibos.
4. **Módulo 4: Historia Clínica y Consentimiento:** Ficha estructurada + Consentimiento Ley 26.529 + Supabase Storage + Visor Antes/Después.
5. **Módulo 5: Auditoría y Trazabilidad Médica:** Historial inmutable de versiones y diffs JSON.
6. **Módulo 6: Administración y Seguridad:** Autenticación JWT + Control de fuerza bruta + Reset de contraseñas + CRUD de tarifas.
7. **Módulo 7: Calidad, CI/CD y Despliegue:** GitHub Actions Workflows + Tests JUnit 5/Mockito + Dockerfile + Vercel.
