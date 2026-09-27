# Inventario de Contenido y Funcionalidad — Clínica Dra. Valeria Gómez

> **Arquitectura de la Información · Etapa 1 — Descubrimiento**
> Objetivo de esta etapa: descubrir *qué información y qué funcionalidad existen realmente* en la interfaz hoy.
> Todavía **no** se organiza en páginas. Basado en los componentes reales del frontend y en las **entidades y atributos del Modelo Entidad-Relación (MER)** y el esquema de base de datos (`V4__schema_redesign.sql` + `V6__spec_alignment.sql`).

> **Nota sobre nomenclatura:** las entidades y sus atributos usan los nombres en español del MER / diccionario de datos. Cuando la interfaz actual muestra una versión distinta a la del modelo (por ejemplo roles `PHYSICIAN`/`RECEPTIONIST` en el front vs. `DOCTORA`/`SECRETARIA` en el MER, o alergias/antecedentes/hábitos como *booleans* en el front vs. entidades débiles en el MER), se indica entre paréntesis.

---

## 1. Entidades y sus atributos (contenido)

| Elemento (entidad · atributo) | Tipo | Descripción | Usuario | Acción posible | Ubicación actual |
|---|---|---|---|---|---|
| **usuario** | entidad | Persona del staff con acceso al sistema (supertipo; ISA total y disjunto: DOCTORA, SECRETARIA, ADMIN) | ADMIN, DOCTORA, SECRETARIA | iniciar sesión, cerrar sesión, recuperar contraseña | Login, DashboardLayout |
| usuario · username | atributo | Nombre de usuario único | usuario | ingresar, ver | Login |
| usuario · email | atributo | Correo único | usuario | ingresar, ver | Login |
| usuario · full_name | atributo | Nombre completo | usuario | ver | DashboardLayout |
| usuario · role | atributo | Rol RBAC: `ADMIN` / `DOCTORA` / `SECRETARIA` (el front los expone como ADMIN / PHYSICIAN / RECEPTIONIST) | Sistema | ver, simular (barra demo) | Login, DashboardLayout (selector demo) |
| usuario · active | atributo | Estado activo | Sistema | ver | — |
| **password_reset_token** | entidad | Token de recuperación de contraseña | usuario | generar, usar | Recuperar Contraseña |
| password_reset_token · token / expires_at / used_at | atributo | Token, vencimiento y marca de uso | Sistema | (interno) | — |
| **paciente** | entidad | Persona atendida en la clínica | SECRETARIA, DOCTORA, (Público se registra al reservar) | buscar, crear (implícito al reservar), seleccionar, listar | Booking Wizard (paso 3), Historia Clínica (selector), Agenda |
| paciente · name | atributo | Nombre y apellido | SECRETARIA, DOCTORA, Público | ingresar, ver | Booking Wizard, Agenda, Historia Clínica |
| paciente · dni | atributo | DNI argentino (7-8 dígitos, único) | SECRETARIA, DOCTORA, Público | ingresar, ver | Booking Wizard, Agenda, Historia Clínica |
| paciente · phone | atributo | Teléfono / WhatsApp (único) | SECRETARIA, DOCTORA, Público | ingresar, ver | Booking Wizard, Agenda |
| paciente · email | atributo | Correo único (comprobantes/recordatorios) | Público, SECRETARIA | ingresar, ver | Booking Wizard |
| paciente · birth_date | atributo | Fecha de nacimiento (obligatoria en el MER; **no capturada en la UI actual**) | — | (definido, sin uso en UI) | Solo modelo |
| paciente · active / created_at | atributo | Estado de alta y fecha de registro | Sistema | ver | Defaults de API |
| *(profession)* | — | **Eliminado del modelo en V4.** El *type* del front aún lo declara, pero el MER ya no lo tiene | — | (obsoleto) | Solo `type` del front |
| **servicio** | entidad | Tratamiento dermatológico/estético ofrecido | ADMIN (gestiona), Público (elige) | crear, editar precio, listar, seleccionar | Admin "Tarifas", Booking Wizard, Landing |
| servicio · name | atributo | Nombre del tratamiento (único) | ADMIN, Público | ingresar, editar, ver | Admin, Booking, Agenda |
| servicio · description | atributo | Detalle clínico | ADMIN, Público | ingresar, editar, ver | Admin, Booking |
| servicio · duration_minutes | atributo | Duración de la sesión (10-480) | ADMIN | ingresar, editar, ver | Admin, Booking |
| servicio · base_price | atributo | Precio base actual (ARS) | ADMIN | ingresar, editar, ver | Admin, Booking, Métricas |
| servicio · deposit_percentage | atributo | Porcentaje de seña obligatoria (1-100; default 50) | ADMIN | editar, ver | Admin (modal de edición) |
| servicio · follow_up_interval_days | atributo | Días recomendados de control (0 = sin seguimiento; **no expuesto en UI**) | — | (definido, sin uso en UI) | Solo modelo |
| servicio · active | atributo | Si está publicado | ADMIN/Sistema | ver | Admin |
| **cita** | entidad | Turno que vincula paciente + servicio + usuario creador | Público (reserva), SECRETARIA (gestiona), DOCTORA (consulta) | reservar (bloqueo temporal), cancelar, ver, seleccionar | Booking Wizard, Agenda, Calendario Médico |
| cita · start_time / end_time | atributo | Franja programada (ISO UTC; end > start) | Público, SECRETARIA | seleccionar, ver | Booking Wizard (paso 2), Agenda |
| cita · paciente_id | referencia | Paciente del turno | SECRETARIA, DOCTORA | ver | Agenda, Historia Clínica |
| cita · servicio_id | referencia | Servicio reservado | todos | ver | Agenda, Booking |
| cita · created_by_user_id | referencia | Usuario que creó el turno | Sistema | (interno) | — |
| cita · status | atributo | `PENDING_PAYMENT` / `CONFIRMED` / `CANCELED` / `COMPLETED` / `PAYMENT_FAILED` / `NO_SHOW` (el front usa `CANCELLED` con doble L) | SECRETARIA, DOCTORA | ver; cambia por cancelar/cobrar | Agenda (badge de estado) |
| cita · agreed_price | atributo | Precio acordado (la seña 50% se deriva) | SECRETARIA | ver | Agenda, Booking |
| cita · follow_up_to_id | referencia | Cita de origen para un turno de seguimiento (1:1) | Sistema | (interno) | Solo modelo |
| *(temporary_hold_deadline / reschedule_count / version)* | — | **Eliminados del modelo en V4** (el front aún los declara y usa un contador de 10 min en UI) | Público | ver (timer en UI) | Booking Wizard (paso 4) / solo `type` |
| **transaccion_pago** | entidad | Pago cobrado online o en mostrador | Público (seña), SECRETARIA (saldo) | pagar seña (MercadoPago), registrar cobro en mostrador | Booking Wizard (paso 4), Agenda (modal de cobro) |
| transaccion_pago · payment_type | atributo | Canal: `MERCADOPAGO` / `CASH` / `BANK_TRANSFER` (renombrado desde `payment_method` en V6) | Público, SECRETARIA | seleccionar | Booking, Agenda |
| transaccion_pago · payment_concept | atributo | Concepto: `DEPOSIT` / `BALANCE` / `FULL` | Sistema, SECRETARIA | seleccionar | Agenda (modal de cobro) |
| transaccion_pago · amount | atributo | Monto (seña 50% o saldo restante) | Público, SECRETARIA | ver, ingresar | Booking, Agenda |
| transaccion_pago · status | atributo | `PENDING` / `APPROVED` / `REJECTED` / `REFUNDED` | Sistema | ver | (backend) |
| transaccion_pago · mp_preference_id / mp_payment_id | atributo | Preferencia y pago de MercadoPago Checkout Pro | Público | abrir / redirigir | Booking Wizard (paso 4) |
| transaccion_pago · registered_by_user_id / payment_date | atributo | Quién registró el cobro y cuándo se aprobó | SECRETARIA/Sistema | ver | — |
| **bloqueo_calendario** | entidad | Franja bloqueada en el calendario (no disponible para reservas) | DOCTORA, SECRETARIA | crear, ver | (definido en modelo; **sin UI dedicada actual**) |
| bloqueo_calendario · start_time / end_time / reason | atributo | Rango bloqueado y motivo opcional | DOCTORA, SECRETARIA | ingresar, ver | Solo modelo |
| **historia_clinica** | entidad | Ficha clínica estructurada, 1:1 con paciente | DOCTORA | ver, crear/guardar (auditada) | Historia Clínica → Ficha |
| historia_clinica · fitzpatrick_phototype | atributo | Fototipo cutáneo (1-6; el front usa I-VI) | DOCTORA | seleccionar, ver | Historia Clínica → Ficha |
| historia_clinica · physical_examination | atributo | Examen físico (cifrado AES-256-GCM; **no capturado en UI**) | DOCTORA | (definido, sin uso en UI) | Solo modelo |
| historia_clinica · informed_consent_signed | atributo | Consentimiento firmado | DOCTORA | ver | Historia Clínica |
| historia_clinica · gynecological_history | atributo | Antecedentes ginecológicos (texto; **no capturado en UI**) | DOCTORA | (definido, sin uso en UI) | Solo modelo |
| historia_clinica · surgical_history | atributo | Antecedentes quirúrgicos (texto; **no capturado en UI**) | DOCTORA | (definido, sin uso en UI) | Solo modelo |
| historia_clinica · current_medications | atributo | Medicación actual (texto; **no capturado en UI**) | DOCTORA | (definido, sin uso en UI) | Solo modelo |
| historia_clinica · previous_aesthetic_treatments | atributo | Tratamientos estéticos previos (texto; **no capturado en UI**) | DOCTORA | (definido, sin uso en UI) | Solo modelo |
| *(treatment_plan)* | — | Plan de tratamiento: **eliminado del modelo en V4**; el front todavía lo captura como texto libre | DOCTORA | ingresar, ver (solo front) | Historia Clínica → Ficha / solo `type` |
| **alergia** | entidad débil de `historia_clinica` | Alergia conocida del paciente (PK compuesta: historia_clinica_id + tipo). En el MER es entidad; **el front la representa como checkboxes** (anestesia, huevo, pescado/yodo) | DOCTORA | registrar, ver | Historia Clínica → Ficha (checkboxes) |
| alergia · tipo / observaciones | atributo | Tipo de alergia y observaciones | DOCTORA | ingresar, ver | Historia Clínica → Ficha |
| **antecedente_patologico** | entidad débil de `historia_clinica` | Antecedente patológico (PK compuesta: historia_clinica_id + tipo). En el MER es entidad; **el front lo representa como checkboxes** (HTA, DBT, hipo/hipertiroidismo, anemia, autoinmune, glaucoma, coagulación, queloides) | DOCTORA | registrar, ver | Historia Clínica → Ficha (checkboxes) |
| antecedente_patologico · tipo / observaciones | atributo | Tipo de antecedente y observaciones | DOCTORA | ingresar, ver | Historia Clínica → Ficha |
| **habito** | entidad débil de `historia_clinica` | Hábito del paciente (PK compuesta: historia_clinica_id + tipo). En el MER es entidad; **el front lo representa como checkboxes** (tabaco, alcohol, exposición solar, uso de FPS) | DOCTORA | registrar, ver | Historia Clínica → Ficha (checkboxes) |
| habito · tipo / observaciones | atributo | Tipo de hábito y observaciones | DOCTORA | ingresar, ver | Historia Clínica → Ficha |
| **entrada_hc** | entidad | Entrada de evolución clínica por sesión (vincula paciente + cita; relación `es_sujeto_de`) | DOCTORA | agregar, ver (listado) | Historia Clínica → Ficha (columna derecha) |
| entrada_hc · content | atributo | Nota de evolución (cifrada AES-256-GCM): unidades inyectadas, zonas, tolerancia | DOCTORA | ingresar, ver | Historia Clínica |
| entrada_hc · author_user_id | referencia | Autor de la nota (relación `es_autor` con usuario) | DOCTORA | ver | Historia Clínica |
| entrada_hc · cita_id / created_at | atributo/ref | Cita asociada y fecha de creación | Sistema | ver | Historia Clínica |
| **imagen_hc** | entidad | Metadatos de fotografía médica (asociada a una `entrada_hc`, no a la HC general) | DOCTORA | ver, comparar (arrastrar); **la carga/subida no existe en la UI actual** | Historia Clínica → Antes/Después |
| imagen_hc · file_path / original_filename | atributo | Ruta en Supabase Storage y nombre original | DOCTORA/Sistema | ver | — |
| imagen_hc · content_type / file_size | atributo | MIME (`image/jpeg` / `image/png`) y tamaño (máx. 10 MB) | Sistema | (validación) | — |
| imagen_hc · description | atributo | Descripción / etiqueta (ej. "Antes (Día 1)" / "Después (Día 30)") | DOCTORA | ver | Visor Antes/Después |
| **historia_clinica_audit** | entidad (inmutable) | Registro de auditoría de cambios en la historia clínica | DOCTORA, ADMIN | ver, expandir diff JSON | Historia Clínica → Auditoría |
| historia_clinica_audit · modified_section | atributo | Sección modificada (ej. UPDATE_ANAMNESIS) | DOCTORA | ver | Auditoría |
| historia_clinica_audit · modified_by_user_id / updated_at | atributo | Autor del cambio y marca temporal (renombrada desde `modified_at` en V6) | DOCTORA | ver | Auditoría |
| historia_clinica_audit · previous_values / new_values | atributo | Snapshots JSONB (estado anterior / nuevo) | DOCTORA | expandir, ver | Auditoría |
| **entrada_hc_audit** | entidad (inmutable) | Registro de auditoría de cambios en entradas de evolución | DOCTORA, ADMIN | ver | (backend / relación `es_auditada`) |
| entrada_hc_audit · previous_content / new_content | atributo | Contenido anterior/nuevo (cifrado AES-256-GCM) | Sistema | (interno) | — |
| entrada_hc_audit · modified_by_user_id / modified_at | atributo | Autor y marca temporal (conserva `modified_at`) | DOCTORA | ver | — |
| **Métricas / KPIs** | contenido derivado (no es entidad del MER) | Indicadores de gestión calculados sobre citas, pagos y servicios | ADMIN, DOCTORA | ver | Dashboard de Métricas |
| KPI · facturación total | dato | Facturación total + % vs. mes anterior | ADMIN, DOCTORA | ver | Métricas |
| KPI · tasa de asistencia | dato | % de asistencia, reducción de ausentismo | ADMIN, DOCTORA | ver | Métricas |
| KPI · turnos gestionados | dato | Cantidad de citas | ADMIN, DOCTORA | ver | Métricas |
| KPI · consultas del chatbot | dato | Consultas de IA + % convertidas a reserva | ADMIN, DOCTORA | ver | Métricas |
| KPI · tratamientos más solicitados | dato | Ranking de servicios por volumen/facturación | ADMIN, DOCTORA | ver | Métricas |
| KPI · canales de recaudación | dato | Distribución señas online vs. saldo en mostrador | ADMIN, DOCTORA | ver | Métricas |
| **Comprobante de Turno** | documento (derivado) | Comprobante imprimible de la cita (QR/PDF) | Público, SECRETARIA | abrir, imprimir | Modales en Booking (paso 4) y Agenda |
| **Consentimiento Informado (Ley 26.529)** | documento (derivado) | Formulario de consentimiento imprimible | DOCTORA | abrir, imprimir | Modal en Historia Clínica |
| **Recordatorio / Sync de Calendario** | función/modal (derivado) | Recordatorios 24h y 2h, Google Calendar / archivo .ics | Público, SECRETARIA | programar, agendar en calendario | Modales en Booking (paso 4) y Agenda |
| **Mensaje de Chat / Asistente IA** | contenido/flujo (no es entidad del MER) | Conversación con el chatbot Gemini | Público (y cualquier usuario) | enviar mensaje, leer respuesta, minimizar/cerrar | Widget global de chatbot |
| Respuesta IA · suggestedServices / bookingActionUrl | dato | Servicios sugeridos + enlace directo a reserva | Público | (definido; parcialmente expuesto) | `type` del front / respuesta de chat |
| **Identidad / marca de la clínica** | contenido | Nombre, especialidad, logo, footer | Público | ver | Header/footer del Landing, Navbar |
| **Destacados de servicios (Landing)** | contenido | 3 categorías ejemplares (Clínica, Estética, Láser) | Público | ver (no enlazan a la reserva) | Landing page |

