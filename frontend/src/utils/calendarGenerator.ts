/**
 * Utilidades para sincronización de turnos médicos con Calendarios (Google Calendar y Apple/Outlook iCal .ics).
 */

export interface CalendarEventData {
  id: number;
  title: string;
  description: string;
  location: string;
  startTime: string; // ISO 8601 UTC
  durationMinutes: number;
}

/**
 * Formatea una fecha ISO a la notación requerida por Google Calendar y el estándar iCal (YYYYMMDDTHHmmssZ).
 */
export function formatToIcsDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toISOString().replace(/-|:|\.\d+/g, '');
}

/**
 * Genera el enlace directo para añadir el turno médico a Google Calendar con 1 clic.
 */
export function generateGoogleCalendarUrl(event: CalendarEventData): string {
  const startDate = new Date(event.startTime);
  const endDate = new Date(startDate.getTime() + event.durationMinutes * 60 * 1000);

  const startFormatted = formatToIcsDate(startDate.toISOString());
  const endFormatted = formatToIcsDate(endDate.toISOString());

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `🌿 Turno Médico: ${event.title} - Dra. Valeria Gómez`,
    dates: `${startFormatted}/${endFormatted}`,
    details: `${event.description}\n\n📍 Consultorio: Dra. Valeria Gómez\nIndicaciones: Presentarse 10 min antes con DNI y rostro limpio. Evitar exposición solar previa.`,
    location: event.location || 'Av. Santa Fe 2450, Piso 4, CABA, Argentina',
    sprop: 'website:clinicadermatologica.com.ar',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Genera y descarga un archivo estándar iCalendar (.ics) para Apple Calendar, Outlook o Android con alarmas previas de 24h y 2h.
 */
export function downloadIcsCalendarFile(event: CalendarEventData): void {
  const startDate = new Date(event.startTime);
  const endDate = new Date(startDate.getTime() + event.durationMinutes * 60 * 1000);

  const startFormatted = formatToIcsDate(startDate.toISOString());
  const endFormatted = formatToIcsDate(endDate.toISOString());
  const nowFormatted = formatToIcsDate(new Date().toISOString());

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Clinica Dra Valeria Gomez//Gestion Dermatologica//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:turno-${event.id}-${startFormatted}@clinicadravaleria.com.ar`,
    `DTSTAMP:${nowFormatted}`,
    `DTSTART:${startFormatted}`,
    `DTEND:${endFormatted}`,
    `SUMMARY:🌿 Turno Médico: ${event.title} - Dra. Valeria Gómez`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')} - Por favor concurrir con rostro limpio y 10 min de anticipación.`,
    `LOCATION:${event.location || 'Av. Santa Fe 2450\\, Piso 4\\, CABA\\, Argentina'}`,
    'STATUS:CONFIRMED',
    // Alarma 24 horas antes
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'DESCRIPTION:Recordatorio de Turno Médico Dermatológico mañana',
    'ACTION:DISPLAY',
    'END:VALARM',
    // Alarma 2 horas antes
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'DESCRIPTION:Recordatorio: Turno médico en 2 horas con Dra. Valeria Gómez',
    'ACTION:DISPLAY',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `Turno-DraValeria-${event.id}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
