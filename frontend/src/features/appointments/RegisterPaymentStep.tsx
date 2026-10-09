import React, { useState } from 'react';
import { Banknote, Smartphone, AlertCircle, Copy, Check, MessageCircle, ArrowLeft, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { appointmentsApi } from '../../services/api';
import { PaymentConcept, PaymentReceipt, PAYMENT_CONCEPT_LABELS } from '../../types';
import { Button, Input } from '../../components/ui';
import { cn } from '../../utils/cn';

type Method = 'CASH' | 'VIRTUAL';

interface RegisterPaymentStepProps {
  appointmentId: number;
  /** Monto efectivo a cobrar según la opción elegida (seña o total). */
  amountToPay: number;
  /** Concepto elegido en el paso de confirmación: seña (DEPOSIT) o pago total (FULL). */
  paymentConcept: Exclude<PaymentConcept, 'BALANCE'>;
  depositPercentage: number;
  agreedPrice: number;
  serviceName: string;
  patientName: string;
  patientPhone?: string;
  initPointUrl?: string;
  holdExpired: boolean;
  onBack: () => void;
  /** Pago en efectivo validado y registrado: turno CONFIRMED. */
  onPaid: (info: { receipt: PaymentReceipt; received: number; change: number }) => void;
  /** Pago virtual enviado: el turno se confirma al acreditarse (webhook). */
  onVirtualSent: () => void;
}

const ars = (n: number) => `$${n.toLocaleString('es-AR', { maximumFractionDigits: 2 })} ARS`;

/**
 * Caso de uso "Registrar Pago" aplicado a la seña del turno.
 * Flujo principal: efectivo. E-1: pago virtual (MercadoPago). E-2: validación fallida.
 */
export const RegisterPaymentStep: React.FC<RegisterPaymentStepProps> = ({
  appointmentId,
  amountToPay,
  paymentConcept,
  depositPercentage,
  agreedPrice,
  serviceName,
  patientName,
  patientPhone,
  initPointUrl,
  holdExpired,
  onBack,
  onPaid,
  onVirtualSent,
}) => {
  const [method, setMethod] = useState<Method>('CASH');
  const [received, setReceived] = useState<string>(String(amountToPay));
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const receivedNum = Number(received.replace(',', '.'));
  const change = Number.isFinite(receivedNum) ? Math.max(0, receivedNum - amountToPay) : 0;

  // Mantiene el monto recibido sincronizado si el usuario cambia la opción
  // (seña/total) en el paso anterior y vuelve a este paso sin remontarlo.
  React.useEffect(() => {
    setReceived(String(amountToPay));
  }, [amountToPay]);

  // E-2: validación de los datos ingresados antes de registrar.
  const validate = (): string | null => {
    if (!received.trim() || !Number.isFinite(receivedNum)) return 'Ingresá el monto recibido.';
    if (receivedNum <= 0) return 'El monto debe ser mayor a cero.';
    if (receivedNum < amountToPay) {
      return `El monto recibido es menor al importe a cobrar (${ars(amountToPay)}).`;
    }
    return null;
  };

  const handleConfirmCash = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const err = validate();
    setFieldError(err);
    if (err) return;

    setIsSaving(true);
    try {
      const receipt = await appointmentsApi.registerDepositPayment(appointmentId, {
        paymentType: 'CASH',
        amount: amountToPay,
        concept: paymentConcept,
        agreedPrice,
      });
      onPaid({ receipt, received: receivedNum, change });
    } catch (error: any) {
      // E-2: el pago no pudo validarse en el sistema.
      setSubmitError(
        error?.response?.data?.message ||
          'No se pudo registrar el pago. El turno sigue pendiente; revisá los datos e intentá nuevamente.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const copyLink = async () => {
    if (!initPointUrl) return;
    try {
      await navigator.clipboard.writeText(initPointUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* el navegador no permitió copiar */
    }
  };

  const conceptLabel = PAYMENT_CONCEPT_LABELS[paymentConcept].toLowerCase();

  const patientWhatsapp = patientPhone?.replace(/\D/g, '');
  const virtualMessage = encodeURIComponent(
    `Hola ${patientName}, te enviamos el link para abonar ${conceptLabel === 'pago total' ? 'el total' : 'la seña'} de tu turno de ${serviceName} (${ars(amountToPay)}). ` +
      `El turno queda reservado por 10 minutos: ${initPointUrl ?? ''}`
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold text-sand-900">
          {paymentConcept === 'FULL' ? 'Registrar pago total' : 'Registrar pago de la seña'}
        </h2>
        <p className="text-sm text-sand-600">Seleccioná el medio de pago y completá los datos.</p>
      </div>

      {/* Datos de la operación */}
      <div className="bg-sand-50 border border-sand-200 rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="block text-xs text-sand-500">Operación</span>
          <span className="font-semibold text-sand-800">Turno #{String(appointmentId).padStart(6, '0')}</span>
        </div>
        <div>
          <span className="block text-xs text-sand-500">Concepto</span>
          <span className="font-semibold text-sand-800">
            {paymentConcept === 'FULL' ? PAYMENT_CONCEPT_LABELS.FULL : `${PAYMENT_CONCEPT_LABELS.DEPOSIT} (${depositPercentage}%)`}
          </span>
        </div>
        <div className="col-span-2 pt-2 border-t border-sand-200 flex items-baseline justify-between">
          <span className="text-sand-600">Importe a cobrar</span>
          <span className="font-display text-xl font-bold text-primary-600">{ars(amountToPay)}</span>
        </div>
      </div>

      {/* Medio de pago */}
      <fieldset>
        <legend className="block text-xs font-bold text-sand-700 uppercase tracking-wider mb-2">Medio de pago</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {([
            { id: 'CASH', label: 'Efectivo', hint: 'Cobro en el consultorio', icon: Banknote },
            { id: 'VIRTUAL', label: 'Pago virtual', hint: 'Link de MercadoPago', icon: Smartphone },
          ] as const).map((opt) => {
            const Icon = opt.icon;
            const selected = method === opt.id;
            return (
              <label
                key={opt.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors',
                  selected ? 'border-primary-500 bg-primary-50/60 ring-2 ring-primary-500/20' : 'border-sand-200 hover:border-primary-300'
                )}
              >
                <input
                  type="radio"
                  name="payment-method"
                  value={opt.id}
                  checked={selected}
                  onChange={() => {
                    setMethod(opt.id);
                    setSubmitError(null);
                  }}
                  className="sr-only"
                />
                <span className={cn('w-9 h-9 rounded-lg flex items-center justify-center', selected ? 'bg-primary-500 text-white' : 'bg-sand-100 text-sand-600')}>
                  <Icon className="w-5 h-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-sand-900">{opt.label}</span>
                  <span className="block text-xs text-sand-500">{opt.hint}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {submitError && (
        <div role="alert" className="p-3 rounded-xl bg-danger-50 border border-danger-100 text-danger-700 text-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {method === 'CASH' ? (
        <form onSubmit={handleConfirmCash} className="space-y-4" noValidate>
          <div className="max-w-xs">
            <Input
              label="Monto recibido (ARS) *"
              name="received"
              inputMode="decimal"
              value={received}
              onChange={(e) => {
                setReceived(e.target.value);
                setFieldError(null);
              }}
              error={fieldError ?? undefined}
            />
          </div>
          {change > 0 && !fieldError && (
            <p className="text-sm text-sand-700">
              Vuelto a entregar: <strong className="text-sand-900">{ars(change)}</strong>
            </p>
          )}

          <div className="flex justify-between pt-2">
            <Button type="button" variant="ghost" onClick={onBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Atrás
            </Button>
            <Button type="submit" isLoading={isSaving} disabled={holdExpired}>
              Confirmar pago
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-sand-600">
            Enviale al paciente el link de pago. El turno se confirma automáticamente cuando MercadoPago acredita
            la seña, siempre que el pago se complete antes de que venza el bloqueo de 10 minutos.
          </p>
          {initPointUrl ? (
            <div className="space-y-4">
              {/* QR de pago: el paciente escanea y abona sin necesidad de recibir el link */}
              <div className="flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-sand-200 bg-sand-50 p-4">
                <div className="shrink-0 rounded-lg border border-sand-200 bg-white p-2">
                  <QRCodeSVG value={initPointUrl} size={120} level="M" />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <p className="flex items-center justify-center gap-2 text-sm font-semibold text-sand-900 sm:justify-start">
                    <QrCode className="h-4 w-4 text-primary-600" />
                    Escanear para abonar
                  </p>
                  <p className="text-xs text-sand-600">
                    El paciente puede escanearlo con la cámara o la app de MercadoPago y abonar la seña al
                    instante, sin salir del consultorio.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="secondary" onClick={copyLink} leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}>
                  {copied ? 'Link copiado' : 'Copiar link de pago'}
                </Button>
                {patientWhatsapp && (
                  <a
                    href={`https://wa.me/${patientWhatsapp}?text=${virtualMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[42px] rounded-xl text-sm font-semibold border border-primary-300 text-primary-600 hover:bg-primary-50 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Enviar por WhatsApp
                  </a>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-danger-600">No se generó el link de pago para este turno.</p>
          )}

          <div className="flex justify-between pt-2">
            <Button type="button" variant="ghost" onClick={onBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Atrás
            </Button>
            <Button type="button" onClick={onVirtualSent} disabled={holdExpired || !initPointUrl}>
              Link enviado
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
