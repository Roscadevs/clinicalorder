# PRD v3.0 (Master): Sistema Integral Dermatológico, Estética y Asistente IA

**Autor:** Equipo de Arquitectura & Desarrollo  
**Fecha:** 2026-08-22 · **Versión:** 3.0 (Master / Vigente)  
**Estado:** VIGENTE · **Metodología:** *How I Spec* (Rivera)

---

## 0. Encabezado
- **¿Qué es esto?** Especificación completa de requerimientos de software y diseño del sistema de gestión para clínica dermatológica y estética médica con asistente inteligente Google Gemini.
- **¿Por qué ahora?** Para resolver el absentismo de turnos mediante señas del 50% vía MercadoPago, digitalizar historias clínicas con auditoría inmutable en Supabase PostgreSQL, proporcionar un visor fotográfico clínico y desplegar en Vercel y contenedores en la nube.
- **Alcance Completo:**
  - Landing público con Asistente Virtual asistido por Gemini 1.5 Flash.
  - Asistente de reserva en 4 pasos con cálculo de seña y bloqueo temporal de 10 minutos.
  - Pasarela de MercadoPago Checkout Pro con webhooks idempotentes.
  - Agenda operativa con liquidación de saldos en mostrador por secretaria.
  - Ficha médica estructurada (Fototipo Fitzpatrick I-VI, patologías y alergias descompuestas).
  - Visor fotográfico médico Antes y Después con slider interactivo.
  - Línea de tiempo de auditoría médica con comparador de cambios JSON.
  - Panel de administración de catálogo y tarifas.
  - Suite de tests unitarios e infraestructura Docker/Vercel lista.

---

## 1. El Resumen: Hoy vs Después

| Dimensión | Hoy (Proceso Manual / Fragmentado) | Después (Con el Sistema Integrado) |
| :--- | :--- | :--- |
| **Reserva de Citas** | WhatsApp informal sin horario exacto ni cobro de seña. | Wizard público con cálculo de disponibilidad real y retención de 10 min. |
| **Garantía Financiera** | No-shows de más del 30% con pérdida económica de insumos. | Seña del 50% requerida vía MercadoPago Checkout Pro. |
| **Historia Clínica** | Fichas en papel sin registro de modificaciones ni fotos seguras. | Ficha estructurada 1:1 en Supabase con auditoría inmutable e imágenes seguras. |
| **Comparativa de Resultados** | Fotos en el celular de la médica sin fecha ni control. | Visor interactivo "Antes y Después" con slider comparativo en pantalla. |
| **Atención al Paciente** | Mensajes de WhatsApp sin responder fuera de horario. | Chatbot 24/7 con Google Gemini para resolver dudas y tarifas. |

---

## 2. Historias de Usuario Principales

1. **Paciente (Lucía):** Reserva un turno de Peeling Químico un domingo a la noche, asesorada por el Asistente IA, abona la seña de \$21.000 ARS en MercadoPago y recibe su comprobante por email con el turno confirmado.
2. **Secretaria (Sofía):** Recibe a Lucía en el consultorio, valida el pago previo de la seña en la agenda, le cobra los \$21.000 ARS restantes en efectivo/POS y marca la cita como finalizada.
3. **Médica (Dra. Valeria):** Accede a la historia clínica de Lucía, revisa su fototipo Fitzpatrick III y su alergia a la anestesia, sube la foto previa del rostro a Supabase Storage, anota las unidades aplicadas y guarda los cambios sabiendo que quedan auditados.

---

## 3. Arquitectura Transaccional y Reglas de Integridad

1. **Bloqueo Temporal por TTL:** El turno se crea en `PENDING_PAYMENT` con `temporary_hold_deadline = NOW() + 10 min`. Si no se abona, el `@Scheduled` lo libera automáticamente.
2. **Control de Concurrencia Optimista:** Anotación `@Version` en la entidad `Appointment` para impedir sobreturnos si dos pacientes intentan reservar la misma franja en el mismo segundo.
3. **Auditoría Médica Atómica:** Cada `UPDATE` en `historia_clinica` genera un registro inmutable en `historia_clinica_audit` dentro de la misma transacción física `@Transactional`.
4. **Seguridad RBAC:** Las secretarias no tienen acceso a los endpoints ni tablas de historias clínicas.

---

## 4. Estructura de Módulos del Sistema

1. **Módulo 1: Portal y Asistente IA (Público):** Landing + Chatbot Gemini + Catálogo.
2. **Módulo 2: Reserva y Pasarela de Pagos:** Wizard 4 pasos + MercadoPago Checkout Pro + Webhooks.
3. **Módulo 3: Agenda y Cobros en Mostrador:** Vista diaria/semanal + Liquidación de saldos + Bloqueos.
4. **Módulo 4: Historia Clínica y Fotografías Médicas:** Ficha estructurada + Visor Antes/Después + Supabase Storage.
5. **Módulo 5: Auditoría y Trazabilidad Médica:** Historial inmutable de versiones y diffs JSON.
6. **Módulo 6: Administración y Seguridad:** Autenticación JWT + Control de fuerza bruta + Reset de contraseñas + CRUD de tarifas.
7. **Módulo 7: Calidad y Despliegue:** Tests JUnit 5/Mockito + Dockerfile + Vercel + CI/CD.