---

## 2. Acciones (funcionalidad)

| Acción | Usuario | Entidad afectada | Ubicación actual |
|---|---|---|---|
| Buscar paciente | SECRETARIA, DOCTORA | paciente | La API lo soporta (`getPatients(search)`); **no hay UI de búsqueda renderizada** |
| Crear paciente | Público (implícito), SECRETARIA | paciente | Booking Wizard paso 3 (se crea al reservar) |
| Seleccionar paciente | DOCTORA | paciente | Selector desplegable en Historia Clínica |
| Reservar cita (bloqueo temporal) | Público | cita | Booking Wizard (pasos 1-4) |
| Cancelar cita | SECRETARIA | cita | Agenda (botón/confirmación de cancelación) |
| Pagar seña online (MercadoPago) | Público | transaccion_pago | Booking Wizard paso 4 |
| Registrar cobro en mostrador / liquidar saldo | SECRETARIA | transaccion_pago | Modal de cobro en Agenda |
| Ver agenda (calendario o lista) | SECRETARIA, DOCTORA, ADMIN | cita | Agenda (conmutador calendario/tabla, selector de fecha y day-pills) |
| Imprimir comprobante de turno | Público, SECRETARIA | Comprobante | Booking paso 4, Agenda |
| Programar recordatorio / agendar en calendario | Público, SECRETARIA | Recordatorio | Booking paso 4, Agenda |
| Ver / editar historia clínica (anamnesis) | DOCTORA | historia_clinica (+ alergia, antecedente_patologico, habito) | Historia Clínica → Ficha |
| Guardar y auditar historia clínica | DOCTORA | historia_clinica + historia_clinica_audit | Historia Clínica → Ficha |
| Agregar nota de evolución | DOCTORA | entrada_hc | Historia Clínica → Ficha (columna derecha) |
| Ver imágenes clínicas (antes/después) | DOCTORA | imagen_hc | Historia Clínica → Antes/Después |
| *(Subir imagen clínica)* | DOCTORA | imagen_hc | **Capacidad del modelo sin UI actual** |
| Abrir consentimiento informado (imprimir) | DOCTORA | Consentimiento | Historia Clínica |
| Ver auditoría / expandir diff | DOCTORA, ADMIN | historia_clinica_audit / entrada_hc_audit | Historia Clínica → Auditoría |
| Crear servicio | ADMIN | servicio | Admin "Tarifas" (modal de alta) |
| Editar precio y % de seña del servicio | ADMIN | servicio | Admin "Tarifas" (modal de edición) |
| *(Crear bloqueo de calendario)* | DOCTORA, SECRETARIA | bloqueo_calendario | **Entidad del modelo sin UI dedicada actual** |
| Ver métricas / KPIs | ADMIN, DOCTORA | Métricas (derivadas) | Dashboard de Métricas |
| Chatear con el asistente IA | Público (cualquiera) | Mensaje de chat | Widget global de chatbot |
| Iniciar sesión | Staff | usuario | Login |
| Recuperar contraseña | Staff | usuario / password_reset_token | Recuperar Contraseña |
| Cerrar sesión | Staff | usuario (sesión) | Navbar / DashboardLayout |
| Simular rol (demo) | Usuario demo | usuario · role | Barra demo de DashboardLayout |
| Navegar pestañas (Reservar / Agenda / Clínica / Tarifas / Métricas) | todos (según rol) | — | Navbar + BottomNav |

