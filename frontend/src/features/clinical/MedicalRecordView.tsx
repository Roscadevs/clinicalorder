import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ShieldCheck, FileText, Clock, FileSignature, Calendar, ArrowLeft, CheckCircle,
  Stethoscope, ChevronRight,
} from 'lucide-react';
import { clinicalApi, patientsApi, appointmentsApi } from '../../services/api';
import { Patient, MedicalRecord, ClinicalEntry, Appointment } from '../../types';
import { Card, Button, Badge, Spinner } from '../../components/ui';
import { AnamnesisForm } from './AnamnesisForm';
import { ClinicalNoteModal } from './ClinicalNoteModal';
import { InformedConsentModal } from '../documents/InformedConsentModal';
import { PatientDirectoryView } from './PatientDirectoryView';
import { PatientSearch } from '../appointments/PatientSearch';
import { getVisualStatus, STATUS_STYLES } from '../agenda/appointmentStatus';
import { isMedicalStaff } from '../../utils/session';
import { cn } from '../../utils/cn';

const TZ = 'America/Argentina/Buenos_Aires';
const fmtDateTime = (iso: string) =>
  new Intl.DateTimeFormat('es-AR', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat('es-AR', { timeZone: TZ, day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso));

const EMPTY_RECORD: Partial<MedicalRecord> = {
  fitzpatrickPhototype: 'III',
  hasHta: false, hasDbt: false, hasHypothyroidism: false, hasHyperthyroidism: false,
  hasAnemia: false, hasAutoimmuneDiseases: false, hasGlaucoma: false,
  hasCoagulationDisorders: false, hasScarringAlterations: false,
  allergyAnesthesia: false, allergyEgg: false, allergyFish: false,
  habitTobacco: false, habitAlcohol: false, habitSunExposure: false, habitSpfUse: true,
  informedConsentSigned: true,
};

type Section = 'ficha' | 'notas';

/**
 * Módulo clínico. Solo el personal médico ve la historia clínica; el resto ve
 * el directorio de pacientes (PatientDirectoryView). El médico ve sus turnos,
 * los atiende, y accede a la HC del paciente (ficha + notas + fotos + auditoría).
 */
export const MedicalRecordView: React.FC = () => {
  // Guard de rol: no-médicos van al directorio de pacientes
  if (!isMedicalStaff()) return <PatientDirectoryView />;
  return <MedicalWorkspace />;
};

const MedicalWorkspace: React.FC = () => {
  const [patient, setPatient] = useState<Patient | null>(null);

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-5">
      <Card>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary-500 text-white flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-sand-900">Módulo médico</h2>
            <p className="text-xs text-sand-500">Turnos, historias clínicas auditadas y fotografías.</p>
          </div>
        </div>
      </Card>

      {patient ? (
        <PatientClinicalRecord patient={patient} onBack={() => setPatient(null)} />
      ) : (
        <TodaysAppointments onOpenPatient={setPatient} />
      )}
    </div>
  );
};

