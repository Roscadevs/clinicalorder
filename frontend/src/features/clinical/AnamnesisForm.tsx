import React, { useState } from 'react';
import { FileText, AlertTriangle, CheckCircle, Save, Pencil, ShieldCheck } from 'lucide-react';
import { clinicalApi } from '../../services/api';
import { MedicalRecord } from '../../types';
import { Button, Callout, toast } from '../../components/ui';
import { currentUserId } from '../../utils/session';
import { cn } from '../../utils/cn';

interface AnamnesisFormProps {
  patientId: number;
  record: Partial<MedicalRecord>;
  onChange: (record: Partial<MedicalRecord>) => void;
}

const PATOLOGIAS = [
  { key: 'hasHta', label: 'Hipertensión (HTA)' },
  { key: 'hasDbt', label: 'Diabetes (DBT)' },
  { key: 'hasHypothyroidism', label: 'Hipotiroidismo' },
  { key: 'hasHyperthyroidism', label: 'Hipertiroidismo' },
  { key: 'hasAnemia', label: 'Anemia' },
  { key: 'hasAutoimmuneDiseases', label: 'Enf. Autoinmune' },
  { key: 'hasGlaucoma', label: 'Glaucoma' },
  { key: 'hasCoagulationDisorders', label: 'Trast. Coagulación' },
  { key: 'hasScarringAlterations', label: 'Queloides / Cicatrización' },
] as const;

const ALERGIAS = [
  { key: 'allergyAnesthesia', label: 'Anestésicos (Lidocaína)' },
  { key: 'allergyEgg', label: 'Huevo / Derivados' },
  { key: 'allergyFish', label: 'Pescado / Yodo' },
] as const;

const FITZ = ['I', 'II', 'III', 'IV', 'V', 'VI'] as const;

/**
 * Ficha de anamnesis. Por defecto en SOLO LECTURA; el botón "Editar" habilita
 * la edición y al guardar vuelve a lectura. Cada guardado genera auditoría en el
 * backend. Los campos se mantienen respecto del diseño previo.
 */
