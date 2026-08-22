import React, { useState } from 'react'; // React hooks
import { Sliders, Sparkles, Image as ImageIcon } from 'lucide-react'; // Iconos

interface BeforeAfterSliderProps {
  beforeImageUrl?: string; // URL de la fotografía inicial (Antes)
  afterImageUrl?: string; // URL de la fotografía posterior (Después)
  beforeLabel?: string; // Etiqueta descriptiva previa
  afterLabel?: string; // Etiqueta descriptiva posterior
}

/**
 * Componente interactivo para comparar fotografías médicas y estéticas (Antes vs Después)
 * mediante un divisor deslizante horizontal.
 */
export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImageUrl = 'https://images.unsplash.com/photo-1512290900672-1f486ecba717?auto=format&fit=crop&w=600&q=80',
  afterImageUrl = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
  beforeLabel = 'Antes del Tratamiento (Sesión Inicial)',
  afterLabel = 'Después del Tratamiento (Semana 4)',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50); // Posición porcentual del separador (0 a 100)

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sliders className="w-5 h-5 text-teal-600" />
          <h3 className="font-bold text-slate-800 text-base">Comparativa Clínica: Antes y Después</h3>
        </div>
        <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
          Desliza para contrastar resultados
        </span>
      </div>

      {/* Contenedor del Visor Deslizante */}
      <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden select-none shadow-inner border border-slate-200 bg-slate-900">
        {/* Imagen del 'DESPUÉS' (Capa de Fondo) */}
        <img
          src={afterImageUrl}
          alt="Foto Después"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-teal-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm border border-teal-500/30">
          ✨ {afterLabel}
        </div>

        {/* Imagen del 'ANTES' (Capa Superior Recortada con Clip-Path) */}
        <div
          className="absolute top-0 left-0 h-full overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImageUrl}
            alt="Foto Antes"
            className="absolute top-0 left-0 w-full h-full object-cover max-w-none"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm border border-slate-700/50">
            ⏳ {beforeLabel}
          </div>
        </div>

        {/* Línea Divisoria y Control Deslizante */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20 flex items-center justify-center pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="w-8 h-8 rounded-full bg-white text-slate-800 shadow-xl border-2 border-teal-600 flex items-center justify-center text-xs font-black">
            ⇄
          </div>
        </div>

        {/* Input invisible de rango para controlar el slider */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={handleSliderChange}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-ew-resize z-30"
          aria-label="Deslizador comparativo de fotografía médica"
        />
      </div>

      <div className="flex justify-between text-xs text-slate-500 pt-1">
        <span className="font-semibold text-slate-700">Estado Previo</span>
        <span className="font-semibold text-teal-700">Resultado Obtenido</span>
      </div>
    </div>
  );
};
