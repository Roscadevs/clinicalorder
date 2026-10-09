import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle, ArrowLeft, ArrowRight, Calendar, CheckCircle, Clock, Pencil, Printer,
  RefreshCw, Timer, TimerOff, UserRound,
} from 'lucide-react';
import { servicesApi, appointmentsApi } from '../../services/api';
import {
  DermatologicService, Patient, PaymentConcept, PaymentPreferenceResponse, PaymentReceipt, TimeSlot,
  PAYMENT_CONCEPT_LABELS, PAYMENT_TYPE_LABELS,
} from '../../types';
import { Button, Card, Modal, Spinner } from '../../components/ui';
import { Stepper, Step, GlideSelect } from '../../components/reactbits';
import { AppointmentReceiptModal } from '../documents/AppointmentReceiptModal';
import { ReminderNotificationModal } from '../reminders/ReminderNotificationModal';
import { PatientSearch } from './PatientSearch';
import { RegisterPaymentStep } from './RegisterPaymentStep';

const HOLD_MS = 10 * 60 * 1000; // Bloqueo temporal de 10 minutos
const SLOTS_REFRESH_MS = 30 * 1000; // Refresco de disponibilidad (otros usuarios reservando)
const EXPIRED_RESET_SECONDS = 10; // Reinicio automático tras vencer el bloqueo
const TZ = 'America/Argentina/Buenos_Aires';

const STEP_LABELS = ['Paciente', 'Servicio', 'Fecha y hora', 'Confirmación', 'Pago'];
const STEP = { PATIENT: 1, SERVICE: 2, SCHEDULE: 3, REVIEW: 4, PAYMENT: 5 } as const;

type Outcome =
  | { kind: 'CONFIRMED'; receipt: PaymentReceipt; change: number }
  | { kind: 'PENDING_VIRTUAL' };

interface Hold {
  data: PaymentPreferenceResponse;
  key: string; // paciente|servicio|horario del bloqueo
  deadline: number; // ms epoch
}

const todayInAR = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat('es-AR', {
    timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso));

const ars = (n: number) => `$${n.toLocaleString('es-AR', { maximumFractionDigits: 2 })} ARS`;