---

## 3. Hallazgos de descubrimiento

Señales a arrastrar hacia la próxima etapa (agrupación en el nuevo sitemap). No se actúa sobre ellas aquí.

- **La búsqueda de paciente existe en la API pero no tiene superficie en la UI.** `patientsApi.getPatients(search)` acepta un término de búsqueda, pero ninguna pantalla renderiza un buscador.
- **Desalineación entre la UI actual y el MER que conviene resolver antes de rediseñar el sitemap:**
  - **Roles:** el front usa `PHYSICIAN` / `RECEPTIONIST`; el MER define `DOCTORA` / `SECRETARIA`.
  - **Estado de cita:** el front usa `CANCELLED`; el MER usa `CANCELED`.
  - **Alergias, antecedentes patológicos y hábitos:** el MER los modela como **entidades débiles** (`alergia`, `antecedente_patologico`, `habito`) con `tipo` + `observaciones`; el front los captura como *booleans* fijos.
  - **Fototipo Fitzpatrick:** MER `INT (1-6)`; front `I-VI`.
- **Atributos definidos en el modelo pero nunca mostrados en ningún formulario:**
  - paciente: `birth_date` (obligatorio en el MER)
  - historia_clinica: `physical_examination`, `gynecological_history`, `surgical_history`, `current_medications`, `previous_aesthetic_treatments`
  - servicio: `follow_up_interval_days`
