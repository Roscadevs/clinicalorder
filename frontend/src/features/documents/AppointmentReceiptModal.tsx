import React from 'react'; // React hooks
import { Printer, X, CheckCircle, Sparkles, QrCode, ShieldCheck, Calendar, Download } from 'lucide-react'; // Iconos
import { generateGoogleCalendarUrl, downloadIcsCalendarFile } from '../../utils/calendarGenerator'; // Utilidades

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
    mpTransactionId?: string;
  };
}

/**
 * Modal y documento imprimible de Comprobante Oficial con soporte Bottom Sheet en Celulares.
 */
export const AppointmentReceiptModal: React.FC<AppointmentReceiptModalProps> = ({
  isOpen,
  onClose,
  appointmentData,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const remainingBalance = appointmentData.agreedPrice - appointmentData.depositAmount;

  const calendarEvent = {
    id: appointmentData.id,
    title: appointmentData.serviceName,
    description: `Turno de ${appointmentData.serviceName} para ${appointmentData.patientName}. Seña abonada: $${appointmentData.depositAmount.toLocaleString()} ARS. Saldo en recepción: $${remainingBalance.toLocaleString()} ARS.`,
    location: 'Consultorio Dra. Valeria Gómez, Av. Santa Fe 2450, Piso 4, CABA',
    startTime: appointmentData.startTime,
    durationMinutes: appointmentData.durationMinutes,
  };

  const googleUrl = generateGoogleCalendarUrl(calendarEvent);

  const handleDownloadIcs = () => {
    downloadIcsCalendarFile(calendarEvent);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-2xl w-full p-5 sm:p-8 space-y-5 relative max-h-[92dvh] overflow-y-auto print:p-0 print:shadow-none print:max-w-full">
        {/* Tirador táctil para celular */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto sm:hidden print:hidden"></div>

        {/* Botones de acción superiores (Ocultos en impresión) */}
        <div className="flex flex-wrap justify-between items-center print:hidden border-b border-slate-100 pb-3 gap-2">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-slate-800">Comprobante Oficial de Reserva</span>
          </div>
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-wrap">
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold px-2.5 sm:px-3 py-2 rounded-xl flex items-center space-x-1.5 transition-colors border border-blue-200 min-h-[40px]"
              title="Añadir a Google Calendar"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Google Calendar</span>
            </a>
            <button
              onClick={handleDownloadIcs}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-2.5 sm:px-3 py-2 rounded-xl flex items-center space-x-1.5 transition-colors border border-slate-300 min-h-[40px]"
              title="Descargar archivo .ics con alarmas"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">iCal (.ics)</span>
            </button>
            <button
              onClick={handlePrint}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm transition-colors min-h-[40px]"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* --- CONTENIDO DEL COMPROBANTE MÉDICO --- */}
        <div className="space-y-5 text-slate-800 print:text-black">
          {/* Encabezado Clínico */}
          <div className="flex justify-between items-start border-b-2 border-teal-600 pb-3 sm:pb-4">
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">Dra. Valeria Gómez</h1>
              <p className="text-[11px] sm:text-xs font-semibold text-teal-700">Dermatología Clínica & Estética Médica</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500">M.P. 48.912 · M.N. 124.580 · R.E. 09/2018</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500">Av. Santa Fe 2450, Piso 4, CABA · Tel: +54 11 4821-9000</p>
            </div>
            <div className="text-right">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold ml-auto mb-1">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-700">
                TURNO #{appointmentData.id.toString().padStart(6, '0')}
              </span>
            </div>
          </div>

          {/* Datos del Paciente y de la Cita */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Paciente:</span>
              <span className="font-bold text-slate-900 text-sm">{appointmentData.patientName}</span>
              <p className="text-slate-600">DNI: {appointmentData.patientDni}</p>
              <p className="text-slate-600">Tel: {appointmentData.patientPhone}</p>
              <p className="text-slate-600">Email: {appointmentData.patientEmail}</p>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-4">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Detalle del Turno:</span>
              <span className="font-bold text-teal-800 text-sm">{appointmentData.serviceName}</span>
              <p className="font-semibold text-slate-800 mt-1">
                📅 {new Date(appointmentData.startTime).toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="font-bold text-teal-700">
                ⏰ {new Date(appointmentData.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hs ({appointmentData.durationMinutes} min)
              </p>
            </div>
          </div>

          {/* Desglose Financiero */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Liquidación de Seña y Aranceles</h4>
            <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold">
                <tr>
                  <th className="p-2 sm:p-2.5 text-left">Concepto</th>
                  <th className="p-2 sm:p-2.5 text-center">Estado</th>
                  <th className="p-2 sm:p-2.5 text-right">Importe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2 sm:p-2.5">Arancel Total ({appointmentData.serviceName})</td>
                  <td className="p-2 sm:p-2.5 text-center text-slate-500 font-medium">Acordado</td>
                  <td className="p-2 sm:p-2.5 text-right font-bold">${appointmentData.agreedPrice.toLocaleString()} ARS</td>
                </tr>
                <tr className="bg-emerald-50/60 text-emerald-900 font-semibold">
                  <td className="p-2 sm:p-2.5">Seña Online (50% MercadoPago)</td>
                  <td className="p-2 sm:p-2.5 text-center">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">ACREDITADO</span>
                  </td>
                  <td className="p-2 sm:p-2.5 text-right font-bold text-emerald-700">-${appointmentData.depositAmount.toLocaleString()} ARS</td>
                </tr>
                <tr className="bg-slate-50 text-slate-900 font-extrabold text-xs sm:text-sm border-t-2 border-slate-300">
                  <td className="p-2 sm:p-2.5" colSpan={2}>Saldo Restante en Mostrador:</td>
                  <td className="p-2 sm:p-2.5 text-right text-teal-700">${remainingBalance.toLocaleString()} ARS</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Instrucciones Médicas Previas */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-900 space-y-1">
            <span className="font-bold flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-amber-700" /> Indicaciones Previas:
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-amber-800 pl-1">
              <li>Presentarse 10 minutos antes con DNI.</li>
              <li>Evitar exposición solar directa y ácidos exfoliantes 48 hs previas.</li>
              <li>Concurrir con el rostro desmaquillado y limpio.</li>
            </ul>
          </div>

          {/* Pie de Firma y Verificación QR */}
          <div className="flex justify-between items-end pt-3 sm:pt-4 border-t border-slate-200 text-[10px] text-slate-400">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 border border-slate-300 rounded flex items-center justify-center text-slate-700 flex-shrink-0">
                <QrCode className="w-6 h-6 sm:w-8 sm:h-8 text-slate-800" />
              </div>
              <div>
                <p className="font-mono text-[8px] sm:text-[9px]">ID-VERIF: MP-{appointmentData.id}-2026</p>
                <p>Verificación online oficial</p>
              </div>
            </div>
            <div className="text-right">
              <div className="w-28 sm:w-36 border-b border-slate-400 mb-1"></div>
              <p className="font-semibold text-slate-700">Firma & Sello</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
