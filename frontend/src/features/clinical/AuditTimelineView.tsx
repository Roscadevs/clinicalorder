import React from 'react'; // React hooks
import { History, ShieldCheck, User, Calendar, ArrowRight, AlertCircle } from 'lucide-react'; // Iconos

export interface AuditRecord {
  id: number;
  changedAt: string;
  authorFullName: string;
  action: 'CREATION' | 'UPDATE' | 'DELETE';
  previousDataJson?: string;
  newDataJson: string;
}

interface AuditTimelineViewProps {
  auditRecords?: AuditRecord[];
}

/**
 * Componente visual para la Línea de Tiempo de Auditoría Médica Inmutable.
 */
export const AuditTimelineView: React.FC<AuditTimelineViewProps> = ({
  auditRecords = [
    {
      id: 1,
      changedAt: '2026-08-22T14:30:00Z',
      authorFullName: 'Dra. Valeria Gómez',
      action: 'UPDATE',
      previousDataJson: '{"hasHta": false, "fitzpatrickPhototype": "III", "treatmentPlan": "Evaluación preliminar"}',
      newDataJson: '{"hasHta": true, "fitzpatrickPhototype": "III", "treatmentPlan": "Protocolo de 3 sesiones de Peeling Ácido Mandélico + Retinol"}',
    },
    {
      id: 2,
      changedAt: '2026-08-15T10:15:00Z',
      authorFullName: 'Dra. Valeria Gómez',
      action: 'CREATION',
      previousDataJson: undefined,
      newDataJson: '{"hasHta": false, "fitzpatrickPhototype": "III", "informedConsentSigned": true}',
    },
  ],
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-teal-600" />
          <h3 className="font-bold text-slate-800 text-base">Trazabilidad & Auditoría Médico-Legal</h3>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center">
          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
          Registros Inmutables (PostgreSQL)
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {auditRecords.map((item) => (
          <div key={item.id} className="relative group">
            {/* Punto en la línea de tiempo */}
            <div className="absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-teal-600 shadow-sm"></div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      item.action === 'CREATION'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.action === 'CREATION' ? 'Alta Inicial' : 'Modificación'}
                  </span>
                  <span className="font-semibold text-slate-700 flex items-center">
                    <User className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {item.authorFullName}
                  </span>
                </div>
                <span className="text-slate-400 flex items-center text-[11px]">
                  <Calendar className="w-3.5 h-3.5 mr-1" />
                  {new Date(item.changedAt).toLocaleString()}
                </span>
              </div>

              {/* Diffs comparativos si hubo cambio */}
              {item.previousDataJson && (
                <div className="space-y-1.5 pt-1 text-xs">
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-900 font-mono text-[11px] break-all">
                    <span className="font-bold text-rose-700 block mb-0.5">Valores Anteriores:</span>
                    {item.previousDataJson}
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-900 font-mono text-[11px] break-all">
                    <span className="font-bold text-emerald-700 block mb-0.5">Valores Nuevos Actualizados:</span>
                    {item.newDataJson}
                  </div>
                </div>
              )}

              {!item.previousDataJson && (
                <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-blue-900 font-mono text-[11px] break-all">
                  <span className="font-bold text-blue-700 block mb-0.5">Snapshot Inicial Registrado:</span>
                  {item.newDataJson}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
