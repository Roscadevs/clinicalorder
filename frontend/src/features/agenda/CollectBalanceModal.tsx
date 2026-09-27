import React, { useState } from 'react';
import { Banknote, Smartphone, Landmark } from 'lucide-react';
import { appointmentsApi } from '../../services/api';
import { Appointment, PaymentType, PAYMENT_TYPE_LABELS } from '../../types';
import { Modal, Button, Input } from '../../components/ui';
import { cn } from '../../utils/cn';

interface CollectBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  /** Se llama tras liquidar el saldo con éxito (turno -> COMPLETED). */
  onPaid: () => void;
}

const ars = (n: number) => `$${n.toLocaleString('es-AR', { maximumFractionDigits: 2 })} ARS`;

const METHODS: { id: PaymentType; icon: typeof Banknote }[] = [
  { id: 'CASH', icon: Banknote },
  { id: 'MERCADOPAGO', icon: Smartphone },
  { id: 'BANK_TRANSFER', icon: Landmark },
];

/**
 * Cobro del saldo restante en mostrador (liquida el turno: CONFIRMED -> COMPLETED).
 * El saldo es el precio acordado menos la seña ya abonada.
 */
export const CollectBalanceModal: React.FC<CollectBalanceModalProps> = ({ isOpen, onClose, appointment, onPaid }) => {
  const [method, setMethod] = useState<PaymentType>('CASH');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!appointment) return null;

  // Sin dato de seña en el turno, se asume el 50% (regla vigente). El backend recalcula.
  const deposit = appointment.agreedPrice * 0.5;
  const balance = Math.max(0, appointment.agreedPrice - deposit);

  const handleConfirm = async () => {
    setError(null);
    setIsSaving(true);
    try {
      await appointmentsApi.finalizePayment(appointment.id, balance, method);
      onPaid();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo registrar el cobro. Intentá nuevamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cobrar saldo en mostrador"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleConfirm} isLoading={isSaving}>Registrar cobro</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="bg-sand-50 border border-sand-200 rounded-xl p-4 text-sm space-y-1.5">
          <div className="flex justify-between"><span className="text-sand-500">Paciente</span><span className="font-semibold text-sand-800">{appointment.patientName}</span></div>
          <div className="flex justify-between"><span className="text-sand-500">Tratamiento</span><span className="font-semibold text-sand-800 text-right">{appointment.serviceName}</span></div>
          <div className="flex justify-between border-t border-sand-200 pt-1.5"><span className="text-sand-500">Precio total</span><span className="font-semibold text-sand-800">{ars(appointment.agreedPrice)}</span></div>
          <div className="flex justify-between"><span className="text-sand-500">Seña abonada</span><span className="font-semibold text-sand-800">- {ars(deposit)}</span></div>
          <div className="flex justify-between text-base pt-1.5 border-t border-sand-200"><span className="font-bold text-sand-800">Saldo a cobrar</span><span className="font-display font-bold text-primary-600">{ars(balance)}</span></div>
        </div>

        <fieldset>
          <legend className="block text-xs font-bold text-sand-700 uppercase tracking-wider mb-2">Medio de pago</legend>
          <div className="grid grid-cols-3 gap-2">
            {METHODS.map((m) => {
              const Icon = m.icon;
              const selected = method === m.id;
              return (
                <label
                  key={m.id}
                  className={cn(
                    'flex flex-col items-center gap-1.5 p-3 rounded-xl border cursor-pointer text-center transition-colors',
                    selected ? 'border-primary-500 bg-primary-50/60 ring-2 ring-primary-500/20' : 'border-sand-200 hover:border-primary-300'
                  )}
                >
                  <input type="radio" name="balance-method" value={m.id} checked={selected} onChange={() => setMethod(m.id)} className="sr-only" />
                  <Icon className={cn('w-5 h-5', selected ? 'text-primary-600' : 'text-sand-500')} />
                  <span className="text-[11px] font-semibold text-sand-700 leading-tight">{PAYMENT_TYPE_LABELS[m.id]}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {error && <p role="alert" className="text-sm text-danger-600 font-medium">{error}</p>}
      </div>
    </Modal>
  );
};
