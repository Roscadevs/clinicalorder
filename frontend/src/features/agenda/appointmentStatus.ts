import { Appointment, AppointmentStatus } from '../../types';

/**
 * Estado VISUAL del turno para la agenda. Combina el estado real del backend
 * con una regla derivada: un turno cuya hora de inicio ya pasó y que sigue
 * confirmado o pendiente (no atendido ni cancelado) se muestra como "vencido".
 */
export type VisualStatus =
  | 'CONFIRMED'   // Confirmado, a futuro (amarillo)
  | 'ATTENDED'    // Atendido por el médico, falta cobrar (info/azul)
  | 'COMPLETED'   // Atendido y cobrado / pago completo (verde)
  | 'OVERDUE'     // Pasó la hora y no se atendió (rojo)
  | 'PENDING'     // Reserva sin pagar la seña (naranja, transitorio)
  | 'CANCELED';   // Cancelado / pago fallido (gris)

export function getVisualStatus(appt: Appointment, now: number = Date.now()): VisualStatus {
  switch (appt.status) {
    case 'COMPLETED':
      return 'COMPLETED';
    case 'ATTENDED':
      return 'ATTENDED';
    case 'CANCELED':
    case 'PAYMENT_FAILED':
    case 'NO_SHOW':
      return 'CANCELED';
    case 'PENDING_PAYMENT':
      return new Date(appt.startTime).getTime() < now ? 'OVERDUE' : 'PENDING';
    case 'CONFIRMED':
    default:
      return new Date(appt.startTime).getTime() < now ? 'OVERDUE' : 'CONFIRMED';
  }
}

interface StatusStyle {
  label: string;
  dot: string;      // color del punto de la leyenda
  badge: string;    // clases del badge
  card: string;     // clases de la tarjeta en el calendario (incluye hover)
}

/** Estilos por estado visual (paleta cálida + semánticos). */
export const STATUS_STYLES: Record<VisualStatus, StatusStyle> = {
  CONFIRMED: {
    label: 'Confirmado',
    dot: 'bg-warning-500',
    badge: 'bg-warning-100 text-warning-700',
    card: 'bg-warning-50 border-warning-500/40 hover:bg-warning-100',
  },
  ATTENDED: {
    label: 'Atendido · a cobrar',
    dot: 'bg-info-500',
    badge: 'bg-info-100 text-info-700',
    card: 'bg-info-50 border-info-500/40 hover:bg-info-100',
  },
  COMPLETED: {
    label: 'Cobrado · pago completo',
    dot: 'bg-success-500',
    badge: 'bg-success-100 text-success-700',
    card: 'bg-success-50 border-success-500/40 hover:bg-success-100',
  },
  OVERDUE: {
    label: 'Vencido sin atender',
    dot: 'bg-danger-500',
    badge: 'bg-danger-100 text-danger-700',
    card: 'bg-danger-50 border-danger-500/40 hover:bg-danger-100',
  },
  PENDING: {
    label: 'Reservando (seña pendiente)',
    dot: 'bg-primary-300',
    badge: 'bg-primary-100 text-primary-700',
    card: 'bg-primary-50 border-primary-300/50 hover:bg-primary-100',
  },
  CANCELED: {
    label: 'Cancelado',
    dot: 'bg-sand-400',
    badge: 'bg-sand-100 text-sand-600',
    card: 'bg-sand-100 border-sand-300 hover:bg-sand-200 opacity-70',
  },
};

/** Estados sobre los que aún se puede operar (cobrar, cancelar, recordar). */
export const isActionable = (s: AppointmentStatus) =>
  s === 'CONFIRMED' || s === 'PENDING_PAYMENT';
