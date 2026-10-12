import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CalendarDays, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { appointmentsApi } from '../../services/api';
import { Appointment, TimeSlot } from '../../types';
import { Card, Button, Spinner } from '../../components/ui';
import { cn } from '../../utils/cn';

const TZ = 'America/Argentina/Buenos_Aires';

const todayInAR = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

const localDate = (iso: string) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso));

const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat('es-AR', {
    timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso));

/**
 * Caso de uso "Modificar turno" (reprogramación): permite cambiar únicamente la
 * fecha y el horario de un turno existente. El servicio NO se puede cambiar,
 * porque alteraría el precio acordado y el flujo de estados del turno.
 */
export const EditAppointmentView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const appointmentId = Number(id);

  // El turno puede venir por el state de navegación (desde la agenda) o cargarse por id.
  const passedAppt = (location.state as { appointment?: Appointment } | null)?.appointment ?? null;
  const [appointment, setAppointment] = useState<Appointment | null>(passedAppt);
  const [loadingAppt, setLoadingAppt] = useState(!passedAppt);

  const [date, setDate] = useState<string>(() => (passedAppt ? localDate(passedAppt.startTime) : todayInAR()));
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotStart, setSlotStart] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const slotsRequest = useRef(0);

  // Carga del turno por id si se entra directo por URL (sin state de navegación).
  useEffect(() => {
    if (passedAppt || !Number.isFinite(appointmentId)) return;
    setLoadingAppt(true);
    // Rango amplio: desde hoy hasta 1 año, suficiente para ubicar el turno por id.
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start.getTime() + 365 * 86400000);
    appointmentsApi
      .getAgenda(start.toISOString(), end.toISOString())
      .then((list) => {
        const found = list.find((a) => a.id === appointmentId) ?? null;
        setAppointment(found);
        if (found) setDate(localDate(found.startTime));
      })
      .catch(() => setAppointment(null))
      .finally(() => setLoadingAppt(false));
  }, [appointmentId, passedAppt]);

  const loadSlots = useCallback(async () => {
    if (!appointment || !date) return;
    const reqId = ++slotsRequest.current;
    setSlotsLoading(true);
    try {
      const result = await appointmentsApi.getAvailableSlots(date, appointment.serviceId);
      if (reqId === slotsRequest.current) setSlots(result);
    } catch {
      if (reqId === slotsRequest.current) {
        setSlots([]);
        setErrorMsg('No se pudo consultar la disponibilidad. Intentá nuevamente.');
      }
    } finally {
      if (reqId === slotsRequest.current) setSlotsLoading(false);
    }
  }, [appointment, date]);

  // Al cambiar fecha o turno, se limpia la selección y se recargan horarios.
  useEffect(() => {
    setSlotStart(null);
    loadSlots();
  }, [loadSlots]);

  // El horario actual del turno (para marcarlo y evitar "reprogramar al mismo horario").
  const currentSlotIso = appointment ? appointment.startTime : null;
  const currentIsSameDay = appointment ? localDate(appointment.startTime) === date : false;

  const handleSave = async () => {
    if (!appointment || !slotStart) return;
    setErrorMsg(null);
    setSaving(true);
    try {
      await appointmentsApi.rescheduleAppointment(appointment.id, slotStart);
      navigate('/app/agenda', { replace: true });
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message ||
          'No se pudo reprogramar el turno. Es posible que el horario ya no esté disponible.'
      );
      loadSlots();
    } finally {
      setSaving(false);
    }
  };

  const selectedSlot = useMemo(() => slots.find((s) => s.startTime === slotStart) ?? null, [slots, slotStart]);

  if (loadingAppt) {
    return (
      <div className="max-w-2xl mx-auto p-3 sm:p-6">
        <div className="py-16 flex justify-center"><Spinner label="Cargando turno" /></div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="max-w-2xl mx-auto p-3 sm:p-6">
        <Card padded className="text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-danger-500 mx-auto" />
          <div>
            <h2 className="font-display text-xl font-bold text-sand-900">No se encontró el turno</h2>
            <p className="text-sm text-sand-600 mt-1">El turno que intentás modificar no existe o ya no está disponible.</p>
          </div>
          <Button onClick={() => navigate('/app/agenda')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Volver a la agenda
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-3 sm:p-6 space-y-5">
      <Card padded className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-primary-500 text-white flex items-center justify-center shadow-soft flex-shrink-0">
            <CalendarDays className="w-5 h-5" />
          </span>
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-sand-900">Modificar turno</h2>
            <p className="text-sm text-sand-600">Cambiá la fecha y el horario. El tratamiento no se modifica.</p>
          </div>
        </div>

        {/* Datos no editables del turno */}
        <dl className="bg-sand-50 border border-sand-200 rounded-xl p-4 text-sm grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <dt className="text-xs text-sand-500">Paciente</dt>
            <dd className="font-semibold text-sand-900">{appointment.patientName} · DNI {appointment.patientDni}</dd>
          </div>
          <div>
            <dt className="text-xs text-sand-500">Tratamiento</dt>
            <dd className="font-semibold text-sand-900">{appointment.serviceName}</dd>
          </div>
          <div className="sm:col-span-2 pt-2 border-t border-sand-200">
            <dt className="text-xs text-sand-500">Horario actual</dt>
            <dd className="font-semibold text-sand-900 capitalize flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sand-500" /> {formatDateTime(appointment.startTime)} hs
            </dd>
          </div>
        </dl>

        {/* Selección de nueva fecha */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <label htmlFor="edit-date" className="block text-xs font-bold text-sand-700 uppercase tracking-wider mb-2">
              Nueva fecha
            </label>
            <input
              id="edit-date"
              type="date"
              value={date}
              min={todayInAR()}
              onChange={(e) => e.target.value && setDate(e.target.value)}
              className="bg-sand-50 border border-sand-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 outline-none"
            />
          </div>
          <Button size="sm" variant="ghost" onClick={loadSlots} leftIcon={<RefreshCw className={cn('w-3.5 h-3.5', slotsLoading && 'animate-spin')} />}>
            Actualizar
          </Button>
        </div>

        {/* Grilla de horarios */}
        <div>
          <span className="block text-xs font-bold text-sand-700 uppercase tracking-wider mb-2">Nuevo horario</span>
          {slotsLoading && slots.length === 0 ? (
            <div className="py-6 flex justify-center"><Spinner label="Cargando horarios" /></div>
          ) : slots.length === 0 ? (
            <p className="text-sm text-sand-500 py-4">No hay horarios para esta fecha.</p>
          ) : (
            <div role="radiogroup" aria-label="Horarios disponibles" className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {slots.map((slot) => {
                const isCurrent = currentIsSameDay && slot.startTime === currentSlotIso;
                const enabled = slot.available || isCurrent;
                const isSelected = slotStart === slot.startTime;
                return (
                  <button
                    key={slot.startTime}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={!enabled || isCurrent}
                    title={isCurrent ? 'Horario actual del turno' : enabled ? undefined : 'Horario no disponible'}
                    onClick={() => setSlotStart(slot.startTime)}
                    className={cn(
                      'py-2.5 px-2 rounded-lg text-xs font-bold border transition-all',
                      isCurrent
                        ? 'bg-primary-50 text-primary-400 border-primary-200 cursor-not-allowed'
                        : !enabled
                          ? 'bg-sand-100 text-sand-400 border-sand-200 line-through cursor-not-allowed'
                          : isSelected
                            ? 'bg-primary-500 text-white border-primary-500 shadow-soft'
                            : 'bg-sand-50 text-sand-700 border-sand-200 hover:border-primary-300 hover:bg-primary-50'
                    )}
                  >
                    {slot.timeDisplay.replace(' hs', '')}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {errorMsg && (
          <div role="alert" className="p-3 rounded-xl bg-danger-50 border border-danger-100 text-danger-700 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {selectedSlot && (
          <p className="text-sm text-sand-700">
            Nuevo horario: <strong className="text-sand-900 capitalize">{formatDateTime(selectedSlot.startTime)} hs</strong>
          </p>
        )}

        <div className="flex justify-between pt-2 border-t border-sand-100">
          <Button variant="ghost" onClick={() => navigate('/app/agenda')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Cancelar
          </Button>
          <Button disabled={!slotStart} isLoading={saving} onClick={handleSave} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Guardar cambios
          </Button>
        </div>
      </Card>
    </div>
  );
};
