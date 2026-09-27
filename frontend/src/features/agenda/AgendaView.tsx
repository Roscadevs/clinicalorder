import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { appointmentsApi } from '../../services/api';
import { Appointment } from '../../types';
import {
  Calendar as CalendarIcon, Clock, Printer, Bell, DollarSign, XCircle, ChevronLeft, ChevronRight,
  ChevronDown, Eye, EyeOff, RefreshCw,
} from 'lucide-react';
import { Card, Button, Badge, Spinner } from '../../components/ui';
import { AppointmentReceiptModal } from '../documents/AppointmentReceiptModal';
import { ReminderNotificationModal } from '../reminders/ReminderNotificationModal';
import { CollectBalanceModal } from './CollectBalanceModal';
import { getVisualStatus, STATUS_STYLES, isActionable, type VisualStatus } from './appointmentStatus';
import { cn } from '../../utils/cn';

const TZ = 'America/Argentina/Buenos_Aires';
type RangeMode = 'day' | 'week' | 'month';

const ars = (n: number) => `$${n.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`;
const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat('es-AR', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

// ── Utilidades de fecha (en hora local, suficiente para agrupar por día) ──────
const startOfDay = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const startOfWeek = (d: Date) => addDays(startOfDay(d), -((d.getDay() + 6) % 7)); // lunes
const startOfMonth = (d: Date) => { const x = startOfDay(d); x.setDate(1); return x; };
const sameDay = (a: Date, b: Date) => startOfDay(a).getTime() === startOfDay(b).getTime();
const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Rango [start, end) según el modo y la fecha ancla. */
function computeRange(mode: RangeMode, anchor: Date): { start: Date; end: Date } {
  if (mode === 'day') return { start: startOfDay(anchor), end: addDays(startOfDay(anchor), 1) };
  if (mode === 'week') { const s = startOfWeek(anchor); return { start: s, end: addDays(s, 7) }; }
  const s = startOfMonth(anchor); const e = new Date(s); e.setMonth(e.getMonth() + 1); return { start: s, end: e };
}

const rangeLabel = (mode: RangeMode, anchor: Date): string => {
  if (mode === 'day')
    return new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(anchor);
  if (mode === 'week') {
    const s = startOfWeek(anchor), e = addDays(s, 6);
    const sameMonth = s.getMonth() === e.getMonth();
    const fmtD = (d: Date, withMonth: boolean) =>
      new Intl.DateTimeFormat('es-AR', { day: 'numeric', ...(withMonth ? { month: 'long' } : {}) }).format(d);
    return `${fmtD(s, !sameMonth)} al ${fmtD(e, true)} de ${e.getFullYear()}`;
  }
  return new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(anchor);
};

const HOURS = Array.from({ length: 11 }, (_, i) => 9 + i); // 09–19

export const AgendaView: React.FC = () => {
  const [mode, setMode] = useState<RangeMode>('week');
  const [anchor, setAnchor] = useState<Date>(() => startOfDay(new Date()));
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());
  const [showMetrics, setShowMetrics] = useState(false);

  const [active, setActive] = useState<Appointment | null>(null); // detalle seleccionado
  const [collectFor, setCollectFor] = useState<Appointment | null>(null);
  const [receiptFor, setReceiptFor] = useState<Appointment | null>(null);
  const [reminderFor, setReminderFor] = useState<Appointment | null>(null);

  const { start, end } = useMemo(() => computeRange(mode, anchor), [mode, anchor]);

  const fetchAgenda = useCallback(() => {
    setLoading(true);
    appointmentsApi
      .getAgenda(start.toISOString(), end.toISOString())
      .then((list) => setAppointments([...list].sort((a, b) => a.startTime.localeCompare(b.startTime))))
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, [start, end]);

  useEffect(() => { fetchAgenda(); }, [fetchAgenda]);
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(t); }, []);

  const shiftPeriod = (dir: number) => {
    setAnchor((a) => (mode === 'day' ? addDays(a, dir) : mode === 'week' ? addDays(a, dir * 7) : (() => { const x = new Date(a); x.setMonth(x.getMonth() + dir); return x; })()));
  };

  // ── Métricas del día de HOY (info sensible, oculta por defecto) ───────────────
  const todayMetrics = useMemo(() => {
    const today = appointments.filter((a) => sameDay(new Date(a.startTime), new Date()) && a.status !== 'CANCELED' && a.status !== 'PAYMENT_FAILED');
    const confirmed = today.filter((a) => a.status === 'CONFIRMED');
    const completed = today.filter((a) => a.status === 'COMPLETED');
    // Saldo por cobrar: turnos ya atendidos pendientes de cobro
    const toCollect = today.filter((a) => a.status === 'ATTENDED');
    const depositsCollected = today.reduce((s, a) => s + a.agreedPrice * 0.5, 0); // seña 50%
    const balancePending = toCollect.reduce((s, a) => s + a.agreedPrice * 0.5, 0); // saldo por cobrar
    return { total: today.length, confirmed: confirmed.length, completed: completed.length, depositsCollected, balancePending };
  }, [appointments]);

  const cancel = async (appt: Appointment) => {
    if (!confirm(`¿Cancelar el turno de ${appt.patientName}? La franja quedará libre.`)) return;
    await appointmentsApi.cancelAppointment(appt.id);
    setActive(null);
    fetchAgenda();
  };

  // Turnos agrupados por día (para día y semana)
  const days = useMemo(() => {
    if (mode === 'month') return [];
    const count = mode === 'day' ? 1 : 7;
    const base = mode === 'day' ? startOfDay(anchor) : startOfWeek(anchor);
    return Array.from({ length: count }, (_, i) => addDays(base, i));
  }, [mode, anchor]);

  const apptsByDay = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    appointments.forEach((a) => {
      const k = dayKey(new Date(a.startTime));
      const list = map.get(k);
      if (list) list.push(a);
      else map.set(k, [a]);
    });
    return map;
  }, [appointments]);

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-5">
      {/* Encabezado + control de período */}
      <Card padded className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-primary-500 text-white flex items-center justify-center shadow-soft flex-shrink-0">
              <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="font-display text-base sm:text-lg font-bold text-sand-900">Agenda de turnos</h2>
              <p className="text-[11px] sm:text-xs text-sand-500">Calendario de la clínica y gestión de turnos</p>
            </div>
          </div>

          {/* Selector Día / Semana / Mes */}
          <div className="bg-sand-100 p-1 rounded-xl flex items-center gap-1 border border-sand-200 self-start">
            {([['day', 'Día'], ['week', 'Semana'], ['month', 'Mes']] as const).map(([m, label]) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-colors',
                  mode === m ? 'bg-white text-primary-700 shadow-sm' : 'text-sand-600 hover:text-sand-900'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Navegación del período */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button onClick={() => shiftPeriod(-1)} aria-label="Período anterior" className="p-1.5 rounded-lg border border-sand-200 bg-white hover:bg-sand-50 text-sand-600">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => shiftPeriod(1)} aria-label="Período siguiente" className="p-1.5 rounded-lg border border-sand-200 bg-white hover:bg-sand-50 text-sand-600">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={() => setAnchor(startOfDay(new Date()))} className="ml-1 px-3 py-1.5 rounded-lg border border-sand-200 bg-white hover:bg-sand-50 text-xs font-semibold text-sand-700">
              Hoy
            </button>
            <span className="ml-2 text-sm font-bold text-sand-800 capitalize">{rangeLabel(mode, anchor)}</span>
          </div>
          <button onClick={fetchAgenda} className="p-1.5 rounded-lg text-sand-500 hover:bg-sand-100" aria-label="Actualizar">
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          </button>
        </div>

        {/* Leyenda de estados */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-semibold">
          {(['CONFIRMED', 'ATTENDED', 'COMPLETED', 'OVERDUE'] as VisualStatus[]).map((s) => (
            <span key={s} className="flex items-center gap-1.5 text-sand-600">
              <span className={cn('w-2.5 h-2.5 rounded-full', STATUS_STYLES[s].dot)} />
              {STATUS_STYLES[s].label}
            </span>
          ))}
        </div>
      </Card>

      {/* Métricas del día (colapsable, sensible) */}
      <Card padded={false} className="overflow-hidden">
        <button
          onClick={() => setShowMetrics((v) => !v)}
          aria-expanded={showMetrics}
          className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-sand-50 transition-colors"
        >
          <span className="flex items-center gap-2 font-display font-bold text-sand-900">
            {showMetrics ? <Eye className="w-4 h-4 text-primary-500" /> : <EyeOff className="w-4 h-4 text-sand-400" />}
            Métricas de hoy
            <span className="text-[10px] font-bold uppercase tracking-wide text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
              Información sensible
            </span>
          </span>
          <ChevronDown className={cn('w-4 h-4 text-sand-400 transition-transform', showMetrics && 'rotate-180')} />
        </button>

        {showMetrics && (
          <div className="px-4 pb-4 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            <Metric label="Turnos de hoy" value={`${todayMetrics.total}`} sub={`${todayMetrics.completed} atendidos`} icon={<CalendarIcon className="w-4 h-4" />} tone="neutral" />
            <Metric label="Confirmados" value={`${todayMetrics.confirmed}`} sub="pendientes de atención" icon={<Clock className="w-4 h-4" />} tone="warning" />
            <Metric label="Señas cobradas" value={`${ars(todayMetrics.depositsCollected)}`} sub="ARS" icon={<DollarSign className="w-4 h-4" />} tone="success" />
            <Metric label="Saldo a cobrar" value={`${ars(todayMetrics.balancePending)}`} sub="ARS en mostrador" icon={<DollarSign className="w-4 h-4" />} tone="primary" />
          </div>
        )}
      </Card>

      {/* Contenido del calendario */}
      {loading && appointments.length === 0 ? (
        <div className="py-16 flex justify-center"><Spinner label="Cargando agenda" /></div>
      ) : mode === 'month' ? (
        <MonthGrid anchor={anchor} apptsByDay={apptsByDay} now={now} onSelectDay={(d) => { setAnchor(d); setMode('day'); }} onSelectAppt={setActive} />
      ) : (
        <TimeGrid days={days} apptsByDay={apptsByDay} now={now} onSelectAppt={setActive} />
      )}

      {/* Detalle del turno */}
      {active && (
        <AppointmentDetail
          appt={active}
          now={now}
          onClose={() => setActive(null)}
          onCollect={() => setCollectFor(active)}
          onReceipt={() => setReceiptFor(active)}
          onReminder={() => setReminderFor(active)}
          onCancel={() => cancel(active)}
        />
      )}

      <CollectBalanceModal
        isOpen={!!collectFor}
        appointment={collectFor}
        onClose={() => setCollectFor(null)}
        onPaid={() => { setActive(null); fetchAgenda(); }}
      />

      {receiptFor && (
        <AppointmentReceiptModal
          isOpen={!!receiptFor}
          onClose={() => setReceiptFor(null)}
          appointmentData={{
            id: receiptFor.id,
            patientName: receiptFor.patientName,
            patientDni: receiptFor.patientDni,
            patientEmail: '',
            patientPhone: receiptFor.patientPhone,
            serviceName: receiptFor.serviceName,
            startTime: receiptFor.startTime,
            durationMinutes: Math.round((new Date(receiptFor.endTime).getTime() - new Date(receiptFor.startTime).getTime()) / 60000) || 45,
            agreedPrice: receiptFor.agreedPrice,
            depositAmount: receiptFor.agreedPrice * 0.5,
          }}
        />
      )}

      {reminderFor && (
        <ReminderNotificationModal
          isOpen={!!reminderFor}
          onClose={() => setReminderFor(null)}
          appointmentData={{
            id: reminderFor.id,
            patientName: reminderFor.patientName,
            patientPhone: reminderFor.patientPhone,
            serviceName: reminderFor.serviceName,
            startTime: reminderFor.startTime,
            durationMinutes: Math.round((new Date(reminderFor.endTime).getTime() - new Date(reminderFor.startTime).getTime()) / 60000) || 45,
            depositAmount: reminderFor.agreedPrice * 0.5,
            agreedPrice: reminderFor.agreedPrice,
          }}
        />
      )}
    </div>
  );
};

