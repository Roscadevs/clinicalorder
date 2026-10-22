import React, { useState } from 'react';
import type { FallbackProps } from 'react-error-boundary';
import {
  RefreshCw,
  Home,
  MessageCircle,
  Copy,
  Check,
  ChevronDown,
  HeartHandshake,
} from 'lucide-react';
import { whatsappLink } from '../config/contact';

export interface HumanFriendlyErrorFallbackProps extends FallbackProps {
  moduleTitle?: string;
  supportPhone?: string;
}

/**
 * Pantalla / Fallback de error amable, empático y resolutivo.
 * Respeta la paleta cálida (sand, primary, danger terracota) y oculta
 * los detalles técnicos dentro de un acordeón colapsado.
 */
export const HumanFriendlyErrorFallback: React.FC<HumanFriendlyErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  moduleTitle = 'esta sección',
}) => {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const errorReport = {
    modulo: moduleTitle,
    mensaje: error instanceof Error ? error.message : String(error),
    ruta: typeof window !== 'undefined' ? window.location.pathname : '',
    fecha: new Date().toISOString(),
    stack: error instanceof Error ? error.stack?.split('\n').slice(0, 4).join('\n') : undefined,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const rawWhatsappMsg = `Hola Soporte de la Clínica, se presentó un inconveniente en ${moduleTitle}.\nDetalle: ${
    error instanceof Error ? error.message : 'Error inesperado'
  }\nHora: ${new Date().toLocaleTimeString()}`;

  return (
    <div className="w-full max-w-2xl mx-auto my-8 p-6 sm:p-8 bg-sand-50 border border-sand-300 rounded-3xl shadow-card text-sand-900 font-sans transition-all">
      {/* Cabecera empática */}
      <div className="flex items-start gap-4 mb-5">
        <div className="w-12 h-12 rounded-2xl bg-danger-50 border border-danger-100 flex items-center justify-center text-danger shrink-0 shadow-soft">
          <HeartHandshake className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-display text-sand-900 font-bold tracking-tight">
            Tuvimos un inconveniente al cargar {moduleTitle}
          </h2>
          <p className="text-sm text-sand-600 mt-1 leading-relaxed">
            Tus datos e historial clínico se encuentran a salvo. La aplicación registró la incidencia para revisarla.
          </p>
        </div>
      </div>

      <div className="p-4 bg-white/80 border border-sand-200 rounded-2xl text-xs sm:text-sm text-sand-700 mb-6 leading-relaxed">
        Esto puede deberse a una intermitencia temporal en la red o a una sincronización en curso. Puedes intentar recargar esta vista o regresar a la pantalla principal sin ningún riesgo.
      </div>

      {/* Botones de acción principales */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          type="button"
          onClick={resetErrorBoundary}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-semibold hover:bg-primary-600 active:scale-95 transition-all shadow-soft"
        >
          <RefreshCw className="w-4 h-4" />
          Reintentar ahora
        </button>

        <a
          href="/"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sand-200 hover:bg-sand-300 text-sand-800 text-xs sm:text-sm font-medium transition-colors"
        >
          <Home className="w-4 h-4" />
          Volver al Inicio
        </a>

        <a
          href={whatsappLink(rawWhatsappMsg)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-success-50 hover:bg-success-100 text-success-700 text-xs sm:text-sm font-medium transition-colors sm:ml-auto"
        >
          <MessageCircle className="w-4 h-4 text-success" />
          Asistencia WhatsApp
        </a>
      </div>

      {/* Acordeón cerrado para detalles técnicos */}
      <div className="border-t border-sand-200 pt-4">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center justify-between w-full text-xs font-semibold text-sand-500 hover:text-sand-800 transition-colors py-1 cursor-pointer"
        >
          <span>Información de diagnóstico (para soporte técnico)</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              showDetails ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showDetails && (
          <div className="mt-3 space-y-2">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl bg-white border border-sand-300 text-sand-700 hover:bg-sand-100 transition-colors shadow-soft"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-success" />
                    <span className="text-success font-medium">¡Copiado al portapapeles!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar reporte de diagnóstico</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3.5 bg-sand-900 text-sand-100 rounded-2xl text-xs font-mono overflow-x-auto max-h-40 leading-relaxed border border-sand-800 whitespace-pre-wrap">
              {JSON.stringify(errorReport, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