- **Campos que el front todavía usa pero el MER V4 eliminó:** paciente `profession`, historia_clinica `treatment_plan`, y `temporary_hold_deadline` / `reschedule_count` / `version` de cita. Conviene decidir si se recuperan en el modelo o se retiran del front.
- **`imagen_hc` puede verse y compararse pero no subirse** en la UI (el visor Antes/Después usa imágenes de placeholder). "Subir imagen" es una capacidad del modelo sin acción en la interfaz.
- **`bloqueo_calendario` existe en el MER pero no tiene UI dedicada** para crear/gestionar bloqueos.
- **Las mismas entidades aparecen en múltiples lugares** (paciente en Booking + Agenda + Historia Clínica; cita en Booking + Agenda + Calendario Médico; Comprobante y Recordatorio como modales compartidos en Booking y Agenda). Señal útil para el futuro sitemap.
- **El pago (`transaccion_pago`) es un flujo, no una vista de primer nivel** — no hay una vista de historial/ledger de pagos; solo aparece en el momento de la seña o de la liquidación en mostrador.

---

*Fuentes: MER (`documentacion/recursos_academicos_originales/MER.drawio`), esquema de base de datos (`backend/src/main/resources/db/migration/V4__schema_redesign.sql`, `V6__spec_alignment.sql`) y frontend (`frontend/src`: `App.tsx`, `components/*`, `features/**`, `services/api.ts`, `types/index.ts`).*