// ── Turnos del médico + búsqueda de paciente ─────────────────────────────────
const TodaysAppointments: React.FC<{ onOpenPatient: (p: Patient) => void }> = ({ onOpenPatient }) => {
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  const load = useCallback(() => {
    setLoading(true);
    const base = new Date(); base.setHours(0, 0, 0, 0);
    const start = base.toISOString();
    const end = new Date(base.getTime() + 86400000).toISOString();
    appointmentsApi.getAgenda(start, end)
      .then((list) => setAppts([...list].sort((a, b) => a.startTime.localeCompare(b.startTime))))
      .catch(() => setAppts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(t); }, []);

  const openPatient = async (a: Appointment) => {
    // Resolvemos el paciente a partir del turno (búsqueda por DNI)
    const found = await patientsApi.getPatients(a.patientDni).catch(() => []);
    const p = found.find((x) => x.id === a.patientId) ?? found[0] ?? {
      id: a.patientId, name: a.patientName, dni: a.patientDni, phone: a.patientPhone, email: '', active: true, createdAt: '',
    };
    onOpenPatient(p);
  };

  const attend = async (a: Appointment) => {
    await appointmentsApi.markAsAttended(a.id);
    load();
  };

  return (
    <>
      <Card>
        <h3 className="font-display font-bold text-sand-900 mb-3 flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-primary-500" /> Buscar paciente
        </h3>
        <PatientSearch onSelect={onOpenPatient} onAddNew={() => undefined} />
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-sand-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary-500" /> Tus turnos de hoy
          </h3>
        </div>

        {loading ? (
          <div className="py-8 flex justify-center"><Spinner label="Cargando turnos" /></div>
        ) : appts.length === 0 ? (
          <p className="text-sm text-sand-500 py-4">No hay turnos agendados para hoy.</p>
        ) : (
          <ul className="space-y-2">
            {appts.map((a) => {
              const vs = getVisualStatus(a, now);
              return (
                <li key={a.id} className={cn('rounded-xl border p-3 flex items-center justify-between gap-3', STATUS_STYLES[vs].card)}>
                  <button onClick={() => openPatient(a)} className="flex-grow text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sand-900 truncate">{a.patientName}</span>
                      <span className="text-xs font-bold text-sand-700 bg-white/70 px-1.5 py-0.5 rounded">{fmtDateTime(a.startTime)}</span>
                    </div>
                    <p className="text-xs text-sand-600 truncate">{a.serviceName}</p>
                  </button>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {a.status === 'CONFIRMED' && (
                      <Button size="sm" variant="success" onClick={() => attend(a)} leftIcon={<CheckCircle className="w-4 h-4" />}>
                        Atender
                      </Button>
                    )}
                    {a.status === 'ATTENDED' && <Badge variant="info">Atendido · a cobrar</Badge>}
                    {a.status === 'COMPLETED' && <Badge variant="success">Cobrado</Badge>}
                    <button onClick={() => openPatient(a)} className="text-primary-600 hover:text-primary-700" aria-label="Abrir historia clínica">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </>
  );
};

// ── Historia clínica del paciente ────────────────────────────────────────────
const PatientClinicalRecord: React.FC<{ patient: Patient; onBack: () => void }> = ({ patient, onBack }) => {
  const [section, setSection] = useState<Section>('ficha');
  const [record, setRecord] = useState<Partial<MedicalRecord>>(EMPTY_RECORD);
  const [entries, setEntries] = useState<ClinicalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [openNote, setOpenNote] = useState<ClinicalEntry | null>(null);
  const [consentOpen, setConsentOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      clinicalApi.getMedicalRecordByPatient(patient.id).catch(() => null),
      clinicalApi.getClinicalEntriesByPatient(patient.id).catch(() => []),
    ]).then(([rec, list]) => {
      setRecord(rec ?? { ...EMPTY_RECORD, patientId: patient.id });
      setEntries(list);
    }).finally(() => setLoading(false));
  }, [patient.id]);

  const activeAllergies = useMemo(() => {
    const list: string[] = [];
    if (record.allergyAnesthesia) list.push('Anestésicos');
    if (record.allergyEgg) list.push('Huevo');
    if (record.allergyFish) list.push('Pescado/Yodo');
    return list;
  }, [record]);

  const SECTIONS: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: 'ficha', label: 'Ficha', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'notas', label: 'Notas clínicas', icon: <Clock className="w-3.5 h-3.5" /> },
  ];

  if (loading) return <Card><div className="py-10 flex justify-center"><Spinner label="Cargando historia clínica" /></div></Card>;

  return (
    <>
      {/* Recuadro con la información básica */}
      <Card className="border-primary-200 bg-primary-50/30">
        <div className="flex items-start justify-between gap-3">
          <div>
            <button onClick={onBack} className="inline-flex items-center gap-1.5 text-xs font-semibold text-sand-500 hover:text-primary-600 mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Volver a turnos
            </button>
            <h3 className="font-display text-xl font-bold text-sand-900">{patient.name}</h3>
            <p className="text-sm text-sand-600">DNI {patient.dni} · {patient.phone}</p>
          </div>
          <div className="text-right space-y-1.5">
            <Badge variant="primary">Fototipo {record.fitzpatrickPhototype ?? '—'}</Badge>
            <div>
              <Button size="sm" variant="secondary" onClick={() => setConsentOpen(true)} leftIcon={<FileSignature className="w-4 h-4" />}>
                Consentimiento
              </Button>
            </div>
          </div>
        </div>
        {activeAllergies.length > 0 && (
          <div className="mt-3 pt-3 border-t border-primary-200/50 text-sm text-danger-700 font-semibold">
            ⚠ Alergias: {activeAllergies.join(', ')}
          </div>
        )}
      </Card>

      {/* Sub-navegación */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={cn(
              'text-xs font-bold px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 flex-shrink-0 min-h-[38px]',
              section === s.id ? 'bg-primary-500 text-white shadow-soft' : 'bg-sand-100 text-sand-600 hover:bg-sand-200'
            )}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {section === 'ficha' && (
        <Card>
          <AnamnesisForm patientId={patient.id} record={record} onChange={setRecord} />
        </Card>
      )}

      {section === 'notas' && (
        <Card>
          <h3 className="font-display font-bold text-sand-900 mb-1">Notas clínicas</h3>
          <p className="text-xs text-sand-500 mb-4">
            Seleccioná una nota para ver su contenido y las fotos asociadas. Las notas se pueden editar, no eliminar.
          </p>
          {entries.length === 0 ? (
            <p className="text-sm text-sand-500 py-4">Este paciente no tiene notas clínicas registradas.</p>
          ) : (
            <ul className="divide-y divide-sand-100">
              {entries.map((e) => (
                <li key={e.id}>
                  <button
                    onClick={() => setOpenNote(e)}
                    className="w-full text-left py-3 flex items-center justify-between gap-3 hover:bg-sand-50 rounded-lg px-2 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-sand-900 truncate">{e.serviceName || 'Nota de evolución'}</p>
                      <p className="text-xs text-sand-500">{fmtDate(e.createdAt)} · {e.authorFullName}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-sand-400 flex-shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      <ClinicalNoteModal
        entry={openNote}
        patientId={patient.id}
        onClose={() => setOpenNote(null)}
        onSaved={(updated) => {
          setEntries((prev) => prev.map((e) => (e.id === updated.id ? { ...e, ...updated } : e)));
          setOpenNote(null);
        }}
      />

      <InformedConsentModal
        isOpen={consentOpen}
        onClose={() => setConsentOpen(false)}
        patientName={patient.name}
        patientDni={patient.dni}
        treatmentName="Procedimientos estéticos"
        fitzpatrickPhototype={record.fitzpatrickPhototype || 'III'}
      />
    </>
  );
};
