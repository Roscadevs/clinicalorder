import React, { useEffect, useState } from 'react';
import { FileText, Sparkles, AlertCircle, Calendar, CheckCircle2 } from 'lucide-react';
import { clinicalApi } from '../../services/api';
import { Appointment, ClinicalEntry, Patient } from '../../types';
import { Modal, Button, Select, Callout } from '../../components/ui';

interface NewClinicalNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  appointments: Appointment[];
  onSaved: (entry: ClinicalEntry) => void;
}

const TEMPLATES = [
  {
    name: 'Toxina Botulínica',
    text: 'Procedimiento: Toxina Botulínica. Zonas: frente, entrecejo y periocular (24U totales). Dilución estándar 1:1. Buena tolerancia del paciente, sin complicaciones agudas inmediatas. Pautas: no acostarse ni frotar la zona por 4 horas. Control evolutivo en 15 días.',
  },
  {
    name: 'Peeling Químico',
    text: 'Procedimiento: Peeling Químico Facial. Ácido mandélico 30% + retinol 1%. Tiempo de exposición: 4 minutos. Eritema leve esperado, neutralizado con solución descongestiva. Se indica crema regeneradora y FPS 50+ cada 3 horas.',
  },
  {
    name: 'Ácido Hialurónico',
    text: 'Procedimiento: Relleno con Ácido Hialurónico reticulado (1 ml). Técnica con microcánula 25G en región labial y surcos. Anestesia tópica. Modelado simétrico, sin hematomas ni signos isquémicos inmediatos. Hielo local intermitente.',
  },
  {
    name: 'Limpieza Profunda',
    text: 'Procedimiento: Limpieza Facial Profunda con punta de diamante y extracción atraumática. Descongestión con máscara de caléndula y alta frecuencia. Piel limpia y luminosa, sin lesiones residuales.',
  },
];

const fmtDate = (iso: string) => {
  try {
    return new Intl.DateTimeFormat('es-AR', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'America/Argentina/Buenos_Aires',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

/**
 * Formulario modal para registrar una nueva nota de evolución clínica de un paciente.
 * Exclusivo para personal médico. Los datos se cifran con AES-256-GCM en el backend.
 */
export const NewClinicalNoteModal: React.FC<NewClinicalNoteModalProps> = ({
  isOpen,
  onClose,
  patient,
  appointments,
  onSaved,
}) => {
  const [appointmentId, setAppointmentId] = useState<number | ''>('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setContent('');
    // Preselecciona el turno más reciente si existe, o 101 por defecto
    if (appointments && appointments.length > 0) {
      setAppointmentId(appointments[0].id);
    } else {
      setAppointmentId(101);
    }
  }, [isOpen, appointments]);

  const applyTemplate = (tplText: string) => {
    if (content.trim()) {
      setContent((prev) => `${prev}\n\n${tplText}`);
    } else {
      setContent(tplText);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!appointmentId) {
      return setError('Debés seleccionar el turno o sesión asociada a esta evolución clínica.');
    }
    if (content.trim().length < 10) {
      return setError('La nota de evolución debe contener al menos 10 caracteres explicativos.');
    }

    setSaving(true);
    try {
      const newEntry = await clinicalApi.addClinicalEntry(Number(appointmentId), content.trim());
      // Enriquecer con el nombre del servicio si el turno lo tiene
      const matchedAppt = appointments.find((a) => a.id === Number(appointmentId));
      if (matchedAppt && !newEntry.serviceName) {
        newEntry.serviceName = matchedAppt.serviceName;
      } else if (!newEntry.serviceName) {
        newEntry.serviceName = 'Consulta dermatológica';
      }
      onSaved(newEntry);
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'No se pudo registrar la nota clínica. Por favor, reintentá en unos instantes.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Nueva nota de evolución clínica"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={submit} isLoading={saving} leftIcon={<CheckCircle2 className="w-4 h-4" />}>
            Guardar evolución
          </Button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        {/* Paciente */}
        <div className="p-3 rounded-xl bg-sand-100 border border-sand-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-sand-500 font-medium">Paciente:</span>{' '}
            <strong className="text-sand-900">{patient.name}</strong>
          </div>
          <div>
            <span className="text-sand-500 font-medium">DNI:</span>{' '}
            <strong className="text-sand-900">{patient.dni}</strong>
          </div>
        </div>

        {/* Turno asociado */}
        <div>
          <label className="block text-xs font-bold text-sand-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary-600" />
            Turno / Sesión asociada *
          </label>
          {appointments && appointments.length > 0 ? (
            <Select
              value={String(appointmentId)}
              onChange={(e) => setAppointmentId(Number(e.target.value))}
            >
              {appointments.map((appt) => (
                <option key={appt.id} value={appt.id}>
                  {fmtDate(appt.startTime)} — {appt.serviceName || 'Consulta médica'} (Turno #{appt.id})
                </option>
              ))}
            </Select>
          ) : (
            <div className="space-y-1.5">
              <Select
                value={String(appointmentId)}
                onChange={(e) => setAppointmentId(Number(e.target.value))}
              >
                <option value="101">Consulta médica general (Sesión #101)</option>
              </Select>
              <p className="text-[11px] text-sand-400">
                El paciente no registra turnos previos en agenda; se vinculará a la consulta inicial del día.
              </p>
            </div>
          )}
        </div>

        {/* Plantillas clínicas rápidas */}
        <div>
          <label className="block text-xs font-bold text-sand-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Plantillas rápidas de procedimiento
          </label>
          <div className="flex flex-wrap gap-1.5">
            {TEMPLATES.map((tpl) => (
              <button
                key={tpl.name}
                type="button"
                onClick={() => applyTemplate(tpl.text)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-sand-100 hover:bg-sand-200 text-sand-700 border border-sand-200 transition-colors"
              >
                + {tpl.name}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido de la evolución */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-sand-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary-600" />
              Observaciones clínicas y evolución *
            </label>
            <span className="text-[11px] text-sand-400">
              {content.length} caracteres {content.length < 10 && '(mín. 10)'}
            </span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            placeholder="Describí el procedimiento realizado, dosis o unidades aplicadas, zonas anatómicas, tolerancia y pautas post-tratamiento..."
            className="w-full bg-white border border-sand-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 font-sans leading-relaxed"
          />
        </div>

        {error && (
          <Callout intent="error" title="No se pudo registrar la evolución" onClose={() => setError(null)}>
            {error}
          </Callout>
        )}
      </form>
    </Modal>
  );
};