export const AnamnesisForm: React.FC<AnamnesisFormProps> = ({ patientId, record, onChange }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Partial<MedicalRecord>>(record);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const startEdit = () => { setDraft(record); setEditing(true); setSaved(false); setErrorMsg(null); };
  const cancel = () => { setDraft(record); setEditing(false); setErrorMsg(null); };
  const set = (patch: Partial<MedicalRecord>) => setDraft((d) => ({ ...d, ...patch }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    try {
      const result = await clinicalApi.saveMedicalRecord(patientId, draft, currentUserId() ?? 2);
      onChange(result);
      setEditing(false);
      setSaved(true);
      toast.success('Ficha clínica guardada exitosamente');
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setErrorMsg('No se pudo guardar la ficha clínica en este momento.');
      toast.friendlyError('No pudimos guardar los cambios de la ficha clínica', {
        description: 'Tus modificaciones no se han perdido. Podés reintentar en unos instantes.',
        onRetry: () => {
          handleSave(e);
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  const patologiasActivas = PATOLOGIAS.filter((p) => Boolean(record[p.key as keyof MedicalRecord]));
  const alergiasActivas = ALERGIAS.filter((a) => Boolean(record[a.key as keyof MedicalRecord]));

  // ── MODO LECTURA ────────────────────────────────────────────────────────────
  if (!editing) {
    return (
      <div className="space-y-5">
        <div className="flex justify-between items-center border-b border-sand-100 pb-3">
          <h3 className="font-display font-bold text-sand-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary-500" /> Ficha clínica
          </h3>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="text-xs font-bold text-success-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Guardado
              </span>
            )}
            <Button size="sm" onClick={startEdit} leftIcon={<Pencil className="w-4 h-4" />}>Editar</Button>
          </div>
        </div>

        <ReadRow label="Fototipo (Fitzpatrick)" value={`Tipo ${record.fitzpatrickPhototype ?? '—'}`} />
        <ReadRow
          label="Antecedentes patológicos"
          value={patologiasActivas.length ? patologiasActivas.map((p) => p.label).join(', ') : 'Sin antecedentes registrados'}
        />
        <div>
          <span className="block text-[11px] font-bold text-danger-700 uppercase tracking-wider mb-1 flex items-center">
            <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Alergias
          </span>
          <p className={cn('text-sm', alergiasActivas.length ? 'text-danger-700 font-semibold' : 'text-sand-600')}>
            {alergiasActivas.length ? alergiasActivas.map((a) => a.label).join(', ') : 'Sin alergias conocidas'}
          </p>
        </div>
        <ReadRow label="Plan de tratamiento" value={record.treatmentPlan || 'Sin plan registrado'} block />

        <p className="text-[11px] text-sand-400 flex items-center gap-1.5 pt-2 border-t border-sand-100">
          <ShieldCheck className="w-3.5 h-3.5 text-primary-500" />
          Cada edición de la ficha queda registrada automáticamente para cumplimiento legal.
        </p>
      </div>
    );
  }

  // ── MODO EDICIÓN ────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSave} className="space-y-5">
      <div className="flex justify-between items-center border-b border-sand-100 pb-3">
        <h3 className="font-display font-bold text-sand-900 flex items-center gap-2">
          <Pencil className="w-4 h-4 text-primary-500" /> Editar ficha clínica
        </h3>
      </div>

      {errorMsg && (
        <Callout intent="error" title="Atención" onClose={() => setErrorMsg(null)}>
          {errorMsg} Podés intentar guardar nuevamente con el botón de abajo.
        </Callout>
      )}

      <div>
        <label className="block text-[11px] font-bold text-sand-700 uppercase tracking-wider mb-2">
          Fototipo cutáneo (Fitzpatrick)
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {FITZ.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => set({ fitzpatrickPhototype: type })}
              className={cn(
                'p-2 rounded-xl border text-xs font-bold transition-all min-h-[40px]',
                draft.fitzpatrickPhototype === type
                  ? 'border-primary-500 bg-primary-50 text-primary-700 ring-2 ring-primary-500/20'
                  : 'border-sand-200 bg-sand-50 text-sand-600 hover:bg-sand-100'
              )}
            >
              Tipo {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-sand-700 uppercase tracking-wider mb-2">Antecedentes patológicos</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          {PATOLOGIAS.map((item) => (
            <label key={item.key} className="flex items-center gap-2 bg-sand-50 p-2.5 rounded-xl border border-sand-200 cursor-pointer hover:bg-sand-100/60 min-h-[42px]">
              <input
                type="checkbox"
                checked={Boolean(draft[item.key as keyof MedicalRecord])}
                onChange={(e) => set({ [item.key]: e.target.checked } as Partial<MedicalRecord>)}
                className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
              />
              <span className="font-medium text-sand-700">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-danger-700 uppercase tracking-wider mb-2 flex items-center">
          <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Alergias conocidas
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          {ALERGIAS.map((item) => (
            <label key={item.key} className="flex items-center gap-2 bg-danger-50/60 p-2.5 rounded-xl border border-danger-100 cursor-pointer min-h-[42px]">
              <input
                type="checkbox"
                checked={Boolean(draft[item.key as keyof MedicalRecord])}
                onChange={(e) => set({ [item.key]: e.target.checked } as Partial<MedicalRecord>)}
                className="rounded text-danger-600 focus:ring-danger-500 w-4 h-4"
              />
              <span className="font-semibold text-danger-700">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-sand-700 uppercase tracking-wider mb-1">
          Plan de tratamiento y protocolo
        </label>
        <textarea
          rows={3}
          value={draft.treatmentPlan || ''}
          onChange={(e) => set({ treatmentPlan: e.target.value })}
          placeholder="Ej. Protocolo de 3 sesiones de Peeling Mandélico 30%..."
          className="w-full bg-sand-50 border border-sand-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 outline-none"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={cancel}>Cancelar</Button>
        <Button type="submit" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
          Guardar cambios
        </Button>
      </div>
    </form>
  );
};

const ReadRow: React.FC<{ label: string; value: string; block?: boolean }> = ({ label, value, block }) => (
  <div>
    <span className="block text-[11px] font-bold text-sand-700 uppercase tracking-wider mb-1">{label}</span>
    <p className={cn('text-sm text-sand-800', block && 'whitespace-pre-wrap leading-relaxed')}>{value}</p>
  </div>
);
