/**
 * Datos de contacto públicos de la clínica.
 *
 * El número de WhatsApp se toma de la variable de entorno VITE_WHATSAPP_NUMBER
 * (formato internacional, sólo dígitos, sin "+" ni espacios. Ej: 5491112345678).
 */
export const WHATSAPP_NUMBER: string = (import.meta.env.VITE_WHATSAPP_NUMBER ?? '').replace(/\D/g, '');

/** Datos institucionales que aparecen en comprobantes y recordatorios. */
export const CLINIC = {
  doctorName: 'Dra. Paula Villa Fuhrmann',
  specialty: 'Especialista en Medicina Estética',
  // PENDIENTE: completar con la dirección real del consultorio.
  address: (import.meta.env.VITE_CLINIC_ADDRESS as string | undefined) || '',
} as const;

/**
 * Arma el link de WhatsApp (wa.me) con un mensaje precargado.
 * Si no hay número configurado, abre WhatsApp para que el usuario elija el contacto.
 */
export function whatsappLink(message: string): string {
  const text = encodeURIComponent(message);
  return WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
    : `https://wa.me/?text=${text}`;
}

export const BOOKING_MESSAGE =
  'Hola Dra. Paula, quisiera solicitar un turno. ¿Qué disponibilidad tienen?';

export const serviceInquiryMessage = (serviceName: string) =>
  `Hola Dra. Paula, quisiera consultar por el tratamiento "${serviceName}" y solicitar un turno.`;
