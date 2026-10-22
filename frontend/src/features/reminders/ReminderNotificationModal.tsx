import React, { useState } from 'react'; // React hooks
import { Bell, Calendar, Smartphone, X, CheckCircle, ExternalLink, Download } from 'lucide-react'; // Iconos
import { generateGoogleCalendarUrl, downloadIcsCalendarFile } from '../../utils/calendarGenerator'; // Utilidades
import { CLINIC } from '../../config/contact';

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

/**
 * Modal y Bottom Sheet táctil de Recordatorios y Sincronización de Calendarios.
 */
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
    location: CLINIC.address || `Consultorio ${CLINIC.doctorName}`,
    startTime: appointmentData.startTime,
    durationMinutes: appointmentData.durationMinutes,
  };

  const googleUrl = generateGoogleCalendarUrl(calendarEvent);

  const handleDownloadIcs = () => {
    downloadIcsCalendarFile(calendarEvent);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 relative max-h-[92dvh] overflow-y-auto">
        {/* Tirador táctil en celular */}
        <div className="w-12 h-1.5 bg-sand-300 rounded-full mx-auto sm:hidden"></div>

        {/* Encabezado */}
        <div className="flex justify-between items-center border-b border-sand-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold flex-shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-sand-900">Recordatorio & Sincronización</h3>
              <p className="text-[10px] sm:text-[11px] text-sand-500">Aviso multicanal programado (24h antes)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-sand-400 hover:text-sand-600 p-2 rounded-xl hover:bg-sand-100 min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Simulación de Notificación Push / WhatsApp */}
        <div className="bg-sand-900 text-white rounded-2xl p-4 space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-[11px] text-sand-400 border-b border-sand-700 pb-2">
            <span className="flex items-center space-x-1 font-bold text-primary-300">
              <Smartphone className="w-3.5 h-3.5 mr-1" /> WhatsApp / Push Oficial
            </span>
            <span>Hace instantes</span>
          </div>

          <div className="text-xs space-y-2 text-sand-200 leading-relaxed">
            <p>
              ¡Hola <strong>{appointmentData.patientName}</strong>! 🌿 Te recordamos tu cita de{' '}
              <strong>{appointmentData.serviceName}</strong> con la {CLINIC.doctorName} para el:{' '}
              <span className="text-primary-200 font-bold">
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
            <p className="text-[11px] text-sand-400">
              {CLINIC.address && <>📍 {CLINIC.address}. </>}Recordá asistir sin maquillaje y con 10 min de anticipación.
            </p>
          </div>

          {confirmed ? (
            <div className="bg-success-500/20 border border-success-500/40 text-success-100 text-xs p-2.5 rounded-xl flex items-center justify-center space-x-1.5 font-bold">
              <CheckCircle className="w-4 h-4 text-success-100" />
              <span>¡Asistencia Confirmada por la Paciente!</span>
            </div>
          ) : (
            <button
              onClick={() => setConfirmed(true)}
              className="w-full bg-success-600 hover:bg-success-700 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center space-x-1.5 transition-colors shadow min-h-[44px]"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Simular Confirmación de Asistencia</span>
            </button>
          )}
        </div>

        {/* Opciones de Sincronización con el Calendario Personal */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-sand-500 flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1 text-primary-600" /> Agendar en tu Calendario Personal
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {/* Opción 1: Google Calendar */}
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl border border-sand-200 hover:border-primary-500 bg-sand-50 hover:bg-primary-50/50 transition-colors text-xs group min-h-[48px]"
            >
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-white border border-sand-200 flex items-center justify-center font-bold text-danger-500 text-xs shadow-sm">
                  G
                </div>
                <span className="font-bold text-sand-800 group-hover:text-primary-900">Google Calendar</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-sand-400 group-hover:text-primary-600" />
            </a>

            {/* Opción 2: Apple Calendar / Outlook (.ics) */}
            <button
              onClick={handleDownloadIcs}
              className="flex items-center justify-between p-3 rounded-xl border border-sand-200 hover:border-primary-500 bg-sand-50 hover:bg-primary-50/50 transition-colors text-xs group text-left min-h-[48px]"
            >
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-white border border-sand-200 flex items-center justify-center font-bold text-info-600 text-xs shadow-sm">
                  📅
                </div>
                <div>
                  <span className="font-bold text-sand-800 group-hover:text-primary-900 block leading-tight">
                    Apple / Outlook
                  </span>
                  <span className="text-[10px] text-sand-400">Descargar .ics con alarmas</span>
                </div>
              </div>
              <Download className="w-3.5 h-3.5 text-sand-400 group-hover:text-primary-600" />
            </button>
          </div>
        </div>

        <div className="text-[11px] text-sand-400 bg-sand-50 p-2.5 rounded-xl border border-sand-200 text-center">
          ⏰ Al sincronizar, se configuran automáticamente alertas de aviso 24 hs y 2 hs antes del turno.
        </div>
      </div>
    </div>
  );
};
