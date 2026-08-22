import React, { useState } from 'react'; // React hooks
import { Calendar as CalendarIcon, Clock, User, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, FileText, Sparkles, Filter } from 'lucide-react'; // Iconos

interface AppointmentItem {
  id: number;
  patientId: number;
  patientName: string;
  patientDni: string;
  patientPhone: string;
  serviceName: string;
  dateStr: string; // YYYY-MM-DD
  timeStr: string; // HH:mm
  durationMinutes: number;
  status: 'CONFIRMED' | 'COMPLETED' | 'PENDING_PAYMENT' | 'CANCELLED';
  agreedPrice: number;
  depositAmount: number;
  phototype: 'II' | 'III' | 'IV';
  allergies: string;
}

interface PhysicianCalendarViewProps {
  onSelectPatient: (patientId: number) => void;
  onOpenPhotos: (patientId: number) => void;
  onOpenConsent: (patientId: number) => void;
}

export const PhysicianCalendarView: React.FC<PhysicianCalendarViewProps> = ({
  onSelectPatient,
  onOpenPhotos,
  onOpenConsent,
}) => {
  const [viewMode, setViewMode] = useState<'week' | 'day' | 'month'>('week');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentItem | null>(null);

  // Mock de citas médicas de la semana para la Dra. Valeria Gómez
  const mockAppointments: AppointmentItem[] = [
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
      phototype: 'III',
      allergies: 'Alergia a anestésicos locales (Lidocaína)',
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
      phototype: 'II',
      allergies: 'Sin alergias conocidas',
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
      phototype: 'III',
      allergies: 'Alergia al látex',
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
      phototype: 'II',
      allergies: 'Sin alergias',
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
      phototype: 'IV',
      allergies: 'Sin alergias',
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
      phototype: 'II',
      allergies: 'Sin alergias',
    },
  ];

  const weekDays = [
    { name: 'Lunes', dateStr: '2026-08-24', dayNum: '24' },
    { name: 'Martes', dateStr: '2026-08-25', dayNum: '25' },
    { name: 'Miércoles', dateStr: '2026-08-26', dayNum: '26' },
    { name: 'Jueves', dateStr: '2026-08-27', dayNum: '27' },
    { name: 'Viernes', dateStr: '2026-08-28', dayNum: '28' },
    { name: 'Sábado', dateStr: '2026-08-29', dayNum: '29' },
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

  const filteredAppointments = mockAppointments.filter((a) => {
    if (selectedStatusFilter === 'ALL') return true;
    return a.status === selectedStatusFilter;
  });

  const getStatusColor = (status: AppointmentItem['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100';
      case 'COMPLETED':
        return 'bg-blue-50 border-blue-300 text-blue-900 hover:bg-blue-100';
      case 'PENDING_PAYMENT':
        return 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100';
      default:
        return 'bg-slate-50 border-slate-300 text-slate-700';
    }
  };

  const getStatusLabel = (status: AppointmentItem['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return '🟢 Confirmado (Seña 50%)';
      case 'COMPLETED':
        return '🔵 Atendido / Finalizado';
      case 'PENDING_PAYMENT':
        return '🟠 Bloqueo Temporal (10m)';
      default:
        return 'Cancelado';
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado y Métricas de la Agenda Médica */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-teal-600/20">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Calendario Médico & Turnos · Dra. Valeria Gómez
              <span className="bg-teal-100 text-teal-800 text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase">
                Semana 35 / 2026
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Vista gráfica de pacientes agendados con acceso directo a historia clínica 1:1 y fotografías
            </p>
          </div>
        </div>

        {/* Controles de Vista y Filtros */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Selector de Modo */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 border border-slate-200">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                viewMode === 'week' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semanal
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                viewMode === 'day' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Diario
            </button>
          </div>

          {/* Filtro por Estado */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-transparent text-slate-700 font-bold outline-none cursor-pointer"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="CONFIRMED">Solo Confirmados (Seña Paga)</option>
              <option value="COMPLETED">Solo Atendidos</option>
              <option value="PENDING_PAYMENT">Solo Bloqueos Temporales</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resumen Rápido de Indicadores del Día */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Citas Programadas (Semana)</span>
            <span className="text-xl font-extrabold text-slate-900">6 Pacientes</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            🌿
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Señas Acreditadas (Online)</span>
            <span className="text-xl font-extrabold text-emerald-600">$212.500 ARS</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            ✓
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Tasa de Asistencia Confirmada</span>
            <span className="text-xl font-extrabold text-teal-700">95.8%</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            📊
          </div>
        </div>
      </div>

      {/* --- GRILLA DEL CALENDARIO SEMANAL MÉDICO --- */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Barra de Navegación de la Semana */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <button className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-slate-800">24 de Agosto – 29 de Agosto, 2026</span>
            <button className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs text-slate-500 font-medium">Horario de Consultorio: 09:00 a 19:00 hs</span>
        </div>

        {/* Grilla Semanal */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Cabecera de Días */}
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-100/70 text-slate-700 font-bold text-xs">
              <div className="p-3 text-center border-r border-slate-200 text-slate-400">Horario</div>
              {weekDays.map((d) => (
                <div
                  key={d.dateStr}
                  className={`p-3 text-center border-r border-slate-200 last:border-r-0 ${
                    d.dateStr === '2026-08-25' ? 'bg-teal-50/80 text-teal-900 font-extrabold' : ''
                  }`}
                >
                  <div>{d.name}</div>
                  <span className="text-sm font-extrabold text-slate-900">{d.dayNum}</span>
                </div>
              ))}
            </div>

            {/* Filas de Franjas Horarias */}
            <div className="divide-y divide-slate-100">
              {timeSlots.map((slot) => (
                <div key={slot} className="grid grid-cols-7 min-h-[75px]">
                  {/* Columna Horario */}
                  <div className="p-2.5 text-center text-xs font-bold text-slate-400 border-r border-slate-100 flex items-center justify-center bg-slate-50/30">
                    <Clock className="w-3.5 h-3.5 mr-1 text-teal-600" />
                    <span>{slot} hs</span>
                  </div>

                  {/* Columnas de los Días */}
                  {weekDays.map((day) => {
                    const slotAppts = filteredAppointments.filter(
                      (a) => a.dateStr === day.dateStr && a.timeStr.startsWith(slot.substring(0, 2))
                    );

                    return (
                      <div
                        key={day.dateStr}
                        className={`p-1.5 border-r border-slate-100 last:border-r-0 relative ${
                          day.dateStr === '2026-08-25' ? 'bg-teal-50/20' : ''
                        }`}
                      >
                        {slotAppts.map((appt) => (
                          <div
                            key={appt.id}
                            onClick={() => setSelectedAppointment(appt)}
                            className={`p-2 rounded-xl border text-xs cursor-pointer transition-all shadow-sm ${getStatusColor(
                              appt.status
                            )} space-y-1`}
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-extrabold text-slate-900 truncate block max-w-[90px]">
                                {appt.patientName}
                              </span>
                              <span className="text-[10px] font-bold opacity-80">{appt.timeStr}</span>
                            </div>
                            <p className="text-[11px] line-clamp-1 font-medium text-slate-700">{appt.serviceName}</p>
                            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200/60">
                              <span className="font-bold text-teal-800">Fitz: {appt.phototype}</span>
                              <span className="font-bold">${(appt.agreedPrice / 1000).toFixed(0)}k</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL DETALLE DE LA CITA & ACCIONES CLÍNICAS RÁPIDAS --- */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">
                  Detalle Clínico de Turno #{selectedAppointment.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{selectedAppointment.patientName}</h3>
                <p className="text-xs text-slate-500">
                  DNI: {selectedAppointment.patientDni} · Tel: {selectedAppointment.patientPhone}
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800">
                {getStatusLabel(selectedAppointment.status)}
              </span>
            </div>

            {/* Información del Tratamiento y Datos Médicos */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Tratamiento Indicado:</span>
                <span className="font-bold text-slate-800">{selectedAppointment.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fecha y Horario:</span>
                <span className="font-bold text-teal-700">
                  {selectedAppointment.dateStr} a las {selectedAppointment.timeStr} hs ({selectedAppointment.durationMinutes} min)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fototipo Cutáneo (Fitzpatrick):</span>
                <span className="font-bold text-slate-800">Fototipo {selectedAppointment.phototype}</span>
              </div>
              <div className="flex justify-between text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200 font-semibold">
                <span>Antecedentes / Alergias:</span>
                <span>{selectedAppointment.allergies}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold">
                <span>Arancel Acordado / Seña:</span>
                <span>
                  ${selectedAppointment.agreedPrice.toLocaleString()} ARS (Seña: $
                  {selectedAppointment.depositAmount.toLocaleString()} ARS)
                </span>
              </div>
            </div>

            {/* Acciones Médicas Directas */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Acciones Clínicas Directas
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onSelectPatient(selectedAppointment.patientId);
                    setSelectedAppointment(null);
                  }}
                  className="p-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Abrir Historia Clínica</span>
                </button>

                <button
                  onClick={() => {
                    onOpenPhotos(selectedAppointment.patientId);
                    setSelectedAppointment(null);
                  }}
                  className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center space-x-2 border border-slate-300 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>Visor Antes / Después</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
