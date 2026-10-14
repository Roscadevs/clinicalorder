import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentsApi, calendarBlocksApi } from '../../services/api';
import { Appointment, CalendarBlock } from '../../types';
import { isMedicalStaff } from '../../utils/session';
import {
  Calendar as CalendarIcon, Clock, Printer, Bell, DollarSign, XCircle, ChevronLeft, ChevronRight,
  BarChart3, CheckCircle, Pencil, RefreshCw, Lock,
} from 'lucide-react';
import { Card, Button, Badge, Spinner, Modal } from '../../components/ui';
import { AppointmentReceiptModal } from '../documents/AppointmentReceiptModal';
import { ReminderNotificationModal } from '../reminders/ReminderNotificationModal';
import { CollectBalanceModal } from './CollectBalanceModal';
import { CalendarBlockModal } from './CalendarBlockModal';
import { getVisualStatus, STATUS_STYLES, isActionable, type VisualStatus } from './appointmentStatus';
import { cn } from '../../utils/cn';

const TZ = 'America/Argentina/Buenos_Aires';
type RangeMode = 'day' | 'week' | 'month';

interface ConfirmState {
  title: string;
  message: string;
  confirmLabel: string;
  variant: 'primary' | 'danger';
  onConfirm: () => Promise<void> | void;
}

