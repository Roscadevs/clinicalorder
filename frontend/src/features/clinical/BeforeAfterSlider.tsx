import React, { useState } from 'react'; // React hooks
import { Sliders } from 'lucide-react'; // Iconos

interface BeforeAfterSliderProps {
  beforeImage?: string;
  afterImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage = 'https://images.unsplash.com/photo-1512290900672-1f486cf81f72?auto=format&fit=crop&w=800&q=80',
  afterImage = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  beforeLabel = 'Antes del Procedimiento (Día 1)',
  afterLabel = 'Resultado Post-Tratamiento (Día 30)',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number, rect: DOMRect) => {
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pos);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.touches[0].clientX, rect);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleMove(e.clientX, rect);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-teal-600" />
            <span>Visor Comparativo Clínico "Antes y Después"</span>
          </h3>
          <p className="text-xs text-slate-500">
            Desliza el divisor central para contrastar la evolución estética de la paciente.
          </p>
        </div>
        <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
          Posición: {Math.round(sliderPosition)}%
        </span>
      </div>

      {/* Contenedor del Slider */}
      <div
        className="relative w-full aspect-[4/3] max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-md select-none cursor-ew-resize border border-slate-200"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* Imagen DESPUÉS (Fondo completo) */}
        <img
          src={afterImage}
          alt="Post-tratamiento"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-3 right-3 bg-teal-900/80 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow">
          {afterLabel}
        </div>

        {/* Imagen ANTES (Recortada por el ancho del slider) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt="Pre-tratamiento"
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow">
            {beforeLabel}
          </div>
        </div>

        {/* Línea Divisoria Vertical con Deslizador */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize flex items-center justify-center"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="w-8 h-8 rounded-full bg-white text-slate-800 shadow-xl flex items-center justify-center border-2 border-teal-600 ring-2 ring-white/50">
            <Sliders className="w-4 h-4 text-teal-600 rotate-90" />
          </div>
        </div>
      </div>
    </div>
  );
};
