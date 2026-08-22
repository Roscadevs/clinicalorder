import React, { useState, useEffect } from 'react'; // Hooks React
import { clinicalApi, patientsApi } from '../../services/api'; // API services
import { Patient, MedicalRecord, ClinicalEntry } from '../../types'; // Types
import { ShieldCheck, FileText, Plus, Save, AlertTriangle, CheckCircle, Clock, Sliders, History, FileSignature, Calendar } from 'lucide-react'; // Icons
import { BeforeAfterSlider } from './BeforeAfterSlider'; // Visor comparativo
import { AuditTimelineView } from './AuditTimelineView'; // Línea de tiempo de auditoría
import { InformedConsentModal } from '../documents/InformedConsentModal'; // Consentimiento informado
import { PhysicianCalendarView } from './PhysicianCalendarView'; // Calendario médico

export const MedicalRecordView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'calendario' | 'ficha' | 'fotos' | 'auditoria'>('calendario');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const [record, setRecord] = useState<Partial<MedicalRecord>>({
    fitzpatrickPhototype: 'III',
    hasHta: false,
    hasDbt: false,
    hasHypothyroidism: false,
    hasHyperthyroidism: false,
    hasAnemia: false,
    hasAutoimmuneDiseases: false,
    hasGlaucoma: false,
    hasCoagulationDisorders: false,
    hasScarringAlterations: false,
    allergyAnesthesia: false,
    allergyEgg: false,
    allergyFish: false,
    habitTobacco: false,
    habitAlcohol: false,
    habitSunExposure: false,
    habitSpfUse: true,
    informedConsentSigned: true,
  });
  const [entries, setEntries] = useState<ClinicalEntry[]>([]);
  const [newEntryContent, setNewEntryContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    patientsApi.getPatients().then((list) => {
      setPatients(list);
      if (list.length > 0) setSelectedPatientId(list[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedPatientId) return;
    clinicalApi.getMedicalRecordByPatient(selectedPatientId).then((rec) => {
      if (rec) {
        setRecord(rec);
        clinicalApi.getClinicalEntries(rec.id).then(setEntries);
      } else {
        setEntries([]);
      }
    });
  }, [selectedPatientId]);

  const handleSaveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) return;
    setIsSaving(true);
    try {
      const saved = await clinicalApi.saveMedicalRecord(selectedPatientId, record, 2); // 2 = Dra. Valeria
      setRecord(saved);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Error al guardar historia clínica.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddEntry = async () => {
    if (!record.id || !newEntryContent.trim()) return;
    try {
      const newEntry = await clinicalApi.addClinicalEntry(record.id, 1, newEntryContent, 2);
      setEntries([newEntry, ...entries]);
      setNewEntryContent('');
    } catch (err) {
      alert('Error al guardar evolución clínica.');
    }
  };

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Selector de Paciente y Pestañas Médicas */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Módulo Médico · Dra. Valeria Gómez</h2>
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              <button
                onClick={() => setActiveSubTab('calendario')}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors flex items-center space-x-1 ${
                  activeSubTab === 'calendario'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Calendario de Turnos</span>
              </button>
              <button
                onClick={() => setActiveSubTab('ficha')}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors flex items-center space-x-1 ${
                  activeSubTab === 'ficha'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Ficha & Evoluciones</span>
              </button>
              <button
                onClick={() => setActiveSubTab('fotos')}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors flex items-center space-x-1 ${
                  activeSubTab === 'fotos'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Antes / Después</span>
              </button>
              <button
                onClick={() => setActiveSubTab('auditoria')}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors flex items-center space-x-1 ${
                  activeSubTab === 'auditoria'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Auditoría Legal</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setConsentModalOpen(true)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1.5 transition-colors border border-slate-300"
          >
            <FileSignature className="w-4 h-4 text-teal-600" />
            <span>Consentimiento Informado</span>
          </button>

          <div className="flex items-center space-x-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Paciente:</label>
            <select
              value={selectedPatientId || ''}
              onChange={(e) => setSelectedPatientId(Number(e.target.value))}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-teal-500 outline-none"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (DNI: {p.dni})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SUBPESTAÑA 0: Calendario Semanal Médico */}
      {activeSubTab === 'calendario' && (
        <PhysicianCalendarView
          onSelectPatient={(patientId) => {
            setSelectedPatientId(patientId);
            setActiveSubTab('ficha');
          }}
          onOpenPhotos={(patientId) => {
            setSelectedPatientId(patientId);
            setActiveSubTab('fotos');
          }}
          onOpenConsent={() => setConsentModalOpen(true)}
        />
      )}

      {/* SUBPESTAÑA 1: Ficha Anamnesis y Evoluciones */}
      {activeSubTab === 'ficha' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Izquierda / Central: Formulario Anamnesis */}
          <form onSubmit={handleSaveRecord} className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-teal-600" />
                  <span>Anamnesis & Antecedentes ({selectedPatient?.name})</span>
                </h3>
                {saveSuccess && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>¡Guardado y Auditado!</span>
                  </span>
                )}
              </div>

              {/* Fototipo Cutáneo de Fitzpatrick */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Fototipo Cutáneo (Escala Fitzpatrick)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {(['I', 'II', 'III', 'IV', 'V', 'VI'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setRecord({ ...record, fitzpatrickPhototype: type })}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                        record.fitzpatrickPhototype === type
                          ? 'border-teal-600 bg-teal-50 text-teal-800 ring-2 ring-teal-500/20'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Tipo {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Antecedentes Patológicos (Booleans atómicos) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Antecedentes Patológicos
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  {[
                    { key: 'hasHta', label: 'Hipertensión (HTA)' },
                    { key: 'hasDbt', label: 'Diabetes (DBT)' },
                    { key: 'hasHypothyroidism', label: 'Hipotiroidismo' },
                    { key: 'hasHyperthyroidism', label: 'Hipertiroidismo' },
                    { key: 'hasAnemia', label: 'Anemia' },
                    { key: 'hasAutoimmuneDiseases', label: 'Enf. Autoinmune' },
                    { key: 'hasGlaucoma', label: 'Glaucoma' },
                    { key: 'hasCoagulationDisorders', label: 'Trast. Coagulación' },
                    { key: 'hasScarringAlterations', label: 'Queloides / Cicatrización' },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100/60"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(record[item.key as keyof MedicalRecord])}
                        onChange={(e) => setRecord({ ...record, [item.key]: e.target.checked })}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span className="font-medium text-slate-700">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Alergias */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-rose-700 flex items-center">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Alergias Conocidas
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { key: 'allergyAnesthesia', label: 'Anestésicos (Lidocaína)' },
                    { key: 'allergyEgg', label: 'Huevo / Derivados' },
                    { key: 'allergyFish', label: 'Pescado / Yodo' },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-center space-x-2 bg-rose-50/60 p-2 rounded-lg border border-rose-200 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(record[item.key as keyof MedicalRecord])}
                        onChange={(e) => setRecord({ ...record, [item.key]: e.target.checked })}
                        className="rounded text-rose-600 focus:ring-rose-500"
                      />
                      <span className="font-semibold text-rose-900">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Plan de Tratamiento Indicado */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Plan de Tratamiento & Protocolo Clínico
                </label>
                <textarea
                  rows={3}
                  value={record.treatmentPlan || ''}
                  onChange={(e) => setRecord({ ...record, treatmentPlan: e.target.value })}
                  placeholder="Ej. Protocolo de 3 sesiones de Peeling Mandélico 30%..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center space-x-2 shadow-sm transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Guardando en BD...' : 'Guardar y Auditar Ficha'}</span>
                </button>
              </div>
            </div>
          </form>

          {/* Columna Derecha: Notas de Evolución Cronológicas */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Notas de Evolución Médica</span>
              </h3>

              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={newEntryContent}
                  onChange={(e) => setNewEntryContent(e.target.value)}
                  placeholder="Nueva nota de evolución (dosis, unidades de toxina, técnica utilizada)..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <button
                  onClick={handleAddEntry}
                  disabled={!newEntryContent.trim()}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar Nota de Evolución</span>
                </button>
              </div>

              <div className="space-y-3 pt-2 max-h-[380px] overflow-y-auto pr-1">
                {entries.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No hay evoluciones previas registradas.</p>
                ) : (
                  entries.map((entry) => (
                    <div key={entry.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                        <span>{entry.authorFullName}</span>
                        <span>{new Date(entry.createdAt).toLocaleDateString('es-AR')}</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed font-medium">{entry.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBPESTAÑA 2: Visor Comparativo Antes / Después */}
      {activeSubTab === 'fotos' && <BeforeAfterSlider />}

      {/* SUBPESTAÑA 3: Auditoría Legal Inmutable */}
      {activeSubTab === 'auditoria' && <AuditTimelineView />}

      {/* Modal de Consentimiento Informado Imprimible */}
      {selectedPatient && (
        <InformedConsentModal
          isOpen={consentModalOpen}
          onClose={() => setConsentModalOpen(false)}
          patientName={selectedPatient.name}
          patientDni={selectedPatient.dni}
          treatmentName="Peeling Químico Facial y Procedimientos Estéticos"
          fitzpatrickPhototype={record.fitzpatrickPhototype || 'III'}
        />
      )}
    </div>
  );
};
