import React, { useEffect, useState } from 'react';
import { Lock, Clock, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { calendarBlocksApi } from '../../services/api';
import { Modal, Button, Input, Select, Callout } from '../../components/ui';
import { cn } from '../../utils/cn';

export interface CalendarBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: Date;
  onSaved: () => void;
}

const TZ = 'America/Argentina/Buenos_Aires';

const formatDateToInput = (d: Date): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);

const TIME_OPTIONS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00',
];

const COMMON_REASONS = [
  'Cirugía programada',
  'Congreso / Capacitación',
  'Feriado / Asueto',
  'Mantenimiento de consultorio',
  'Licencia médica',
];

/**
 * Modal accesible y adaptado a pantallas táctiles para programar
 * bloqueos de agenda y períodos de indisponibilidad médica.
 */
export const CalendarBlockModal: React.FC<CalendarBlockModalProps> = ({
  isOpen,
  onClose,
  initialDate,
  onSaved,
}) => {
  const [date, setDate] = useState<string>(() => formatDateToInput(initialDate || new Date()));
  const [isAllDay, setIsAllDay] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('13:00');
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setDate(formatDateToInput(initialDate || new Date()));
      setIsAllDay(false);
      setStartTime('09:00');
      setEndTime('13:00');
      setReason('');
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen, initialDate]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedDate = date?.trim();
    if (!trimmedDate) {
      setError('La fecha del bloqueo es obligatoria.');
      return;
    }

    const trimmedReason = reason.trim();
    if (!trimmedReason) {
      setError('El motivo del bloqueo es obligatorio.');
      return;
    }

    if (!isAllDay && startTime >= endTime) {
      setError('La hora de finalización debe ser posterior a la hora de inicio.');
      return;
    }

    let startIso: string;
    let endIso: string;

    try {
      if (isAllDay) {
        startIso = new Date(`${trimmedDate}T00:00:00-03:00`).toISOString();
        endIso = new Date(`${trimmedDate}T23:59:59-03:00`).toISOString();
      } else {
        startIso = new Date(`${trimmedDate}T${startTime}:00-03:00`).toISOString();
        endIso = new Date(`${trimmedDate}T${endTime}:00-03:00`).toISOString();
      }
    } catch {
      setError('La fecha u horario ingresado no es válido.');
      return;
    }

    setIsSubmitting(true);
    try {
      await calendarBlocksApi.createBlock({
        startTime: startIso,
        endTime: endIso,
        reason: trimmedReason,
      });
      onSaved();
      onClose();
    } catch (err: any) {
      const serverMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'Error al crear el bloqueo de agenda.';
      setError(serverMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-sand-900 leading-tight">
              Bloquear horario en agenda
            </h3>
            <p className="text-[11px] text-sand-500 font-normal">
              Indisponibilidad para reserva de turnos
            </p>
          </div>
        </div>
      }
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
            className="min-h-[44px]"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            className="min-h-[44px] bg-amber-600 hover:bg-amber-700 text-white"
          >
            Guardar bloqueo
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Callout intent="error" title="No se pudo registrar el bloqueo">
            {error}
          </Callout>
        )}

        {/* Selector de fecha */}
        <div>
          <label htmlFor="block-date" className="block text-xs font-bold text-sand-700 mb-1.5">
            Fecha del bloqueo
          </label>
          <div className="relative">
            <Input
              id="block-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="min-h-[44px] text-sm"
              required
            />
          </div>
        </div>

        {/* Checkbox Día completo */}
        <div className="bg-sand-50 p-3 rounded-xl border border-sand-200">
          <label className="flex items-center gap-3 cursor-pointer min-h-[44px] select-none">
            <input
              type="checkbox"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
              className="w-5 h-5 rounded border-sand-300 text-amber-600 focus:ring-amber-500"
            />
            <div>
              <span className="text-sm font-bold text-sand-900 block">Día completo</span>
              <span className="text-xs text-sand-500 block">
                Bloquea todo el horario operativo (00:00 a 23:59 hs)
              </span>
            </div>
          </label>
        </div>

        {/* Franja horaria (si no es día completo) */}
        {!isAllDay && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="block-start-time" className="block text-xs font-bold text-sand-700 mb-1.5">
                Hora de inicio
              </label>
              <Select
                id="block-start-time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="min-h-[44px]"
                options={TIME_OPTIONS.map((t) => ({ value: t, label: `${t} hs` }))}
              />
            </div>
            <div>
              <label htmlFor="block-end-time" className="block text-xs font-bold text-sand-700 mb-1.5">
                Hora de finalización
              </label>
              <Select
                id="block-end-time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="min-h-[44px]"
                options={TIME_OPTIONS.map((t) => ({ value: t, label: `${t} hs` }))}
              />
            </div>
          </div>
        )}

        {/* Motivo del bloqueo */}
        <div>
          <label htmlFor="block-reason" className="block text-xs font-bold text-sand-700 mb-1.5">
            Motivo del bloqueo <span className="text-red-500">*</span>
          </label>
          <Input
            id="block-reason"
            type="text"
            placeholder="Ej. Congreso, Cirugía, Feriado..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[44px] text-sm"
            required
          />

          {/* Atajos rápidos de motivos comunes */}
          <div className="mt-2">
            <span className="text-[11px] font-semibold text-sand-500 block mb-1.5">
              Sugerencias rápidas:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={cn(
                    'px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors min-h-[44px] flex items-center',
                    reason === r
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-white text-sand-700 border-sand-200 hover:bg-sand-50'
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};
