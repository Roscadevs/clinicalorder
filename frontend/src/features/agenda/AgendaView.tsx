import React, { useState, useEffect } from 'react'; // React hooks
import { appointmentsApi } from '../../services/api'; // API appointments
import { Appointment, AppointmentStatus } from '../../types'; // Types
import { Calendar as CalendarIcon, DollarSign, XCircle, Clock, Printer, Bell, LayoutGrid, List, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'; // Icons
import { AppointmentReceiptModal } from '../documents/AppointmentReceiptModal'; // Modal de comprobante
import { ReminderNotificationModal } from '../reminders/ReminderNotificationModal'; // Modal de recordatorio

interface CalendarEventItem {
  id: number;
  patientId: number;
  patientName: string;
  patientDni: string;
  patientPhone: string;
  serviceName: string;
  dateStr: string; // YYYY-MM-DD
  timeStr: string; // HH:mm
  durationMinutes: number;
  status: AppointmentStatus;
  agreedPrice: number;
  depositAmount: number;
}

export const AgendaView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'calendar' | 'table'>('calendar'); // Vista activa por defecto: Calendario
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-25');
  const [selectedMobileDay, setSelectedMobileDay] = useState<string>('2026-08-25');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod] = useState<'FINAL_BALANCE_50' | 'FULL_PAYMENT'>('FINAL_BALANCE_50');

  // Turnos confirmados de la semana en la clínica
  const weekAppointments: CalendarEventItem[] = [
    {
      id: 101,
      patientId: 1,
      patientName: 'Lucía Fernández',
      patientDni: '38456123',
      patientPhone: '+54 9 11 1234-5678',
      serviceName: 'Peeling Químico Facial (Mandélico + Retinol)',
      dateStr: '2026-08-25',
      timeStr: '15:00',
      durationMinutes: 45,
      status: 'CONFIRMED',
      agreedPrice: 42000,
      depositAmount: 21000,
    },
    {
      id: 102,
      patientId: 2,
      patientName: 'Camila Rossi',
      patientDni: '40123987',
      patientPhone: '+54 9 11 8765-4321',
      serviceName: 'Toxina Botulínica (Frente y Patas de Gallo)',
      dateStr: '2026-08-25',
      timeStr: '16:30',
      durationMinutes: 45,
      status: 'CONFIRMED',
      agreedPrice: 65000,
      depositAmount: 32500,
    },
    {
      id: 103,
      patientId: 3,
      patientName: 'Mariana Díaz',
      patientDni: '36987452',
      patientPhone: '+54 9 11 5555-1234',
      serviceName: 'Relleno con Ácido Hialurónico en Labios',
      dateStr: '2026-08-26',
      timeStr: '10:00',
      durationMinutes: 60,
      status: 'CONFIRMED',
      agreedPrice: 75000,
      depositAmount: 37500,
    },
    {
      id: 104,
      patientId: 4,
      patientName: 'Sofía Álvarez',
      patientDni: '39874125',
      patientPhone: '+54 9 11 9999-8888',
      serviceName: 'Limpieza Facial Profunda + Hidrodermoabrasión',
      dateStr: '2026-08-26',
      timeStr: '14:00',
      durationMinutes: 60,
      status: 'COMPLETED',
      agreedPrice: 28000,
      depositAmount: 14000,
    },
    {
      id: 105,
      patientId: 5,
      patientName: 'Valentina Morales',
      patientDni: '41258963',
      patientPhone: '+54 9 11 3333-7777',
      serviceName: 'Bioestimulador de Colágeno (Radiesse)',
      dateStr: '2026-08-27',
      timeStr: '11:30',
      durationMinutes: 60,
      status: 'CONFIRMED',
      agreedPrice: 180000,
      depositAmount: 90000,
    },
    {
      id: 106,
      patientId: 6,
      patientName: 'Julieta Benítez',
      patientDni: '37412589',
      patientPhone: '+54 9 11 4444-2222',
      serviceName: 'Consulta Dermatoscopía y Control de Lunares',
      dateStr: '2026-08-27',
      timeStr: '16:00',
      durationMinutes: 30,
      status: 'PENDING_PAYMENT',
      agreedPrice: 25000,
      depositAmount: 12500,
    },
  ];

  const weekDays = [
    { name: 'Lun', fullName: 'Lunes', dateStr: '2026-08-24', dayNum: '24' },
    { name: 'Mar', fullName: 'Martes', dateStr: '2026-08-25', dayNum: '25' },
    { name: 'Mié', fullName: 'Miércoles', dateStr: '2026-08-26', dayNum: '26' },
    { name: 'Jue', fullName: 'Jueves', dateStr: '2026-08-27', dayNum: '27' },
    { name: 'Vie', fullName: 'Viernes', dateStr: '2026-08-28', dayNum: '28' },
    { name: 'Sáb', fullName: 'Sábado', dateStr: '2026-08-29', dayNum: '29' },
  ];

  const timeSlots = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
  ];

  const fetchAgenda = () => {
    const startIso = new Date(`${selectedDate}T00:00:00Z`).toISOString();
    const endIso = new Date(`${selectedDate}T23:59:59Z`).toISOString();
    appointmentsApi.getAgenda(startIso, endIso).then(setAppointments).catch(console.error);
  };

  useEffect(() => {
    fetchAgenda();
  }, [selectedDate]);

  const handleCancel = async (id: number) => {
    if (confirm('¿Desea cancelar este turno? La franja horaria quedará libre.')) {
      await appointmentsApi.cancelAppointment(id);
      fetchAgenda();
    }
  };

  const handleOpenPayment = (appt: Appointment) => {
    setSelectedAppointment(appt);
    setPaymentAmount(appt.agreedPrice * 0.5); // Saldo restante 50%
    setPaymentModalOpen(true);
  };

  const handleOpenReceipt = (appt: Appointment) => {
    setActiveAppointment(appt);
    setReceiptModalOpen(true);
  };

  const handleOpenReminder = (appt: Appointment) => {
    setActiveAppointment(appt);
    setReminderModalOpen(true);
  };

  const handleFinalizePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;
    try {
      await appointmentsApi.finalizePayment(selectedAppointment.id, paymentAmount, paymentMethod, 3); // 3 = Sofía Secretaria
      setPaymentModalOpen(false);
      fetchAgenda();
    } catch (err) {
      alert('Error al registrar cobro en mostrador.');
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">🟢 Confirmado (Seña Paga)</span>;
      case 'PENDING_PAYMENT':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">🟠 Bloqueo Temporal (10m)</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">🔵 Finalizado</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">Cancelado</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">Pago Fallido</span>;
    }
  };

  const mobileSelectedAppointments = weekAppointments.filter((a) => a.dateStr === selectedMobileDay);

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-5">
      {/* Encabezado y Conmutador de Vistas */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm gap-3.5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-teal-600/20 flex-shrink-0">
            <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
              <span>Agenda & Calendario de Turnos</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase">
                Señas 50% Activas
              </span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Visualización de citas, confirmación online, comprobantes y cobros en mostrador
            </p>
          </div>
        </div>

        {/* Conmutador de Vistas y Selector de Fecha */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 border border-slate-200">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1 ${
                viewMode === 'calendar' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Calendario</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1 ${
                viewMode === 'table' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Lista</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedMobileDay(e.target.value);
              }}
              className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Indicadores Clave de Turnos Confirmados */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between col-span-1">
          <div>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 block">Confirmados (Seña 50%)</span>
            <span className="text-base sm:text-xl font-extrabold text-emerald-600">4 Pacientes</span>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between col-span-1">
          <div>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 block">Señas Online MP</span>
            <span className="text-base sm:text-xl font-extrabold text-slate-900">$181.000 ARS</span>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            💳
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 block">Saldo Restante en Mostrador</span>
            <span className="text-base sm:text-xl font-extrabold text-teal-700">$181.000 ARS</span>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VISTA 1: CALENDARIO SEMANAL INTERACTIVO (RESPONSIVE: MOBILE & DESKTOP)   */}
      {/* ========================================================================= */}
      {viewMode === 'calendar' && (
        <div className="space-y-4">
          {/* --- MODO CELULAR: SELECTOR HORIZONTAL DE DÍAS (DAY PILLS) + TARJETAS --- */}
          <div className="sm:hidden space-y-3">
            {/* Carrusel Deslizable de Días con Toque */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              {weekDays.map((d) => (
                <button
                  key={d.dateStr}
                  onClick={() => setSelectedMobileDay(d.dateStr)}
                  className={`flex-shrink-0 flex flex-col items-center justify-center min-w-[58px] py-2 px-1.5 rounded-2xl border transition-all ${
                    selectedMobileDay === d.dateStr
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-500/20'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase">{d.name}</span>
                  <span className="text-sm font-extrabold">{d.dayNum}</span>
                </button>
              ))}
            </div>

            {/* Lista de Turnos Confirmados del Día Seleccionado en Celular */}
            <div className="space-y-2.5">
              {mobileSelectedAppointments.length === 0 ? (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                  No hay turnos agendados para este día.
                </div>
              ) : (
                mobileSelectedAppointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-extrabold text-slate-900 text-sm block">{appt.patientName}</span>
                        <span className="text-[11px] text-slate-500">DNI: {appt.patientDni} · {appt.patientPhone}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg inline-block">
                          ⏰ {appt.timeStr} hs
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1 border border-slate-100">
                      <p className="font-semibold text-slate-800">{appt.serviceName}</p>
                      <div className="flex justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                        <span className="font-bold text-emerald-700">Seña Online (50%): ${appt.depositAmount.toLocaleString()} ARS ✓</span>
                        <span className="font-extrabold text-slate-900">${appt.agreedPrice.toLocaleString()} ARS</span>
                      </div>
                    </div>

                    {/* Botones Táctiles para Móvil (Mínimo 44px de alto) */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {appt.status === 'CONFIRMED' && (
                        <button
                          onClick={() => {
                            const a: Appointment = {
                              id: appt.id,
                              patientId: appt.patientId,
                              patientName: appt.patientName,
                              patientDni: appt.patientDni,
                              patientPhone: appt.patientPhone,
                              serviceId: 1,
                              serviceName: appt.serviceName,
                              startTime: `${appt.dateStr}T${appt.timeStr}:00Z`,
                              endTime: `${appt.dateStr}T${appt.timeStr}:00Z`,
                              status: appt.status,
                              agreedPrice: appt.agreedPrice,
                              rescheduleCount: 0,
                              version: 1,
                            };
                            handleOpenPayment(a);
                          }}
                          className="min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>Cobrar</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          const a: Appointment = {
                            id: appt.id,
                            patientId: appt.patientId,
                            patientName: appt.patientName,
                            patientDni: appt.patientDni,
                            patientPhone: appt.patientPhone,
                            serviceId: 1,
                            serviceName: appt.serviceName,
                            startTime: `${appt.dateStr}T${appt.timeStr}:00Z`,
                            endTime: `${appt.dateStr}T${appt.timeStr}:00Z`,
                            status: appt.status,
                            agreedPrice: appt.agreedPrice,
                            rescheduleCount: 0,
                            version: 1,
                          };
                          handleOpenReminder(a);
                        }}
                        className="min-h-[44px] bg-amber-50 text-amber-900 border border-amber-200 font-bold text-xs rounded-xl flex items-center justify-center space-x-1"
                      >
                        <Bell className="w-3.5 h-3.5 text-amber-600" />
                        <span>Aviso</span>
                      </button>

                      <button
                        onClick={() => {
                          const a: Appointment = {
                            id: appt.id,
                            patientId: appt.patientId,
                            patientName: appt.patientName,
                            patientDni: appt.patientDni,
                            patientPhone: appt.patientPhone,
                            serviceId: 1,
                            serviceName: appt.serviceName,
                            startTime: `${appt.dateStr}T${appt.timeStr}:00Z`,
                            endTime: `${appt.dateStr}T${appt.timeStr}:00Z`,
                            status: appt.status,
                            agreedPrice: appt.agreedPrice,
                            rescheduleCount: 0,
                            version: 1,
                          };
                          handleOpenReceipt(a);
                        }}
                        className="min-h-[44px] bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl flex items-center justify-center space-x-1"
                      >
                        <Printer className="w-3.5 h-3.5 text-teal-600" />
                        <span>Recibo</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* --- MODO ESCRITORIO: GRILLA SEMANAL DE 7 COLUMNAS --- */}
          <div className="hidden sm:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Barra de Control de la Semana */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/60">
              <div className="flex items-center space-x-2">
                <button className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold text-slate-800">Semana del 24 al 29 de Agosto, 2026</span>
                <button className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <span className="flex items-center space-x-1 font-semibold text-emerald-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                  <span>Confirmado (Seña Paga)</span>
                </span>
                <span className="flex items-center space-x-1 font-semibold text-blue-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                  <span>Atendido</span>
                </span>
                <span className="flex items-center space-x-1 font-semibold text-amber-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                  <span>Retención 10 min</span>
                </span>
              </div>
            </div>

            {/* Grilla Semanal */}
            <div className="overflow-x-auto">
              <div className="min-w-[850px]">
                {/* Encabezado de Días */}
                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-100/70 text-slate-700 font-bold text-xs">
                  <div className="p-3 text-center border-r border-slate-200 text-slate-400">Horario</div>
                  {weekDays.map((d) => (
                    <div
                      key={d.dateStr}
                      className={`p-3 text-center border-r border-slate-200 last:border-r-0 ${
                        d.dateStr === '2026-08-25' ? 'bg-teal-50/80 text-teal-900 font-extrabold' : ''
                      }`}
                    >
                      <div>{d.fullName}</div>
                      <span className="text-sm font-extrabold text-slate-900">{d.dayNum}</span>
                    </div>
                  ))}
                </div>

                {/* Filas Horarias */}
                <div className="divide-y divide-slate-100">
                  {timeSlots.map((slot) => (
                    <div key={slot} className="grid grid-cols-7 min-h-[85px]">
                      {/* Columna Horario */}
                      <div className="p-2.5 text-center text-xs font-bold text-slate-400 border-r border-slate-100 flex items-center justify-center bg-slate-50/30">
                        <Clock className="w-3.5 h-3.5 mr-1 text-teal-600" />
                        <span>{slot} hs</span>
                      </div>

                      {/* Columnas de los Días */}
                      {weekDays.map((day) => {
                        const slotAppts = weekAppointments.filter(
                          (a) => a.dateStr === day.dateStr && a.timeStr.startsWith(slot.substring(0, 2))
                        );

                        return (
                          <div
                            key={day.dateStr}
                            className={`p-1.5 border-r border-slate-100 last:border-r-0 relative ${
                              day.dateStr === '2026-08-25' ? 'bg-teal-50/20' : ''
                            }`}
                          >
                            {slotAppts.map((appt) => {
                              const isConfirmed = appt.status === 'CONFIRMED';
                              const isCompleted = appt.status === 'COMPLETED';

                              const cardBg = isConfirmed
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950 hover:bg-emerald-100/90 shadow-sm'
                                : isCompleted
                                ? 'bg-blue-50 border-blue-300 text-blue-950 hover:bg-blue-100/90 shadow-sm'
                                : 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100/90 shadow-sm';

                              return (
                                <div
                                  key={appt.id}
                                  onClick={() => {
                                    const adaptedAppt: Appointment = {
                                      id: appt.id,
                                      patientId: appt.patientId,
                                      patientName: appt.patientName,
                                      patientDni: appt.patientDni,
                                      patientPhone: appt.patientPhone,
                                      serviceId: 1,
                                      serviceName: appt.serviceName,
                                      startTime: `${appt.dateStr}T${appt.timeStr}:00Z`,
                                      endTime: `${appt.dateStr}T${appt.timeStr}:00Z`,
                                      status: appt.status,
                                      agreedPrice: appt.agreedPrice,
                                      rescheduleCount: 0,
                                      version: 1,
                                    };
                                    setActiveAppointment(adaptedAppt);
                                  }}
                                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${cardBg} space-y-1.5`}
                                >
                                  <div className="flex justify-between items-start">
                                    <span className="font-extrabold truncate block max-w-[95px] text-slate-900">
                                      {appt.patientName}
                                    </span>
                                    <span className="text-[10px] font-extrabold bg-white/80 px-1.5 py-0.5 rounded shadow-xs">
                                      {appt.timeStr}
                                    </span>
                                  </div>
                                  <p className="text-[11px] line-clamp-1 font-medium text-slate-700">
                                    {appt.serviceName}
                                  </p>
                                  <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200/70">
                                    <span className="font-extrabold text-emerald-700">Seña: 50% ✓</span>
                                    <span className="font-extrabold text-slate-900">${appt.agreedPrice.toLocaleString()}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 2: LISTA / TABLA OPERATIVA DE RECEPCIÓN */}
      {/* ========================================================================= */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Horario</th>
                  <th className="p-3.5">Paciente</th>
                  <th className="p-3.5">Tratamiento</th>
                  <th className="p-3.5">Estado</th>
                  <th className="p-3.5 text-right">Precio / Saldo</th>
                  <th className="p-3.5 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No hay turnos registrados para la fecha seleccionada.
                    </td>
                  </tr>
                ) : (
                  appointments.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-bold text-slate-800 flex items-center space-x-1.5">
                        <Clock className="w-4 h-4 text-teal-600" />
                        <span>{new Date(a.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hs</span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900">{a.patientName}</div>
                        <div className="text-[11px] text-slate-500">DNI: {a.patientDni} · Tel: {a.patientPhone}</div>
                      </td>
                      <td className="p-3.5 font-medium text-slate-700">{a.serviceName}</td>
                      <td className="p-3.5">{getStatusBadge(a.status)}</td>
                      <td className="p-3.5 text-right">
                        <div className="font-bold text-slate-900">${a.agreedPrice.toLocaleString()} ARS</div>
                        <div className="text-[11px] text-teal-600 font-semibold">
                          {a.status === 'CONFIRMED' ? 'Saldo pendiente en recepción: 50%' : ''}
                        </div>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => handleOpenReminder(a)}
                            className="p-1.5 text-slate-600 hover:text-teal-600 hover:bg-slate-100 rounded-lg"
                            title="Enviar Recordatorio & Calendario"
                          >
                            <Bell className="w-4 h-4 text-amber-600" />
                          </button>

                          <button
                            onClick={() => handleOpenReceipt(a)}
                            className="p-1.5 text-slate-600 hover:text-teal-600 hover:bg-slate-100 rounded-lg"
                            title="Imprimir Comprobante Oficial"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {a.status === 'CONFIRMED' && (
                            <button
                              onClick={() => handleOpenPayment(a)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 py-1 rounded-lg text-xs flex items-center space-x-1"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                              <span>Cobrar</span>
                            </button>
                          )}
                          {a.status !== 'COMPLETED' && a.status !== 'CANCELLED' && (
                            <button
                              onClick={() => handleCancel(a.id)}
                              className="text-rose-600 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50"
                              title="Cancelar Turno"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal / Bottom Sheet Rápido de Gestión para Turnos Seleccionados en el Calendario */}
      {activeAppointment && !receiptModalOpen && !reminderModalOpen && !paymentModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-md w-full p-5 sm:p-6 space-y-4 max-h-[90dvh] overflow-y-auto">
            {/* Tirador táctil en móvil */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto sm:hidden"></div>

            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">
                  Detalle del Turno #{activeAppointment.id}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">{activeAppointment.patientName}</h3>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  DNI: {activeAppointment.patientDni} · Tel: {activeAppointment.patientPhone}
                </p>
              </div>
              <div>{getStatusBadge(activeAppointment.status)}</div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Tratamiento:</span>
                <span className="font-bold text-slate-800">{activeAppointment.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fecha y Hora:</span>
                <span className="font-bold text-teal-700">
                  {new Date(activeAppointment.startTime).toLocaleDateString('es-AR', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })}{' '}
                  a las{' '}
                  {new Date(activeAppointment.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  hs
                </span>
              </div>
              <div className="flex justify-between text-emerald-800 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200 font-bold">
                <span>Seña 50% Acreditada Online:</span>
                <span>${(activeAppointment.agreedPrice * 0.5).toLocaleString()} ARS</span>
              </div>
              <div className="flex justify-between font-bold pt-1 text-slate-800">
                <span>Saldo Pendiente en Mostrador:</span>
                <span className="text-teal-600">${(activeAppointment.agreedPrice * 0.5).toLocaleString()} ARS</span>
              </div>
            </div>

            {/* Acciones Rápidas Táctiles (Mínimo 44px de alto para dedos) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {activeAppointment.status === 'CONFIRMED' && (
                <button
                  onClick={() => {
                    handleOpenPayment(activeAppointment);
                  }}
                  className="min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Cobrar Saldo (50%)</span>
                </button>
              )}

              <button
                onClick={() => setReminderModalOpen(true)}
                className="min-h-[44px] bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5"
              >
                <Bell className="w-4 h-4 text-amber-600" />
                <span>Enviar Recordatorio</span>
              </button>

              <button
                onClick={() => setReceiptModalOpen(true)}
                className="min-h-[44px] bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5"
              >
                <Printer className="w-4 h-4 text-teal-600" />
                <span>Comprobante Oficial</span>
              </button>

              <button
                onClick={() => setActiveAppointment(null)}
                className="min-h-[44px] bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 font-bold text-xs rounded-xl flex items-center justify-center"
              >
                <span>Cerrar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal / Bottom Sheet de Cobro de Saldo en Mostrador */}
      {paymentModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form onSubmit={handleFinalizePayment} className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-md w-full p-5 sm:p-6 space-y-4 max-h-[90dvh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto sm:hidden"></div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Registrar Cobro de Saldo Final</h3>
            <p className="text-xs text-slate-500">
              Turno #{selectedAppointment.id} · Paciente: {selectedAppointment.patientName}
            </p>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span>Precio Total Acordado:</span>
                <span className="font-bold">${selectedAppointment.agreedPrice.toLocaleString()} ARS</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Seña Abonada (50%):</span>
                <span>-${(selectedAppointment.agreedPrice * 0.5).toLocaleString()} ARS</span>
              </div>
              <div className="flex justify-between font-extrabold text-slate-900 border-t border-slate-200 pt-1.5 text-sm">
                <span>Saldo Restante a Cobrar:</span>
                <span className="text-teal-600">${paymentAmount.toLocaleString()} ARS</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Monto a Liquidar *</label>
              <input
                type="number"
                required
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-bold focus:ring-2 focus:ring-teal-500 outline-none min-h-[44px]"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setPaymentModalOpen(false)}
                className="px-4 py-2.5 text-xs sm:text-sm text-slate-600 font-semibold hover:bg-slate-100 rounded-xl min-h-[44px]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-sm min-h-[44px]"
              >
                Confirmar Cobro
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal de Comprobante Imprimible */}
      {receiptModalOpen && activeAppointment && (
        <AppointmentReceiptModal
          isOpen={receiptModalOpen}
          onClose={() => {
            setReceiptModalOpen(false);
            setActiveAppointment(null);
          }}
          appointmentData={{
            id: activeAppointment.id,
            patientName: activeAppointment.patientName,
            patientDni: activeAppointment.patientDni,
            patientEmail: 'paciente@example.com',
            patientPhone: activeAppointment.patientPhone,
            serviceName: activeAppointment.serviceName,
            startTime: activeAppointment.startTime,
            durationMinutes: 45,
            agreedPrice: activeAppointment.agreedPrice,
            depositAmount: activeAppointment.agreedPrice * 0.5,
          }}
        />
      )}

      {/* Modal de Recordatorio y Sincronización */}
      {reminderModalOpen && activeAppointment && (
        <ReminderNotificationModal
          isOpen={reminderModalOpen}
          onClose={() => {
            setReminderModalOpen(false);
            setActiveAppointment(null);
          }}
          appointmentData={{
            id: activeAppointment.id,
            patientName: activeAppointment.patientName,
            patientPhone: activeAppointment.patientPhone,
            serviceName: activeAppointment.serviceName,
            startTime: activeAppointment.startTime,
            durationMinutes: 45,
            depositAmount: activeAppointment.agreedPrice * 0.5,
            agreedPrice: activeAppointment.agreedPrice,
          }}
        />
      )}
    </div>
  );
};
