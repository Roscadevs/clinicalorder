import React, { useState } from 'react'; // React hooks
import { Bell, Calendar, Smartphone, X, CheckCircle, ExternalLink, Download } from 'lucide-react'; // Iconos
import { generateGoogleCalendarUrl, downloadIcsCalendarFile } from '../../utils/calendarGenerator'; // Utilidades

interface ReminderNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentData: {
    id: number;
    patientName: string;
    patientPhone: string;
    serviceName: string;
    startTime: string;
    durationMinutes: number;
    depositAmount: number;
    agreedPrice: number;
  };
}

export const ReminderNotificationModal: React.FC<ReminderNotificationModalProps> = ({
  isOpen,
  onClose,
  appointmentData,
}) => {
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const calendarEvent = {
    id: appointmentData.id,
    title: appointmentData.serviceName,
    description: `Turno de ${appointmentData.serviceName} para ${appointmentData.patientName}. Seña abonada: $${appointmentData.depositAmount.toLocaleString()} ARS. Saldo restante a abonar en mostrador: $${(appointmentData.agreedPrice - appointmentData.depositAmount).toLocaleString()} ARS.`,
    location: 'Consultorio Dra. Valeria Gómez, Av. Santa Fe 2450, Piso 4, CABA',
    startTime: appointmentData.startTime,
    durationMinutes: appointmentData.durationMinutes,
  };

  const googleUrl = generateGoogleCalendarUrl(calendarEvent);

  const handleDownloadIcs = () => {
    downloadIcsCalendarFile(calendarEvent);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 relative">
        {/* Encabezado */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recordatorio & Sincronización de Calendario</h3>
              <p className="text-[11px] text-slate-500">Notificación automática programada (24h antes)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Simulación de Notificación Push / WhatsApp */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
            <span className="flex items-center space-x-1 font-bold text-teal-400">
              <Smartphone className="w-3.5 h-3.5 mr-1" /> WhatsApp / Push Oficial
            </span>
            <span>Hace instantes</span>
          </div>

          <div className="text-xs space-y-2 text-slate-200 leading-relaxed">
            <p>
              ¡Hola <strong>{appointmentData.patientName}</strong>! 🌿 Te recordamos tu cita de{' '}
              <strong>{appointmentData.serviceName}</strong> con la Dra. Valeria Gómez para el:{' '}
              <span className="text-teal-300 font-bold">
                {new Date(appointmentData.startTime).toLocaleDateString('es-AR', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}{' '}
                a las{' '}
                {new Date(appointmentData.startTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                hs
              </span>
              .
            </p>
            <p className="text-[11px] text-slate-400">
              📍 Av. Santa Fe 2450, Piso 4, CABA. Recuerda asistir sin maquillaje y con 10 min de anticipación.
            </p>
          </div>

          {confirmed ? (
            <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs p-2.5 rounded-xl flex items-center justify-center space-x-1.5 font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>¡Asistencia Confirmada por la Paciente!</span>
            </div>
          ) : (
            <button
              onClick={() => setConfirmed(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center space-x-1.5 transition-colors shadow"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Simular Confirmación de Asistencia</span>
            </button>
          )}
        </div>

        {/* Opciones de Sincronización con el Calendario Personal */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1 text-teal-600" /> Agendar en tu Calendario Personal
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {/* Opción 1: Google Calendar */}
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-teal-500 bg-slate-50 hover:bg-teal-50/50 transition-colors text-xs group"
            >
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-red-500 text-xs shadow-sm">
                  G
                </div>
                <span className="font-bold text-slate-800 group-hover:text-teal-900">Google Calendar</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600" />
            </a>

            {/* Opción 2: Apple Calendar / Outlook (.ics) */}
            <button
              onClick={handleDownloadIcs}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-teal-500 bg-slate-50 hover:bg-teal-50/50 transition-colors text-xs group text-left"
            >
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-blue-600 text-xs shadow-sm">
                  📅
                </div>
                <div>
                  <span className="font-bold text-slate-800 group-hover:text-teal-900 block leading-tight">
                    Apple / Outlook
                  </span>
                  <span className="text-[10px] text-slate-400">Descargar .ics con alarmas</span>
                </div>
              </div>
              <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600" />
            </button>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
          ⏰ Al sincronizar, se configuran automáticamente alertas de aviso 24 hs y 2 hs antes del turno.
        </div>
      </div>
    </div>
  );
};
