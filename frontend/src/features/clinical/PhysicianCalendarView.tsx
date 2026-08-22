import React, { useState } from 'react'; // React hooks
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, FileText, Sparkles, Filter, ShieldCheck, User } from 'lucide-react'; // Iconos

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
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedMobileDay, setSelectedMobileDay] = useState<string>('2026-08-25');
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

  const mobileAppointmentsForDay = filteredAppointments.filter((a) => a.dateStr === selectedMobileDay);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Encabezado y Métricas de la Agenda Médica */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm gap-3.5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-teal-600/20 flex-shrink-0">
            <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
              <span>Calendario Médico de Turnos</span>
              <span className="bg-teal-100 text-teal-800 text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase">
                Semana 35 / 2026
              </span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Pacientes agendados, fototipo y acceso directo a fichas clínicas
            </p>
          </div>
        </div>

        {/* Controles de Filtro */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-transparent text-slate-700 font-bold outline-none cursor-pointer text-xs w-full"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="CONFIRMED">Solo Confirmados (Seña Paga)</option>
              <option value="COMPLETED">Solo Atendidos</option>
              <option value="PENDING_PAYMENT">Solo Bloqueos Temporales</option>
            </select>
          </div>
        </div>
      </div>

      {/* Indicadores Clave del Calendario */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between col-span-1">
          <div>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 block">Citas Programadas</span>
            <span className="text-base sm:text-xl font-extrabold text-slate-900">6 Pacientes</span>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            🌿
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between col-span-1">
          <div>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 block">Señas Acreditadas</span>
            <span className="text-base sm:text-xl font-extrabold text-emerald-600">$212.500 ARS</span>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            ✓
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between col-span-2 sm:col-span-1">
          <div>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 block">Tasa de Asistencia</span>
            <span className="text-base sm:text-xl font-extrabold text-teal-700">95.8%</span>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            📊
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📱 1. VISTA MÓVIL: CARRUSEL HORIZONTAL DE DÍAS + TARJETAS CLÍNICAS DIRECTAS */}
      {/* ========================================================================= */}
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

        {/* Lista de Turnos Médicos del Día */}
        <div className="space-y-2.5">
          {mobileAppointmentsForDay.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
              No hay pacientes agendados para este día.
            </div>
          ) : (
            mobileAppointmentsForDay.map((appt) => (
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

                <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1.5 border border-slate-100">
                  <p className="font-semibold text-slate-800">{appt.serviceName}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                    <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200">
                      Fototipo: {appt.phototype}
                    </span>
                    <span className="font-extrabold text-slate-900">${appt.agreedPrice.toLocaleString()} ARS</span>
                  </div>
                  <div className="text-[10px] text-amber-900 bg-amber-50/80 p-1.5 rounded-lg">
                    ⚠️ {appt.allergies}
                  </div>
                </div>

                {/* Acciones Clínicas Táctiles (Mínimo 44px de alto) */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onSelectPatient(appt.patientId)}
                    className="min-h-[44px] bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Historia Clínica</span>
                  </button>

                  <button
                    onClick={() => onOpenPhotos(appt.patientId)}
                    className="min-h-[44px] bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>Antes / Después</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🖥️ 2. VISTA ESCRITORIO: GRILLA SEMANAL COMPLETA DE 7 COLUMNAS              */}
      {/* ========================================================================= */}
      <div className="hidden sm:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
                  <div>{d.fullName}</div>
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

      {/* --- MODAL / BOTTOM SHEET DETALLE DE LA CITA & ACCIONES CLÍNICAS --- */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 max-h-[90dvh] overflow-y-auto">
            {/* Tirador táctil en celular */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto sm:hidden"></div>

            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">
                  Detalle Clínico · Turno #{selectedAppointment.id}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">{selectedAppointment.patientName}</h3>
                <p className="text-[11px] sm:text-xs text-slate-500">
                  DNI: {selectedAppointment.patientDni} · Tel: {selectedAppointment.patientPhone}
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800">
                {getStatusLabel(selectedAppointment.status)}
              </span>
            </div>

            {/* Información del Tratamiento y Datos Médicos */}
            <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Tratamiento:</span>
                <span className="font-bold text-slate-800">{selectedAppointment.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Horario:</span>
                <span className="font-bold text-teal-700">
                  {selectedAppointment.dateStr} a las {selectedAppointment.timeStr} hs ({selectedAppointment.durationMinutes} min)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fototipo Cutáneo:</span>
                <span className="font-bold text-slate-800">Fitzpatrick {selectedAppointment.phototype}</span>
              </div>
              <div className="flex justify-between text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200 font-semibold text-[11px]">
                <span>Alergias:</span>
                <span>{selectedAppointment.allergies}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900">
                <span>Arancel / Seña:</span>
                <span>
                  ${selectedAppointment.agreedPrice.toLocaleString()} ARS (Seña: $
                  {selectedAppointment.depositAmount.toLocaleString()} ARS)
                </span>
              </div>
            </div>

            {/* Acciones Médicas Directas (Mínimo 44px de alto para dedos) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  onSelectPatient(selectedAppointment.patientId);
                  setSelectedAppointment(null);
                }}
                className="min-h-[44px] rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Abrir Historia Clínica</span>
              </button>

              <button
                onClick={() => {
                  onOpenPhotos(selectedAppointment.patientId);
                  setSelectedAppointment(null);
                }}
                className="min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center space-x-2 border border-slate-300 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Visor Antes / Después</span>
              </button>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl min-h-[40px]"
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
