import React, { useEffect, useState } from 'react';
import { servicesApi } from '../../services/api';
import { DermatologicService } from '../../types';
import { Modal, Button, Input } from '../../components/ui';

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** null = crear; objeto = editar. */
  service: DermatologicService | null;
  onSaved: () => void;
}

const ars = (n: number) => `$${n.toLocaleString('es-AR', { maximumFractionDigits: 2 })} ARS`;

/** Alta / edición de un servicio (nombre, descripción, precio, seña %, duración). */
export const ServiceFormModal: React.FC<ServiceFormModalProps> = ({ isOpen, onClose, service, onSaved }) => {
  const editing = !!service;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('30000');
  const [depositPercentage, setDepositPercentage] = useState('50');
  const [durationMinutes, setDurationMinutes] = useState('45');
  const [followUpIntervalDays, setFollowUpIntervalDays] = useState('0');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setName(service?.name ?? '');
    setDescription(service?.description ?? '');
    setBasePrice(String(service?.basePrice ?? 30000));
    setDepositPercentage(String(service?.depositPercentage ?? 50));
    setDurationMinutes(String(service?.durationMinutes ?? 45));
    setFollowUpIntervalDays(String(service?.followUpIntervalDays ?? 0));
  }, [isOpen, service]);

  const price = Number(basePrice) || 0;
  const pct = Number(depositPercentage) || 0;
  const depositAmount = Math.round((price * pct) / 100);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError('El nombre es obligatorio.');
    if (pct < 1 || pct > 100) return setError('El porcentaje de seña debe estar entre 1 y 100.');
    if (price <= 0) return setError('El precio debe ser mayor a cero.');

    const payload: Partial<DermatologicService> = {
      name: name.trim(),
      description: description.trim(),
      basePrice: price,
      depositPercentage: pct,
      durationMinutes: Number(durationMinutes) || 45,
      followUpIntervalDays: Number(followUpIntervalDays) || 0,
      active: service?.active ?? true,
    };

    setSaving(true);
    try {
      if (editing && service) await servicesApi.updateService(service.id, payload);
      else await servicesApi.createService(payload);
      onSaved();
      onClose();
    } catch {
      setError('No se pudo guardar el servicio. Intentá nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editing ? `Editar: ${service?.name}` : 'Nuevo tratamiento'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit} isLoading={saving}>{editing ? 'Guardar cambios' : 'Crear tratamiento'}</Button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Input label="Nombre del tratamiento *" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Bioestimulación de colágeno" />
        <div>
          <label className="block text-xs font-bold text-sand-700 mb-1">Descripción</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Protocolo, zonas de aplicación y beneficios…"
            className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Precio total (ARS) *" type="number" inputMode="numeric" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />
          <Input label="Seña (%) *" type="number" inputMode="numeric" value={depositPercentage} onChange={(e) => setDepositPercentage(e.target.value)} />
          <Input label="Duración (min) *" type="number" inputMode="numeric" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} />
          <Input label="Control sugerido (días)" type="number" inputMode="numeric" value={followUpIntervalDays} onChange={(e) => setFollowUpIntervalDays(e.target.value)} />
        </div>

        <div className="bg-primary-50/60 border border-primary-100 rounded-xl p-3 text-xs text-sand-700 flex justify-between">
          <span>Seña requerida: <strong className="text-primary-700">{ars(depositAmount)}</strong></span>
          <span>Saldo en consultorio: <strong>{ars(Math.max(0, price - depositAmount))}</strong></span>
        </div>

        {error && <p role="alert" className="text-sm text-danger-600 font-medium">{error}</p>}
      </form>
    </Modal>
  );
};