const ars = (n: number) => `$${n.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`;
const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat('es-AR', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

export const isAllDayBlock = (b: CalendarBlock): boolean => {
  const diffMs = new Date(b.endTime).getTime() - new Date(b.startTime).getTime();
  return diffMs >= 23 * 3600 * 1000;
};

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
  const [blocks, setBlocks] = useState<CalendarBlock[]>([]);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());
  const navigate = useNavigate();

  // Día cuyos turnos muestra el panel lateral. null = hoy.
  const [panelDay, setPanelDay] = useState<Date | null>(null);

  // Diálogo de confirmación propio (reemplaza window.confirm).
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [confirmBusy, setConfirmBusy] = useState(false);

  const [active, setActive] = useState<Appointment | null>(null); // detalle seleccionado
  const [collectFor, setCollectFor] = useState<Appointment | null>(null);
  const [receiptFor, setReceiptFor] = useState<Appointment | null>(null);
  const [reminderFor, setReminderFor] = useState<Appointment | null>(null);

  const { start, end } = useMemo(() => computeRange(mode, anchor), [mode, anchor]);

  const fetchAgenda = useCallback(() => {
    setLoading(true);
    Promise.all([
      appointmentsApi.getAgenda(start.toISOString(), end.toISOString()),
      calendarBlocksApi.getBlocks(start.toISOString(), end.toISOString()),
    ])
      .then(([appList, blockList]) => {
        setAppointments([...appList].sort((a, b) => a.startTime.localeCompare(b.startTime)));
        setBlocks([...blockList].sort((a, b) => a.startTime.localeCompare(b.startTime)));
      })
      .catch(() => {
        setAppointments([]);
        setBlocks([]);
      })
      .finally(() => setLoading(false));
  }, [start, end]);

  useEffect(() => { fetchAgenda(); }, [fetchAgenda]);
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(t); }, []);

  const shiftPeriod = (dir: number) => {
    setAnchor((a) => (mode === 'day' ? addDays(a, dir) : mode === 'week' ? addDays(a, dir * 7) : (() => { const x = new Date(a); x.setMonth(x.getMonth() + dir); return x; })()));
  };

  // Día efectivo del panel (el seleccionado o, por defecto, hoy).
  const effectivePanelDay = panelDay ?? startOfDay(new Date());
  const panelIsToday = sameDay(effectivePanelDay, new Date());

  // Turnos del día del panel, ordenados por hora.
  const panelAppts = useMemo(
    () =>
      appointments
        .filter((a) => sameDay(new Date(a.startTime), effectivePanelDay) && a.status !== 'CANCELED' && a.status !== 'PAYMENT_FAILED')
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [appointments, effectivePanelDay]
  );

  // Bloqueos del día del panel (que coincidan o se solapen con la fecha).
  const panelBlocks = useMemo(
    () =>
      blocks
        .filter((b) => {
          const bStart = new Date(b.startTime).getTime();
          const bEnd = new Date(b.endTime).getTime();
          const dayStart = startOfDay(effectivePanelDay).getTime();
          const dayEnd = addDays(startOfDay(effectivePanelDay), 1).getTime();
          return bStart < dayEnd && bEnd > dayStart;
        })
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [blocks, effectivePanelDay]
  );

  const releaseBlock = (block: CalendarBlock) => {
    setConfirm({
      title: 'Liberar horario bloqueado',
      message: `¿Deseas liberar este horario y permitir nuevamente la reserva de turnos? (Motivo: "${block.reason}")`,
      confirmLabel: 'Liberar horario',
      variant: 'danger',
      onConfirm: async () => {
        await calendarBlocksApi.deleteBlock(block.id);
        fetchAgenda();
      },
    });
  };

  const cancel = (appt: Appointment) => {
    setConfirm({
      title: 'Cancelar turno',
      message: `¿Querés cancelar el turno de ${appt.patientName}? La franja quedará libre y la acción no se puede deshacer.`,
      confirmLabel: 'Cancelar turno',
      variant: 'danger',
      onConfirm: async () => {
        await appointmentsApi.cancelAppointment(appt.id);
        setActive(null);
        fetchAgenda();
      },
    });
  };

  // CONFIRMED -> ATTENDED: habilita luego el cobro del saldo en mostrador.
  const attend = (appt: Appointment) => {
    setConfirm({
      title: 'Marcar como atendido',
      message: `¿Confirmás que ${appt.patientName} fue atendido? Luego vas a poder cobrar el saldo en mostrador.`,
      confirmLabel: 'Marcar como atendido',
      variant: 'primary',
      onConfirm: async () => {
        await appointmentsApi.markAsAttended(appt.id);
        setActive(null);
        fetchAgenda();
      },
    });
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

  const blocksByDay = useMemo(() => {
    const map = new Map<string, CalendarBlock[]>();
    blocks.forEach((b) => {
      const cur = startOfDay(new Date(b.startTime));
      const end = new Date(b.endTime);
      while (cur.getTime() < end.getTime()) {
        const k = dayKey(cur);
        const list = map.get(k);
        if (list) list.push(b);
        else map.set(k, [b]);
        cur.setDate(cur.getDate() + 1);
      }
    });
    return map;
  }, [blocks]);

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-5">
      {/* Encabezado + control de período */}
      <Card padded className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-primary-500 text-white flex items-center justify-center shadow-soft flex-shrink-0">
              <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-sand-900">Agenda</h2>
          </div>

          <div className="flex items-center gap-2 self-start flex-wrap">
            {/* Selector Día / Semana / Mes */}
            <div className="bg-sand-100 p-1 rounded-xl flex items-center gap-1 border border-sand-200">
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

            {/* Acceso a las métricas del día (vista dedicada, información sensible) */}
            <button
              onClick={() => navigate('/app/analytics')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sand-200 bg-white hover:bg-sand-50 text-xs font-bold text-sand-700 transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-primary-500" />
              <span className="hidden sm:inline">Métricas de hoy</span>
              <span className="sm:hidden">Métricas</span>
            </button>

            {/* Bloqueo de agenda (solo personal médico) */}
            {isMedicalStaff() && (
              <button
                onClick={() => setIsBlockModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-xs font-bold text-amber-800 transition-colors"
                title="Bloquear franja horaria o día completo"
              >
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Bloquear horario</span>
                <span className="sm:hidden">Bloquear</span>
              </button>
            )}
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

      {/* Contenido: panel "Turnos de hoy" a la izquierda + calendario a la derecha */}
      {loading && appointments.length === 0 ? (
        <div className="py-16 flex justify-center"><Spinner label="Cargando agenda" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5 items-start">
          <TodayPanel
            appts={panelAppts}
            blocks={panelBlocks}
            day={effectivePanelDay}
            isToday={panelIsToday}
            now={now}
            onBackToToday={() => setPanelDay(null)}
            onSelectAppt={setActive}
            onReleaseBlock={releaseBlock}
          />
          <div className="min-w-0">
            {mode === 'month' ? (
              <MonthGrid
                anchor={anchor}
                apptsByDay={apptsByDay}
                blocksByDay={blocksByDay}
                now={now}
                onSelectDay={(d) => setPanelDay(startOfDay(d))}
                onSelectAppt={setActive}
              />
            ) : (
              <TimeGrid
                days={days}
                apptsByDay={apptsByDay}
                blocksByDay={blocksByDay}
                now={now}
                onSelectDay={(d) => setPanelDay(startOfDay(d))}
                onSelectAppt={setActive}
                onReleaseBlock={releaseBlock}
              />
            )}
          </div>
        </div>
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
          onAttended={() => attend(active)}
          onEdit={() => navigate(`/app/agenda/${active.id}/editar`, { state: { appointment: active } })}
        />
      )}

      {/* Confirmación propia del sistema (reemplaza window.confirm) */}
      <Modal
        isOpen={!!confirm}
        onClose={() => { if (!confirmBusy) setConfirm(null); }}
        title={confirm?.title}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirm(null)} disabled={confirmBusy}>
              Volver
            </Button>
            <Button
              variant={confirm?.variant === 'danger' ? 'danger' : 'primary'}
              isLoading={confirmBusy}
              onClick={async () => {
                if (!confirm) return;
                setConfirmBusy(true);
                try {
                  await confirm.onConfirm();
                  setConfirm(null);
                } finally {
                  setConfirmBusy(false);
                }
              }}
            >
              {confirm?.confirmLabel}
            </Button>
          </>
        }
      >
        <p className="text-sm text-sand-600">{confirm?.message}</p>
      </Modal>

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

      <CalendarBlockModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        initialDate={effectivePanelDay}
        onSaved={fetchAgenda}
      />
    </div>
  );
};

