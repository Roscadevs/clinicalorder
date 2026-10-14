# Documento de Sistema de Recordatorios y Sincronización con Calendarios (Fase 8)

**Proyecto:** Sistema Integral de Gestión Dermatológica, Estética y Asistente Virtual con IA  
**Cátedra:** Ingeniería del Software II — Entrega I & II / Trabajo Práctico Especial (TPE)  
**Fecha:** 2026-08-22 · **Versión:** 8.0.0  
**Módulos:** `calendarGenerator.ts`, `ReminderNotificationModal.tsx`

---

## 📑 1. Propósito y Estrategia Anti-Absentismo

La **Fase 8** implementa la sincronización bidireccional con agendas personales y notificaciones automatizadas multicanal para consolidar la eliminación del absentismo (no-shows):

1. **Sincronización con Google Calendar con 1 Clic:**
   - Construcción de URLs parametrizadas con el horario exacto del turno en tiempo universal coordinado (UTC), ubicación del consultorio e indicaciones médicas previas.
2. **Exportación Universal a Apple Calendar y Microsoft Outlook (`.ics`):**
   - Generación en el cliente de archivos en estándar **iCalendar (RFC 5545)** con eventos `VEVENT` y dos disparadores de alarma `VALARM`:
     - **Alarma 1 (-24h):** Recordatorio preventivo el día previo.
     - **Alarma 2 (-2h):** Aviso final para preparar el traslado al consultorio.
3. **Simulador de Notificaciones Multicanal (WhatsApp / Push):**
   - Interfaz interactiva para la secretaria y el paciente que permite disparar y confirmar la asistencia médica en tiempo real.

---

## 🏛️ 2. Especificación Técnica de los Protocolos

### 2.1. Estructura del Archivo iCalendar RFC 5545 (`.ics`)
```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Clinica Dra Valeria Gomez//Gestion Dermatologica//ES
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:turno-{id}-{timestamp}@clinicadravaleria.com.ar
DTSTAMP:{now_utc}
DTSTART:{start_utc}
DTEND:{end_utc}
SUMMARY:🌿 Turno Médico: {service_name} - Dra. Valeria Gómez
DESCRIPTION:{details} - Concurrir con rostro limpio y 10 min de anticipación.
LOCATION:Av. Santa Fe 2450\, Piso 4\, CABA\, Argentina
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT24H
DESCRIPTION:Recordatorio de Turno Médico Dermatológico mañana
ACTION:DISPLAY
END:VALARM
BEGIN:VALARM
TRIGGER:-PT2H
DESCRIPTION:Recordatorio: Turno médico en 2 horas con Dra. Valeria Gómez
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR
```

---

## 🔄 3. Flujo Operativo Integrado

```
    [PACIENTE CONFIRMA SEÑA]
               │
               ├───► [Botón Google Calendar] ───────► Abre evento precargado en Google Calendar
               │
               ├───► [Botón Apple / Outlook] ───────► Descarga archivo .ics con alarmas -24h y -2h
               │
               └───► [Simulador de WhatsApp / Push] ─► Muestra mensaje automático y confirmación de asistencia
```
