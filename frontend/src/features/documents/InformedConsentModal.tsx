import React, { useState } from 'react'; // React hooks
import { Printer, X, ShieldAlert, CheckSquare, Square, FileSignature } from 'lucide-react'; // Iconos

interface InformedConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientDni: string;
  treatmentName: string;
  fitzpatrickPhototype: string;
}

/**
 * Modal y documento imprimible de Consentimiento Informado Médico-Legal (Ley 26.529).
 */
export const InformedConsentModal: React.FC<InformedConsentModalProps> = ({
  isOpen,
  onClose,
  patientName,
  patientDni,
  treatmentName,
  fitzpatrickPhototype,
}) => {
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 relative print:p-0 print:shadow-none print:max-w-full">
        {/* Acciones Superiores */}
        <div className="flex justify-between items-center print:hidden border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <FileSignature className="w-5 h-5 text-teal-600" />
            <span className="text-sm font-bold text-slate-800">Consentimiento Informado Médico-Legal</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Documento</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* --- CONTENIDO MÉDICO LEGAL --- */}
        <div className="space-y-4 text-xs text-slate-800 leading-relaxed print:text-black">
          <div className="text-center border-b border-slate-200 pb-3">
            <h2 className="text-base font-extrabold uppercase tracking-tight text-slate-900">
              Documento de Consentimiento Informado para Procedimiento Médico-Estético
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Conforme a la Ley Nacional de Derechos del Paciente N° 26.529 y Resoluciones del Ministerio de Salud
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-2 gap-2 text-xs">
            <div><strong>Paciente:</strong> {patientName}</div>
            <div><strong>D.N.I.:</strong> {patientDni}</div>
            <div><strong>Tratamiento Propuesto:</strong> {treatmentName}</div>
            <div><strong>Fototipo Cutáneo (Fitzpatrick):</strong> Tipo {fitzpatrickPhototype}</div>
            <div><strong>Médica Responsable:</strong> Dra. Valeria Gómez (M.P. 48.912)</div>
            <div><strong>Fecha:</strong> {new Date().toLocaleDateString('es-AR')}</div>
          </div>

          <div className="space-y-2 text-[11px] text-slate-700">
            <p>
              Por medio del presente instrumento, yo, <strong>{patientName}</strong>, declaro haber sido informada/o de manera clara y comprensible por la Dra. Valeria Gómez acerca de los objetivos, alcances, beneficios esperados, alternativas y posibles efectos secundarios inherentes al procedimiento de <strong>{treatmentName}</strong>.
            </p>
            
            <h4 className="font-bold text-slate-900 text-xs pt-1">I. Naturaleza del Procedimiento y Riesgos Informados</h4>
            <p>
              Comprendo que la medicina y la dermatología estética no constituyen ciencias exactas y que los resultados pueden variar según las características cutáneas individuales, fototipo y adherencia a los cuidados post-tratamiento. He sido advertida/o sobre las reacciones transitorias normales, que incluyen:
            </p>
            <ul className="list-disc list-inside pl-2 space-y-0.5 text-slate-600">
              <li>Eritema (enrojecimiento), edema localizado o sensación de calor durante 24 a 72 hs.</li>
              <li>Descamación cutánea leve a moderada en procedimientos de exfoliación química.</li>
              <li>Posibles hematomas puntiformes en zonas de punción.</li>
            </ul>

            <h4 className="font-bold text-slate-900 text-xs pt-1">II. Declaración Jurada de Antecedentes</h4>
            <p>
              Declaro bajo juramento haber manifestado la totalidad de mis antecedentes patológicos (alergias a anestésicos locales, hipertensión, diabetes, embarazo o lactancia, alteraciones de cicatrización o tratamientos estéticos previos), asumiendo la responsabilidad sobre cualquier omisión de datos relevantes para mi seguridad.
            </p>

            <h4 className="font-bold text-slate-900 text-xs pt-1">III. Compromiso de Cuidados Posteriores</h4>
            <p>
              Me comprometo a cumplir estrictamente las indicaciones post-tratamiento, especialmente el uso riguroso de protector solar FPS 50+ cada 3 horas y la abstención de exposición solar directa, saunas y piscinas por el período indicado.
            </p>
          </div>

          {/* Aceptación y Firmas */}
          <div className="pt-4 border-t border-slate-200 space-y-6">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 cursor-pointer print:hidden" onClick={() => setAcceptedTerms(!acceptedTerms)}>
              {acceptedTerms ? (
                <CheckSquare className="w-4 h-4 text-teal-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>He leído, comprendido y acepto los términos del presente consentimiento informado.</span>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8 text-center text-xs">
              <div>
                <div className="border-b border-slate-400 w-48 mx-auto mb-1"></div>
                <p className="font-bold text-slate-800">{patientName}</p>
                <p className="text-[10px] text-slate-500">Firma del Paciente / Representante Legal</p>
                <p className="text-[10px] text-slate-500">DNI: {patientDni}</p>
              </div>

              <div>
                <div className="border-b border-slate-400 w-48 mx-auto mb-1"></div>
                <p className="font-bold text-slate-800">Dra. Valeria Gómez</p>
                <p className="text-[10px] text-slate-500">Médica Dermatóloga · M.P. 48.912</p>
                <p className="text-[10px] text-slate-500">Firma y Sello Profesional</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