// ── Panel de turnos del día (columna izquierda) ───────────────────────────────
const TodayPanel: React.FC<{
  appts: Appointment[];
  blocks: CalendarBlock[];
  day: Date;
  isToday: boolean;
  now: number;
  onBackToToday: () => void;
  onSelectAppt: (a: Appointment) => void;
  onReleaseBlock?: (b: CalendarBlock) => void;
}> = ({ appts, blocks, day, isToday, now, onBackToToday, onSelectAppt, onReleaseBlock }) => {
  const dayLabel = new Intl.DateTimeFormat('es-AR', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long' }).format(day);
  return (
    <Card padded className="flex flex-col gap-3 lg:sticky lg:top-4">
      <div className="flex items-center gap-2">
        <span className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
          <CalendarIcon className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-base font-bold text-sand-900 leading-tight">
            {isToday ? 'Turnos de hoy' : 'Turnos del día'}
          </h3>
          <p className="text-[11px] text-sand-500 capitalize truncate">{dayLabel}</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
          {blocks.length > 0 && (
            <span
              className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1"
              title="Horarios bloqueados en este día"
            >
              <Lock className="w-3 h-3 text-amber-600" />
              {blocks.length}
            </span>
          )}
          <span className="text-xs font-bold text-sand-700 bg-sand-100 px-2 py-0.5 rounded-full">
            {appts.length}
          </span>
        </div>
      </div>

      {!isToday && (
        <button
          onClick={onBackToToday}
          className="flex items-center justify-center gap-1.5 w-full px-3 py-1.5 rounded-lg border border-primary-200 bg-primary-50/60 hover:bg-primary-100 text-xs font-bold text-primary-700 transition-colors"
        >
          <CalendarIcon className="w-3.5 h-3.5" />
          Volver a hoy
        </button>
      )}

      {/* Bloqueos de agenda para el día */}
      {blocks.length > 0 && (
        <div className="space-y-1.5 mb-1">
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1 px-0.5">
            <Lock className="w-3 h-3 text-amber-600" />
            <span>Indisponibilidad ({blocks.length})</span>
          </div>
          {blocks.map((b) => (
            <div
              key={b.id}
              className="p-2.5 rounded-xl border border-amber-300 bg-amber-50/80 text-xs space-y-1 shadow-sm"
            >
              <div className="flex items-start justify-between gap-1.5">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span className="line-clamp-1">{b.reason}</span>
                </div>
                {onReleaseBlock && isMedicalStaff() && (
                  <button
                    type="button"
                    onClick={() => onReleaseBlock(b)}
                    className="text-[11px] text-amber-800 hover:text-red-700 font-bold underline underline-offset-2 shrink-0 px-1 py-0.5 rounded hover:bg-amber-100 transition-colors"
                    title="Liberar este horario"
                  >
                    Liberar
                  </button>
                )}
              </div>
              <div className="text-[11px] text-amber-700 flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>
                  {isAllDayBlock(b)
                    ? 'Día completo (00:00 a 23:59 hs)'
                    : `${fmtTime(b.startTime)} a ${fmtTime(b.endTime)} hs`}
                </span>
                {b.createdByUserFullName && (
                  <span className="text-amber-600 truncate">· {b.createdByUserFullName}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {appts.length === 0 && blocks.length === 0 ? (
        <p className="text-sm text-sand-500 py-6 text-center">
          {isToday ? 'No hay turnos para hoy.' : 'No hay turnos para este día.'}
        </p>
      ) : appts.length === 0 ? (
        <p className="text-xs text-sand-500 py-2 text-center italic">
          No hay turnos de pacientes reservados para este día.
        </p>
      ) : (
        <div className="space-y-1.5 lg:max-h-[560px] lg:overflow-y-auto lg:pr-1">
          {appts.map((a) => (
            <ApptChip key={a.id} appt={a} now={now} compact={false} onSelectAppt={onSelectAppt} />
          ))}
        </div>
      )}
    </Card>
  );
};

// ── Grilla horaria (Día / Semana) ─────────────────────────────────────────────
const TimeGrid: React.FC<{
  days: Date[];
  apptsByDay: Map<string, Appointment[]>;
  blocksByDay: Map<string, CalendarBlock[]>;
  now: number;
  onSelectDay: (d: Date) => void;
  onSelectAppt: (a: Appointment) => void;
  onReleaseBlock?: (b: CalendarBlock) => void;
}> = ({ days, apptsByDay, blocksByDay, now, onSelectDay, onSelectAppt, onReleaseBlock }) => {
  const isWeek = days.length > 1;
  const hasAnyAllDay = days.some((d) => (blocksByDay.get(dayKey(d)) ?? []).some(isAllDayBlock));

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
                <button
                  key={d.toISOString()}
                  type="button"
                  onClick={() => onSelectDay(d)}
                  title="Ver turnos de este día en el panel"
                  className={cn('p-2.5 text-center border-b border-r border-sand-200 last:border-r-0 hover:bg-primary-50 transition-colors cursor-pointer', today && 'bg-primary-50/70')}
                >
                  <div className="text-[11px] font-semibold text-sand-500 uppercase">{new Intl.DateTimeFormat('es-AR', { weekday: 'short' }).format(d)}</div>
                  <div className={cn('font-display text-base font-bold', today ? 'text-primary-700' : 'text-sand-900')}>{d.getDate()}</div>
                </button>
              );
            })}
          </div>

          {/* Fila de eventos de día completo (si existe al menos uno) */}
          {hasAnyAllDay && (
            <div className="grid border-b border-sand-200 bg-amber-50/50" style={{ gridTemplateColumns: `64px repeat(${days.length}, minmax(0, 1fr))` }}>
              <div className="p-2 text-center text-[10px] font-bold text-amber-800 border-r border-sand-200 flex items-center justify-center">
                Día completo
              </div>
              {days.map((d) => {
                const dayAllDay = (blocksByDay.get(dayKey(d)) ?? []).filter(isAllDayBlock);
                return (
                  <div key={'allday-' + d.toISOString()} className="p-1 border-r border-sand-200 last:border-r-0 space-y-1">
                    {dayAllDay.map((b) => (
                      <div
                        key={b.id}
                        className="w-full text-left p-1.5 rounded-lg border border-amber-300 bg-amber-100/90 text-amber-900 text-xs flex items-center justify-between gap-1 shadow-sm"
                        title={`Bloqueo día completo: ${b.reason}`}
                      >
                        <div className="flex items-center gap-1 truncate min-w-0">
                          <Lock className="w-3 h-3 text-amber-600 shrink-0" />
                          <span className="font-bold truncate">{b.reason}</span>
                        </div>
                        {onReleaseBlock && isMedicalStaff() && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onReleaseBlock(b);
                            }}
                            className="text-[10px] text-amber-700 hover:text-red-700 font-bold p-0.5 rounded hover:bg-amber-200 shrink-0"
                            title="Liberar bloqueo"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* Filas horarias */}
          <div className="divide-y divide-sand-100">
            {HOURS.map((h) => (
              <div key={h} className="grid min-h-[64px]" style={{ gridTemplateColumns: `64px repeat(${days.length}, minmax(0, 1fr))` }}>
                <div className="p-2 text-center text-[11px] font-bold text-sand-400 border-r border-sand-100 flex items-start justify-center bg-sand-50/40">
                  {String(h).padStart(2, '0')}:00
                </div>
                {days.map((d) => {
                  const dayAppts = (apptsByDay.get(dayKey(d)) ?? []).filter((a) => new Date(a.startTime).getHours() === h);
                  const isDayBlockedAllDay = (blocksByDay.get(dayKey(d)) ?? []).some(isAllDayBlock);
                  const hourStart = new Date(d);
                  hourStart.setHours(h, 0, 0, 0);
                  const hourEnd = new Date(d);
                  hourEnd.setHours(h + 1, 0, 0, 0);
                  const dayBlocks = (blocksByDay.get(dayKey(d)) ?? []).filter((b) => {
                    if (isAllDayBlock(b)) return false;
                    const bs = new Date(b.startTime).getTime();
                    const be = new Date(b.endTime).getTime();
                    return bs < hourEnd.getTime() && be > hourStart.getTime();
                  });

                  return (
                    <div key={d.toISOString() + h} className={cn('p-1 border-r border-sand-100 last:border-r-0 space-y-1', isDayBlockedAllDay && 'bg-amber-50/25')}>
                      {dayBlocks.map((b) => (
                        <div
                          key={b.id}
                          className="w-full text-left p-1.5 rounded-lg border border-amber-300 bg-amber-50/90 text-amber-900 text-xs flex items-center justify-between gap-1 shadow-sm"
                          title={`Bloqueo: ${b.reason} (${fmtTime(b.startTime)} - ${fmtTime(b.endTime)})`}
                        >
                          <div className="flex items-center gap-1 truncate min-w-0">
                            <Lock className="w-3 h-3 text-amber-600 shrink-0" />
                            <span className="font-bold truncate">{b.reason}</span>
                          </div>
                          {onReleaseBlock && isMedicalStaff() && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onReleaseBlock(b);
                              }}
                              className="text-[10px] text-amber-700 hover:text-red-700 font-bold p-0.5 rounded hover:bg-amber-100 shrink-0"
                              title="Liberar bloqueo"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                      {dayAppts.map((a) => (
                        <ApptChip key={a.id} appt={a} now={now} compact={isWeek} onSelectAppt={onSelectAppt} />
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
  blocksByDay: Map<string, CalendarBlock[]>;
  now: number;
  onSelectDay: (d: Date) => void;
  onSelectAppt: (a: Appointment) => void;
}> = ({ anchor, apptsByDay, blocksByDay, now, onSelectDay }) => {
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
          const dayBlocks = blocksByDay.get(dayKey(d)) ?? [];
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
                {dayBlocks.slice(0, 1).map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center gap-1 text-[10px] truncate rounded px-1 py-0.5 bg-amber-100/90 border border-amber-200 text-amber-800"
                    title={`Bloqueo: ${b.reason}`}
                  >
                    <Lock className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                    <span className="truncate font-semibold">{b.reason}</span>
                  </div>
                ))}
                {dayAppts.slice(0, 2).map((a) => {
                  const vs = getVisualStatus(a, now);
                  return (
                    <div key={a.id} className={cn('flex items-center gap-1 text-[10px] truncate rounded px-1 py-0.5', STATUS_STYLES[vs].badge)}>
                      <span className="font-bold">{fmtTime(a.startTime)}</span>
                      <span className="truncate">{a.patientName}</span>
                    </div>
                  );
                })}
                {dayAppts.length + dayBlocks.length > 3 && (
                  <div className="text-[10px] text-sand-500 pl-1">
                    +{dayAppts.length + dayBlocks.length - 3} más
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

// ── Chip de turno en la grilla ─────────────────────────────────────────────────
const ApptChip = React.memo<{ appt: Appointment; now: number; compact: boolean; onSelectAppt: (a: Appointment) => void }>(
  ({ appt, now, compact, onSelectAppt }) => {
    const vs = getVisualStatus(appt, now);
    const s = STATUS_STYLES[vs];
    return (
      <button
        onClick={() => onSelectAppt(appt)}
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
  },
  (prev, next) => {
    return (
      prev.appt === next.appt &&
      prev.compact === next.compact &&
      prev.onSelectAppt === next.onSelectAppt &&
      getVisualStatus(prev.appt, prev.now) === getVisualStatus(next.appt, next.now)
    );
  }
);

// ── Panel de detalle del turno ─────────────────────────────────────────────────
const AppointmentDetail: React.FC<{
  appt: Appointment;
  now: number;
  onClose: () => void;
  onCollect: () => void;
  onReceipt: () => void;
  onReminder: () => void;
  onCancel: () => void;
  onAttended: () => void;
  onEdit: () => void;
}> = ({ appt, now, onClose, onCollect, onReceipt, onReminder, onCancel, onAttended, onEdit }) => {
  const vs = getVisualStatus(appt, now);
  const badgeVariant: Record<VisualStatus, React.ComponentProps<typeof Badge>['variant']> = {
    CONFIRMED: 'warning', ATTENDED: 'info', COMPLETED: 'success', OVERDUE: 'danger', PENDING: 'primary', CANCELED: 'neutral',
  };
  const dt = new Intl.DateTimeFormat('es-AR', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(new Date(appt.startTime));
  return (
    <Modal
      isOpen
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          {appt.patientName}
          <Badge variant={badgeVariant[vs]}>{vs === 'COMPLETED' ? 'Pago completo' : STATUS_STYLES[vs].label}</Badge>
        </span>
      }
      footer={
        <div className="w-full space-y-3">
          {/* Acción primaria según el estado del turno (destacada, ocupa el ancho) */}
          {appt.status === 'ATTENDED' && (
            <Button variant="success" fullWidth onClick={onCollect} leftIcon={<DollarSign className="w-4 h-4" />}>
              Cobrar saldo
            </Button>
          )}
          {appt.status === 'CONFIRMED' && (
            <Button variant="primary" fullWidth onClick={onAttended} leftIcon={<CheckCircle className="w-4 h-4" />}>
              Marcar como atendido
            </Button>
          )}

          {/* Acciones secundarias */}
          <div className="grid grid-cols-3 gap-2">
            {isActionable(appt.status) && (
              <Button size="sm" variant="outline" onClick={onEdit} leftIcon={<Pencil className="w-4 h-4" />}>Modificar</Button>
            )}
            <Button size="sm" variant="secondary" onClick={onReminder} leftIcon={<Bell className="w-4 h-4" />}>Recordatorio</Button>
            <Button size="sm" variant="secondary" onClick={onReceipt} leftIcon={<Printer className="w-4 h-4" />}>Comprobante</Button>
          </div>

          {/* Acción destructiva, separada para evitar clics accidentales */}
          {isActionable(appt.status) && (
            <div className="pt-2 border-t border-sand-100 flex justify-end">
              <Button size="sm" variant="ghost" onClick={onCancel} leftIcon={<XCircle className="w-4 h-4" />} className="text-danger-600 hover:bg-danger-50">
                Cancelar turno
              </Button>
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-1">
        <p className="text-sm text-sand-600">DNI {appt.patientDni} · {appt.patientPhone}</p>
        <p className="text-sm text-sand-800 font-medium mt-1">{appt.serviceName}</p>
        <p className="text-sm text-sand-600 capitalize flex items-center gap-1.5 mt-0.5"><Clock className="w-3.5 h-3.5" /> {dt} hs</p>
        <p className="text-sm text-sand-800 mt-1">Precio: <span className="font-bold">{ars(appt.agreedPrice)} ARS</span></p>
      </div>
    </Modal>
  );
};