// ── Tarjeta de métrica ───────────────────────────────────────────────────────
const TONES = {
  neutral: 'bg-sand-100 text-sand-700',
  warning: 'bg-warning-100 text-warning-700',
  success: 'bg-success-100 text-success-700',
  primary: 'bg-primary-50 text-primary-700',
} as const;

const Metric: React.FC<{ label: string; value: string; sub: string; icon: React.ReactNode; tone: keyof typeof TONES }> = ({ label, value, sub, icon, tone }) => (
  <div className="bg-white p-3.5 rounded-xl border border-sand-200 flex items-center justify-between gap-2">
    <div className="min-w-0">
      <span className="text-[11px] font-semibold text-sand-500 block truncate">{label}</span>
      <span className="font-display text-lg font-extrabold text-sand-900 block">{value}</span>
      <span className="text-[10px] text-sand-400">{sub}</span>
    </div>
    <span className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', TONES[tone])}>{icon}</span>
  </div>
);

// ── Grilla horaria (Día / Semana) ─────────────────────────────────────────────
const TimeGrid: React.FC<{
  days: Date[];
  apptsByDay: Map<string, Appointment[]>;
  now: number;
  onSelectAppt: (a: Appointment) => void;
}> = ({ days, apptsByDay, now, onSelectAppt }) => {
  const isWeek = days.length > 1;
  return (
    <Card padded={false} className="overflow-hidden">
      <div className="overflow-x-auto">
        <div className={isWeek ? 'min-w-[760px]' : ''}>
          {/* Encabezado de días */}
          <div className="grid" style={{ gridTemplateColumns: `64px repeat(${days.length}, minmax(0, 1fr))` }}>
            <div className="p-2 border-b border-r border-sand-200 bg-sand-50" />
            {days.map((d) => {
              const today = sameDay(d, new Date());
              return (
                <div key={d.toISOString()} className={cn('p-2.5 text-center border-b border-r border-sand-200 last:border-r-0', today && 'bg-primary-50/70')}>
                  <div className="text-[11px] font-semibold text-sand-500 uppercase">{new Intl.DateTimeFormat('es-AR', { weekday: 'short' }).format(d)}</div>
                  <div className={cn('font-display text-base font-bold', today ? 'text-primary-700' : 'text-sand-900')}>{d.getDate()}</div>
                </div>
              );
            })}
          </div>

          {/* Filas horarias */}
          <div className="divide-y divide-sand-100">
            {HOURS.map((h) => (
              <div key={h} className="grid min-h-[64px]" style={{ gridTemplateColumns: `64px repeat(${days.length}, minmax(0, 1fr))` }}>
                <div className="p-2 text-center text-[11px] font-bold text-sand-400 border-r border-sand-100 flex items-start justify-center bg-sand-50/40">
                  {String(h).padStart(2, '0')}:00
                </div>
                {days.map((d) => {
                  const dayAppts = (apptsByDay.get(dayKey(d)) ?? []).filter((a) => new Date(a.startTime).getHours() === h);
                  return (
                    <div key={d.toISOString() + h} className="p-1 border-r border-sand-100 last:border-r-0 space-y-1">
                      {dayAppts.map((a) => (
                        <ApptChip key={a.id} appt={a} now={now} compact={isWeek} onClick={() => onSelectAppt(a)} />
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

// ── Grilla mensual ─────────────────────────────────────────────────────────────
const MonthGrid: React.FC<{
  anchor: Date;
  apptsByDay: Map<string, Appointment[]>;
  now: number;
  onSelectDay: (d: Date) => void;
  onSelectAppt: (a: Appointment) => void;
}> = ({ anchor, apptsByDay, onSelectDay }) => {
  const first = startOfMonth(anchor);
  const gridStart = startOfWeek(first);
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const weekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  return (
    <Card padded={false} className="overflow-hidden">
      <div className="grid grid-cols-7 border-b border-sand-200 bg-sand-50 text-center text-[11px] font-bold text-sand-500 uppercase">
        {weekdays.map((w) => <div key={w} className="p-2">{w}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((d) => {
          const inMonth = d.getMonth() === anchor.getMonth();
          const today = sameDay(d, new Date());
          const dayAppts = (apptsByDay.get(dayKey(d)) ?? []).filter((a) => a.status !== 'CANCELED');
          return (
            <button
              key={d.toISOString()}
              onClick={() => onSelectDay(d)}
              className={cn(
                'min-h-[92px] p-1.5 border-b border-r border-sand-100 text-left align-top hover:bg-sand-50 transition-colors',
                !inMonth && 'bg-sand-50/50 text-sand-400'
              )}
            >
              <span className={cn('inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold', today ? 'bg-primary-500 text-white' : inMonth ? 'text-sand-800' : 'text-sand-400')}>
                {d.getDate()}
              </span>
              <div className="mt-1 space-y-0.5">
                {dayAppts.slice(0, 3).map((a) => {
                  const vs = getVisualStatus(a);
                  return (
                    <div key={a.id} className={cn('flex items-center gap-1 text-[10px] truncate rounded px-1 py-0.5', STATUS_STYLES[vs].badge)}>
                      <span className="font-bold">{fmtTime(a.startTime)}</span>
                      <span className="truncate">{a.patientName}</span>
                    </div>
                  );
                })}
                {dayAppts.length > 3 && <div className="text-[10px] text-sand-500 pl-1">+{dayAppts.length - 3} más</div>}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

// ── Chip de turno en la grilla ─────────────────────────────────────────────────
const ApptChip: React.FC<{ appt: Appointment; now: number; compact: boolean; onClick: () => void }> = ({ appt, now, compact, onClick }) => {
  const vs = getVisualStatus(appt, now);
  const s = STATUS_STYLES[vs];
  return (
    <button
      onClick={onClick}
      className={cn('w-full text-left p-2 rounded-lg border text-xs transition-colors', s.card)}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="font-bold text-sand-900 truncate">{appt.patientName}</span>
        <span className="text-[10px] font-bold text-sand-700 bg-white/70 px-1 py-0.5 rounded flex-shrink-0">{fmtTime(appt.startTime)}</span>
      </div>
      {!compact && <p className="text-[11px] text-sand-600 truncate mt-0.5">{appt.serviceName}</p>}
      <p className="text-[10px] font-semibold mt-0.5 text-sand-700">
        {vs === 'COMPLETED' ? 'Pago completo' : vs === 'OVERDUE' ? 'Sin atender' : s.label}
      </p>
    </button>
  );
};

// ── Panel de detalle del turno ─────────────────────────────────────────────────
const AppointmentDetail: React.FC<{
  appt: Appointment;
  now: number;
  onClose: () => void;
  onCollect: () => void;
  onReceipt: () => void;
  onReminder: () => void;
  onCancel: () => void;
}> = ({ appt, now, onClose, onCollect, onReceipt, onReminder, onCancel }) => {
  const vs = getVisualStatus(appt, now);
  const badgeVariant: Record<VisualStatus, React.ComponentProps<typeof Badge>['variant']> = {
    CONFIRMED: 'warning', ATTENDED: 'info', COMPLETED: 'success', OVERDUE: 'danger', PENDING: 'primary', CANCELED: 'neutral',
  };
  const dt = new Intl.DateTimeFormat('es-AR', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(new Date(appt.startTime));
  return (
    <Card className="border-primary-200">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display text-lg font-bold text-sand-900">{appt.patientName}</h3>
            <Badge variant={badgeVariant[vs]}>{vs === 'COMPLETED' ? 'Pago completo' : STATUS_STYLES[vs].label}</Badge>
          </div>
          <p className="text-sm text-sand-600">DNI {appt.patientDni} · {appt.patientPhone}</p>
          <p className="text-sm text-sand-800 font-medium mt-1">{appt.serviceName}</p>
          <p className="text-sm text-sand-600 capitalize flex items-center gap-1.5 mt-0.5"><Clock className="w-3.5 h-3.5" /> {dt} hs</p>
          <p className="text-sm text-sand-800 mt-1">Precio: <span className="font-bold">{ars(appt.agreedPrice)} ARS</span></p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg text-sand-400 hover:bg-sand-100 hover:text-sand-700" aria-label="Cerrar detalle">
          <XCircle className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-sand-100">
        {appt.status === 'ATTENDED' && (
          <Button size="sm" variant="success" onClick={onCollect} leftIcon={<DollarSign className="w-4 h-4" />}>
            Cobrar saldo
          </Button>
        )}
        {appt.status === 'CONFIRMED' && (
          <span className="text-xs text-sand-500 self-center">El saldo se cobra cuando el médico marca el turno como atendido.</span>
        )}
        <Button size="sm" variant="secondary" onClick={onReminder} leftIcon={<Bell className="w-4 h-4" />}>Recordatorio</Button>
        <Button size="sm" variant="secondary" onClick={onReceipt} leftIcon={<Printer className="w-4 h-4" />}>Comprobante</Button>
        {isActionable(appt.status) && (
          <Button size="sm" variant="danger" onClick={onCancel} leftIcon={<XCircle className="w-4 h-4" />}>Cancelar turno</Button>
        )}
      </div>
    </Card>
  );
};
