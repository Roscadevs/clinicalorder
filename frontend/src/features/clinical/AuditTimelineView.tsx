import React, { useState, useEffect } from 'react'; // React hooks
import { History, ShieldAlert, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'; // Iconos
import { clinicalApi } from '../../services/api'; // API services
import { ClinicalAuditLog } from '../../types'; // Types

export const AuditTimelineView: React.FC = () => {
  const [logs, setLogs] = useState<ClinicalAuditLog[]>([]);
  const [expandedLogId, setExpandedLogId] = useState<number | null>(null);

  useEffect(() => {
    clinicalApi.getAuditLogs().then(setLogs).catch(console.error);
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex justify-between items-start border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold shadow-sm">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Línea de Tiempo de Auditoría Médico-Legal (Inmutable)
            </h3>
            <p className="text-xs text-slate-500">
              Registro criptográfico y cronológico de cada modificación en historias clínicas.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold border border-emerald-200">
          🔒 Integridad Garantizada
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {logs.map((log) => {
          const isExpanded = expandedLogId === log.id;
          return (
            <div key={log.id} className="relative group">
              {/* Indicador en la línea de tiempo */}
              <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full border-2 border-white bg-teal-600 shadow-sm ring-4 ring-teal-100"></div>

              <div className="bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{log.modifiedByFullName}</span>
                    <span className="text-slate-400">·</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-100 text-teal-800">
                      {log.action}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] font-mono">
                    {new Date(log.timestamp).toLocaleString('es-AR')} · IP: {log.ipAddress}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-slate-600 font-medium">
                    Historia Clínica #{log.medicalRecordId} · Razón: {log.reason || 'Actualización de ficha médica post-consulta'}
                  </p>
                  <button
                    onClick={() => toggleExpand(log.id)}
                    className="text-teal-600 hover:text-teal-800 text-xs font-bold flex items-center space-x-1"
                  >
                    <span>{isExpanded ? 'Ocultar Diferencias' : 'Ver Comparativa JSON'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Vista Comparativa de Diferencias (Diff) */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono">
                    <div className="bg-rose-50/70 border border-rose-200 p-3 rounded-xl">
                      <span className="font-bold text-rose-800 uppercase block mb-1">
                        [-] Snapshot Previo (Estado Anterior)
                      </span>
                      <pre className="text-rose-950 overflow-x-auto whitespace-pre-wrap">
                        {log.previousStateJson ? JSON.stringify(log.previousStateJson, null, 2) : '/* Registro Inicial / Sin Estado Previo */'}
                      </pre>
                    </div>

                    <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-xl">
                      <span className="font-bold text-emerald-800 uppercase block mb-1">
                        [+] Snapshot Nuevo (Estado Auditado)
                      </span>
                      <pre className="text-emerald-950 overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(log.newStateJson, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
