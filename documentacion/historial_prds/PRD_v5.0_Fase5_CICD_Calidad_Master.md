# PRD v5.0 (Master): Sistema Integral Dermatológico, Estética y Asistente IA con Modelado BPMN 2.0 y Pipelines CI/CD

**Autor:** Equipo de Arquitectura & Desarrollo  
**Fecha:** 2026-08-22 · **Versión:** 5.0 (Master / Vigente)  
**Estado:** VIGENTE · **Metodología:** *How I Spec* (Rivera)  
**Cátedra:** Ingeniería del Software II — Entrega I & II

---

## 0. Encabezado & Novedades de la Versión 5.0
En esta revisión v5.0 se integran los estándares de **Integración Continua (CI/CD)** y automatización de calidad:
1. **Pipelines Automatizados con GitHub Actions:**
   - `backend-ci.yml`: Compilación Java 17 Temurin, ejecución de tests JUnit 5/Mockito y empaquetado JAR en cada push/PR.
   - `frontend-ci.yml`: Verificación de tipos TypeScript (`tsc --noEmit`) y compilación de producción con Vite.
2. **Modelado Formal de Procesos de Negocio en BPMN 2.0:**
   - 5 procesos detallados (`PR-01` a `PR-05`) con pools, lanes, compuertas lógicas y tareas automatizadas.
3. **8 Casos de Uso Formales (`CU-01` a `CU-08`):**
   - Especificación completa de flujos principales, alternativos y de excepción con reglas de negocio.
4. **Matriz de Trazabilidad Integral:**
   - Vinculación de Objetivos (O1-O6), Casos de Uso, Entidades de BD y Pipelines de CI/CD.

---

## 1. El Resumen: Hoy vs Después

| Dimensión | Hoy (Proceso Manual / Fragmentado) | Después (Con el Sistema Integrado) |
| :--- | :--- | :--- |
| **Reserva de Citas** | WhatsApp informal sin horario exacto ni cobro de seña. | Wizard público con cálculo de disponibilidad real y retención de 10 min. |
| **Garantía Financiera** | No-shows de más del 30% con pérdida económica de insumos. | Seña del 50% requerida vía MercadoPago Checkout Pro. |
| **Historia Clínica** | Fichas en papel sin registro de modificaciones ni fotos seguras. | Ficha estructurada 1:1 en Supabase con auditoría inmutable e imágenes seguras. |
| **Comparativa de Resultados** | Fotos en el celular de la médica sin fecha ni control. | Visor interactivo "Antes y Después" con slider comparativo en pantalla. |
| **Atención al Paciente** | Mensajes de WhatsApp sin responder fuera de horario. | Chatbot 24/7 con Google Gemini para resolver dudas y tarifas. |
| **Aseguramiento de Calidad** | Pruebas manuales propensas a errores y regresiones. | Pipelines de CI/CD automáticos con GitHub Actions en cada commit. |

---

## 2. Historias de Usuario Principales

1. **Paciente (Lucía):** Reserva un turno de Peeling Químico un domingo a la noche, asesorada por el Asistente IA, abona la seña de \$21.000 ARS en MercadoPago y recibe su comprobante por email con el turno confirmado.
2. **Secretaria (Sofía):** Recibe a Lucía en el consultorio, valida el pago previo de la seña en la agenda, le cobra los \$21.000 ARS restantes en efectivo/POS y marca la cita como finalizada.
3. **Médica (Dra. Valeria):** Accede a la historia clínica de Lucía, revisa su fototipo Fitzpatrick III y su alergia a la anestesia, sube la foto previa del rostro a Supabase Storage, anota las unidades aplicadas y guarda los cambios sabiendo que quedan auditados.
4. **Administrador General:** Ingresa al panel de administración para actualizar las tarifas del catálogo oficial y supervisa el estado de salud de los pipelines de integración continua.

---

## 3. Arquitectura Transaccional y Reglas de Integridad

1. **Bloqueo Temporal por TTL:** El turno se crea en `PENDING_PAYMENT` con `temporary_hold_deadline = NOW() + 10 min`. Si no se abona, el `@Scheduled` lo libera automáticamente.
2. **Control de Concurrencia Optimista:** Anotación `@Version` en la entidad `Appointment` para impedir sobreturnos si dos pacientes intentan reservar la misma franja en el mismo segundo.
3. **Auditoría Médica Atómica:** Cada `UPDATE` en `historia_clinica` genera un registro inmutable en `historia_clinica_audit` dentro de la misma transacción física `@Transactional`.
4. **Seguridad RBAC:** Las secretarias no tienen acceso a los endpoints ni tablas de historias clínicas.
5. **Calidad Continua:** Ningún código se fusiona a `main` sin pasar el 100% de los tests unitarios y la validación estricta de tipos en GitHub Actions.

---

## 4. Estructura de Módulos del Sistema

1. **Módulo 1: Portal y Asistente IA (Público):** Landing + Chatbot Gemini + Catálogo.
2. **Módulo 2: Reserva y Pasarela de Pagos:** Wizard 4 pasos + MercadoPago Checkout Pro + Webhooks.
3. **Módulo 3: Agenda y Cobros en Mostrador:** Vista diaria/semanal + Liquidación de saldos + Bloqueos.
4. **Módulo 4: Historia Clínica y Fotografías Médicas:** Ficha estructurada + Visor Antes/Después + Supabase Storage.
5. **Módulo 5: Auditoría y Trazabilidad Médica:** Historial inmutable de versiones y diffs JSON.
6. **Módulo 6: Administración y Seguridad:** Autenticación JWT + Control de fuerza bruta + Reset de contraseñas + CRUD de tarifas.
7. **Módulo 7: Calidad, CI/CD y Despliegue:** GitHub Actions Workflows + Tests JUnit 5/Mockito + Dockerfile + Vercel.
