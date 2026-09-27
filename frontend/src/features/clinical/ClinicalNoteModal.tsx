import React, { useEffect, useState } from 'react';
import { Pencil, ShieldCheck } from 'lucide-react';
import { clinicalApi } from '../../services/api';
import { ClinicalEntry } from '../../types';
import { Modal, Button } from '../../components/ui';
import { TreatmentPhotos } from './TreatmentPhotos';
import { isMedicalStaff } from '../../utils/session';

const TZ = 'America/Argentina/Buenos_Aires';

interface ClinicalNoteModalProps {
  entry: ClinicalEntry | null;
  patientId: number;
  onClose: () => void;
  onSaved: (updated: ClinicalEntry) => void;
}

/**
 * Muestra una nota clínica y permite editarla (no eliminar).
 * Cada edición queda auditada en el backend.
 */
export const ClinicalNoteModal: React.FC<ClinicalNoteModalProps> = ({ entry, patientId, onClose, onSaved }) => {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setContent(entry?.content ?? '');
    setEditing(false);
    setError(null);
  }, [entry]);

  if (!entry) return null;

  const save = async () => {
    if (!content.trim()) { setError('La nota no puede quedar vacía.'); return; }
    setSaving(true);
    setError(null);
    try {
      const updated = await clinicalApi.updateClinicalEntry(entry.id, content.trim());
      onSaved({ ...entry, ...updated, content: content.trim() });
      setEditing(false);
    } catch {
      setError('No se pudo guardar la edición. Intentá nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={!!entry}
      onClose={onClose}
      size="lg"
      title={
        <span className="flex flex-col">
          <span>Nota clínica</span>
          <span className="text-xs font-normal text-sand-500">
            {entry.serviceName ? `${entry.serviceName} · ` : ''}
            {new Intl.DateTimeFormat('es-AR', { timeZone: TZ, dateStyle: 'long', timeStyle: 'short' }).format(new Date(entry.createdAt))} hs
          </span>
        </span>
      }
      footer={
        editing ? (
          <>
            <Button variant="ghost" onClick={() => { setEditing(false); setContent(entry.content); }}>Cancelar</Button>
            <Button onClick={save} isLoading={saving}>Guardar cambios</Button>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={onClose}>Cerrar</Button>
            <Button onClick={() => setEditing(true)} leftIcon={<Pencil className="w-4 h-4" />}>Editar</Button>
          </>
        )
      }
    >
      <div className="space-y-3">
        {editing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            autoFocus
            className="w-full bg-sand-50 border border-sand-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 outline-none"
          />
        ) : (
          <p className="text-sm text-sand-800 leading-relaxed whitespace-pre-wrap">{entry.content}</p>
        )}

        <p className="text-[11px] text-sand-500 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-primary-500" />
          Autor: {entry.authorFullName}. Toda edición queda registrada para cumplimiento legal; las notas no se pueden eliminar.
        </p>
        {error && <p role="alert" className="text-sm text-danger-600 font-medium">{error}</p>}

        {/* Fotos asociadas a ESTA nota (por el turno de la nota). Solo aquí se ven. */}
        {!editing && (
          <div className="pt-4 border-t border-sand-100">
            <TreatmentPhotos
              appointmentId={entry.appointmentId}
              patientId={entry.patientId ?? patientId}
              serviceName={entry.serviceName}
              editable={isMedicalStaff()}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};