const formatCountdown = (ms: number) => {
  const total = Math.max(0, Math.round(ms / 1000));
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

/**
 * Caso de uso "Reservar Turno" (actor: staff).
 * 1. Paciente (E-1: alta)  2. Servicio  3. Fecha y hora (bloqueo 10 min)
 * 4. Confirmación (E-2: editar)  5. Registrar Pago  ->  Turno confirmado
 */
export const BookingWizard: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(STEP.PATIENT);
  const [direction, setDirection] = useState(1);

  // Paciente
  const [patient, setPatient] = useState<Patient | null>(null);
  const [addPatientQuery, setAddPatientQuery] = useState<string | null>(null);

  // Servicio
  const [services, setServices] = useState<DermatologicService[]>([]);
  const [serviceId, setServiceId] = useState<number | null>(null);

  // Fecha y hora
  const [date, setDate] = useState<string>(todayInAR());
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotStart, setSlotStart] = useState<string | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const slotsRequest = useRef(0);

  // Elección del monto a abonar en el turno: seña (parcial) o pago total.
  const [paymentConcept, setPaymentConcept] = useState<Exclude<PaymentConcept, 'BALANCE'>>('DEPOSIT');

  // Bloqueo temporal y resultado
  const [hold, setHold] = useState<Hold | null>(null);
  const [now, setNow] = useState(Date.now());
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetIn, setResetIn] = useState(EXPIRED_RESET_SECONDS);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);

  const service = useMemo(() => services.find((s) => s.id === serviceId) ?? null, [services, serviceId]);
  const serviceOptions = useMemo(
    () =>
      [...services]
        .filter((s) => s.active)
        .sort((a, b) => a.name.localeCompare(b.name, 'es'))
        .map((s) => ({ value: String(s.id), label: s.name, tag: `${s.durationMinutes} min` })),
    [services]
  );
  const selectedSlot = useMemo(() => slots.find((s) => s.startTime === slotStart) ?? null, [slots, slotStart]);

  const remainingMs = hold ? hold.deadline - now : 0;
  const holdExpired = !!hold && !outcome && remainingMs <= 0;
  const currentKey = patient && serviceId && slotStart ? `${patient.id}|${serviceId}|${slotStart}` : null;

  useEffect(() => {
    servicesApi.getActiveServices().then(setServices).catch(console.error);
  }, []);

  // Reloj del contador (sólo mientras hay un bloqueo sin resolver)
  useEffect(() => {
    if (!hold || outcome) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [hold, outcome]);

  // Disponibilidad por fecha y servicio. Se descartan respuestas viejas para que,
  // al cambiar de fecha, nunca se muestren los horarios de la fecha anterior.
  const loadSlots = useCallback(async () => {
    if (!serviceId || !date) return;
    const id = ++slotsRequest.current;
    setSlotsLoading(true);
    try {
      const result = await appointmentsApi.getAvailableSlots(date, serviceId);
      if (id === slotsRequest.current) setSlots(result);
    } catch {
      if (id === slotsRequest.current) {
        setSlots([]);
        setErrorMsg('No se pudo consultar la disponibilidad. Intentá nuevamente.');
      }
    } finally {
      if (id === slotsRequest.current) setSlotsLoading(false);
    }
  }, [serviceId, date]);

  // Al cambiar fecha o servicio, se limpia la grilla y la selección antes de consultar
  useEffect(() => {
    setSlots([]);
    setSlotStart(null);
  }, [date, serviceId]);

  useEffect(() => {
    if (step !== STEP.SCHEDULE) return;
    loadSlots();
    const t = setInterval(loadSlots, SLOTS_REFRESH_MS);
    return () => clearInterval(t);
  }, [step, loadSlots]);

  // E-2: si cambia paciente, servicio u horario, el bloqueo anterior se libera en el momento
  useEffect(() => {
    if (!hold || outcome || holdExpired || currentKey === hold.key) return;
    const id = hold.data.appointmentId;
    setHold(null);
    appointmentsApi
      .releaseHold(id)
      .catch(() => undefined)
      .finally(() => loadSlots());
  }, [currentKey, hold, outcome, holdExpired, loadSlots]);

  // Si el horario elegido dejó de estar disponible (lo tomó otro usuario), se deselecciona
  useEffect(() => {
    if (!slotStart || !selectedSlot) return;
    const ownHold = hold && currentKey === hold.key && !holdExpired;
    if (!selectedSlot.available && !ownHold) setSlotStart(null);
  }, [selectedSlot, slotStart, hold, currentKey, holdExpired]);

  const resetAll = useCallback(() => {
    setPatient(null);
    setServiceId(null);
    setSlotStart(null);
    setSlots([]);
    setHold(null);
    setOutcome(null);
    setErrorMsg(null);
    setDate(todayInAR());
    setResetIn(EXPIRED_RESET_SECONDS);
    setDirection(-1);
    setStep(STEP.PATIENT);
  }, []);

  // Bloqueo vencido: se informa y la reserva se reinicia (el horario queda liberado)
  const restartAfterExpiry = useCallback(() => {
    if (hold) appointmentsApi.releaseHold(hold.data.appointmentId).catch(() => undefined);
    resetAll();
  }, [hold, resetAll]);

  useEffect(() => {
    if (!holdExpired) return;
    setResetIn(EXPIRED_RESET_SECONDS);
    const t = setInterval(() => setResetIn((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [holdExpired]);

  useEffect(() => {
    if (holdExpired && resetIn <= 0) restartAfterExpiry();
  }, [holdExpired, resetIn, restartAfterExpiry]);

  // Liberación del bloqueo al abandonar: al salir de la vista (desmontaje) y, como
  // mejor esfuerzo, al cerrar/recargar la pestaña. Si el navegador se cierra de golpe
  // no hay forma confiable de avisar: el servidor lo libera al vencer los 10 minutos.
  const holdRef = useRef<Hold | null>(null);
  const outcomeRef = useRef<Outcome | null>(null);
  holdRef.current = hold;
  outcomeRef.current = outcome;
  useEffect(() => {
    const onPageHide = () => {
      if (holdRef.current && !outcomeRef.current) {
        appointmentsApi.releaseHoldOnPageExit(holdRef.current.data.appointmentId);
      }
    };
    window.addEventListener('pagehide', onPageHide);
    return () => {
      window.removeEventListener('pagehide', onPageHide);
      if (holdRef.current && !outcomeRef.current) {
        appointmentsApi.releaseHold(holdRef.current.data.appointmentId).catch(() => undefined);
      }
    };
  }, []);

  const goTo = (target: number) => {
    setErrorMsg(null);
    setDirection(target > step ? 1 : -1);
    setStep(target);
  };

  /** Fecha y hora -> Confirmación: bloquea el horario por 10 minutos (control de concurrencia). */
  const handleHoldSlot = async () => {
    if (!patient || !service || !slotStart || !currentKey) return;
    setErrorMsg(null);

    if (hold && hold.key === currentKey && !holdExpired) {
      goTo(STEP.REVIEW);
      return;
    }

    setIsHolding(true);
    try {
      const data = await appointmentsApi.bookTemporaryHold({
        patientId: patient.id,
        serviceId: service.id,
        startTime: slotStart,
      });
      const deadline = data.holdExpiresAt ? new Date(data.holdExpiresAt).getTime() : Date.now() + HOLD_MS;
      setHold({ data, key: currentKey, deadline });
      setNow(Date.now());
      goTo(STEP.REVIEW);
    } catch (err: any) {
      setSlotStart(null);
      setErrorMsg(
        err?.response?.data?.message ||
          'Este horario acaba de ser reservado por otro usuario. Elegí otro horario.'
      );
      loadSlots();
    } finally {
      setIsHolding(false);
    }
  };

  const depositAmount = hold?.data.depositAmount ?? (service ? (service.basePrice * service.depositPercentage) / 100 : 0);
  // Monto efectivo a cobrar según la opción elegida (seña parcial o pago total).
  const amountToPay = paymentConcept === 'FULL' ? (service?.basePrice ?? 0) : depositAmount;

  // ─── Pantalla final: turno confirmado / pendiente de pago virtual ──────────────
  if (outcome && patient && service && slotStart && hold) {
    const confirmed = outcome.kind === 'CONFIRMED';
    const receipt = confirmed ? outcome.receipt : null;
    return (
      <div className="w-full flex justify-center px-4 py-6 sm:py-10">
        <Card className="w-full max-w-2xl text-center space-y-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${confirmed ? 'bg-success-100 text-success-600' : 'bg-warning-100 text-warning-600'}`}>
            {confirmed ? <CheckCircle className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-sand-900">
              {confirmed ? 'Turno confirmado' : 'Turno reservado, pago virtual pendiente'}
            </h2>
            <p className="text-sm text-sand-600 mt-1">
              {confirmed
                ? 'El pago quedó registrado y la agenda fue actualizada.'
                : 'El turno se confirma automáticamente cuando MercadoPago acredite la seña.'}
            </p>
          </div>

          <dl className="bg-sand-50 border border-sand-200 rounded-xl p-4 text-left text-sm space-y-2">
            <div className="flex justify-between gap-4"><dt className="text-sand-500">Paciente</dt><dd className="font-semibold text-sand-800">{patient.name}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-sand-500">Tratamiento</dt><dd className="font-semibold text-sand-800 text-right">{service.name}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-sand-500">Fecha y hora</dt><dd className="font-semibold text-sand-800 capitalize">{formatDateTime(slotStart)} hs</dd></div>
            {receipt ? (
              <>
                <div className="flex justify-between gap-4 pt-2 border-t border-sand-200">
                  <dt className="text-sand-500">Tipo de pago</dt>
                  <dd className="font-semibold text-sand-800">{PAYMENT_TYPE_LABELS[receipt.paymentType]} · {PAYMENT_CONCEPT_LABELS[receipt.concept]}</dd>
                </div>
                <div className="flex justify-between gap-4"><dt className="text-sand-500">Monto abonado</dt><dd className="font-bold text-primary-600">{ars(receipt.amount)}</dd></div>
                {outcome.kind === 'CONFIRMED' && outcome.change > 0 && (
                  <div className="flex justify-between gap-4"><dt className="text-sand-500">Vuelto entregado</dt><dd className="font-semibold text-sand-800">{ars(outcome.change)}</dd></div>
                )}
              </>
            ) : (
              <div className="flex justify-between gap-4 pt-2 border-t border-sand-200"><dt className="text-sand-500">{paymentConcept === 'FULL' ? 'Total a abonar' : 'Seña a abonar'}</dt><dd className="font-bold text-primary-600">{ars(amountToPay)}</dd></div>
            )}
          </dl>

          <div className="flex flex-wrap justify-center gap-2">
            {receipt && (
              <Button variant="secondary" onClick={() => setReceiptOpen(true)} leftIcon={<Printer className="w-4 h-4" />}>
                Comprobante
              </Button>
            )}
            <Button variant="outline" onClick={() => setReminderOpen(true)} leftIcon={<Calendar className="w-4 h-4" />}>
              Recordatorio
            </Button>
            <Button variant="ghost" onClick={() => navigate('/app/agenda')}>
              Ver agenda
            </Button>
            <Button onClick={resetAll}>Reservar otro turno</Button>
          </div>
        </Card>

        <AppointmentReceiptModal
          isOpen={receiptOpen}
          onClose={() => setReceiptOpen(false)}
          appointmentData={{
            id: hold.data.appointmentId,
            patientName: patient.name,
            patientDni: patient.dni,
            patientEmail: patient.email,
            patientPhone: patient.phone,
            serviceName: service.name,
            startTime: slotStart,
            durationMinutes: service.durationMinutes,
            agreedPrice: service.basePrice,
            depositAmount,
          }}
          payment={
            receipt
              ? {
                  type: receipt.paymentType,
                  concept: receipt.concept,
                  amount: receipt.amount,
                  date: receipt.paymentDate,
                  transactionId: receipt.transactionId,
                }
              : undefined
          }
        />
        <ReminderNotificationModal
          isOpen={reminderOpen}
          onClose={() => setReminderOpen(false)}
          appointmentData={{
            id: hold.data.appointmentId,
            patientName: patient.name,
            patientPhone: patient.phone,
            serviceName: service.name,
            startTime: slotStart,
            durationMinutes: service.durationMinutes,
            depositAmount: receipt?.amount ?? depositAmount,
            agreedPrice: service.basePrice,
          }}
        />
      </div>
    );
  }

  // ─── Wizard ────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full flex flex-col items-center px-4 py-6 sm:py-10">
      <div className="w-full max-w-3xl">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h1 className="font-display text-xl sm:text-2xl font-bold text-sand-900">Reservar turno</h1>
          <span className="text-xs font-semibold text-sand-500">
            Paso {step} de {STEP_LABELS.length} · {STEP_LABELS[step - 1]}
          </span>
        </div>

        {/* Contador del bloqueo temporal */}
        {hold && !holdExpired && (
          <div
            role="timer"
            aria-live="polite"
            className="mb-5 flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl border bg-warning-50 border-warning-100 text-warning-700"
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Timer className="w-4 h-4 animate-pulse" />
              Horario bloqueado para esta reserva
            </div>
            <span className="font-display text-lg font-bold tabular-nums">{formatCountdown(remainingMs)}</span>
          </div>
        )}

        {errorMsg && (
          <div role="alert" className="mb-5 p-4 rounded-xl bg-danger-50 border border-danger-100 text-danger-700 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <Card>
          <Stepper currentStep={step} direction={direction} disableStepIndicators>
            {/* PASO 1: Paciente */}
            <Step>
              {/* Altura mínima: deja lugar a la lista de coincidencias sin que la recorte el Stepper */}
              <div className="flex flex-col min-h-[460px] pt-4">
                <div className="mb-5">
                  <h2 className="font-display text-2xl font-bold text-sand-900">¿Para quién es el turno?</h2>
                  <p className="text-sm text-sand-600">Buscá al paciente por DNI o por nombre y apellido.</p>
                </div>

                {patient ? (
                  <div className="border border-primary-200 bg-primary-50/40 rounded-xl p-4 flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-primary-500 text-white flex items-center justify-center flex-shrink-0">
                      <UserRound className="w-5 h-5" />
                    </div>
                    <dl className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <div className="sm:col-span-2 font-display text-lg font-bold text-sand-900">{patient.name}</div>
                      <div><dt className="inline text-sand-500">DNI: </dt><dd className="inline font-semibold text-sand-800">{patient.dni}</dd></div>
                      <div><dt className="inline text-sand-500">Tel: </dt><dd className="inline font-semibold text-sand-800">{patient.phone}</dd></div>
                      <div className="sm:col-span-2"><dt className="inline text-sand-500">Email: </dt><dd className="inline font-semibold text-sand-800 break-all">{patient.email}</dd></div>
                    </dl>
                    <Button size="sm" variant="ghost" onClick={() => setPatient(null)} leftIcon={<Pencil className="w-3.5 h-3.5" />}>
                      Cambiar
                    </Button>
                  </div>
                ) : (
                  <div className="px-1">
                    <PatientSearch autoFocus onSelect={setPatient} onAddNew={(q) => setAddPatientQuery(q)} />
                  </div>
                )}

                <div className="mt-auto pt-6 flex justify-end">
                  <Button disabled={!patient} onClick={() => goTo(STEP.SERVICE)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Continuar
                  </Button>
                </div>
              </div>
            </Step>

            {/* PASO 2: Servicio */}
            <Step>
              <div className="flex flex-col min-h-[440px] pt-4">
                <div className="mb-5">
                  <h2 className="font-display text-2xl font-bold text-sand-900">Elegí el tratamiento</h2>
                  <p className="text-sm text-sand-600">Seleccioná un tratamiento de la lista para ver su descripción completa.</p>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold text-sand-700 uppercase tracking-wider mb-2">Tratamiento</label>
                  <div className="px-1 py-1">
                    <GlideSelect
                      options={serviceOptions}
                      value={serviceId ? String(serviceId) : undefined}
                      onChange={(v) => setServiceId(Number(v))}
                      placeholder="Seleccioná un tratamiento…"
                      ariaLabel="Tratamiento"
                      menuWidth={420}
                      size="lg"
                      className="w-full"
                    />
                  </div>
                </div>

                {service && (
                  <div className="border border-primary-200 bg-primary-50/40 rounded-xl p-5 mb-6">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-display text-lg font-bold text-sand-900">{service.name}</h3>
                      <span className="flex-shrink-0 text-xs font-semibold px-2.5 py-1 bg-white border border-sand-200 text-sand-700 rounded-full">
                        {service.durationMinutes} min
                      </span>
                    </div>
                    <p className="text-sm text-sand-600 leading-relaxed mb-4">{service.description}</p>
                    <div className="flex items-baseline justify-between pt-3 border-t border-primary-200/60">
                      <div>
                        <span className="text-xs text-sand-500 block">Precio total</span>
                        <span className="text-lg font-extrabold text-sand-900">{ars(service.basePrice)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-primary-600 font-semibold block">Seña ({service.depositPercentage}%)</span>
                        <span className="text-sm font-bold text-primary-700">{ars((service.basePrice * service.depositPercentage) / 100)}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-auto flex justify-between">
                  <Button variant="ghost" onClick={() => goTo(STEP.PATIENT)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                    Atrás
                  </Button>
                  <Button disabled={!service} onClick={() => goTo(STEP.SCHEDULE)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Confirmar tratamiento
                  </Button>
                </div>
              </div>
            </Step>

            {/* PASO 3: Fecha y hora */}
            <Step>
              <div className="flex flex-col min-h-[440px] pt-4 space-y-5">
                <div>
                  <h2 className="font-display text-2xl font-bold text-sand-900">Elegí la fecha y el horario</h2>
                  <p className="text-sm text-sand-600">
                    {service ? `${service.name} · ${service.durationMinutes} min. ` : ''}
                    Los horarios ocupados o en reserva por otro usuario aparecen deshabilitados.
                  </p>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <label htmlFor="booking-date" className="block text-xs font-bold text-sand-700 uppercase tracking-wider mb-2">
                      Fecha
                    </label>
                    <input
                      id="booking-date"
                      type="date"
                      value={date}
                      min={todayInAR()}
                      onChange={(e) => e.target.value && setDate(e.target.value)}
                      className="bg-sand-50 border border-sand-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 outline-none"
                    />
                  </div>
                  <Button size="sm" variant="ghost" onClick={loadSlots} leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${slotsLoading ? 'animate-spin' : ''}`} />}>
                    Actualizar
                  </Button>
                </div>

                {slotsLoading && slots.length === 0 ? (
                  <div className="py-6 flex justify-center"><Spinner label="Cargando horarios" /></div>
                ) : slots.length === 0 ? (
                  <p className="text-sm text-sand-500 py-4">No hay horarios para esta fecha.</p>
                ) : slots.every((s) => !s.available) && !hold ? (
                  <p className="text-sm text-sand-600 py-4">No quedan horarios disponibles para esta fecha. Probá con otro día.</p>
                ) : (
                  <div role="radiogroup" aria-label="Horarios" className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {slots.map((slot) => {
                      const isOwnHold = !!hold && !holdExpired && hold.key === `${patient?.id}|${serviceId}|${slot.startTime}`;
                      const enabled = slot.available || isOwnHold;
                      const isSelected = slotStart === slot.startTime;
                      return (
                        <button
                          key={slot.startTime}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          disabled={!enabled}
                          title={enabled ? undefined : 'Horario no disponible'}
                          onClick={() => setSlotStart(slot.startTime)}
                          className={`py-2.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                            !enabled
                              ? 'bg-sand-100 text-sand-400 border-sand-200 line-through cursor-not-allowed'
                              : isSelected
                                ? 'bg-primary-500 text-white border-primary-500 shadow-soft'
                                : 'bg-sand-50 text-sand-700 border-sand-200 hover:border-primary-300 hover:bg-primary-50'
                          }`}
                        >
                          {slot.timeDisplay.replace(' hs', '')}
                        </button>
                      );
                    })}
                  </div>
                )}
                <p className="text-[11px] text-sand-500">
                  Al continuar, el horario queda bloqueado 10 minutos para que nadie más pueda reservarlo.
                </p>

                <div className="mt-auto pt-2 flex justify-between">
                  <Button variant="ghost" onClick={() => goTo(STEP.SERVICE)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                    Atrás
                  </Button>
                  <Button disabled={!slotStart} isLoading={isHolding} onClick={handleHoldSlot} rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Continuar
                  </Button>
                </div>
              </div>
            </Step>

            {/* PASO 4: Confirmación (E-2: editar) */}
            <Step>
              <div className="pt-4 space-y-5">
                <div>
                  <h2 className="font-display text-2xl font-bold text-sand-900">Revisá el turno</h2>
                  <p className="text-sm text-sand-600">Si algo no es correcto, podés editarlo antes de confirmar.</p>
                </div>

                {patient && service && slotStart && (
                  <dl className="divide-y divide-sand-100 border border-sand-200 rounded-xl text-sm">
                    <div className="flex items-center justify-between gap-4 p-4">
                      <div>
                        <dt className="text-xs text-sand-500">Paciente</dt>
                        <dd className="font-semibold text-sand-900">{patient.name} · DNI {patient.dni}</dd>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => goTo(STEP.PATIENT)} leftIcon={<Pencil className="w-3.5 h-3.5" />}>Editar</Button>
                    </div>
                    <div className="flex items-center justify-between gap-4 p-4">
                      <div>
                        <dt className="text-xs text-sand-500">Tratamiento</dt>
                        <dd className="font-semibold text-sand-900">{service.name} · {service.durationMinutes} min</dd>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => goTo(STEP.SERVICE)} leftIcon={<Pencil className="w-3.5 h-3.5" />}>Editar</Button>
                    </div>
                    <div className="flex items-center justify-between gap-4 p-4">
                      <div>
                        <dt className="text-xs text-sand-500">Fecha y hora</dt>
                        <dd className="font-semibold text-sand-900 capitalize">{formatDateTime(slotStart)} hs</dd>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => goTo(STEP.SCHEDULE)} leftIcon={<Pencil className="w-3.5 h-3.5" />}>Editar</Button>
                    </div>
                    <div className="p-4 space-y-1.5">
                      <div className="flex justify-between"><dt className="text-sand-600">Precio total</dt><dd className="font-semibold text-sand-900">{ars(service.basePrice)}</dd></div>
                      <div className="flex justify-between"><dt className="text-sand-600">Seña ({service.depositPercentage}%)</dt><dd className="font-semibold text-sand-900">{ars(depositAmount)}</dd></div>
                      <div className="flex justify-between"><dt className="text-sand-600">Saldo en consultorio</dt><dd className="font-semibold text-sand-900">{ars(service.basePrice - depositAmount)}</dd></div>
                    </div>
                  </dl>
                )}

                {/* Opción de pago: seña (parcial) o total. Refleja el monto a abonar ahora. */}
                {service && (
                  <fieldset>
                    <legend className="block text-xs font-bold text-sand-700 uppercase tracking-wider mb-2">
                      ¿Qué querés abonar ahora?
                    </legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {([
                        { id: 'DEPOSIT', label: PAYMENT_CONCEPT_LABELS.DEPOSIT, hint: `${service.depositPercentage}% del total`, amount: depositAmount },
                        { id: 'FULL', label: PAYMENT_CONCEPT_LABELS.FULL, hint: 'Abona el 100% ahora', amount: service.basePrice },
                      ] as const).map((opt) => {
                        const selected = paymentConcept === opt.id;
                        return (
                          <label
                            key={opt.id}
                            className={`flex items-center justify-between gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                              selected
                                ? 'border-primary-500 bg-primary-50/60 ring-2 ring-primary-500/20'
                                : 'border-sand-200 hover:border-primary-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="payment-concept"
                              value={opt.id}
                              checked={selected}
                              onChange={() => setPaymentConcept(opt.id)}
                              className="sr-only"
                            />
                            <span>
                              <span className="block text-sm font-semibold text-sand-900">{opt.label}</span>
                              <span className="block text-xs text-sand-500">{opt.hint}</span>
                            </span>
                            <span className={`text-sm font-bold ${selected ? 'text-primary-700' : 'text-sand-700'}`}>
                              {ars(opt.amount)}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    <p className="mt-2 flex items-baseline justify-between text-sm">
                      <span className="text-sand-600">Monto a pagar</span>
                      <span className="font-display text-xl font-bold text-primary-600">{ars(amountToPay)}</span>
                    </p>
                  </fieldset>
                )}

                <div className="flex justify-between pt-2">
                  <Button variant="ghost" onClick={() => goTo(STEP.SCHEDULE)} leftIcon={<ArrowLeft className="w-4 h-4" />}>Atrás</Button>
                  <Button disabled={holdExpired || !hold} onClick={() => goTo(STEP.PAYMENT)} rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Confirmar turno
                  </Button>
                </div>
              </div>
            </Step>

            {/* PASO 5: Registrar Pago */}
            <Step>
              <div className="pt-4">
                {hold && patient && service ? (
                  <RegisterPaymentStep
                    appointmentId={hold.data.appointmentId}
                    amountToPay={amountToPay}
                    paymentConcept={paymentConcept}
                    depositPercentage={service.depositPercentage}
                    agreedPrice={service.basePrice}
                    serviceName={service.name}
                    patientName={patient.name}
                    patientPhone={patient.phone}
                    initPointUrl={hold.data.initPointUrl}
                    holdExpired={holdExpired}
                    onBack={() => goTo(STEP.REVIEW)}
                    onPaid={({ receipt, change }) => setOutcome({ kind: 'CONFIRMED', receipt, change })}
                    onVirtualSent={() => setOutcome({ kind: 'PENDING_VIRTUAL' })}
                  />
                ) : (
                  <p className="text-sm text-sand-500">Volvé al paso anterior para bloquear un horario.</p>
                )}
              </div>
            </Step>
          </Stepper>
        </Card>
      </div>

      {/* Bloqueo vencido: se informa y se reinicia la reserva */}
      <Modal
        isOpen={holdExpired}
        onClose={restartAfterExpiry}
        hideCloseButton
        title={
          <span className="flex items-center gap-2">
            <TimerOff className="w-5 h-5 text-danger-600" />
            Se agotó el tiempo
          </span>
        }
        footer={<Button onClick={restartAfterExpiry}>Comenzar de nuevo</Button>}
      >
        <p className="text-sm text-sand-600">
          Pasaron los 10 minutos para completar la operación, así que el horario fue liberado y puede
          reservarlo otra persona. La reserva se reinicia en <strong className="text-sand-900">{Math.max(0, resetIn)} s</strong>.
        </p>
      </Modal>

      {/* E-1: alta de paciente (pendiente de implementación) */}
      <Modal
        isOpen={addPatientQuery !== null}
        onClose={() => setAddPatientQuery(null)}
        title="Agregar nuevo paciente"
        footer={<Button onClick={() => setAddPatientQuery(null)}>Entendido</Button>}
      >
        <p className="text-sm text-sand-600">
          No encontramos pacientes para <strong className="text-sand-800">“{addPatientQuery}”</strong>. El alta de
          pacientes desde esta ventana se implementará en la próxima etapa; al guardarlo, la reserva continuará con el
          paciente nuevo.
        </p>
      </Modal>
    </div>
  );
};
