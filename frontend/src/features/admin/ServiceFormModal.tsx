import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { servicesApi } from '../../services/api';
import { DermatologicService } from '../../types';
import { Modal, Button, Input, Callout } from '../../components/ui';

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** null = crear; objeto = editar. */
  service: DermatologicService | null;
  onSaved: () => void;
}

interface ServiceTemplate {
  name: string;
  description: string;
  durationMinutes: number;
  basePrice: number;
  depositPercentage: number;
  followUpIntervalDays: number;
}

const SERVICE_TEMPLATES: ServiceTemplate[] = [
  {
    name: 'Consulta Dermatológica',
    description: 'Evaluación clínica integral de la piel, lunares y afecciones cutáneas.',
    durationMinutes: 30,
    basePrice: 30000,
    depositPercentage: 50,
    followUpIntervalDays: 0,
  },
  {
    name: 'Peeling Químico Facial',
    description: 'Exfoliación química controlada para renovación celular, manchas y textura cutánea.',
    durationMinutes: 45,
    basePrice: 45000,
    depositPercentage: 50,
    followUpIntervalDays: 21,
  },
  {
    name: 'Toxina Botulínica',
    description: 'Aplicación de toxina botulínica en tercio superior para líneas de expresión.',
    durationMinutes: 45,
    basePrice: 120000,
    depositPercentage: 50,
    followUpIntervalDays: 15,
  },
  {
    name: 'Relleno Ácido Hialurónico',
    description: 'Armonización y reposición de volumen facial con ácido hialurónico reticulado.',
    durationMinutes: 60,
    basePrice: 150000,
    depositPercentage: 50,
    followUpIntervalDays: 30,
  },
  {
    name: 'Limpieza Profunda e Hidratación',
    description: 'Higiene facial profunda, extracciones, descongestión y principios activos hidratantes.',
    durationMinutes: 60,
    basePrice: 35000,
    depositPercentage: 50,
    followUpIntervalDays: 30,
  },
];

const ars = (n: number) => `$${n.toLocaleString('es-AR', { maximumFractionDigits: 2 })} ARS`;

/** Alta / edición de un servicio (nombre, descripción, precio, seña %, duración, control). */
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

  const applyTemplate = (tpl: ServiceTemplate) => {
    setName(tpl.name);
    setDescription(tpl.description);
    setDurationMinutes(String(tpl.durationMinutes));
    setBasePrice(String(tpl.basePrice));
    setDepositPercentage(String(tpl.depositPercentage));
    setFollowUpIntervalDays(String(tpl.followUpIntervalDays));
    setError(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const dur = Number(durationMinutes);
    const followUp = Number(followUpIntervalDays);

    if (!name.trim()) return setError('El nombre del tratamiento es obligatorio.');
    if (name.trim().length > 100) return setError('El nombre del tratamiento no puede superar los 100 caracteres.');
    if (description.trim().length > 500) return setError('La descripción no puede superar los 500 caracteres.');
    if (isNaN(dur) || dur < 10 || dur > 480) return setError('La duración debe estar entre 10 y 480 minutos.');
    if (isNaN(price) || price <= 0) return setError('El precio total debe ser mayor a cero.');
    if (isNaN(pct) || pct < 1 || pct > 100) return setError('El porcentaje de seña debe estar entre 1 y 100.');
    if (isNaN(followUp) || followUp < 0) return setError('El intervalo de control sugerido debe ser de 0 días o más.');

    const payload: Partial<DermatologicService> = {
      name: name.trim(),
      description: description.trim(),
      basePrice: price,
      depositPercentage: pct,
      durationMinutes: dur,
      followUpIntervalDays: followUp,
      active: service?.active ?? true,
    };

    setSaving(true);
    try {
      if (editing && service) {
        await servicesApi.updateService(service.id, payload);
      } else {
        await servicesApi.createService(payload);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      let serverMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.message;

      if (!serverMsg && err?.response?.data?.details) {
        const detailsObj = err.response.data.details;
        if (typeof detailsObj === 'object') {
          serverMsg = Object.values(detailsObj).join('. ');
        } else if (typeof detailsObj === 'string') {
          serverMsg = detailsObj;
        }
      }

      if (!serverMsg && err?.message && !err.message.includes('status code')) {
        serverMsg = err.message;
      }

      setError(serverMsg || 'No se pudo guardar el tratamiento. Intentá nuevamente.');
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
          <Button variant="ghost" onClick={onClose} className="min-h-[44px]">
            Cancelar
          </Button>
          <Button onClick={submit} isLoading={saving} className="min-h-[44px]">
            {editing ? 'Guardar cambios' : 'Crear tratamiento'}
          </Button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        {!editing && (
          <div>
            <label className="block text-xs font-bold text-sand-700 mb-1.5">
              Plantillas de tratamientos habituales
            </label>
            <div className="flex flex-wrap gap-2">
              {SERVICE_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.name}
                  type="button"
                  onClick={() => applyTemplate(tpl)}
                  className="min-h-[44px] px-3 py-2 text-xs font-medium rounded-xl border border-sand-200 bg-sand-50/80 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-800 text-sand-700 transition-colors text-left flex items-center gap-1.5 active:scale-[0.98]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
                  <span>{tpl.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <Input
          label="Nombre del tratamiento *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Bioestimulación de colágeno"
          className="min-h-[44px]"
        />

        <div>
          <label className="block text-xs font-bold text-sand-700 mb-1">Descripción</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Protocolo, zonas de aplicación y beneficios…"
            className="w-full bg-sand-50 border border-sand-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 outline-none min-h-[88px]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Precio total (ARS) *"
            type="number"
            inputMode="numeric"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            className="min-h-[44px]"
          />
          <Input
            label="Seña (%) *"
            type="number"
            inputMode="numeric"
            value={depositPercentage}
            onChange={(e) => setDepositPercentage(e.target.value)}
            className="min-h-[44px]"
          />
          <Input
            label="Duración (min) *"
            type="number"
            inputMode="numeric"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            className="min-h-[44px]"
          />
          <Input
            label="Control sugerido (días)"
            type="number"
            inputMode="numeric"
            value={followUpIntervalDays}
            onChange={(e) => setFollowUpIntervalDays(e.target.value)}
            className="min-h-[44px]"
          />
        </div>

        <div className="bg-primary-50/60 border border-primary-100 rounded-xl p-3 text-xs text-sand-700 flex justify-between">
          <span>
            Seña requerida: <strong className="text-primary-700">{ars(depositAmount)}</strong>
          </span>
          <span>
            Saldo en consultorio: <strong>{ars(Math.max(0, price - depositAmount))}</strong>
          </span>
        </div>

        {error && (
          <Callout intent="error" title="No se pudo guardar el tratamiento" onClose={() => setError(null)}>
            {error}
          </Callout>
        )}
      </form>
    </Modal>
  );
};
