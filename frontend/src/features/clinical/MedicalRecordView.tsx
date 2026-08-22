import React, { useState, useEffect } from 'react'; // Hooks React
import { clinicalApi, patientsApi } from '../../services/api'; // API services
import { Patient, MedicalRecord, ClinicalEntry } from '../../types'; // Types
import { ShieldCheck, FileText, Plus, Save, AlertTriangle, CheckCircle, Clock, Sliders, History } from 'lucide-react'; // Icons
import { BeforeAfterSlider } from './BeforeAfterSlider'; // Visor comparativo
import { AuditTimelineView } from './AuditTimelineView'; // Línea de tiempo de auditoría

export const MedicalRecordView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'ficha' | 'fotos' | 'auditoria'>('ficha');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
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

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Selector de Paciente y Pestañas Médicas */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Historia Clínica Digital</h2>
            <div className="flex items-center space-x-2 mt-1">
              <button
                onClick={() => setActiveSubTab('ficha')}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${
                  activeSubTab === 'ficha'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Ficha & Evoluciones
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

      {/* SUBPESTAÑA 1: Ficha Anamnesis y Evoluciones */}
      {activeSubTab === 'ficha' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSaveRecord} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 text-base">I. Antecedentes Médicos y Evaluación</h3>
                {saveSuccess && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 mr-1" /> Guardado y Auditado
                  </span>
                )}
              </div>

              {/* Fototipo de Fitzpatrick */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Fototipo de Fitzpatrick (I a VI) *</label>
                <div className="grid grid-cols-6 gap-2">
                  {(['I', 'II', 'III', 'IV', 'V', 'VI'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setRecord({ ...record, fitzpatrickPhototype: type })}
                      className={`py-2 rounded-lg font-bold text-xs transition-all border ${
                        record.fitzpatrickPhototype === type
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Tipo {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Antecedentes Patológicos */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Antecedentes Patológicos</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-700">
                  {[
                    { key: 'hasHta', label: 'Hipertensión (HTA)' },
                    { key: 'hasDbt', label: 'Diabetes (DBT)' },
                    { key: 'hasHypothyroidism', label: 'Hipotiroidismo' },
                    { key: 'hasHyperthyroidism', label: 'Hipertiroidismo' },
                    { key: 'hasAnemia', label: 'Anemia' },
                    { key: 'hasCoagulationDisorders', label: 'Coagulación' },
                    { key: 'hasScarringAlterations', label: 'Cicatrización / Queloide' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center space-x-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <input
                        type="checkbox"
                        checked={(record as any)[item.key] || false}
                        onChange={(e) => setRecord({ ...record, [item.key]: e.target.checked })}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Alergias */}
              <div>
                <label className="block text-xs font-bold text-rose-700 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1 text-rose-600" /> Alergias Conocidas
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs text-slate-700">
                  {[
                    { key: 'allergyAnesthesia', label: 'Anestesia Local' },
                    { key: 'allergyEgg', label: 'Huevo' },
                    { key: 'allergyFish', label: 'Pescado' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center space-x-2 p-2 rounded-lg bg-rose-50/60 border border-rose-100">
                      <input
                        type="checkbox"
                        checked={(record as any)[item.key] || false}
                        onChange={(e) => setRecord({ ...record, [item.key]: e.target.checked })}
                        className="rounded text-rose-600 focus:ring-rose-500"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Plan de Tratamiento */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Diagnóstico y Plan de Tratamiento</label>
                <textarea
                  rows={3}
                  value={record.treatmentPlan || ''}
                  onChange={(e) => setRecord({ ...record, treatmentPlan: e.target.value })}
                  placeholder="Indicar diagnóstico dermatológico y protocolo estético propuesto..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Guardando cambios...' : 'Guardar y Auditar Ficha'}</span>
              </button>
            </form>
          </div>

          {/* Columna Derecha: Evoluciones */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 text-base flex items-center space-x-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <span>Evolución por Sesión</span>
              </h3>

              <div>
                <textarea
                  rows={4}
                  value={newEntryContent}
                  onChange={(e) => setNewEntryContent(e.target.value)}
                  placeholder="Redactar notas de la sesión: unidades inyectadas, zonas tratadas, tolerancia cutánea..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddEntry}
                  disabled={!newEntryContent.trim()}
                  className="mt-2 w-full bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Nota de Evolución</span>
                </button>
              </div>

              <div className="space-y-3 pt-2">
                {entries.map((entry) => (
                  <div key={entry.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <div className="flex justify-between items-center text-slate-400 text-[11px]">
                      <span className="font-semibold text-slate-700">{entry.authorFullName}</span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-800 leading-relaxed">{entry.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBPESTAÑA 2: Visor Fotográfico Antes / Después */}
      {activeSubTab === 'fotos' && (
        <BeforeAfterSlider />
      )}

      {/* SUBPESTAÑA 3: Línea de Tiempo de Auditoría */}
      {activeSubTab === 'auditoria' && (
        <AuditTimelineView />
      )}
    </div>
  );
};
