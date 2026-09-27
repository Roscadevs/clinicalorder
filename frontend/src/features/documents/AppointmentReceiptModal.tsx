import React from 'react';
import { Calendar, Download, Printer, X, CheckCircle } from 'lucide-react';
import { generateGoogleCalendarUrl, downloadIcsCalendarFile } from '../../utils/calendarGenerator';
import { Logo } from '../../components/ui';
import { CLINIC } from '../../config/contact';
import {
  PaymentConcept,
  PaymentType,
  PAYMENT_CONCEPT_LABELS,
  PAYMENT_TYPE_LABELS,
} from '../../types';

const TZ = 'America/Argentina/Buenos_Aires';

export interface ReceiptPayment {
  type: PaymentType;
  concept: PaymentConcept;
  amount: number;
  date: string; // ISO 8601
  transactionId?: number;
}

interface AppointmentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentData: {
    id: number;
    patientName: string;
    patientDni: string;
    patientEmail: string;
    patientPhone: string;
    serviceName: string;
    startTime: string;
    durationMinutes: number;
    agreedPrice: number;
    depositAmount: number;
  };
  /** Pago registrado. Si falta, el comprobante indica que no hay pagos. */
  payment?: ReceiptPayment;
}

const ars = (n: number) => `$${n.toLocaleString('es-AR', { maximumFractionDigits: 2 })} ARS`;
const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('es-AR', { timeZone: TZ, ...opts }).format(new Date(iso));

/**
 * Comprobante de turno imprimible: fecha, tratamiento, tipo de pago y monto abonado.
 */
export const AppointmentReceiptModal: React.FC<AppointmentReceiptModalProps> = ({
  isOpen,
  onClose,
  appointmentData,
  payment,
}) => {
  if (!isOpen) return null;

  const paid = payment?.amount ?? 0;
  const remainingBalance = Math.max(0, appointmentData.agreedPrice - paid);
  const turnoDate = fmt(appointmentData.startTime, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const turnoTime = fmt(appointmentData.startTime, { hour: '2-digit', minute: '2-digit' });

  const calendarEvent = {
    id: appointmentData.id,
    title: appointmentData.serviceName,
    description:
      `Turno de ${appointmentData.serviceName} para ${appointmentData.patientName} con ${CLINIC.doctorName}.` +
      (payment ? ` Pago registrado: ${ars(paid)} (${PAYMENT_TYPE_LABELS[payment.type]}).` : '') +
      ` Saldo a abonar en consultorio: ${ars(remainingBalance)}.`,
    location: CLINIC.address || CLINIC.doctorName,
    startTime: appointmentData.startTime,
    durationMinutes: appointmentData.durationMinutes,
  };

  return (
    <div
      className="fixed inset-0 bg-sand-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto print:static print:bg-transparent print:p-0"
      role="dialog"
      aria-modal="true"
      aria-label="Comprobante de turno"
      onClick={onClose}
    >
      <div
        className="receipt-print-area bg-white rounded-t-3xl sm:rounded-2xl shadow-lift max-w-2xl w-full p-5 sm:p-8 space-y-5 max-h-[92dvh] overflow-y-auto print:max-h-none print:shadow-none print:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Acciones (no se imprimen) */}
        <div className="flex flex-wrap justify-between items-center gap-2 border-b border-sand-100 pb-3 print:hidden">
          <span className="flex items-center gap-2 text-sm font-bold text-sand-800">
            <CheckCircle className="w-5 h-5 text-success-600" />
            Comprobante de turno
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <a
              href={generateGoogleCalendarUrl(calendarEvent)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl text-xs font-bold border border-sand-200 bg-sand-50 text-sand-700 hover:bg-sand-100"
              title="Añadir a Google Calendar"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Google Calendar</span>
            </a>
            <button
              onClick={() => downloadIcsCalendarFile(calendarEvent)}
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl text-xs font-bold border border-sand-200 bg-sand-50 text-sand-700 hover:bg-sand-100"
              title="Descargar archivo .ics"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">iCal (.ics)</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl text-xs font-bold bg-primary-500 hover:bg-primary-600 text-white"
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="p-2 min-h-[40px] min-w-[40px] rounded-xl text-sand-400 hover:bg-sand-100 hover:text-sand-700 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Encabezado */}
        <div className="flex justify-between items-start gap-4 border-b-2 border-primary-500 pb-4">
          <div className="flex items-center gap-3">
            <Logo variant="mark" className="w-12 h-12 text-primary-500" />
            <div>
              <h1 className="font-display text-lg sm:text-xl font-bold text-sand-900">{CLINIC.doctorName}</h1>
              <p className="text-xs font-semibold text-primary-600">{CLINIC.specialty}</p>
              {CLINIC.address && <p className="text-[11px] text-sand-500">{CLINIC.address}</p>}
            </div>
          </div>
          <div className="text-right text-[11px] text-sand-500">
            <span className="block font-mono font-bold text-sand-800 text-xs">
              TURNO #{appointmentData.id.toString().padStart(6, '0')}
            </span>
            Emitido: {fmt(new Date().toISOString(), { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </div>
        </div>

        {/* Paciente y turno */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-sand-50 border border-sand-200 rounded-xl p-4">
            <span className="block text-[10px] uppercase font-bold text-sand-500 mb-1">Paciente</span>
            <p className="font-bold text-sand-900">{appointmentData.patientName}</p>
            <p className="text-sand-600">DNI {appointmentData.patientDni}</p>
            <p className="text-sand-600">{appointmentData.patientPhone}</p>
            <p className="text-sand-600 break-all">{appointmentData.patientEmail}</p>
          </div>
          <div className="bg-sand-50 border border-sand-200 rounded-xl p-4">
            <span className="block text-[10px] uppercase font-bold text-sand-500 mb-1">Turno</span>
            <p className="font-bold text-sand-900">{appointmentData.serviceName}</p>
            <p className="text-sand-700 capitalize">{turnoDate}</p>
            <p className="text-sand-700">
              {turnoTime} hs · {appointmentData.durationMinutes} min
            </p>
          </div>
        </div>

        {/* Pago */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-sand-500 mb-2">Pago</h2>
          <table className="w-full text-sm border border-sand-200 rounded-xl overflow-hidden">
            <tbody className="divide-y divide-sand-100">
              {payment ? (
                <>
                  <tr>
                    <th scope="row" className="p-2.5 text-left font-medium text-sand-600">Tipo de pago</th>
                    <td className="p-2.5 text-right font-semibold text-sand-900">{PAYMENT_TYPE_LABELS[payment.type]}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="p-2.5 text-left font-medium text-sand-600">Concepto</th>
                    <td className="p-2.5 text-right font-semibold text-sand-900">{PAYMENT_CONCEPT_LABELS[payment.concept]}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="p-2.5 text-left font-medium text-sand-600">Fecha del pago</th>
                    <td className="p-2.5 text-right text-sand-800">
                      {fmt(payment.date, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })} hs
                    </td>
                  </tr>
                  <tr className="bg-success-50/60">
                    <th scope="row" className="p-2.5 text-left font-bold text-sand-800">Monto abonado</th>
                    <td className="p-2.5 text-right font-bold text-success-700">{ars(paid)}</td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan={2} className="p-2.5 text-sand-500">Sin pagos registrados para este turno.</td>
                </tr>
              )}
              <tr>
                <th scope="row" className="p-2.5 text-left font-medium text-sand-600">Precio total del tratamiento</th>
                <td className="p-2.5 text-right text-sand-800">{ars(appointmentData.agreedPrice)}</td>
              </tr>
              <tr className="bg-sand-50">
                <th scope="row" className="p-2.5 text-left font-bold text-sand-900">Saldo a abonar en consultorio</th>
                <td className="p-2.5 text-right font-bold text-primary-600">{ars(remainingBalance)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-sand-500 border-t border-sand-100 pt-3">
          Presentarse 10 minutos antes con DNI. Ante cualquier cambio, comunicarse con el consultorio con anticipación.
        </p>
      </div>
    </div>
  );
};
